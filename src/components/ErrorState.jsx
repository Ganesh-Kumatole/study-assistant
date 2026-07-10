import { AlertTriangle, RotateCcw } from 'lucide-react';

function ErrorState({ title, message, meta, onRetry }) {
  return (
    <section
      className="state-panel error-state"
      role="alert"
      aria-labelledby="error-title"
    >
      <span className="state-icon warning" aria-hidden="true">
        <AlertTriangle size={24} />
      </span>

      <div>
        <div className="state-kicker">Needs attention</div>
        <h2 id="error-title">{title}</h2>
        <p>{message}</p>
        {meta ? <p className="state-meta">{meta}</p> : null}
      </div>

      <button
        className="primary-action compact"
        type="button"
        onClick={onRetry}
      >
        <RotateCcw size={18} aria-hidden="true" />
        Retry from saved notes
      </button>
    </section>
  );
}

export default ErrorState;
