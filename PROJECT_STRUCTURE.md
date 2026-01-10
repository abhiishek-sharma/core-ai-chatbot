# Project Structure

This document provides a comprehensive overview of the CORE AI Chatbot project structure with professional naming conventions.

---

## 📁 Root Directory

```
core-ai-chatbot/
├── backend/                    # Backend API (FastAPI + Python)
├── frontend/                   # Frontend UI (React + Vite)
├── scripts/                    # Utility and setup scripts
├── deployments/                # Deployment configurations
├── docs/                       # Documentation
├── assets/                     # Project assets (logos, screenshots)
├── .github/                    # GitHub configuration and workflows
├── docker-compose.yml          # Development environment
├── .gitignore                  # Git ignore rules
├── README.md                   # Main project documentation
├── LICENSE                     # MIT License
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Version history
└── PROJECT_STRUCTURE.md        # This file
```

---

## 🔧 Backend Structure

```
backend/
├── app/                        # Main application package
│   │
│   ├── api/                    # API layer
│   │   ├── __init__.py
│   │   └── v1/                 # API version 1
│   │       ├── __init__.py
│   │       ├── router.py       # Main API router
│   │       └── endpoints/      # API endpoint modules
│   │           ├── __init__.py
│   │           ├── conversations.py    # Conversation CRUD endpoints
│   │           ├── chat.py             # Chat and streaming endpoints
│   │           └── health.py           # Health check endpoints
│   │
│   ├── core/                   # Core infrastructure
│   │   ├── __init__.py
│   │   ├── config.py           # Configuration management (Pydantic Settings)
│   │   ├── database.py         # Database setup and session management
│   │   ├── security.py         # JWT, password hashing, encryption
│   │   └── logging_config.py   # Structured logging configuration
│   │
│   ├── models/                 # Database models (SQLAlchemy)
│   │   ├── __init__.py
│   │   └── conversation.py     # Conversation, Message, User models
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   └── conversation.py     # Request/response schemas and validation
│   │
│   ├── repositories/           # Repository layer (Data access)
│   │   ├── __init__.py
│   │   ├── base.py             # Base repository with generic CRUD
│   │   └── conversation_repository.py  # Specialized conversation queries
│   │
│   ├── services/               # Service layer (Business logic)
│   │   ├── __init__.py
│   │   └── ai_service.py       # AI/LLM integration (Mistral AI)
│   │
│   ├── middleware/             # Custom middleware
│   │   └── __init__.py
│   │
│   ├── utils/                  # Utility functions
│   │   └── __init__.py
│   │
│   ├── __init__.py
│   └── main.py                 # Application entry point
│
├── tests/                      # Test suite
│   ├── __init__.py
│   ├── conftest.py             # Test configuration and fixtures
│   ├── unit/                   # Unit tests
│   │   └── __init__.py
│   └── integration/            # Integration tests
│       └── __init__.py
│
├── logs/                       # Application logs (gitignored)
├── alembic/                    # Database migrations (optional)
├── venv/                       # Virtual environment (gitignored)
├── __pycache__/                # Python cache (gitignored)
│
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── Dockerfile                  # Production container definition
├── requirements.txt            # Core dependencies
├── requirements-enterprise.txt # Full enterprise dependencies
└── pytest.ini                  # Pytest configuration
```

---

## 🎨 Frontend Structure

```
frontend/
├── public/                     # Static assets
│   ├── index.html              # HTML template
│   └── favicon.ico             # Favicon
│
├── src/                        # Source code
│   │
│   ├── components/             # React components
│   │   ├── ChatMessage.jsx     # Message display component
│   │   ├── ChatInput.jsx       # Message input component
│   │   ├── Sidebar.jsx         # Conversation list sidebar
│   │   ├── SettingsModal.jsx   # Settings configuration modal
│   │   └── WelcomeScreen.jsx   # Welcome/landing screen
│   │
│   ├── api.js                  # Centralized API client
│   ├── App.jsx                 # Main application component
│   ├── index.jsx               # React entry point
│   └── index.css               # Global styles and Tailwind config
│
├── node_modules/               # Dependencies (gitignored)
├── dist/                       # Build output (gitignored)
│
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── Dockerfile                  # Production container definition
├── nginx.conf                  # Nginx configuration for production
├── package.json                # Node.js dependencies and scripts
├── package-lock.json           # Dependency lock file
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── index.html                  # Vite entry HTML
```

