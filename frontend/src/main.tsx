import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/styles/global.css';
import App from './App';
import { AdminPanel } from './pages/AdminPanel';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<App />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*"      element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      fontFamily: 'var(--font-mono)', color: 'var(--text-dim)',
    }}>
      <span style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--text)' }}>404</span>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Page not found</p>
      <a href="/" style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>← Go home</a>
    </div>
  );
}
