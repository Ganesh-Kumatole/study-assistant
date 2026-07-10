import { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import EmptyState from './components/EmptyState.jsx';
import ErrorState from './components/ErrorState.jsx';
import InputForm from './components/InputForm.jsx';
import LoadingState from './components/LoadingState.jsx';
import FlashcardDeck from './components/FlashcardDeck.jsx';
import Quiz from './components/Quiz.jsx';
import { useGenerate } from './hooks/useGenerate.js';

const MIN_NOTES_LENGTH = 10;

const qualityNotes = [
  'Flashcards, quizzes, and retests stay in one flow',
  'Explanations make every quiz answer teachable',
  'Drafts are preserved when something needs a retry',
];

function App() {
  const [notes, setNotes] = useState('');
  const [activeView, setActiveView] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [flashcardSubset, setFlashcardSubset] = useState(null); // null = full deck
  const [deckKey, setDeckKey] = useState(0); // incremented to remount FlashcardDeck fresh
  const { status, data, errorMessage, generate, reset } = useGenerate();

  const trimmedNotes = notes.trim();
  const canSubmit = trimmedNotes.length > MIN_NOTES_LENGTH;
  const isLoading = status === 'loading';

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || isLoading) return;
    setActiveView('flashcards');
    setQuizQuestions(null);
    setFlashcardSubset(null);
    setDeckKey((k) => k + 1);
    generate(trimmedNotes);
  }

  function handleRetry() {
    reset();
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
  }

  function handleRetestWrong(wrongIds) {
    const subset = data.quiz.filter((q) => wrongIds.includes(q.id));
    setQuizQuestions(subset);
    setActiveView('quiz');
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
      <section className="hero-band" aria-labelledby="app-title">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <BookOpen size={24} strokeWidth={2.2} />
          </span>
          <span className="brand-name">Study Assistant</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Focused study workspace</p>
          <h1 id="app-title">Turn messy notes into a study session.</h1>
          <p className="lede">
            A focused workspace for generating flashcards, quiz questions, and
            retest loops from a single study prompt.
          </p>
        </div>

        <ul className="quality-list" aria-label="Build priorities">
          {qualityNotes.map((note) => (
            <li key={note}>
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="workspace-grid"
        aria-label="Study generation workspace"
      >
        <InputForm
          notes={notes}
          minLength={MIN_NOTES_LENGTH}
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
          onRetry={handleRetry}
          onStartQuiz={handleStartQuiz}
          onRetestWrong={handleRetestWrong}
          onRetestCards={handleRetestCards}
          onBackToFlashcards={handleBackToFlashcards}
        />
      </section>
    </main>
  );
}

function WorkspacePanel({
  status,
  data,
  errorMessage,
  activeView,
  quizQuestions,
  flashcardSubset,
  deckKey,
  onRetry,
  onStartQuiz,
  onRetestWrong,
  onRetestCards,
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
          questions={quizQuestions}
          onRetestWrong={onRetestWrong}
          onBackToFlashcards={onBackToFlashcards}
        />
      );
    }

    const cards = flashcardSubset ?? data.flashcards;
    const isRetest = flashcardSubset !== null;

    return (
      <FlashcardDeck
        key={deckKey}
        flashcards={cards}
        topic={
          isRetest
            ? `Retesting ${cards.length} unknown card${cards.length !== 1 ? 's' : ''}`
            : data.topic
        }
        onStartQuiz={() => onStartQuiz(data.quiz)}
        onRetestCards={onRetestCards}
      />
    );
  }

  return <EmptyState />;
}

export default App;
