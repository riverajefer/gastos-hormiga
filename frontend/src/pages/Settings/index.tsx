import { useEffect, useState } from 'react';
import { Box, Typography, Card, Switch, FormControlLabel, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, alpha, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Bolt as BoltIcon, Download as DownloadIcon } from '@mui/icons-material';
import { Tooltip, CircularProgress } from '@mui/material';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useQuickExpenseStore } from '../../store/useQuickExpenseStore';
import { useExpenseStore } from '../../store/useExpenseStore';
import { formatCOP, formatInputCurrency, parseCurrency } from '../../utils/formatCurrency';
import { CategoryBadge } from '../../components/CategoryBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export function SettingsPage() {
  const { settings, fetchSettings, updateSettings, categories, fetchCategories } = useSettingsStore();
  const { quickExpenses, fetchQuickExpenses, addQuickExpense, updateQuickExpense, deleteQuickExpense } = useQuickExpenseStore();
  const { expenses, selectedMonth, selectedYear } = useExpenseStore();
  
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = useState<{ open: boolean; id?: string; concept: string; amount: string; category: string; saving: boolean }>({ open: false, concept: '', amount: '', category: '', saving: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchQuickExpenses();
    if (categories.length === 0) fetchCategories();
  }, []);

  const handleToggleReminder = async () => {
    if (!settings) return;
    try {
      await updateSettings({ reminderEnabled: !settings.reminderEnabled });
    } catch {
      setSnackbar({ open: true, message: 'Error al actualizar', severity: 'error' });
    }
  };

  const handleTimeChange = async (time: string) => {
    try {
      await updateSettings({ reminderTime: time });
    } catch {
      setSnackbar({ open: true, message: 'Error al actualizar', severity: 'error' });
    }
  };

  const handleSaveQuickExpense = async () => {
    const { id, concept, amount, category } = editDialog;
    if (!concept.trim() || !amount) return;

    const numericAmount = parseCurrency(amount);
    if (numericAmount <= 0) return;

    setEditDialog(prev => ({ ...prev, saving: true }));

    try {
      if (id) {
        await updateQuickExpense(id, { concept: concept.trim(), amount: numericAmount, category: category || undefined });
        setSnackbar({ open: true, message: `"${concept.trim()}" actualizado correctamente`, severity: 'success' });
      } else {
        await addQuickExpense({ concept: concept.trim(), amount: numericAmount, category: category || undefined });
        setSnackbar({ open: true, message: `"${concept.trim()}" agregado correctamente`, severity: 'success' });
      }
      setEditDialog({ open: false, concept: '', amount: '', category: '', saving: false });
    } catch (error) {
      setEditDialog(prev => ({ ...prev, saving: false }));
      const errorMessage = error instanceof Error && error.message.includes('network')
        ? 'Sin conexión. Verifica tu internet.'
        : 'No se pudo guardar. Intenta de nuevo.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteQuickExpense = async () => {
    if (!deleteId) return;
    const toDelete = quickExpenses.find(qe => qe.id === deleteId);
    try {
      await deleteQuickExpense(deleteId);
      setSnackbar({ open: true, message: toDelete ? `"${toDelete.concept}" eliminado` : 'Gasto eliminado', severity: 'success' });
      setDeleteId(null);
    } catch (error) {
      const errorMessage = error instanceof Error && error.message.includes('network')
        ? 'Sin conexión. Verifica tu internet.'
        : 'No se pudo eliminar. Intenta de nuevo.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const getDeleteConfirmMessage = () => {
    const toDelete = quickExpenses.find(qe => qe.id === deleteId);
    if (!toDelete) return '¿Estás seguro de eliminar este gasto rápido?';
    return `¿Eliminar "${toDelete.concept}" (${formatCOP(toDelete.amount)})? Esta acción no se puede deshacer.`;
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      setSnackbar({ open: true, message: 'No hay gastos para exportar este mes', severity: 'error' });
      return;
    }
    const headers = ['Fecha', 'Concepto', 'Valor', 'Categoría'];
    const rows = expenses.map(e => [e.date.split('T')[0], e.concept, e.amount.toString(), e.category]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gastos-hormiga-${selectedYear}-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: `Exportados ${expenses.length} gasto${expenses.length !== 1 ? 's' : ''} a CSV`, severity: 'success' });
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, transparent 100%)`, pt: 4, pb: 3, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>Ajustes ⚙️</Typography>
      </Box>

      <Box sx={{ px: 2 }}>
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Recordatorio diario</Typography>
          <FormControlLabel control={<Switch checked={settings?.reminderEnabled || false} onChange={handleToggleReminder} />} label="Activar recordatorio" />
          {settings?.reminderEnabled && (
            <TextField fullWidth type="time" label="Hora del recordatorio" value={settings.reminderTime || '21:00'} onChange={(e) => handleTimeChange(e.target.value)} sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
          )}
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            Te recordaremos registrar tus gastos si no lo has hecho
          </Typography>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ color: 'warning.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Gastos Rápidos</Typography>
            </Box>
            <Button size="small" startIcon={<AddIcon />} onClick={() => setEditDialog({ open: true, concept: '', amount: '', category: '', saving: false })}>Agregar</Button>
          </Box>
          
          <List disablePadding>
            {quickExpenses.map((qe, index) => (
              <Box key={qe.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemText primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>{qe.concept}</span><CategoryBadge category={qe.category} showLabel={false} /></Box>} secondary={formatCOP(qe.amount)} />
                  <ListItemSecondaryAction>
                    <Tooltip title="Editar">
                      <IconButton size="small" aria-label={`Editar ${qe.concept}`} onClick={() => setEditDialog({ open: true, id: qe.id, concept: qe.concept, amount: formatInputCurrency(qe.amount.toString()), category: qe.category, saving: false })}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" aria-label={`Eliminar ${qe.concept}`} onClick={() => setDeleteId(qe.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
            {quickExpenses.length === 0 && <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>Sin gastos rápidos configurados</Typography>}
          </List>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Exportar datos</Typography>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV} fullWidth>Exportar mes actual a CSV</Button>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Gastos Hormiga v1.0.0</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Hecho con 🐜 en Colombia</Typography>
        </Box>
      </Box>

      <Dialog open={editDialog.open} onClose={() => !editDialog.saving && setEditDialog({ ...editDialog, open: false })} PaperProps={{ sx: { borderRadius: 3, minWidth: 320 } }}>
        <DialogTitle>{editDialog.id ? 'Editar' : 'Nuevo'} gasto rápido</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Concepto"
              value={editDialog.concept}
              onChange={(e) => setEditDialog({ ...editDialog, concept: e.target.value })}
              disabled={editDialog.saving}
              error={editDialog.concept.length > 50}
              helperText={editDialog.concept.length > 50 ? 'Máximo 50 caracteres' : ''}
              autoFocus
            />
            <TextField
              fullWidth
              label="Valor"
              value={editDialog.amount}
              onChange={(e) => setEditDialog({ ...editDialog, amount: formatInputCurrency(e.target.value) })}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              disabled={editDialog.saving}
              error={parseCurrency(editDialog.amount) <= 0 && editDialog.amount !== ''}
              helperText={parseCurrency(editDialog.amount) <= 0 && editDialog.amount !== '' ? 'Ingresa un valor mayor a 0' : ''}
            />
            <FormControl fullWidth disabled={editDialog.saving}>
              <InputLabel>Categoría</InputLabel>
              <Select value={editDialog.category} label="Categoría" onChange={(e) => setEditDialog({ ...editDialog, category: e.target.value })}>
                <MenuItem value=""><em>Automática (según concepto)</em></MenuItem>
                {categories.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialog({ ...editDialog, open: false })} color="inherit" disabled={editDialog.saving}>Cancelar</Button>
          <Button
            onClick={handleSaveQuickExpense}
            variant="contained"
            disabled={!editDialog.concept.trim() || !editDialog.amount || editDialog.saving || editDialog.concept.length > 50}
            startIcon={editDialog.saving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {editDialog.saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={!!deleteId} title="Eliminar gasto rápido" message={getDeleteConfirmMessage()} confirmText="Eliminar" onConfirm={handleDeleteQuickExpense} onCancel={() => setDeleteId(null)} />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
