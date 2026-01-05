import { useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import { Settings as SettingsIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { formatCOP, formatInputCurrency, parseCurrency } from '../../utils/formatCurrency';
import { budgetColors } from '../../theme/theme';

interface BudgetProgressProps {
  spent: number;
  limit: number | null;
  onSetLimit: (limit: number) => Promise<void>;
}

export function BudgetProgress({ spent, limit, onSetLimit }: BudgetProgressProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(limit ? formatInputCurrency(limit.toString()) : '');
  const [loading, setLoading] = useState(false);

  const percentage = limit ? Math.min((spent / limit) * 100, 100) : 0;
  
  const getColor = () => {
    if (percentage >= 80) return budgetColors.danger;
    if (percentage >= 60) return budgetColors.warning;
    return budgetColors.safe;
  };

  const getStatusText = () => {
    if (!limit) return 'Sin límite establecido';
    const remaining = limit - spent;
    if (remaining <= 0) return '¡Límite superado!';
    return `Te quedan ${formatCOP(remaining)}`;
  };

  const handleSave = async () => {
    const numericLimit = parseCurrency(newLimit);
    if (numericLimit <= 0) return;
    
    setLoading(true);
    try {
      await onSetLimit(numericLimit);
      setDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
          borderRadius: 3,
          p: 2.5,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Meta mensual
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontFamily: '"Space Mono", monospace',
                color: limit ? 'text.primary' : 'text.secondary',
              }}
            >
              {limit ? formatCOP(limit) : '---'}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => {
              setNewLimit(limit ? formatInputCurrency(limit.toString()) : '');
              setDialogOpen(true);
            }}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {limit && (
          <>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: (theme) => alpha(theme.palette.divider, 0.2),
                '& .MuiLinearProgress-bar': {
                  bgcolor: getColor(),
                  borderRadius: 6,
                  transition: 'width 0.5s ease-out',
                },
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getColor(),
                  fontWeight: 600,
                }}
              >
                {getStatusText()}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontFamily: '"Space Mono", monospace',
                }}
              >
                {percentage.toFixed(0)}%
              </Typography>
            </Box>
          </>
        )}
        
        {!limit && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Establecer límite
          </Button>
        )}
      </Box>

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 320 },
        }}
      >
        <DialogTitle>Establecer límite mensual</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Define cuánto quieres gastar como máximo en gastos hormiga este mes.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Límite mensual"
            value={newLimit}
            onChange={(e) => setNewLimit(formatInputCurrency(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{
              inputMode: 'numeric',
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={loading || !newLimit}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
