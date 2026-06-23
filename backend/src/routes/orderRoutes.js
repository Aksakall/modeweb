import { Router } from 'express';
import { cancelOrder, createOrder, getOrder, listOrders } from '../controllers/orderController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

export const orderRouter = Router();

orderRouter.post('/', asyncHandler(createOrder));
orderRouter.get('/', authenticate, asyncHandler(listOrders));
orderRouter.get('/:id', authenticate, asyncHandler(getOrder));
orderRouter.patch('/:id/cancel', authenticate, asyncHandler(cancelOrder));
