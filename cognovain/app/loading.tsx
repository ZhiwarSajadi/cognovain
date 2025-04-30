'use client';

import Spinner from '@/components/ui/common/spinner';
import BgGradient from '@/components/ui/common/bg-gradient';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <BgGradient />
      <div className="flex flex-col items-center gap-6 p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg">
        <Spinner size="lg" variant="primary" />
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            Loading Cognovain
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            We're preparing your cognitive analysis tools...
          </p>
        </div>
      </div>
    </div>
  );
}
