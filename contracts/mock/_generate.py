"""Regenerates the mock JSON files in this folder. Run from repo root: python contracts/mock/_generate.py
Keeps the 10 mock customers consistent across every endpoint. Mock "today" = 2026-10-02."""
import json, yaml

OUT = 'contracts/mock'


def w(name, obj):
    with open(f'{OUT}/{name}.json', 'w', encoding='utf-8', newline='\n') as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)


def bucket(d):
    return 'current' if d == 0 else '1-30' if d <= 30 else '31-60' if d <= 60 else '61-90' if d <= 90 else '90+'


TZ = {'ON': '-04:00', 'QC': '-04:00', 'NS': '-03:00', 'BC': '-07:00', 'AB': '-06:00', 'MB': '-05:00'}
REFRESH = '2026-10-02T06:00:00-04:00'
MV = '2026.10.02-a'

# product tuple: (label, mask, kind, balance, overdue, dpd, status, credit_limit)
C = [
    dict(id='G-004817', name='R. Mitchell', seg='hourly_wage', prov='ON', lang='EN', since='2016-03-14', cons=(True, True, True),
         prods=[('Credit card (Visa)', '****4417', 'card', 8430.00, 452.00, 28, 'delinquent', 10000.0),
                ('Personal loan', '****9921', 'loan', 18650.00, 1160.00, 34, 'delinquent', None),
                ('Chequing', '****7738', 'deposit', 234.00, 0, 0, 'current', None)],
         hard='severe', match=0.97, last='2026-09-25T14:12:00', prob=0.81, reason='Payroll deposit missing for 14 days',
         treat='hardship_referral', ch='call', time='2026-10-03T10:00:00',
         drivers=[('payroll_delay_days', 29, 'increases_risk', 'No payroll deposit for 29 days'),
                  ('hardship_signal', 'severe', 'increases_risk', 'Customer said shifts were cut at the plant in August'),
                  ('ptp_broken_count_90d', 1, 'increases_risk', 'One promise to pay broken in the last 90 days')],
         expl='Hardship signals in the last call and a missed payroll deposit. Route to a hardship specialist; do not apply automated collection pressure.',
         tl=[('2026-09-25T14:12:00', 'call', 'outbound', 'promise_made', 'New PTP $800 by 2 Oct, agent A. Roy', 'AG-0842', 'T-8843'),
             ('2026-09-18T11:05:00', 'sms', 'outbound', 'delivered_no_response', 'Payment reminder delivered', None, None),
             ('2026-09-15T08:00:00', 'call', 'outbound', 'no_answer', 'PTP of $1,000 not received; call attempt, no answer', 'AG-0711', None),
             ('2026-09-12T16:40:00', 'call', 'outbound', 'promise_made', 'Shifts cut at the plant in August; PTP $1,000 by 15 Sep', 'AG-0711', 'T-8812')]),
    dict(id='G-011203', name='S. Tremblay', seg='salaried', prov='QC', lang='FR', since='2012-08-02', cons=(True, False, True),
         prods=[('Credit card (Mastercard)', '****2260', 'card', 11200.00, 2250.00, 41, 'delinquent', 12000.0),
                ('Chequing', '****1184', 'deposit', 812.00, 0, 0, 'current', None)],
         hard='clear', match=0.95, last='2026-09-27T10:30:00', prob=0.78, reason='Card utilisation at 93% with two missed payments',
         treat='call', ch='call', time='2026-10-03T09:30:00',
         drivers=[('card_utilisation', 0.93, 'increases_risk', 'Card is at 93% of its limit'),
                  ('dpd_max_current', 41, 'increases_risk', '41 days past due'),
                  ('sms_response_rate_30d', 0.0, 'increases_risk', 'No response to SMS in 30 days; a call is more likely to reach them')],
         expl='High utilisation and 41 DPD with no SMS response. Call in French in the morning window; customer has not consented to SMS.',
         tl=[('2026-09-27T10:30:00', 'call', 'outbound', 'no_answer', 'No answer, voicemail left in French', 'AG-0620', None),
             ('2026-09-20T09:00:00', 'email', 'outbound', 'delivered_no_response', 'Statement reminder sent', None, None)]),
    dict(id='G-007741', name='A. Nguyen', seg='self_employed', prov='ON', lang='EN', since='2019-01-21', cons=(True, True, True),
         prods=[('Personal loan', '****3305', 'loan', 14500.00, 1900.00, 52, 'delinquent', None),
                ('Chequing', '****6612', 'deposit', 96.00, 0, 0, 'current', None)],
         hard='possible', match=0.88, last='2026-09-29T15:20:00', prob=0.74, reason='Irregular deposits and income drop',
         treat='payment_plan', ch='call', time='2026-10-03T13:00:00',
         drivers=[('stated_delay_reason', 'reduced_income', 'increases_risk', 'Said business income dropped this quarter'),
                  ('dpd_max_current', 52, 'increases_risk', '52 days past due'),
                  ('ptp_intent_strength', 0.55, 'increases_risk', 'Moderate intent to pay on the last call')],
         expl='Self-reported income drop and 52 DPD. A reduced-payment plan is more likely to be kept than a full-amount demand. Possible hardship: agent review required, specialist optional.',
         tl=[('2026-09-29T15:20:00', 'call', 'inbound', 'right_party_contact', 'Customer called; income dropped this quarter, asked about options', 'AG-0842', 'T-8901')]),
    dict(id='G-020915', name='P. Gagnon', seg='salaried', prov='QC', lang='FR', since='2014-06-09', cons=(True, True, False),
         prods=[('Credit card (Visa)', '****5589', 'card', 6400.00, 640.00, 29, 'delinquent', 9000.0)],
         hard='clear', match=0.99, last='2026-09-26T09:10:00', prob=0.69, reason='Missed last two statement payments',
         treat='reminder', ch='sms', time='2026-10-02T18:00:00',
         drivers=[('dpd_max_current', 29, 'increases_risk', '29 days past due'),
                  ('sms_response_rate_30d', 0.6, 'decreases_risk', 'Usually responds to SMS'),
                  ('days_since_last_contact', 6, 'decreases_risk', 'Contacted 6 days ago')],
         expl='Near the 30-day boundary and responsive to SMS. A reminder this evening may prevent a roll to the next bucket.',
         tl=[('2026-09-26T09:10:00', 'sms', 'outbound', 'delivered_no_response', 'Payment reminder delivered', None, None)]),
    dict(id='G-003318', name='M. Roy', seg='salaried', prov='QC', lang='FR', since='2018-11-30', cons=(True, True, True),
         prods=[('Auto loan', '****7710', 'loan', 22100.00, 3100.00, 67, 'delinquent', None),
                ('Chequing', '****4402', 'deposit', 1450.00, 0, 0, 'current', None)],
         hard='clear', match=0.93, last='2026-09-30T11:00:00', prob=0.66, reason='Two missed instalments, balance available in chequing',
         treat='call', ch='call', time='2026-10-03T11:00:00',
         drivers=[('dpd_max_current', 67, 'increases_risk', '67 days past due'),
                  ('deposit_balance', 1450, 'decreases_risk', 'Chequing holds enough to cover one instalment'),
                  ('ptp_broken_count_90d', 0, 'decreases_risk', 'No broken promises in the last 90 days')],
         expl='Customer has funds but is 67 DPD with no broken promises. A call to arrange a catch-up payment is likely to succeed.',
         tl=[('2026-09-30T11:00:00', 'call', 'outbound', 'no_answer', 'No answer', 'AG-0620', None)]),
    dict(id='G-016672', name='K. MacDonald', seg='hourly_wage', prov='NS', lang='EN', since='2017-04-18', cons=(False, True, True),
         prods=[('Personal loan', '****8841', 'loan', 9800.00, 1450.00, 38, 'delinquent', None)],
         hard='clear', match=0.91, last='2026-09-28T13:45:00', prob=0.63, reason='No consent for calls; prior SMS responses positive',
         treat='reminder', ch='sms', time='2026-10-03T12:00:00',
         drivers=[('consent_call', False, 'decreases_risk', 'Calls not permitted; SMS used instead'),
                  ('sms_response_rate_30d', 0.5, 'decreases_risk', 'Responds to half of SMS'),
                  ('dpd_max_current', 38, 'increases_risk', '38 days past due')],
         expl='Calls are not permitted. SMS with a payment link at noon matches when the customer usually responds.',
         tl=[('2026-09-28T13:45:00', 'sms', 'outbound', 'delivered_no_response', 'Reminder delivered', None, None)]),
    dict(id='G-009024', name='V. Chen', seg='salaried', prov='BC', lang='EN', since='2020-02-11', cons=(True, True, True),
         prods=[('Credit card (Visa)', '****3092', 'card', 7600.00, 1600.00, 45, 'delinquent', 8000.0),
                ('Chequing', '****5517', 'deposit', 301.00, 0, 0, 'current', None)],
         hard='clear', match=0.84, last='2026-09-24T16:00:00', prob=0.61, reason='Bureau score dropped 42 points in 90 days',
         treat='payment_plan', ch='call', time='2026-10-03T14:00:00',
         drivers=[('bureau_score_delta_90d', -42, 'increases_risk', 'Bureau score down 42 points'),
                  ('card_utilisation', 0.95, 'increases_risk', 'Card is at 95% of its limit'),
                  ('dpd_max_current', 45, 'increases_risk', '45 days past due')],
         expl='Falling bureau score and a maxed card. Offer a structured payment plan before further deterioration. Match confidence is 0.84, so verify identity on the call.',
         tl=[('2026-09-24T16:00:00', 'call', 'outbound', 'right_party_contact', 'Spoke to customer, will review budget', 'AG-0711', 'T-8870')]),
    dict(id='G-012890', name='T. Campbell', seg='self_employed', prov='AB', lang='EN', since='2015-09-05', cons=(True, True, True),
         prods=[('Line of credit', '****6075', 'loan', 12500.00, 1250.00, 33, 'delinquent', None)],
         hard='clear', match=0.96, last='2026-09-29T10:20:00', prob=0.60, reason='Seasonal income pattern, last promise kept',
         treat='reminder', ch='email', time='2026-10-03T09:00:00',
         drivers=[('ptp_broken_count_90d', 0, 'decreases_risk', 'Kept the last promise'),
                  ('dpd_max_current', 33, 'increases_risk', '33 days past due'),
                  ('days_since_last_contact', 3, 'decreases_risk', 'Contacted 3 days ago')],
         expl='Recently engaged and kept the last promise. A light email reminder is proportionate; no call needed.',
         tl=[('2026-09-29T10:20:00', 'call', 'outbound', 'payment_made', 'Partial payment of $400 received', 'AG-0620', 'T-8895')]),
    dict(id='G-015530', name='J. Singh', seg='salaried', prov='ON', lang='EN', since='2021-07-23', cons=(True, True, True),
         prods=[('Credit card (Visa)', '****1120', 'card', 1200.00, 0, 0, 'current', 6000.0),
                ('Chequing', '****9034', 'deposit', 4300.00, 0, 0, 'current', None)],
         hard='clear', match=0.99, last='2026-08-05T09:00:00', prob=0.12, reason='Account current, strong deposits',
         treat='reminder', ch='app', time='2026-10-04T09:00:00',
         drivers=[('dpd_max_current', 0, 'decreases_risk', 'Account is current'),
                  ('payroll_delay_days', 0, 'decreases_risk', 'Salary deposited on time'),
                  ('card_utilisation', 0.2, 'decreases_risk', 'Card at 20% of its limit')],
         expl='Low risk. Only a gentle in-app reminder ahead of the statement date.',
         tl=[('2026-08-05T09:00:00', 'app', 'outbound', 'delivered_no_response', 'Push notification opened, no action needed', None, None)]),
    dict(id='G-018264', name='L. Okafor', seg='hourly_wage', prov='MB', lang='EN', since='2022-10-17', cons=(True, False, True),
         prods=[('Credit card (Mastercard)', '****7843', 'card', 3100.00, 180.00, 12, 'delinquent', 5000.0),
                ('Chequing', '****2276', 'deposit', -45.00, 0, 0, 'current', None)],
         hard='clear', match=0.90, last='2026-09-30T17:30:00', prob=0.34, reason='Early delinquency, overdraft on chequing',
         treat='reminder', ch='call', time='2026-10-03T17:00:00',
         drivers=[('dpd_max_current', 12, 'increases_risk', '12 days past due'),
                  ('deposit_balance', -45, 'increases_risk', 'Chequing is overdrawn'),
                  ('ptp_broken_count_90d', 0, 'decreases_risk', 'No broken promises')],
         expl='Early stage; a friendly call after work hours can resolve it before it rolls. Overdraft noted.',
         tl=[('2026-09-30T17:30:00', 'sms', 'outbound', 'bounced', 'SMS not sent: no SMS consent', None, None)]),
]

