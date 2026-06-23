const numberOrNull = value => value === null || value === undefined ? null : Number(value);

export function userPublic(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  };
}

export function variantPublic(variant) {
  return {
    ...variant,
    price: numberOrNull(variant.price)
  };
}

export function productPublic(product) {
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    oldPrice: numberOrNull(product.oldPrice),
    variants: (product.variants || []).map(variantPublic)
  };
}

export function orderPublic(order) {
  if (!order) return null;
  return {
    ...order,
    subtotal: Number(order.subtotal),
    cargoPrice: Number(order.cargoPrice),
    total: Number(order.total)
  };
}

export function settingsPublic(settings) {
  if (!settings) return null;
  return {
    ...settings,
    freeShippingThreshold: Number(settings.freeShippingThreshold)
  };
}
