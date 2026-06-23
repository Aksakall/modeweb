import { listResponse } from '../utils/listResponse.js';

const products = [
  {
    id: 'prd-001',
    slug: 'noir-abaya-takim',
    sku: 'SS-0001',
    brand: 'Sıla Sarıoğlu',
    name: 'Noir Abaya Takım',
    category: 'Giyim',
    categorySlug: 'giyim',
    subCategory: 'takim',
    subCategorySlug: 'takim',
    price: 2050,
    oldPrice: 2500,
    discountPercent: 18,
    currency: 'TRY',
    images: [
      'https://images.unsplash.com/photo-1724412613510-c663f14c7481?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607945432204-89d3cd66bac6?q=80&w=1200&auto=format&fit=crop'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1724412613510-c663f14c7481?q=80&w=1200&auto=format&fit=crop',
    colors: [{ id: 'bordo', name: 'Bordo', hex: '#6f1d24' }],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'prd-001-v1', productId: 'prd-001', color: 'Bordo', size: 'S', stock: 8, price: 2050, sku: 'SS-1-S' },
      { id: 'prd-001-v2', productId: 'prd-001', color: 'Bordo', size: 'M', stock: 9, price: 2050, sku: 'SS-1-M' }
    ],
    stock: 17,
    criticalStock: 5,
    description: 'Bordo tonu ve özenli kalıbıyla günlük kullanımdan özel anlara uzanan zarif bir takım.',
    fabricInfo: 'Mevsimlik, nefes alan seçkin kumaş.',
    measurements: 'Ürün ölçüleri bedene göre değişir.',
    careInstructions: '30°C hassas programda yıkayınız.',
    isFeatured: true,
    isDiscounted: true,
    isNew: false,
    isBestSeller: true,
    freeShipping: true,
    status: 'active',
    seoTitle: 'Noir Abaya Takım | Sıla Sarıoğlu',
    seoDescription: 'Noir Abaya Takım ürün detayları ve fiyatı.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const categories = [
  { id: 'cat-giyim', name: 'Giyim', slug: 'giyim', parentId: null, sortOrder: 1, isActive: true },
  { id: 'cat-sallar', name: 'Şallar', slug: 'sallar', parentId: null, sortOrder: 2, isActive: true },
  { id: 'cat-indirim', name: 'İndirim', slug: 'indirim', parentId: null, sortOrder: 3, isActive: true }
];

const orders = [
  {
    id: 'ord-001',
    orderNumber: 'SS-2026-0001',
    customer: { fullName: 'Ayşe Yılmaz', phone: '05555555555', email: 'ayse@example.com' },
    shippingAddress: { city: 'Kocaeli', district: 'İzmit', address: 'Örnek Mah. No:1' },
    items: [{ name: 'Noir Abaya Takım', productName: 'Noir Abaya Takım', color: 'Bordo', size: 'S', quantity: 1, unitPrice: 2050 }],
    subtotal: 2050,
    cargoPrice: 0,
    total: 2050,
    paymentMethod: 'cash_on_delivery',
    status: 'new',
    createdAt: new Date().toISOString()
  }
];

const customers = [
  { id: 'cus-001', fullName: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '05555555555', orderCount: 1, totalSpent: 2050, createdAt: new Date().toISOString() }
];

const newsletterSubscribers = [
  { id: 'sub-001', email: 'atelier@example.com', kvkkAccepted: true, status: 'active', createdAt: new Date().toISOString() }
];

const settings = {
  storeName: 'Sıla Sarıoğlu',
  supportEmail: 'destek@silasarioglu.com',
  supportPhone: '+90 555 555 55 55',
  whatsappPhone: '+90 555 555 55 55',
  freeShippingThreshold: 1500,
  maintenanceMode: false
};

export const mockDataService = {
  listProducts: params => listResponse(products, params),
  getProductBySlug: slug => products.find(product => product.slug === slug) || null,
  createProduct: payload => ({ id: `prd-${Date.now()}`, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
  updateProduct: (id, payload) => ({ id, ...payload, updatedAt: new Date().toISOString() }),
  deleteProduct: id => ({ id, deleted: true }),

  listCategories: params => listResponse(categories, params),
  getCategoryBySlug: slug => categories.find(category => category.slug === slug) || null,
  createCategory: payload => ({ id: `cat-${Date.now()}`, ...payload }),
  updateCategory: (id, payload) => ({ id, ...payload }),
  deleteCategory: id => ({ id, deleted: true }),

  listOrders: params => listResponse(orders, params),
  getOrder: id => orders.find(order => order.id === id) || null,
  createOrder: payload => ({ id: `ord-${Date.now()}`, orderNumber: `SS-${Date.now()}`, status: 'new', ...payload, createdAt: new Date().toISOString() }),
  updateOrderStatus: (id, status) => ({ id, status }),

  listCustomers: params => listResponse(customers, params),
  listNewsletterSubscribers: params => listResponse(newsletterSubscribers, params),
  subscribeNewsletter: payload => ({ id: `sub-${Date.now()}`, status: 'active', ...payload, createdAt: new Date().toISOString() }),

  getSettings: () => settings,
  updateSettings: payload => ({ ...settings, ...payload }),

  dashboard: () => ({
    productCount: products.length,
    newOrderCount: orders.filter(order => order.status === 'new').length,
    customerCount: customers.length,
    netSales: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    pendingOrderCount: orders.filter(order => ['new', 'preparing'].includes(order.status)).length,
    criticalStockCount: products.filter(product => product.stock <= product.criticalStock).length,
    todayOrderCount: orders.length
  })
};
