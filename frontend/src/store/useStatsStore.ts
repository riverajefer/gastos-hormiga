import { create } from 'zustand';
import { statsApi, budgetApi, type MonthlyStats, type YearlyStats, type ComparisonStats, type WeekdayStats } from '../services/api';

interface StatsState {
  monthlyStats: MonthlyStats | null;
  yearlyStats: YearlyStats | null;
  comparisonStats: ComparisonStats | null;
  weekdayStats: WeekdayStats[] | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMonthlyStats: (year: number, month: number) => Promise<void>;
  fetchYearlyStats: (year: number) => Promise<void>;
  fetchComparisonStats: (year?: number, month?: number) => Promise<void>;
  fetchWeekdayStats: (year?: number, month?: number) => Promise<void>;
  setBudget: (year: number, month: number, limit: number) => Promise<void>;
  clearError: () => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  monthlyStats: null,
  yearlyStats: null,
  comparisonStats: null,
  weekdayStats: null,
  loading: false,
  error: null,

  fetchMonthlyStats: async (year, month) => {
    set({ loading: true, error: null });
    
    try {
      const stats = await statsApi.monthly(year, month);
      set({ monthlyStats: stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading stats',
        loading: false 
      });
    }
  },

  fetchYearlyStats: async (year) => {
    set({ loading: true, error: null });
    
    try {
      const stats = await statsApi.yearly(year);
      set({ yearlyStats: stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading yearly stats',
        loading: false 
      });
    }
  },

  fetchComparisonStats: async (year?, month?) => {
    set({ loading: true, error: null });
    
    try {
      const stats = await statsApi.comparison(year, month);
      set({ comparisonStats: stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading comparison',
        loading: false 
      });
    }
  },

  fetchWeekdayStats: async (year?, month?) => {
    set({ loading: true, error: null });
    
    try {
      const stats = await statsApi.byWeekday(year, month);
      set({ weekdayStats: stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading weekday stats',
        loading: false 
      });
    }
  },

  setBudget: async (year, month, limit) => {
    set({ loading: true, error: null });
    
    try {
      await budgetApi.set(year, month, limit);
      // Refresh monthly stats to get updated budget
      const stats = await statsApi.monthly(year, month);
      set({ monthlyStats: stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error setting budget',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
