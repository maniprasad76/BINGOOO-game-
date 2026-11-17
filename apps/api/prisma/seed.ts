import { PrismaClient } from '@prisma/client';
import { Role, PrizeType, RewardStatus } from '@bingooo/shared';
import * as argon2 from 'argon2';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const prisma = new PrismaClient();
const TIMEZONE = 'Asia/Kolkata';

async function main() {
  console.log('Seeding BINGOOO database...');

  // 1. App Settings
  const defaultSettings = [
    { key: 'STORE_NAME', value: 'BINGOOO', type: 'string' },
    { key: 'STORE_LOCATION', value: 'NH16, Kushalpuram, Srikakulam District, Andhra Pradesh, 532410, India (GPS: 18.296273, 83.869070)', type: 'string' },
    { key: 'STORE_PHONE', value: '+91 8942 222333', type: 'string' },
    { key: 'STORE_EMAIL', value: 'contact@bingooo.co.in', type: 'string' },
    { key: 'STORE_HOURS', value: '10:00 AM - 9:30 PM (Mon-Sun)', type: 'string' },
    { key: 'REWARD_EXPIRY_DAYS', value: '30', type: 'number' },
    { key: 'MOCK_OTP_ENABLED', value: 'true', type: 'boolean' },
    { key: 'BRAND_DOMAIN', value: 'bingooo.co.in', type: 'string' }
  ];

  for (const s of defaultSettings) {
    await prisma.appSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, type: s.type },
      create: s
    });
  }

  // 2. Admin Users
  const superAdminPassword = await argon2.hash('Bingooo@Admin2026!');
  const staffPassword = await argon2.hash('Staff@Bingooo2026!');

  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { passwordHash: superAdminPassword, role: Role.SUPER_ADMIN },
    create: {
      username: 'admin',
      email: 'admin@bingooo.co.in',
      name: 'BINGOOO Super Admin',
      passwordHash: superAdminPassword,
      role: Role.SUPER_ADMIN
    }
  });

  await prisma.adminUser.upsert({
    where: { username: 'staff1' },
    update: { passwordHash: staffPassword, role: Role.STAFF },
    create: {
      username: 'staff1',
      email: 'staff1@bingooo.co.in',
      name: 'Srikakulam Store Staff',
      passwordHash: staffPassword,
      role: Role.STAFF
    }
  });

  // 3. Current Campaign (Month of current IST date)
  const now = new Date();
  const zonedNow = toZonedTime(now, TIMEZONE);
  const monthStart = startOfMonth(zonedNow);
  const nextMonthStart = startOfMonth(addMonths(zonedNow, 1));
  const periodKey = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;

  const currentCampaign = await prisma.campaign.upsert({
    where: { periodKey },
    update: {
      name: `BINGOOO Festive Spin - ${monthStart.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
      startsAt: monthStart,
      endsAt: nextMonthStart,
      isActive: true
    },
    create: {
      name: `BINGOOO Festive Spin - ${monthStart.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
      periodKey,
      startsAt: monthStart,
      endsAt: nextMonthStart,
      description: 'Monthly customer promotional spin wheel for BINGOOO Men Store, Srikakulam',
      isActive: true
    }
  });

  // 4. Prizes: FREE CUSTOM T-SHIRT (₹3000+ Bill), 20% OFF, 10% OFF, 5% OFF, FREE GIFT
  const defaultPrizes = [
    {
      type: PrizeType.FREE_CUSTOM_TSHIRT,
      name: 'FREE Customised T-Shirt (On ₹3000+ Bill)',
      description: 'Shop above ₹3,000 at BINGOOO Srikakulam store & get an exclusive custom-designed premium T-Shirt completely FREE!',
      weight: 15,
      basisPoints: 1500,
      color: '#C91F32', // Rich Red
      textColor: '#FFFFFF',
      displayOrder: 1
    },
    {
      type: PrizeType.DISCOUNT_20,
      name: '20% OFF Mega Discount',
      description: 'Exclusive 20% OFF on all shirts, jeans, and premium collections at BINGOOO Srikakulam.',
      weight: 15,
      basisPoints: 1500,
      color: '#D4AF37', // Metallic Gold
      textColor: '#111111',
      displayOrder: 2
    },
    {
      type: PrizeType.DISCOUNT_10,
      name: '10% OFF Entire Purchase',
      description: 'Get flat 10% discount on T-shirts, Shirts, Jeans & Trousers at BINGOOO Srikakulam.',
      weight: 25,
      basisPoints: 2500,
      color: '#1E1E1E', // Dark Charcoal
      textColor: '#D4AF37',
      displayOrder: 3
    },
    {
      type: PrizeType.DISCOUNT_5,
      name: '5% OFF Any Garment',
      description: 'Enjoy 5% off on your stylish purchase at BINGOOO store.',
      weight: 25,
      basisPoints: 2500,
      color: '#C91F32', // Rich Red
      textColor: '#FFFFFF',
      displayOrder: 4
    },
    {
      type: PrizeType.FREE_GIFT,
      name: 'FREE Fashion Accessory',
      description: 'Exclusive BINGOOO branded fashion accessory / keyring on your store visit.',
      weight: 20,
      basisPoints: 2000,
      color: '#D4AF37', // Metallic Gold
      textColor: '#111111',
      displayOrder: 5
    }
  ];

  for (const p of defaultPrizes) {
    const existing = await prisma.prize.findFirst({ where: { type: p.type } });
    let prizeId = existing?.id;
    if (existing) {
      await prisma.prize.update({
        where: { id: existing.id },
        data: p
      });
    } else {
      const created = await prisma.prize.create({ data: p });
      prizeId = created.id;
    }

    if (p.type === PrizeType.FREE_GIFT && prizeId) {
      await prisma.giftInventory.upsert({
        where: { prizeId },
        update: { totalStock: 100, monthlyLimit: 50 },
        create: {
          prizeId,
          giftName: 'BINGOOO Premium Leather Keyring / Pocket Diary',
          totalStock: 100,
          reservedStock: 0,
          redeemedStock: 0,
          monthlyLimit: 50
        }
      });
    }
  }

  // Record initial PrizeConfigurationVersion snapshot
  const allPrizes = await prisma.prize.findMany();
  await prisma.prizeConfigurationVersion.create({
    data: {
      snapshot: JSON.stringify(allPrizes),
      appliedBy: 'SYSTEM_SEED'
    }
  });

  // 5. Create Demo Verified Customer for Instant Local Testing
  const demoCustomer = await prisma.customer.upsert({
    where: { phoneNumber: '+919876543210' },
    update: { isVerified: true },
    create: {
      phoneNumber: '+919876543210',
      isVerified: true,
      marketingConsent: true
    }
  });

  // 6. Seed Default Srikakulam Store
  const store = await prisma.store.upsert({
    where: { storeCode: 'SRIKAKULAM_MAIN' },
    update: {},
    create: {
      name: 'BINGOOO Srikakulam Flagship Store',
      storeCode: 'SRIKAKULAM_MAIN',
      address: 'NH16, Kushalpuram, Srikakulam District',
      city: 'Srikakulam',
      active: true
    }
  });

  // 7. Initialize Loyalty Account & Welcome Coins for Demo Customer
  await prisma.loyaltyAccount.upsert({
    where: { customerId: demoCustomer.id },
    update: {},
    create: {
      customerId: demoCustomer.id,
      status: 'ACTIVE'
    }
  });

  console.log('Seed completed successfully!');
  console.log(`Default Super Admin: admin / Bingooo@Admin2026!`);
  console.log(`Default Staff User: staff1 / Staff@Bingooo2026!`);
  console.log(`Demo Verified Customer Phone: +91 9876543210 (Default mock OTP: 123456)`);
  console.log(`Current Period: ${periodKey}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
