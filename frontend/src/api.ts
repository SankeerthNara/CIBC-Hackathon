/**
 * Apex Collections 360 - Frontend API Client Layer
 * Strictly adheres to /contracts/api.md.
 * 
 * Supports:
 * - VITE_USE_MOCK flag (defaults to true) reading directly from /contracts/mock/*.json
 * - VITE_API_BASE (defaults to http://localhost:8000)
 * - X-User-Role header support ('agent' | 'specialist' | 'supervisor')
 * - Full mock simulation of errors, 409 hardship specialist checks, and state mutations
 */

// Import static mock contract payloads
import mockC360Raw from '@contracts/mock/c360.json';
import mockAskRaw from '@contracts/mock/ask.json';
import mockNbaQueueRaw from '@contracts/mock/nba_queue.json';
import mockNbaDetailRaw from '@contracts/mock/nba_detail.json';
import mockAuditRaw from '@contracts/mock/governance_audit.json';
import mockContractRaw from '@contracts/mock/governance_contract.json';
import mockDqRaw from '@contracts/mock/dq_report.json';
import mockFairnessRaw from '@contracts/mock/governance_fairness.json';
import mockTranscriptsRaw from '@contracts/mock/transcripts.json';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export type UserRole = 'agent' | 'specialist' | 'supervisor';

let currentUserRole: UserRole = (localStorage.getItem('apex_user_role') as UserRole) || 'agent';
let currentUserId: string = localStorage.getItem('apex_user_id') || 'AG-0620';

export function getUserRole(): UserRole {
  return currentUserRole;
}

export function setUserRole(role: UserRole): void {
  currentUserRole = role;
  localStorage.setItem('apex_user_role', role);
}

export function getUserId(): string {
  return currentUserId;
}

export function setUserId(id: string): void {
  currentUserId = id;
  localStorage.setItem('apex_user_id', id);
}

// ----------------------------------------------------------------------
// DATA TYPES DERIVED STRICTLY FROM /contracts/api.md
// ----------------------------------------------------------------------

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface CustomerProduct {
  product: string;
  account_mask: string;
  balance: number;
  overdue_amount: number;
  dpd: number;
  status: string;
  credit_limit?: number;
  interest_rate?: number;
}

export interface ContactTimelineItem {
  contact_id: string;
  contact_at: string;
  channel: 'call' | 'sms' | 'email' | 'app';
  direction: 'inbound' | 'outbound';
  outcome: string;
  summary: string;
  agent_id: string;
  transcript_id?: string;
}

export interface IdentitySource {
  system: string;
  source_id: string;
  match_confidence: number;
}

export interface CustomerQualityCheck {
  field: string;
  rule: string;
  status: 'pass' | 'warn' | 'fail';
  lineage: string;
  refreshed_at: string;
}

export interface CustomerC360 {
  golden_id: string;
  display_name: string;
  segment: string;
  province: string;
  preferred_language: string;
  customer_since: string;
  consent: {
    call: boolean;
    sms: boolean;
    email: boolean;
  };
  summary: {
    card_count: number;
    loan_count: number;
    deposit_count: number;
    total_balance: number;
    total_overdue: number;
    has_credit_balance: boolean;
    max_dpd: number;
    bucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';
    hardship_flag: 'clear' | 'possible' | 'severe';
    last_contact_at: string | null;
    refreshed_at: string;
  };
  products: CustomerProduct[];
  contact_timeline: ContactTimelineItem[];
  identity: {
    match_confidence: number;
    review_required: boolean;
    sources: IdentitySource[];
  };
  quality: CustomerQualityCheck[];
  break_prob?: number;
  current_decision_id?: string;
}

export interface TranscriptTurn {
  speaker: 'agent' | 'customer';
  text: string;
}

export interface TranscriptDetail {
  transcript_id: string;
  golden_id: string;
  contact_id: string;
  date: string;
  channel: string;
  agent_id: string;
  duration_sec: number;
  turns: TranscriptTurn[];
  summary: string;
  llm_features: {
    hardship_signal?: 'clear' | 'possible' | 'severe';
    stated_delay_reason?: string;
    ptp_intent_strength?: number;
  };
}

export interface UnderstoodToken {
  token: string;
  kind: 'filter' | 'time_window' | 'sort' | 'limit' | 'source';
  editable: boolean;
}

export interface Citation {
  source_type: string;
  source_id: string;
  golden_id: string;
  snippet: string;
  date: string;
}

export interface AskRequest {
  question: string;
  context?: {
    golden_id?: string | null;
  };
}

export interface AskResponse {
  question: string;
  answer: string | null;
  sql: string | null;
  tables_used: string[];
  understood_as: UnderstoodToken[];
  columns: string[];
  rows: any[][];
  row_count: number;
  followups: string[];
  citations: Citation[];
  refused: boolean;
  refusal_reason: string | null;
  route: 'sql' | 'rag' | 'both' | 'refused';
}