c360, queue, detail, audit = {}, [], {}, []
for i, c in enumerate(C, 1):
    gid, tz = c['id'], TZ[c['prov']]
    dpd = max(p[5] for p in c['prods'])
    bk = bucket(dpd)
    cards = [p for p in c['prods'] if p[2] == 'card']
    loans = [p for p in c['prods'] if p[2] == 'loan']
    deps = [p for p in c['prods'] if p[2] == 'deposit']
    credit = [p for p in c['prods'] if p[2] != 'deposit']
    tb = round(sum(p[3] for p in credit), 2)
    to = round(sum(p[4] for p in c['prods']), 2)
    srcs = []
    if cards: srcs.append({'system': 'cards', 'source_id': f'C-{88000 + i * 13}'})
    if loans: srcs.append({'system': 'loans', 'source_id': f'L-{553000 + i * 17}'})
    if deps: srcs.append({'system': 'deposits', 'source_id': f'DEP-{7700 + i * 11}'})
    srcs += [{'system': 'crm', 'source_id': f'CRM-{1100 + i * 7}'}, {'system': 'collections', 'source_id': f'COL-{4000 + i * 19}'}]
    for s in srcs:
        s['match_confidence'] = round(min(1.0, c['match'] + (0.02 if s['system'] == 'crm' else 0)), 2)
    did = f'NBA-{i:04d}'
    spec = c['hard'] == 'severe'
    c360[gid] = {
        'golden_id': gid, 'display_name': c['name'], 'segment': c['seg'], 'province': c['prov'],
        'preferred_language': c['lang'], 'customer_since': c['since'],
        'consent': {'call': c['cons'][0], 'sms': c['cons'][1], 'email': c['cons'][2]},
        'summary': {'card_count': len(cards), 'loan_count': len(loans), 'deposit_count': len(deps),
                    'total_balance': tb, 'total_overdue': to,
                    'has_credit_balance': any(p[3] < 0 for p in credit), 'max_dpd': dpd, 'bucket': bk,
                    'hardship_flag': c['hard'], 'last_contact_at': c['last'] + tz, 'refreshed_at': REFRESH},
        'products': [{'product': p[0], 'account_mask': p[1], 'balance': p[3], 'overdue_amount': p[4],
                      'dpd': p[5], 'status': p[6], 'credit_limit': p[7]} for p in c['prods']],
        'contact_timeline': [{'contact_id': f'CT-{i}{j:02d}', 'contact_at': t[0] + tz, 'channel': t[1], 'direction': t[2],
                              'outcome': t[3], 'summary': t[4], 'agent_id': t[5], 'transcript_id': t[6]}
                             for j, t in enumerate(c['tl'], 1)],
        'identity': {'match_confidence': c['match'], 'sources': srcs, 'review_required': c['match'] < 0.8},
        'quality': [
            {'field': 'max_dpd', 'rule': 'DQ-04', 'status': 'pass', 'lineage': 'cards/loans dpd', 'refreshed_at': REFRESH},
            {'field': 'hardship_flag', 'rule': 'LLM feature v1 (eval accuracy 0.85)', 'status': 'pass', 'lineage': 'agent_notes, call_transcripts', 'refreshed_at': REFRESH},
            {'field': 'match_confidence', 'rule': 'DQ-07 / DQ-09', 'status': 'pass' if c['match'] >= 0.8 else 'warn', 'lineage': 'identity_map', 'refreshed_at': REFRESH}],
        'break_prob': c['prob'], 'current_decision_id': did}
    item = {'decision_id': did, 'golden_id': gid, 'display_name': c['name'],
            'products': [p[0].split(' (')[0] for p in credit], 'bucket': bk, 'max_dpd': dpd, 'total_overdue': to,
            'break_prob': c['prob'], 'top_reason': c['reason'], 'treatment': c['treat'], 'channel': c['ch'],
            'recommended_time': c['time'] + tz, 'requires_specialist': spec, 'status': 'pending', 'hardship_flag': c['hard']}
    queue.append(item)
    detail[did] = {**item, 'explanation': c['expl'],
                   'drivers': [{'feature': d[0], 'value': d[1], 'direction': d[2], 'plain_english': d[3]} for d in c['drivers']],
                   'consent': c360[gid]['consent'], 'model_version': MV, 'created_at': '2026-10-02T06:10:00-04:00',
                   'reviewed_by': None, 'reviewed_at': None, 'final_treatment': None, 'override_reason': None}
    audit.append({'audit_id': f'AUD-{i:04d}', 'at': '2026-10-02T06:10:00-04:00', 'event': 'nba_recommended', 'decision_id': did,
                  'golden_id': gid, 'actor': 'system', 'actor_role': 'system', 'model_version': MV,
                  'detail': c['expl'], 'outcome': 'pending'})
    if spec:
        audit.append({'audit_id': 'AUD-0101', 'at': '2026-10-02T06:10:01-04:00', 'event': 'hardship_routed', 'decision_id': did,
                      'golden_id': gid, 'actor': 'system', 'actor_role': 'system', 'model_version': MV,
                      'detail': 'Hardship signal severe: routed to human specialist, automated treatment blocked',
                      'outcome': 'pending_specialist'})
