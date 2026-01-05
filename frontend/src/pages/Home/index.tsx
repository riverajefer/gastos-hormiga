import { useEffect, useState } from 'react';
import { Box, Typography, Card, Snackbar, Alert, alpha, Divider } from '@mui/material';
import { ExpenseForm } from '../../components/ExpenseForm';
import { QuickExpenseButtons } from '../../components/QuickExpenseButtons';
import { ExpenseList } from '../../components/ExpenseList';
import { BudgetProgress } from '../../components/BudgetProgress';
import { StatsCard } from '../../components/StatsCard';
import { MonthSelector } from '../../components/MonthSelector';
import { useExpenseStore } from '../../store/useExpenseStore';
import { useQuickExpenseStore } from '../../store/useQuickExpenseStore';
import { useStatsStore } from '../../store/useStatsStore';

export function HomePage() {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    expenses,
    loading: expensesLoading,
    selectedMonth,
    selectedYear,
    setSelectedPeriod,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenseStore();

  const {
    quickExpenses,
    loading: quickLoading,
    fetchQuickExpenses,
    useQuickExpense,
  } = useQuickExpenseStore();

  const {
    monthlyStats,
    loading: statsLoading,
    fetchMonthlyStats,
    setBudget,
  } = useStatsStore();

  useEffect(() => {
    fetchExpenses();
    fetchQuickExpenses();
    fetchMonthlyStats(selectedYear, selectedMonth);
  }, []);

  useEffect(() => {
    fetchMonthlyStats(selectedYear, selectedMonth);
  }, [selectedMonth, selectedYear, fetchMonthlyStats]);

  const handleAddExpense = async (data: { concept: string; amount: number; category?: string; date?: string }) => {
    try {
      await addExpense(data);
      setSnackbar({ open: true, message: '✅ ¡Gasto registrado!', severity: 'success' });
      fetchMonthlyStats(selectedYear, selectedMonth);
    } catch {
      setSnackbar({ open: true, message: '❌ Error al guardar', severity: 'error' });
      throw new Error('Failed');
    }
  };

  const handleUseQuickExpense = async (id: string) => {
    try {
      await useQuickExpense(id);
      setSnackbar({ open: true, message: '⚡ ¡Gasto rápido registrado!', severity: 'success' });
      fetchExpenses();
      fetchMonthlyStats(selectedYear, selectedMonth);
    } catch {
      setSnackbar({ open: true, message: '❌ Error al registrar', severity: 'error' });
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`, pt: 4, pb: 3, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Gastos Hormiga 🐜</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Controla esos pequeños gastos que suman</Typography>
        </Box>
        <MonthSelector month={selectedMonth} year={selectedYear} onChange={setSelectedPeriod} />
      </Box>

      <Box sx={{ px: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <StatsCard title="Total del mes" value={monthlyStats?.totalSpent || 0} loading={statsLoading} />
          <StatsCard title="Promedio diario" value={monthlyStats?.dailyAverage || 0} subtitle={`${monthlyStats?.expenseCount || 0} gastos`} loading={statsLoading} color="secondary.main" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <BudgetProgress spent={monthlyStats?.totalSpent || 0} limit={monthlyStats?.budget?.limit || null} onSetLimit={(limit) => setBudget(selectedYear, selectedMonth, limit)} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <QuickExpenseButtons quickExpenses={quickExpenses} loading={quickLoading} onUse={handleUseQuickExpense} />
        </Box>

        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Nuevo gasto</Typography>
          <ExpenseForm onSubmit={handleAddExpense} />
        </Card>

        {monthlyStats && monthlyStats.topConcepts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1.5 }}>🔥 Más frecuentes este mes</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {monthlyStats.topConcepts.map((tc) => (
                <Box key={tc.concept} sx={{ px: 2, py: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{tc.concept}</Typography>
                  <Typography variant="caption" sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2), px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>x{tc.count}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Gastos del mes</Typography>
        <ExpenseList expenses={expenses} loading={expensesLoading} onDelete={async (id) => { await deleteExpense(id); fetchMonthlyStats(selectedYear, selectedMonth); }} onUpdate={async (id, data) => { await updateExpense(id, data); fetchMonthlyStats(selectedYear, selectedMonth); }} />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 3, fontWeight: 500 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
