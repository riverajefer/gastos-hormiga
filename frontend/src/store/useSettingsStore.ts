import { create } from 'zustand';
import { settingsApi, categoriesApi, type UserSettings, type Category } from '../services/api';

interface SettingsState {
  settings: UserSettings | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<UserSettings>) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  categories: [],
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    
    try {
      const settings = await settingsApi.get();
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading settings',
        loading: false 
      });
    }
  },

  updateSettings: async (data) => {
    const { settings: prevSettings } = get();
    
    // Optimistic update
    if (prevSettings) {
      set({ settings: { ...prevSettings, ...data } });
    }
    
    try {
      const settings = await settingsApi.update(data);
      set({ settings });
    } catch (error) {
      // Rollback on error
      set({ settings: prevSettings });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await categoriesApi.list();
      set({ categories });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
