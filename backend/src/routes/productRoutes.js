import { Router } from 'express';
import { getProduct, listProducts } from '../controllers/productController.js';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.get('/:slug', getProduct);
