import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The page you're looking for doesn't exist.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-indigo-500"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-500"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default ErrorBoundary; 