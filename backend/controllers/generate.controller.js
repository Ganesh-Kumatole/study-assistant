import { GoogleGenAI } from '@google/genai';
import { responseSchema } from '../../src/lib/geminiSchema.js';

const MODEL = 'gemini-3.6-flash';

const SYSTEM_PROMPT = `You are a study assistant. Given the user's notes or topic, generate a study set.
Return ONLY a JSON object — no markdown, no extra text.
Generate between 4 and 8 flashcards and between 4 and 8 quiz questions.
Each flashcard must have a unique id, a front (question/term), and a back (answer/explanation).
Each quiz question must have a unique id, a question, exactly 4 options, a correctIndex (0–3), and a clear explanation.
All fields are required — never return null or empty strings.`;

const MAX_INPUT_LENGTH = 10000;

export async function generateResponseHandler(req, res) {
  // validate & transform (optional) the req

  // validate request method
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: true,
      message: 'Method not allowed. Use POST.',
    });
  }

  // validate request body
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      error: true,
      message: 'Invalid request body. Expected a JSON object.',
    });
  }

  // validate presence of notes
  if (!req.body.hasOwnProperty('notes')) {
    return res.status(400).json({
      error: true,
      message: 'Missing required field: notes.',
    });
  }

  // validate typeof notes
  if (typeof req.body.notes !== 'string') {
    return res.status(400).json({
      error: true,
      message: 'notes must be a string.',
    });
  }

  // validate non-empty value of notes
  if (!req.body.notes || !req.body.notes.trim()) {
    return res
      .status(400)
      .json({ error: true, message: 'Notes are required.' });
  }

  // validate minimum length of notes
  if (req.body.notes.trim().length < 10) {
    return res.status(400).json({
      error: true,
      message: 'Notes must be at least 10 characters long.',
    });
  }

  // validate maximum length of notes
  if (req.body.notes.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      error: true,
      message: `Notes exceed maximum length of ${MAX_INPUT_LENGTH} characters.`,
    });
  }

  const trimmedNotes = req.body.notes.trim();

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.interactions.create({
      model: MODEL,
      stream: false,
      input: trimmedNotes,
      system_instruction: SYSTEM_PROMPT,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: responseSchema,
      },
    });

    const data = JSON.parse(response.output_text);

    console.log('response.output_text: ', data);

    return res.status(200).json(data);
  } catch (err) {
    const status = err?.status ?? err?.httpStatus ?? 500;

    if (status === 401 || status === 403)
      return res
        .status(500)
        .json({ error: true, message: 'API key invalid or unauthorised.' });

    if (status === 429)
      return res.status(429).json({
        error: true,
        message: 'Rate limit reached. Please wait a moment and retry.',
      });

    if (err instanceof SyntaxError)
      return res
        .status(500)
        .json({ error: true, message: 'Model returned unparseable output.' });

    console.error('Generation error:', err.message);
    return res
      .status(500)
      .json({ error: true, message: 'Generation failed. Please retry.' });
  }
}
