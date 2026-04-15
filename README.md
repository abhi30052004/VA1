# AI Content Studio

A premium, high-performance workspace for drafting and refining social media and website content using AI.

## Core Features

- **Smart Generation**: Platform-aware drafting for Instagram, LinkedIn, X, Facebook, and Web.
- **Contextual Refinement**: Highlight text to instantly fix, trim, or grow content via a floating AI toolbar.
- **Real-time Cost Tracking**: Live monitoring of OpenAI API costs with a visual daily budget progress bar.
- **Dynamic UX**: Word-by-word typewriter streaming, skeleton loaders, and interactive mesh-gradient backgrounds.
- **Canva Integration**: One-click handoff to Canva for visual design.

## Stack

- **Frontend**: React + Vite, Tiptap Editor (Rich Text), Lucide Icons.
- **Backend**: Node.js + Express, LangChain (Prompt Management), MongoDB.
- **AI**: OpenAI GPT-4o-mini (default).

## Getting Started

### 1. Backend

```bash
cd backend
npm install
# Add OPENAI_API_KEY to .env
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Configuration (.env)

- `OPENAI_API_KEY`: Your API key.
- `OPENAI_MAX_TOTAL_COST_USD`: Daily budget limit (default: $5).
- `OPENAI_MODEL`: Model to use (default: `gpt-4o-mini`).
- `MONGODB_URI=mongodb+srv://username:passsword@cluster0.xxxxxx.mongodb.net/`
- `DB_NAME=AIContentEditor`
