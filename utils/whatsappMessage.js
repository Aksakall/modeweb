import { env } from '../config/env.js';
import { formatPrice } from './formatPrice.js';

export function createWhatsAppOrderMessage(cart){
  const lines = cart.items.map(item =>
    `• ${item.name} — ${item.color}, ${item.size} beden, ${item.quantity} adet`
  );
  return ['Merhaba, aşağıdaki ürünler için sipariş oluşturmak istiyorum:', '', ...lines, '',
    `Toplam: ${formatPrice(cart.total)}`, '', 'Stok ve teslimat bilgisi paylaşabilir misiniz?'].join('\n');
}

export function createWhatsAppUrl(message){
  const target = env.WHATSAPP_PHONE ? `https://wa.me/${env.WHATSAPP_PHONE}` : 'https://wa.me/';
  return `${target}?text=${encodeURIComponent(message)}`;
}

