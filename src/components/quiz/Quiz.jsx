import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import QuizQuestion from './QuizQuestion.jsx';
import QuizResults from './QuizResults.jsx';

function Quiz({ questions, onRetestWrong, onBackToFlashcards }) {
  // each item tracks the question data + the user's selected answer
  const [items, setItems] = useState(() =>
    questions.map((q) => ({ ...q, selectedIndex: undefined })),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setisDone] = useState(false);

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
      setisDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (isDone) {
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
    <section className="state-panel quiz-panel">
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
          <ArrowRight size={17} />
          {isLastQuestion ? 'See results' : 'Next question'}
        </button>
      )}
    </section>
  );
}

export default Quiz;
