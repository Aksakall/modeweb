import { Router } from 'express';
import { addCartItem, clearCart, listCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';

export const cartRouter = Router();

cartRouter.get('/', listCart);
cartRouter.post('/items', addCartItem);
cartRouter.patch('/items/:id', updateCartItem);
cartRouter.delete('/items/:id', removeCartItem);
cartRouter.delete('/clear', clearCart);
