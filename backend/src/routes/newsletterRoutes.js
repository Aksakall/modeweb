import { Router } from 'express';
import { subscribe } from '../controllers/newsletterController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const newsletterRouter = Router();

newsletterRouter.post('/subscribe', asyncHandler(subscribe));
