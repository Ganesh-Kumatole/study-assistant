import { BookOpen, CheckCircle2 } from 'lucide-react';

const featureHighlights = [
  {
    id: 1,
    value: 'Flashcards, quizzes, and retests stay in one flow',
  },
  {
    id: 2,
    value: 'Explanations make every quiz answer teachable',
  },
  {
    id: 3,
    value: 'Drafts are preserved when something needs a retry',
  },
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
        {featureHighlights.map((feature) => (
          <li key={feature.id}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{feature.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HeroBand;
