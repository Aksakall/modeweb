export function AdminLayout(content,title='Yönetim Paneli'){
  return `<div class="admin-shell"><aside><a href="admin.html">Sıla Sarıoğlu</a><nav><a href="#dashboard">Dashboard</a><a href="#products">Ürünler</a><a href="#categories">Kategoriler</a><a href="#orders">Siparişler</a><a href="#customers">Müşteriler</a><a href="#newsletter">E-bülten</a><a href="#settings">Site Ayarları</a></nav></aside><main><header><h1>${title}</h1><span>Güvenli Yönetim</span></header>${content}</main></div>`;
}
