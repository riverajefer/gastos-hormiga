import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
  alpha,
} from '@mui/material';
import {
  Home as HomeIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { FloatingActionButton } from '../FloatingActionButton';
import { ExpenseForm } from '../ExpenseForm';
import { useExpenseStore } from '../../store/useExpenseStore';
import { useQuickExpenseStore } from '../../store/useQuickExpenseStore';
import { useStatsStore } from '../../store/useStatsStore';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { addExpense, fetchExpenses, selectedMonth, selectedYear } = useExpenseStore();
  const { } = useQuickExpenseStore();
  const { fetchMonthlyStats } = useStatsStore();

  const navValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/history') return 1;
    if (location.pathname.startsWith('/stats')) return 2;
    if (location.pathname === '/settings') return 3;
    return 0;
  };

  const handleNavChange = (_: React.SyntheticEvent, newValue: number) => {
    const routes = ['/', '/history', '/stats', '/settings'];
    navigate(routes[newValue]);
  };

  const handleAddExpense = async (data: { concept: string; amount: number; category?: string; date?: string }) => {
    try {
      await addExpense(data);
      setFormOpen(false);
      setSnackbar({
        open: true,
        message: '✅ Gasto registrado',
        severity: 'success',
      });
      // Refresh data
      fetchExpenses();
      fetchMonthlyStats(selectedYear, selectedMonth);
    } catch {
      setSnackbar({
        open: true,
        message: '❌ Error al guardar',
        severity: 'error',
      });
    }
  };

  // Don't show FAB on home page (form is already visible)
  const showFab = location.pathname !== '/';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          pb: 10, // Space for bottom nav
        }}
      >
        <Outlet />
      </Box>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => setFormOpen(true)} 
        visible={showFab}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        value={navValue()}
        onChange={handleNavChange}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(10px)',
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
        <BottomNavigationAction label="Historial" icon={<HistoryIcon />} />
        <BottomNavigationAction label="Stats" icon={<BarChartIcon />} />
        <BottomNavigationAction label="Ajustes" icon={<SettingsIcon />} />
      </BottomNavigation>

      {/* Add Expense Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Nuevo gasto 🐜
          <IconButton onClick={() => setFormOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ExpenseForm onSubmit={handleAddExpense} />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            borderRadius: 3,
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
