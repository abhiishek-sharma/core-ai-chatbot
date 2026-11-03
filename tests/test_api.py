"""Tests for the Core AI Chatbot API endpoints."""

import json
from unittest import mock

import httpx
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

import index

transport = ASGITransport(app=index.app)


@pytest_asyncio.fixture()
async def client():
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


# --- Health & root ---


@pytest.mark.asyncio
async def test_root(client):
    resp = await client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_health(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["storage"] == "memory"
    assert data["mistral_configured"] is True


# --- Conversations CRUD ---


@pytest.mark.asyncio
async def test_create_conversation(client):
    resp = await client.post(
        "/conversations", json={"title": "Test Chat"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Test Chat"
    assert "id" in data


@pytest.mark.asyncio
async def test_list_conversations(client):
    await client.post("/conversations", json={"title": "Chat 1"})
    await client.post("/conversations", json={"title": "Chat 2"})
    resp = await client.get("/conversations")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_get_conversation(client):
    create_resp = await client.post(
        "/conversations", json={"title": "My Chat"}
    )
    cid = create_resp.json()["id"]

    resp = await client.get(f"/conversations/{cid}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "My Chat"
    assert data["messages"] == []


@pytest.mark.asyncio
async def test_get_conversation_not_found(client):
    resp = await client.get("/conversations/nonexistent")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_conversation(client):
    create_resp = await client.post(
        "/conversations", json={"title": "Old Title"}
    )
    cid = create_resp.json()["id"]

    resp = await client.put(
        f"/conversations/{cid}", json={"title": "New Title"}
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "New Title"


@pytest.mark.asyncio
async def test_delete_conversation(client):
    create_resp = await client.post(
        "/conversations", json={"title": "To Delete"}
    )
    cid = create_resp.json()["id"]

    resp = await client.delete(f"/conversations/{cid}")
    assert resp.status_code == 200

    resp = await client.get(f"/conversations/{cid}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_clear_conversation(client):
    create_resp = await client.post(
        "/conversations", json={"title": "Chat"}
    )
    cid = create_resp.json()["id"]

    index._mem[cid]["messages"].append(
        {"role": "user", "content": "hello", "timestamp": "t"}
    )
    assert len(index._mem[cid]["messages"]) == 1

    resp = await client.post(f"/conversations/{cid}/clear")
    assert resp.status_code == 200
    assert len(index._mem[cid]["messages"]) == 0


# --- Chat (non-streaming) ---


def _mock_mistral_response(content="Hello from Mistral!"):
    """Create a mock httpx response mimicking the Mistral API."""
    mock_resp = mock.Mock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "choices": [
            {"message": {"content": content}, "finish_reason": "stop"}
        ],
        "usage": {
            "prompt_tokens": 10,
            "completion_tokens": 20,
            "total_tokens": 30,
        },
    }
    mock_resp.text = ""
    return mock_resp


@pytest.mark.asyncio
async def test_chat_creates_conversation(client):
    mock_resp = _mock_mistral_response("Hi there!")

    mock_client = mock.AsyncMock()
    mock_client.post = mock.AsyncMock(return_value=mock_resp)
    mock_client.__aenter__ = mock.AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = mock.AsyncMock(return_value=False)

    with mock.patch("index.httpx.AsyncClient", return_value=mock_client):
        resp = await client.post("/chat", json={"message": "Hello"})

    assert resp.status_code == 200
    data = resp.json()
    assert "conversation_id" in data
    assert data["message"]["content"] == "Hi there!"
    assert data["message"]["role"] == "assistant"
    assert data["usage"]["total_tokens"] == 30


@pytest.mark.asyncio
async def test_chat_with_existing_conversation(client):
    create_resp = await client.post(
        "/conversations", json={"title": "Existing"}
    )
    cid = create_resp.json()["id"]

    mock_resp = _mock_mistral_response("Response")
    mock_client = mock.AsyncMock()
    mock_client.post = mock.AsyncMock(return_value=mock_resp)
    mock_client.__aenter__ = mock.AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = mock.AsyncMock(return_value=False)

    with mock.patch("index.httpx.AsyncClient", return_value=mock_client):
        resp = await client.post(
            "/chat",
            json={"message": "Hello", "conversation_id": cid},
        )

    assert resp.status_code == 200
    assert resp.json()["conversation_id"] == cid


@pytest.mark.asyncio
async def test_chat_no_api_key(client):
    original = index.MISTRAL_API_KEY
    index.MISTRAL_API_KEY = ""
    try:
        resp = await client.post("/chat", json={"message": "Hello"})
        assert resp.status_code == 500
    finally:
        index.MISTRAL_API_KEY = original


# --- Chat (streaming) ---


class FakeStreamResponse:
    """Fake httpx streaming response for testing SSE."""

    def __init__(self, lines):
        self.status_code = 200
        self._lines = lines

    async def aiter_lines(self):
        for line in self._lines:
            yield line

    async def aread(self):
        return b""

    async def aclose(self):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass


@pytest.mark.asyncio
async def test_chat_stream(client):
    sse_lines = [
        'data: {"choices":[{"delta":{"role":"assistant"}}]}',
        'data: {"choices":[{"delta":{"content":"Hello"}}]}',
        'data: {"choices":[{"delta":{"content":" world"}}]}',
        "data: [DONE]",
    ]
    fake_stream = FakeStreamResponse(sse_lines)

    mock_client = mock.AsyncMock()
    mock_client.stream = mock.MagicMock(return_value=fake_stream)
    mock_client.__aenter__ = mock.AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = mock.AsyncMock(return_value=False)

    with mock.patch("index.httpx.AsyncClient", return_value=mock_client):
        resp = await client.post(
            "/chat/stream", json={"message": "Hi"}
        )

    assert resp.status_code == 200
    assert resp.headers["content-type"] == "text/event-stream; charset=utf-8"

    body = resp.text
    events = [
        json.loads(line[6:])
        for line in body.strip().split("\n\n")
        if line.startswith("data: ")
    ]

    types = [e["type"] for e in events]
    assert "conversation_id" in types
    assert "content" in types
    assert "done" in types

    content_events = [e for e in events if e["type"] == "content"]
    full_text = "".join(e["text"] for e in content_events)
    assert full_text == "Hello world"


@pytest.mark.asyncio
async def test_chat_stream_no_api_key(client):
    original = index.MISTRAL_API_KEY
    index.MISTRAL_API_KEY = ""
    try:
        resp = await client.post(
            "/chat/stream", json={"message": "Hello"}
        )
        assert resp.status_code == 500
    finally:
        index.MISTRAL_API_KEY = original


# --- SQLite storage ---


@pytest.mark.asyncio
async def test_sqlite_conversations(client, use_sqlite):
    resp = await client.post(
        "/conversations", json={"title": "SQLite Chat"}
    )
    assert resp.status_code == 200
    cid = resp.json()["id"]

    resp = await client.get("/conversations")
    assert resp.status_code == 200
    assert any(c["id"] == cid for c in resp.json())

    resp = await client.get(f"/conversations/{cid}")
    assert resp.status_code == 200
    assert resp.json()["title"] == "SQLite Chat"

    resp = await client.delete(f"/conversations/{cid}")
    assert resp.status_code == 200

    resp = await client.get(f"/conversations/{cid}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_health_sqlite(client, use_sqlite):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["storage"] == "sqlite"
