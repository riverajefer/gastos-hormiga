import { Request, Response, NextFunction } from 'express';
import * as expenseService from '../services/expense.service.js';

export async function getExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const { month, year, from, to, category, search } = req.query;
    
    const filters: expenseService.ExpenseFilters = {};
    
    if (month) filters.month = parseInt(month as string);
    if (year) filters.year = parseInt(year as string);
    if (from) filters.from = new Date(from as string);
    if (to) filters.to = new Date(to as string);
    if (category) filters.category = category as string;
    if (search) filters.search = search as string;
    
    const expenses = await expenseService.getExpenses(filters);
    res.json(expenses);
  } catch (error) {
    next(error);
  }
}

export async function getExpenseById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const expense = await expenseService.getExpenseById(id);
    
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    
    res.json(expense);
  } catch (error) {
    next(error);
  }
}

export async function createExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { concept, amount, category, date, isRecurring } = req.body;
    
    if (!concept || amount === undefined) {
      res.status(400).json({ error: 'Concept and amount are required' });
      return;
    }
    
    const expense = await expenseService.createExpense({
      concept,
      amount,
      category,
      date: date ? new Date(date) : undefined,
      isRecurring,
    });
    
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
}

export async function updateExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { concept, amount, category, date, isRecurring } = req.body;
    
    const expense = await expenseService.updateExpense(id, {
      concept,
      amount,
      category,
      date: date ? new Date(date) : undefined,
      isRecurring,
    });
    
    res.json(expense);
  } catch (error) {
    next(error);
  }
}

export async function deleteExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await expenseService.deleteExpense(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getConceptSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.json([]);
      return;
    }
    
    const suggestions = await expenseService.getConceptSuggestions(q);
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
}
