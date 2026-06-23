import { Router } from 'express';
import { getProduct, listProducts } from '../controllers/productController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const productRouter = Router();

productRouter.get('/', asyncHandler(listProducts));
productRouter.get('/:slug', asyncHandler(getProduct));
