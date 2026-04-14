# Social Media & Website Support AI System

A responsive client-work support system for drafting, refining, and live-editing social and website content.

This version includes:
- cleaner header with only selected format + OpenAI hit count
- auto-scroll to the live editor after generate
- lightweight streaming effect in the live editor
- compact right-side quick actions with emoji
- hidden scrollbar in history
- cleaner, less text-heavy UI
- Canva copy + open handoff

## Tech stack

- **React + Vite** for the frontend
- **Node.js + Express** for the backend
- **LangChain PromptTemplate** for controlled prompting
- **OpenAI API** for generation and refinement
- **TipTap** for the live editor
- **Canva handoff** for copy + open workflow

## File guide for easy editing

### Frontend
- `src/App.jsx` — main state, generate/transform handlers, auto-scroll, streaming effect, and history save/restore.
- `src/components/Header.jsx` — top bar with selected platform and OpenAI hit count.
- `src/components/Sidebar.jsx` — platform picker on the left.
- `src/components/ContentForm.jsx` — main brief inputs and generate button.
- `src/components/PromptControls.jsx` — quick controls for format, brand voice, and size.
- `src/components/LiveEditor.jsx` — live editor shell, action buttons, typing state, and Canva handoff button.
- `src/components/RichTextEditor.jsx` — TipTap toolbar and editable surface.
- `src/components/HistoryPanel.jsx` — restore, delete one, and delete all history actions.
- `src/components/SuggestionPanel.jsx` — emoji quick actions and compact AI idea chips.
- `src/api/client.js` — frontend fetch helpers for backend endpoints.
- `src/utils/content.js` — platform metadata and text helper functions.
- `src/index.css` — layout, spacing, hidden scrollbar, and visual styling.

### Backend
- `server.js` — Express app setup, CORS, routes, and Canva endpoint wiring.
- `routes/aiRoutes.js` — generate, transform, and stats endpoints.
- `prompts/socialMediaPrompt.js` — generation and refinement prompt templates.
- `services/openaiService.js` — model call helpers and token usage capture.
- `services/usageService.js` — local hit/cost tracking and max-limit alert data.
- `services/canvaService.js` — Canva Docs handoff URL builder.
- `utils/validators.js` — request payload validation.
- `data/usage-stats.json` — local usage stats storage.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Environment variables

### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:5000
```

### backend/.env

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=http://localhost:5173
CANVA_BASE_URL=https://www.canva.com

# Optional internal cost guard.
OPENAI_COST_INPUT_PER_1M=0.15
OPENAI_COST_OUTPUT_PER_1M=0.60
OPENAI_MAX_TOTAL_COST_USD=5
```

## How it works

1. Pick a platform.
2. Choose voice and content size.
3. Enter audience, topic, and key message.
4. Generate content into the live editor.
5. Use quick actions to refine it.
6. Restore old drafts from the history panel.
7. Copy or open Canva.

## Canva note

This project uses **copy + open Canva**.
It does not auto-fill Magic Write directly inside Canva.