export interface NbaQueueItem {
  decision_id: string;
  golden_id: string;
  display_name: string;
  products: string[];
  bucket: string;
  max_dpd: number;
  total_overdue: number;
  break_prob: number;
  top_reason: string;
  treatment: 'reminder' | 'call' | 'payment_plan' | 'hardship_referral' | 'escalate';
  channel: 'call' | 'sms' | 'email' | 'app';
  recommended_time: string;
  requires_specialist: boolean;
  status: 'pending' | 'approved' | 'overridden';
  hardship_flag: 'clear' | 'possible' | 'severe';
}

export interface NbaQueueParams {
  status?: 'pending' | 'approved' | 'overridden';
  treatment?: string;
  hardship_only?: boolean;
  page?: number;
  page_size?: number;
}

export interface NbaQueueResponse {
  items: NbaQueueItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface NbaDriver {
  feature: string;
  value: any;
  direction: 'increases_risk' | 'decreases_risk';
  plain_english: string;
}

export interface NbaDetail {
  decision_id: string;
  golden_id: string;
  display_name: string;
  bucket: string;
  max_dpd: number;
  break_prob: number;
  treatment: string;
  channel: string;
  recommended_time: string;
  requires_specialist: boolean;
  status: string;
  hardship_flag: string;
  explanation: string;
  drivers: NbaDriver[];
  consent: {
    call: boolean;
    sms: boolean;
    email: boolean;
  };
  model_version: string;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  final_treatment: string | null;
  override_reason: string | null;
}

export type NbaDecisionRequest =
  | { action: 'approve' }
  | { action: 'override'; reason: string; new_treatment: string };

export interface NbaDecisionResponse {
  decision_id: string;
  status: 'approved' | 'overridden';
  final_treatment: string;
  reviewed_by: string;
  reviewed_at: string;
  override_reason?: string | null;
  audit_id: string;
}

export interface AuditItem {
  audit_id: string;
  at: string;
  event: 'nba_recommended' | 'hardship_routed' | 'approved' | 'overridden';
  decision_id: string;
  golden_id: string;
  actor: string;
  actor_role: string;
  model_version: string;
  detail: string;
  outcome: string;
}

export interface AuditParams {
  decision_id?: string;
  golden_id?: string;
  event?: string;
  page?: number;
  page_size?: number;
}

export interface AuditResponse {
  items: AuditItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface DqRule {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail';
  checked: number;
  failed: number;
  note?: string;
}

export interface DqReport {
  dataset: string;
  run_at: string;
  contract_version: string;
  summary: {
    rules_total: number;
    passed: number;
    warned: number;
    failed: number;
  };
  row_counts: {
    raw: Record<string, number>;
    curated: Record<string, number>;
    gold: Record<string, number>;
  };
  rules: DqRule[];
  schema_drift: Array<{
    table: string;
    change: string;
    column: string;
    severity: string;
  }>;
  identity_resolution: {
    golden_customers: number;
    avg_sources_per_customer: number;
    avg_match_confidence: number;
    below_threshold: number;
  };
}

export interface GovernanceFairness {
  model_version: string;
  protected_attributes_excluded: {
    status: string;
    checked_attributes: string[];
    features_in_model: string[];
    test: string;
    last_run: string;
  };
  human_in_the_loop: {
    decisions_total: number;
    pending: number;
    approved: number;
    overridden: number;
    override_rate: number;
  };
  hardship: {
    severe_routed_to_specialist: number;
    possible_flagged_for_agent_review: number;
    automated_treatment_blocked: number;
  };
  segment_outcomes: Array<{
    segment: string;
    customers: number;
    avg_break_prob: number;
    aggressive_treatment_rate: number;
  }>;
}

export interface HealthResponse {
  status: string;
  db: string;
  contract_version: string;
}

// ----------------------------------------------------------------------
// MOCK STATE (MUTABLE IN-MEMORY FOR DEMO INTERACTIONS)
// ----------------------------------------------------------------------

const mockC360Store: Record<string, CustomerC360> = { ...(mockC360Raw as any) };
const mockTranscriptsStore: Record<string, TranscriptDetail> = { ...(mockTranscriptsRaw as any) };
const mockNbaDetailStore: Record<string, NbaDetail> = { ...(mockNbaDetailRaw as any) };
let mockNbaQueueItems: NbaQueueItem[] = [...((mockNbaQueueRaw as any).items || [])];
let mockAuditItems: AuditItem[] = [...((mockAuditRaw as any).items || [])];

// Helper for HTTP requests
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('X-User-Role', currentUserRole);
  headers.set('X-User-Id', currentUserId);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({
      error: { code: 'unknown_error', message: res.statusText },
    }));
    throw errorBody;
  }

  return res.json();
}

