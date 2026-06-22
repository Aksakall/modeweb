import { apiRequest } from './apiClient.js';
export const paymentService={
  create:payload=>apiRequest('/api/payments/create',{method:'POST',body:payload}),
  verify:payload=>apiRequest('/api/payments/verify',{method:'POST',body:payload}),
  options:()=>apiRequest('/api/payments/options')
};

