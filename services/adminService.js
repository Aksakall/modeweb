import { apiRequest, normalizeListResponse, toQuery } from './apiClient.js';
export const adminService={
  dashboard:()=>apiRequest('/api/admin/dashboard'),
  products:async params=>normalizeListResponse(await apiRequest(`/api/admin/products${toQuery(params)}`),params),
  createProduct:payload=>apiRequest('/api/admin/products',{method:'POST',body:payload}),
  updateProduct:(id,payload)=>apiRequest(`/api/admin/products/${id}`,{method:'PATCH',body:payload}),
  deleteProduct:id=>apiRequest(`/api/admin/products/${id}`,{method:'DELETE'}),
  categories:async params=>normalizeListResponse(await apiRequest(`/api/admin/categories${toQuery(params)}`),params),
  createCategory:payload=>apiRequest('/api/admin/categories',{method:'POST',body:payload}),
  updateCategory:(id,payload)=>apiRequest(`/api/admin/categories/${id}`,{method:'PATCH',body:payload}),
  deleteCategory:id=>apiRequest(`/api/admin/categories/${id}`,{method:'DELETE'}),
  orders:async params=>normalizeListResponse(await apiRequest(`/api/admin/orders${toQuery(params)}`),params),
  order:id=>apiRequest(`/api/admin/orders/${id}`),
  updateOrderStatus:(id,status)=>apiRequest(`/api/admin/orders/${id}/status`,{method:'PATCH',body:{status}}),
  customers:async params=>normalizeListResponse(await apiRequest(`/api/admin/customers${toQuery(params)}`),params),
  newsletterSubscribers:async params=>normalizeListResponse(await apiRequest(`/api/admin/newsletter${toQuery(params)}`),params),
  settings:()=>apiRequest('/api/admin/settings'),
  updateSettings:payload=>apiRequest('/api/admin/settings',{method:'PATCH',body:payload})
};
