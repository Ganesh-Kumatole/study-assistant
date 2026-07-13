# Study Assistant

A React app that turns free-form notes or a topic into an interactive study session — flashcards to flip through, a quiz to test yourself, and focused retest loops for the things you got wrong.

---

## Setup

**Prerequisites:** Node.js 18+, a Gemini API key (free tier at [aistudio.google.com](https://aistudio.google.com))

```bash
git clone <repo-url>
cd study-assistant
npm install
```

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

Then run both processes in separate terminals:

```bash
# Terminal 1 — backend API server (port 3000)
npm run server

# Terminal 2 — frontend dev server (port 5173)
npm run dev
```

Open `http://localhost:5173`.

> The API key never touches the frontend bundle. All Gemini calls go through the Express backend in `backend/`, which the Vite dev server proxies at `/api`.

---

## How it works

1. Paste notes or name a topic in the input panel
2. The app sends them to the backend, which calls Gemini with a strict JSON schema
3. The response is validated before anything renders — bad shape, missing fields, or empty arrays are caught and shown as a recoverable error
4. You get a flashcard deck to work through, marking each card known or unknown
5. At the end of the deck, take the full quiz or review only the cards you marked unknown
6. After the quiz, retest only the questions you got wrong

---

## Architecture

```
study-assistant/
  backend/
    server.js                      # Express server, loads .env.local via dotenv
    routes/generate.route.js       # POST /api/generate
    controllers/generate.controller.js  # Gemini API call + error handling
  src/
    App.jsx                        # State orchestration
    components/
      layout/                      # HeroBand, WorkspacePanel
      flashcards/                  # Flashcard, FlashcardDeck, DeckSummary
      quiz/                        # Quiz, QuizQuestion, QuizResults
      states/                      # EmptyState, ErrorState, LoadingState
      InputForm.jsx
    hooks/useGenerate.js           # Fetch, timeout, abort, stale-response guard
    lib/
      geminiSchema.js              # JSON schema passed to Gemini
      validateResponse.js          # Runtime validation of the model's output
```

**A few decisions worth noting:**

- The model is given a JSON schema via `response_format` so it's constrained at generation time, not just validated after. Validation still runs because the schema is a hint, not a guarantee.
- `useGenerate` uses an `AbortController` with a 30s timeout and a request ID ref to silently discard stale responses if the user resubmits before the previous request finishes.
- Both `FlashcardDeck` and `Quiz` are remounted via React's `key` prop on every retest rather than trying to reset their internal state imperatively.
- The backend is a plain Express server rather than a serverless function for local dev simplicity.

---

## Handling bad AI output

- **Schema enforcement** — Gemini is given the exact expected shape at call time
- **Runtime validation** — `validateResponse.js` checks every required field, array length, index ranges, and empty strings before any state is set
- **Duplicate IDs** — deduped with `crypto.randomUUID()` on the way in
- **Timeout** — 30s hard limit with a user-facing message distinguishing timeout from network failure from a user-triggered cancel
- **HTTP errors** — 401/403, 429, and 500s each produce a specific message
- **Stale responses** — a request ID ref ensures a slow previous response can't overwrite a newer one
- **Parse failure** — `SyntaxError` on `JSON.parse` is caught and surfaced separately
- Notes are preserved across errors so the user never loses their prompt

---

## Known limitations

- No session persistence — refreshing the page clears everything
- One study set at a time — there's no history or saved sessions
- The retest loop is one level deep — retesting wrong quiz answers doesn't chain into a third retest
- Gemini occasionally generates IDs that aren't unique across flashcards and quiz items; the deduplication handles it but ideally the model wouldn't do it
- No streaming — the full response is awaited before anything renders, so there's a noticeable wait on longer topics

---

## AI usage note

Amazon Q Developer (AWS's AI coding assistant, running inside VS Code) was used throughout this project for:

- Debugging the Gemini SDK integration — the `@google/genai` v2 API surface (`ai.interactions.create`, `response_format`, `output_text`) differs significantly from the older `@google/generative-ai` SDK, and Q helped identify the correct method signatures by inspecting the installed package at runtime
- Suggesting the request ID ref pattern for stale-response guarding
- Refactoring passes (modularising components, splitting embedded sub-components into their own files)

All architectural decisions, the data contract, the validation logic, and the overall product flow were designed and reasoned through by me. Every piece of code was reviewed and understood before it was kept.

---

## Time spent

| Phase                                         | Time        |
| --------------------------------------------- | ----------- |
| Scaffold + tooling setup                      | ~45 min     |
| Data contract, schema, validation, mock       | ~1 hr       |
| Flashcard deck + flip animation               | ~1 hr       |
| Quiz + scoring + retest flow                  | ~1.5 hr     |
| Error handling, timeout, abort, stale guard   | ~1 hr       |
| Real Gemini API integration + debugging       | ~2 hr       |
| Backend refactor (Express, modular structure) | ~45 min     |
| CSS, mobile responsiveness                    | ~1 hr       |
| README                                        | ~30 min     |
| **Total**                                     | **~9.5 hr** |
