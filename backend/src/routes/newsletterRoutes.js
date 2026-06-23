import { Router } from 'express';
import { subscribe } from '../controllers/newsletterController.js';

export const newsletterRouter = Router();

newsletterRouter.post('/subscribe', subscribe);
