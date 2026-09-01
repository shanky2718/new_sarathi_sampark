import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding for Sarathi Sampark...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Seed Users
  const transporter = await prisma.user.upsert({
    where: { email: 'transporter@sarathi.in' },
    update: {},
    create: {
      name: 'Srinivas Murthy',
      email: 'transporter@sarathi.in',
      mobile: '+919876543210',
      passwordHash,
      role: 'Transporter',
      companyName: 'Sarathi Transports Pvt Ltd',
      gstNumber: '29ABCDE1234F1Z5',
      address: 'Plot 42, Peenya Industrial Area, Bengaluru, Karnataka',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560058',
      onboarded: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sarathi.in' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@sarathi.in',
      mobile: '+919800000000',
      passwordHash: adminPasswordHash,
      role: 'Admin',
      companyName: 'Sarathi Sampark Logistics Tech Ltd',
      city: 'Bengaluru',
      state: 'Karnataka',
      onboarded: true,
    },
  });

  // 2. Seed Return Loads
  const loads = [
    {
      loadId: 'LOAD #SS-2048',
      pickup: 'Chennai',
      destination: 'Bengaluru',
      distance: 350,
      cargo: 'Industrial Machinery',
      weight: '8 Tons',
      offeredPrice: 18500,
      estimatedFuelCost: 6200,
      estimatedProfit: 12300,
      verifiedShipper: true,
      shipperName: 'TVS Supply Chain Solutions',
      shipperRating: 4.9,
      postedTime: '18 mins ago',
      status: 'Available',
      requiredTruckType: 'Container 24ft',
    },
    {
      loadId: 'LOAD #SS-2049',
      pickup: 'Pune',
      destination: 'Mumbai',
      distance: 150,
      cargo: 'Auto Components',
      weight: '12 Tons',
      offeredPrice: 14200,
      estimatedFuelCost: 3800,
      estimatedProfit: 10400,
      verifiedShipper: true,
      shipperName: 'Tata AutoComp Systems',
      shipperRating: 4.8,
      postedTime: '45 mins ago',
      status: 'Available',
      requiredTruckType: 'Multi-Axle 32ft',
    },
    {
      loadId: 'LOAD #SS-2050',
      pickup: 'Hyderabad',
      destination: 'Chennai',
      distance: 620,
      cargo: 'Pharma Consignments',
      weight: '6 Tons',
      offeredPrice: 28000,
      estimatedFuelCost: 9500,
      estimatedProfit: 18500,
      verifiedShipper: true,
      shipperName: 'Reddy Laboratories',
      shipperRating: 5.0,
      postedTime: '2 hours ago',
      status: 'Available',
      requiredTruckType: 'Reefer Container',
    },
  ];

  for (const l of loads) {
    await prisma.returnLoad.upsert({
      where: { loadId: l.loadId },
      update: {},
      create: l as any,
    });
  }

  // 3. Seed Trucks
  const trucks = [
    {
      userId: transporter.id,
      truckId: 'TRK-101',
      plateNumber: 'KA-01-EQ-9876',
      model: 'Tata Signa 4825.TK',
      type: 'Multi-Axle 32ft',
      capacity: '28 Tons',
      driver: 'Rahul Kumar',
      status: 'Available',
      location: 'Bengaluru',
      fuel: 88,
      mileage: 145000,
    },
    {
      userId: transporter.id,
      truckId: 'TRK-102',
      plateNumber: 'KA-04-MB-4512',
      model: 'Ashok Leyland AVTR 3520',
      type: 'Container 24ft',
      capacity: '16 Tons',
      driver: 'Vikram Singh',
      status: 'Active',
      location: 'Chennai',
      fuel: 65,
      mileage: 98000,
    },
  ];

  for (const t of trucks) {
    await prisma.truck.upsert({
      where: { truckId: t.truckId },
      update: {},
      create: t as any,
    });
  }

  console.log('✅ Prisma Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