audit += [
    {'audit_id': 'AUD-0102', 'at': '2026-10-02T09:15:00-04:00', 'event': 'approved', 'decision_id': 'NBA-0004', 'golden_id': 'G-020915',
     'actor': 'AG-0620', 'actor_role': 'agent', 'model_version': MV, 'detail': 'Approved reminder by SMS', 'outcome': 'approved'},
    {'audit_id': 'AUD-0103', 'at': '2026-10-02T09:40:00-04:00', 'event': 'overridden', 'decision_id': 'NBA-0005', 'golden_id': 'G-003318',
     'actor': 'AG-0711', 'actor_role': 'agent', 'model_version': MV,
     'detail': 'Override: payment_plan instead of call. Reason: customer asked to be contacted by email only this week',
     'outcome': 'overridden'}]
audit.sort(key=lambda a: a['at'], reverse=True)

w('c360', c360)
w('nba_queue', {'items': sorted(queue, key=lambda x: -x['break_prob']), 'total': len(queue), 'page': 1, 'page_size': 50})
w('nba_detail', detail)
w('nba_decision', {
    'approve_example': {'decision_id': 'NBA-0004', 'status': 'approved', 'final_treatment': 'reminder', 'reviewed_by': 'AG-0620',
                        'reviewed_at': '2026-10-02T09:15:00-04:00', 'override_reason': None, 'audit_id': 'AUD-0102'},
    'override_example': {'decision_id': 'NBA-0005', 'status': 'overridden', 'final_treatment': 'payment_plan', 'reviewed_by': 'AG-0711',
                         'reviewed_at': '2026-10-02T09:40:00-04:00',
                         'override_reason': 'Customer asked to be contacted by email only this week', 'audit_id': 'AUD-0103'},
    'error_hardship_example': {'error': {'code': 'hardship_requires_specialist',
                                         'message': 'This decision involves a hardship case and must be reviewed by a specialist.',
                                         'details': {'decision_id': 'NBA-0001', 'required_role': 'specialist', 'actor_role': 'agent'}}}})
