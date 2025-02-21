import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import MultiplayerGame from './pages/MultiplayerGame';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="spinner" />
  </div>
);

const Home = React.lazy(() => import('./pages/Home'));
const SinglePlayerGame = React.lazy(() => import('./pages/SinglePlayerGame'));
const MultiplayerLobby = React.lazy(() => import('./pages/MultiplayerLobby'));
const Stats = React.lazy(() => import('./pages/Stats'));
const Profile = React.lazy(() => import('./pages/Profile'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const AppWrapper = () => (
  <ThemeProvider>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </ThemeProvider>
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppWrapper />,
      children: [
        {
          index: true,
          element: withSuspense(Home),
        },
        {
          path: 'play/single',
          element: withSuspense(SinglePlayerGame),
        },
        {
          path: 'play/multi',
          element: withSuspense(MultiplayerLobby),
        },
        {
          path: 'game/:sessionId',
          element: <MultiplayerGame />
        },
        {
          path: 'stats',
          element: withSuspense(Stats),
        },
        {
          path: 'profile',
          element: withSuspense(Profile),
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