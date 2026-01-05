import { Box, Typography, Skeleton, alpha } from '@mui/material';
import { formatCOP } from '../../utils/formatCurrency';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  color?: string;
  isCurrency?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  loading, 
  color = 'primary.main',
  isCurrency = true,
}: StatsCardProps) {
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
          borderRadius: 3,
          p: 2.5,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={40} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
      </Box>
    );
  }

  const displayValue = isCurrency && typeof value === 'number' ? formatCOP(value) : value;

  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
        borderRadius: 3,
        p: 2.5,
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {icon && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            opacity: 0.1,
            fontSize: '4rem',
            color: color,
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontFamily: isCurrency ? '"Space Mono", monospace' : 'inherit',
          color: color,
        }}
      >
        {displayValue}
      </Typography>
      
      {subtitle && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: 'block',
            mt: 0.5,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
