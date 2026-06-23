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
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/dashboard', dashboard);

adminRouter.get('/products', listProducts);
adminRouter.post('/products', createProduct);
adminRouter.patch('/products/:id', updateProduct);
adminRouter.delete('/products/:id', deleteProduct);

adminRouter.get('/categories', listCategories);
adminRouter.post('/categories', createCategory);
adminRouter.patch('/categories/:id', updateCategory);
adminRouter.delete('/categories/:id', deleteCategory);

adminRouter.get('/orders', listOrders);
adminRouter.get('/orders/:id', getOrder);
adminRouter.patch('/orders/:id/status', updateOrderStatus);

adminRouter.get('/customers', listCustomers);
adminRouter.get('/newsletter', listNewsletter);

adminRouter.get('/settings', getSettings);
adminRouter.patch('/settings', updateSettings);