w('governance_audit', {'items': audit, 'total': len(audit), 'page': 1, 'page_size': 50})
with open('contracts/data_contract.yaml', encoding='utf-8') as f:
    w('governance_contract', yaml.safe_load(f))

rules = [('DQ-01', 'unique_golden_id', 'pass', 962, 0, None), ('DQ-02', 'not_null_keys', 'pass', 962, 0, None),
         ('DQ-03', 'referential_integrity_source_ids', 'pass', 4120, 0, None), ('DQ-04', 'dpd_range', 'pass', 962, 0, None),
         ('DQ-05', 'balance_non_negative', 'warn', 962, 7, '7 credit balances flagged, not rejected'),
         ('DQ-06', 'freshness', 'pass', 962, 0, None), ('DQ-07', 'match_confidence_range', 'pass', 962, 0, None),
         ('DQ-08', 'bucket_consistent_with_dpd', 'pass', 962, 0, None),
         ('DQ-09', 'low_confidence_review', 'warn', 962, 23, '23 customers with match_confidence < 0.80 sent to manual review')]
w('dq_report', {
    'dataset': 'gold.c360', 'run_at': REFRESH, 'contract_version': '1.0.0',
    'summary': {'rules_total': 9, 'passed': 7, 'warned': 2, 'failed': 0},
    'row_counts': {'raw': {'customers': 1000, 'card_accounts': 1312, 'loan_accounts': 742, 'deposit_accounts': 1204,
                           'collections_cases': 2418, 'contact_history': 15880},
                   'curated': {'customers': 987, 'rejected': 13}, 'gold': {'c360': 962, 'identity_map': 4120}},
    'rules': [{'id': r[0], 'name': r[1], 'status': r[2], 'checked': r[3], 'failed': r[4], **({'note': r[5]} if r[5] else {})} for r in rules],
    'schema_drift': [{'table': 'raw.contact_history', 'change': 'new column', 'column': 'sentiment', 'severity': 'info'}],
    'identity_resolution': {'golden_customers': 962, 'avg_sources_per_customer': 4.3, 'avg_match_confidence': 0.94, 'below_threshold': 23},
    'note': 'Illustrative mock numbers. Real values come from the pipeline.'})

