import { BookOpen, CheckCircle2 } from 'lucide-react';

const featureHighlights = [
  'Flashcards, quizzes, and retests stay in one flow',
  'Explanations make every quiz answer teachable',
  'Drafts are preserved when something needs a retry',
];

function HeroBand() {
  return (
    <section className="hero-band" aria-labelledby="app-title">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          <BookOpen size={24} strokeWidth={2.2} />
        </span>
        <span className="brand-name">Study Assistant</span>
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Focused study workspace</p>
        <h1 id="app-title">Turn messy notes into a study session.</h1>
        <p className="lede">
          A focused workspace for generating flashcards, quiz questions, and
          retest loops from a single study prompt.
        </p>
      </div>

      <ul className="quality-list" aria-label="Build priorities">
        {featureHighlights.map((item) => (
          <li key={item}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HeroBand;
