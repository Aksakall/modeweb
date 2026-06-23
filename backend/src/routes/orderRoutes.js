import { Router } from 'express';
import { cancelOrder, createOrder, getOrder, listOrders } from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/', listOrders);
orderRouter.get('/:id', getOrder);
orderRouter.patch('/:id/cancel', cancelOrder);
