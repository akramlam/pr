import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './i18n';
import './index.css';

// Wait for i18n to be initialized before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render with Strict Mode
root.render(
  <React.StrictMode>
    <RouterProvider 
      router={router} 
      fallbackElement={
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner" />
        </div>
      } 
    />
  </React.StrictMode>
);