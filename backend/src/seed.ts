import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database from backup...');

  // Clear existing data
  await prisma.expense.deleteMany();
  await prisma.quickExpense.deleteMany();
  await prisma.monthlyBudget.deleteMany();
  await prisma.userSettings.deleteMany();

  // Create user settings from backup
  await prisma.userSettings.create({
    data: {
      id: 'default',
      reminderEnabled: true,
      reminderTime: '21:00',
      darkMode: true,
      currency: 'COP',
    },
  });

  // Create expenses from backup
  const expenses = [
    { id: 'cmk1ul8310001qnrx2qomyn2q', concept: 'Cerveza', amount: 34000, category: 'bebidas', date: new Date('2026-01-02 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-06 00:25:01.738'), updatedAt: new Date('2026-01-06 00:25:01.738') },
    { id: 'cmk1umdz70002qnrxxdj00358', concept: 'Obleas', amount: 8000, category: 'comida', date: new Date('2026-01-03 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-06 00:25:56.033'), updatedAt: new Date('2026-01-06 00:25:56.033') },
    { id: 'cmk1unxmc0004qnrxppjtbjtg', concept: 'Panela D1', amount: 10000, category: 'comida', date: new Date('2026-01-03 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-06 00:27:08.149'), updatedAt: new Date('2026-01-06 00:27:36.71') },
    { id: 'cmk1unexb0003qnrxmdnbpqjs', concept: 'Compra D1 Fusa', amount: 59300, category: 'otros', date: new Date('2026-01-03 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-06 00:26:43.761'), updatedAt: new Date('2026-01-06 00:27:51.21') },
    { id: 'cmk1uqew60005qnrx8g99jz8w', concept: 'Dinero a mamá', amount: 50000, category: 'otros', date: new Date('2026-01-04 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-06 00:29:03.845'), updatedAt: new Date('2026-01-06 00:29:03.845') },
    { id: 'cmk21kaad0000sfme2hw77owf', concept: 'Almuerzo 04 Enero', amount: 35000, category: 'comida', date: new Date('2026-01-04 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-06 03:40:15.234'), updatedAt: new Date('2026-01-06 03:40:15.234') },
    { id: 'cmk4wpq2q00002ldyvryks2ob', concept: 'Recarga tarjeta TransMilenio', amount: 10000, category: 'transporte', date: new Date('2026-01-08 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-08 03:47:49.436'), updatedAt: new Date('2026-01-08 03:47:49.436') },
    { id: 'cmk5lhxyu00003194iuzutj8o', concept: 'Parque Salitre', amount: 100000, category: 'entretenimiento', date: new Date('2026-01-08 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-08 15:21:36.821'), updatedAt: new Date('2026-01-08 15:21:36.821') },
    { id: 'cmkag9ske0000gviwkuxhd06i', concept: 'Pollo', amount: 55000, category: 'comida', date: new Date('2026-01-10 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-12 00:54:09.36'), updatedAt: new Date('2026-01-12 00:54:09.36') },
    { id: 'cmkagbepp0001gviwuvd6jnxn', concept: 'leche', amount: 22600, category: 'otros', date: new Date('2026-01-12 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-12 00:55:24.727'), updatedAt: new Date('2026-01-12 00:55:24.727') },
    { id: 'cmkgwjmxj0000lzjrta2tkr21', concept: 'Comida Carnitas', amount: 60000, category: 'comida', date: new Date('2026-01-10 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-16 13:16:19.544'), updatedAt: new Date('2026-01-16 13:16:35.866') },
    { id: 'cmkgwkwmh0001lzjrkpuhy6vv', concept: 'Compra Dollar City.', amount: 20000, category: 'otros', date: new Date('2026-01-14 12:00:00'), isRecurring: false, createdAt: new Date('2026-01-16 13:17:18.76'), updatedAt: new Date('2026-01-16 13:17:18.76') },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense });
  }

  // Create monthly budget from backup
  await prisma.monthlyBudget.create({
    data: {
      id: 'cmk1pvdy100007vvdqjk0hzqr',
      month: 1,
      year: 2026,
      limit: 400000,
    },
  });

  // Create quick expense from backup
  await prisma.quickExpense.create({
    data: {
      id: 'cmk21l0kd0001sfmee5u8zqzc',
      concept: 'Ensalada 🥗',
      amount: 4000,
      category: 'comida',
      order: 0,
      usageCount: 1,
      createdAt: new Date('2026-01-06 03:40:49.309'),
      updatedAt: new Date('2026-01-06 04:05:47.472'),
    },
  });

  console.log('✅ Database seeded successfully from backup!');
  console.log('📊 Loaded:');
  console.log(`  - ${expenses.length} expenses`);
  console.log(`  - 1 monthly budget`);
  console.log(`  - 1 quick expense`);
  console.log(`  - User settings`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
