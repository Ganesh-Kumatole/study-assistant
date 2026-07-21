import { Loader2 } from 'lucide-react';

function LoadingState() {
  return (
    <section className="state-panel loading-state">
      <span className="state-icon loading" aria-hidden="true">
        <Loader2 size={24} />
      </span>
      <div>
        <div className="state-kicker">Generating</div>
        <h2>Building your study set...</h2>
        <p>
          Flashcards and quiz questions will be validated before they appear
          here.
        </p>
      </div>
    </section>
  );
}

export default LoadingState;
