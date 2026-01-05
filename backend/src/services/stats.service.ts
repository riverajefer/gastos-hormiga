import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MonthlyStats {
  totalSpent: number;
  expenseCount: number;
  dailyAverage: number;
  maxDay: { date: string; total: number } | null;
  topConcepts: { concept: string; count: number; total: number }[];
  byCategory: { category: string; total: number; count: number }[];
  byDay: { date: string; total: number; count: number }[];
  daysInMonth: number;
  currentDay: number;
  budget?: { limit: number; percentage: number } | null;
}

export interface YearlyStats {
  totalSpent: number;
  monthlyAverage: number;
  byMonth: { month: number; total: number; count: number }[];
  byCategory: { category: string; total: number; yearlyProjection: number }[];
  projections: {
    concept: string;
    monthlyAverage: number;
    yearlyProjection: number;
    equivalentItems: string[];
  }[];
}

export interface ComparisonStats {
  current: { month: number; year: number; total: number; count: number };
  previous: { month: number; year: number; total: number; count: number };
  difference: number;
  percentageChange: number;
}

export async function getMonthlyStats(year: number, month: number): Promise<MonthlyStats> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const currentDay = today.getFullYear() === year && today.getMonth() + 1 === month
    ? today.getDate()
    : daysInMonth;

  // Get all expenses for the month
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'desc' },
  });

  // Calculate totals
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expenseCount = expenses.length;
  const dailyAverage = currentDay > 0 ? Math.round(totalSpent / currentDay) : 0;

  // Group by day
  const byDayMap = new Map<string, { total: number; count: number }>();
  expenses.forEach(e => {
    const dateStr = e.date.toISOString().split('T')[0];
    const existing = byDayMap.get(dateStr) || { total: 0, count: 0 };
    byDayMap.set(dateStr, {
      total: existing.total + e.amount,
      count: existing.count + 1,
    });
  });

  const byDay = Array.from(byDayMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Find max day
  let maxDay: { date: string; total: number } | null = null;
  byDay.forEach(day => {
    if (!maxDay || day.total > maxDay.total) {
      maxDay = { date: day.date, total: day.total };
    }
  });

  // Group by category
  const byCategoryMap = new Map<string, { total: number; count: number }>();
  expenses.forEach(e => {
    const existing = byCategoryMap.get(e.category) || { total: 0, count: 0 };
    byCategoryMap.set(e.category, {
      total: existing.total + e.amount,
      count: existing.count + 1,
    });
  });

  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.total - a.total);

  // Top concepts
  const byConceptMap = new Map<string, { count: number; total: number }>();
  expenses.forEach(e => {
    const concept = e.concept.toLowerCase();
    const existing = byConceptMap.get(concept) || { count: 0, total: 0 };
    byConceptMap.set(concept, {
      count: existing.count + 1,
      total: existing.total + e.amount,
    });
  });

  const topConcepts = Array.from(byConceptMap.entries())
    .map(([concept, data]) => ({ concept, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Get budget
  const budgetRecord = await prisma.monthlyBudget.findUnique({
    where: {
      month_year: { month, year },
    },
  });

  const budget = budgetRecord?.limit
    ? {
        limit: budgetRecord.limit,
        percentage: Math.round((totalSpent / budgetRecord.limit) * 100),
      }
    : null;

  return {
    totalSpent,
    expenseCount,
    dailyAverage,
    maxDay,
    topConcepts,
    byCategory,
    byDay,
    daysInMonth,
    currentDay,
    budget,
  };
}

export async function getYearlyStats(year: number): Promise<YearlyStats> {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Determine how many months have passed
  const today = new Date();
  const monthsPassed = today.getFullYear() === year
    ? today.getMonth() + 1
    : 12;
  
  const monthlyAverage = monthsPassed > 0 ? Math.round(totalSpent / monthsPassed) : 0;

  // Group by month
  const byMonthMap = new Map<number, { total: number; count: number }>();
  expenses.forEach(e => {
    const month = e.date.getMonth() + 1;
    const existing = byMonthMap.get(month) || { total: 0, count: 0 };
    byMonthMap.set(month, {
      total: existing.total + e.amount,
      count: existing.count + 1,
    });
  });

  const byMonth = Array.from(byMonthMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month - b.month);

  // Group by category with yearly projections
  const byCategoryMap = new Map<string, number>();
  expenses.forEach(e => {
    byCategoryMap.set(e.category, (byCategoryMap.get(e.category) || 0) + e.amount);
  });

  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, total]) => ({
      category,
      total,
      yearlyProjection: Math.round((total / monthsPassed) * 12),
    }))
    .sort((a, b) => b.total - a.total);

  // Calculate projections for shame mode
  const byConceptMap = new Map<string, number>();
  expenses.forEach(e => {
    const concept = e.concept.toLowerCase();
    byConceptMap.set(concept, (byConceptMap.get(concept) || 0) + e.amount);
  });

  const equivalentItems = [
    { name: 'Netflix (1 año)', price: 360000 },
    { name: 'iPhone SE', price: 2000000 },
    { name: 'Viaje a San Andrés', price: 1500000 },
    { name: 'PlayStation 5', price: 2500000 },
    { name: 'Bicicleta', price: 800000 },
    { name: 'AirPods Pro', price: 1200000 },
    { name: 'Cursos en línea', price: 500000 },
    { name: 'Suscripción gimnasio (1 año)', price: 1200000 },
  ];

  const projections = Array.from(byConceptMap.entries())
    .map(([concept, total]) => {
      const monthlyAverage = Math.round(total / monthsPassed);
      const yearlyProjection = monthlyAverage * 12;
      
      const items = equivalentItems
        .filter(item => yearlyProjection >= item.price * 0.8)
        .map(item => item.name);
      
      return {
        concept,
        monthlyAverage,
        yearlyProjection,
        equivalentItems: items.slice(0, 3),
      };
    })
    .filter(p => p.yearlyProjection > 100000) // Only show significant expenses
    .sort((a, b) => b.yearlyProjection - a.yearlyProjection)
    .slice(0, 10);

  return {
    totalSpent,
    monthlyAverage,
    byMonth,
    byCategory,
    projections,
  };
}

