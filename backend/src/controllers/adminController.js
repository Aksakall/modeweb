import { mockDataService } from '../services/mockDataService.js';

export const dashboard = (req, res) => res.json(mockDataService.dashboard());

export const listProducts = (req, res) => res.json(mockDataService.listProducts(req.query));
export const createProduct = (req, res) => res.status(201).json(mockDataService.createProduct(req.body));
export const updateProduct = (req, res) => res.json(mockDataService.updateProduct(req.params.id, req.body));
export const deleteProduct = (req, res) => res.json(mockDataService.deleteProduct(req.params.id));

export const listCategories = (req, res) => res.json(mockDataService.listCategories(req.query));
export const createCategory = (req, res) => res.status(201).json(mockDataService.createCategory(req.body));
export const updateCategory = (req, res) => res.json(mockDataService.updateCategory(req.params.id, req.body));
export const deleteCategory = (req, res) => res.json(mockDataService.deleteCategory(req.params.id));

export const listOrders = (req, res) => res.json(mockDataService.listOrders(req.query));
export const getOrder = (req, res) => {
  const order = mockDataService.getOrder(req.params.id);
  if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı.', code: 'ORDER_NOT_FOUND' });
  return res.json(order);
};
export const updateOrderStatus = (req, res) => res.json(mockDataService.updateOrderStatus(req.params.id, req.body.status));

export const listCustomers = (req, res) => res.json(mockDataService.listCustomers(req.query));
export const listNewsletter = (req, res) => res.json(mockDataService.listNewsletterSubscribers(req.query));
export const getSettings = (req, res) => res.json(mockDataService.getSettings());
export const updateSettings = (req, res) => res.json(mockDataService.updateSettings(req.body));
