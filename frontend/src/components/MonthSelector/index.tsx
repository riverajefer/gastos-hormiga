import { Box, IconButton, Typography, alpha } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { formatMonth } from '../../utils/dateUtils';

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
  disableFuture?: boolean;
}

export function MonthSelector({ month, year, onChange, disableFuture = true }: MonthSelectorProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const isCurrentMonth = month === currentMonth && year === currentYear;
  const canGoForward = !disableFuture || !isCurrentMonth;

  const handlePrevious = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNext = () => {
    if (!canGoForward) return;
    
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  const handleReset = () => {
    onChange(currentMonth, currentYear);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <IconButton 
        onClick={handlePrevious}
        size="small"
        sx={{
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      
      <Box
        onClick={handleReset}
        sx={{
          minWidth: 180,
          textAlign: 'center',
          cursor: !isCurrentMonth ? 'pointer' : 'default',
          py: 1,
          px: 2,
          borderRadius: 2,
          transition: 'background 0.2s',
          '&:hover': !isCurrentMonth ? {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          } : {},
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {formatMonth(month, year)}
        </Typography>
        {!isCurrentMonth && (
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            Toca para ir a hoy
          </Typography>
        )}
      </Box>
      
      <IconButton 
        onClick={handleNext}
        size="small"
        disabled={!canGoForward}
        sx={{
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
          },
          '&.Mui-disabled': {
            opacity: 0.3,
          },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
