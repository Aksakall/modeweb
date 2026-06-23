import { prisma } from '../config/prisma.js';
import { httpError } from '../utils/httpError.js';
import { listResponse } from '../utils/listResponse.js';
import { pagination } from '../utils/pagination.js';
import { orderPublic, productPublic, settingsPublic, userPublic } from '../utils/serializers.js';
import { categorySchema, categoryUpdateSchema, orderStatusSchema, productSchema, productUpdateSchema, settingsSchema } from '../validation/schemas.js';

const variantStock = variants => (variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0);

function productData(payload) {
  return {
    name: payload.name,
    slug: payload.slug,
    sku: payload.sku,
    brand: payload.brand,
    categorySlug: payload.categorySlug,
    subCategorySlug: payload.subCategorySlug,
    price: payload.price,
    oldPrice: payload.oldPrice,
    discountPercent: payload.discountPercent,
    images: payload.images,
    thumbnail: payload.thumbnail,
    colors: payload.colors,
    sizes: payload.sizes,
    stock: payload.variants ? variantStock(payload.variants) : undefined,
    criticalStock: payload.criticalStock,
    description: payload.description,
    fabricInfo: payload.fabricInfo,
    measurements: payload.measurements,
    careInstructions: payload.careInstructions,
    isFeatured: payload.isFeatured,
    isDiscounted: payload.isDiscounted,
    isNew: payload.isNew,
    isBestSeller: payload.isBestSeller,
    freeShipping: payload.freeShipping,
    status: payload.status,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription
  };
}

function cleanUndefined(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

function variantCreateMany(variants = []) {
  return variants.map(variant => ({
    color: variant.color,
    size: variant.size,
    sku: variant.sku,
    stock: variant.stock,
    price: variant.price
  }));
}

export async function dashboard(req, res) {
  const [productCount, newOrderCount, customerCount, sales, pendingOrderCount, criticalStockCount, todayOrderCount] = await prisma.$transaction([
    prisma.product.count(),
    prisma.order.count({ where: { status: 'new' } }),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'cancelled' } } }),
    prisma.order.count({ where: { status: { in: ['new', 'preparing'] } } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } })
  ]);

  res.json({
    productCount,
    newOrderCount,
    customerCount,
    netSales: Number(sales._sum.total || 0),
    pendingOrderCount,
    criticalStockCount,
    todayOrderCount
  });
}

export async function listProducts(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const where = {};
  if (req.query.search) {
    where.OR = [
      { name: { contains: String(req.query.search), mode: 'insensitive' } },
      { sku: { contains: String(req.query.search), mode: 'insensitive' } }
    ];
  }
  if (req.query.status) where.status = String(req.query.status);
  if (req.query.categorySlug) where.categorySlug = String(req.query.categorySlug);

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, include: { variants: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.product.count({ where })
  ]);
  res.json(listResponse(items.map(productPublic), { page, limit, total }));
}

export async function createProduct(req, res) {
  const payload = productSchema.parse(req.body);
  const created = await prisma.product.create({
    data: {
      ...productData(payload),
      variants: { create: variantCreateMany(payload.variants) }
    },
    include: { variants: true }
  });
  res.status(201).json(productPublic(created));
}

export async function updateProduct(req, res) {
  const payload = productUpdateSchema.parse(req.body);
  const exists = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!exists) throw httpError(404, 'Ürün bulunamadı.', 'PRODUCT_NOT_FOUND');

  const updated = await prisma.$transaction(async tx => {
    if (payload.variants) {
      await tx.productVariant.deleteMany({ where: { productId: req.params.id } });
    }

    return tx.product.update({
      where: { id: req.params.id },
      data: {
        ...cleanUndefined(productData(payload)),
        ...(payload.variants ? { variants: { create: variantCreateMany(payload.variants) } } : {})
      },
      include: { variants: true }
    });
  });

  res.json(productPublic(updated));
}

export async function deleteProduct(req, res) {
  const exists = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!exists) throw httpError(404, 'Ürün bulunamadı.', 'PRODUCT_NOT_FOUND');
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

export async function listCategories(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const [items, total] = await prisma.$transaction([
    prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], skip, take }),
    prisma.category.count()
  ]);
  res.json(listResponse(items, { page, limit, total }));
}

export async function createCategory(req, res) {
  const payload = categorySchema.parse(req.body);
  const category = await prisma.category.create({ data: payload });
  res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const payload = categoryUpdateSchema.parse(req.body);
  const exists = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!exists) throw httpError(404, 'Kategori bulunamadı.', 'CATEGORY_NOT_FOUND');
  const category = await prisma.category.update({ where: { id: req.params.id }, data: payload });
  res.json(category);
}

export async function deleteCategory(req, res) {
  const exists = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!exists) throw httpError(404, 'Kategori bulunamadı.', 'CATEGORY_NOT_FOUND');
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

export async function listOrders(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const where = {};
  if (req.query.status) where.status = String(req.query.status);
  if (req.query.search) {
    where.OR = [
      { orderNumber: { contains: String(req.query.search), mode: 'insensitive' } }
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.order.count({ where })
  ]);
  res.json(listResponse(items.map(orderPublic), { page, limit, total }));
}

export async function getOrder(req, res) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw httpError(404, 'Sipariş bulunamadı.', 'ORDER_NOT_FOUND');
  res.json(orderPublic(order));
}

export async function updateOrderStatus(req, res) {
  const payload = orderStatusSchema.parse(req.body);
  const exists = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!exists) throw httpError(404, 'Sipariş bulunamadı.', 'ORDER_NOT_FOUND');
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: payload.status } });
  res.json(orderPublic(order));
}

export async function listCustomers(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({ where: { role: 'customer' }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.user.count({ where: { role: 'customer' } })
  ]);
  res.json(listResponse(users.map(userPublic), { page, limit, total }));
}

export async function listNewsletter(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const [items, total] = await prisma.$transaction([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.newsletterSubscriber.count()
  ]);
  res.json(listResponse(items, { page, limit, total }));
}

export async function getSettings(req, res) {
  const settings = await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', storeName: 'Sıla Sarıoğlu' }
  });
  res.json(settingsPublic(settings));
}

export async function updateSettings(req, res) {
  const payload = settingsSchema.parse(req.body);
  const settings = await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: payload,
    create: { id: 'default', storeName: payload.storeName || 'Sıla Sarıoğlu', ...payload }
  });
  res.json(settingsPublic(settings));
}
