import { apiRequest, setAccessToken } from './apiClient.js';

export const authService = {
  async login(payload){ const data=await apiRequest('/api/auth/login',{method:'POST',body:payload}); setAccessToken(data?.accessToken); return data; },
  async register(payload){ const data=await apiRequest('/api/auth/register',{method:'POST',body:payload}); setAccessToken(data?.accessToken); return data; },
  async logout(){ try{ return await apiRequest('/api/auth/logout',{method:'POST'}); } finally{ setAccessToken(null); } },
  getMe:()=>apiRequest('/api/auth/me'),
  forgotPassword:email=>apiRequest('/api/auth/forgot-password',{method:'POST',body:{email}}),
  resetPassword:payload=>apiRequest('/api/auth/reset-password',{method:'POST',body:payload})
};

