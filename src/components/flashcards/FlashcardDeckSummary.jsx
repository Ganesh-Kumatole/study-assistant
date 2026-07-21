import { BookOpen, RotateCcw } from 'lucide-react';

function FlashcardDeckSummary({
  total,
  unknownCount,
  onStartQuiz,
  onReviewCards,
}) {
  return (
    <section className="state-panel deck-summary">
      <div className="state-kicker">Deck complete</div>
      <h2 id="summary-title">
        {unknownCount === 0
          ? 'You marked all cards as known!'
          : `You marked ${unknownCount} of ${total} card${unknownCount !== 1 ? 's' : ''} as unknown.`}
      </h2>
      <p>
        {unknownCount === 0
          ? 'Great work. Ready to test yourself?'
          : 'You can take the full quiz or review the cards you found tricky.'}
      </p>

      <div className="form-actions">
        <button className="primary-action" type="button" onClick={onStartQuiz}>
          <BookOpen size={17} />
          Take full quiz
        </button>

        {onReviewCards && (
          <button
            className="ghost-action"
            type="button"
            onClick={onReviewCards}
          >
            <RotateCcw size={17} />
            Review {unknownCount} unknown card{unknownCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>
    </section>
  );
}

export default FlashcardDeckSummary;