rows = [('G-004817', 'R. Mitchell', 'Personal loan + Credit card', 800.00, '2026-10-02', 0.81, 'Payroll deposit missing for 14 days'),
        ('G-011203', 'S. Tremblay', 'Credit card', 2250.00, '2026-09-30', 0.78, 'Card utilisation at 93%'),
        ('G-007741', 'A. Nguyen', 'Personal loan', 1900.00, '2026-10-01', 0.74, 'Irregular deposits'),
        ('G-020915', 'P. Gagnon', 'Credit card', 640.00, '2026-09-29', 0.69, 'Missed last two statement payments'),
        ('G-003318', 'M. Roy', 'Auto loan', 3100.00, '2026-10-03', 0.66, 'Two missed instalments'),
        ('G-016672', 'K. MacDonald', 'Personal loan', 1450.00, '2026-10-04', 0.63, 'Calls not permitted'),
        ('G-009024', 'V. Chen', 'Credit card', 1600.00, '2026-10-02', 0.61, 'Bureau score dropped 42 points'),
        ('G-012890', 'T. Campbell', 'Line of credit', 1250.00, '2026-09-30', 0.60, 'Seasonal income pattern')]
SQL = ("SELECT c.golden_id, c.display_name, p.product, p.ptp_amount, p.ptp_due_date, s.break_prob, s.top_reason\n"
       "FROM gold.promises_to_pay p\n"
       "JOIN gold.model_scores s ON s.golden_id = p.golden_id AND s.model_name = 'ptp_break' AND s.score_date = DATE '2026-10-02'\n"
       "JOIN gold.c360 c ON c.golden_id = p.golden_id\n"
       "WHERE p.ptp_status = 'open' AND p.ptp_due_date BETWEEN DATE '2026-09-28' AND DATE '2026-10-04'\n"
       "ORDER BY s.break_prob DESC\nLIMIT 8")
