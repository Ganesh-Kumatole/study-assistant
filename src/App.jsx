import { BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';

const phaseItems = [
  'Frontend scaffold is ready',
  'AI/API integration is intentionally paused',
  'Interactive study flow comes next',
];

function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="app-title">
        <div className="intro-mark" aria-hidden="true">
          <BookOpen size={28} strokeWidth={2.2} />
        </div>

        <div className="intro-copy">
          <p className="eyebrow">Frontend internship assignment</p>
          <h1 id="app-title">Study Assistant</h1>
          <p className="lede">
            A focused React workspace for turning study notes into flashcards,
            quiz questions, and retest flows.
          </p>
        </div>
      </section>

      <section className="phase-panel" aria-label="Current build status">
        <div className="phase-header">
          <RotateCcw size={20} aria-hidden="true" />
          <h2>Phase 1 Scaffold</h2>
        </div>

        <ul className="phase-list">
          {phaseItems.map((item) => (
            <li key={item}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
