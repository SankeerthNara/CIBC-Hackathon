import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerC360, CustomerC360 } from '../api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Chip } from '../components/Chip';
import { Table, Column } from '../components/Table';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { TranscriptModal } from '../components/TranscriptModal';

export const CustomerC360Page: React.FC = () => {
  const { id = 'G-004817' } = useParams<{ id: string }>();
  const [data, setData] = useState<CustomerC360 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(null);

  const fetchCustomer = () => {
    setLoading(true);
    setError(null);
    getCustomerC360(id)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton variant="rect" className="h-36 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton variant="rect" className="h-96 lg:col-span-2 rounded-xl" />
          <Skeleton variant="rect" className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorState
          title={`Unable to load Customer Golden Record (${id})`}
          message={error.error?.message || 'Failed to retrieve C360 profile from backend'}
          code={error.error?.code}
          details={error.error?.details}
          onRetry={fetchCustomer}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState
          title="Customer Not Found"
          description={`No customer record exists with Golden ID "${id}".`}
          actionText="Switch to Eleanor Vance (G-004817)"
          onAction={() => window.location.assign('/customer/G-004817')}
        />
      </div>
    );
  }

  const { summary, consent, identity, quality, products, contact_timeline } = data;

  const productColumns: Column<any>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (row) => (
        <div>
          <div className="font-semibold text-brand-navy">{row.product}</div>
          <div className="text-xs font-mono text-slate-500">{row.account_mask}</div>
        </div>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-medium">${row.balance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      key: 'overdue_amount',
      header: 'Overdue Amount',
      align: 'right',
      render: (row) => (
        <span className={`font-mono font-bold ${row.overdue_amount > 0 ? 'text-brand-orange' : 'text-slate-600'}`}>
          ${row.overdue_amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'dpd',
      header: 'DPD',
      align: 'center',
      render: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-mono ${
            row.dpd > 60
              ? 'bg-rose-100 text-rose-800'
              : row.dpd > 30
              ? 'bg-amber-100 text-amber-900'
              : row.dpd > 0
              ? 'bg-yellow-50 text-yellow-800'
              : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          {row.dpd}d
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="text-xs capitalize font-medium text-slate-700">{row.status}</span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hardship Severe Banner if flagged */}
      {summary.hardship_flag === 'severe' && (
        <div className="bg-brand-orange text-white p-4 rounded-xl shadow-md flex items-center justify-between animate-pulse-subtle">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider">
                Vulnerability Alert: Severe Hardship Active
              </div>
              <div className="text-xs text-orange-100 mt-0.5">
                Automated debt collection is restricted. Hardship signals present in recent call audio. Mandatory specialist handling.
              </div>
            </div>
          </div>
          {data.current_decision_id && (
            <Link
              to="/nba"
              className="bg-white text-brand-orange px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors shadow"
            >
              View in NBA Queue →
            </Link>
          )}
        </div>
      )}

      {/* CUSTOMER HEADER CARD */}
      <Card accent={summary.hardship_flag === 'severe' ? 'orange' : 'navy'}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">
                {data.display_name}
              </h1>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300">
                {data.golden_id}
              </span>
              <Badge variant={summary.bucket as any}>
                Bucket: {summary.bucket} ({summary.max_dpd} DPD)
              </Badge>
              {summary.hardship_flag !== 'clear' && (
                <Badge variant={summary.hardship_flag as any}>
                  Hardship: {summary.hardship_flag}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Segment:</span>{' '}
                <strong className="capitalize text-slate-700">{data.segment.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-slate-400">Province:</span>{' '}
                <strong className="text-slate-700">{data.province}</strong>
              </div>
              <div>
                <span className="text-slate-400">Language:</span>{' '}
                <strong className="text-slate-700">{data.preferred_language}</strong>
              </div>
              <div>
                <span className="text-slate-400">Customer Since:</span>{' '}
                <strong className="text-slate-700">{data.customer_since}</strong>
              </div>
            </div>

            {/* Consent Chips */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500">Contact Consent:</span>
              <Chip
                label="Voice Call"
                variant={consent.call ? 'green' : 'default'}
                icon={consent.call ? '✓' : '✕'}
              />
              <Chip
                label="SMS"
                variant={consent.sms ? 'green' : 'default'}
                icon={consent.sms ? '✓' : '✕'}
              />
              <Chip
                label="Email"
                variant={consent.email ? 'green' : 'default'}
                icon={consent.email ? '✓' : '✕'}
              />
            </div>
          </div>

          {/* Aggregate Financial Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Balance</div>
              <div className="font-mono text-lg font-bold text-brand-navy">
                ${summary.total_balance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Overdue</div>
              <div className="font-mono text-lg font-bold text-brand-orange">
                ${summary.total_overdue.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Worst DPD</div>
              <div className="font-mono text-lg font-bold text-slate-800">
                {summary.max_dpd} Days
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Break Prob</div>
              <div className="font-mono text-lg font-bold text-brand-orange">
                {data.break_prob ? `${Math.round(data.break_prob * 100)}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2-COLUMN LAYOUT: HOLDINGS & LINEAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Product Holdings & Contact Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRODUCT HOLDINGS */}
          <Card
            title={`Product Holdings (${products.length})`}
            subtitle="Multi-product exposure consolidated across cards, unsecured loans and deposits"
          >
            <Table
              columns={productColumns}
              data={products}
              keyExtractor={(_, i) => i}
              emptyMessage="No banking products found for this customer"
            />
          </Card>

          {/* CONTACT TIMELINE */}
          <Card
            title={`Contact Timeline & Interactions (${contact_timeline.length})`}
            subtitle="Consolidated omni-channel interaction log across call center, dialer, SMS and email"
          >
            <div className="space-y-4">
              {contact_timeline.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No historical contact entries recorded.</p>
              ) : (
                contact_timeline.map((item) => (
                  <div
                    key={item.contact_id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {new Date(item.contact_at).toLocaleDateString()} {new Date(item.contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {item.channel} ({item.direction})
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 capitalize">
                          {item.outcome.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {item.summary}
                      </p>
                      <div className="text-[11px] text-slate-400">
                        Officer: {item.agent_id} · Log ID: {item.contact_id}
                      </div>
                    </div>

                    {item.transcript_id && (
                      <button
                        onClick={() => setActiveTranscriptId(item.transcript_id!)}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-colors shadow-sm"
                      >
                        <span>View Transcript ({item.transcript_id})</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Identity Resolution & Data Quality Lineage */}
        <div className="space-y-6">
          {/* IDENTITY RESOLUTION */}
          <Card
            title="Identity Resolution"
            subtitle="Deterministic & probabilistic matching lineage"
            accent="green"
          >
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-900 uppercase">Match Confidence</div>
                  <div className="text-xs text-emerald-700">Golden Customer Certified</div>
                </div>
                <div className="font-mono text-xl font-black text-brand-green">
                  {Math.round(identity.match_confidence * 100)}%
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Linked Source System IDs
                </h4>
                <div className="space-y-2">
                  {identity.sources.map((src, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded border border-slate-200 bg-white flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-brand-navy uppercase mr-2">{src.system}:</span>
                        <span className="text-slate-600">{src.source_id}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {Math.round(src.match_confidence * 100)}% match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                <strong>Matching Algorithm:</strong> Deterministic masked SIN hash primary match + RapidFuzz address and name similarity clustering.
              </div>
            </div>
          </Card>

          {/* DATA QUALITY AUDIT CHECK */}
          <Card
            title="Field-Level DQ Assertions"
            subtitle="Live contract assertions protecting this customer"
          >
            <div className="space-y-2.5">
              {quality.map((q, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800">{q.field}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Rule: {q.rule} · {q.lineage}
                    </div>
                  </div>
                  <Badge variant={q.status === 'pass' ? 'pass' : 'warn'} size="sm">
                    {q.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Transcript Modal */}
      <TranscriptModal
        transcriptId={activeTranscriptId}
        onClose={() => setActiveTranscriptId(null)}
      />
    </div>
  );
};
