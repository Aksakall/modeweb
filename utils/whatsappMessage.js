import { env } from '../config/env.js';
import { formatPrice } from './formatPrice.js';

export function createWhatsAppOrderMessage(order){
  const paymentLabels={cash_on_delivery:'Kapıda Ödeme — Nakit',card_on_delivery:'Kapıda Ödeme — Kredi Kartı',bank_transfer:'Havale / EFT',online_card:'Online Kart Ödeme'};
  const productLines=(order.items||[]).flatMap((item,index)=>[
    `${index+1}. ${item.name||item.productName||'\u00dcrün'}`,
    `Renk: ${item.color||'—'}`,
    `Beden: ${item.size||'—'}`,
    `Adet: ${item.quantity}`,
    `Fiyat: ${formatPrice((item.unitPrice||0)*item.quantity)}`,
    ''
  ]);
  const customer=order.customer||{};const address=order.shippingAddress||{};
  return [
    'Merhaba, sipariş vermek istiyorum.','',
    'Ürünler:',...productLines,
    `Ara Toplam: ${formatPrice(order.subtotal||0)}`,
    `Kargo: ${order.cargoPrice?formatPrice(order.cargoPrice):'Ücretsiz'}`,
    `Toplam: ${formatPrice(order.total||0)}`,'',
    'Müşteri:',
    `Ad Soyad: ${customer.fullName||'—'}`,
    `Telefon: ${customer.phone||'—'}`,
    `E-posta: ${customer.email||'—'}`,
    `İl / İlçe: ${address.city||'—'} / ${address.district||'—'}`,
    `Adres: ${address.address||'—'}`,
    `Ödeme Tercihi: ${paymentLabels[order.paymentMethod]||order.paymentMethod||'—'}`,
    `Sipariş Notu: ${order.note||'—'}`
  ].join('\n');
}

export function createWhatsAppUrl(message){
  const target = env.WHATSAPP_PHONE ? `https://wa.me/${env.WHATSAPP_PHONE}` : 'https://wa.me/';
  return `${target}?text=${encodeURIComponent(message)}`;
}