---

## 📜 Scripts Structure

```
scripts/
├── init_db.py                  # Database initialization script
├── setup_dev.sh                # Development setup (Linux/macOS)
├── setup_dev.bat               # Development setup (Windows)
├── migrate_db.py               # Database migration helper
└── health_check.py             # System health check script
```

**Usage:**
- `python scripts/init_db.py` - Initialize database
- `./scripts/setup_dev.sh` - Automated dev setup (Unix)
- `scripts\setup_dev.bat` - Automated dev setup (Windows)

---

## 🚀 Deployments Structure

```
deployments/
├── docker/                     # Docker configurations
│   ├── docker-compose.prod.yml # Production Docker Compose
│   ├── docker-compose.dev.yml  # Development Docker Compose
│   └── nginx/                  # Nginx configurations
│       └── nginx.conf          # Nginx reverse proxy config
│
└── kubernetes/                 # Kubernetes manifests
    ├── backend-deployment.yaml # Backend deployment and service
    ├── frontend-deployment.yaml # Frontend deployment and service
    ├── postgres-deployment.yaml # PostgreSQL statefulset
    ├── redis-deployment.yaml   # Redis deployment
    ├── ingress.yaml            # Ingress configuration
    └── secrets-example.yaml    # Secrets template
```

**Usage:**
- Docker: `docker-compose -f deployments/docker/docker-compose.prod.yml up -d`
- Kubernetes: `kubectl apply -f deployments/kubernetes/`

---

## 📚 Documentation Structure

```
docs/
├── ARCHITECTURE.md             # System architecture and design patterns
├── MIGRATION.md                # Migration guide from legacy versions
├── QUICK_REFERENCE.md          # Command reference and cheat sheet
├── DIAGRAMS.md                 # Architecture diagrams
└── api/                        # API documentation (optional)
    └── openapi.json            # OpenAPI specification
```

---

## 🐙 GitHub Configuration

```
.github/
├── workflows/                  # GitHub Actions workflows
│   ├── ci.yml                  # Continuous Integration pipeline
│   ├── cd.yml                  # Continuous Deployment pipeline
│   └── codeql.yml              # Security analysis
│
├── ISSUE_TEMPLATE/             # Issue templates
│   ├── bug_report.md           # Bug report template
│   ├── feature_request.md      # Feature request template
│   └── config.yml              # Issue template configuration
│
├── PULL_REQUEST_TEMPLATE.md    # Pull request template
├── CODEOWNERS                  # Code ownership definitions
└── dependabot.yml              # Automated dependency updates
```

---

## 🎨 Assets Structure

```
assets/
├── images/                     # Project images
│   ├── logo.png                # Project logo
│   ├── banner.png              # GitHub banner
│   └── screenshots/            # Application screenshots
│       ├── screenshot-1.png
│       └── screenshot-2.png
│
└── docs/                       # Documentation assets
    └── diagrams/               # Architecture diagrams
```

---

## 📦 Key Files Explained

### Backend Files

#### `app/main.py`
**Purpose**: Application entry point  
**Contains**:
- FastAPI app initialization
- Middleware configuration
- API router inclusion
- Lifespan events (startup/shutdown)
- CORS setup

#### `app/core/config.py`
**Purpose**: Configuration management  
**Contains**:
- Environment variable definitions
- Type-safe settings with Pydantic
- Database configuration
- AI service configuration
- Security settings
- Validation and defaults

#### `app/core/database.py`
**Purpose**: Database connection management  
**Contains**:
- SQLAlchemy async engine setup
- Session management and dependency injection
- Connection pooling configuration
- Health check functions
- MongoDB support (alternative)