w('ask', {
    'answered': {
        'question': 'Which customers are most likely to break a promise to pay this week?',
        'answer': '8 open promises are most likely to break, with $12,990 at risk. R. Mitchell (0.81) and S. Tremblay (0.78) are the highest.',
        'sql': SQL, 'tables_used': ['gold.promises_to_pay', 'gold.model_scores', 'gold.c360'],
        'understood_as': [{'token': 'open promises to pay', 'kind': 'filter', 'editable': True},
                          {'token': 'due 28 Sep - 4 Oct', 'kind': 'time_window', 'editable': True},
                          {'token': 'sort by break probability desc', 'kind': 'sort', 'editable': True},
                          {'token': 'top 8', 'kind': 'limit', 'editable': True}],
        'columns': ['golden_id', 'display_name', 'product', 'ptp_amount', 'ptp_due_date', 'break_prob', 'top_reason'],
        'rows': [list(r) for r in rows], 'row_count': 8,
        'followups': ['Why is G-004817 high risk?', 'Split by agent team', 'Which have hardship flags?'],
        'citations': [], 'refused': False, 'refusal_reason': None, 'route': 'sql'},
    'rag_answer': {
        'question': 'Which customers mentioned job loss or reduced shifts in recent calls?',
        'answer': 'Two customers mentioned reduced work: R. Mitchell said shifts were cut at the plant in August, and A. Nguyen said business income dropped this quarter.',
        'sql': None, 'tables_used': [],
        'understood_as': [{'token': 'topic: job loss or reduced hours', 'kind': 'filter', 'editable': True},
                          {'token': 'source: call transcripts', 'kind': 'source', 'editable': False}],
        'columns': [], 'rows': [], 'row_count': 0,
        'followups': ['Show their contact timeline', 'What treatment is recommended for them?'],
        'citations': [{'source_type': 'call_transcript', 'source_id': 'T-8812', 'golden_id': 'G-004817',
                       'snippet': 'Shifts at the plant got cut in August, I can do $1,000 by the 15th.', 'date': '2026-09-12'},
                      {'source_type': 'call_transcript', 'source_id': 'T-8901', 'golden_id': 'G-007741',
                       'snippet': 'My income dropped this quarter, what are my options?', 'date': '2026-09-29'}],
        'refused': False, 'refusal_reason': None, 'route': 'rag'},
    'refused': {
        'question': 'What is the date of birth and SIN of customer G-004817?',
        'answer': None, 'sql': None, 'tables_used': [], 'understood_as': [], 'columns': [], 'rows': [], 'row_count': 0,
        'followups': ['Show product holdings for G-004817', 'Show the contact timeline for G-004817'],
        'citations': [], 'refused': True,
        'refusal_reason': 'This asks for direct personal identifiers (date of birth, SIN), which are not available through natural-language queries.',
        'route': 'refused'}})

