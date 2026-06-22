import { apiRequest } from './apiClient.js';
import { usesMockApi } from '../config/env.js';
const KEY='sila-guest-favorites-v2';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const write=ids=>{localStorage.setItem(KEY,JSON.stringify(ids));return ids};
const unwrapIds=data=>(Array.isArray(data)?data:data?.items||[]).map(item=>typeof item==='object'?(item.productId||item.id):item);
const hasItems=data=>Array.isArray(data)||Array.isArray(data?.items);
async function mutateRemote(path,options){const data=await apiRequest(path,options);return hasItems(data)?unwrapIds(data):unwrapIds(await apiRequest('/api/favorites'));}
export const favoriteService={
  get:async()=>usesMockApi?read():unwrapIds(await apiRequest('/api/favorites')),
  add:async productId=>usesMockApi?write([...new Set([...read(),productId])]):mutateRemote('/api/favorites',{method:'POST',body:{productId}}),
  remove:async productId=>usesMockApi?write(read().filter(id=>id!==productId)):mutateRemote(`/api/favorites/${productId}`,{method:'DELETE'})
};
