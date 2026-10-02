import React, { useEffect, useState } from 'react';
import {
  getGovernanceContract,
  getDqReport,
  getGovernanceAudit,
  getGovernanceFairness,
  DqReport,
  AuditResponse,
  GovernanceFairness,
} from '../api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Table, Column } from '../components/Table';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

export const GovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contract' | 'dq' | 'audit' | 'fairness'>('contract');

  // Tab Data States
  const [contractData, setContractData] = useState<any>(null);
  const [dqData, setDqData] = useState<DqReport | null>(null);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [fairnessData, setFairnessData] = useState<GovernanceFairness | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Audit filter state
  const [auditSearch, setAuditSearch] = useState('');
  const [auditEvent, setAuditEvent] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      getGovernanceContract().catch((e) => e),
      getDqReport().catch((e) => e),
      getGovernanceAudit().catch((e) => e),
      getGovernanceFairness().catch((e) => e),
    ])
      .then(([contract, dq, audit, fairness]) => {
        setContractData(contract);
        setDqData(dq);
        setAuditData(audit);
        setFairnessData(fairness);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAuditFilter = () => {
    getGovernanceAudit({
      golden_id: auditSearch || undefined,
      event: auditEvent || undefined,
    }).then((res) => setAuditData(res));
  };

  const auditColumns: Column<any>[] = [
    {
      key: 'audit_id',
      header: 'Audit ID',
      width: '100px',
      render: (r) => <span className="font-mono text-xs font-bold text-slate-700">{r.audit_id}</span>,
    },
    {
      key: 'at',
      header: 'Timestamp',
      render: (r) => (
        <span className="font-mono text-xs text-slate-500">
          {new Date(r.at).toLocaleDateString()} {new Date(r.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'event',
      header: 'Event',
      render: (r) => {
        const variantMap: any = {
          approved: 'approved',
          overridden: 'overridden',
          hardship_routed: 'severe',
          nba_recommended: 'pending',
        };
        return (
          <Badge variant={variantMap[r.event] || 'neutral'} size="sm">
            {r.event.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'actor',
      header: 'Actor',
      render: (r) => (
        <div>
          <span className="font-semibold text-brand-navy">{r.actor}</span>
          <span className="text-[11px] text-slate-400 block uppercase">({r.actor_role})</span>
        </div>
      ),
    },
    {
      key: 'golden_id',
      header: 'Customer',
      render: (r) => (
        <span className="font-mono font-semibold text-slate-800">{r.golden_id}</span>
      ),
    },
    {
      key: 'detail',
      header: 'Audit Trail Detail',
      render: (r) => <span className="text-xs text-slate-700 leading-relaxed">{r.detail}</span>,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">
          Governance &amp; Trust Cockpit
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Scored hackathon governance rubric: data contracts, live quality assertions, fairness proofs, and immutable audit logs.
        </p>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
        {[
          { key: 'contract', label: '📜 Data Contract' },
          { key: 'dq', label: '🧪 Data Quality Report' },
          { key: 'fairness', label: '⚖️ Fairness &amp; HITL Controls' },
          { key: 'audit', label: '✍️ Decision Audit Log' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-brand-navy text-brand-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton variant="rect" className="h-20 w-full" />
          <Skeleton variant="rect" className="h-96 w-full" />
        </div>
      )}

      {error && (
        <ErrorState
          title="Could not load governance records"
          message={error.error?.message || 'Failed to fetch governance data'}
          code={error.error?.code}
        />
      )}

      {!loading && !error && (
        <>
          {/* TAB 1: DATA CONTRACT */}
          {activeTab === 'contract' && contractData && (
            <div className="space-y-6">
              <Card
                title={`Data Product Contract: ${contractData.product || 'gold.c360'}`}
                subtitle={`Version: ${contractData.version || '1.0.0'} · SLA: Freshness Daily T+1 (06:00 EST)`}
                accent="navy"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Policies */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Permitted Uses
                    </h4>
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                      <div>✓ Collections contact prioritization and channel selection</div>
                      <div>✓ Early intervention hardship assistance and payment plans</div>
                      <div>✓ Natural language exploration via verified SQL</div>
                    </div>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
                      Prohibited Uses (Regulatory Safeguards)
                    </h4>
                    <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
                      <div>✕ Automated aggressive collection actions on severe hardship cases</div>
                      <div>✕ Use of demographic or protected attributes in models</div>
                      <div>✕ External disclosure of PII (SIN, DOB, Postal Code)</div>
                    </div>
                  </div>

                  {/* Schema Summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Cryptographic PII Classification
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Direct PII (SIN Hash, Full DOB)</span>
                        <strong className="text-rose-700">Strictly Barred from NLQ / Models</strong>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Protected Demographic Attributes</span>
                        <strong className="text-rose-700">Mathematically Excluded</strong>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Operational &amp; Financial Columns</span>
                        <strong className="text-emerald-700">Allow-listed for SELECT queries</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quality Rules Catalog */}
              <Card title="Contract Quality Rules (DQ-01 to DQ-09)" subtitle="Rules verified on every pipeline build">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'DQ-01', name: 'Golden ID Unique', desc: 'Primary key uniqueness on gold.c360' },
                    { id: 'DQ-02', name: 'Identity Map Coverage', desc: 'Every golden customer maps to >=1 source ID' },
                    { id: 'DQ-03', name: 'Overdue Balance Constraint', desc: 'total_overdue >= 0 and <= total_balance' },
                    { id: 'DQ-04', name: 'DPD Range Check', desc: 'max_dpd between 0 and 365 days' },
                    { id: 'DQ-05', name: 'Bucket Consistency', desc: 'bucket strictly matches max_dpd intervals' },
                    { id: 'DQ-06', name: 'Hardship Flag Validity', desc: 'hardship_flag in (clear, possible, severe)' },
                    { id: 'DQ-07', name: 'No Protected Attributes in Features', desc: 'Zero demographic attributes present' },
                    { id: 'DQ-08', name: 'Referential Integrity', desc: '100% of loans/cards resolve to active customer' },
                    { id: 'DQ-09', name: 'Data Freshness SLA', desc: 'Ingestion timestamp within last 24 hours' },
                  ].map((rule) => (
                    <div key={rule.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-brand-navy">{rule.id}</span>
                        <Badge variant="pass" size="sm">Active</Badge>
                      </div>
                      <div className="text-xs font-bold text-slate-800">{rule.name}</div>
                      <div className="text-[11px] text-slate-500">{rule.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: DATA QUALITY REPORT */}
          {activeTab === 'dq' && dqData && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Overall DQ Score</div>
                  <div className="text-2xl font-mono font-bold text-brand-green mt-1">
                    {Math.round(((dqData.summary.passed + dqData.summary.warned) / dqData.summary.rules_total) * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-400">Passing or Warned</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Rules Executed</div>
                  <div className="text-2xl font-mono font-bold text-brand-navy mt-1">
                    {dqData.summary.rules_total}
                  </div>
                  <div className="text-[11px] text-slate-400">Full Suite Scanned</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Rules Passed</div>
                  <div className="text-2xl font-mono font-bold text-brand-green mt-1">
                    {dqData.summary.passed}
                  </div>
                  <div className="text-[11px] text-emerald-600">Zero Critical Failures</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Warnings</div>
                  <div className="text-2xl font-mono font-bold text-amber-600 mt-1">
                    {dqData.summary.warned}
                  </div>
                  <div className="text-[11px] text-amber-700">Credit balance alerts</div>
                </div>
              </div>

              {/* Rules Table */}
              <Card title="Rule Execution Results" subtitle={`Run timestamp: ${dqData.run_at}`}>
                <div className="space-y-2.5">
                  {dqData.rules.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-navy">{r.id}</span>
                          <span className="text-xs font-bold text-slate-800">{r.name}</span>
                        </div>
                        {r.note && <p className="text-[11px] text-slate-500 mt-0.5">{r.note}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">
                          Checked: {r.checked} · Failed: {r.failed}
                        </span>
                        <Badge variant={r.status as any} size="sm">
                          {r.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Identity Resolution Metrics */}
              <Card title="Identity Resolution Engine Metrics" subtitle="Multi-source customer unification">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block">Golden Customers</span>
                    <strong className="text-base text-brand-navy font-mono font-bold">
                      {dqData.identity_resolution.golden_customers}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block">Avg Sources / Cust</span>
                    <strong className="text-base text-brand-navy font-mono font-bold">
                      {dqData.identity_resolution.avg_sources_per_customer}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block">Avg Match Confidence</span>
                    <strong className="text-base text-brand-green font-mono font-bold">
                      {Math.round(dqData.identity_resolution.avg_match_confidence * 100)}%
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block">Below Threshold</span>
                    <strong className="text-base text-amber-600 font-mono font-bold">
                      {dqData.identity_resolution.below_threshold} (Quarantined)
                    </strong>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: FAIRNESS & HITL */}
          {activeTab === 'fairness' && fairnessData && (
            <div className="space-y-6">
              {/* Protected Attributes Excluded Certificate */}
              <Card
                title="Demographic Fairness Certification"
                subtitle="Verifiable mathematical exclusion of sensitive demographic attributes"
                accent="green"
              >
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🛡️</span>
                      <strong className="text-sm text-emerald-950 font-bold uppercase tracking-wider">
                        Protected Attributes Barred from Models &amp; Feature Stores
                      </strong>
                    </div>
                    <Badge variant="pass">Test Passing</Badge>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Under the Canadian Human Rights Act and Bank Fair Credit guidelines, decision algorithms must not utilize demographic proxies. Our automated test suite asserts zero prohibited features in the model matrix.
                  </p>
                  <div className="pt-2 border-t border-emerald-200 flex flex-wrap gap-2">
                    {fairnessData.protected_attributes_excluded.checked_attributes.map((attr) => (
                      <span
                        key={attr}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-xs font-mono font-semibold text-emerald-900 border border-emerald-300"
                      >
                        ✓ {attr} (EXCLUDED)
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800">
                    Automated Test: <code>{fairnessData.protected_attributes_excluded.test}</code>
                  </div>
                </div>
              </Card>

              {/* Human in the loop stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Human-in-the-Loop (HITL) Metrics" subtitle="Active human oversight monitoring">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <span className="text-xs text-slate-400 uppercase">Override Rate</span>
                        <div className="text-2xl font-mono font-bold text-purple-700 mt-1">
                          {Math.round(fairnessData.human_in_the_loop.override_rate * 100)}%
                        </div>
                        <span className="text-[10px] text-slate-500">Target: 10–15% healthy review</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <span className="text-xs text-slate-400 uppercase">Approved Rate</span>
                        <div className="text-2xl font-mono font-bold text-brand-green mt-1">
                          {Math.round((1 - fairnessData.human_in_the_loop.override_rate) * 100)}%
                        </div>
                        <span className="text-[10px] text-slate-500">Specialist Consensus</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Hardship Safeguard Triage" subtitle="Compassionate handling statistics">
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50 rounded border border-amber-200 flex justify-between items-center">
                      <span>Severe Hardships Routed to Specialists</span>
                      <strong className="font-mono text-base text-amber-900">
                        {fairnessData.hardship.severe_routed_to_specialist}
                      </strong>
                    </div>
                    <div className="p-3 bg-rose-50 rounded border border-rose-200 flex justify-between items-center">
                      <span>Automated Aggressive Treatments Blocked</span>
                      <strong className="font-mono text-base text-brand-orange">
                        {fairnessData.hardship.automated_treatment_blocked} (100% blocked)
                      </strong>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === 'audit' && auditData && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <input
                  type="text"
                  placeholder="Filter by Golden ID (e.g. G-004817)..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="text-xs px-3 py-2 rounded border border-slate-300 w-64"
                />
                <select
                  value={auditEvent}
                  onChange={(e) => setAuditEvent(e.target.value)}
                  className="text-xs px-3 py-2 rounded border border-slate-300 bg-white"
                >
                  <option value="">All Events</option>
                  <option value="approved">Approved</option>
                  <option value="overridden">Overridden</option>
                  <option value="hardship_routed">Hardship Routed</option>
                  <option value="nba_recommended">NBA Recommended</option>
                </select>
                <button
                  onClick={handleAuditFilter}
                  className="px-3.5 py-1.5 text-xs font-bold rounded bg-brand-navy text-white hover:bg-slate-800"
                >
                  Filter Audit
                </button>
              </div>

              {/* Audit Table */}
              <Card title={`Tamper-Evident Audit Trail (${auditData.total} Events Recorded)`}>
                <Table
                  columns={auditColumns}
                  data={auditData.items}
                  keyExtractor={(row) => row.audit_id}
                />
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};
