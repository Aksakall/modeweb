import { Router } from 'express';
import { cancelOrder, createOrder, getOrder, listOrders } from '../controllers/orderController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const orderRouter = Router();

orderRouter.post('/', asyncHandler(createOrder));
orderRouter.get('/', asyncHandler(listOrders));
orderRouter.get('/:id', asyncHandler(getOrder));
orderRouter.patch('/:id/cancel', asyncHandler(cancelOrder));
