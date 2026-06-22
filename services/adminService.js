import { apiRequest, toQuery } from './apiClient.js';
export const adminService={
  dashboard:()=>apiRequest('/api/admin/dashboard'),
  products:params=>apiRequest(`/api/admin/products${toQuery(params)}`),
  createProduct:payload=>apiRequest('/api/admin/products',{method:'POST',body:payload}),
  updateProduct:(id,payload)=>apiRequest(`/api/admin/products/${id}`,{method:'PATCH',body:payload}),
  deleteProduct:id=>apiRequest(`/api/admin/products/${id}`,{method:'DELETE'}),
  orders:params=>apiRequest(`/api/admin/orders${toQuery(params)}`),
  updateOrderStatus:(id,status)=>apiRequest(`/api/admin/orders/${id}/status`,{method:'PATCH',body:{status}}),
  customers:params=>apiRequest(`/api/admin/customers${toQuery(params)}`)
};

