import { GoogleGenAI } from '@google/genai';
import { responseSchema } from '../src/lib/geminiSchema.js';

const MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `You are a study assistant. Given the user's notes or topic, generate a study set.
Return ONLY a JSON object — no markdown, no extra text.
Generate between 4 and 8 flashcards and between 4 and 8 quiz questions.
Each flashcard must have a unique id, a front (question/term), and a back (answer/explanation).
Each quiz question must have a unique id, a question, exactly 4 options, a correctIndex (0–3), and a clear explanation.
All fields are required — never return null or empty strings.`;

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: true, message: 'Method not allowed.' });
  }

  const { notes } = req.body ?? {};

  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    return res.status(400).json({ error: true, message: 'No notes provided.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const interaction = await ai.interactions.create({
      model: MODEL,
      system_instruction: SYSTEM_INSTRUCTION,
      input: notes.trim(),
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: responseSchema,
      },
    });

    const parsed = JSON.parse(interaction.output_text);
    return res.status(200).json(parsed);
  } catch (err) {
    const status = err?.status ?? err?.httpStatus ?? 500;

    if (status === 401 || status === 403) {
      return res
        .status(500)
        .json({ error: true, message: 'API key invalid or unauthorised.' });
    }
    if (status === 429) {
      return res.status(429).json({
        error: true,
        message: 'Rate limit reached. Please wait a moment and retry.',
      });
    }
    if (err instanceof SyntaxError) {
      return res
        .status(500)
        .json({ error: true, message: 'Model returned unparseable output.' });
    }

    return res
      .status(500)
      .json({ error: true, message: 'Generation failed. Please retry.' });
  }
}

export default handler;
