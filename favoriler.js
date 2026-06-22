import { favoriteStore } from './store/favoriteStore.js';
import { productService } from './services/productService.js';
import { renderProductGrid } from './components/ProductGrid.js';

const grid=document.getElementById('favorite-grid');const state=document.getElementById('favorite-state');let currentProducts=[];
async function render(){
  const ids=await favoriteStore.load();const {items}=await productService.list({limit:100});const products=items.filter(item=>ids.includes(item.id));
  currentProducts=products;
  if(!products.length){grid.innerHTML='';state.innerHTML='<h2>Henüz favoriniz yok.</h2><p>Beğendiğiniz ürünleri kalp ikonuna dokunarak burada biriktirebilirsiniz.</p><a class="btn" href="index.html#urunler">Koleksiyonu Keşfet</a>';return}
  state.textContent=`${products.length} favori ürün`;renderProductGrid(grid,products);
}
grid.addEventListener('click',async event=>{
  const button=event.target.closest('[data-favorite]');
  if(button){event.preventDefault();await favoriteStore.toggle(button.dataset.favorite);render();return}
  const add=event.target.closest('[data-catalog-add]');
  if(add){event.preventDefault();const product=currentProducts.find(item=>item.id===add.dataset.catalogAdd);if(product)location.href=`index.html?product=${product.slug}#urunler`;}
});
render();
