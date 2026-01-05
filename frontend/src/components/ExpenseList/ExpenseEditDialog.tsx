import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ExpenseForm } from '../ExpenseForm';
import { formatDateInput } from '../../utils/dateUtils';
import type { Expense } from '../../services/api';

interface ExpenseEditDialogProps {
  open: boolean;
  expense: Expense;
  onClose: () => void;
  onSubmit: (data: { concept: string; amount: number; category?: string; date?: string; isRecurring?: boolean }) => Promise<void>;
}

export function ExpenseEditDialog({ open, expense, onClose, onSubmit }: ExpenseEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(expense.isRecurring);

  const handleSubmit = async (data: { concept: string; amount: number; category?: string; date?: string }) => {
    setLoading(true);
    try {
      await onSubmit({ ...data, isRecurring });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Editar gasto
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <ExpenseForm
            onSubmit={handleSubmit}
            loading={loading}
            initialValues={{
              concept: expense.concept,
              amount: expense.amount,
              category: expense.category,
              date: formatDateInput(expense.date),
            }}
            submitLabel="Actualizar"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                color="primary"
              />
            }
            label="Marcar como gasto recurrente"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
