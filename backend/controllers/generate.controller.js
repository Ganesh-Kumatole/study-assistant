import { GoogleGenAI } from '@google/genai';
import { responseSchema } from '../../src/lib/geminiSchema.js';

const MODEL = 'models/gemini-3.5-flash';

const SYSTEM_PROMPT = `You are a study assistant. Given the user's notes or topic, generate a study set.
Return ONLY a JSON object — no markdown, no extra text.
Generate between 4 and 8 flashcards and between 4 and 8 quiz questions.
Each flashcard must have a unique id, a front (question/term), and a back (answer/explanation).
Each quiz question must have a unique id, a question, exactly 4 options, a correctIndex (0–3), and a clear explanation.
All fields are required — never return null or empty strings.`;

export async function generate(req, res) {
  const { notes } = req.body ?? {};

  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    return res.status(400).json({ error: true, message: 'No notes provided.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.interactions.create({
      model: MODEL,
      stream: false,
      input: notes.trim(),
      system_instruction: SYSTEM_PROMPT,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: responseSchema,
      },
    });

    const data = JSON.parse(response.output_text);
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
