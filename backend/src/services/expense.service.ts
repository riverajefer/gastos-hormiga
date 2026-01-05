import { PrismaClient } from '@prisma/client';
import { inferCategory } from './category-inference.service.js';

const prisma = new PrismaClient();

export interface CreateExpenseDto {
  concept: string;
  amount: number;
  category?: string;
  date?: Date;
  isRecurring?: boolean;
}

export interface UpdateExpenseDto {
  concept?: string;
  amount?: number;
  category?: string;
  date?: Date;
  isRecurring?: boolean;
}

export interface ExpenseFilters {
  month?: number;
  year?: number;
  from?: Date;
  to?: Date;
  category?: string;
  search?: string;
}

export async function createExpense(data: CreateExpenseDto) {
  const category = data.category || inferCategory(data.concept);
  const expenseDate = data.date ? new Date(data.date) : new Date();
  
  // Set time to noon to avoid timezone issues
  expenseDate.setHours(12, 0, 0, 0);
  
  return prisma.expense.create({
    data: {
      concept: data.concept.trim(),
      amount: data.amount,
      category,
      date: expenseDate,
      isRecurring: data.isRecurring ?? false,
    },
  });
}

export async function getExpenses(filters: ExpenseFilters) {
  const where: any = {};
  
  if (filters.month && filters.year) {
    const startDate = new Date(filters.year, filters.month - 1, 1);
    const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);
    where.date = {
      gte: startDate,
      lte: endDate,
    };
  } else if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) {
      where.date.gte = new Date(filters.from);
    }
    if (filters.to) {
      where.date.lte = new Date(filters.to);
    }
  }
  
  if (filters.category) {
    where.category = filters.category;
  }
  
  if (filters.search) {
    where.concept = {
      contains: filters.search,
    };
  }
  
  return prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

export async function getExpenseById(id: string) {
  return prisma.expense.findUnique({
    where: { id },
  });
}

export async function updateExpense(id: string, data: UpdateExpenseDto) {
  const updateData: any = { ...data };
  
  if (data.concept && !data.category) {
    updateData.category = inferCategory(data.concept);
  }
  
  if (data.date) {
    const expenseDate = new Date(data.date);
    expenseDate.setHours(12, 0, 0, 0);
    updateData.date = expenseDate;
  }
  
  return prisma.expense.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteExpense(id: string) {
  return prisma.expense.delete({
    where: { id },
  });
}

export async function getConceptSuggestions(query: string) {
  const expenses = await prisma.expense.findMany({
    where: {
      concept: {
        contains: query,
      },
    },
    select: {
      concept: true,
    },
    distinct: ['concept'],
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return expenses.map(e => e.concept);
}
