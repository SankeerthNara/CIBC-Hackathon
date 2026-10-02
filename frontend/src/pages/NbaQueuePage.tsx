import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getNbaQueue,
  getNbaDetail,
  submitNbaDecision,
  NbaQueueItem,
  NbaDetail,
} from '../api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Drawer } from '../components/Drawer';
import { Table, Column } from '../components/Table';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export const NbaQueuePage: React.FC = () => {
  const [items, setItems] = useState<NbaQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'overridden' | 'all'>('pending');
  const [hardshipOnly, setHardshipOnly] = useState(false);

  // Detail Drawer
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<NbaDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Override Modal
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideTreatment, setOverrideTreatment] = useState('payment_plan');
  const [actionError, setActionError] = useState<any>(null);
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchQueue = () => {
    setLoading(true);
    setError(null);
    getNbaQueue({
      status: statusFilter === 'all' ? undefined : statusFilter,
      hardship_only: hardshipOnly,
    })
      .then((res) => setItems(res.items))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter, hardshipOnly]);

  const handleRowClick = async (item: NbaQueueItem) => {
    setSelectedDecisionId(item.decision_id);
    setLoadingDetail(true);
    setActionError(null);
    try {
      const res = await getNbaDetail(item.decision_id);
      setDetail(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApprove = async (decisionId: string) => {
    setSubmittingAction(true);
    setActionError(null);
    try {
      await submitNbaDecision(decisionId, { action: 'approve' });
      // Optimistic update
      setItems((prev) =>
        prev.map((it) => (it.decision_id === decisionId ? { ...it, status: 'approved' } : it))
      );
      if (detail && detail.decision_id === decisionId) {
        setDetail({ ...detail, status: 'approved' });
      }
    } catch (err: any) {
      setActionError(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleOverrideSubmit = async () => {
    if (!selectedDecisionId || !overrideReason.trim()) return;

    setSubmittingAction(true);
    setActionError(null);
    try {
      await submitNbaDecision(selectedDecisionId, {
        action: 'override',
        reason: overrideReason,
        new_treatment: overrideTreatment,
      });
      // Update queue item
      setItems((prev) =>
        prev.map((it) =>
          it.decision_id === selectedDecisionId
            ? { ...it, status: 'overridden', treatment: overrideTreatment as any }
            : it
        )
      );
      if (detail && detail.decision_id === selectedDecisionId) {
        setDetail({
          ...detail,
          status: 'overridden',
          final_treatment: overrideTreatment,
          override_reason: overrideReason,
        });
      }
      setOverrideModalOpen(false);
      setOverrideReason('');
    } catch (err: any) {
      setActionError(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const queueColumns: Column<NbaQueueItem>[] = [
    {
      key: 'rank',
      header: '#',
      width: '48px',
      render: (_, idx) => <span className="font-mono text-slate-400 font-bold">{idx + 1}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (
        <div>
          <div className="font-bold text-brand-navy flex items-center gap-2">
            <span>{row.display_name}</span>
            {row.hardship_flag === 'severe' && (
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-brand-orange text-white">
                Hardship
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-slate-400">
            <Link
              to={`/customer/${row.golden_id}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline text-brand-navy"
            >
              {row.golden_id}
            </Link>{' '}
            · {row.products.join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: 'total_overdue',
      header: 'Overdue / DPD',
      align: 'right',
      render: (row) => (
        <div className="text-right">
          <div className="font-mono font-bold text-brand-orange">
            ${row.total_overdue.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {row.max_dpd} DPD ({row.bucket})
          </div>
        </div>
      ),
    },
    {
      key: 'break_prob',
      header: 'Break Probability',
      render: (row) => {
        const pct = Math.round(row.break_prob * 100);
        const colorClass =
          pct > 70 ? 'bg-brand-orange text-rose-700' : pct > 40 ? 'bg-amber-400 text-amber-900' : 'bg-brand-green text-emerald-700';

        return (
          <div className="w-32">
            <div className="flex justify-between text-xs font-mono font-bold mb-1">
              <span>{pct}%</span>
              <span className="text-[10px] text-slate-400">PTP Risk</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${colorClass.split(' ')[0]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'treatment',
      header: 'Recommended Intervention',
      render: (row) => (
        <div>
          <div className="font-semibold text-brand-navy capitalize">
            {row.treatment.replace('_', ' ')}
          </div>
          <div className="text-[11px] text-slate-500 capitalize">
            Channel: {row.channel} · {new Date(row.recommended_time).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <div className="space-y-1">
          <Badge variant={row.status as any} size="sm">
            {row.status}
          </Badge>
          {row.requires_specialist && (
            <div className="text-[10px] text-brand-orange font-bold leading-tight">
              Specialist Required
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status === 'pending' ? (
            <>
              <button
                onClick={() => handleApprove(row.decision_id)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                title={row.requires_specialist ? 'Requires specialist role' : 'Approve recommendation'}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setSelectedDecisionId(row.decision_id);
                  setOverrideTreatment(row.treatment);
                  setOverrideModalOpen(true);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Override
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">Resolved</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* HEADER & QUEUE STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">
            Next Best Action Queue
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Prioritized intervention recommendations powered by LightGBM PTP break model + SHAP explainability.
          </p>
        </div>

        {/* Global queue metrics */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs font-medium">
          <div>
            <span className="text-slate-400 block">Total Queue</span>
            <strong className="text-base text-brand-navy font-mono font-bold">{items.length}</strong>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400 block">Pending</span>
            <strong className="text-base text-amber-600 font-mono font-bold">
              {items.filter((i) => i.status === 'pending').length}
            </strong>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400 block">Hardship Cases</span>
            <strong className="text-base text-brand-orange font-mono font-bold">
              {items.filter((i) => i.requires_specialist).length}
            </strong>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status:</span>
          {(['pending', 'approved', 'overridden', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hardshipOnly}
              onChange={(e) => setHardshipOnly(e.target.checked)}
              className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
            />
            <span>Show Hardship / Vulnerability Only</span>
          </label>
        </div>
      </div>

      {/* ACTION ERROR BANNER (E.G. 409 HARDSHIP REQUIRES SPECIALIST) */}
      {actionError && (
        <ErrorState
          title={actionError.error?.code === 'hardship_requires_specialist' ? 'Hardship Specialist Required' : 'Action Failed'}
          message={
            actionError.error?.message ||
            'Non-specialist role cannot approve or override severe hardship cases. Switch role to "Specialist" in the top bar.'
          }
          code={actionError.error?.code}
          details={actionError.error?.details}
          className="shadow-md"
        />
      )}

      {/* QUEUE TABLE */}
      {loading ? (
        <Skeleton variant="rect" className="h-96 w-full rounded-xl" />
      ) : error ? (
        <ErrorState
          title="Could not load NBA Queue"
          message={error.error?.message || 'Failed to fetch queue from API'}
          code={error.error?.code}
          onRetry={fetchQueue}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No Accounts in Queue"
          description="All delinquent decisions have been resolved or filtered out."
          actionText="Reset filters"
          onAction={() => {
            setStatusFilter('all');
            setHardshipOnly(false);
          }}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
            💡 Click any row to inspect <strong>Top 3 SHAP Decision Drivers</strong> and view complete model lineage.
          </div>
          <Table
            columns={queueColumns}
            data={items}
            keyExtractor={(row) => row.decision_id}
            onRowClick={handleRowClick}
          />
        </Card>
      )}

      {/* EXPLANATION DRAWER */}
      <Drawer
        isOpen={Boolean(selectedDecisionId && detail)}
        onClose={() => setSelectedDecisionId(null)}
        title={detail?.display_name || 'Decision Detail'}
        subtitle={`ID: ${detail?.decision_id} · Golden ID: ${detail?.golden_id} · Model: ${detail?.model_version}`}
        footer={
          detail?.status === 'pending' ? (
            <>
              <Button
                variant="success"
                size="sm"
                isLoading={submittingAction}
                onClick={() => detail && handleApprove(detail.decision_id)}
              >
                Approve Recommendation
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (detail) {
                    setOverrideTreatment(detail.treatment);
                    setOverrideModalOpen(true);
                  }
                }}
              >
                Override Action
              </Button>
            </>
          ) : (
            <span className="text-xs text-slate-500 italic">This decision is marked as {detail?.status}.</span>
          )
        }
      >
        {loadingDetail && <Skeleton variant="text" rows={8} />}

        {detail && (
          <div className="space-y-6">
            {/* Hardship Alert if flagged */}
            {detail.requires_specialist && (
              <div className="p-4 rounded-lg bg-brand-orange text-white text-xs space-y-1 shadow">
                <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚠️</span> Hardship Escalation Active
                </div>
                <div>
                  This account has been flagged for severe hardship. Auto-collection is blocked. Requires review by an accredited hardship specialist (Role: Specialist).
                </div>
              </div>
            )}

            {/* Recommendation Overview */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Treatment
              </div>
              <div className="text-base font-bold text-brand-navy capitalize">
                {detail.treatment.replace('_', ' ')} via {detail.channel}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {detail.explanation}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Optimal Window: {new Date(detail.recommended_time).toLocaleString()}
              </div>
            </div>

            {/* TOP 3 SHAP DECISION DRIVERS (PLAIN ENGLISH) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top 3 Decision Drivers (SHAP Values)
                </h4>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  No Demographic Bias
                </span>
              </div>

              <div className="space-y-2">
                {detail.drivers.map((drv, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-3 ${
                      drv.direction === 'increases_risk'
                        ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                        : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">
                      {drv.direction === 'increases_risk' ? '📈' : '📉'}
                    </span>
                    <div>
                      <div className="font-bold">
                        Driver {idx + 1}: {drv.plain_english}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Feature: {drv.feature} (Value: {String(drv.value)}) · Direction: {drv.direction.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution History if resolved */}
            {detail.status !== 'pending' && (
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
                <div className="font-bold uppercase tracking-wider">Decision Recorded</div>
                <div>Status: <strong>{detail.status}</strong></div>
                {detail.reviewed_by && <div>Reviewer: {detail.reviewed_by} on {detail.reviewed_at}</div>}
                {detail.override_reason && (
                  <div>Override Reason: <em>"{detail.override_reason}"</em></div>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* OVERRIDE MODAL */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
            onClick={() => setOverrideModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-300 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-brand-navy">
                Override Decision Recommendation
              </h3>
              <p className="text-xs text-slate-600">
                Compliance requirement: You must provide a formal override reason and designate an alternative treatment.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select New Treatment:
                  </label>
                  <select
                    value={overrideTreatment}
                    onChange={(e) => setOverrideTreatment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-brand-navy"
                  >
                    <option value="payment_plan">Payment Plan / Arrangement</option>
                    <option value="hardship_referral">Hardship Referral &amp; Concession</option>
                    <option value="reminder">SMS / Email Payment Reminder</option>
                    <option value="call">Specialist Voice Contact</option>
                    <option value="escalate">Escalate to Legal / Third-Party</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Override Reason &amp; Specialist Justification <span className="text-brand-orange">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Customer requested email contact only; agreed to $400 settlement by Friday."
                    className="w-full text-xs p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOverrideModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={submittingAction}
                  disabled={!overrideReason.trim()}
                  onClick={handleOverrideSubmit}
                >
                  Confirm Override &amp; Log Audit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
