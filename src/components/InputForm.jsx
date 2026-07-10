import { ArrowRight, FileText, Trash2 } from 'lucide-react';

function InputForm({
  notes,
  minLength,
  canSubmit,
  isLocked,
  onNotesChange,
  onSubmit,
  onClear,
}) {
  const trimmedLength = notes.trim().length;
  const remainingCharacters = Math.max(0, minLength + 1 - trimmedLength);
  const hasNotes = notes.length > 0;
  const helperText = canSubmit
    ? 'Ready to generate when the study source looks good.'
    : `${remainingCharacters} more characters needed before generation.`;

  return (
    <form className="input-panel" onSubmit={onSubmit}>
      <div className="panel-heading">
        <span className="panel-icon" aria-hidden="true">
          <FileText size={20} />
        </span>
        <div>
          <p className="eyebrow">Source material</p>
          <h2>Paste notes or name a topic</h2>
        </div>
      </div>

      <label className="field-label" htmlFor="study-notes">
        Study prompt
      </label>
      <textarea
        id="study-notes"
        value={notes}
        readOnly={isLocked}
        rows={12}
        onChange={(event) => onNotesChange(event.target.value)}
        aria-describedby="study-notes-help study-notes-count"
        placeholder="Example: Photosynthesis overview, key terms from my biology notes, and the difference between light-dependent and Calvin cycle reactions..."
      />

      <div className="field-footer">
        <p id="study-notes-help">{helperText}</p>
        <p id="study-notes-count">{trimmedLength} characters</p>
      </div>

      <div className="form-actions">
        <button
          className="primary-action"
          type="submit"
          disabled={!canSubmit || isLocked}
        >
          <ArrowRight size={18} aria-hidden="true" />
          Generate study set
        </button>

        <button
          className="ghost-action"
          type="button"
          disabled={!hasNotes || isLocked}
          onClick={onClear}
          aria-label="Clear study prompt"
        >
          <Trash2 size={18} aria-hidden="true" />
          Clear
        </button>
      </div>
    </form>
  );
}

export default InputForm;