// ----------------------------------------------------------------------
// TYPED API FUNCTIONS
// ----------------------------------------------------------------------

/**
 * GET /customers/{golden_id}/c360
 */
export async function getCustomerC360(goldenId: string): Promise<CustomerC360> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const customer = mockC360Store[goldenId];
    if (!customer) {
      // If requested id not found, fallback to first available or error
      const keys = Object.keys(mockC360Store);
      if (keys.length > 0 && goldenId.toLowerCase() === 'default') {
        return mockC360Store[keys[0]];
      }
      throw {
        error: {
          code: 'not_found',
          message: `Customer ${goldenId} not found in C360 Golden Record`,
        },
      } as ApiError;
    }
    return JSON.parse(JSON.stringify(customer));
  }

  return request<CustomerC360>(`/customers/${encodeURIComponent(goldenId)}/c360`);
}

/**
 * GET /transcripts/{transcript_id}
 */
export async function getTranscript(transcriptId: string): Promise<TranscriptDetail> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const transcript = mockTranscriptsStore[transcriptId];
    if (!transcript) {
      throw {
        error: {
          code: 'not_found',
          message: `Transcript ${transcriptId} not found`,
        },
      } as ApiError;
    }
    return JSON.parse(JSON.stringify(transcript));
  }

  return request<TranscriptDetail>(`/transcripts/${encodeURIComponent(transcriptId)}`);
}

/**
 * POST /ask
 */
export async function askQuestion(req: AskRequest): Promise<AskResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const qLower = req.question.toLowerCase();

    // Check for out-of-scope / protected attributes -> trigger refusal mock
    if (
      qLower.includes('sin') ||
      qLower.includes('birth') ||
      qLower.includes('dob') ||
      qLower.includes('gender') ||
      qLower.includes('ethnicity') ||
      qLower.includes('race') ||
      qLower.includes('religion') ||
      qLower.includes('marital') ||
      qLower.includes('postal code') ||
      qLower.includes('drop table') ||
      qLower.includes('delete') ||
      qLower.includes('weather') ||
      qLower.includes('salary')
    ) {
      return JSON.parse(JSON.stringify((mockAskRaw as any).refused));
    }

    // Check for conversational / qualitative transcript query -> RAG mock
    if (
      qLower.includes('why') ||
      qLower.includes('say') ||
      qLower.includes('job') ||
      qLower.includes('transcript') ||
      qLower.includes('note') ||
      qLower.includes('reason') ||
      qLower.includes('hardship')
    ) {
      return JSON.parse(JSON.stringify((mockAskRaw as any).rag_answer));
    }

    // Default SQL route mock
    const resp = JSON.parse(JSON.stringify((mockAskRaw as any).answered));
    resp.question = req.question;
    return resp;
  }

  return request<AskResponse>('/ask', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

/**
 * GET /nba/queue
 */
export async function getNbaQueue(params?: NbaQueueParams): Promise<NbaQueueResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let items = [...mockNbaQueueItems];

    if (params?.status) {
      items = items.filter((i) => i.status === params.status);
    }
    if (params?.treatment) {
      items = items.filter((i) => i.treatment === params.treatment);
    }
    if (params?.hardship_only) {
      items = items.filter((i) => i.hardship_flag === 'severe' || i.hardship_flag === 'possible');
    }

    const page = params?.page || 1;
    const pageSize = params?.page_size || 50;
    const start = (page - 1) * pageSize;
    const paginated = items.slice(start, start + pageSize);

    return {
      items: paginated,
      total: items.length,
      page,
      page_size: pageSize,
    };
  }

  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set('status', params.status);
  if (params?.treatment) queryParams.set('treatment', params.treatment);
  if (params?.hardship_only !== undefined) queryParams.set('hardship_only', String(params.hardship_only));
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.page_size) queryParams.set('page_size', String(params.page_size));

  return request<NbaQueueResponse>(`/nba/queue?${queryParams.toString()}`);
}

/**
 * GET /nba/{decision_id}
 */
export async function getNbaDetail(decisionId: string): Promise<NbaDetail> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const detail = mockNbaDetailStore[decisionId];
    if (!detail) {
      throw {
        error: {
          code: 'not_found',
          message: `Decision ${decisionId} not found`,
        },
      } as ApiError;
    }
    return JSON.parse(JSON.stringify(detail));
  }

  return request<NbaDetail>(`/nba/${encodeURIComponent(decisionId)}`);
}

/**
 * POST /nba/{decision_id}/decision
 */
