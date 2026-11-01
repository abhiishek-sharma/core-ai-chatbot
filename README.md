# CORE AI Chatbot

AI chatbot with a dark-themed UI, powered by Mistral AI. FastAPI backend with streaming Server-Sent Events, React frontend, deployable to Vercel.

## Features

- **Mistral AI chat** with streaming (SSE) and non-streaming modes
- **Conversation management** — create, rename, delete, clear conversations
- **Persistent storage** — SQLite locally; in-memory fallback on read-only filesystems
- **Dark UI** — React 18 + Tailwind CSS, markdown rendering, syntax highlighting
- **Vercel deployment** — Python serverless function + static frontend
- **Docker support** — docker-compose for local development with PostgreSQL and Redis

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Mistral AI API key — [get one here](https://console.mistral.ai/)

### Local Development

```bash
# Clone and configure
git clone https://github.com/abhiishek-sharma/core-ai-chatbot.git
cd core-ai-chatbot
cp .env.example .env
# Edit .env and add your MISTRAL_API_KEY

# Backend
cd api
pip install -r requirements.txt
uvicorn index:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The Vite dev server proxies `/api/*` requests to the backend at port 8000.

### Vercel Deployment

1. Push the repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Set the environment variable `MISTRAL_API_KEY` in the Vercel dashboard
4. Deploy

See [Environment Variables for Vercel](#environment-variables-for-vercel) below.

## Project Structure

```
core-ai-chatbot/
├── api/
│   ├── index.py           # FastAPI backend (Vercel serverless function)
│   └── requirements.txt   # Python dependencies (pinned)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── api.js         # API client
│   │   └── components/    # Chat UI components
│   ├── package.json
│   └── vite.config.js
├── tests/
│   ├── conftest.py        # Test fixtures
│   └── test_api.py        # API endpoint tests
├── backend/               # Extended backend code (config, models, repos — not used by the running API)
├── vercel.json            # Vercel deployment config
├── .env.example           # Environment variable template
└── requirements-dev.txt   # Dev dependencies (includes test runner)
```

## API Endpoints

| Method   | Path                                | Description                |
| -------- | ----------------------------------- | -------------------------- |
| `GET`    | `/`                                 | API status                 |
| `GET`    | `/health`                           | Health check               |
| `GET`    | `/conversations`                    | List all conversations     |
| `POST`   | `/conversations`                    | Create a conversation      |
| `GET`    | `/conversations/{id}`               | Get conversation + messages|
| `PUT`    | `/conversations/{id}`               | Rename a conversation      |
| `DELETE` | `/conversations/{id}`               | Delete a conversation      |
| `POST`   | `/conversations/{id}/clear`         | Clear messages             |
| `POST`   | `/chat`                             | Send message (non-streaming) |
| `POST`   | `/chat/stream`                      | Send message (streaming SSE) |

On Vercel, all endpoints are served under `/api/` (e.g. `/api/chat/stream`).

## Storage

- **Local development**: SQLite via `aiosqlite`. The database file defaults to `chatbot.db` in the working directory (configurable via `DATABASE_PATH`).
- **Vercel serverless**: SQLite can write to `/tmp` but data does not persist across cold starts or instances. For durable storage in production, use an external database such as [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres).

## Testing

```bash
pip install -r requirements-dev.txt
pytest tests/ -v
```

Tests mock all Mistral API calls. Both in-memory and SQLite storage paths are tested.

## Environment Variables for Vercel

Set these in the Vercel project dashboard under **Settings → Environment Variables**:

| Variable           | Required | Description                          |
| ------------------ | -------- | ------------------------------------ |
| `MISTRAL_API_KEY`  | Yes      | Your Mistral AI API key              |
| `MISTRAL_MODEL`    | No       | Model name (default: `mistral-small-latest`) |
| `DATABASE_PATH`    | No       | SQLite path (default: `chatbot.db`; use `/tmp/chatbot.db` on Vercel for ephemeral storage) |

**Vercel settings to check:**
- **Framework Preset**: Other
- **Root Directory**: `.` (project root)
- **Build Command**: (leave default — `vercel.json` provides it)
- **Output Directory**: (leave default — `vercel.json` provides it)
- **Node.js Version**: 18.x or 20.x
- **Python Version**: 3.12 (Vercel's Python runtime default)

> **Note:** Vercel Hobby plan limits serverless functions to 10 seconds. Streaming responses from Mistral may exceed this. Use the Pro plan (60s limit) for reliable streaming, or set `maxDuration` higher on Enterprise.

## Tech Stack

### Backend
- FastAPI 0.115
- httpx (Mistral API client)
- aiosqlite (SQLite async driver)
- Pydantic 2.x

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3
- React Markdown + Syntax Highlighter
- Lucide React (icons)

### Infrastructure
- Vercel (serverless + static hosting)
- Docker Compose (local dev with PostgreSQL/Redis, optional)

## License

MIT — see [LICENSE](LICENSE).
