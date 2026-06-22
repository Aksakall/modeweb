import { apiRequest } from './apiClient.js';
import { usesMockApi } from '../config/env.js';
import { validators } from '../utils/validators.js';
export const newsletterService={
  async subscribe(email,kvkkAccepted){
    if(!validators.email(email)) throw new Error('Geçerli bir e-posta adresi girin.');
    if(!kvkkAccepted) throw new Error('KVKK bilgilendirmesini onaylamalısınız.');
    if(usesMockApi) return {success:true,message:'Kaydınız alındı. Aramıza hoş geldiniz.'};
    return apiRequest('/api/newsletter/subscribe',{method:'POST',body:{email,kvkkAccepted}});
  }
};

