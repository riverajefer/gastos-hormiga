import { create } from 'zustand';
import { quickExpensesApi, type QuickExpense, type Expense } from '../services/api';

interface QuickExpenseState {
  quickExpenses: QuickExpense[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchQuickExpenses: () => Promise<void>;
  addQuickExpense: (data: { concept: string; amount: number; category?: string }) => Promise<void>;
  updateQuickExpense: (id: string, data: Partial<QuickExpense>) => Promise<void>;
  deleteQuickExpense: (id: string) => Promise<void>;
  reorderQuickExpenses: (orderedIds: string[]) => Promise<void>;
  useQuickExpense: (id: string) => Promise<Expense>;
  clearError: () => void;
}

export const useQuickExpenseStore = create<QuickExpenseState>((set, get) => ({
  quickExpenses: [],
  loading: false,
  error: null,

  fetchQuickExpenses: async () => {
    set({ loading: true, error: null });
    
    try {
      const quickExpenses = await quickExpensesApi.list();
      set({ quickExpenses, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading quick expenses',
        loading: false 
      });
    }
  },

  addQuickExpense: async (data) => {
    set({ loading: true, error: null });
    
    try {
      const quickExpense = await quickExpensesApi.create(data);
      const { quickExpenses } = get();
      
      set({ 
        quickExpenses: [...quickExpenses, quickExpense],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error creating quick expense',
        loading: false 
      });
      throw error;
    }
  },

  updateQuickExpense: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      const updated = await quickExpensesApi.update(id, data);
      const { quickExpenses } = get();
      
      set({
        quickExpenses: quickExpenses.map(qe => qe.id === id ? updated : qe),
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating quick expense',
        loading: false 
      });
      throw error;
    }
  },

  deleteQuickExpense: async (id) => {
    set({ loading: true, error: null });
    
    try {
      await quickExpensesApi.delete(id);
      const { quickExpenses } = get();
      
      set({
        quickExpenses: quickExpenses.filter(qe => qe.id !== id),
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error deleting quick expense',
        loading: false 
      });
      throw error;
    }
  },

  reorderQuickExpenses: async (orderedIds) => {
    const { quickExpenses: prevQuickExpenses } = get();
    
    // Optimistic update
    const reordered = orderedIds
      .map(id => prevQuickExpenses.find(qe => qe.id === id))
      .filter((qe): qe is QuickExpense => qe !== undefined);
    
    set({ quickExpenses: reordered });
    
    try {
      await quickExpensesApi.reorder(orderedIds);
    } catch (error) {
      // Rollback on error
      set({ quickExpenses: prevQuickExpenses });
      throw error;
    }
  },

  useQuickExpense: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const expense = await quickExpensesApi.use(id);
      
      // Update usage count locally
      const { quickExpenses } = get();
      set({
        quickExpenses: quickExpenses.map(qe => 
          qe.id === id ? { ...qe, usageCount: qe.usageCount + 1 } : qe
        ),
        loading: false,
      });
      
      return expense;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error using quick expense',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
