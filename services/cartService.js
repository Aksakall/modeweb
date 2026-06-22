import { apiRequest } from './apiClient.js';
import { usesMockApi } from '../config/env.js';

const KEY='sila-guest-cart-v2';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const write=items=>{localStorage.setItem(KEY,JSON.stringify(items));return items};
const unwrapItems=data=>Array.isArray(data)?data:Array.isArray(data?.items)?data.items:Array.isArray(data?.cart?.items)?data.cart.items:[];
const hasItems=data=>Array.isArray(data)||Array.isArray(data?.items)||Array.isArray(data?.cart?.items);
async function mutateRemote(path,options){const data=await apiRequest(path,options);return hasItems(data)?unwrapItems(data):unwrapItems(await apiRequest('/api/cart'));}

export const cartService = {
  get:async()=>usesMockApi ? read() : unwrapItems(await apiRequest('/api/cart')),
  add:async payload=>{
    if(!usesMockApi) return mutateRemote('/api/cart/items',{method:'POST',body:payload});
    const items=read(); const existing=items.find(i=>i.productId===payload.productId && i.variantId===payload.variantId);
    if(existing) existing.quantity=Math.min(existing.stock,existing.quantity+(payload.quantity||1)); else items.push({...payload,id:crypto.randomUUID()});
    return write(items);
  },
  update:async(id,payload)=>{ if(!usesMockApi) return mutateRemote(`/api/cart/items/${id}`,{method:'PATCH',body:{quantity:Number(payload.quantity)}}); const items=read(); const item=items.find(i=>i.id===id); if(item)item.quantity=Math.max(1,Math.min(item.stock,payload.quantity)); return write(items); },
  remove:async id=>{ if(!usesMockApi) return mutateRemote(`/api/cart/items/${id}`,{method:'DELETE'}); return write(read().filter(i=>i.id!==id)); },
  clear:()=>usesMockApi ? Promise.resolve(write([])) : apiRequest('/api/cart/clear',{method:'DELETE'}),
  mergeGuest:items=>apiRequest('/api/cart/items',{method:'POST',body:{items,merge:true}})
};
