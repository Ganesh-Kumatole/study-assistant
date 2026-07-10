import { BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';

const previewItems = [
  {
    icon: BookOpen,
    title: 'Flashcards',
    description:
      'Front/back cards will support flipping and known/unknown tracking.',
  },
  {
    icon: CheckCircle2,
    title: 'Quiz',
    description:
      'Four-option questions will show feedback, explanations, and score.',
  },
  {
    icon: RotateCcw,
    title: 'Retest',
    description:
      'Missed answers and unknown cards will become focused review sets.',
  },
];

function EmptyState() {
  return (
    <section className="state-panel empty-state" aria-labelledby="empty-title">
      <div className="state-kicker">Output workspace</div>
      <h2 id="empty-title">Your generated study set will appear here.</h2>
      <p>
        Flashcards, quiz questions, and retest options will appear here after
        generation completes.
      </p>

      <div className="preview-stack" aria-label="Upcoming study sections">
        {previewItems.map(({ icon: Icon, title, description }) => (
          <article className="preview-item" key={title}>
            <span className="preview-icon" aria-hidden="true">
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

export default EmptyState;
