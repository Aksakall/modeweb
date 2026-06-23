const carts = new Map();

function cartKey(req) {
  return req.user.sub;
}

function getCart(req) {
  const key = cartKey(req);
  if (!carts.has(key)) carts.set(key, []);
  return carts.get(key);
}

export function listCart(req, res) {
  res.json({ items: getCart(req) });
}

export function addCartItem(req, res) {
  const cart = getCart(req);
  const item = { id: `cart-${Date.now()}`, quantity: 1, ...req.body };
  cart.push(item);
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
