import { prisma } from '../config/prisma.js';
import { newsletterSchema } from '../validation/schemas.js';

export async function subscribe(req, res) {
  const payload = newsletterSchema.parse(req.body);
  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: payload.email.toLowerCase() },
    update: { status: 'active', kvkkAccepted: true },
    create: { email: payload.email.toLowerCase(), kvkkAccepted: true, status: 'active' }
  });

  res.status(201).json({
    success: true,
    message: 'Kaydınız alındı. Aramıza hoş geldiniz.',
    subscriber
  });
}
