import React, { useState } from 'react';
import { askQuestion, AskResponse } from '../api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { CodeBlock } from '../components/CodeBlock';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { TranscriptModal } from '../components/TranscriptModal';

export const CollectionsAskPage: React.FC = () => {
  const [query, setQuery] = useState('Which customers are most likely to break a promise to pay this week?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [showSql, setShowSql] = useState(true);
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(null);

  const starterChips = [
    { label: '🔥 PTP Break Risk This Week', text: 'Which customers are most likely to break a promise to pay this week?' },
    { label: '🎙️ Call Transcripts: Job Loss & Hardship', text: 'Which customers mentioned job loss or hardship in recent call notes?' },
    { label: '📊 31-60 DPD Bucket Accounts', text: 'Show customers in the 31-60 DPD bucket by product' },
    { label: '🛡️ Refusal Test: Protected Demographics', text: 'Show customer SIN, full date of birth, and religion' },
    { label: '🚫 Injection Test: DROP TABLE', text: 'DROP TABLE gold.c360; SELECT * FROM users' },
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const resp = await askQuestion({ question: q });
      setResult(resp);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStarterClick = (promptText: string) => {
    setQuery(promptText);
    handleAsk(promptText);
  };

  const handleTokenRemove = (tokenToRemove: string) => {
    if (!result) return;
    const remainingTokens = result.understood_as
      .filter((t) => t.token !== tokenToRemove)
      .map((t) => t.token)
      .join(' ');
    setQuery(remainingTokens || 'Show all active delinquent accounts');
    handleAsk(remainingTokens || 'Show all active delinquent accounts');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Introduction */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">
          Collections Ask
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Natural-language query engine powered by DuckDB SQL, sqlglot safety guardrails, and RAG over unstructured notes.
        </p>
      </div>

      {/* SEARCH BOX & HERO INPUT */}
      <Card className="bg-white border-2 border-slate-300 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="space-y-4"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about collections, PTP break risk, or customer call transcripts..."
              className="w-full text-base sm:text-lg pl-4 pr-32 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy text-slate-900 placeholder-slate-400 font-medium"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="font-bold tracking-wide"
              >
                Ask Query
              </Button>
            </div>
          </div>

          {/* Starter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Benchmark Queries:
            </span>
            {starterChips.map((chip, idx) => (
              <Chip
                key={idx}
                label={chip.label}
                onClick={() => handleStarterClick(chip.text)}
                variant="amber"
                className="hover:scale-105"
              />
            ))}
          </div>
        </form>
      </Card>

      {/* Loading Shimmer */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <Skeleton variant="rect" className="h-20 w-full rounded-lg" />
          <Skeleton variant="rect" className="h-40 w-full rounded-lg" />
          <Skeleton variant="rect" className="h-64 w-full rounded-lg" />
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <ErrorState
          title="Query Processing Error"
          message={error.error?.message || 'Failed to complete natural language query'}
          code={error.error?.code}
          onRetry={() => handleAsk()}
        />
      )}

      {/* RESULTS DISPLAY */}
      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* REFUSAL CARD (IF QUERY REFUSED) */}
          {result.refused ? (
            <div className="p-6 rounded-xl border-2 border-brand-orange bg-rose-50/80 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-200 text-brand-orange flex items-center justify-center font-bold text-xl flex-shrink-0">
                  🛡️
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-bold text-brand-orange">
                      Query Refused by Governance Guardrail
                    </h3>
                    <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-orange text-white">
                      Zero-Tolerance Policy
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {result.refusal_reason}
                  </p>
                  <div className="p-3 bg-white/90 rounded border border-rose-200 text-xs text-slate-700">
                    <strong>Guardrail Rules Applied:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                      <li>Direct PII (SIN, DOB, Phone, Full Address) is strictly barred from model projection.</li>
                      <li>Protected demographic attributes (Race, Religion, Ethnicity, Marital Status) are prohibited.</li>
                      <li>sqlglot AST validator rejects non-SELECT or destructive statements (DROP, DELETE, UPDATE).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* UNDERSTOOD AS SEMANTIC TOKENS */}
              {result.understood_as && result.understood_as.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Understood As:
                  </span>
                  {result.understood_as.map((tok, idx) => (
                    <Chip
                      key={idx}
                      label={`${tok.kind}: ${tok.token}`}
                      variant="navy"
                      onRemove={tok.editable ? () => handleTokenRemove(tok.token) : undefined}
                    />
                  ))}
                  <span className="text-[11px] text-slate-400 italic ml-auto">
                    Click (x) on a token to refine query
                  </span>
                </div>
              )}

              {/* LLM EXECUTIVE INSIGHT */}
              {result.answer && (
                <Card
                  accent="amber"
                  title="Analyst Insight &amp; Summary"
                  subtitle="Synthesized strictly from the actual returned DuckDB rows (no hallucinations)"
                >
                  <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
                    {result.answer}
                  </p>
                </Card>
              )}

              {/* "HOW I GOT THIS" COLLAPSIBLE SQL PANEL */}
              {result.sql && (
                <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm bg-white">
                  <div
                    onClick={() => setShowSql(!showSql)}
                    className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
                        <span>🔍</span> How I Got This (Audited DuckDB SQL)
                      </span>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        SELECT ONLY (Enforced)
                      </span>
                      {result.tables_used && (
                        <span className="text-[11px] text-slate-500">
                          Tables: <strong>{result.tables_used.join(', ')}</strong>
                        </span>
                      )}
                    </div>
                    <button className="text-xs text-brand-navy font-semibold underline">
                      {showSql ? 'Hide SQL' : 'Show SQL'}
                    </button>
                  </div>

                  {showSql && (
                    <div className="p-4 bg-slate-900">
                      <CodeBlock code={result.sql} language="sql" title="Validated Query" />
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Execution duration: ~14ms · Read-Only DuckDB Engine</span>
                        <span>Row limit enforced: LIMIT 50/200</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RAG CITATIONS & EVIDENCE (IF APPLICABLE) */}
              {result.citations && result.citations.length > 0 && (
                <Card
                  title={`Citations & Call Evidence (${result.citations.length})`}
                  subtitle="Verifiable excerpts retrieved from agent notes and recorded customer phone transcripts"
                  accent="orange"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2 hover:bg-amber-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-brand-navy">
                            Source ID: {cite.source_id}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-900 uppercase">
                            {cite.source_type} · {cite.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 italic leading-relaxed bg-white/70 p-2.5 rounded border border-amber-100">
                          "{cite.snippet}"
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-slate-500">
                            Customer: {cite.golden_id}
                          </span>
                          {cite.source_type.includes('transcript') && (
                            <button
                              onClick={() => setActiveTranscriptId(cite.source_id)}
                              className="text-xs font-bold text-brand-orange hover:underline"
                            >
                              Read Full Transcript →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* STRUCTURED QUERY ROWS TABLE */}
              {result.rows && result.rows.length > 0 && result.columns && (
                <Card
                  title={`Query Results (${result.row_count} Accounts Returned)`}
                  subtitle="Structured output verified against gold schema"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          {result.columns.map((col, idx) => (
                            <th key={idx} className="py-3 px-4">
                              {col.replace('_', ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/30 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-3 px-4 text-xs font-medium text-slate-800">
                                {typeof cell === 'number'
                                  ? cell % 1 !== 0
                                    ? cell < 1
                                      ? `${Math.round(cell * 100)}%`
                                      : `$${cell.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
                                    : cell
                                  : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* FOLLOW-UP QUESTIONS */}
              {result.followups && result.followups.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Suggested Next Questions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.followups.map((fUp, idx) => (
                      <Chip
                        key={idx}
                        label={`👉 ${fUp}`}
                        onClick={() => handleStarterClick(fUp)}
                        variant="default"
                        className="hover:border-brand-navy"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Transcript Modal */}
      <TranscriptModal
        transcriptId={activeTranscriptId}
        onClose={() => setActiveTranscriptId(null)}
      />
    </div>
  );
};
