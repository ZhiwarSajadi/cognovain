'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-6 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 shadow-sm max-w-2xl mx-auto my-8">
          <div className="flex flex-col items-center text-center gap-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Something went wrong</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-4 rounded border border-red-100 dark:border-red-900/50 max-w-full overflow-auto">
              <p className="font-mono">{this.state.error?.message || 'Unknown error'}</p>
            </div>
            <div className="mt-4 flex gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh page
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                Go to homepage
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
