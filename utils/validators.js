export const validators = {
  email:value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()),
  phone:value => /^\+?[0-9\s()-]{10,}$/.test(String(value).trim()),
  required:value => String(value ?? '').trim().length > 0,
  password:value => String(value).length >= 8
};

export function sanitizeText(value, maxLength = 500){
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, maxLength);
}

