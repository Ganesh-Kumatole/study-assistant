import { BookOpen, RotateCcw } from 'lucide-react';

function DeckSummary({ total, unknownCount, onStartQuiz, onRetestCards }) {
  return (
    <section className="state-panel deck-summary" aria-labelledby="summary-title">
      <div className="state-kicker">Deck complete</div>
      <h2 id="summary-title">
        {unknownCount === 0
          ? 'You marked all cards as known!'
          : `You marked ${unknownCount} of ${total} card${unknownCount !== 1 ? 's' : ''} as unknown.`}
      </h2>
      <p>
        {unknownCount === 0
          ? 'Great work. Ready to test yourself?'
          : 'You can take the full quiz or focus on the cards you found tricky.'}
      </p>

      <div className="form-actions">
        <button className="primary-action" type="button" onClick={onStartQuiz}>
          <BookOpen size={17} aria-hidden="true" />
          Take full quiz
        </button>

        {onRetestCards && (
          <button className="ghost-action" type="button" onClick={onRetestCards}>
            <RotateCcw size={17} aria-hidden="true" />
            Retest {unknownCount} unknown card{unknownCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>
    </section>
  );
}

export default DeckSummary;
