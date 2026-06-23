import { apiRequest, setAccessToken } from './apiClient.js';
import { cartService, guestCartStorage } from './cartService.js';

async function mergeGuestCartAfterAuth(data){
  setAccessToken(data?.accessToken);
  const guestItems = guestCartStorage.read();
  if(!data?.accessToken||!guestItems.length) return data;
  try{
    await cartService.mergeGuest(guestItems);
    guestCartStorage.clear();
    return {...data, cartMerged:true};
  }catch(error){
    return {...data, cartMerged:false, cartMergeError:error.message};
  }
}

export const authService = {
  async login(payload){ const data=await apiRequest('/api/auth/login',{method:'POST',body:payload}); return mergeGuestCartAfterAuth(data); },
  async register(payload){ const data=await apiRequest('/api/auth/register',{method:'POST',body:payload}); return mergeGuestCartAfterAuth(data); },
  async logout(){ try{ return await apiRequest('/api/auth/logout',{method:'POST'}); } finally{ setAccessToken(null); } },
  async getMe(){const data=await apiRequest('/api/auth/me');return data?.user||data;},
  forgotPassword:email=>apiRequest('/api/auth/forgot-password',{method:'POST',body:{email}}),
  resetPassword:payload=>apiRequest('/api/auth/reset-password',{method:'POST',body:payload})
};
