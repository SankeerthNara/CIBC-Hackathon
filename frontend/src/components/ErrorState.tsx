import React, { useState } from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  details?: Record<string, any>;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  message,
  code,
  details,
  onRetry,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`p-6 border border-rose-200 bg-rose-50/70 rounded-xl text-rose-900 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 text-brand-orange flex-shrink-0 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-rose-900">{title}</h3>
            {code && (
              <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                {code}
              </span>
            )}
          </div>
          <p className="text-sm text-rose-800 mt-1 leading-relaxed">{message}</p>

          {(details || code) && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-semibold text-rose-700 underline hover:text-rose-900"
              >
                {showDetails ? 'Hide technical details' : 'Show technical details'}
              </button>
              {showDetails && (
                <pre className="mt-2 p-3 bg-white/80 border border-rose-200 rounded text-xs font-mono text-slate-800 overflow-x-auto">
                  {JSON.stringify({ code, details }, null, 2)}
                </pre>
              )}
            </div>
          )}

          {onRetry && (
            <div className="mt-4">
              <Button variant="danger" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
