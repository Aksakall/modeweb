import { apiRequest } from './apiClient.js';
import { usesMockApi } from '../config/env.js';

const KEY='sila-guest-cart-v2';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const write=items=>{localStorage.setItem(KEY,JSON.stringify(items));return items};

export const cartService = {
  get:()=>usesMockApi ? Promise.resolve(read()) : apiRequest('/api/cart'),
  add:payload=>{
    if(!usesMockApi) return apiRequest('/api/cart/items',{method:'POST',body:payload});
    const items=read(); const existing=items.find(i=>i.productId===payload.productId && i.variantId===payload.variantId);
    if(existing) existing.quantity=Math.min(existing.stock,existing.quantity+(payload.quantity||1)); else items.push({...payload,id:crypto.randomUUID()});
    return Promise.resolve(write(items));
  },
  update:(id,payload)=>{ if(!usesMockApi) return apiRequest(`/api/cart/items/${id}`,{method:'PATCH',body:payload}); const items=read(); const item=items.find(i=>i.id===id); if(item)item.quantity=Math.max(1,Math.min(item.stock,payload.quantity)); return Promise.resolve(write(items)); },
  remove:id=>{ if(!usesMockApi) return apiRequest(`/api/cart/items/${id}`,{method:'DELETE'}); return Promise.resolve(write(read().filter(i=>i.id!==id))); },
  clear:()=>usesMockApi ? Promise.resolve(write([])) : apiRequest('/api/cart/clear',{method:'DELETE'}),
  mergeGuest:items=>apiRequest('/api/cart/items',{method:'POST',body:{items,merge:true}})
};

