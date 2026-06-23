import { mockDataService } from '../services/mockDataService.js';

export function createOrder(req, res) {
  res.status(201).json(mockDataService.createOrder(req.body));
}

export function listOrders(req, res) {
  res.json(mockDataService.listOrders(req.query));
}

export function getOrder(req, res) {
  const order = mockDataService.getOrder(req.params.id);
  if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı.', code: 'ORDER_NOT_FOUND' });
  return res.json(order);
}

export function cancelOrder(req, res) {
  res.json(mockDataService.updateOrderStatus(req.params.id, 'cancelled'));
}
