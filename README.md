# AI Resume Analyzer

An AI-powered resume analysis tool that scores your resume against any job description and gives you actionable feedback to improve your chances.

![App Preview](Images/Frontpage.png)

## Features

- **Resume scoring** — get a 0–100 match score against any job description
- **Strengths analysis** — see exactly what's working in your resume
- **Missing keywords** — find the gaps between your resume and the role
- **Actionable suggestions** — specific improvements to boost your score
- **Analysis history** — track your progress over multiple applications
- **Secure auth** — email/password authentication with JWT tokens

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Deployed on Vercel

**Backend**
- FastAPI (Python)
- Supabase (PostgreSQL + Auth + Storage)
- Anthropic Claude API
- Deployed on Railway

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- A [Supabase](https://supabase.com) account
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone the repo

```bash
git clone https://github.com/jonathanwhittaker93-design/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the env template and fill in your values:

```bash
cp ../.env.example .env
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

See `.env.example` at the root for all required variables:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry (e.g. `60`) |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Project Structure

```
AI-Resume-Analyzer/
├── backend/
│   ├── routers/        # API route handlers
│   ├── services/       # Claude, Supabase, PDF parsing
│   ├── models/         # Pydantic schemas
│   ├── utils/          # Auth helpers
│   └── main.py         # FastAPI app entry point
├── frontend/
│   ├── app/            # Next.js App Router pages
│   ├── context/        # Auth context
│   └── lib/            # API client + utilities
├── .env.example        # Environment variable template
└── .github/
    └── workflows/
        └── deploy.yml  # CI pipeline
```

## CI/CD

Every push to `main` runs:
- Python linting (Ruff)
- TypeScript/ESLint checks
- Secret scanning (TruffleHog)

Deployments are handled automatically — Vercel for the frontend, Railway for the backend.

## License

MIT
