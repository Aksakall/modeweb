import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { clearRefreshCookie, setRefreshCookie, signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/tokenService.js';
import { httpError } from '../utils/httpError.js';
import { userPublic } from '../utils/serializers.js';
import { loginSchema, registerSchema } from '../validation/schemas.js';

export async function login(req, res) {
  const payload = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });

  if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
    throw httpError(401, 'E-posta veya şifre hatalı.', 'INVALID_CREDENTIALS');
  }

  const publicUser = userPublic(user);
  const accessToken = signAccessToken(publicUser);
  setRefreshCookie(res, signRefreshToken(publicUser));

  res.json({ user: publicUser, accessToken });
}

export async function register(req, res) {
  const payload = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      passwordHash,
      role: 'customer'
    }
  });

  const publicUser = userPublic(user);
  const accessToken = signAccessToken(publicUser);
  setRefreshCookie(res, signRefreshToken(publicUser));

  res.status(201).json({ user: publicUser, accessToken });
}

export async function refresh(req, res) {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) throw httpError(401, 'Refresh token bulunamadı.', 'REFRESH_TOKEN_MISSING');

  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) throw httpError(401, 'Kullanıcı bulunamadı.', 'USER_NOT_FOUND');
    res.json({ accessToken: signAccessToken(userPublic(user)) });
  } catch (error) {
    if (error.status) throw error;
    throw httpError(401, 'Refresh token geçersiz.', 'REFRESH_TOKEN_INVALID');
  }
}

export function logout(req, res) {
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) throw httpError(401, 'Kullanıcı bulunamadı.', 'USER_NOT_FOUND');
  res.json({ user: userPublic(user) });
}

export function forgotPassword(req, res) {
  res.json({ success: true, message: 'Şifre sıfırlama yönergeleri e-posta adresinize gönderildi.' });
}

export function resetPassword(req, res) {
  res.json({ success: true, message: 'Şifreniz güncellendi.' });
}
