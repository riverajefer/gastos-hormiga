import { useEffect, useState } from 'react';
import { Box, Typography, Card, Tab, Tabs, alpha, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ShameMode } from '../../components/ShameMode';
import { useStatsStore } from '../../store/useStatsStore';
import { useExpenseStore } from '../../store/useExpenseStore';
import { formatCOP } from '../../utils/formatCurrency';
import { formatMonthShort } from '../../utils/dateUtils';
import { categoryColors } from '../../theme/theme';

const getCategoryInfo = (id: string) => {
  const info: Record<string, { label: string; emoji: string }> = {
    comida: { label: 'Comida', emoji: '🍔' },
    bebidas: { label: 'Bebidas', emoji: '☕' },
    transporte: { label: 'Transporte', emoji: '🚌' },
    antojos: { label: 'Antojos', emoji: '🍫' },
    entretenimiento: { label: 'Entretenimiento', emoji: '🎮' },
    otros: { label: 'Otros', emoji: '📦' },
  };
  return info[id] || info.otros;
};

export function StatsPage() {
  const [tab, setTab] = useState(0);
  const { selectedYear, selectedMonth } = useExpenseStore();
  const { monthlyStats, yearlyStats, weekdayStats, loading, fetchMonthlyStats, fetchYearlyStats, fetchWeekdayStats } = useStatsStore();

  useEffect(() => {
    fetchMonthlyStats(selectedYear, selectedMonth);
    fetchYearlyStats(selectedYear);
    fetchWeekdayStats(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const categoryData = monthlyStats?.byCategory.map(c => ({
    name: getCategoryInfo(c.category).label,
    value: c.total,
    color: categoryColors[c.category] || categoryColors.otros,
    emoji: getCategoryInfo(c.category).emoji,
  })) || [];

  const weekdayData = weekdayStats?.map(w => ({
    name: w.name.slice(0, 3),
    total: w.total,
    count: w.count,
  })) || [];

  const monthlyData = yearlyStats?.byMonth.map(m => ({
    name: formatMonthShort(m.month),
    total: m.total,
  })) || [];

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.info.main, 0.1)} 0%, transparent 100%)`, pt: 4, pb: 2, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Estadísticas 📊</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' } }}>
          <Tab label="Resumen" />
          <Tab label="Modo Vergüenza 😅" />
        </Tabs>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>
        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Por categoría</Typography>
              {loading ? <Skeleton variant="rounded" height={200} /> : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCOP(value)} contentStyle={{ background: '#1c1c28', border: 'none', borderRadius: 8 }} />
                    <Legend formatter={(value, entry: any) => `${entry.payload.emoji} ${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>Sin datos este mes</Typography>}
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Por día de la semana</Typography>
              {loading ? <Skeleton variant="rounded" height={200} /> : weekdayData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weekdayData}>
                    <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCOP(value)} contentStyle={{ background: '#1c1c28', border: 'none', borderRadius: 8 }} />
                    <Bar dataKey="total" fill="#00d9c0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>Sin datos este mes</Typography>}
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Tendencia {selectedYear}</Typography>
              {loading ? <Skeleton variant="rounded" height={200} /> : monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCOP(value)} contentStyle={{ background: '#1c1c28', border: 'none', borderRadius: 8 }} />
                    <Bar dataKey="total" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>Sin datos este año</Typography>}
            </Card>
          </Box>
        )}

        {tab === 1 && yearlyStats && <ShameMode stats={yearlyStats} loading={loading} />}
      </Box>
    </Box>
  );
}
