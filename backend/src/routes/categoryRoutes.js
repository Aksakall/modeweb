import { Router } from 'express';
import { getCategory, listCategories } from '../controllers/categoryController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const categoryRouter = Router();

categoryRouter.get('/', asyncHandler(listCategories));
categoryRouter.get('/:slug', asyncHandler(getCategory));
