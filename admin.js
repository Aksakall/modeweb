import { AdminLayout } from './components/AdminLayout.js';
import { adminService } from './services/adminService.js';
import { authService } from './services/authService.js';
import { usesMockApi } from './config/env.js';
import { formatPrice } from './utils/formatPrice.js';
import { createSlug } from './utils/createSlug.js';

const root=document.getElementById('admin-root');
const state={section:'dashboard',user:null,products:[],categories:[],orders:[],customers:[],subscribers:[]};
const sectionTitles={dashboard:'Dashboard',products:'Ürünler',categories:'Kategoriler',orders:'Siparişler',customers:'Müşteriler',newsletter:'E-bülten',settings:'Site Ayarları'};
const orderLabels={new:'Yeni Sipariş',preparing:'Hazırlanıyor',shipped:'Kargoya Verildi',delivered:'Teslim Edildi',cancelled:'İptal Edildi'};
const escapeHtml=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const valueOf=(object,path,fallback='—')=>path.split('.').reduce((value,key)=>value?.[key],object)??fallback;
const listState=(message='Kayıt bulunamadı.')=>`<div class="admin-empty">${message}</div>`;

function setStatus(message,type='info'){
  const element=document.getElementById('admin-status');if(!element)return;
  element.hidden=!message;element.textContent=message||'';element.dataset.type=type;
}

function renderLogin(message=''){
  root.innerHTML=`<main class="admin-login"><a href="index.html" class="admin-login-brand">Sıla Sarıoğlu</a><section><p>Yönetim Paneli</p><h1>Mağaza yönetimine giriş yapın.</h1>${usesMockApi?'<div class="admin-config-warning">Backend yapılandırılmadı. Yönetim paneli gerçek API bağlantısı olmadan kullanılamaz.</div>':`<form id="admin-login-form"><label for="admin-email">E-posta</label><input id="admin-email" name="email" type="email" autocomplete="username" required><label for="admin-password">Şifre</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required><button type="submit">Giriş Yap</button></form>`}<div class="admin-login-status" id="admin-login-status" role="status">${escapeHtml(message)}</div><a href="index.html">Mağazaya Dön</a></section></main>`;
  document.getElementById('admin-login-form')?.addEventListener('submit',handleLogin);
}

async function handleLogin(event){
  event.preventDefault();const form=event.currentTarget;const button=form.querySelector('button');const status=document.getElementById('admin-login-status');
  button.disabled=true;button.textContent='Kontrol ediliyor…';status.textContent='';
  try{
    const result=await authService.login({email:form.email.value.trim(),password:form.password.value});
    if(result?.user?.role!=='admin'){await authService.logout();renderLogin('Bu alana erişim yetkiniz bulunmuyor.');return}
    state.user=result.user;renderShell();await navigate('dashboard');
  }catch(error){status.textContent=error.status===403?'Bu alana erişim yetkiniz bulunmuyor.':error.message;button.disabled=false;button.textContent='Giriş Yap';}
}

