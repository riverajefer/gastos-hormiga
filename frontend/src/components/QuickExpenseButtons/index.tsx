import { Box, Button, Skeleton, Typography, alpha, Chip } from '@mui/material';
import { Bolt as BoltIcon } from '@mui/icons-material';
import { formatCOP } from '../../utils/formatCurrency';
import { categoryColors } from '../../theme/theme';
import type { QuickExpense } from '../../services/api';

interface QuickExpenseButtonsProps {
  quickExpenses: QuickExpense[];
  loading?: boolean;
  onUse: (id: string) => Promise<void>;
}

export function QuickExpenseButtons({ quickExpenses, loading, onUse }: QuickExpenseButtonsProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton 
            key={i} 
            variant="rounded" 
            width={120} 
            height={44} 
            sx={{ borderRadius: 3 }}
          />
        ))}
      </Box>
    );
  }

  if (quickExpenses.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BoltIcon sx={{ color: 'warning.main', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Gastos Rápidos
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1.5, 
          flexWrap: 'wrap',
        }}
      >
        {quickExpenses.map((qe) => {
          const color = categoryColors[qe.category] || categoryColors.otros;
          
          return (
            <Button
              key={qe.id}
              variant="outlined"
              onClick={() => onUse(qe.id)}
              sx={{
                borderRadius: 3,
                borderColor: alpha(color, 0.3),
                borderWidth: 2,
                color: 'text.primary',
                py: 1,
                px: 2,
                textTransform: 'none',
                fontWeight: 500,
                background: alpha(color, 0.05),
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: color,
                  borderWidth: 2,
                  background: alpha(color, 0.1),
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{qe.concept}</span>
                <Chip
                  label={formatCOP(qe.amount)}
                  size="small"
                  sx={{
                    height: 22,
                    bgcolor: alpha(color, 0.2),
                    color: color,
                    fontWeight: 600,
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '0.7rem',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Box>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
