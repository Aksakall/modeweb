import { mockDataService } from '../services/mockDataService.js';

export function listProducts(req, res) {
  res.json(mockDataService.listProducts(req.query));
}

export function getProduct(req, res) {
  const product = mockDataService.getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı.', code: 'PRODUCT_NOT_FOUND' });
  return res.json(product);
}
