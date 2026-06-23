import { Router } from 'express';
import {
  createCategory,
  createProduct,
  dashboard,
  deleteCategory,
  deleteProduct,
  getOrder,
  getSettings,
  listCategories,
  listCustomers,
  listNewsletter,
  listOrders,
  listProducts,
  updateCategory,
  updateOrderStatus,
  updateProduct,
  updateSettings
} from '../controllers/adminController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/dashboard', asyncHandler(dashboard));

adminRouter.get('/products', asyncHandler(listProducts));
adminRouter.post('/products', asyncHandler(createProduct));
adminRouter.patch('/products/:id', asyncHandler(updateProduct));
adminRouter.delete('/products/:id', asyncHandler(deleteProduct));

adminRouter.get('/categories', asyncHandler(listCategories));
adminRouter.post('/categories', asyncHandler(createCategory));
adminRouter.patch('/categories/:id', asyncHandler(updateCategory));
adminRouter.delete('/categories/:id', asyncHandler(deleteCategory));

adminRouter.get('/orders', asyncHandler(listOrders));
adminRouter.get('/orders/:id', asyncHandler(getOrder));
adminRouter.patch('/orders/:id/status', asyncHandler(updateOrderStatus));

adminRouter.get('/customers', asyncHandler(listCustomers));
adminRouter.get('/newsletter', asyncHandler(listNewsletter));

adminRouter.get('/settings', asyncHandler(getSettings));
adminRouter.patch('/settings', asyncHandler(updateSettings));