export async function submitNbaDecision(
  decisionId: string,
  decision: NbaDecisionRequest
): Promise<NbaDecisionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const item = mockNbaQueueItems.find((i) => i.decision_id === decisionId);
    const detail = mockNbaDetailStore[decisionId];

    // Check hardship role authorization:
    // If requires_specialist is true and currentUserRole !== 'specialist' -> return 409
    if ((item?.requires_specialist || detail?.requires_specialist) && currentUserRole !== 'specialist') {
      throw {
        error: {
          code: 'hardship_requires_specialist',
          message: 'This decision involves a severe hardship case and must be reviewed by an accredited specialist.',
          details: {
            decision_id: decisionId,
            required_role: 'specialist',
            actor_role: currentUserRole,
          },
        },
      } as ApiError;
    }

    if (decision.action === 'override' && !decision.reason?.trim()) {
      throw {
        error: {
          code: 'reason_required',
          message: 'An override reason is mandatory for audit compliance.',
        },
      } as ApiError;
    }

    // Update in-memory state
    const finalTreatment = decision.action === 'override' ? decision.new_treatment : (item?.treatment || 'payment_plan');
    const newStatus = decision.action === 'override' ? 'overridden' : 'approved';
    const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    if (item) {
      item.status = newStatus;
    }
    if (detail) {
      detail.status = newStatus;
      detail.reviewed_by = currentUserId;
      detail.reviewed_at = nowIso;
      detail.final_treatment = finalTreatment;
      if (decision.action === 'override') {
        detail.override_reason = decision.reason;
      }
    }

    // Add to audit trail
    mockAuditItems.unshift({
      audit_id: auditId,
      at: nowIso,
      event: decision.action === 'override' ? 'overridden' : 'approved',
      decision_id: decisionId,
      golden_id: item?.golden_id || detail?.golden_id || 'UNKNOWN',
      actor: currentUserId,
      actor_role: currentUserRole,
      model_version: detail?.model_version || '2026.10.02-a',
      detail: decision.action === 'override'
        ? `Override: ${decision.new_treatment}. Reason: ${decision.reason}`
        : `Approved recommended treatment: ${finalTreatment}`,
      outcome: newStatus,
    });

    return {
      decision_id: decisionId,
      status: newStatus,
      final_treatment: finalTreatment,
      reviewed_by: currentUserId,
      reviewed_at: nowIso,
      override_reason: decision.action === 'override' ? decision.reason : null,
      audit_id: auditId,
    };
  }

  return request<NbaDecisionResponse>(`/nba/${encodeURIComponent(decisionId)}/decision`, {
    method: 'POST',
    body: JSON.stringify(decision),
  });
}

/**
 * GET /governance/audit
 */
export async function getGovernanceAudit(params?: AuditParams): Promise<AuditResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let items = [...mockAuditItems];

    if (params?.decision_id) {
      items = items.filter((i) => i.decision_id.toLowerCase().includes(params.decision_id!.toLowerCase()));
    }
    if (params?.golden_id) {
      items = items.filter((i) => i.golden_id.toLowerCase().includes(params.golden_id!.toLowerCase()));
    }
    if (params?.event) {
      items = items.filter((i) => i.event === params.event);
    }

    const page = params?.page || 1;
    const pageSize = params?.page_size || 50;
    const start = (page - 1) * pageSize;

    return {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      page_size: pageSize,
    };
  }

  const queryParams = new URLSearchParams();
  if (params?.decision_id) queryParams.set('decision_id', params.decision_id);
  if (params?.golden_id) queryParams.set('golden_id', params.golden_id);
  if (params?.event) queryParams.set('event', params.event);
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.page_size) queryParams.set('page_size', String(params.page_size));

  return request<AuditResponse>(`/governance/audit?${queryParams.toString()}`);
}

/**
 * GET /governance/contract
 */
export async function getGovernanceContract(): Promise<any> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return JSON.parse(JSON.stringify(mockContractRaw));
  }

  return request<any>('/governance/contract');
}

/**
 * GET /dq/report
 */
export async function getDqReport(): Promise<DqReport> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return JSON.parse(JSON.stringify(mockDqRaw));
  }

  return request<DqReport>('/dq/report');
}

/**
 * GET /governance/fairness
 */
export async function getGovernanceFairness(): Promise<GovernanceFairness> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return JSON.parse(JSON.stringify(mockFairnessRaw));
  }

  return request<GovernanceFairness>('/governance/fairness');
}

/**
 * GET /health
 */
export async function getHealth(): Promise<HealthResponse> {
  if (USE_MOCK) {
    return {
      status: 'ok',
      db: 'mock:contracts/mock/*.json',
      contract_version: '1.0.0',
    };
  }

  return request<HealthResponse>('/health');
}

/**
 * Helper to get all known customer IDs in mock
 */
export function getMockCustomerList(): Array<{ golden_id: string; display_name: string; bucket: string; hardship_flag: string }> {
  return Object.values(mockC360Store).map((c) => ({
    golden_id: c.golden_id,
    display_name: c.display_name,
    bucket: c.summary.bucket,
    hardship_flag: c.summary.hardship_flag,
  }));
}
