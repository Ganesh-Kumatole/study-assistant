import { useState } from 'react';
import HeroBand from './components/layout/HeroBand.jsx';
import InputForm from './components/InputForm.jsx';
import WorkspacePanel from './components/layout/WorkspacePanel.jsx';
import { useGenerate } from './hooks/useGenerate.js';

const MIN_INPUT_LENGTH = 10;

function App() {
  const [notes, setNotes] = useState('');
  const [activeView, setActiveView] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [flashcardSubset, setFlashcardSubset] = useState(null); // null means show the full deck
  const [deckKey, setDeckKey] = useState(0); // bumped to remount FlashcardDeck on retest
  const [quizKey, setQuizKey] = useState(0); // bumped to remount Quiz on retest
  const { status, data, errorMessage, generate, reset } = useGenerate();

  const trimmedNotes = notes.trim();
  const canSubmit = trimmedNotes.length > MIN_INPUT_LENGTH;
  const isLoading = status === 'loading';

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || isLoading) return;
    setActiveView('flashcards');
    setQuizQuestions(null);
    setFlashcardSubset(null);
    setDeckKey((k) => k + 1);
    generate(trimmedNotes);
  }

  function handleClear() {
    setNotes('');
    setActiveView('flashcards');
    setQuizQuestions(null);
    setFlashcardSubset(null);
    setDeckKey((k) => k + 1);
    reset();
  }

  function handleStartQuiz(questions) {
    setQuizQuestions(questions);
    setActiveView('quiz');
    setQuizKey((k) => k + 1);
  }

  function handleRetestWrong(wrongIds) {
    const subset = data.quiz.filter((q) => wrongIds.includes(q.id));
    setQuizQuestions(subset);
    setActiveView('quiz');
    setQuizKey((k) => k + 1);
  }

  function handleRetestCards(unknownIds) {
    const subset = data.flashcards.filter((c) => unknownIds.includes(c.id));
    setFlashcardSubset(subset);
    setActiveView('flashcards');
    setDeckKey((k) => k + 1);
  }

  function handleBackToFlashcards() {
    setFlashcardSubset(null);
    setActiveView('flashcards');
    setDeckKey((k) => k + 1);
  }

  return (
    <main className="app-shell">
      <HeroBand />

      <section
        className="workspace-grid"
        aria-label="Study generation workspace"
      >
        <InputForm
          notes={notes}
          minLength={MIN_INPUT_LENGTH}
          canSubmit={canSubmit}
          isLocked={isLoading}
          onNotesChange={setNotes}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <WorkspacePanel
          status={status}
          data={data}
          errorMessage={errorMessage}
          activeView={activeView}
          quizQuestions={quizQuestions}
          flashcardSubset={flashcardSubset}
          deckKey={deckKey}
          quizKey={quizKey}
          onRetry={reset}
          onStartQuiz={handleStartQuiz}
          onRetestWrong={handleRetestWrong}
          onRetestCards={handleRetestCards}
          onBackToFlashcards={handleBackToFlashcards}
        />
      </section>
    </main>
  );
}

export default App;
