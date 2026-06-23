import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME || 'Sıla Sarıoğlu Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL ve ADMIN_PASSWORD env değerleri zorunludur.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      fullName,
      passwordHash,
      role: 'admin'
    },
    create: {
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin'
    }
  });

  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'Sıla Sarıoğlu',
      freeShippingThreshold: 1500
    }
  });

  console.log(`Admin kullanıcı hazır: ${user.email}`);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
