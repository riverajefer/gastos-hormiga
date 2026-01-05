import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Autocomplete,
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { formatInputCurrency, parseCurrency } from '../../utils/formatCurrency';
import { formatDateInput, isFutureDate } from '../../utils/dateUtils';
import { expensesApi } from '../../services/api';
import { useSettingsStore } from '../../store/useSettingsStore';

interface ExpenseFormProps {
  onSubmit: (data: { concept: string; amount: number; category?: string; date?: string }) => Promise<void>;
  loading?: boolean;
  initialValues?: {
    concept?: string;
    amount?: number;
    category?: string;
    date?: string;
  };
  submitLabel?: string;
}

export function ExpenseForm({ 
  onSubmit, 
  loading = false, 
  initialValues,
  submitLabel = 'Guardar',
}: ExpenseFormProps) {
  const [concept, setConcept] = useState(initialValues?.concept || '');
  const [amount, setAmount] = useState(initialValues?.amount ? formatInputCurrency(initialValues.amount.toString()) : '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [date, setDate] = useState(initialValues?.date || formatDateInput(new Date()));
  const [showAdvanced, setShowAdvanced] = useState(!!initialValues?.date || !!initialValues?.category);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dateError, setDateError] = useState('');
  
  const { categories, fetchCategories } = useSettingsStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // Fetch concept suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const results = await expensesApi.getSuggestions(query);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCurrency(e.target.value);
    setAmount(formatted);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    
    if (isFutureDate(new Date(newDate))) {
      setDateError('No puedes registrar gastos futuros');
    } else {
      setDateError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concept.trim() || !amount) return;
    if (dateError) return;
    
    const numericAmount = parseCurrency(amount);
    if (numericAmount <= 0) return;
    
    try {
      await onSubmit({
        concept: concept.trim(),
        amount: numericAmount,
        category: category || undefined,
        date: date !== formatDateInput(new Date()) ? date : undefined,
      });
      
      // Reset form
      setConcept('');
      setAmount('');
      setCategory('');
      setDate(formatDateInput(new Date()));
      setShowAdvanced(false);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Autocomplete
        freeSolo
        options={suggestions}
        inputValue={concept}
        onInputChange={(_, value) => {
          setConcept(value);
          fetchSuggestions(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="¿En qué gastaste?"
            placeholder="Café, bus, snack..."
            fullWidth
            autoComplete="off"
          />
        )}
      />
      
      <TextField
        label="Valor"
        value={amount}
        onChange={handleAmountChange}
        placeholder="0"
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9.]*',
        }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ 
            transform: showAdvanced ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        <Box 
          component="span" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ 
            fontSize: '0.875rem', 
            color: 'text.secondary',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {showAdvanced ? 'Menos opciones' : 'Más opciones'}
        </Box>
      </Box>
      
      <Collapse in={showAdvanced}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            type="date"
            label="Fecha"
            value={date}
            onChange={handleDateChange}
            error={!!dateError}
            helperText={dateError}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Categoría (opcional)</InputLabel>
            <Select
              value={category}
              label="Categoría (opcional)"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>Automática</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
      
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading || !concept.trim() || !amount || !!dateError}
        startIcon={<AddIcon />}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': {
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          },
          '&:disabled': {
            background: (theme) => alpha(theme.palette.primary.main, 0.3),
          },
        }}
      >
        {loading ? 'Guardando...' : submitLabel}
      </Button>
    </Box>
  );
}
