import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Flashcard from './Flashcard.jsx';
import FlashcardDeckSummary from './FlashcardDeckSummary.jsx';

function FlashcardDeck({ flashcards, topic, onStartQuiz, onReviewCards }) {
  const [currentIndex, setCurrentIndex] = useState(0); // index of current card
  const [marks, setMarks] = useState({}); // { [cardId]: true (known) | false (unknown) }
  const [localKey, setlocalKey] = useState(0); // remounts flashcard to reset flip state

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
      setlocalKey((k) => k + 1);
    }
  }

  const currentCard = flashcards[currentIndex];
  const isCurrentMarked = marks[currentCard.id] !== undefined;

  if (isDone) {
    return (
      <FlashcardDeckSummary
        total={flashcards.length}
        unknownCount={unknownIds.length}
        onStartQuiz={onStartQuiz}
        onReviewCards={
          unknownIds.length > 0 ? () => onReviewCards(unknownIds) : null
        }
      />
    );
  }

  return (
    <section className="state-panel flashcard-deck">
      <div className="state-kicker" id="deck-title">
        {topic}
      </div>

      <Flashcard
        key={localKey}
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
          <ArrowRight size={17} />
          {isLastCard ? 'Last card' : 'Next card'}
        </button>
      )}
    </section>
  );
}

export default FlashcardDeck;
