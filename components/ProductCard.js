import { formatPrice } from '../utils/formatPrice.js';

export function productCardTemplate(product){
  const badges=[product.isNew&&'Yeni',product.isBestSeller&&'Çok Satan',product.freeShipping&&'Ücretsiz Kargo'].filter(Boolean);
  const lowStock=product.stock>0&&product.stock<=product.criticalStock;
  return `<article class="catalog-product-card" data-product-id="${product.id}" data-product-slug="${product.slug}">
    <a class="catalog-product-image" href="index.html?product=${product.slug}#urunler" aria-label="${product.name} ürününü incele">
      <img src="${product.thumbnail}" alt="${product.name}" loading="lazy" sizes="(max-width:620px) 50vw, 25vw">
      ${product.isDiscounted?`<span class="catalog-discount">%${product.discountPercent}</span>`:''}
    </a>
    <button class="catalog-favorite" type="button" data-favorite="${product.id}" aria-label="${product.name} ürününü favorilere ekle">♡</button>
    <div class="catalog-product-meta">
      <span class="catalog-brand">${product.brand}</span><h3>${product.name}</h3>
      <div class="catalog-badges">${badges.map(text=>`<span>${text}</span>`).join('')}${lowStock?'<span class="stock-low">Stok Az</span>':''}</div>
      <div class="catalog-price">${product.oldPrice?`<del>${formatPrice(product.oldPrice)}</del>`:''}<strong>${formatPrice(product.price)}</strong></div>
      <div class="catalog-actions">
        <a href="index.html?product=${product.slug}#urunler">İncele</a>
        <button type="button" data-catalog-add="${product.id}" ${product.stock?'':'disabled'}>${product.stock?(product.variants.length===1?'Sepete Ekle':'Seçenekleri Gör'):'Gelince Haber Ver'}</button>
      </div>
    </div>
  </article>`;
}

