import { productService } from './services/productService.js';
import { favoriteStore } from './store/favoriteStore.js';
import { renderProductGrid } from './components/ProductGrid.js';
import { filterDrawerTemplate } from './components/FilterDrawer.js';

const wraps=document.querySelectorAll('.nav-link-wrap');
wraps.forEach(wrap=>{
  const button=wrap.querySelector('.nav-link');
  button.addEventListener('click',event=>{event.stopPropagation();wraps.forEach(item=>item!==wrap&&item.classList.remove('is-open'));wrap.classList.toggle('is-open')});
  document.addEventListener('click',event=>{if(!wrap.contains(event.target))wrap.classList.remove('is-open')});
});

const mobileMenu=document.getElementById('mobile-menu');
function openMobileMenu(){if(!mobileMenu)return;mobileMenu.hidden=false;mobileMenu.inert=false;mobileMenu.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(()=>mobileMenu.classList.add('is-open'))}
function closeMobileMenu(){if(!mobileMenu)return;mobileMenu.classList.remove('is-open');mobileMenu.inert=true;mobileMenu.setAttribute('aria-hidden','true');document.body.style.overflow='';setTimeout(()=>{if(!mobileMenu.classList.contains('is-open'))mobileMenu.hidden=true},380)}
document.getElementById('menu-open')?.addEventListener('click',openMobileMenu);
document.getElementById('menu-close')?.addEventListener('click',closeMobileMenu);
mobileMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMobileMenu));

document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>img.closest('.hero-media,.visual-card,.product-img,figure')?.classList.add('img-fallback')));

const grid=document.querySelector('.product-grid');
const section=grid?.closest('.section');
let page=1;const limit=8;let query={
  category:document.body.dataset.category||undefined,
  subCategory:document.body.dataset.subcategory||undefined,
  discounted:document.body.dataset.discounted||undefined,
  new:document.body.dataset.new||undefined,
  bestSeller:document.body.dataset.bestseller||undefined,
  sort:'newest',page,limit
};

if(grid&&section){
  grid.id='catalog-grid';
  grid.insertAdjacentHTML('beforebegin',`<div class="catalog-toolbar"><button type="button" id="filter-open">Filtrele</button><label for="catalog-sort">Sırala</label><select id="catalog-sort"><option value="newest">En Yeniler</option><option value="price_asc">Fiyat Artan</option><option value="price_desc">Fiyat Azalan</option></select></div><div class="catalog-active-filters" id="active-filters"></div><div class="catalog-state" id="catalog-state" role="status"></div>`);
  grid.insertAdjacentHTML('afterend','<button class="catalog-load-more" id="catalog-load-more" type="button">Daha Fazla Göster</button>');
  document.body.insertAdjacentHTML('beforeend',filterDrawerTemplate());
}

const state=document.getElementById('catalog-state');const loadMore=document.getElementById('catalog-load-more');let loaded=[];
function skeletons(){grid.innerHTML=Array.from({length:4},()=>'<div class="catalog-skeleton"><span></span><i></i><i></i></div>').join('')}
async function loadProducts({append=false}={}){
  if(!grid)return;state.textContent='Ürünler yükleniyor…';if(!append)skeletons();
  try{
    const result=await productService.list(query);loaded=append?[...loaded,...result.items]:result.items;
    if(!loaded.length){grid.innerHTML='';state.innerHTML='<strong>Bu seçime uygun ürün bulunamadı.</strong><span>Filtreleri temizleyerek yeniden deneyebilirsiniz.</span>';loadMore.hidden=true;return}
    renderProductGrid(grid,loaded);state.textContent=`${result.total} ürün`;loadMore.hidden=result.page>=result.totalPages;
  }catch(error){grid.innerHTML='';state.innerHTML=`<strong>Ürünler yüklenemedi.</strong><button type="button" id="catalog-retry">Tekrar Dene</button>`;document.getElementById('catalog-retry')?.addEventListener('click',()=>loadProducts());}
}
document.getElementById('catalog-sort')?.addEventListener('change',event=>{page=1;query={...query,sort:event.target.value,page};loadProducts()});
loadMore?.addEventListener('click',()=>{page+=1;query={...query,page};loadProducts({append:true})});

const drawer=document.getElementById('catalog-filter-drawer');
document.getElementById('filter-open')?.addEventListener('click',()=>{drawer.hidden=false;drawer.inert=false;drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'});
drawer?.querySelector('[data-filter-close]')?.addEventListener('click',()=>{drawer.hidden=true;drawer.inert=true;drawer.setAttribute('aria-hidden','true');document.body.style.overflow=''});
drawer?.querySelector('[data-filter-apply]')?.addEventListener('click',()=>{
  const minPrice=drawer.querySelector('[name="minPrice"]').value;const maxPrice=drawer.querySelector('[name="maxPrice"]').value;const inStock=drawer.querySelector('[name="inStock"]').checked||undefined;
  page=1;query={...query,minPrice,maxPrice,inStock,page};const chips=[minPrice&&`Min. ${minPrice} ₺`,maxPrice&&`Maks. ${maxPrice} ₺`,inStock&&'Stokta'].filter(Boolean);document.getElementById('active-filters').innerHTML=chips.map(text=>`<span>${text}</span>`).join('')+(chips.length?'<button type="button" data-filter-clear>Filtreleri Temizle</button>':'');
  drawer.hidden=true;drawer.inert=true;drawer.setAttribute('aria-hidden','true');document.body.style.overflow='';loadProducts();
});
document.getElementById('active-filters')?.addEventListener('click',event=>{if(!event.target.closest('[data-filter-clear]'))return;page=1;query={...query,minPrice:undefined,maxPrice:undefined,inStock:undefined,page};event.currentTarget.innerHTML='';drawer.querySelectorAll('input').forEach(input=>{if(input.type==='checkbox')input.checked=false;else input.value=''});loadProducts()});

grid?.addEventListener('click',async event=>{
  const favorite=event.target.closest('[data-favorite]');if(favorite){event.preventDefault();const active=await favoriteStore.toggle(favorite.dataset.favorite);favorite.textContent=active?'♥':'♡';favorite.setAttribute('aria-pressed',String(active));return}
  const add=event.target.closest('[data-catalog-add]');if(add){event.preventDefault();const product=loaded.find(item=>item.id===add.dataset.catalogAdd);if(product?.variants.length===1)location.href=`index.html?product=${product.slug}#urunler`;else location.href=`index.html?product=${product?.slug}#urunler`;}
});

await favoriteStore.load();
await loadProducts();
