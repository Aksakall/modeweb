import { env } from './config/env.js';
const link=document.getElementById('contact-whatsapp');
if(link){link.href=env.WHATSAPP_PHONE?`https://wa.me/${env.WHATSAPP_PHONE}`:'https://wa.me/';}

