import { mockDataService } from '../services/mockDataService.js';

export function listCategories(req, res) {
  res.json(mockDataService.listCategories(req.query));
}

export function getCategory(req, res) {
  const category = mockDataService.getCategoryBySlug(req.params.slug);
  if (!category) return res.status(404).json({ message: 'Kategori bulunamadı.', code: 'CATEGORY_NOT_FOUND' });
  return res.json(category);
}
