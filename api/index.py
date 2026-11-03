"""
Core AI Chatbot API — FastAPI backend with Mistral AI integration.
Serves as both the local development server and the Vercel serverless function.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional
import json
import logging
import os
import sqlite3
import uuid

import aiosqlite
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_API_URL = os.getenv(
    "MISTRAL_API_URL", "https://api.mistral.ai/v1/chat/completions"
)
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")
DATABASE_PATH = os.getenv("DATABASE_PATH", "chatbot.db")

_db_ready: Optional[bool] = None
_mem: dict = {}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def _init_db() -> None:
    global _db_ready
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute("PRAGMA journal_mode=WAL")
            await db.execute("PRAGMA foreign_keys=ON")
            await db.execute(
                "CREATE TABLE IF NOT EXISTS conversations ("
                "  id TEXT PRIMARY KEY,"
                "  title TEXT NOT NULL DEFAULT 'New Chat',"
                "  created_at TEXT NOT NULL,"
                "  updated_at TEXT NOT NULL"
                ")"
            )
            await db.execute(
                "CREATE TABLE IF NOT EXISTS messages ("
                "  id TEXT PRIMARY KEY,"
                "  conversation_id TEXT NOT NULL"
                "    REFERENCES conversations(id) ON DELETE CASCADE,"
                "  role TEXT NOT NULL,"
                "  content TEXT NOT NULL,"
                "  created_at TEXT NOT NULL"
                ")"
            )
            await db.execute(
                "CREATE INDEX IF NOT EXISTS idx_msg_conv "
                "ON messages(conversation_id, created_at)"
            )
            await db.commit()
        _db_ready = True
        logger.info("SQLite database ready at %s", DATABASE_PATH)
    except Exception as exc:
        logger.warning(
            "SQLite unavailable (%s) — using in-memory storage", exc
        )
        _db_ready = False


async def _ensure_db() -> None:
    if _db_ready is None:
        await _init_db()


async def list_conversations() -> list:
    await _ensure_db()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = sqlite3.Row
            cur = await db.execute(
                "SELECT c.id, c.title, c.created_at, c.updated_at, "
                "(SELECT COUNT(*) FROM messages m "
                " WHERE m.conversation_id = c.id) AS message_count "
                "FROM conversations c ORDER BY c.updated_at DESC"
            )
            return [dict(r) for r in await cur.fetchall()]
    result = []
    for cid, d in _mem.items():
        result.append(
            {
                "id": cid,
                "title": d["title"],
                "created_at": d["created_at"],
                "updated_at": d["updated_at"],
                "message_count": len(d.get("messages", [])),
            }
        )
    result.sort(key=lambda x: x["updated_at"], reverse=True)
    return result


async def create_conversation(title: str = "New Chat") -> dict:
    await _ensure_db()
    cid = str(uuid.uuid4())
    now = _now()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute(
                "INSERT INTO conversations (id, title, created_at, updated_at) "
                "VALUES (?, ?, ?, ?)",
                (cid, title, now, now),
            )
            await db.commit()
    else:
        _mem[cid] = {
            "title": title,
            "messages": [],
            "created_at": now,
            "updated_at": now,
        }
    return {"id": cid, "title": title, "created_at": now}


async def get_conversation(cid: str) -> Optional[dict]:
    await _ensure_db()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = sqlite3.Row
            cur = await db.execute(
                "SELECT * FROM conversations WHERE id = ?", (cid,)
            )
            row = await cur.fetchone()
            if not row:
                return None
            conv = dict(row)
            cur2 = await db.execute(
                "SELECT role, content, created_at AS timestamp "
                "FROM messages WHERE conversation_id = ? ORDER BY created_at",
                (cid,),
            )
            conv["messages"] = [dict(r) for r in await cur2.fetchall()]
            return conv
    if cid not in _mem:
        return None
    d = _mem[cid]
    return {"id": cid, **d}


async def update_conversation_title(cid: str, title: str) -> Optional[dict]:
    await _ensure_db()
    now = _now()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            cur = await db.execute(
                "UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?",
                (title, now, cid),
            )
            await db.commit()
            if cur.rowcount == 0:
                return None
            return {"id": cid, "title": title}
    if cid not in _mem:
        return None
    _mem[cid]["title"] = title
    _mem[cid]["updated_at"] = now
    return {"id": cid, "title": title}


async def delete_conversation_by_id(cid: str) -> bool:
    await _ensure_db()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute("PRAGMA foreign_keys=ON")
            cur = await db.execute(
                "DELETE FROM conversations WHERE id = ?", (cid,)
            )
            await db.commit()
            return cur.rowcount > 0
    if cid in _mem:
        del _mem[cid]
        return True
    return False


async def add_message(cid: str, role: str, content: str) -> None:
    await _ensure_db()
    now = _now()
    mid = str(uuid.uuid4())
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute(
                "INSERT INTO messages "
                "(id, conversation_id, role, content, created_at) "
                "VALUES (?, ?, ?, ?, ?)",
                (mid, cid, role, content, now),
            )
            await db.execute(
                "UPDATE conversations SET updated_at = ? WHERE id = ?",
                (now, cid),
            )
            await db.commit()
    else:
        if cid in _mem:
            _mem[cid]["messages"].append(
                {"role": role, "content": content, "timestamp": now}
            )
            _mem[cid]["updated_at"] = now


async def get_messages(cid: str) -> list:
    await _ensure_db()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = sqlite3.Row
            cur = await db.execute(
                "SELECT role, content, created_at AS timestamp "
                "FROM messages WHERE conversation_id = ? ORDER BY created_at",
                (cid,),
            )
            return [dict(r) for r in await cur.fetchall()]
    if cid in _mem:
        return _mem[cid]["messages"]
    return []


async def clear_messages(cid: str) -> bool:
    await _ensure_db()
    if _db_ready:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = sqlite3.Row
            cur = await db.execute(
                "SELECT id FROM conversations WHERE id = ?", (cid,)
            )
            if not await cur.fetchone():
                return False
            await db.execute(
                "DELETE FROM messages WHERE conversation_id = ?", (cid,)
            )
            await db.execute(
                "UPDATE conversations SET updated_at = ? WHERE id = ?",
                (_now(), cid),
            )
            await db.commit()
            return True
    if cid in _mem:
        _mem[cid]["messages"] = []
        _mem[cid]["updated_at"] = _now()
        return True
    return False


async def ensure_conversation(
    cid: Optional[str], first_message: str
) -> str:
    if cid:
        conv = await get_conversation(cid)
        if conv is not None:
            return cid
    title = (
        (first_message[:50] + "...") if len(first_message) > 50 else first_message
    )
    result = await create_conversation(title)
    return result["id"]


# --- Pydantic models ---


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    system_prompt: Optional[str] = (
        "You are a helpful AI assistant. You are knowledgeable, helpful, "
        "and provide accurate, well-structured responses."
    )
    max_tokens: Optional[int] = 4096
    temperature: Optional[float] = 0.7


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"


class ConversationUpdate(BaseModel):
    title: str


# --- App ---


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await _init_db()
    yield


app = FastAPI(title="Core AI Chatbot API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Endpoints ---


@app.get("/")
async def root():
    return {"status": "ok", "message": "Core AI Chatbot API"}


@app.get("/health")
async def health():
    await _ensure_db()
    return {
        "status": "ok",
        "storage": "sqlite" if _db_ready else "memory",
        "mistral_configured": bool(MISTRAL_API_KEY),
    }


@app.get("/conversations")
async def api_list_conversations():
    return await list_conversations()


@app.post("/conversations")
async def api_create_conversation(data: ConversationCreate):
    return await create_conversation(data.title or "New Chat")


@app.get("/conversations/{conversation_id}")
async def api_get_conversation(conversation_id: str):
    conv = await get_conversation(conversation_id)
    if not conv:
        raise HTTPException(404, "Conversation not found")
    return conv


@app.put("/conversations/{conversation_id}")
async def api_update_conversation(
    conversation_id: str, data: ConversationUpdate
):
    result = await update_conversation_title(conversation_id, data.title)
    if not result:
        raise HTTPException(404, "Conversation not found")
    return result


@app.delete("/conversations/{conversation_id}")
async def api_delete_conversation(conversation_id: str):
    if not await delete_conversation_by_id(conversation_id):
        raise HTTPException(404, "Conversation not found")
    return {"message": "Conversation deleted"}


@app.post("/conversations/{conversation_id}/clear")
async def api_clear_conversation(conversation_id: str):
    if not await clear_messages(conversation_id):
        raise HTTPException(404, "Conversation not found")
    return {"message": "Conversation cleared"}


@app.post("/chat")
async def chat(request: ChatRequest):
    if not MISTRAL_API_KEY:
        raise HTTPException(500, "MISTRAL_API_KEY not configured")

    conv_id = await ensure_conversation(
        request.conversation_id, request.message
    )
    await add_message(conv_id, "user", request.message)

    history = await get_messages(conv_id)
    messages = [{"role": "system", "content": request.system_prompt}]
    for m in history:
        messages.append({"role": m["role"], "content": m["content"]})

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                MISTRAL_API_URL,
                headers={
                    "Authorization": f"Bearer {MISTRAL_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MISTRAL_MODEL,
                    "messages": messages,
                    "temperature": request.temperature,
                    "max_tokens": request.max_tokens,
                },
            )
            if resp.status_code != 200:
                raise HTTPException(resp.status_code, resp.text)
            data = resp.json()
    except httpx.HTTPError as exc:
        raise HTTPException(500, f"Mistral API error: {exc}")

    content = data["choices"][0]["message"]["content"]
    await add_message(conv_id, "assistant", content)

    return {
        "conversation_id": conv_id,
        "message": {
            "role": "assistant",
            "content": content,
            "timestamp": _now(),
        },
        "usage": data.get("usage", {}),
    }


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    if not MISTRAL_API_KEY:
        raise HTTPException(500, "MISTRAL_API_KEY not configured")

    conv_id = await ensure_conversation(
        request.conversation_id, request.message
    )
    await add_message(conv_id, "user", request.message)

    history = await get_messages(conv_id)
    messages = [{"role": "system", "content": request.system_prompt}]
    for m in history:
        messages.append({"role": m["role"], "content": m["content"]})

    async def generate():
        full_response = ""
        try:
            yield f"data: {json.dumps({'type': 'conversation_id', 'id': conv_id})}\n\n"

            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    MISTRAL_API_URL,
                    headers={
                        "Authorization": f"Bearer {MISTRAL_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": MISTRAL_MODEL,
                        "messages": messages,
                        "temperature": request.temperature,
                        "max_tokens": request.max_tokens,
                        "stream": True,
                    },
                ) as resp:
                    if resp.status_code != 200:
                        body = await resp.aread()
                        yield (
                            f"data: {json.dumps({'type': 'error', 'message': body.decode()})}\n\n"
                        )
                        return

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        payload = line[6:].strip()
                        if payload == "[DONE]":
                            break
                        try:
                            chunk = json.loads(payload)
                            choices = chunk.get("choices", [])
                            if choices:
                                delta = choices[0].get("delta", {})
                                if "content" in delta:
                                    text = delta["content"]
                                    full_response += text
                                    yield f"data: {json.dumps({'type': 'content', 'text': text})}\n\n"
                        except (json.JSONDecodeError, IndexError, KeyError):
                            continue

            await add_message(conv_id, "assistant", full_response)
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as exc:
            logger.exception("Streaming error")
            yield f"data: {json.dumps({'type': 'error', 'message': str(exc)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("index:app", host="0.0.0.0", port=8000, reload=True)
