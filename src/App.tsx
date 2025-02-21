import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="spinner" />
  </div>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </Suspense>
      <Toast />
    </div>
  );
};

export default App;