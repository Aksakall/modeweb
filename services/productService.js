import { apiRequest, toQuery } from './apiClient.js';
import { usesMockApi } from '../config/env.js';
import { mockProducts } from '../data/mockProducts.js';

function filterMock(params = {}){
  let products = [...mockProducts];
  if(params.category) products = products.filter(p=>p.categorySlug === params.category);
  if(params.subCategory) products = products.filter(p=>p.subCategorySlug === params.subCategory);
  if(params.search){ const q=String(params.search).toLocaleLowerCase('tr-TR'); products=products.filter(p=>`${p.name} ${p.category} ${p.subCategory}`.toLocaleLowerCase('tr-TR').includes(q)); }
  if(String(params.discounted) === 'true') products = products.filter(p=>p.isDiscounted);
  if(String(params.featured) === 'true') products = products.filter(p=>p.isFeatured);
  if(String(params.new) === 'true') products = products.filter(p=>p.isNew);
  if(String(params.bestSeller) === 'true') products = products.filter(p=>p.isBestSeller);
  if(String(params.inStock) === 'true') products = products.filter(p=>p.stock > 0);
  if(params.minPrice) products = products.filter(p=>p.price >= Number(params.minPrice));
  if(params.maxPrice) products = products.filter(p=>p.price <= Number(params.maxPrice));
  if(params.sort === 'price_asc') products.sort((a,b)=>a.price-b.price);
  if(params.sort === 'price_desc') products.sort((a,b)=>b.price-a.price);
  if(params.sort === 'newest') products.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const page = Math.max(1,Number(params.page)||1); const limit=Math.max(1,Number(params.limit)||24); const total=products.length;
  return { items:products.slice((page-1)*limit,page*limit), total, page, limit, totalPages:Math.ceil(total/limit) };
}

export const productService = {
  list:params => usesMockApi ? Promise.resolve(filterMock(params)) : apiRequest(`/api/products${toQuery(params)}`),
  getBySlug:slug => usesMockApi ? Promise.resolve(mockProducts.find(p=>p.slug===slug) || null) : apiRequest(`/api/products/${encodeURIComponent(slug)}`),
  getAdmin:params => apiRequest(`/api/admin/products${toQuery(params)}`),
  createAdmin:payload => apiRequest('/api/admin/products',{method:'POST',body:payload}),
  updateAdmin:(id,payload)=>apiRequest(`/api/admin/products/${id}`,{method:'PATCH',body:payload}),
  deleteAdmin:id=>apiRequest(`/api/admin/products/${id}`,{method:'DELETE'})
};