#### `app/core/security.py`
**Purpose**: Security utilities  
**Contains**:
- JWT token creation and validation
- Password hashing (bcrypt)
- API key generation
- Security helpers

#### `app/models/conversation.py`
**Purpose**: Database schema definitions  
**Contains**:
- SQLAlchemy ORM models
- Table definitions
- Relationships and foreign keys
- Indexes for performance
- Model methods

#### `app/schemas/conversation.py`
**Purpose**: API data validation  
**Contains**:
- Pydantic request schemas
- Response serialization schemas
- Field validation rules
- API documentation examples

#### `app/repositories/base.py`
**Purpose**: Data access abstraction  
**Contains**:
- Generic CRUD operations
- Query helpers (pagination, filtering, sorting)
- Transaction management
- Soft delete support

#### `app/services/ai_service.py`
**Purpose**: AI/LLM integration  
**Contains**:
- Mistral AI client
- Chat completion methods
- Streaming response handling
- Error handling and retries

### Frontend Files

#### `src/App.jsx`
**Purpose**: Main React application  
**Contains**:
- Application state management
- Component composition
- Theme provider
- Router setup (if applicable)

#### `src/api.js`
**Purpose**: API client  
**Contains**:
- Centralized API requests
- Request/response handling
- Error handling
- Base URL configuration

#### `src/components/`
**Purpose**: Reusable UI components  
**Contains**:
- Presentational components
- Container components
- Styled with Tailwind CSS

### Configuration Files

#### `.env`
**Purpose**: Environment-specific configuration  
**Contains**:
- Database credentials
- API keys
- Secret keys
- Feature flags
- **Important**: Never commit this file

#### `docker-compose.yml`
**Purpose**: Multi-container orchestration  
**Contains**:
- Service definitions
- Network configuration
- Volume management
- Environment variables
- Health checks

#### `Dockerfile`
**Purpose**: Container definition  
**Contains**:
- Base image selection
- Dependency installation
- Application setup
- Entry point definition
- Health checks

---

## 🔄 Data Flow

### Request Flow

```
1. Client Request
   ↓
2. API Layer (app/api/v1/endpoints/)
   - Validates request with Pydantic
   - Handles authentication
   ↓
3. Service Layer (app/services/)
   - Implements business logic
   - Orchestrates operations
   ↓
4. Repository Layer (app/repositories/)
   - Abstracts database operations
   - Executes queries
   ↓
5. Database Layer
   - Stores/retrieves data
   ↓
6. Response back through layers
   - Formatted and serialized
   ↓
7. Client Response
```

### Streaming Flow

```
Client ←→ API ←→ Service ←→ AI Service ←→ Mistral AI
         ↓
    Repository ←→ Database
    (saves after complete)
```

---

## 🏗️ Design Patterns

### 1. Layered Architecture
- **Presentation**: API endpoints
- **Business Logic**: Services
- **Data Access**: Repositories
- **Domain**: Models and schemas

### 2. Repository Pattern
- Abstracts data access
- Makes code testable
- Easy to swap databases

### 3. Dependency Injection
- FastAPI's dependency system
- Loose coupling
- Easy testing with mocks

### 4. Service Layer Pattern
- Encapsulates business logic
- Reusable across endpoints
- Transaction management

---

## 📋 Naming Conventions

### Backend (Python)

| Type | Convention | Example |
|------|------------|---------|
| Packages | `snake_case` | `app/core/` |
| Modules | `snake_case.py` | `config.py` |
| Classes | `PascalCase` | `ConversationService` |
| Functions | `snake_case()` | `get_conversation()` |
| Constants | `UPPER_SNAKE_CASE` | `DATABASE_URL` |
| Private | `_prefix` | `_internal_function()` |

### Frontend (JavaScript/React)

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase.jsx` | `ChatMessage.jsx` |
| Utilities | `camelCase.js` | `apiClient.js` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL` |
| Functions | `camelCase()` | `fetchConversations()` |
| CSS | `kebab-case.css` | `chat-message.css` |

### Directories

