import { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Card, alpha, Snackbar, Alert, Button } from '@mui/material';
import { Search as SearchIcon, FilterAltOff as ClearFilterIcon } from '@mui/icons-material';
import { MonthSelector } from '../../components/MonthSelector';
import { ExpenseList } from '../../components/ExpenseList';
import { StatsCard } from '../../components/StatsCard';
import { useExpenseStore } from '../../store/useExpenseStore';
import { useStatsStore } from '../../store/useStatsStore';
import { useSettingsStore } from '../../store/useSettingsStore';

export function HistoryPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const { expenses, loading, selectedMonth, selectedYear, setSelectedPeriod, fetchExpenses, updateExpense, deleteExpense, setSearchQuery } = useExpenseStore();
  const { comparisonStats, fetchComparisonStats } = useStatsStore();
  const { categories, fetchCategories } = useSettingsStore();

  useEffect(() => {
    fetchExpenses();
    fetchComparisonStats(selectedYear, selectedMonth);
    if (categories.length === 0) fetchCategories();
  }, []);

  useEffect(() => {
    fetchComparisonStats(selectedYear, selectedMonth);
  }, [selectedMonth, selectedYear]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchQuery(e.target.value);
  };

  const filteredExpenses = categoryFilter ? expenses.filter(e => e.category === categoryFilter) : expenses;
  const hasActiveFilters = search.trim() !== '' || categoryFilter !== '';
  const noResults = hasActiveFilters && filteredExpenses.length === 0;

  const clearFilters = () => {
    setSearch('');
    setSearchQuery('');
    setCategoryFilter('');
  };

  const getComparisonText = () => {
    if (!comparisonStats) return '';
    const { percentageChange } = comparisonStats;
    if (percentageChange === 0) return 'Igual que el mes anterior';
    const direction = percentageChange > 0 ? '📈' : '📉';
    const verb = percentageChange > 0 ? 'más' : 'menos';
    return `${direction} ${Math.abs(percentageChange)}% ${verb} que el mes anterior`;
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 100%)`, pt: 4, pb: 3, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>Historial 📋</Typography>
        <MonthSelector month={selectedMonth} year={selectedYear} onChange={setSelectedPeriod} />
      </Box>

      <Box sx={{ px: 2 }}>
        {comparisonStats && (
          <Card sx={{ p: 2, mb: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{getComparisonText()}</Typography>
          </Card>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField fullWidth size="small" placeholder="Buscar gastos..." value={search} onChange={handleSearchChange} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={categoryFilter} label="Categoría" onChange={(e) => setCategoryFilter(e.target.value)}>
              <MenuItem value="">Todas</MenuItem>
              {categories.map((cat) => (<MenuItem key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</MenuItem>))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <StatsCard title="Este mes" value={comparisonStats?.current.total || 0} subtitle={`${comparisonStats?.current.count || 0} gastos`} />
          <StatsCard title="Mes anterior" value={comparisonStats?.previous.total || 0} subtitle={`${comparisonStats?.previous.count || 0} gastos`} color="text.secondary" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {hasActiveFilters ? `${filteredExpenses.length} resultado${filteredExpenses.length !== 1 ? 's' : ''}` : 'Todos los gastos'}
          </Typography>
          {hasActiveFilters && (
            <Button size="small" startIcon={<ClearFilterIcon />} onClick={clearFilters} color="inherit">
              Limpiar
            </Button>
          )}
        </Box>

        {noResults ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>Sin resultados</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              No encontramos gastos {search && `con "${search}"`} {categoryFilter && `en esta categoría`}
            </Typography>
            <Button variant="outlined" size="small" onClick={clearFilters}>Limpiar filtros</Button>
          </Box>
        ) : (
          <ExpenseList
            expenses={filteredExpenses}
            loading={loading}
            onDelete={async (id) => {
              await deleteExpense(id);
              setSnackbar({ open: true, message: 'Gasto eliminado correctamente', severity: 'success' });
            }}
            onUpdate={async (id, data) => {
              await updateExpense(id, data);
              setSnackbar({ open: true, message: 'Gasto actualizado correctamente', severity: 'success' });
            }}
          />
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
