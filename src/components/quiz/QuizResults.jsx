import { BookOpen, RotateCcw } from 'lucide-react';

function QuizResults({ score, total, wrongIds, onRetestWrong, onBackToFlashcards }) {
  const isPerfect = score === total;

  return (
    <section className="state-panel quiz-results" aria-labelledby="results-title">
      <div className="state-kicker">Results</div>

      <div className="score-display" aria-label={`Score: ${score} out of ${total}`}>
        <span className="score-fraction">
          {score}
          <span className="score-sep">/{total}</span>
        </span>
        <span className="score-label">correct</span>
      </div>

      <h2 id="results-title">
        {isPerfect
          ? 'Perfect score — well done!'
          : score / total >= 0.7
            ? 'Good effort! A few to review.'
            : 'Keep at it — retesting helps.'}
      </h2>

      <div className="form-actions">
        {!isPerfect && (
          <button
            className="primary-action"
            type="button"
            onClick={() => onRetestWrong(wrongIds)}
          >
            <RotateCcw size={17} aria-hidden="true" />
            Retest {wrongIds.length} wrong answer{wrongIds.length !== 1 ? 's' : ''}
          </button>
        )}

        <button
          className={isPerfect ? 'primary-action' : 'ghost-action'}
          type="button"
          onClick={onBackToFlashcards}
        >
          <BookOpen size={17} aria-hidden="true" />
          Review flashcards
        </button>
      </div>
    </section>
  );
}

export default QuizResults;
