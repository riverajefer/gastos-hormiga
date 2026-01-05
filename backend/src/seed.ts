import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default settings
  await prisma.userSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      reminderEnabled: false,
      reminderTime: '21:00',
      darkMode: true,
      currency: 'COP',
    },
  });

  // Create default quick expenses
  const quickExpenses = [
    { concept: 'Café', amount: 3500, category: 'bebidas', order: 0 },
    { concept: 'Bus', amount: 2800, category: 'transporte', order: 1 },
    { concept: 'Snack', amount: 5000, category: 'antojos', order: 2 },
    { concept: 'Almuerzo', amount: 15000, category: 'comida', order: 3 },
    { concept: 'Tinto', amount: 1500, category: 'bebidas', order: 4 },
  ];

  for (const qe of quickExpenses) {
    const existing = await prisma.quickExpense.findFirst({
      where: { concept: qe.concept },
    });

    if (!existing) {
      await prisma.quickExpense.create({ data: qe });
    }
  }

  // Create some sample expenses for testing
  const today = new Date();
  const sampleExpenses = [
    { concept: 'Café de la mañana', amount: 3500, category: 'bebidas', daysAgo: 0 },
    { concept: 'Almuerzo corrientazo', amount: 14000, category: 'comida', daysAgo: 0 },
    { concept: 'Transmilenio', amount: 2950, category: 'transporte', daysAgo: 0 },
    { concept: 'Café tarde', amount: 4500, category: 'bebidas', daysAgo: 1 },
    { concept: 'Empanada', amount: 3000, category: 'comida', daysAgo: 1 },
    { concept: 'Uber a casa', amount: 12000, category: 'transporte', daysAgo: 1 },
    { concept: 'Chocolatina Jet', amount: 2500, category: 'antojos', daysAgo: 2 },
    { concept: 'Tinto oficina', amount: 1500, category: 'bebidas', daysAgo: 2 },
    { concept: 'Almuerzo restaurante', amount: 22000, category: 'comida', daysAgo: 2 },
    { concept: 'Netflix', amount: 33000, category: 'entretenimiento', daysAgo: 3 },
    { concept: 'Galletas Oreo', amount: 5500, category: 'antojos', daysAgo: 3 },
    { concept: 'Bus ida', amount: 2800, category: 'transporte', daysAgo: 4 },
    { concept: 'Bus vuelta', amount: 2800, category: 'transporte', daysAgo: 4 },
    { concept: 'Helado', amount: 8000, category: 'antojos', daysAgo: 5 },
  ];

  for (const expense of sampleExpenses) {
    const expenseDate = new Date(today);
    expenseDate.setDate(today.getDate() - expense.daysAgo);
    expenseDate.setHours(12, 0, 0, 0);

    await prisma.expense.create({
      data: {
        concept: expense.concept,
        amount: expense.amount,
        category: expense.category,
        date: expenseDate,
      },
    });
  }

  // Set a sample budget for current month
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  await prisma.monthlyBudget.upsert({
    where: {
      month_year: { month: currentMonth, year: currentYear },
    },
    update: {},
    create: {
      month: currentMonth,
      year: currentYear,
      limit: 300000, // $300.000 COP
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