export async function getComparisonStats(
  year: number,
  month: number
): Promise<ComparisonStats> {
  // Current month
  const currentStart = new Date(year, month - 1, 1);
  const currentEnd = new Date(year, month, 0, 23, 59, 59, 999);

  // Previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const previousStart = new Date(prevYear, prevMonth - 1, 1);
  const previousEnd = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999);

  const [currentExpenses, previousExpenses] = await Promise.all([
    prisma.expense.findMany({
      where: { date: { gte: currentStart, lte: currentEnd } },
    }),
    prisma.expense.findMany({
      where: { date: { gte: previousStart, lte: previousEnd } },
    }),
  ]);

  const currentTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousTotal = previousExpenses.reduce((sum, e) => sum + e.amount, 0);
  const difference = currentTotal - previousTotal;
  const percentageChange = previousTotal > 0
    ? Math.round((difference / previousTotal) * 100)
    : 0;

  return {
    current: {
      month,
      year,
      total: currentTotal,
      count: currentExpenses.length,
    },
    previous: {
      month: prevMonth,
      year: prevYear,
      total: previousTotal,
      count: previousExpenses.length,
    },
    difference,
    percentageChange,
  };
}

export async function getStatsByCategory(year: number, month?: number) {
  let startDate: Date;
  let endDate: Date;

  if (month) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0, 23, 59, 59, 999);
  } else {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31, 23, 59, 59, 999);
  }

  const expenses = await prisma.expense.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
  });

  const byCategory = new Map<string, { total: number; count: number }>();
  expenses.forEach(e => {
    const existing = byCategory.get(e.category) || { total: 0, count: 0 };
    byCategory.set(e.category, {
      total: existing.total + e.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(byCategory.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.total - a.total);
}

export async function getStatsByWeekday(year: number, month?: number) {
  let startDate: Date;
  let endDate: Date;

  if (month) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0, 23, 59, 59, 999);
  } else {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31, 23, 59, 59, 999);
  }

  const expenses = await prisma.expense.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
  });

  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const byWeekday = new Map<number, { total: number; count: number }>();

  expenses.forEach(e => {
    const day = e.date.getDay();
    const existing = byWeekday.get(day) || { total: 0, count: 0 };
    byWeekday.set(day, {
      total: existing.total + e.amount,
      count: existing.count + 1,
    });
  });

  return weekdays.map((name, index) => ({
    weekday: index,
    name,
    ...(byWeekday.get(index) || { total: 0, count: 0 }),
  }));
}

// Budget management
export async function setBudget(year: number, month: number, limit: number) {
  return prisma.monthlyBudget.upsert({
    where: {
      month_year: { month, year },
    },
    update: { limit },
    create: { month, year, limit },
  });
}

export async function getBudget(year: number, month: number) {
  return prisma.monthlyBudget.findUnique({
    where: {
      month_year: { month, year },
    },
  });
}
