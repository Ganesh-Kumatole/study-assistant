import { BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';

const previewItems = [
  {
    id: 1,
    icon: BookOpen,
    title: 'Flashcards',
    description:
      'Front/back cards will support flipping and known/unknown tracking.',
  },
  {
    id: 2,
    icon: CheckCircle2,
    title: 'Quiz',
    description:
      'Four-option questions will show feedback, explanations, and score.',
  },
  {
    id: 3,
    icon: RotateCcw,
    title: 'Retest',
    description:
      'Missed answers and unknown cards will become focused review sets.',
  },
];

function InitialState() {
  return (
    <section className="state-panel empty-state">
      <div className="state-kicker">Output workspace</div>
      <h2 id="empty-title">Your generated study set will appear here.</h2>
      <p>
        Flashcards, quiz questions, and retest options will appear here after
        generation completes.
      </p>

      <div className="preview-stack">
        {previewItems.map(({ id, icon: Icon, title, description }) => (
          <article className="preview-item" key={id}>
            <span className="preview-icon">
              <Icon size={18} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InitialState;
