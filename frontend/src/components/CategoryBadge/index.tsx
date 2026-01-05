import { Chip, ChipProps } from '@mui/material';
import { categoryColors } from '../../theme/theme';

interface CategoryBadgeProps extends Omit<ChipProps, 'label'> {
  category: string;
  showLabel?: boolean;
}

const categoryInfo: Record<string, { label: string; emoji: string }> = {
  comida: { label: 'Comida', emoji: '🍔' },
  bebidas: { label: 'Bebidas', emoji: '☕' },
  transporte: { label: 'Transporte', emoji: '🚌' },
  antojos: { label: 'Antojos', emoji: '🍫' },
  entretenimiento: { label: 'Entretenimiento', emoji: '🎮' },
  otros: { label: 'Otros', emoji: '📦' },
};

export function CategoryBadge({ category, showLabel = true, ...props }: CategoryBadgeProps) {
  const info = categoryInfo[category] || categoryInfo.otros;
  const color = categoryColors[category] || categoryColors.otros;
  
  return (
    <Chip
      label={showLabel ? `${info.emoji} ${info.label}` : info.emoji}
      size="small"
      sx={{
        backgroundColor: `${color}20`,
        color: color,
        fontWeight: 500,
        fontSize: showLabel ? '0.75rem' : '1rem',
        '& .MuiChip-label': {
          px: showLabel ? 1.5 : 1,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
}

export function getCategoryEmoji(category: string): string {
  return categoryInfo[category]?.emoji || '📦';
}

export function getCategoryLabel(category: string): string {
  return categoryInfo[category]?.label || 'Otros';
}
