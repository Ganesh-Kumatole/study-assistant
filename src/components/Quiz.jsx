import { useState } from 'react';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import QuizQuestion from './QuizQuestion.jsx';

function Quiz({ questions, onRetestWrong, onBackToFlashcards }) {
  // Each item: { ...question, selectedIndex: undefined | number }
  const [items, setItems] = useState(() =>
    questions.map((q) => ({ ...q, selectedIndex: undefined })),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  const current = items[currentIndex];
  const isAnswered = current.selectedIndex !== undefined;
  const isLastQuestion = currentIndex === items.length - 1;

  function handleAnswer(selectedIndex) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === currentIndex ? { ...item, selectedIndex } : item,
      ),
    );
  }

  function handleNext() {
    if (isLastQuestion) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (done) {
    const score = items.filter(
      (item) => item.selectedIndex === item.correctIndex,
    ).length;
    const wrongIds = items
      .filter((item) => item.selectedIndex !== item.correctIndex)
      .map((item) => item.id);

    return (
      <QuizResults
        score={score}
        total={items.length}
        wrongIds={wrongIds}
        onRetestWrong={onRetestWrong}
        onBackToFlashcards={onBackToFlashcards}
      />
    );
  }

  return (
    <section className="state-panel quiz-panel" aria-labelledby="quiz-title">
      <div className="state-kicker" id="quiz-title">
        Quiz
      </div>

      <QuizQuestion
        item={current}
        index={currentIndex}
        total={items.length}
        onAnswer={handleAnswer}
      />

      {isAnswered && (
        <button
          className="primary-action compact"
          type="button"
          onClick={handleNext}
        >
          <ArrowRight size={17} aria-hidden="true" />
          {isLastQuestion ? 'See results' : 'Next question'}
        </button>
      )}
    </section>
  );
}

function QuizResults({
  score,
  total,
  wrongIds,
  onRetestWrong,
  onBackToFlashcards,
}) {
  const isPerfect = score === total;

  return (
    <section
      className="state-panel quiz-results"
      aria-labelledby="results-title"
    >
      <div className="state-kicker">Results</div>

      <div
        className="score-display"
        aria-label={`Score: ${score} out of ${total}`}
      >
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
            Retest {wrongIds.length} wrong answer
            {wrongIds.length !== 1 ? 's' : ''}
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

export default Quiz;
