import { create } from 'zustand';
import { expensesApi, type Expense } from '../services/api';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
  searchQuery: string;
  
  // Actions
  setSelectedPeriod: (month: number, year: number) => void;
  setSearchQuery: (query: string) => void;
  fetchExpenses: () => Promise<void>;
  addExpense: (data: { concept: string; amount: number; category?: string; date?: string }) => Promise<Expense>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearError: () => void;
}

const now = new Date();

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  loading: false,
  error: null,
  selectedMonth: now.getMonth() + 1,
  selectedYear: now.getFullYear(),
  searchQuery: '',

  setSelectedPeriod: (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
    get().fetchExpenses();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchExpenses();
  },

  fetchExpenses: async () => {
    const { selectedMonth, selectedYear, searchQuery } = get();
    set({ loading: true, error: null });
    
    try {
      const expenses = await expensesApi.list({
        month: selectedMonth,
        year: selectedYear,
        search: searchQuery || undefined,
      });
      set({ expenses, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading expenses',
        loading: false 
      });
    }
  },

  addExpense: async (data) => {
    set({ loading: true, error: null });
    
    try {
      const expense = await expensesApi.create(data);
      const { expenses, selectedMonth, selectedYear } = get();
      
      // Only add to list if it's in the current view
      const expenseDate = new Date(expense.date);
      if (
        expenseDate.getMonth() + 1 === selectedMonth &&
        expenseDate.getFullYear() === selectedYear
      ) {
        set({ 
          expenses: [expense, ...expenses].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
          loading: false 
        });
      } else {
        set({ loading: false });
      }
      
      return expense;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error creating expense',
        loading: false 
      });
      throw error;
    }
  },

  updateExpense: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      const updated = await expensesApi.update(id, data);
      const { expenses } = get();
      
      set({
        expenses: expenses.map(e => e.id === id ? updated : e),
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating expense',
        loading: false 
      });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    
    try {
      await expensesApi.delete(id);
      const { expenses } = get();
      
      set({
        expenses: expenses.filter(e => e.id !== id),
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error deleting expense',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
