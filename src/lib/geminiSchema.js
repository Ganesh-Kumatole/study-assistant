export const responseSchema = {
  type: 'object',
  properties: {
    topic: { type: 'string' },
    flashcards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          front: { type: 'string' },
          back: { type: 'string' },
        },
        required: ['id', 'front', 'back'],
      },
    },
    quiz: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          question: { type: 'string' },
          options: {
            type: 'array',
            items: { type: 'string' },
            minItems: 4,
            maxItems: 4,
          },
          correctIndex: { type: 'integer', minimum: 0, maximum: 3 },
          explanation: { type: 'string' },
        },
        required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
      },
    },
  },
  required: ['topic', 'flashcards', 'quiz'],
};
