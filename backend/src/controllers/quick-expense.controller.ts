import { Request, Response, NextFunction } from 'express';
import * as quickExpenseService from '../services/quick-expense.service.js';

export async function getQuickExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const quickExpenses = await quickExpenseService.getQuickExpenses();
    res.json(quickExpenses);
  } catch (error) {
    next(error);
  }
}

export async function createQuickExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { concept, amount, category } = req.body;
    
    if (!concept || amount === undefined) {
      res.status(400).json({ error: 'Concept and amount are required' });
      return;
    }
    
    const quickExpense = await quickExpenseService.createQuickExpense({
      concept,
      amount,
      category,
    });
    
    res.status(201).json(quickExpense);
  } catch (error) {
    next(error);
  }
}

export async function updateQuickExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { concept, amount, category, order } = req.body;

    const quickExpense = await quickExpenseService.updateQuickExpense(id as string, {
      concept,
      amount,
      category,
      order,
    });
    
    res.json(quickExpense);
  } catch (error) {
    next(error);
  }
}

export async function deleteQuickExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await quickExpenseService.deleteQuickExpense(id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function reorderQuickExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: 'orderedIds must be an array' });
      return;
    }
    
    const quickExpenses = await quickExpenseService.reorderQuickExpenses(orderedIds);
    res.json(quickExpenses);
  } catch (error) {
    next(error);
  }
}

export async function useQuickExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const expense = await quickExpenseService.useQuickExpense(id as string);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
}
