const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Types
export interface Expense {
  id: string;
  concept: string;
  amount: number;
  category: string;
  date: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuickExpense {
  id: string;
  concept: string;
  amount: number;
  category: string;
  order: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

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
  budget: { limit: number; percentage: number } | null;
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

export interface WeekdayStats {
  weekday: number;
  name: string;
  total: number;
  count: number;
}

export interface UserSettings {
  id: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  darkMode: boolean;
  currency: string;
}

// Generic fetch function
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Expenses API
export const expensesApi = {
  list: (params?: {
    month?: number;
    year?: number;
    from?: string;
    to?: string;
    category?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append('month', params.month.toString());
    if (params?.year) searchParams.append('year', params.year.toString());
    if (params?.from) searchParams.append('from', params.from);
    if (params?.to) searchParams.append('to', params.to);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return fetchApi<Expense[]>(`/expenses${query ? `?${query}` : ''}`);
  },

  get: (id: string) => fetchApi<Expense>(`/expenses/${id}`),

  create: (data: { concept: string; amount: number; category?: string; date?: string; isRecurring?: boolean }) =>
    fetchApi<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{ concept: string; amount: number; category: string; date: string; isRecurring: boolean }>) =>
    fetchApi<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/expenses/${id}`, { method: 'DELETE' }),

  getSuggestions: (query: string) =>
    fetchApi<string[]>(`/concepts/suggestions?q=${encodeURIComponent(query)}`),
};

// Quick Expenses API
export const quickExpensesApi = {
  list: () => fetchApi<QuickExpense[]>('/quick-expenses'),

  create: (data: { concept: string; amount: number; category?: string }) =>
    fetchApi<QuickExpense>('/quick-expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{ concept: string; amount: number; category: string; order: number }>) =>
    fetchApi<QuickExpense>(`/quick-expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/quick-expenses/${id}`, { method: 'DELETE' }),

  reorder: (orderedIds: string[]) =>
    fetchApi<QuickExpense[]>('/quick-expenses/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
    }),

  use: (id: string) =>
    fetchApi<Expense>(`/quick-expenses/${id}/use`, { method: 'POST' }),
};

// Stats API
export const statsApi = {
  monthly: (year: number, month: number) =>
    fetchApi<MonthlyStats>(`/stats/monthly/${year}/${month}`),

  yearly: (year: number) =>
    fetchApi<YearlyStats>(`/stats/yearly/${year}`),

  comparison: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return fetchApi<ComparisonStats>(`/stats/comparison?${params}`);
  },

  byCategory: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return fetchApi<{ category: string; total: number; count: number }[]>(`/stats/by-category?${params}`);
  },

  byWeekday: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return fetchApi<WeekdayStats[]>(`/stats/by-weekday?${params}`);
  },
};

// Budget API
export const budgetApi = {
  get: (year: number, month: number) =>
    fetchApi<{ id: string; month: number; year: number; limit: number } | null>(`/budget/${year}/${month}`),

  set: (year: number, month: number, limit: number) =>
    fetchApi<{ id: string; month: number; year: number; limit: number }>('/budget', {
      method: 'POST',
      body: JSON.stringify({ year, month, limit }),
    }),
};

// Settings API
export const settingsApi = {
  get: () => fetchApi<UserSettings>('/settings'),

  update: (data: Partial<{ reminderEnabled: boolean; reminderTime: string | null; darkMode: boolean; currency: string }>) =>
    fetchApi<UserSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Categories API
export const categoriesApi = {
  list: () => fetchApi<Category[]>('/categories'),
};
