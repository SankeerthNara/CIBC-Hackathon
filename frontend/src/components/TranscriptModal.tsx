import React, { useEffect, useState } from 'react';
import { getTranscript, TranscriptDetail } from '../api';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { ErrorState } from './ErrorState';

interface TranscriptModalProps {
  transcriptId: string | null;
  onClose: () => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  transcriptId,
  onClose,
}) => {
  const [data, setData] = useState<TranscriptDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!transcriptId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    getTranscript(transcriptId)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [transcriptId]);

  if (!transcriptId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                📞
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-brand-navy">
                  Call Transcript: {transcriptId}
                </h3>
                {data && (
                  <p className="text-xs text-slate-500">
                    Date: {data.date} · Duration: {Math.floor(data.duration_sec / 60)}m {data.duration_sec % 60}s · Agent ID: {data.agent_id}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton variant="rect" className="h-16 w-full" />
                <Skeleton variant="text" rows={6} />
              </div>
            )}

            {error && (
              <ErrorState
                title="Could not load transcript"
                message={error.error?.message || 'Transcript record not found'}
                code={error.error?.code}
              />
            )}

            {data && (
              <>
                {/* LLM Extracted Summary & Features */}
                <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Summary &amp; Extracted Signals
                    </span>
                    {data.llm_features.hardship_signal && (
                      <Badge variant={data.llm_features.hardship_signal} size="sm">
                        Hardship: {data.llm_features.hardship_signal}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {data.summary}
                  </p>
                  {data.llm_features.stated_delay_reason && (
                    <div className="text-[11px] text-amber-900 pt-1 border-t border-amber-200/60">
                      <strong>Stated Delay Reason:</strong> {data.llm_features.stated_delay_reason.replace('_', ' ')}
                    </div>
                  )}
                </div>

                {/* Dialog Turns */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Speaker Turns (Redacted Audio Recording)
                  </h4>
                  {data.turns.map((turn, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 text-xs leading-relaxed ${
                        turn.speaker === 'agent' ? 'pl-4' : 'pr-4'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${
                          turn.speaker === 'agent'
                            ? 'bg-slate-800 text-white'
                            : 'bg-brand-orange text-white'
                        }`}
                      >
                        {turn.speaker === 'agent' ? 'AG' : 'CU'}
                      </div>
                      <div
                        className={`flex-1 p-3 rounded-lg border ${
                          turn.speaker === 'agent'
                            ? 'bg-slate-50 border-slate-200 text-slate-800'
                            : 'bg-white border-amber-200 text-slate-900 shadow-sm'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          {turn.speaker === 'agent' ? 'Collections Officer' : 'Customer'}
                        </div>
                        {turn.text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
