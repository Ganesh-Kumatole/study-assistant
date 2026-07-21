import { CheckCircle2, XCircle } from 'lucide-react';

function QuizQuestion({ item, index, total, onAnswer }) {
  return (
    <div className="quiz-question-wrapper">
      <p className="card-counter">
        Question {index + 1} / {total}
      </p>

      <p className="question-text">{item.question}</p>

      <ol className="options-list">
        {item.options.map((option, i) => {
          const isSelected = item.selectedIndex === i;
          const isAnswered = item.selectedIndex !== undefined;
          const isCorrect = i === item.correctIndex;

          let stateClass = '';
          let label = null;

          if (isAnswered) {
            if (isSelected && isCorrect) {
              stateClass = 'option-correct';
              label = (
                <span className="option-label">
                  <CheckCircle2 size={15} /> Correct
                </span>
              );
            } else if (isSelected && !isCorrect) {
              stateClass = 'option-incorrect';
              label = (
                <span className="option-label">
                  <XCircle size={15} /> Incorrect
                </span>
              );
            } else if (!isSelected && isCorrect) {
              stateClass = 'option-revealed';
              label = (
                <span className="option-label">
                  <CheckCircle2 size={15} /> Correct answer
                </span>
              );
            }
          }

          return (
            <li key={i}>
              <button
                className={`option-btn ${stateClass}`}
                type="button"
                disabled={isAnswered}
                onClick={() => onAnswer(i)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="option-text">{option}</span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>

      {item.selectedIndex !== undefined && (
        <div className="explanation-box" role="note">
          <span className="explanation-label">Explanation</span>
          <p>{item.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default QuizQuestion;
