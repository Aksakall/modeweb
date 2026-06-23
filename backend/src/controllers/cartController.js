const carts = new Map();

function cartKey(req) {
  return req.user.sub;
}

function getCart(req) {
  const key = cartKey(req);
  if (!carts.has(key)) carts.set(key, []);
  return carts.get(key);
}

function mergeItems(cart, items = []) {
  items.forEach(item => {
    const existing = cart.find(entry => entry.productId === item.productId && entry.variantId === item.variantId);
    const quantity = Number(item.quantity || 1);

    if (existing) {
      const stock = Number(existing.stock || item.stock || Number.MAX_SAFE_INTEGER);
      existing.quantity = Math.max(1, Math.min(stock, Number(existing.quantity || 0) + quantity));
      existing.totalPrice = Number(existing.unitPrice || item.unitPrice || 0) * existing.quantity;
      return;
    }

    cart.push({
      ...item,
      id: item.id || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      quantity: Math.max(1, quantity)
    });
  });

  return cart;
}

export function listCart(req, res) {
  res.json({ items: getCart(req) });
}

export function addCartItem(req, res) {
  const cart = getCart(req);
  if (req.body?.merge && Array.isArray(req.body.items)) {
    return res.status(200).json({ items: mergeItems(cart, req.body.items) });
  }

  const item = { id: `cart-${Date.now()}`, quantity: 1, ...req.body };
  mergeItems(cart, [item]);
  res.status(201).json({ items: cart });
}

export function updateCartItem(req, res) {
  const cart = getCart(req);
  const item = cart.find(entry => entry.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Sepet ürünü bulunamadı.', code: 'CART_ITEM_NOT_FOUND' });
  item.quantity = Number(req.body.quantity);
  return res.json({ items: cart });
}

export function removeCartItem(req, res) {
  const cart = getCart(req);
  const next = cart.filter(entry => entry.id !== req.params.id);
  carts.set(cartKey(req), next);
  res.json({ items: next });
}

export function clearCart(req, res) {
  carts.set(cartKey(req), []);
  res.status(204).send();
}
