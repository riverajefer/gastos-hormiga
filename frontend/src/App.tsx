import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { darkTheme, lightTheme } from './theme/theme';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { HistoryPage } from './pages/History';
import { StatsPage } from './pages/Stats';
import { SettingsPage } from './pages/Settings';
import { useSettingsStore } from './store/useSettingsStore';

function App() {
  const { settings } = useSettingsStore();
  
  const theme = useMemo(() => {
    return settings?.darkMode !== false ? darkTheme : lightTheme;
  }, [settings?.darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