| Type | Convention | Example |
|------|------------|---------|
| Root folders | `lowercase` | `backend/`, `frontend/` |
| Python packages | `snake_case` | `app/repositories/` |
| React folders | `lowercase` | `components/` |

---

## 🔍 Module Purposes

### Backend Modules

| Module | Purpose | Responsibilities |
|--------|---------|------------------|
| `api/` | API layer | HTTP request handling, validation, routing |
| `core/` | Infrastructure | Configuration, database, security, logging |
| `models/` | Domain models | Database schema, ORM models |
| `schemas/` | Data contracts | Request/response validation, serialization |
| `repositories/` | Data access | Database queries, CRUD operations |
| `services/` | Business logic | Application logic, orchestration |
| `middleware/` | Cross-cutting | Request/response processing, logging |
| `utils/` | Utilities | Helper functions, validators |
| `tests/` | Testing | Unit and integration tests |

### Frontend Modules

| Module | Purpose | Responsibilities |
|--------|---------|------------------|
| `components/` | UI components | Reusable React components |
| `api.js` | API client | Backend communication |
| `App.jsx` | Main app | Application composition |
| `index.css` | Styles | Global styles, Tailwind utilities |

---

## 🗂️ File Organization Principles

### 1. Separation of Concerns
- Each file has a single, clear purpose
- Related files grouped in directories
- Clear boundaries between layers

### 2. Dependency Direction
```
API → Services → Repositories → Database
(Dependencies flow inward, not outward)
```

### 3. Module Independence
- Modules should be loosely coupled
- High cohesion within modules
- Clear interfaces between modules

### 4. Scalability
- Easy to add new endpoints
- Easy to add new services
- Easy to add new repositories
- Easy to add new models

---

## 📊 Directory Size Guidelines

### Backend
- **Small**: `api/`, `schemas/` (10-20 files)
- **Medium**: `services/`, `repositories/` (5-15 files)
- **Large**: `models/`, `tests/` (20-50 files)

### Frontend
- **Small**: `api.js`, `App.jsx` (1-5 files)
- **Medium**: `components/` (10-20 files)

---

## 🚀 Deployment Structure

### Development
```
Local Machine
├── backend (localhost:8000)
├── frontend (localhost:3000)
└── sqlite database
```

### Docker Development
```
Docker Compose
├── backend:8000
├── frontend:3000
├── postgres:5432
└── redis:6379
```

### Production
```
Cloud Platform
├── Load Balancer
├── Backend (N instances)
├── Frontend (CDN)
├── PostgreSQL (managed)
└── Redis (managed)
```

---

## 📝 Environment Files

### Development
```
backend/.env              # Local development settings
backend/.env.example      # Template with all options
frontend/.env             # Frontend environment
```

### Production
```
backend/.env.production   # Production settings
deployments/docker/.env   # Docker production env
deployments/kubernetes/   # K8s secrets and configmaps
```

---

## 🔐 Sensitive Files (Not in Git)

### Backend
- `backend/.env` - Environment variables with secrets
- `backend/logs/*.log` - Application log files
- `backend/*.db` - SQLite database files
- `backend/venv/` - Python virtual environment
- `backend/__pycache__/` - Python bytecode cache

### Frontend
- `frontend/.env` - Frontend environment variables
- `frontend/node_modules/` - Node.js dependencies
- `frontend/dist/` - Production build output
- `frontend/.vite/` - Vite cache

---

## 📦 Build Artifacts

### Backend
- `backend/build/` - Distribution packages
- `backend/dist/` - Built distributions
- `backend/*.egg-info/` - Package metadata
- `backend/htmlcov/` - Coverage reports

### Frontend
- `frontend/dist/` - Production build
- `frontend/build/` - Alternative build output
- `frontend/coverage/` - Test coverage reports

---

## 🎯 Best Practices

### File Organization
1. **Group by feature** - Keep related files together
2. **Clear naming** - Descriptive, consistent names
3. **Shallow hierarchy** - Avoid deep nesting (max 4-5 levels)
4. **Single responsibility** - One purpose per file

