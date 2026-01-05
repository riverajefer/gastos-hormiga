import { Box, Typography, Card, Divider, alpha, Chip } from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { formatCOP } from '../../utils/formatCurrency';
import type { YearlyStats } from '../../services/api';

interface ShameModeProps {
  stats: YearlyStats;
  loading?: boolean;
}

export function ShameMode({ stats, loading }: ShameModeProps) {
  if (loading || !stats.projections.length) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          😅 Momento de reflexión
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ¿Qué podrías hacer con lo que gastas en hormiguitas?
        </Typography>
      </Box>

      {stats.projections.slice(0, 5).map((projection, index) => (
        <Card
          key={projection.concept}
          sx={{
            p: 3,
            position: 'relative',
            overflow: 'hidden',
            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontSize: '2rem',
            }}
          >
            {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '💸'}
          </Box>

          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              textTransform: 'capitalize',
              mb: 2,
            }}
          >
            {projection.concept}
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Promedio mensual
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 600,
                  color: 'warning.main',
                }}
              >
                {formatCOP(projection.monthlyAverage)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Proyección anual
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  color: 'error.main',
                }}
              >
                {formatCOP(projection.yearlyProjection)}
              </Typography>
            </Box>
          </Box>

          {projection.equivalentItems.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 14 }} />
                  Con ese dinero podrías comprar:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {projection.equivalentItems.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Card>
      ))}

      <Card
        sx={{
          p: 3,
          textAlign: 'center',
          background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          💡
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Total proyectado este año
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
          }}
        >
          {formatCOP(stats.projections.reduce((sum, p) => sum + p.yearlyProjection, 0))}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Pequeños cambios pueden hacer una gran diferencia. 
          <br />
          ¡Tú decides qué hacer con tu dinero! 🐜
        </Typography>
      </Card>
    </Box>
  );
}
