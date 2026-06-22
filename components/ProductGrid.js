import { productCardTemplate } from './ProductCard.js';
export function renderProductGrid(container,products){
  container.innerHTML=products.map(productCardTemplate).join('');
}

