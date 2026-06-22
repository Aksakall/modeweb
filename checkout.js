import { cartService } from './services/cartService.js';
import { orderService } from './services/orderService.js';
import { formatPrice } from './utils/formatPrice.js';
import { validators } from './utils/validators.js';
import { createWhatsAppOrderMessage, createWhatsAppUrl } from './utils/whatsappMessage.js';
import { createOrderPayload } from './utils/orderPayload.js';
import { usesMockApi } from './config/env.js';

const items=await cartService.get();const form=document.getElementById('checkout-form');const summary=document.getElementById('summary-items');const status=document.getElementById('checkout-status');
document.querySelector('[value="online_card"]')?.closest('label')?.remove();
const subtotal=items.reduce((sum,item)=>sum+item.unitPrice*item.quantity,0);const cargoPrice=subtotal===0||subtotal>=1500?0:95;const total=subtotal+cargoPrice;
summary.innerHTML=items.length?items.map(item=>`<div class="summary-item"><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><br>${item.color} · ${item.size}<br>${item.quantity} adet</div><span>${formatPrice(item.unitPrice*item.quantity)}</span></div>`).join(''):'<p>Sepetiniz boş. Sipariş oluşturmak için koleksiyondan ürün ekleyin.</p>';
document.getElementById('subtotal').textContent=formatPrice(subtotal);document.getElementById('cargo').textContent=cargoPrice?formatPrice(cargoPrice):'Ücretsiz';document.getElementById('total').textContent=formatPrice(total);form.querySelector('[type="submit"]').disabled=!items.length;
if(usesMockApi&&items.length)form.querySelector('[type="submit"]').textContent='WhatsApp ile Siparişi Tamamla';

form.addEventListener('submit',async event=>{
  event.preventDefault();status.textContent='';const data=new FormData(form);const required=['fullName','phone','email','city','district','address'];
  if(required.some(key=>!validators.required(data.get(key)))||!validators.email(data.get('email'))||!validators.phone(data.get('phone'))){status.textContent='Lütfen iletişim ve teslimat bilgilerini eksiksiz kontrol edin.';return}
  const payload=createOrderPayload({formData:data,items,cargoPrice,subtotal,total});
  const whatsappOrder={...payload,items};
  const button=form.querySelector('[type="submit"]');button.disabled=true;button.textContent='Sipariş oluşturuluyor…';
  if(usesMockApi){
    const message=createWhatsAppOrderMessage(whatsappOrder);
    window.location.href=createWhatsAppUrl(message);
    button.disabled=false;button.textContent='WhatsApp ile Siparişi Tamamla';return;
  }
  try{
    const order=await orderService.create(payload);await cartService.clear();
    const orderNo=order.orderNumber||order.id;const message=createWhatsAppOrderMessage(whatsappOrder);
    document.querySelector('.checkout-main').innerHTML=`<div class="checkout-success"><h2>Siparişiniz alındı.</h2><p>Sipariş numaranız: <strong>${orderNo}</strong></p><p>Durum güncellemeleri e-posta ve telefon bilgileriniz üzerinden paylaşılacaktır.</p><a href="${createWhatsAppUrl(message)}" target="_blank" rel="noopener">Siparişi WhatsApp ile Paylaş</a></div>`;
  }catch(error){status.textContent=error.message==='API_NOT_CONFIGURED'?'Siparişiniz şu anda oluşturulamadı. Lütfen WhatsApp üzerinden bize ulaşın.':error.message;button.disabled=false;button.textContent='Siparişi Onayla';}
});
