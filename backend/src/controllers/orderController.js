import { prisma } from '../config/prisma.js';
import { httpError } from '../utils/httpError.js';
import { listResponse } from '../utils/listResponse.js';
import { pagination } from '../utils/pagination.js';
import { orderPublic } from '../utils/serializers.js';
import { orderCreateSchema } from '../validation/schemas.js';

function orderNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `SS-${stamp}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createOrder(req, res) {
  const payload = orderCreateSchema.parse(req.body);
  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber(),
      userId: req.user?.sub,
      customer: payload.customer,
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      paymentMethod: payload.paymentMethod,
      note: payload.note,
      subtotal: payload.subtotal,
      cargoPrice: payload.cargoPrice,
      total: payload.total,
      status: 'new'
    }
  });

  res.status(201).json(orderPublic(order));
}

export async function listOrders(req, res) {
  const { page, limit, skip, take } = pagination(req.query);
  const where = { userId: req.user.sub };
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.order.count({ where })
  ]);
  res.json(listResponse(items.map(orderPublic), { page, limit, total }));
}

export async function getOrder(req, res) {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user.sub }
  });
  if (!order) throw httpError(404, 'Sipariş bulunamadı.', 'ORDER_NOT_FOUND');
  res.json(orderPublic(order));
}

export async function cancelOrder(req, res) {
  const order = await prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.sub } });
  if (!order) throw httpError(404, 'Sipariş bulunamadı.', 'ORDER_NOT_FOUND');
  if (['shipped', 'delivered'].includes(order.status)) {
    throw httpError(400, 'Kargoya verilen veya teslim edilen sipariş iptal edilemez.', 'ORDER_NOT_CANCELABLE');
  }
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'cancelled' } });
  res.json(orderPublic(updated));
}
