import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Skeleton,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import { formatCOP } from '../../utils/formatCurrency';
import { formatDate, formatWeekday } from '../../utils/dateUtils';
import { CategoryBadge } from '../CategoryBadge';
import { ConfirmDialog } from '../ConfirmDialog';
import { ExpenseEditDialog } from './ExpenseEditDialog';
import type { Expense } from '../../services/api';

interface ExpenseListProps {
  expenses: Expense[];
  loading?: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Expense>) => Promise<void>;
}

interface GroupedExpenses {
  date: string;
  expenses: Expense[];
  total: number;
}

export function ExpenseList({ expenses, loading, onDelete, onUpdate }: ExpenseListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  // Group expenses by date
  const groupedExpenses = useMemo(() => {
    const groups: Record<string, GroupedExpenses> = {};
    
    expenses.forEach((expense) => {
      const dateStr = expense.date.split('T')[0];
      if (!groups[dateStr]) {
        groups[dateStr] = { date: dateStr, expenses: [], total: 0 };
      }
      groups[dateStr].expenses.push(expense);
      groups[dateStr].total += expense.amount;
    });
    
    return Object.values(groups).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses]);

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleEditSubmit = async (data: { concept: string; amount: number; category?: string; date?: string }) => {
    if (editExpense) {
      await onUpdate(editExpense.id, data);
      setEditExpense(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={72} />
          </Box>
        ))}
      </Box>
    );
  }

  if (expenses.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          color: 'text.secondary',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
          🐜
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Sin gastos hormiga este mes
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          ¡Usa el formulario para registrar tus gastos!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {groupedExpenses.map((group) => (
          <Box key={group.date}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
                px: 0.5,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {formatDate(group.date)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatWeekday(group.date)}
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  fontFamily: '"Space Mono", monospace',
                }}
              >
                {formatCOP(group.total)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.expenses.map((expense) => (
                <Card
                  key={expense.id}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                  onClick={() => setSwipedId(swipedId === expense.id ? null : expense.id)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {expense.concept}
                        </Typography>
                        {expense.isRecurring && (
                          <RepeatIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        )}
                      </Box>
                      <CategoryBadge category={expense.category} size="small" />
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Space Mono", monospace',
                        color: 'text.primary',
                      }}
                    >
                      {formatCOP(expense.amount)}
                    </Typography>
                  </Box>
                  
                  {/* Action buttons on tap */}
                  {swipedId === expense.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        pr: 1,
                        background: (theme) => `linear-gradient(90deg, transparent 0%, ${theme.palette.background.paper} 30%)`,
                        pl: 4,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditExpense(expense);
                          setSwipedId(null);
                        }}
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(expense.id);
                          setSwipedId(null);
                        }}
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar gasto"
        message="¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {editExpense && (
        <ExpenseEditDialog
          open={!!editExpense}
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
}
