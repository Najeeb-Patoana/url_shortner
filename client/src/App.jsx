import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext.jsx';
import queryClient from './services/queryClient.js';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#111827',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
              },
              success: {
                style: { borderLeft: '3px solid #059669' },
                iconTheme: { primary: '#059669', secondary: '#fff' },
              },
              error: {
                style: { borderLeft: '3px solid #dc2626' },
                iconTheme: { primary: '#dc2626', secondary: '#fff' },
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
