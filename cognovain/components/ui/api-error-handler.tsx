'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from './common/notification-provider';

interface ApiErrorHandlerProps {
  children: React.ReactNode;
}

interface ApiErrorState {
  hasError: boolean;
  message: string;
  statusCode?: number;
}

/**
 * ApiErrorHandler component to handle API errors consistently across the application.
 * It provides a centralized way to display API error notifications and handle retries.
 */
const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({ children }) => {
  const [error, setError] = useState<ApiErrorState>({ hasError: false, message: '' });
  const { showNotification } = useNotification();

  // Global error handler for fetch and API calls
  useEffect(() => {
    const handleGlobalErrors = (event: ErrorEvent) => {
      // Only handle API/network related errors
      if (event.message.includes('fetch') || event.message.includes('api') || event.message.includes('network')) {
        setError({
          hasError: true,
          message: 'A network error occurred. Please check your connection and try again.'
        });
        
        showNotification(
          'A network error occurred. Please check your connection and try again.',
          'error',
          5000
        );
      }
    };

    // Handle unhandled promise rejections (common with fetch API)
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || 'An API request failed';
      
      setError({
        hasError: true,
        message: errorMessage,
        statusCode: event.reason?.status
      });

      // Show different messages based on status code
      if (event.reason?.status === 429) {
        showNotification('Rate limit exceeded. Please try again later.', 'error', 5000);
      } else if (event.reason?.status === 401 || event.reason?.status === 403) {
        showNotification('Authentication error. Please sign in again.', 'error', 5000);
      } else {
        showNotification(errorMessage, 'error', 5000);
      }

      // Prevent the default browser error handling
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalErrors);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleGlobalErrors);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [showNotification]);

  // Reset error state
  const resetError = () => {
    setError({ hasError: false, message: '' });
  };

  // Provide error context to children
  return (
    <div onClick={error.hasError ? resetError : undefined}>
      {children}
    </div>
  );
};

export default ApiErrorHandler;

// Utility function to handle API errors in try/catch blocks
export const handleApiError = (error: any, showNotification: Function) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  
  if (error.message) {
    errorMessage = error.message;
  }
  
  if (error.status === 429) {
    errorMessage = 'Rate limit exceeded. Please try again later.';
  } else if (error.status === 401 || error.status === 403) {
    errorMessage = 'Authentication error. Please sign in again.';
  }
  
  showNotification(errorMessage, 'error', 5000);
  return errorMessage;
};