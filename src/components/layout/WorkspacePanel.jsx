import { InitialState, ErrorState, LoadingState } from '../states';
import FlashcardDeck from '../flashcards/FlashcardDeck.jsx';
import Quiz from '../quiz/Quiz.jsx';

function WorkspacePanel({
  status,
  data,
  errorMessage,
  activeView,
  quizQuestions,
  flashcardSubset,
  deckKey,
  quizKey,
  onRetry,
  onStartQuiz,
  onRetestWrong,
  onReviewCards,
  onBackToFlashcards,
}) {
  if (status === 'loading') return <LoadingState />;

  if (status === 'error') {
    return (
      <ErrorState
        title="Study generation is temporarily unavailable"
        message={
          errorMessage ||
          'Your notes are preserved, so you can retry without rebuilding your prompt.'
        }
        onRetry={onRetry}
      />
    );
  }

  if (status === 'success' && data) {
    if (activeView === 'quiz' && quizQuestions) {
      return (
        <Quiz
          key={quizKey}
          questions={quizQuestions}
          onRetestWrong={onRetestWrong}
          onBackToFlashcards={onBackToFlashcards}
        />
      );
    }

    const cards = flashcardSubset ?? data.flashcards;
    const isReview = flashcardSubset !== null;

    return (
      <FlashcardDeck
        key={deckKey}
        flashcards={cards}
        topic={
          isReview
            ? `Retesting ${cards.length} unknown card${cards.length !== 1 ? 's' : ''}`
            : data.topic
        }
        onStartQuiz={() => onStartQuiz(data.quiz)}
        onReviewCards={onReviewCards}
      />
    );
  }

  return <InitialState />;
}

export default WorkspacePanel;