function renderShell(){
  root.innerHTML=AdminLayout('<div class="admin-loading">Yönetim verileri yükleniyor…</div>');
  document.querySelectorAll('[data-admin-section]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();navigate(link.dataset.adminSection)}));
  document.getElementById('admin-logout').addEventListener('click',async()=>{await authService.logout();state.user=null;renderLogin('Güvenli çıkış yapıldı.')});
}

async function navigate(section){
  state.section=section;location.hash=section;
  document.querySelectorAll('[data-admin-section]').forEach(link=>link.classList.toggle('is-active',link.dataset.adminSection===section));
  document.getElementById('admin-title').textContent=sectionTitles[section]||'Yönetim Paneli';
  const content=document.getElementById('admin-content');content.innerHTML='<div class="admin-loading">Veriler yükleniyor…</div>';setStatus('');
  try{
    const renderers={dashboard:renderDashboard,products:renderProducts,categories:renderCategories,orders:renderOrders,customers:renderCustomers,newsletter:renderNewsletter,settings:renderSettings};
    await (renderers[section]||renderers.dashboard)();
  }catch(error){
    if(error.status===401){renderLogin('Oturumunuz sona erdi. Lütfen yeniden giriş yapın.');return}
    if(error.status===403){content.innerHTML=listState('Bu alana erişim yetkiniz bulunmuyor.');return}
    content.innerHTML=listState('Veriler yüklenemedi.');setStatus(error.message,'error');
  }
}

async function renderDashboard(){
  const dashboard=await adminService.dashboard();
  document.getElementById('admin-content').innerHTML=`<section class="admin-cards"><div class="admin-card"><span>Toplam Ürün</span><strong>${dashboard.productCount??0}</strong></div><div class="admin-card"><span>Yeni Sipariş</span><strong>${dashboard.newOrderCount??0}</strong></div><div class="admin-card"><span>Müşteriler</span><strong>${dashboard.customerCount??0}</strong></div><div class="admin-card"><span>Net Satış</span><strong>${formatPrice(dashboard.netSales??0)}</strong></div></section><section class="admin-panel"><div class="admin-panel-head"><div><p>Bugün</p><h2>Mağaza özeti</h2></div></div><div class="admin-summary-grid"><div><span>Bekleyen sipariş</span><strong>${dashboard.pendingOrderCount??dashboard.newOrderCount??0}</strong></div><div><span>Kritik stok</span><strong>${dashboard.criticalStockCount??0}</strong></div><div><span>Bugün sipariş</span><strong>${dashboard.todayOrderCount??0}</strong></div></div></section>`;
}

async function renderProducts(){
  const result=await adminService.products({page:1,limit:100});state.products=result.items;
  document.getElementById('admin-content').innerHTML=`<section class="admin-panel"><div class="admin-panel-head"><div><p>${result.total} kayıt</p><h2>Ürünler</h2></div><button type="button" data-product-create>Ürün Ekle</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Ürün</th><th>SKU</th><th>Kategori</th><th>Alt Kategori</th><th>Fiyat</th><th>Eski Fiyat</th><th>Stok</th><th>Durum</th><th>İşlemler</th></tr></thead><tbody>${result.items.map(product=>`<tr><td><strong>${escapeHtml(product.name)}</strong></td><td>${escapeHtml(product.sku)}</td><td>${escapeHtml(product.categorySlug)}</td><td>${escapeHtml(product.subCategorySlug)}</td><td>${formatPrice(product.price)}</td><td>${product.oldPrice?formatPrice(product.oldPrice):'—'}</td><td>${product.stock??0}</td><td><span class="status-badge" data-status="${escapeHtml(product.status)}">${escapeHtml(product.status)}</span></td><td><div class="table-actions"><button type="button" data-product-edit="${escapeHtml(product.id)}">Düzenle</button><button class="danger" type="button" data-product-delete="${escapeHtml(product.id)}">Sil</button></div></td></tr>`).join('')}</tbody></table></div>${result.items.length?'':listState()}</section>`;
}

function productForm(product={}){
  const colors=JSON.stringify(product.colors||[],null,2);const variants=JSON.stringify(product.variants||[],null,2);
  return `<form class="admin-form" id="product-form" data-id="${escapeHtml(product.id||'')}"><div class="form-grid"><label>Ürün Adı<input name="name" value="${escapeHtml(product.name||'')}" required></label><label>Slug<input name="slug" value="${escapeHtml(product.slug||'')}" required></label><label>SKU<input name="sku" value="${escapeHtml(product.sku||'')}" required></label><label>Marka<input name="brand" value="${escapeHtml(product.brand||'Sıla Sarıoğlu')}" required></label><label>Kategori Slug<input name="categorySlug" value="${escapeHtml(product.categorySlug||'')}" required></label><label>Alt Kategori Slug<input name="subCategorySlug" value="${escapeHtml(product.subCategorySlug||'')}" required></label><label>Fiyat<input name="price" type="number" min="0" step="0.01" value="${product.price??''}" required></label><label>Eski Fiyat<input name="oldPrice" type="number" min="0" step="0.01" value="${product.oldPrice??''}"></label><label>İndirim Oranı<input name="discountPercent" type="number" min="0" max="100" value="${product.discountPercent??0}"></label><label>Stok<input name="stock" type="number" min="0" value="${product.stock??0}" required></label><label>Kritik Stok<input name="criticalStock" type="number" min="0" value="${product.criticalStock??5}"></label><label>Durum<select name="status"><option value="active" ${product.status!=='passive'?'selected':''}>Aktif</option><option value="passive" ${product.status==='passive'?'selected':''}>Pasif</option></select></label><label class="full">Görseller <small>Her satıra bir URL</small><textarea name="images" required>${escapeHtml((product.images||[]).join('\n'))}</textarea></label><label class="full">Thumbnail<input name="thumbnail" value="${escapeHtml(product.thumbnail||'')}" required></label><label>Renkler <small>JSON</small><textarea name="colors">${escapeHtml(colors)}</textarea></label><label>Bedenler <small>Virgülle ayırın</small><textarea name="sizes">${escapeHtml((product.sizes||[]).join(', '))}</textarea></label><label class="full">Varyantlar <small>JSON</small><textarea name="variants">${escapeHtml(variants)}</textarea></label><label class="full">Açıklama<textarea name="description">${escapeHtml(product.description||'')}</textarea></label><label>Kumaş Bilgisi<textarea name="fabricInfo">${escapeHtml(product.fabricInfo||'')}</textarea></label><label>Ölçüler<textarea name="measurements">${escapeHtml(product.measurements||'')}</textarea></label><label class="full">Bakım Talimatı<textarea name="careInstructions">${escapeHtml(product.careInstructions||'')}</textarea></label><fieldset class="full check-grid"><label><input type="checkbox" name="isFeatured" ${product.isFeatured?'checked':''}> Öne Çıkan</label><label><input type="checkbox" name="isDiscounted" ${product.isDiscounted?'checked':''}> İndirimli</label><label><input type="checkbox" name="isNew" ${product.isNew?'checked':''}> Yeni</label><label><input type="checkbox" name="isBestSeller" ${product.isBestSeller?'checked':''}> Çok Satan</label><label><input type="checkbox" name="freeShipping" ${product.freeShipping?'checked':''}> Ücretsiz Kargo</label></fieldset><label>SEO Başlık<input name="seoTitle" value="${escapeHtml(product.seoTitle||'')}"></label><label>SEO Açıklama<textarea name="seoDescription">${escapeHtml(product.seoDescription||'')}</textarea></label></div><div class="modal-actions"><button type="button" class="secondary" data-modal-close>Vazgeç</button><button type="submit">${product.id?'Ürünü Güncelle':'Ürünü Oluştur'}</button></div></form>`;
}

function parseJson(value,label){try{return value.trim()?JSON.parse(value):[]}catch{throw new Error(`${label} geçerli JSON formatında olmalı.`)}}
function serializeProduct(form){const data=new FormData(form);return {name:data.get('name').trim(),slug:data.get('slug').trim()||createSlug(data.get('name')),sku:data.get('sku').trim(),brand:data.get('brand').trim(),categorySlug:data.get('categorySlug').trim(),subCategorySlug:data.get('subCategorySlug').trim(),price:Number(data.get('price')),oldPrice:data.get('oldPrice')?Number(data.get('oldPrice')):null,discountPercent:Number(data.get('discountPercent')||0),images:data.get('images').split(/\r?\n/).map(value=>value.trim()).filter(Boolean),thumbnail:data.get('thumbnail').trim(),colors:parseJson(data.get('colors'),'Renkler'),sizes:data.get('sizes').split(',').map(value=>value.trim()).filter(Boolean),variants:parseJson(data.get('variants'),'Varyantlar'),stock:Number(data.get('stock')),criticalStock:Number(data.get('criticalStock')||0),description:data.get('description').trim(),fabricInfo:data.get('fabricInfo').trim(),measurements:data.get('measurements').trim(),careInstructions:data.get('careInstructions').trim(),isFeatured:data.has('isFeatured'),isDiscounted:data.has('isDiscounted'),isNew:data.has('isNew'),isBestSeller:data.has('isBestSeller'),freeShipping:data.has('freeShipping'),status:data.get('status'),seoTitle:data.get('seoTitle').trim(),seoDescription:data.get('seoDescription').trim()};}

async function renderCategories(){
  const result=await adminService.categories({page:1,limit:100});state.categories=result.items;
  document.getElementById('admin-content').innerHTML=`<section class="admin-panel"><div class="admin-panel-head"><div><p>${result.total} kayıt</p><h2>Kategoriler</h2></div><button type="button" data-category-create>Kategori Ekle</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Ad</th><th>Slug</th><th>Üst Kategori</th><th>Sıra</th><th>Durum</th><th>İşlemler</th></tr></thead><tbody>${result.items.map(category=>`<tr><td><strong>${escapeHtml(category.name)}</strong></td><td>${escapeHtml(category.slug)}</td><td>${escapeHtml(category.parentId||'—')}</td><td>${category.sortOrder??0}</td><td>${category.isActive?'Aktif':'Pasif'}</td><td><div class="table-actions"><button type="button" data-category-edit="${escapeHtml(category.id)}">Düzenle</button><button type="button" class="danger" data-category-delete="${escapeHtml(category.id)}">Sil</button></div></td></tr>`).join('')}</tbody></table></div>${result.items.length?'':listState()}</section>`;
}

function categoryForm(category={}){return `<form class="admin-form" id="category-form" data-id="${escapeHtml(category.id||'')}"><div class="form-grid"><label>Kategori Adı<input name="name" value="${escapeHtml(category.name||'')}" required></label><label>Slug<input name="slug" value="${escapeHtml(category.slug||'')}" required></label><label>Üst Kategori ID<input name="parentId" value="${escapeHtml(category.parentId||'')}"></label><label>Sıralama<input name="sortOrder" type="number" value="${category.sortOrder??0}"></label><label class="full">Açıklama<textarea name="description">${escapeHtml(category.description||'')}</textarea></label><label class="full">Görsel URL<input name="image" value="${escapeHtml(category.image||'')}"></label><label>SEO Başlık<input name="seoTitle" value="${escapeHtml(category.seoTitle||'')}"></label><label>SEO Açıklama<textarea name="seoDescription">${escapeHtml(category.seoDescription||'')}</textarea></label><label class="check"><input type="checkbox" name="isActive" ${category.isActive!==false?'checked':''}> Aktif</label></div><div class="modal-actions"><button type="button" class="secondary" data-modal-close>Vazgeç</button><button type="submit">Kaydet</button></div></form>`}

async function renderOrders(){
  const result=await adminService.orders({page:1,limit:100});state.orders=result.items;
  document.getElementById('admin-content').innerHTML=`<section class="admin-panel"><div class="admin-panel-head"><div><p>${result.total} kayıt</p><h2>Siparişler</h2></div></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Sipariş</th><th>Müşteri</th><th>Telefon</th><th>Toplam</th><th>Ödeme</th><th>Durum</th><th>Tarih</th><th>İşlemler</th></tr></thead><tbody>${result.items.map(order=>`<tr><td><strong>${escapeHtml(order.orderNumber||order.id)}</strong></td><td>${escapeHtml(valueOf(order,'customer.fullName'))}</td><td>${escapeHtml(valueOf(order,'customer.phone'))}</td><td>${formatPrice(order.total||0)}</td><td>${escapeHtml(order.paymentMethod)}</td><td><select class="order-status" data-order-status="${escapeHtml(order.id)}">${Object.entries(orderLabels).map(([value,label])=>`<option value="${value}" ${order.status===value?'selected':''}>${label}</option>`).join('')}</select></td><td>${order.createdAt?new Intl.DateTimeFormat('tr-TR').format(new Date(order.createdAt)):'—'}</td><td><button type="button" data-order-detail="${escapeHtml(order.id)}">Detay</button></td></tr>`).join('')}</tbody></table></div>${result.items.length?'':listState()}</section>`;
}

async function renderCustomers(){
  const result=await adminService.customers({page:1,limit:100});state.customers=result.items;
  document.getElementById('admin-content').innerHTML=`<section class="admin-panel"><div class="admin-panel-head"><div><p>${result.total} kayıt</p><h2>Müşteriler</h2></div></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Sipariş</th><th>Toplam Harcama</th><th>Kayıt</th></tr></thead><tbody>${result.items.map(customer=>`<tr><td><strong>${escapeHtml(customer.fullName)}</strong></td><td>${escapeHtml(customer.email)}</td><td>${escapeHtml(customer.phone)}</td><td>${customer.orderCount??0}</td><td>${formatPrice(customer.totalSpent??0)}</td><td>${customer.createdAt?new Intl.DateTimeFormat('tr-TR').format(new Date(customer.createdAt)):'—'}</td></tr>`).join('')}</tbody></table></div>${result.items.length?'':listState()}</section>`;
}

async function renderNewsletter(){
  const result=await adminService.newsletterSubscribers({page:1,limit:100});state.subscribers=result.items;
  document.getElementById('admin-content').innerHTML=`<section class="admin-panel"><div class="admin-panel-head"><div><p>${result.total} abone</p><h2>E-bülten Aboneleri</h2></div></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>E-posta</th><th>KVKK</th><th>Durum</th><th>Kayıt Tarihi</th></tr></thead><tbody>${result.items.map(item=>`<tr><td><strong>${escapeHtml(item.email)}</strong></td><td>${item.kvkkAccepted?'Onaylı':'—'}</td><td>${escapeHtml(item.status||'active')}</td><td>${item.createdAt?new Intl.DateTimeFormat('tr-TR').format(new Date(item.createdAt)):'—'}</td></tr>`).join('')}</tbody></table></div>${result.items.length?'':listState()}</section>`;
}

async function renderSettings(){
  const settings=await adminService.settings();
  document.getElementById('admin-content').innerHTML=`<section class="admin-panel settings-panel"><div class="admin-panel-head"><div><p>Mağaza yapılandırması</p><h2>Site Ayarları</h2></div></div><form class="admin-form" id="settings-form"><div class="form-grid"><label>Mağaza Adı<input name="storeName" value="${escapeHtml(settings.storeName||'Sıla Sarıoğlu')}"></label><label>Destek E-postası<input name="supportEmail" type="email" value="${escapeHtml(settings.supportEmail||'')}"></label><label>Destek Telefonu<input name="supportPhone" value="${escapeHtml(settings.supportPhone||'')}"></label><label>WhatsApp Numarası<input name="whatsappPhone" value="${escapeHtml(settings.whatsappPhone||'')}"></label><label>Ücretsiz Kargo Limiti<input name="freeShippingThreshold" type="number" min="0" value="${settings.freeShippingThreshold??1500}"></label><label class="check"><input name="maintenanceMode" type="checkbox" ${settings.maintenanceMode?'checked':''}> Bakım Modu</label></div><div class="modal-actions"><button type="submit">Ayarları Kaydet</button></div></form></section>`;
}

function openModal(title,content,size='wide'){
  const modalRoot=document.getElementById('admin-modal-root');modalRoot.innerHTML=`<div class="admin-modal" role="presentation"><section class="admin-modal-card ${size}" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><header><h2 id="admin-modal-title">${escapeHtml(title)}</h2><button type="button" data-modal-close aria-label="Kapat">×</button></header><div class="admin-modal-body">${content}</div><p class="modal-status" id="modal-status" role="status"></p></section></div>`;document.body.classList.add('modal-open');
}
function closeModal(){document.getElementById('admin-modal-root').innerHTML='';document.body.classList.remove('modal-open')}

document.addEventListener('click',async event=>{
  if(event.target.closest('[data-modal-close]')||event.target.classList.contains('admin-modal')){closeModal();return}
  if(event.target.closest('[data-product-create]')){openModal('Yeni Ürün',productForm());return}
  const productEdit=event.target.closest('[data-product-edit]');if(productEdit){openModal('Ürünü Düzenle',productForm(state.products.find(item=>String(item.id)===productEdit.dataset.productEdit)));return}
  const productDelete=event.target.closest('[data-product-delete]');if(productDelete&&confirm('Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?')){try{await adminService.deleteProduct(productDelete.dataset.productDelete);setStatus('Ürün silindi.','success');await renderProducts()}catch(error){setStatus(error.message,'error')}return}
  if(event.target.closest('[data-category-create]')){openModal('Yeni Kategori',categoryForm(), 'medium');return}
  const categoryEdit=event.target.closest('[data-category-edit]');if(categoryEdit){openModal('Kategoriyi Düzenle',categoryForm(state.categories.find(item=>String(item.id)===categoryEdit.dataset.categoryEdit)),'medium');return}
  const categoryDelete=event.target.closest('[data-category-delete]');if(categoryDelete&&confirm('Bu kategoriyi silmek istediğinize emin misiniz?')){try{await adminService.deleteCategory(categoryDelete.dataset.categoryDelete);setStatus('Kategori silindi.','success');await renderCategories()}catch(error){setStatus(error.message,'error')}return}
  const orderDetail=event.target.closest('[data-order-detail]');if(orderDetail){try{const order=await adminService.order(orderDetail.dataset.orderDetail);openModal(`Sipariş ${order.orderNumber||order.id}`,`<div class="order-detail"><div><span>Müşteri</span><strong>${escapeHtml(valueOf(order,'customer.fullName'))}</strong><p>${escapeHtml(valueOf(order,'customer.phone'))}<br>${escapeHtml(valueOf(order,'customer.email'))}</p></div><div><span>Teslimat</span><strong>${escapeHtml(valueOf(order,'shippingAddress.city'))} / ${escapeHtml(valueOf(order,'shippingAddress.district'))}</strong><p>${escapeHtml(valueOf(order,'shippingAddress.address'))}</p></div><div class="full"><span>Ürünler</span>${(order.items||[]).map(item=>`<p><strong>${escapeHtml(item.name||item.productName)}</strong> · ${escapeHtml(item.color)} · ${escapeHtml(item.size)} · ${item.quantity} adet — ${formatPrice((item.unitPrice||0)*item.quantity)}</p>`).join('')}</div><div><span>Ödeme</span><strong>${escapeHtml(order.paymentMethod)}</strong></div><div><span>Toplam</span><strong>${formatPrice(order.total||0)}</strong></div></div>`,'medium')}catch(error){setStatus(error.message,'error')}return}
});

document.addEventListener('change',async event=>{
  const select=event.target.closest('[data-order-status]');if(!select)return;
  const previous=state.orders.find(item=>String(item.id)===select.dataset.orderStatus)?.status;
  select.disabled=true;try{await adminService.updateOrderStatus(select.dataset.orderStatus,select.value);setStatus('Sipariş durumu güncellendi.','success')}catch(error){select.value=previous;setStatus(error.message,'error')}finally{select.disabled=false}
});

document.addEventListener('submit',async event=>{
  if(event.target.id==='product-form'){
    event.preventDefault();const form=event.target;const status=document.getElementById('modal-status');const button=form.querySelector('[type="submit"]');button.disabled=true;
    try{const payload=serializeProduct(form);if(form.dataset.id)await adminService.updateProduct(form.dataset.id,payload);else await adminService.createProduct(payload);closeModal();setStatus(form.dataset.id?'Ürün güncellendi.':'Ürün oluşturuldu.','success');await renderProducts()}catch(error){status.textContent=error.message;button.disabled=false}return;
  }
  if(event.target.id==='category-form'){
    event.preventDefault();const form=event.target;const data=new FormData(form);const payload={name:data.get('name').trim(),slug:data.get('slug').trim()||createSlug(data.get('name')),parentId:data.get('parentId').trim()||null,description:data.get('description').trim(),image:data.get('image').trim(),isActive:data.has('isActive'),sortOrder:Number(data.get('sortOrder')||0),seoTitle:data.get('seoTitle').trim(),seoDescription:data.get('seoDescription').trim()};
    try{if(form.dataset.id)await adminService.updateCategory(form.dataset.id,payload);else await adminService.createCategory(payload);closeModal();setStatus('Kategori kaydedildi.','success');await renderCategories()}catch(error){document.getElementById('modal-status').textContent=error.message}return;
  }
  if(event.target.id==='settings-form'){
    event.preventDefault();const data=new FormData(event.target);const payload={storeName:data.get('storeName').trim(),supportEmail:data.get('supportEmail').trim(),supportPhone:data.get('supportPhone').trim(),whatsappPhone:data.get('whatsappPhone').trim(),freeShippingThreshold:Number(data.get('freeShippingThreshold')||0),maintenanceMode:data.has('maintenanceMode')};
    try{await adminService.updateSettings(payload);setStatus('Site ayarları kaydedildi.','success')}catch(error){setStatus(error.message,'error')}
  }
});

async function boot(){
  if(usesMockApi){renderLogin();return}
  root.innerHTML='<div class="admin-boot">Yönetici oturumu kontrol ediliyor…</div>';
  try{const user=await authService.getMe();if(user?.role!=='admin'){renderLogin('Bu alana erişim yetkiniz bulunmuyor.');return}state.user=user;renderShell();await navigate(location.hash.slice(1)||'dashboard')}catch(error){if(error.status===401){renderLogin();return}renderLogin(error.message)}
}

boot();