### Module Organization
1. **Imports at top** - Standard, third-party, local
2. **Constants after imports** - Module-level constants
3. **Classes/functions** - Main code
4. **Main block** - `if __name__ == "__main__"` at end

### Code Organization
```python
# Standard library imports
import os
from typing import Optional

# Third-party imports
from fastapi import FastAPI
from sqlalchemy import select

# Local application imports
from app.core.config import settings
from app.models.conversation import Conversation

# Module constants
DEFAULT_TIMEOUT = 30

# Classes and functions
class MyService:
    pass

def my_function():
    pass

# Main execution
if __name__ == "__main__":
    main()
```

---

## 🔗 Dependencies Between Modules

### Backend Dependencies

```
main.py
  ↓
api/v1/router.py
  ↓
api/v1/endpoints/*.py
  ↓
services/*.py
  ↓
repositories/*.py
  ↓
models/*.py
```

**Rules**:
- API layer depends on Services
- Services depend on Repositories
- Repositories depend on Models
- Models depend on Core (database)
- No circular dependencies

### Frontend Dependencies

```
index.jsx
  ↓
App.jsx
  ↓
components/*.jsx
  ↓
api.js
```

**Rules**:
- Components use API client
- API client is centralized
- No direct fetch in components
- Shared state management

---

## 📈 Scalability Considerations

### Adding New Features

1. **New API Endpoint**:
   - Add endpoint in `app/api/v1/endpoints/`
   - Register in `app/api/v1/router.py`
   - Add schemas in `app/schemas/`
   - Add tests in `tests/integration/`

2. **New Service**:
   - Create service in `app/services/`
   - Add business logic methods
   - Add unit tests in `tests/unit/`

3. **New Database Model**:
   - Define model in `app/models/`
   - Create Pydantic schema in `app/schemas/`
   - Create repository in `app/repositories/`
   - Generate migration: `alembic revision --autogenerate`

4. **New Component**:
   - Create component in `frontend/src/components/`
   - Import in `App.jsx` or parent component
   - Add component tests

---

## 🛠️ Development Workflow

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Running Tests
```bash
cd backend
pytest tests/ -v
```

### Code Quality
```bash
cd backend
black app/
flake8 app/
mypy app/
```

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| **Total Files** | 40+ |
| **Backend Modules** | 15+ |
| **Frontend Components** | 5+ |
| **Test Files** | 10+ |
| **Documentation Files** | 8+ |
| **Configuration Files** | 12+ |
| **Total Lines of Code** | 15,000+ |

---

## 🔄 Version Control

### Branch Structure
```
main                    # Production-ready code
├── develop             # Integration branch
│   ├── feature/*       # New features
│   ├── fix/*          # Bug fixes
│   ├── docs/*         # Documentation updates
│   └── refactor/*     # Code refactoring
└── release/*          # Release branches
```

### Ignored Files
See [.gitignore](.gitignore) for complete list of ignored files and directories.

---

## 🎓 Learning the Structure

### For New Developers

1. **Start with**: `README.md` - Overview and quick start
2. **Understand**: `docs/ARCHITECTURE.md` - System design
3. **Explore**: `app/main.py` - Entry point
4. **Study**: `app/api/v1/endpoints/` - API examples
5. **Review**: `tests/` - Test examples

### For Contributors

1. Review `CONTRIBUTING.md` - Contribution guidelines
2. Check `docs/QUICK_REFERENCE.md` - Common commands
3. Explore `app/` structure - Code organization
4. Review existing PRs - Best practices

---

## 📞 Quick Links

- **[Main README](README.md)** - Project overview
- **[Architecture](docs/ARCHITECTURE.md)** - Detailed architecture
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Changelog](CHANGELOG.md)** - Version history
- **[API Docs](http://localhost:8000/docs)** - Interactive API documentation

---

## ✨ Summary

This project follows **enterprise-grade standards** with:

- ✅ Clean, logical structure
- ✅ Professional naming conventions
- ✅ Clear separation of concerns
- ✅ Comprehensive documentation
- ✅ Scalable architecture
- ✅ Easy to navigate and understand
- ✅ Ready for production deployment

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: CORE AI Team