import { prisma } from '../config/prisma.js';
import { httpError } from '../utils/httpError.js';
import { listResponse } from '../utils/listResponse.js';
import { pagination } from '../utils/pagination.js';
import { productPublic } from '../utils/serializers.js';

function productWhere(query = {}) {
  const where = { status: 'active' };

  if (query.category) where.categorySlug = String(query.category);
  if (query.categorySlug) where.categorySlug = String(query.categorySlug);
  if (query.subCategory) where.subCategorySlug = String(query.subCategory);
  if (query.subCategorySlug) where.subCategorySlug = String(query.subCategorySlug);
  if (query.discounted === 'true') where.isDiscounted = true;
  if (query.featured === 'true') where.isFeatured = true;
  if (query.new === 'true') where.isNew = true;
  if (query.bestSeller === 'true') where.isBestSeller = true;
  if (query.inStock === 'true') where.stock = { gt: 0 };
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = Number(query.minPrice);
    if (query.maxPrice) where.price.lte = Number(query.maxPrice);
  }
  if (query.search) {
    where.OR = [
      { name: { contains: String(query.search), mode: 'insensitive' } },
      { sku: { contains: String(query.search), mode: 'insensitive' } },
      { description: { contains: String(query.search), mode: 'insensitive' } }
    ];
  }

  return where;
}

function productOrderBy(sort) {
  const key = String(sort || 'newest');
  if (key === 'price_asc') return { price: 'asc' };
  if (key === 'price_desc') return { price: 'desc' };
  if (key === 'discount') return { discountPercent: 'desc' };
  if (key === 'name_asc') return { name: 'asc' };
  return { createdAt: 'desc' };
}

export async function listProducts(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const where = productWhere(req.query);
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, include: { variants: true }, orderBy: productOrderBy(req.query.sort), skip, take }),
    prisma.product.count({ where })
  ]);

  res.json(listResponse(items.map(productPublic), { page, limit, total }));
}

export async function getProduct(req, res) {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { variants: true }
  });

  if (!product || product.status !== 'active') {
    throw httpError(404, 'Ürün bulunamadı.', 'PRODUCT_NOT_FOUND');
  }

  res.json(productPublic(product));
}
