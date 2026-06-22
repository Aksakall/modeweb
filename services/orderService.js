import { apiRequest, normalizeListResponse, toQuery } from './apiClient.js';
export const orderService={
  create:payload=>apiRequest('/api/orders',{method:'POST',body:payload}),
  list:async params=>normalizeListResponse(await apiRequest(`/api/orders${toQuery(params)}`),params), get:id=>apiRequest(`/api/orders/${id}`),
  cancel:id=>apiRequest(`/api/orders/${id}/cancel`,{method:'PATCH'}),
  adminList:()=>apiRequest('/api/admin/orders'),
  updateStatus:(id,status)=>apiRequest(`/api/admin/orders/${id}/status`,{method:'PATCH',body:{status}})
};