w('transcripts', {
    'T-8812': {'transcript_id': 'T-8812', 'golden_id': 'G-004817', 'contact_id': 'CT-104', 'date': '2026-09-12', 'channel': 'call',
               'agent_id': 'AG-0711', 'duration_sec': 412,
               'turns': [{'speaker': 'agent', 'text': 'Hi, this is about the overdue balance on your personal loan. Is now a good time?'},
                         {'speaker': 'customer', 'text': 'Yes. Money has been tight since August.'},
                         {'speaker': 'agent', 'text': 'Thanks for telling me. What could you manage, and when?'},
                         {'speaker': 'customer', 'text': 'Shifts at the plant got cut in August, I can do $1,000 by the 15th.'}],
               'summary': 'Customer reports reduced shifts since August; promised $1,000 by 15 Sep.',
               'llm_features': {'hardship_signal': 'severe', 'stated_delay_reason': 'reduced_income', 'ptp_intent_strength': 0.6}},
    'T-8843': {'transcript_id': 'T-8843', 'golden_id': 'G-004817', 'contact_id': 'CT-101', 'date': '2026-09-25', 'channel': 'call',
               'agent_id': 'AG-0842', 'duration_sec': 298,
               'turns': [{'speaker': 'agent', 'text': 'The $1,000 payment we discussed did not come through. What happened?'},
                         {'speaker': 'customer', 'text': 'I still have no full shifts. I can do $800 by October 2nd.'}],
               'summary': 'Broken PTP acknowledged; new PTP $800 by 2 Oct. Hours still reduced.',
               'llm_features': {'hardship_signal': 'severe', 'stated_delay_reason': 'reduced_income', 'ptp_intent_strength': 0.55}},
    'T-8901': {'transcript_id': 'T-8901', 'golden_id': 'G-007741', 'contact_id': 'CT-301', 'date': '2026-09-29', 'channel': 'call',
               'agent_id': 'AG-0842', 'duration_sec': 356,
               'turns': [{'speaker': 'customer', 'text': 'My income dropped this quarter, what are my options?'},
                         {'speaker': 'agent', 'text': 'We can look at a reduced payment plan. Let me check what fits.'}],
               'summary': 'Self-employed customer reports income drop; asked about payment plan options.',
               'llm_features': {'hardship_signal': 'possible', 'stated_delay_reason': 'reduced_income', 'ptp_intent_strength': 0.55}},
    'T-8870': {'transcript_id': 'T-8870', 'golden_id': 'G-009024', 'contact_id': 'CT-701', 'date': '2026-09-24', 'channel': 'call',
               'agent_id': 'AG-0711', 'duration_sec': 241,
               'turns': [{'speaker': 'agent', 'text': 'Your card is past due by about six weeks. Can we talk about a plan?'},
                         {'speaker': 'customer', 'text': 'I need to sit down with my budget first. Can you call me next week?'}],
               'summary': 'Right-party contact; customer will review budget, open to a plan.',
               'llm_features': {'hardship_signal': 'clear', 'stated_delay_reason': 'overextended_credit', 'ptp_intent_strength': 0.45}},
    'T-8895': {'transcript_id': 'T-8895', 'golden_id': 'G-012890', 'contact_id': 'CT-801', 'date': '2026-09-29', 'channel': 'call',
               'agent_id': 'AG-0620', 'duration_sec': 187,
               'turns': [{'speaker': 'customer', 'text': 'I sent $400 this morning. The rest comes when my next contract pays out.'},
                         {'speaker': 'agent', 'text': 'Thanks, I can see it. I will note the rest is expected after your contract payment.'}],
               'summary': 'Partial payment $400 received; remainder expected after seasonal contract income.',
               'llm_features': {'hardship_signal': 'clear', 'stated_delay_reason': 'seasonal_income', 'ptp_intent_strength': 0.8}}})

