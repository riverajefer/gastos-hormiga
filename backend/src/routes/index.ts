import { Router, Request, Response } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import * as quickExpenseController from '../controllers/quick-expense.controller.js';
import * as statsController from '../controllers/stats.controller.js';
import * as settingsController from '../controllers/settings.controller.js';
import { getAllCategories } from '../services/category-inference.service.js';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Expenses
router.get('/expenses', expenseController.getExpenses);
router.get('/expenses/:id', expenseController.getExpenseById);
router.post('/expenses', expenseController.createExpense);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

// Concept suggestions (autocomplete)
router.get('/concepts/suggestions', expenseController.getConceptSuggestions);

// Quick Expenses
router.get('/quick-expenses', quickExpenseController.getQuickExpenses);
router.post('/quick-expenses', quickExpenseController.createQuickExpense);
router.put('/quick-expenses/reorder', quickExpenseController.reorderQuickExpenses);
router.put('/quick-expenses/:id', quickExpenseController.updateQuickExpense);
router.delete('/quick-expenses/:id', quickExpenseController.deleteQuickExpense);
router.post('/quick-expenses/:id/use', quickExpenseController.useQuickExpense);

// Stats
router.get('/stats/monthly/:year/:month', statsController.getMonthlyStats);
router.get('/stats/yearly/:year', statsController.getYearlyStats);
router.get('/stats/comparison', statsController.getComparisonStats);
router.get('/stats/by-category', statsController.getStatsByCategory);
router.get('/stats/by-weekday', statsController.getStatsByWeekday);

// Budget
router.get('/budget/:year/:month', statsController.getBudget);
router.post('/budget', statsController.setBudget);

// Settings
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);

// Categories
router.get('/categories', (req: Request, res: Response) => {
  res.json(getAllCategories());
});

export default router;
