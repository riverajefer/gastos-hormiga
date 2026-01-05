import { createTheme, alpha } from '@mui/material/styles';

// Color palette - Dark theme with vibrant accents
const colors = {
  // Base colors
  background: {
    default: '#0d0d14',
    paper: '#16161f',
    card: '#1c1c28',
    elevated: '#22222e',
  },
  // Primary - Vibrant teal/cyan
  primary: {
    main: '#00d9c0',
    light: '#5fffeb',
    dark: '#00a890',
    contrastText: '#0d0d14',
  },
  // Secondary - Warm coral
  secondary: {
    main: '#ff6b6b',
    light: '#ff9e9e',
    dark: '#c73b3b',
    contrastText: '#ffffff',
  },
  // Accent colors
  accent: {
    purple: '#b388ff',
    yellow: '#ffd93d',
    green: '#4ade80',
    blue: '#60a5fa',
    pink: '#f472b6',
  },
  // Semantic colors
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
  // Text
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.4)',
  },
};

// Category colors
export const categoryColors: Record<string, string> = {
  comida: '#ff6b6b',
  bebidas: '#00d9c0',
  transporte: '#60a5fa',
  antojos: '#fbbf24',
  entretenimiento: '#b388ff',
  otros: '#94a3b8',
};

// Budget status colors
export const budgetColors = {
  safe: '#4ade80',      // 0-60%
  warning: '#fbbf24',   // 60-80%
  danger: '#f87171',    // >80%
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: colors.text,
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.background.elevated,
            borderRadius: '3px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.background.card,
          borderRadius: 20,
          border: `1px solid ${alpha(colors.text.primary, 0.05)}`,
          boxShadow: `0 4px 24px ${alpha('#000', 0.2)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: alpha(colors.background.elevated, 0.5),
            '& fieldset': {
              borderColor: alpha(colors.text.primary, 0.1),
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: alpha(colors.primary.main, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: alpha(colors.primary.main, 0.15),
          color: colors.primary.light,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: `0 8px 32px ${alpha(colors.primary.main, 0.4)}`,
        },
        primary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          borderTop: `1px solid ${alpha(colors.text.primary, 0.05)}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: colors.text.secondary,
          '&.Mui-selected': {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          backgroundColor: colors.background.card,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: colors.primary.main,
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: colors.primary.main,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 10,
          backgroundColor: alpha(colors.text.primary, 0.1),
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.text.primary, 0.08),
        },
      },
    },
  },
});

// Light theme variant
export const lightTheme = createTheme({
  ...darkTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#00a890',
      light: '#00d9c0',
      dark: '#007a66',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e55050',
      light: '#ff6b6b',
      dark: '#b33a3a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: 'rgba(26, 26, 46, 0.7)',
    },
  },
  components: {
    ...darkTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});
