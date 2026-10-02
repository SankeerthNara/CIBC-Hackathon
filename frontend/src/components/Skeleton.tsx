import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle' | 'table-row';
  rows?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  rows = 1,
}) => {
  if (variant === 'table-row') {
    return (
      <div className="space-y-3 py-3 w-full animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={`rounded-full bg-slate-200 animate-pulse ${className}`} />
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-200 rounded ${
              i === rows - 1 && rows > 1 ? 'w-2/3' : 'w-full'
            } ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-200 rounded-lg animate-pulse ${className}`}
    />
  );
};
