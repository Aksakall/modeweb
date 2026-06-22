import { env } from '../config/env.js';

let accessToken = null;

export function setAccessToken(token){ accessToken = token || null; }
export function getAccessToken(){ return accessToken; }

export async function apiRequest(path, options = {}){
  if(!env.API_BASE_URL) throw new Error('API_NOT_CONFIGURED');
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), options.timeout || 12000);
  const headers = new Headers(options.headers || {});
  headers.set('Accept','application/json');
  if(options.body && !(options.body instanceof FormData)) headers.set('Content-Type','application/json');
  if(accessToken) headers.set('Authorization',`Bearer ${accessToken}`);
  try{
    const response = await fetch(`${env.API_BASE_URL.replace(/\/$/,'')}${path}`, {
      ...options, headers, credentials:'include', signal:controller.signal,
      body:options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
        ? JSON.stringify(options.body) : options.body
    });
    const data = response.status === 204 ? null : await response.json().catch(()=>null);
    if(!response.ok){
      const error = new Error(data?.message || `İstek tamamlanamadı (${response.status})`);
      error.status = response.status; error.data = data; throw error;
    }
    return data;
  }finally{ clearTimeout(timeout); }
}

export function toQuery(params = {}){
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key,value])=>{
    if(value !== undefined && value !== null && value !== '') query.set(key,String(value));
  });
  const result = query.toString();
  return result ? `?${result}` : '';
}