# fairness numbers computed from the mock decisions so they stay consistent
seg_rows = []
for sg in ['salaried', 'hourly_wage', 'self_employed']:
    ids = [c for c in C if c['seg'] == sg]
    seg_rows.append({'segment': sg, 'customers': len(ids),
                     'avg_break_prob': round(sum(c['prob'] for c in ids) / len(ids), 2),
                     'aggressive_treatment_rate': round(sum(c['treat'] in ('call', 'escalate') for c in ids) / len(ids), 2)})
w('governance_fairness', {
    'model_version': MV,
    'protected_attributes_excluded': {
        'status': 'pass', 'checked_attributes': ['age', 'gender', 'ethnicity', 'religion', 'marital_status', 'postal_code'],
        'features_in_model': ['dpd_max_current', 'ptp_broken_count_90d', 'payroll_delay_days', 'card_utilisation', 'sms_response_rate_30d',
                              'bureau_score_delta_90d', 'days_since_last_contact', 'deposit_balance', 'hardship_signal',
                              'stated_delay_reason', 'ptp_intent_strength'],
        'test': 'tests/test_no_protected_attributes.py::test_feature_list', 'last_run': REFRESH},
    'human_in_the_loop': {'decisions_total': 10, 'pending': 8, 'approved': 1, 'overridden': 1, 'override_rate': 0.5},
    'hardship': {'severe_routed_to_specialist': 1, 'possible_flagged_for_agent_review': 1, 'automated_treatment_blocked': 1},
    'segment_outcomes': seg_rows,
    'notes': 'aggressive_treatment = call or escalate. Illustrative mock numbers; real values come from the decisioning module.'})

print('ok', len(c360), 'customers')
