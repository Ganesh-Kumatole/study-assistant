import { useState, useCallback } from 'react';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import Flashcard from './Flashcard.jsx';

function FlashcardDeck({ flashcards, topic, onStartQuiz, onRetestCards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [marks, setMarks] = useState({}); // { [cardId]: true (known) | false (unknown) }
  const [deckKey, setDeckKey] = useState(0); // remounts Flashcard to reset flip state on navigation

  const isLastCard = currentIndex === flashcards.length - 1;
  const allMarked = Object.keys(marks).length === flashcards.length;
  const isDone = isLastCard && allMarked;

  const unknownIds = Object.entries(marks)
    .filter(([, known]) => !known)
    .map(([id]) => id);

  const handleMark = useCallback((id, known) => {
    setMarks((prev) => ({ ...prev, [id]: known }));
  }, []);

  function handleNext() {
    if (!isLastCard) {
      setCurrentIndex((i) => i + 1);
      setDeckKey((k) => k + 1);
    }
  }

  const currentCard = flashcards[currentIndex];
  const currentMark = marks[currentCard.id];
  const isCurrentMarked = currentMark !== undefined;

  if (isDone) {
    return (
      <DeckSummary
        total={flashcards.length}
        unknownCount={unknownIds.length}
        onStartQuiz={onStartQuiz}
        onRetestCards={
          unknownIds.length > 0 ? () => onRetestCards(unknownIds) : null
        }
      />
    );
  }

  return (
    <section
      className="state-panel flashcard-deck"
      aria-labelledby="deck-title"
    >
      <div className="state-kicker" id="deck-title">
        {topic}
      </div>

      <Flashcard
        key={deckKey}
        card={currentCard}
        index={currentIndex}
        total={flashcards.length}
        onMark={handleMark}
      />

      {isCurrentMarked && (
        <button
          className="primary-action compact"
          type="button"
          onClick={handleNext}
          disabled={isLastCard}
        >
          <ArrowRight size={17} aria-hidden="true" />
          {isLastCard ? 'Last card' : 'Next card'}
        </button>
      )}
    </section>
  );
}

function DeckSummary({ total, unknownCount, onStartQuiz, onRetestCards }) {
  return (
    <section
      className="state-panel deck-summary"
      aria-labelledby="summary-title"
    >
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
          <button
            className="ghost-action"
            type="button"
            onClick={onRetestCards}
          >
            <RotateCcw size={17} aria-hidden="true" />
            Retest {unknownCount} unknown card{unknownCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>
    </section>
  );
}

export default FlashcardDeck;
