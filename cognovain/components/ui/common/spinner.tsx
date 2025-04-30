'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'neutral';
}

export default function Spinner({
  className,
  size = 'md',
  variant = 'primary',
}: SpinnerProps) {
  // Map size to dimensions
  const sizeMap = {
    xs: 'h-4 w-4 border-[2px]',
    sm: 'h-6 w-6 border-[2px]',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-[4px]',
  };

  // Map variant to colors
  const variantMap = {
    primary: 'border-t-rose-600 dark:border-t-rose-500 border-gray-200 dark:border-gray-700',
    secondary: 'border-t-slate-800 dark:border-t-slate-600 border-gray-200 dark:border-gray-700',
    neutral: 'border-t-gray-800 dark:border-t-gray-300 border-gray-200 dark:border-gray-700',
  };

  const sizeStyle = sizeMap[size] || sizeMap.md;
  const variantStyle = variantMap[variant] || variantMap.primary;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div
        className={cn(
          'rounded-full border animate-spin',
          sizeStyle,
          variantStyle
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
