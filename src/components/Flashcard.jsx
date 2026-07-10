import { useState } from 'react';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

function Flashcard({ card, index, total, onMark }) {
  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    setFlipped((f) => !f);
  }

  function handleMark(known) {
    onMark(card.id, known);
  }

  return (
    <div className="flashcard-wrapper">
      <p className="card-counter" aria-live="polite">
        Card {index + 1} / {total}
      </p>

      <div
        className={`flashcard${flipped ? ' is-flipped' : ''}`}
        aria-label={flipped ? `Back: ${card.back}` : `Front: ${card.front}`}
      >
        <div className="flashcard-face flashcard-front">
          <span className="face-label">Front</span>
          <p>{card.front}</p>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="face-label">Back</span>
          <p>{card.back}</p>
        </div>
      </div>

      <div className="card-actions">
        <button className="ghost-action" type="button" onClick={handleFlip}>
          <RotateCcw size={17} aria-hidden="true" />
          {flipped ? 'Show front' : 'Flip'}
        </button>

        {flipped && (
          <>
            <button
              className="mark-action mark-known"
              type="button"
              onClick={() => handleMark(true)}
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              Known
            </button>
            <button
              className="mark-action mark-unknown"
              type="button"
              onClick={() => handleMark(false)}
            >
              <XCircle size={17} aria-hidden="true" />
              Unknown
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Flashcard;
