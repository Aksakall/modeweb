import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Oturum doğrulanamadı.', code: 'UNAUTHENTICATED' });
  }

  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Oturum süresi doldu.', code: 'TOKEN_EXPIRED' });
  }
}

export function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Oturum süresi doldu.', code: 'TOKEN_EXPIRED' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Bu alana erişim yetkiniz bulunmuyor.', code: 'ADMIN_REQUIRED' });
  }

  return next();
}
