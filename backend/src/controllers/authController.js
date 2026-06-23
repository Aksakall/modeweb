import { env } from '../config/env.js';
import { clearRefreshCookie, setRefreshCookie, signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/tokenService.js';

const adminUser = {
  id: 'admin-1',
  fullName: 'Sıla Sarıoğlu Admin',
  email: 'admin@silasarioglu.com',
  role: 'admin'
};

export function login(req, res) {
  const { email } = req.body;
  const user = String(email || '').includes('admin') ? adminUser : { id: 'user-1', fullName: 'Müşteri', email, role: 'customer' };
  const accessToken = signAccessToken(user);
  setRefreshCookie(res, signRefreshToken(user));
  res.json({ user, accessToken });
}

export function register(req, res) {
  const user = { id: `user-${Date.now()}`, fullName: req.body.fullName, email: req.body.email, role: 'customer' };
  const accessToken = signAccessToken(user);
  setRefreshCookie(res, signRefreshToken(user));
  res.status(201).json({ user, accessToken });
}

export function refresh(req, res) {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Refresh token bulunamadı.', code: 'REFRESH_TOKEN_MISSING' });

  try {
    const decoded = verifyRefreshToken(token);
    const user = decoded.sub === adminUser.id ? adminUser : { id: decoded.sub, fullName: 'Müşteri', role: 'customer' };
    return res.json({ accessToken: signAccessToken(user) });
  } catch {
    return res.status(401).json({ message: 'Refresh token geçersiz.', code: 'REFRESH_TOKEN_INVALID' });
  }
}

export function logout(req, res) {
  clearRefreshCookie(res);
  res.status(204).send();
}

export function me(req, res) {
  res.json({ user: req.user });
}

export function forgotPassword(req, res) {
  res.json({ success: true, message: 'Şifre sıfırlama yönergeleri e-posta adresinize gönderildi.' });
}

export function resetPassword(req, res) {
  res.json({ success: true, message: 'Şifreniz güncellendi.' });
}
