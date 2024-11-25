import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/reset.css';
import './index.css';
import './i18n';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    } />
  </StrictMode>
);