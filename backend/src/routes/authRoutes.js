import { Router } from 'express';
import { forgotPassword, login, logout, me, refresh, register, resetPassword } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/refresh', asyncHandler(refresh));
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, asyncHandler(me));
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
