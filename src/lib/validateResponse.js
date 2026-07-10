function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateFlashcard(card) {
  return (
    card !== null &&
    typeof card === 'object' &&
    isNonEmptyString(card.id) &&
    isNonEmptyString(card.front) &&
    isNonEmptyString(card.back)
  );
}

function validateQuizItem(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    isNonEmptyString(item.id) &&
    isNonEmptyString(item.question) &&
    Array.isArray(item.options) &&
    item.options.length === 4 &&
    item.options.every(isNonEmptyString) &&
    Number.isInteger(item.correctIndex) &&
    item.correctIndex >= 0 &&
    item.correctIndex <= 3 &&
    isNonEmptyString(item.explanation)
  );
}

function dedupeById(items) {
  const seen = new Set();
  return items.map((item) => {
    if (seen.has(item.id)) {
      return { ...item, id: crypto.randomUUID() };
    }
    seen.add(item.id);
    return item;
  });
}

/**
 * Validates and normalises a raw response object against the data contract.
 * Returns { valid: true, data } on success or { valid: false, reason } on failure.
 */
export function validateResponse(raw) {
  if (raw === null || typeof raw !== 'object') {
    return { valid: false, reason: 'Response is not an object.' };
  }

  if (!isNonEmptyString(raw.topic)) {
    return { valid: false, reason: 'Missing or empty "topic" field.' };
  }

  if (!Array.isArray(raw.flashcards) || raw.flashcards.length === 0) {
    return { valid: false, reason: '"flashcards" must be a non-empty array.' };
  }

  if (!Array.isArray(raw.quiz) || raw.quiz.length === 0) {
    return { valid: false, reason: '"quiz" must be a non-empty array.' };
  }

  if (!raw.flashcards.every(validateFlashcard)) {
    return {
      valid: false,
      reason: 'One or more flashcards have invalid or missing fields.',
    };
  }

  if (!raw.quiz.every(validateQuizItem)) {
    return {
      valid: false,
      reason:
        'One or more quiz items have invalid fields, wrong option count, or out-of-range correctIndex.',
    };
  }

  return {
    valid: true,
    data: {
      topic: raw.topic.trim(),
      flashcards: dedupeById(raw.flashcards),
      quiz: dedupeById(raw.quiz),
    },
  };
}
