import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Flashcard from './Flashcard.jsx';
import DeckSummary from './DeckSummary.jsx';

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

  function handleMark(id, known) {
    setMarks((prev) => ({ ...prev, [id]: known }));
  }

  function handleNext() {
    if (!isLastCard) {
      setCurrentIndex((i) => i + 1);
      setDeckKey((k) => k + 1);
    }
  }

  const currentCard = flashcards[currentIndex];
  const isCurrentMarked = marks[currentCard.id] !== undefined;

  if (isDone) {
    return (
      <DeckSummary
        total={flashcards.length}
        unknownCount={unknownIds.length}
        onStartQuiz={onStartQuiz}
        onRetestCards={unknownIds.length > 0 ? () => onRetestCards(unknownIds) : null}
      />
    );
  }

  return (
    <section className="state-panel flashcard-deck" aria-labelledby="deck-title">
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

export default FlashcardDeck;
