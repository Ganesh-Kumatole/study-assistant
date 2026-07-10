# Study Assistant — Build Guide for Antigravity Agent

Paste this whole document into Antigravity as your starting instructions. It is written so the agent can work through it phase by phase, committing at each checkpoint. Read it fully before starting Phase 1.

---

## 0. Context and goal

I'm building a submission for a **Frontend Internship assignment**. The brief:

> Build a small React app that takes a free-form text input, sends it to an AI model, and turns the result into an interactive tool. Calling the model is the easy part — what's being evaluated is how unpredictable AI output gets turned into reliable UI, and how failure is handled.

**Grading weights** (keep these in mind at every step):
- React & frontend architecture — 25%
- AI integration & data handling — 25%
- Handling bad AI output — 20%
- UI/UX & product sense — 15%
- Communication & understanding — 15%

**Hard constraint:** total build time should stay near 8 hours. Don't gold-plate. A clean, solid core beats a pile of half-working features. Stretch goals (streaming, dark mode, sessions) are optional and only worth doing if the core is fully solid and tested.

**The one firm rule from the brief:** this cannot be a chatbot. The AI must return structured JSON that the app parses and renders as interactive components — never print the model's raw text in a chat bubble.

---

## 1. What we're building: Study Assistant

- User pastes study notes or names a topic in a free-form text box.
- The AI generates a set of flashcards and a multiple-choice quiz from that content.
- The app renders both as interactive, stateful UI:
  - Flashcard deck: flip through cards, mark each known/unknown.
  - Quiz: answer multiple-choice questions, see correct/incorrect + explanation, get a final score.
  - Retest flow: after the quiz, offer to retest only the questions answered wrong.

---

## 2. Tech stack

- **Frontend:** React 18+ with hooks and functional components only. No class components. TypeScript is optional — skip it unless you're already fluent, since it's not graded and speed matters more here.
- **Build tool:** Vite (`npm create vite@latest`, react template).
- **AI provider:** Google Gemini (2.0 Flash or 2.5 Flash), via the `@google/generative-ai` SDK, using `responseSchema` + `responseMimeType: "application/json"` for structured output constraints.
- **Backend:** A single serverless function (Vercel `/api/generate.js` or Netlify function — pick whichever platform we deploy to) that holds the Gemini API key server-side and proxies the request. **The API key must never be shipped to the browser.**
- **Styling:** Plain CSS or CSS modules. No heavy UI framework needed — keep it lightweight and fast to build. Must work responsively on mobile (real requirement from the brief, not optional).
- **State management:** React's built-in `useState`/`useReducer`. No Redux/Zustand — unnecessary for this scope.

---

## 3. The data contract (define and lock this before writing any UI)

This is the single most important artifact in the project — both the AI call and the frontend depend on it. Implement this exact schema:

```json
{
  "topic": "string",
  "flashcards": [
    {
      "id": "string",
      "front": "string",
      "back": "string"
    }
  ],
  "quiz": [
    {
      "id": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}
```

Rules to enforce in code (not just hope the model follows):
- `flashcards` must be a non-empty array.
- `quiz` must be a non-empty array.
- Every quiz item's `options` must have exactly 4 entries.
- `correctIndex` must be an integer between 0 and 3 inclusive.
- No `null`/`undefined`/empty-string values in required fields.
- Every `id` must be unique within its array (dedupe or regenerate if not — don't trust the model's IDs blindly, consider generating IDs client-side with `crypto.randomUUID()` instead of relying on the model).

Pass this schema to Gemini via `responseSchema` so the model is constrained at generation time. **This reduces but does not eliminate the chance of bad output — you must still validate independently on receipt.** Never trust structured-output mode as a substitute for validation.

---

## 4. Architecture

```
[React app in browser]
        |
        | POST /api/generate  { notes: "<user text>" }
        v
[Serverless function]  <-- holds GEMINI_API_KEY as env var, never exposed to client
        |
        | calls Gemini API with schema-constrained prompt
        v
[Gemini API]
        |
        | returns JSON (or fails/times out/returns garbage)
        v
[Serverless function]  -- passes response back to client, or returns a clean error object
        |
        v
[React app] -- validates shape again client-side before rendering
```

The serverless function should:
1. Accept the user's raw text.
2. Build the prompt + schema and call Gemini.
3. Catch and normalize failures into a consistent error shape, e.g. `{ error: true, message: "..." }`.
4. Return either the validated JSON or that error shape — never let a raw exception or stack trace leak to the client.

---

## 5. Full user flow (build the UI to match this exactly)

**Empty state:** app loads with a text input and a disabled submit button. Button enables only once input length exceeds ~10 characters.

**Submission:** user clicks submit → input locks (read-only) → loading state appears with a spinner and message like "Generating flashcards and quiz...". Start a client-side timeout (~30s) alongside the request.

**Success path:** response arrives → validate shape (see checklist below) → if valid, transition to the flashcard deck view.

