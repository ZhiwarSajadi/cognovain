'use client';

import React from 'react';
import { AlertTriangle, ChevronLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import BgGradient from '@/components/ui/common/bg-gradient';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    // Optional: Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="relative flex items-center justify-center min-h-[60vh] px-6">
      <BgGradient />
      
      <div className="w-full max-w-md p-6 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 shadow-lg">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We apologize for the inconvenience. The application encountered an unexpected error.
          </p>
          
          {error.message && process.env.NODE_ENV === 'development' && (
            <div className="w-full text-sm text-left text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 mb-4">
              <p className="font-medium mb-1">Error details:</p>
              <p className="font-mono text-xs break-all">{error.message}</p>
              {error.digest && (
                <p className="text-xs mt-1 text-gray-500">Error ID: {error.digest}</p>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Go back
            </Button>
            
            <Button
              onClick={() => reset()}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
