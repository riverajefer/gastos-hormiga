import { PrismaClient } from '@prisma/client';
import { inferCategory } from './category-inference.service.js';

const prisma = new PrismaClient();

export interface CreateQuickExpenseDto {
  concept: string;
  amount: number;
  category?: string;
}

export interface UpdateQuickExpenseDto {
  concept?: string;
  amount?: number;
  category?: string;
  order?: number;
}

export async function getQuickExpenses() {
  return prisma.quickExpense.findMany({
    orderBy: [
      { order: 'asc' },
      { usageCount: 'desc' },
    ],
  });
}

export async function createQuickExpense(data: CreateQuickExpenseDto) {
  const category = data.category || inferCategory(data.concept);
  
  // Get max order
  const maxOrder = await prisma.quickExpense.aggregate({
    _max: { order: true },
  });
  
  return prisma.quickExpense.create({
    data: {
      concept: data.concept.trim(),
      amount: data.amount,
      category,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
}

export async function updateQuickExpense(id: string, data: UpdateQuickExpenseDto) {
  const updateData: any = { ...data };
  
  if (data.concept && !data.category) {
    updateData.category = inferCategory(data.concept);
  }
  
  return prisma.quickExpense.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteQuickExpense(id: string) {
  return prisma.quickExpense.delete({
    where: { id },
  });
}

export async function incrementUsageCount(id: string) {
  return prisma.quickExpense.update({
    where: { id },
    data: {
      usageCount: { increment: 1 },
    },
  });
}

export async function reorderQuickExpenses(orderedIds: string[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.quickExpense.update({
      where: { id },
      data: { order: index },
    })
  );
  
  await prisma.$transaction(updates);
  return getQuickExpenses();
}

export async function useQuickExpense(id: string) {
  // Get the quick expense
  const quickExpense = await prisma.quickExpense.findUnique({
    where: { id },
  });
  
  if (!quickExpense) {
    throw new Error('Quick expense not found');
  }
  
  // Create a new expense from it
  const expenseDate = new Date();
  expenseDate.setHours(12, 0, 0, 0);
  
  const expense = await prisma.expense.create({
    data: {
      concept: quickExpense.concept,
      amount: quickExpense.amount,
      category: quickExpense.category,
      date: expenseDate,
    },
  });
  
  // Increment usage count
  await incrementUsageCount(id);
  
  return expense;
}
