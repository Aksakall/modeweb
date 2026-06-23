import { Router } from 'express';
import { health } from '../controllers/healthController.js';
import { authRouter } from './authRoutes.js';
import { productRouter } from './productRoutes.js';
import { categoryRouter } from './categoryRoutes.js';
import { cartRouter } from './cartRoutes.js';
import { orderRouter } from './orderRoutes.js';
import { newsletterRouter } from './newsletterRoutes.js';
import { adminRouter } from './adminRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', health);
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/newsletter', newsletterRouter);
apiRouter.use('/admin', adminRouter);
