import { AlertTriangle, RotateCcw } from 'lucide-react';

function ErrorState({ title, message, meta, onRetry }) {
  return (
    <section className="state-panel error-state">
      <span className="state-icon warning" aria-hidden="true">
        <AlertTriangle size={24} />
      </span>

      <div>
        <div className="state-kicker">Needs attention</div>
        <h2 id="error-title">{title}</h2>
        <p>{message}</p>
      </div>

      <button
        className="primary-action compact"
        type="button"
        onClick={() => onRetry()}
      >
        <RotateCcw size={18} />
        Retry from saved notes
      </button>
    </section>
  );
}

export default ErrorState;
