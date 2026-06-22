import { apiRequest } from './apiClient.js';
import { usesMockApi } from '../config/env.js';
const KEY='sila-guest-favorites-v2';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const write=ids=>{localStorage.setItem(KEY,JSON.stringify(ids));return ids};
export const favoriteService={
  get:()=>usesMockApi?Promise.resolve(read()):apiRequest('/api/favorites'),
  add:productId=>usesMockApi?Promise.resolve(write([...new Set([...read(),productId])])):apiRequest('/api/favorites',{method:'POST',body:{productId}}),
  remove:productId=>usesMockApi?Promise.resolve(write(read().filter(id=>id!==productId))):apiRequest(`/api/favorites/${productId}`,{method:'DELETE'})
};

