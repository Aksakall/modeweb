import { z } from 'zod';

const optionalString = z.preprocess(value => value === '' ? undefined : value, z.string().optional());
const nullableNumber = z.preprocess(value => value === '' || value === undefined ? null : Number(value), z.number().nonnegative().nullable());
const money = z.coerce.number().nonnegative();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: optionalString,
  password: z.string().min(8)
});

export const variantSchema = z.object({
  id: optionalString,
  color: z.string().min(1),
  size: z.string().min(1),
  sku: optionalString,
  stock: z.coerce.number().int().nonnegative().default(0),
  price: nullableNumber
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  brand: z.string().min(1),
  categorySlug: z.string().min(1),
  subCategorySlug: optionalString,
  price: money,
  oldPrice: nullableNumber,
  discountPercent: z.coerce.number().int().min(0).max(100).default(0),
  images: z.array(z.string().url()).min(1),
  thumbnail: z.string().url(),
  colors: z.array(z.object({ id: optionalString, name: z.string().min(1), hex: optionalString })).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  variants: z.array(variantSchema).min(1),
  criticalStock: z.coerce.number().int().nonnegative().default(5),
  description: optionalString,
  fabricInfo: optionalString,
  measurements: optionalString,
  careInstructions: optionalString,
  isFeatured: z.boolean().default(false),
  isDiscounted: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  freeShipping: z.boolean().default(false),
  status: z.enum(['active', 'passive']).default('active'),
  seoTitle: optionalString,
  seoDescription: optionalString
});

export const productUpdateSchema = productSchema.partial().extend({
  variants: z.array(variantSchema).optional()
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  parentId: optionalString.nullable().optional(),
  description: optionalString,
  image: optionalString,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  seoTitle: optionalString,
  seoDescription: optionalString
});

export const categoryUpdateSchema = categorySchema.partial();

export const orderCreateSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email()
  }),
  shippingAddress: z.object({
    city: z.string().min(2),
    district: z.string().min(2),
    address: z.string().min(5)
  }),
  items: z.array(z.object({
    productId: optionalString,
    variantId: optionalString,
    name: optionalString,
    productName: optionalString,
    color: optionalString,
    size: optionalString,
    quantity: z.coerce.number().int().positive(),
    unitPrice: money
  })).min(1),
  paymentMethod: z.string().min(1),
  cargoPrice: money.default(0),
  subtotal: money,
  total: money,
  note: optionalString,
  discountTotal: money.optional()
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  kvkkAccepted: z.literal(true)
});

export const settingsSchema = z.object({
  storeName: z.string().min(2).optional(),
  supportEmail: z.string().email().optional().or(z.literal('')),
  supportPhone: optionalString,
  whatsappPhone: optionalString,
  freeShippingThreshold: money.optional(),
  maintenanceMode: z.boolean().optional()
});

export const orderStatusSchema = z.object({
  status: z.enum(['new', 'preparing', 'shipped', 'delivered', 'cancelled'])
});
