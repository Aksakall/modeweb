import { Router } from 'express';
import { getCategory, listCategories } from '../controllers/categoryController.js';

export const categoryRouter = Router();

categoryRouter.get('/', listCategories);
categoryRouter.get('/:slug', getCategory);
