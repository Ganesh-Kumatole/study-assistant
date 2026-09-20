import { Router } from 'express';
import { generateResponseHandler } from '../controllers/generate.controller.js';

const router = Router();

// frontend hits this to get flashcards + quiz from Gemini
router.post('/generate', generateResponseHandler);

export default router;
