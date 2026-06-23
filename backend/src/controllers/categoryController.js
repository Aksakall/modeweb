import { prisma } from '../config/prisma.js';
import { httpError } from '../utils/httpError.js';
import { listResponse } from '../utils/listResponse.js';
import { pagination } from '../utils/pagination.js';

export async function listCategories(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const where = { isActive: true };
  const [items, total] = await prisma.$transaction([
    prisma.category.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], skip, take }),
    prisma.category.count({ where })
  ]);
  res.json(listResponse(items, { page, limit, total }));
}

export async function getCategory(req, res) {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });
  if (!category || !category.isActive) throw httpError(404, 'Kategori bulunamadı.', 'CATEGORY_NOT_FOUND');
  res.json(category);
}
