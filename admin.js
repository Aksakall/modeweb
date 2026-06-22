import { AdminLayout } from './components/AdminLayout.js';
import { adminService } from './services/adminService.js';
import { formatPrice } from './utils/formatPrice.js';

const root=document.getElementById('admin-root');
root.innerHTML=AdminLayout(`<div class="admin-status" id="admin-status" role="status">Yönetim verileri yükleniyor…</div><section class="admin-cards"><div class="admin-card"><span>Toplam Ürün</span><strong id="metric-products">—</strong></div><div class="admin-card"><span>Yeni Sipariş</span><strong id="metric-orders">—</strong></div><div class="admin-card"><span>Müşteriler</span><strong id="metric-customers">—</strong></div><div class="admin-card"><span>Net Satış</span><strong id="metric-sales">—</strong></div></section><section class="admin-panel" id="products"><div class="admin-panel-head"><h2>Ürünler</h2><button type="button" id="admin-add-product">Ürün Ekle</button></div><table class="admin-table"><thead><tr><th>SKU</th><th>Ürün</th><th>Fiyat</th><th>Stok</th><th>Durum</th></tr></thead><tbody id="admin-products"></tbody></table></section><section class="admin-panel" id="orders"><div class="admin-panel-head"><h2>Siparişler</h2></div><table class="admin-table"><thead><tr><th>Sipariş</th><th>Müşteri</th><th>Toplam</th><th>Durum</th></tr></thead><tbody id="admin-orders"></tbody></table></section>`);

async function loadAdmin(){
  const status=document.getElementById('admin-status');
  try{
    const [dashboard,products,orders]=await Promise.all([adminService.dashboard(),adminService.products({limit:20}),adminService.orders({limit:20})]);
    document.getElementById('metric-products').textContent=dashboard.productCount;document.getElementById('metric-orders').textContent=dashboard.newOrderCount;document.getElementById('metric-customers').textContent=dashboard.customerCount;document.getElementById('metric-sales').textContent=formatPrice(dashboard.netSales);
    document.getElementById('admin-products').innerHTML=products.items.map(p=>`<tr><td>${p.sku}</td><td>${p.name}</td><td>${formatPrice(p.price)}</td><td>${p.stock}</td><td>${p.status}</td></tr>`).join('');
    document.getElementById('admin-orders').innerHTML=orders.items.map(o=>`<tr><td>${o.orderNumber}</td><td>${o.customer.fullName}</td><td>${formatPrice(o.total)}</td><td>${o.status}</td></tr>`).join('');status.hidden=true;
  }catch(error){status.textContent=error.message==='API_NOT_CONFIGURED'?'Yönetim verilerine şu anda erişilemiyor.':error.status===401?'Bu alanı görüntülemek için yönetici hesabıyla giriş yapmalısınız.':error.message;}
}
document.getElementById('admin-add-product').addEventListener('click',()=>{document.getElementById('admin-status').textContent='Ürün yönetimi için yetkili oturum gereklidir.'});
loadAdmin();
