import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="spinner" />
  </div>
);

// Lazy load components with loading fallback
const Home = React.lazy(() => 
  import('./pages/Home').then(module => ({ default: module.default }))
);
const Login = React.lazy(() => 
  import('./pages/Login').then(module => ({ default: module.default }))
);
const Game = React.lazy(() => 
  import('./pages/Game').then(module => ({ default: module.default }))
);
const Leaderboard = React.lazy(() => 
  import('./pages/Leaderboard').then(module => ({ default: module.default }))
);
const Profile = React.lazy(() => 
  import('./pages/Profile').then(module => ({ default: module.default }))
);
const MultiplayerGame = React.lazy(() => 
  import('./pages/MultiplayerGame').then(module => ({ default: module.default }))
);
const MultiplayerLobby = React.lazy(() => 
  import('./pages/MultiplayerLobby').then(module => ({ default: module.default }))
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: withSuspense(Home),
        },
        {
          path: 'login',
          element: withSuspense(Login),
        },
        {
          path: 'game',
          element: withSuspense(() => (
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          )),
        },
        {
          path: 'leaderboard',
          element: withSuspense(Leaderboard),
        },
        {
          path: 'profile',
          element: withSuspense(() => (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )),
        },
        {
          path: 'multiplayer',
          element: withSuspense(() => (
            <ProtectedRoute>
              <MultiplayerLobby />
            </ProtectedRoute>
          )),
        },
        {
          path: 'multiplayer/:sessionId',
          element: withSuspense(() => (
            <ProtectedRoute>
              <MultiplayerGame />
            </ProtectedRoute>
          )),
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);  