**Failure path (any of these):** timeout, network error, malformed JSON, wrong shape, empty arrays, out-of-range index → show a clear, non-technical error message with a **Retry** button. The user's original input text must be preserved (not cleared) so they don't have to retype it. No crashes, no infinite spinners, no blank screens.

**Stale response guard:** if the user retries or resubmits before a prior request resolves, the earlier request's result must never overwrite the newer one. Use `AbortController` to cancel the in-flight request on resubmission, or tag each request with an incrementing ID and ignore responses that don't match the latest ID.

**Flashcard deck view:**
- Shows "Card X / N".
- Front of card visible by default; "Flip" button reveals the back.
- Once flipped, "Mark as known" / "Mark as unknown" buttons appear, plus "Next card".
- Track which card IDs were marked unknown.
- After the last card: summary screen — "You marked N cards as unknown" with buttons "Take full quiz" and "Retest marked cards" (if any were marked unknown).

**Quiz view:**
- Shows "Question X / N".
- Question text + 4 clickable options.
- On selection: show correct/incorrect state immediately (visually distinct — don't just rely on color, e.g. also use a checkmark/x icon or text label) plus the explanation text. Track score and wrong-answer IDs.
- "Next question" button advances.
- After the last question: results screen with score (e.g. "7/10 correct"), and if score < 100%, a "Retest wrong answers" button that re-runs the quiz using only the previously-missed questions. If 100%, congratulate and offer to review flashcards again.

---

## 6. Explicit failure-handling checklist (worth 20% — do not skip any of these)

Implement and manually test each of these before considering the project done:

1. Model returns malformed/unparseable JSON → caught, error UI shown, retry works.
2. Model returns valid JSON but wrong shape (missing `flashcards` key, etc.) → caught by validation, error UI shown.
3. Model returns empty arrays for flashcards or quiz → treated as a validation failure, not silently rendered as a blank deck.
4. `correctIndex` out of range or `options` array with wrong length → validation failure, error UI shown.
5. Network fails entirely (turn off network to test) → error UI shown, not a hang.
6. Request takes too long → client-side timeout fires, error UI shown, request aborted.
7. User submits twice quickly (double-click, or edits and resubmits during loading) → stale response is discarded, only the latest matters. Verify this by testing rapid resubmission.
8. Empty input → submit button stays disabled, no request is even attempted.

Write a short section in the README documenting how each of these is handled — this is explicitly called out in the brief as "most of the signal."

---

## 7. Build phases (commit after each phase — small, meaningful commits, not one giant commit)

> **Note on build order:** The API/backend is intentionally deferred to Phase 8. All frontend phases use a mock data layer (`src/lib/mockData.js`) that returns a hardcoded response matching the exact data contract. When the real API is ready, only one function in `useGenerate.js` needs to change — every component, validation, and state machine stays identical.

### Phase 1 — Scaffold ✅ Done
- `npm create vite@latest study-assistant -- --template react`
- Set up folder structure (see Section 9).
- Install dependencies: `lucide-react`.
- Build `InputForm`, `LoadingState`, `ErrorState`, `EmptyState` components.
- Basic `App.jsx` state machine (`idle` / `loading` / `error`) and two-panel layout.
- Commit: `chore: scaffold Vite React app`

### Phase 2 — Data contract + mock
- Create `src/lib/geminiSchema.js` — the `responseSchema` definition (used later by the serverless function).
- Create `src/lib/validateResponse.js` — full standalone validation logic matching every rule in Section 3.
- Create `src/lib/mockData.js` — a realistic hardcoded response matching the exact schema (used as the data source until the real API is wired up).
- Create `src/hooks/useGenerate.js` — fetch hook wired to the mock for now, but already includes `AbortController`, 30s timeout, and stale-response guard so none of that needs to be revisited later.
- Wire up `useGenerate` in `App.jsx` — replace the stubbed `handleSubmit` with the real hook. At this point: submit → loading → success (with validated mock data) or error should all work correctly.
- Install `@google/generative-ai` as a dependency (needed later, harmless now).
- Commit: `feat: data contract, validation, mock, and useGenerate hook`

### Phase 3 — Flashcard deck
- Build `FlashcardDeck` and `Flashcard` components per the flow in Section 5.
- Implement flip, mark known/unknown, next-card navigation, end-of-deck summary.
- Commit: `feat: build flashcard deck with flip and known/unknown tracking`

### Phase 4 — Quiz
- Build `Quiz` and `QuizQuestion` components per Section 5.
- Implement answer selection, correct/incorrect feedback + explanation, scoring, next-question navigation, results screen.
- Commit: `feat: build quiz with scoring and explanations`

### Phase 5 — Retest flow
- Implement "Retest wrong answers" using the tracked wrong-answer IDs from Phase 4.
- Implement "Retest marked cards" using tracked unknown-card IDs from Phase 3 (re-enter flashcard mode with just that subset).
- Commit: `feat: add retest flow for wrong quiz answers and unknown flashcards`

### Phase 6 — Failure-handling hardening pass
- Go through every item in Section 6's checklist individually and verify it. Fix anything that doesn't behave correctly.
- Add explicit UI polish for error states (icon/color, retry button placement).
- Commit: `fix: harden failure handling across all error paths`

### Phase 7 — Mobile responsiveness
- Test at ~375px width (iPhone SE) and ~390px (standard modern phone). Fix layout breaks, tap target sizes, font sizes.
- Commit: `style: responsive layout for mobile`

### Phase 8 — Real API (backend)
- Write `api/generate.js` — the serverless function that accepts `{ notes }`, calls Gemini with the schema from `geminiSchema.js`, and returns validated JSON or a normalized error object.
- Set up `.env.local` for `GEMINI_API_KEY`, confirm it's in `.gitignore`. **Never prefix with `VITE_`.**
- In `useGenerate.js`, swap the mock call for the real `fetch('/api/generate', ...)` call — this is the only file that changes.
- Test the function directly (e.g. via curl) before testing end-to-end in the browser.
- Commit: `feat: add Gemini serverless function and wire up real API`

### Phase 9 — README + AI-usage note
- Write the README (see Section 8 below for required contents).
- Commit: `docs: add README with setup, AI-usage note, limitations, time spent`

### Phase 10 — Deploy (preferred, not mandatory)
- Deploy to Vercel or Netlify. Set the `GEMINI_API_KEY` environment variable in the platform's dashboard — never commit it.
- Verify the deployed version works end-to-end, including error states.
- Commit (if any last fixes needed): `fix: deployment config`

### Phase 11 — Screen recording
- Record a short screen capture showing: empty state → successful generation → flashcard flow → quiz flow → retest flow → at least one deliberate failure case (e.g. throttle network to trigger a timeout, or temporarily break the API key to show the error state) → recovery via retry.

---

## 8. Required README sections

- **Setup:** exact steps to run locally (`npm install && npm start` should work per the brief — confirm the actual Vite command, likely `npm run dev`, and note it clearly if it differs from `npm start`).
- **Usage:** what the app does, how to use it.
- **AI-usage note:** be specific and honest about what AI tools (including Antigravity/Claude/etc.) were used for during this build — e.g. "used [tool] to scaffold component boilerplate and debug the validation logic; wrote the retry/abort logic and quiz scoring myself." Per the brief: "being honest about it counts in your favor."
- **Known limitations:** anything not implemented (e.g. no streaming, no sessions) and anything imperfect (e.g. validation doesn't catch every possible malformed case).
- **Time spent:** actual hours, broken down by phase if possible.
- **Failure-handling summary:** short list mapping each failure mode from Section 6 to how it's handled.

---

## 9. Suggested file structure

```
study-assistant/
  api/
    generate.js            # serverless function, holds API key (added in Phase 8)
  src/
    components/
      InputForm.jsx
      LoadingState.jsx
      ErrorState.jsx
      EmptyState.jsx
      FlashcardDeck.jsx
      Flashcard.jsx
      Quiz.jsx
      QuizQuestion.jsx
      ResultsScreen.jsx
    hooks/
      useGenerate.js        # fetch logic, AbortController, stale-response guard
                            # Phase 2: points to mockData; Phase 8: points to /api/generate
    lib/
      validateResponse.js   # schema validation, reusable/testable
      geminiSchema.js       # the responseSchema definition shared with backend
      mockData.js           # hardcoded response matching the data contract (Phase 2–7 only)
    App.jsx
    main.jsx
    index.css
  .env.local                # GEMINI_API_KEY (gitignored, added in Phase 8)
  .gitignore
  README.md
  package.json
```

---

## 10. Things to explicitly avoid

- Do not build a chat-style interface that just prints the model's text — this fails the assignment's one firm rule.
- Do not ship the Gemini API key in any client-side bundle or `.env` variable prefixed `VITE_` (those get exposed to the browser) — it must live only in the serverless function's environment.
- Do not trust `responseSchema`/structured-output mode alone — always validate independently on receipt.
- Do not skip the stale-response guard — this is explicitly named in the brief.
- Do not build any stretch goals (streaming, dark mode, sessions, multiple block types) until the core flow in Sections 5–6 is fully working and tested.
- Do not submit code that wasn't understood and explained live — the interview will include a live code walkthrough, a bug fix, and a small feature addition, so keep every piece simple enough to explain confidently.

---

## 11. Definition of done

Before calling this finished, confirm:
- [ ] All 8 items in Section 6's failure-handling checklist have been manually tested and pass.
- [ ] Full flow works: input → loading → flashcards → quiz → retest → results.
- [ ] Works on a mobile viewport.
- [ ] README complete with all 6 required sections from Section 8.
- [ ] Commit history shows small, meaningful, incremental commits (not one giant commit).
- [ ] API key is not present anywhere in the committed code or git history.
- [ ] Screen recording captured showing both success and at least one failure/recovery case.
- [ ] `npm install && npm run dev` (or `npm start`, confirm which) works from a clean clone.

Work through the phases in order. After each phase, pause and let me review before moving to the next, unless I say to proceed straight through.
