const viteEnv = import.meta.env || {};
const runtimeEnv = globalThis.__SILA_ENV__ || {};

export const env = Object.freeze({
  API_BASE_URL: viteEnv.VITE_API_BASE_URL || runtimeEnv.VITE_API_BASE_URL || '',
  APP_ENV: viteEnv.VITE_APP_ENV || runtimeEnv.VITE_APP_ENV || 'development',
  WHATSAPP_PHONE: String(viteEnv.VITE_WHATSAPP_PHONE || runtimeEnv.VITE_WHATSAPP_PHONE || '').replace(/\D/g, '')
});

export const usesMockApi = !env.API_BASE_URL;

