import { Router } from 'express';
import { addCartItem, clearCart, listCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

export const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/', listCart);
cartRouter.post('/items', addCartItem);
cartRouter.patch('/items/:id', updateCartItem);
cartRouter.delete('/items/:id', removeCartItem);
cartRouter.delete('/clear', clearCart);
