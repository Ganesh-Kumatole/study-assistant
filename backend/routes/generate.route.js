import { Router } from 'express';
import { generate as generateResponse } from '../controllers/generate.controller.js';

const router = Router();

// frontend hits this to get flashcards + quiz from Gemini
router.post('/generate', generateResponse);

export default router;
