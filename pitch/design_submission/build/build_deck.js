// Builds pitch/design_submission/HackIt_Resolve360_Design.pptx
// Run: node build_deck.js   (from this folder)
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const THEME = {
  name: "Resolve360",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1B2430", lt1: "FFFFFF", dk2: "0E3B43", lt2: "EEF4F3",
    accent1: "15847A", accent2: "F2A541", accent3: "D64933",
    accent4: "5B7083", accent5: "9CC5BE", accent6: "2E5E8C",
    hlink: "15847A", folHlink: "2E5E8C",
  },
};
const H = THEME.colors; // hex, only for hex-only options (charts, shadows)

const OUT = "../HackIt_Resolve360_Design.pptx";

async function iconPng(Comp, hex) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.title = "Resolve360 - Team Hack It - Design submission";
  pres.author = "Team Hack It";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const S = pres.shapes;

  // ---------- icons ----------
  const ic = {};
  const want = {
    db: fa.FaDatabase, ask: fa.FaComments, scale: fa.FaScaleBalanced, bolt: fa.FaBolt,
    user: fa.FaUserCheck, shield: fa.FaShieldHalved, id: fa.FaFingerprint, wallet: fa.FaWallet,
    cal: fa.FaCalendarCheck, route: fa.FaRoute, check: fa.FaClipboardCheck, chart: fa.FaChartLine,
    warn: fa.FaTriangleExclamation, people: fa.FaPeopleGroup, robot: fa.FaRobot, code: fa.FaCode,
    layers: fa.FaLayerGroup, file: fa.FaFileContract, heart: fa.FaHandHoldingHeart, clock: fa.FaClock,
    puzzle: fa.FaPuzzlePiece, hourglass: fa.FaHourglassHalf, repeat: fa.FaArrowsRotate, lock: fa.FaLock,
  };
  for (const [k, comp] of Object.entries(want)) {
    ic[k] = { w: await iconPng(comp, H.lt1), t: await iconPng(comp, H.accent1) };
  }

  // ---------- layouts ----------
  pres.defineSlideMaster({
    title: "DARK",
    background: { color: H.dk2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.6, w: 11.7, h: 1.0, fontFace: THEME.headFontFace, fontSize: 36, bold: true, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: H.lt1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.3, w: 12.1, h: 0.85, fontFace: THEME.headFontFace, fontSize: 30, bold: true, color: C.text2, valign: "middle", margin: 0 }, text: "" } },
      { text: { text: "Team Hack It  ·  Resolve360  ·  Educational prototype on synthetic data", options: { x: 0.6, y: 7.02, w: 9, h: 0.3, fontSize: 9, color: C.accent4, margin: 0 } } },
    ],
    slideNumber: { x: 12.25, y: 7.02, w: 0.5, h: 0.3, fontSize: 9, color: C.accent4, align: "right" },
  });

  // ---------- helpers ----------
  const T = (s, text, o) => s.addText(text, { isTextBox: true, fontSize: 12, color: C.text1, valign: "top", margin: 0.05, ...o });
  const shadow = () => ({ type: "outer", blur: 8, offset: 2, angle: 90, color: "000000", opacity: 0.12 });
  const card = (s, x, y, w, h, o = {}) =>
    s.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: o.fill || C.background1 }, line: { color: o.line || C.background2, width: o.lw || 1 }, shadow: o.noShadow ? undefined : shadow(), objectName: o.name });
  const iconCircle = (s, key, x, y, d, bg = C.accent1, variant = "w") => {
    s.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
    const p = d * 0.22;
    s.addImage({ data: ic[key][variant], x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  };
  const chip = (s, text, x, y, w, h, o = {}) =>
    s.addText(text, { isTextBox: true, x, y, w, h, shape: S.ROUNDED_RECTANGLE, rectRadius: 0.06, fill: { color: o.fill || C.background2 }, line: { color: o.line || o.fill || C.background2 }, color: o.color || C.text2, fontSize: o.size || 11, bold: o.bold !== false, align: o.align || "center", valign: "middle", margin: 0.04, fontFace: o.font });
  const arrow = (s, x, y, w, h, color = C.accent4) =>
    s.addShape(S.LINE, { x, y, w, h, line: { color, width: 1.75, endArrowType: "triangle" } });
  const bullets = (items, o = {}) =>
    items.map((t, i) => ({ text: t, options: { bullet: o.num ? { type: "number" } : true, breakLine: i < items.length - 1, paraSpaceAfter: o.gap ?? 4 } }));

  // =====================================================================
  // 1. TITLE
  pres.addSection({ title: "Opening" });
  let s = pres.addSlide({ masterName: "DARK", sectionTitle: "Opening" });
  s.addText("Resolve360", { placeholder: "title" });
  T(s, "Stop chasing. Start resolving.", { x: 0.8, y: 1.65, w: 11, h: 0.7, fontFace: THEME.headFontFace, fontSize: 28, italic: true, color: C.accent2 });
  T(s, "A governed Collections 360 with plain-English Ask and an affordability-first Next Best Action that changes the moment a call ends.", { x: 0.8, y: 2.55, w: 8.2, h: 1.0, fontSize: 18, color: C.background1 });
  const pillars = [["db", "Collections 360", "one customer, one trusted ID"], ["ask", "Ask", "answers that show their working"], ["wallet", "Next Best Action", "risk + ability to pay"], ["shield", "Governance", "built into every layer"]];
  pillars.forEach(([k, a, b], i) => {
    const x = 0.8 + i * 3.0;
    iconCircle(s, k, x, 4.15, 0.6, C.accent1);
    T(s, a, { x: x + 0.72, y: 4.12, w: 2.2, h: 0.35, fontSize: 14, bold: true, color: C.background1 });
    T(s, b, { x: x + 0.72, y: 4.45, w: 2.2, h: 0.4, fontSize: 11, color: C.accent5 });
  });
  T(s, "Team Hack It  ·  Collections Hackathon  ·  Design submission, 2 October 2026", { x: 0.8, y: 6.2, w: 9, h: 0.35, fontSize: 13, color: C.background1 });
  T(s, "Educational prototype on fully synthetic data. Not a system of, or endorsed by, the industry partner.", { x: 0.8, y: 6.55, w: 9.5, h: 0.35, fontSize: 10, color: C.accent5 });
  s.addNotes("Resolve360 by team Hack It. One working slice through all three layers of the brief, with one headline idea: collections should optimise for resolution, not pressure.");

  // =====================================================================
  // 2. PROBLEM
  pres.addSection({ title: "Problem" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Problem" });
  s.addText("One customer. Nine systems. No single story.", { placeholder: "title" });
  const frags = [
    ["Cards", "Visa 28 days past due, $452 overdue"], ["Loans", "Personal loan 34 days past due"], ["Deposits", "No payroll deposit for 29 days"],
    ["Collections", "Promise of $1,000 broken on 15 Sep"], ["CRM", "Hourly-wage customer since 2016"], ["Contact history", "SMS reminder delivered, no response"],
    ["Agent notes", "Asked about options, sounded anxious"], ["Call transcripts", "\"Shifts at the plant got cut in August\""], ["Bureau", "Two new credit inquiries"],
  ];
  frags.forEach(([sys, f], i) => {
    const x = 0.6 + (i % 3) * 2.3, y = 1.45 + Math.floor(i / 3) * 1.68;
    const hot = sys === "Deposits" || sys === "Call transcripts";
    card(s, x, y, 2.15, 1.5, { fill: hot ? C.background2 : C.background1, line: hot ? C.accent1 : C.background2, lw: hot ? 1.5 : 1 });
    T(s, sys.toUpperCase(), { x: x + 0.15, y: y + 0.15, w: 1.9, h: 0.3, fontSize: 10, bold: true, color: C.accent1, charSpacing: 1 });
    T(s, f, { x: x + 0.15, y: y + 0.48, w: 1.9, h: 0.9, fontSize: 13, color: C.text1 });
  });
  T(s, "R. Mitchell, a synthetic customer from our mock data. The two highlighted clues explain everything, and no one sees them together.", { x: 0.6, y: 6.5, w: 6.75, h: 0.45, fontSize: 10, italic: true, color: C.accent4 });
  const pains = [
    ["puzzle", "Fragmented", "The agent toggles between systems. The hardship clue is buried in a call transcript."],
    ["hourglass", "Slow insight", "\"Who will break a promise this week?\" becomes a data request that takes days."],
    ["warn", "Generic pressure", "He gets the same reminders and calls as a customer who simply won't pay."],
  ];
  pains.forEach(([k, h, d], i) => {
    const y = 1.55 + i * 1.65;
    iconCircle(s, k, 7.85, y, 0.62, i === 2 ? C.accent3 : C.accent1);
    T(s, h, { x: 8.65, y: y - 0.05, w: 4.05, h: 0.4, fontFace: THEME.headFontFace, fontSize: 18, bold: true, color: C.text2 });
    T(s, d, { x: 8.65, y: y + 0.38, w: 4.05, h: 0.95, fontSize: 13 });
  });
  s.addNotes("Every system holds a fragment. Deposits show the missing paycheque, the transcript says shifts were cut. Today nobody joins those dots, so the customer gets generic pressure.");

  // =====================================================================
  // 3. INSIGHT
  s = pres.addSlide({ masterName: "DARK", sectionTitle: "Problem" });
  s.addText("Can't pay is not won't pay", { placeholder: "title" });
  T(s, "Collections systems answer \"who should we chase?\". The better question, and the one the brief's own data can answer, is \"what can this customer pay, and when?\"", { x: 0.8, y: 1.6, w: 11.5, h: 0.9, fontSize: 18, color: C.background1 });
  const cols = [
    ["Today: who should we chase?", ["Rank customers by risk", "Push hardest on the riskiest", "Same treatment whether they can't or won't pay", "Result: broken promises, rolls to worse buckets, fairness risk"], C.accent3],
    ["Resolve360: what can they pay, and when?", ["Risk plus ability to pay from salary credits", "Plan amount the customer can keep", "Contact and due date timed to the next payday", "Result: kept promises, fair treatment, vulnerable customers protected"], C.accent2],
  ];
  cols.forEach(([h, items, col], i) => {
    const x = 0.8 + i * 6.0;
    s.addShape(S.ROUNDED_RECTANGLE, { x, y: 2.85, w: 5.6, h: 3.3, rectRadius: 0.08, fill: { color: C.background1, transparency: 92 }, line: { color: col, width: 1.5 } });
    T(s, h, { x: x + 0.3, y: 3.05, w: 5.0, h: 0.5, fontFace: THEME.headFontFace, fontSize: 17, bold: true, color: col });
    T(s, bullets(items, { gap: 8 }), { x: x + 0.3, y: 3.7, w: 5.0, h: 2.3, fontSize: 15, color: C.background1 });
  });
  s.addNotes("Our core insight. Much of collections risk is customers who cannot pay right now, not customers who will not. Pressure makes that worse. We use salary credits in the deposit data to find what each customer can afford.");

  // =====================================================================
  // 4. SOLUTION OVERVIEW
  pres.addSection({ title: "Solution" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Solution" });
  s.addText("Resolve360: one working slice, five differentiators", { placeholder: "title" });
  T(s, "Collections 360  →  Ask  →  Next Best Action, with governance in every layer. Every output shows its working: SQL, lineage, citations, reasons and an audit ID.", { x: 0.6, y: 1.25, w: 12.1, h: 0.7, fontSize: 15, color: C.text1 });
  const diffs = [
    ["id", "Layer 1", "Trust score", "Each golden record carries a trust score from match confidence, freshness and failed checks. Low trust makes decisions ask the agent to verify first."],
    ["ask", "Layer 2", "Ask over governed metrics", "The LLM fills a structured query over metrics defined once. Our code compiles the SQL, so roll rate means the same thing every time."],
    ["wallet", "Layer 3", "Affordability-first NBA", "Risk plus ability to pay: payday detection, monthly capacity and a plan the customer can actually keep."],
    ["bolt", "Layer 3", "Live re-decisioning", "When a call ends, features update, the model re-scores and the action changes in seconds, fully audited."],
    ["repeat", "Oversight", "Override intelligence", "Reason-coded overrides and tracked outcomes become proposed policy changes that a human approves."],
  ];
  diffs.forEach(([k, tag, h, d], i) => {
    const x = 0.6 + i * 2.45;
    card(s, x, 2.15, 2.3, 4.05, { fill: i === 2 ? C.background2 : C.background1, line: i === 2 ? C.accent1 : C.background2, lw: i === 2 ? 1.5 : 1 });
    iconCircle(s, k, x + 0.2, 2.38, 0.62, i === 2 ? C.accent2 : C.accent1);
    chip(s, tag, x + 1.1, 2.5, 1.0, 0.36, { size: 10, fill: C.background2, color: C.accent1 });
    T(s, h, { x: x + 0.2, y: 3.15, w: 1.95, h: 0.75, fontFace: THEME.headFontFace, fontSize: 16, bold: true, color: C.text2 });
    T(s, d, { x: x + 0.2, y: 3.95, w: 1.95, h: 2.15, fontSize: 13 });
  });
  T(s, "Most systems decide who to chase. Ours decides what each customer can afford, and learns from every human override.", { x: 0.6, y: 6.38, w: 12.1, h: 0.45, fontSize: 15, italic: true, bold: true, color: C.accent1 });
  s.addNotes("The base is what the brief asks for, built end to end. On top, five differentiators. The headline is affordability-first next best action.");

  // =====================================================================
  // 5. ARCHITECTURE
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Solution" });
  s.addText("Architecture: from nine sources to one fair decision", { placeholder: "title" });
  const box = (x, y, w, h, head, items, o = {}) => {
    card(s, x, y, w, h, { fill: o.fill || C.background1, line: o.line || C.accent5, lw: 1.25 });
    T(s, head, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: 0.42, fontSize: 13, bold: true, color: o.headColor || C.text2 });
    T(s, bullets(items, { gap: 3 }), { x: x + 0.12, y: y + 0.5, w: w - 0.24, h: h - 0.6, fontSize: 10.5 });
  };
  box(0.6, 1.4, 2.0, 4.75, "Source data", ["Cards", "Loans", "Deposits (salary credits)", "Collections cases", "CRM / customers", "Contact history", "Agent notes", "Call transcripts", "External bureau"]);
  box(2.95, 1.4, 2.6, 4.75, "Layer 1  Data Product Factory", ["raw → curated → gold", "Identity resolution: exact keys, then fuzzy, with confidence", "Golden C360 + identity map + lineage", "Trust score per customer", "Data contract, 9 quality rules, drift check", "AI: mapping suggestions, SQL drafts, drift summaries"], { fill: C.background2 });
  box(5.9, 1.4, 3.3, 2.3, "Layer 2  Ask", ["Semantic layer: metrics defined once", "LLM → structured query → validated → compiled SQL", "Read-only DuckDB, allow-list, LIMIT", "RAG over notes and transcripts, with citations"], { fill: C.background2 });
  box(5.9, 3.85, 3.3, 2.3, "Layer 3  AI Decisioning", ["Feature store: SQL + LLM features (versioned)", "LightGBM break risk + SHAP reasons", "Hardship score + affordability", "Policy engine → action, channel, timing, plan"], { fill: C.background2 });
  box(9.55, 1.4, 1.5, 4.75, "API + events", ["FastAPI", "/c360", "/ask", "/nba", "/events/ contact-completed", "Live push (SSE)", "Audit log"]);
  box(11.3, 1.4, 1.45, 4.75, "Agent UI", ["C360 view", "Ask", "NBA queue: approve / override", "Governance tab"]);
  arrow(s, 2.62, 3.75, 0.3, 0);
  arrow(s, 5.57, 2.55, 0.3, 0);
  arrow(s, 5.57, 5.0, 0.3, 0);
  arrow(s, 9.22, 2.55, 0.3, 0);
  arrow(s, 9.22, 5.0, 0.3, 0);
  arrow(s, 11.07, 3.75, 0.2, 0);
  s.addText("Governance in every layer:  data contract  ·  PII redaction  ·  access by role  ·  no protected attributes  ·  hardship circuit breaker  ·  explanations  ·  human approve / override  ·  audit log", { isTextBox: true, x: 0.6, y: 6.3, w: 12.15, h: 0.55, shape: S.ROUNDED_RECTANGLE, rectRadius: 0.08, fill: { color: C.text2 }, line: { color: C.text2 }, color: C.background1, fontSize: 12, bold: true, align: "center", valign: "middle", margin: 0.05 });
  s.addNotes("Stack: Python, DuckDB, FastAPI, LightGBM, React. Layer 1 feeds both Ask and decisioning. Contact-completed events trigger live re-decisioning. Governance runs underneath everything.");

  // =====================================================================
  // 6. LAYER 1
  pres.addSection({ title: "Layers" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Layers" });
  s.addText("Layer 1: one customer, one ID, one trust score", { placeholder: "title" });
  const stages = [["Raw", "loaded as-is"], ["Curated", "typed, deduped, rejects logged"], ["Golden C360", "one row per customer"], ["Feature-ready", "for Ask and decisions"]];
  stages.forEach(([a, b], i) => {
    s.addText([{ text: a, options: { bold: true, fontSize: 13, breakLine: true } }, { text: b, options: { fontSize: 10 } }], { isTextBox: true, x: 0.6 + i * 1.78, y: 1.4, w: 1.95, h: 0.9, shape: S.CHEVRON, fill: { color: i === 2 ? C.text2 : C.accent1 }, line: { color: C.background1 }, color: C.background1, align: "center", valign: "middle", margin: [0, 0.3, 0, 0.35] });
  });
  T(s, "Identity resolution: exact keys first, then fuzzy matching, every link scored", { x: 0.6, y: 2.6, w: 7.1, h: 0.4, fontSize: 14, bold: true, color: C.text2 });
  const srcs = [["cards", "C-88013"], ["loans", "L-553017"], ["deposits", "DEP-7711"], ["crm", "CRM-1107"], ["collections", "COL-4019"]];
  srcs.forEach(([a, b], i) => {
    chip(s, `${a}: ${b}`, 0.6, 3.1 + i * 0.6, 2.4, 0.45, { size: 11, fill: C.background2, color: C.text1, bold: false, font: "Courier New" });
    const y0 = 3.32 + i * 0.6, y1 = 4.52, dy = y1 - y0;
    s.addShape(S.LINE, { x: 3.02, y: Math.min(y0, y1), w: 1.25, h: Math.max(Math.abs(dy), 0.001), flipV: dy < 0, line: { color: C.accent5, width: 1.25, endArrowType: "triangle" } });
  });
  s.addShape(S.OVAL, { x: 4.3, y: 3.62, w: 1.8, h: 1.8, fill: { color: C.text2 }, line: { color: C.text2 } });
  T(s, [{ text: "G-004817", options: { bold: true, fontSize: 14, breakLine: true, color: C.background1 } }, { text: "match 0.97", options: { fontSize: 12, color: C.accent2 } }], { x: 4.35, y: 4.1, w: 1.7, h: 0.8, align: "center", valign: "middle" });
  T(s, "Matches below 0.80 go to a manual review list. Source IDs are kept as lineage, so a wrong merge can be undone.", { x: 0.6, y: 6.15, w: 7.0, h: 0.6, fontSize: 11, italic: true, color: C.accent4 });
  // trust score card
  card(s, 7.95, 1.4, 4.8, 3.3, { fill: C.background2, line: C.accent1, lw: 1.5 });
  iconCircle(s, "check", 8.15, 1.58, 0.55);
  T(s, "Trust score", { x: 8.85, y: 1.6, w: 3.7, h: 0.45, fontFace: THEME.headFontFace, fontSize: 19, bold: true, color: C.text2 });
  T(s, "trust = match confidence × freshness × (1 − share of failed checks on decision-critical fields)", { x: 8.15, y: 2.2, w: 4.4, h: 0.75, fontSize: 12, fontFace: "Courier New", color: C.text1 });
  T(s, [
    { text: "R. Mitchell  0.97 × 1.00 × 0.97 = 0.94  ", options: { bold: true } }, { text: "high trust", options: { color: C.accent1, bold: true, breakLine: true } },
    { text: "V. Chen  0.84 × 1.00 × 0.97 = 0.81  ", options: { bold: true } }, { text: "verify identity first", options: { color: C.accent3, bold: true } },
  ], { x: 8.15, y: 3.05, w: 4.45, h: 0.8, fontSize: 12 });
  T(s, "Below 0.85 the NBA tells the agent to verify identity before discussing balances. Below 0.60 no automated recommendation is made.", { x: 8.15, y: 3.85, w: 4.45, h: 0.8, fontSize: 11 });
  T(s, "Data contract for gold.c360", { x: 7.95, y: 4.95, w: 4.8, h: 0.4, fontSize: 14, bold: true, color: C.text2 });
  ["Owner + purpose", "21 columns, PII class each", "9 quality rules", "Allowed / prohibited uses", "Drift check every run", "AI-drafted SQL, tests decide"].forEach((t, i) => {
    chip(s, t, 7.95 + (i % 2) * 2.45, 5.42 + Math.floor(i / 2) * 0.48, 2.35, 0.4, { size: 10.5, fill: C.background1, line: C.accent5, color: C.text1, bold: false });
  });
  s.addNotes("Nine source IDs resolve to one golden ID with a confidence score. New idea: a trust score per customer that flows into the decision layer, so poor data quality changes what the agent is told to do.");

  // =====================================================================
  // 7. LAYER 2
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Layers" });
  s.addText("Layer 2: Ask, with the working shown", { placeholder: "title" });
  card(s, 0.6, 1.35, 7.1, 5.45, { fill: C.background1, line: C.accent5, lw: 1.25 });
  chip(s, "Which customers are most likely to break a promise to pay this week?", 0.8, 1.55, 6.7, 0.5, { fill: C.background2, color: C.text1, align: "left", size: 13, bold: false });
  T(s, "Understood as  (click a chip to edit it)", { x: 0.8, y: 2.15, w: 6.7, h: 0.3, fontSize: 10, color: C.accent4 });
  [["open promises", 1.55], ["due 28 Sep - 4 Oct", 1.85], ["sort: break risk, high first", 2.3], ["top 8", 0.75]].reduce((x, [t, w]) => { chip(s, t, x, 2.45, w, 0.36, { size: 10.5, fill: C.accent1, color: C.background1 }); return x + w + 0.12; }, 0.8);
  T(s, "8 open promises are likely to break, with $12,990 at risk.", { x: 0.8, y: 2.95, w: 6.7, h: 0.4, fontSize: 14, bold: true, color: C.text2 });
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  s.addTable([
    [hdr("Customer"), hdr("Product"), hdr("Promise"), hdr("Due"), hdr("Break risk")],
    ["R. Mitchell", "Loan + card", "$800", "2 Oct", { text: "0.81", options: { bold: true, color: C.accent3 } }],
    ["S. Tremblay", "Card", "$2,250", "30 Sep", { text: "0.78", options: { bold: true, color: C.accent3 } }],
    ["A. Nguyen", "Personal loan", "$1,900", "1 Oct", { text: "0.74", options: { bold: true, color: C.accent3 } }],
  ], { x: 0.8, y: 3.4, w: 6.7, colW: [1.6, 1.6, 1.1, 1.0, 1.4], fontSize: 11, rowH: 0.3, border: { type: "solid", color: H.lt2, pt: 1 }, color: C.text1, margin: 0.04 });
  T(s, "SELECT c.display_name, p.product, p.ptp_amount, p.ptp_due_date, s.break_prob\nFROM gold.promises_to_pay p JOIN gold.model_scores s USING (golden_id)\nJOIN gold.c360 c USING (golden_id)\nWHERE p.ptp_status = 'open' AND p.ptp_due_date BETWEEN '2026-09-28' AND '2026-10-04'\nORDER BY s.break_prob DESC LIMIT 8", { x: 0.8, y: 4.75, w: 6.7, h: 1.25, fontSize: 9, fontFace: "Courier New", color: C.text2, fill: { color: C.background2 }, margin: 0.08 });
  T(s, "Data products used: gold.promises_to_pay, gold.model_scores, gold.c360", { x: 0.8, y: 6.1, w: 6.7, h: 0.3, fontSize: 10, italic: true, color: C.accent4 });
  T(s, "Illustrative screen built from our mock data", { x: 0.8, y: 6.4, w: 6.7, h: 0.3, fontSize: 9, color: C.accent4 });
  T(s, "How it works", { x: 7.95, y: 1.35, w: 4.8, h: 0.4, fontSize: 16, bold: true, color: C.text2 });
  T(s, bullets([
    "Parse: the LLM maps the question to {metric, dimensions, filters, time window, sort, limit}.",
    "Validate against metrics.yaml and the column allow-list.",
    "Compile: our code writes the SQL. For governed metrics the LLM never writes raw SQL.",
    "Execute on read-only DuckDB, LIMIT enforced.",
    "Explain: the LLM summarises only the returned rows. RAG over notes and transcripts adds cited quotes.",
  ], { num: true, gap: 6 }), { x: 7.95, y: 1.8, w: 4.8, h: 3.2, fontSize: 12 });
  card(s, 7.95, 5.15, 4.8, 1.65, { fill: C.background1, line: C.accent3, lw: 1.5 });
  iconCircle(s, "lock", 8.12, 5.32, 0.5, C.accent3);
  T(s, "\"What is the SIN of G-004817?\"", { x: 8.75, y: 5.3, w: 3.9, h: 0.4, fontSize: 12, bold: true, italic: true });
  T(s, "Refused: direct personal identifiers are not available through Ask. Also refused: protected attributes, write operations, off-topic questions, prompt injection.", { x: 8.75, y: 5.7, w: 3.9, h: 1.05, fontSize: 11 });
  s.addNotes("Ask turns a question into a structured query over governed metrics, then our code compiles the SQL. The understood-as chips are that structured query, so edits are exact. Every answer shows its SQL and data products. Out-of-scope questions are refused with a reason.");

  // =====================================================================
  // 8. LAYER 3 OVERVIEW
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Layers" });
  s.addText("Layer 3: affordability-first Next Best Action", { placeholder: "title" });
  const flow = [["Feature store", "SQL + LLM features"], ["Break risk", "LightGBM, calibrated"], ["Hardship score", "transparent rules"], ["Affordability", "capacity + payday"], ["Policy engine", "versioned YAML"], ["Action", "with reasons"]];
  flow.forEach(([a, b], i) => {
    const x = 0.6 + i * 2.05;
    const last = i === flow.length - 1;
    s.addText([{ text: a, options: { bold: true, fontSize: 13, breakLine: true } }, { text: b, options: { fontSize: 10.5 } }], { isTextBox: true, x, y: 1.4, w: 1.8, h: 0.85, shape: S.ROUNDED_RECTANGLE, rectRadius: 0.08, fill: { color: last ? C.accent2 : C.background2 }, line: { color: last ? C.accent2 : C.accent5 }, color: C.text2, align: "center", valign: "middle", margin: 0.04 });
    if (!last) arrow(s, x + 1.82, 1.82, 0.21, 0);
  });
  T(s, "Policy: how risk, hardship and affordability combine", { x: 0.6, y: 2.55, w: 7.5, h: 0.4, fontSize: 14, bold: true, color: C.text2 });
  const ph = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  s.addTable([
    [ph("Hardship"), ph("Affordability"), ph("Risk"), ph("Action")],
    [{ text: "Severe", options: { bold: true, color: C.accent3 } }, "any", "any", "Specialist referral, collection pressure blocked"],
    ["Possible", "ratio < 0.3", "any", "Agent review, offer a reduced plan"],
    ["Clear", "ratio ≥ 1", "high", "Call after payday, catch-up payment"],
    ["Clear", "0.3 to 1", "any", "Payment plan timed to payday"],
    ["Clear", "ratio ≥ 1", "low", "Light reminder on the best-responding channel"],
  ], { x: 0.6, y: 3.0, w: 7.5, colW: [1.2, 1.4, 0.9, 4.0], fontSize: 12, rowH: 0.42, border: { type: "solid", color: H.lt2, pt: 1 }, color: C.text1, margin: 0.06 });
  T(s, "Always constrained by consent, permitted contact hours and the trust score. Thresholds are business-owned policy, not model output.", { x: 0.6, y: 5.75, w: 7.5, h: 0.6, fontSize: 11, italic: true, color: C.accent4 });
  card(s, 8.4, 2.55, 4.35, 4.25, { fill: C.background1, line: C.accent2, lw: 1.5 });
  T(s, "NBA-0001  ·  R. Mitchell", { x: 8.6, y: 2.68, w: 4.0, h: 0.35, fontSize: 11, bold: true, color: C.accent4 });
  T(s, "Specialist referral, collection pressure blocked", { x: 8.6, y: 3.02, w: 4.0, h: 0.7, fontFace: THEME.headFontFace, fontSize: 16, bold: true, color: C.text2 });
  T(s, "Top reasons", { x: 8.6, y: 3.75, w: 4.0, h: 0.3, fontSize: 11, bold: true, color: C.accent1 });
  T(s, bullets(["No payroll deposit for 29 days", "Said shifts were cut at the plant in August", "One promise broken in the last 90 days"], { gap: 2 }), { x: 8.6, y: 4.05, w: 4.0, h: 0.95, fontSize: 11 });
  T(s, "What would change it", { x: 8.6, y: 5.0, w: 4.0, h: 0.3, fontSize: 11, bold: true, color: C.accent1 });
  T(s, "If payroll arrives this week: risk 0.81 → 0.42 and the action becomes a reminder.", { x: 8.6, y: 5.3, w: 4.0, h: 0.6, fontSize: 11 });
  chip(s, "Approve", 8.6, 6.1, 1.6, 0.45, { fill: C.accent1, color: C.background1, size: 12 });
  chip(s, "Override (reason required)", 10.3, 6.1, 2.3, 0.45, { fill: C.background1, line: C.accent1, color: C.accent1, size: 11 });
  s.addNotes("The model predicts promise-break risk. Two transparent scores, hardship and affordability, sit beside it. A versioned policy combines them into an action with plain-English reasons and a counterfactual.");

  // =====================================================================
  // 9. HARDSHIP
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Layers" });
  s.addText("Hardship score: transparent rules, not a black box", { placeholder: "title" });
  const hh = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  s.addTable([
    [hh("Signal"), hh("Source"), hh("Rule"), hh("Points")],
    ["Stated hardship", "LLM, with quoted evidence", "high / moderate severity", "30 / 15"],
    ["Missed payroll", "Salary credits", "no credit for > 1.5 × pay cycle", "25"],
    ["Income drop", "Salary credits", "last 60 days vs prior 90 down > 30%", "20"],
    ["Willing but unable", "LLM intent + promises", "intent ≥ 0.5 and a broken promise", "10"],
    ["Cash stress", "Deposits", "≥ 5 overdrawn days in 30", "10"],
    ["Credit stress", "Bureau + cards", "score −40 in 90 days, or utilisation > 90% rising", "5 each"],
    [{ text: "Vulnerability", options: { bold: true, color: C.accent3 } }, "LLM, with quoted evidence", "illness, bereavement, distress, cognitive or language difficulty", { text: "always severe", options: { bold: true, color: C.accent3 } }],
  ], { x: 0.6, y: 1.4, w: 7.4, colW: [1.55, 1.85, 2.95, 1.05], fontSize: 11, rowH: 0.48, border: { type: "solid", color: H.lt2, pt: 1 }, color: C.text1, margin: 0.06, valign: "middle" });
  [["0-29  Clear", C.accent1], ["30-59  Possible: agent review", C.accent2], ["60+  Severe: specialist only", C.accent3]].forEach(([t, col], i) => {
    chip(s, t, 0.6 + [0, 1.75, 4.4][i], 5.55, [1.6, 2.5, 3.0][i], 0.42, { fill: col, color: i === 1 ? C.text1 : C.background1, size: 11 });
  });
  T(s, "Weights are versioned policy owned by the business and checked against hand-labelled cases. Health or bereavement details only ever protect the customer, are stored as a category, and protected attributes are never inputs.", { x: 0.6, y: 6.1, w: 7.4, h: 0.75, fontSize: 10.5, italic: true, color: C.accent4 });
  T(s, "Worked example: R. Mitchell", { x: 8.3, y: 1.4, w: 4.45, h: 0.4, fontSize: 15, bold: true, color: C.text2 });
  s.addChart(pres.charts.BAR, [{ name: "Points", labels: ["Stated hardship", "Missed payroll (29 days)", "Income down 35%", "Willing but unable"], values: [30, 25, 20, 10] }], {
    x: 8.2, y: 1.8, w: 4.55, h: 2.9, barDir: "bar", chartColors: [H.accent1], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: H.dk1,
    catAxisLabelFontSize: 10, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    valAxisMaxVal: 36, catAxisOrientation: "maxMin", showLegend: false, dataLabelFontFace: "+mn-lt",
  });
  T(s, [{ text: "85", options: { fontSize: 54, bold: true, color: C.accent3, fontFace: THEME.headFontFace } }, { text: " / 100", options: { fontSize: 20, color: C.accent4 } }], { x: 8.3, y: 4.8, w: 2.6, h: 1.0, valign: "middle" });
  T(s, "Severe: routed to a hardship specialist. The explanation cites the call quote.", { x: 10.85, y: 4.85, w: 1.9, h: 1.1, fontSize: 11, bold: true, color: C.text2 });
  s.addNotes("Hardship decides who gets protection, so it is rules-based and auditable, not a black-box model. Text signals come from the LLM with quoted evidence, financial signals from deposits and bureau data. R. Mitchell scores 85: severe.");

  // =====================================================================
  // 10. AFFORDABILITY
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Layers" });
  s.addText("Affordability: what can they pay, and when?", { placeholder: "title" });
  const steps = [
    ["Pay cycle", "Median gap between salary credits: weekly, biweekly or monthly. Next payday predicted."],
    ["Income", "Typical pay × pays per month. After an income shock, use the latest pay."],
    ["Obligations", "Loan instalments + card minimum payments."],
    ["Essentials", "Policy allowance of 60% of income (configurable, labelled assumption)."],
    ["Capacity", "C = income − obligations − essentials. Buffer B = deposits above $500."],
    ["Decide", "ratio = (3 × C + B) ÷ arrears.  ≥ 1 catch-up  ·  0.3-1 staged plan  ·  < 0.3 or C ≤ 0 hardship pathway."],
  ];
  steps.forEach(([h, d], i) => {
    const y = 1.4 + i * 0.86;
    s.addShape(S.OVAL, { x: 0.6, y, w: 0.46, h: 0.46, fill: { color: C.accent1 }, line: { color: C.accent1 } });
    T(s, String(i + 1), { x: 0.6, y: y + 0.02, w: 0.46, h: 0.42, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0 });
    T(s, h, { x: 1.2, y: y - 0.02, w: 4.9, h: 0.3, fontSize: 13, bold: true, color: C.text2 });
    T(s, d, { x: 1.2, y: y + 0.27, w: 4.9, h: 0.55, fontSize: 11 });
  });
  T(s, "Plans use 80% of capacity as a safety margin and fall due the day after the predicted payday. Confidence = pay-cycle regularity × trust score.", { x: 0.6, y: 6.55, w: 5.6, h: 0.45, fontSize: 10, italic: true, color: C.accent4 });
  const people = [
    ["R. Mitchell", "Shifts cut, payroll late", [["Income", "$2,058 / month (latest $950 biweekly)"], ["Obligations", "$830"], ["Essentials", "$1,235"]], "−$7", "capacity / month", "Hardship pathway: specialist, reduced payment or payment holiday, no collection calls.", C.accent3],
    ["M. Roy", "Stable salary, has savings", [["Income", "$5,800 / month"], ["Obligations", "$1,550"], ["Essentials", "$3,480"]], "1.05", "affordability ratio", "Call the day after payday: $950 from savings, then $616 / month for 4 months.", C.accent1],
  ];
  people.forEach(([n, sub, rows, big, lab, out, col], i) => {
    const x = 6.45 + i * 3.2;
    card(s, x, 1.4, 3.05, 5.05, { fill: C.background1, line: col, lw: 1.5 });
    T(s, n, { x: x + 0.2, y: 1.55, w: 2.7, h: 0.4, fontFace: THEME.headFontFace, fontSize: 17, bold: true, color: C.text2 });
    T(s, sub, { x: x + 0.2, y: 1.93, w: 2.7, h: 0.3, fontSize: 11, color: C.accent4 });
    T(s, rows.map(([a, b], j) => ({ text: `${a}: ${b}`, options: { breakLine: j < rows.length - 1, paraSpaceAfter: 3 } })), { x: x + 0.2, y: 2.3, w: 2.7, h: 1.05, fontSize: 11 });
    T(s, big, { x: x + 0.2, y: 3.35, w: 2.7, h: 0.85, fontSize: 44, bold: true, color: col, fontFace: THEME.headFontFace });
    T(s, lab, { x: x + 0.2, y: 4.2, w: 2.7, h: 0.3, fontSize: 11, color: C.accent4 });
    T(s, out, { x: x + 0.2, y: 4.6, w: 2.7, h: 1.7, fontSize: 12, bold: true, color: C.text2 });
  });
  T(s, "Both are high-risk. The actions are opposite, and the system shows why.", { x: 6.45, y: 6.55, w: 6.3, h: 0.4, fontSize: 13, bold: true, italic: true, color: C.accent1 });
  s.addNotes("Pay cycle from salary credit dates, income, obligations, a labelled essentials assumption, then monthly capacity. Mitchell has negative capacity, so he goes to the hardship pathway. Roy can catch up, so he gets a call the day after payday.");

  // =====================================================================
  // 11. LIVE RE-DECISIONING
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Layers" });
  s.addText("Live re-decisioning: the action changes when the call ends", { placeholder: "title" });
  const ev = [["Event in", "contact completed"], ["Redact", "SIN, card, phone, email"], ["LLM extract", "fixed JSON schema"], ["Validate", "evidence must be quoted"], ["Update", "online feature store"], ["Re-score", "model + scores + policy"], ["Audit + push", "SSE to the agent UI"]];
  ev.forEach(([a, b], i) => {
    const x = 0.6 + i * 1.75;
    s.addText([{ text: `${i + 1}  ${a}`, options: { bold: true, fontSize: 12, breakLine: true } }, { text: b, options: { fontSize: 10 } }], { isTextBox: true, x, y: 1.4, w: 1.6, h: 0.85, shape: S.ROUNDED_RECTANGLE, rectRadius: 0.08, fill: { color: i === 2 ? C.accent2 : C.background2 }, line: { color: C.accent5 }, color: C.text2, align: "center", valign: "middle", margin: 0.04 });
    if (i < ev.length - 1) arrow(s, x + 1.61, 1.82, 0.13, 0);
  });
  const ba = [
    ["Before  ·  batch run 06:10", [["Hardship", "45  possible"], ["Break risk", "0.58"], ["Action", "Call after payday"]], C.accent4, 0.6],
    ["After  ·  call ends 14:12, decision 3 s later", [["Hardship", "85  severe"], ["Break risk", "0.81"], ["Action", "Specialist referral, pressure blocked"]], C.accent3, 4.55],
  ];
  ba.forEach(([h, rows, col, x]) => {
    card(s, x, 2.6, 3.55, 2.75, { fill: C.background1, line: col, lw: 1.5 });
    T(s, h, { x: x + 0.2, y: 2.72, w: 3.2, h: 0.35, fontSize: 12, bold: true, color: col });
    rows.forEach(([a, b], j) => {
      T(s, a, { x: x + 0.2, y: 3.15 + j * 0.68, w: 3.2, h: 0.28, fontSize: 10, color: C.accent4 });
      T(s, b, { x: x + 0.2, y: 3.4 + j * 0.68, w: 3.2, h: 0.38, fontSize: 14, bold: true, color: C.text2 });
    });
  });
  arrow(s, 4.18, 3.95, 0.34, 0, C.accent3);
  T(s, "Evidence: \"I still have no full shifts. I can do $800 by October 2nd.\"  Audit: features_updated, rescored, decision_changed, hardship_routed.", { x: 0.6, y: 5.45, w: 7.5, h: 0.6, fontSize: 11, italic: true, color: C.text1 });
  T(s, "Production: Kafka / Event Hubs  →  stream processor  →  online feature store (Redis / Feast)  →  model endpoint. Same logic, different runtime.", { x: 0.6, y: 6.15, w: 7.5, h: 0.6, fontSize: 11, color: C.accent4 });
  const rules = [["robot", "The LLM never decides", "It turns text into structured facts. Code does the rest."], ["check", "Evidence or it didn't happen", "A claim without a verbatim quote is dropped."], ["shield", "Safe failure", "On timeout or invalid output: keep the previous decision, flag for review."], ["clock", "Idempotent and fast", "Same event_id changes nothing. About 2-4 s end to end."]];
  rules.forEach(([k, h, d], i) => {
    const y = 2.6 + i * 1.08;
    iconCircle(s, k, 8.45, y, 0.5);
    T(s, h, { x: 9.1, y: y - 0.05, w: 3.65, h: 0.35, fontSize: 13, bold: true, color: C.text2 });
    T(s, d, { x: 9.1, y: y + 0.3, w: 3.65, h: 0.6, fontSize: 11 });
  });
  s.addNotes("Our demo moment. We drop in a new transcript. The LLM extracts hardship with quoted evidence, features update, the model re-scores and the action changes from a call to a specialist referral in seconds, fully audited.");

  // =====================================================================
  // 12. AI POWER
  pres.addSection({ title: "AI and governance" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "AI and governance" });
  s.addText("How the AI is powered: the LLM proposes, code decides", { placeholder: "title" });
  const ah = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  s.addTable([
    [ah("Job"), ah("Engine"), ah("Why")],
    ["Extract features from notes and transcripts", "Hosted LLM, fast tier, JSON schema output", "High volume, cheap, structured"],
    ["Question → semantic query (Ask)", "Stronger LLM", "Reasoning over metrics and time windows"],
    ["RAG answers, summaries, override insights", "Stronger LLM", "Writing quality; numbers always from SQL"],
    ["Embeddings for RAG", "Local sentence-transformers", "Customer text never leaves for indexing"],
    ["Promise-break risk", "LightGBM + calibration + SHAP", "Accurate on tables, explainable, real probabilities"],
    ["Channel and timing", "Response rates by channel and hour", "Simple, transparent, enough signal"],
    ["Decision policy", "Deterministic rules in versioned YAML", "Auditable, owned by the business"],
  ], { x: 0.6, y: 1.4, w: 8.0, colW: [2.9, 2.6, 2.5], fontSize: 12.5, rowH: 0.62, border: { type: "solid", color: H.lt2, pt: 1 }, color: C.text1, margin: 0.06, valign: "middle" });
  card(s, 8.9, 1.4, 3.85, 5.1, { fill: C.background2, line: C.accent5 });
  iconCircle(s, "code", 9.1, 1.58, 0.5);
  T(s, "Controls around every model", { x: 9.7, y: 1.6, w: 2.95, h: 0.5, fontSize: 14, bold: true, color: C.text2 });
  T(s, bullets([
    "One client wrapper: swap providers, or run a local Llama / Qwen where data residency matters",
    "PII redacted before every LLM call",
    "Cache by text hash + prompt version; spend cap; limited retries",
    "Every LLM feature has a prompt version and an evaluation against hand labels",
    "Strictest target: recall on severe hardship",
    "Model trained on a time split, calibrated, promoted only after human approval",
  ], { gap: 8 }), { x: 9.1, y: 2.2, w: 3.5, h: 4.2, fontSize: 12.5 });
  s.addNotes("Each job gets the right engine. LLMs read and interpret; LightGBM and deterministic policy decide. Embeddings run locally. Every LLM feature is versioned and evaluated.");

  // =====================================================================
  // 13. GOVERNANCE + OVERRIDE INTELLIGENCE
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "AI and governance" });
  s.addText("Governance you can see in the product", { placeholder: "title" });
  const gov = [
    ["file", "Data (Layer 1)", ["Published data contract", "9 quality rules, drift check", "PII class per column, lineage", "Trust score per customer"]],
    ["lock", "Ask (Layer 2)", ["SELECT-only, allow-list, LIMIT", "PII and protected columns blocked", "SQL and sources on every answer", "Refusals with reasons"]],
    ["scale", "Decisions (Layer 3)", ["No protected attributes, proven by a test", "Hardship circuit breaker enforced in the API", "Consent and contact hours respected", "Reasons + counterfactual per decision"]],
    ["user", "Human oversight", ["Approve or override, reason code required", "Specialist-only hardship approvals", "Audit log of every event", "Outcomes compared across segments"]],
  ];
  gov.forEach(([k, h, items], i) => {
    const x = 0.6 + (i % 2) * 3.75, y = 1.4 + Math.floor(i / 2) * 2.75;
    card(s, x, y, 3.6, 2.6);
    iconCircle(s, k, x + 0.2, y + 0.2, 0.5);
    T(s, h, { x: x + 0.8, y: y + 0.24, w: 2.7, h: 0.4, fontSize: 14, bold: true, color: C.text2 });
    T(s, bullets(items, { gap: 6 }), { x: x + 0.2, y: y + 0.85, w: 3.25, h: 1.65, fontSize: 12.5 });
  });
  card(s, 8.25, 1.4, 4.5, 5.35, { fill: C.background2, line: C.accent1, lw: 1.5 });
  iconCircle(s, "repeat", 8.45, 1.58, 0.55, C.accent2);
  T(s, "Override intelligence", { x: 9.1, y: 1.62, w: 3.5, h: 0.45, fontFace: THEME.headFontFace, fontSize: 18, bold: true, color: C.text2 });
  ["Override with reason code", "Track the outcome", "Spot the pattern", "Propose a policy change", "Human approves"].forEach((t, i) => {
    chip(s, `${i + 1}  ${t}`, 8.45, 2.35 + i * 0.5, 4.1, 0.4, { fill: i === 4 ? C.accent1 : C.background1, color: i === 4 ? C.background1 : C.text2, size: 11, align: "left" });
  });
  T(s, "\"Agents changed call to payment plan for self-employed customers in 7 of 10 cases, and those plans were kept more often. Proposed: payment plan by default for this group. Awaiting approval.\"", { x: 8.45, y: 4.95, w: 4.1, h: 1.3, fontSize: 11.5, italic: true });
  T(s, "Illustrative insight. The model never retrains itself silently.", { x: 8.45, y: 6.28, w: 4.1, h: 0.35, fontSize: 9.5, color: C.accent4 });
  s.addNotes("Governance is a tab in the product, not a slide. Override intelligence turns human-in-the-loop into something measurable that improves policy, always with a human approving the change.");

  // =====================================================================
  // 14. IMPLEMENTATION PLAN
  pres.addSection({ title: "Plan" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Plan" });
  s.addText("Implementation plan: 36 hours, two people, contract-first", { placeholder: "title" });
  const phases = ["Day 1 morning", "Day 1 afternoon", "Day 1 evening", "Day 2 morning", "Day 2 afternoon"];
  const laneA = ["Load data; raw → curated; identity resolution", "Golden C360, trust score, contract + DQ report", "Feature store; LLM features + evaluation", "Risk model, hardship, affordability, policy, live re-decision", "Integrate, audit log, freeze at 17:00, demo video"];
  const laneB = ["Semantic layer, Ask parser, SQL guard", "RAG with citations; Ask UI; C360 view", "Benchmark ≥ 85%; switch to real data", "NBA queue, decision-changed card, override flow", "Governance tab, polish, final deck"];
  phases.forEach((p, i) => chip(s, p, 2.4 + i * 2.07, 1.35, 1.97, 0.4, { fill: C.text2, color: C.background1, size: 11 }));
  [["Person A", "pipeline, decisioning, API", laneA, C.background2], ["Person B", "Ask, RAG, agent UI", laneB, C.background1]].forEach(([n, r, lane, fill], j) => {
    const y = 1.9 + j * 1.35;
    T(s, n, { x: 0.6, y: y + 0.1, w: 1.7, h: 0.35, fontSize: 14, bold: true, color: C.text2 });
    T(s, r, { x: 0.6, y: y + 0.45, w: 1.7, h: 0.6, fontSize: 10, color: C.accent4 });
    lane.forEach((t, i) => { card(s, 2.4 + i * 2.07, y, 1.97, 1.2, { fill, line: C.accent5, noShadow: true }); T(s, t, { x: 2.48 + i * 2.07, y: y + 0.06, w: 1.82, h: 1.1, fontSize: 10.5, valign: "middle" }); });
  });
  T(s, "Already done during the design phase", { x: 0.6, y: 4.75, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.text2 });
  ["API contract: 11 endpoints", "Data contract: 9 quality rules", "Ask schema allow-list", "Mock data: 10 customers", "Architecture document", "AI-agent workflow + reporting"].forEach((t, i) => {
    chip(s, t, 0.6 + (i % 3) * 2.05, 5.15 + Math.floor(i / 3) * 0.5, 1.95, 0.42, { fill: C.background2, color: C.text2, size: 10.5 });
  });
  card(s, 6.95, 4.75, 5.8, 2.05, { fill: C.background2, line: C.accent5, noShadow: true });
  iconCircle(s, "people", 7.1, 4.9, 0.5);
  T(s, "How we build", { x: 7.72, y: 4.92, w: 4.9, h: 0.4, fontSize: 14, bold: true, color: C.text2 });
  T(s, bullets(["Contract first: API, schema and mocks let UI and backend start in parallel at hour one", "AI agents (Claude Code, Antigravity, ChatGPT) build in owned folders and post progress reports to the repo", "A lead agent reviews the reports, checks the work and issues the next instructions"], { gap: 4 }), { x: 7.1, y: 5.4, w: 5.5, h: 1.35, fontSize: 10.5 });
  s.addNotes("Two lanes, five blocks. Contracts and mock data already exist, so both people build in parallel from the first hour. Our AI agents work in owned folders and report to the repo; a lead agent reviews and directs.");

  // =====================================================================
  // 15. EVALUATION + SCOPE
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Plan" });
  s.addText("How we will prove it works", { placeholder: "title" });
  const stats = [["≥ 85%", "Ask benchmark pass rate", "20+ questions on real data"], ["100%", "must-refuse questions refused", "PII, protected, writes, injection"], ["≥ 0.90", "recall on severe hardship", "vs hand-labelled notes (target)"], ["AUC", "+ calibration plot", "break-risk model, time-split test"], ["9 rules", "data quality checked", "on every pipeline run"]];
  stats.forEach(([a, b, c], i) => {
    const x = 0.6 + i * 2.45;
    card(s, x, 1.4, 2.3, 2.1);
    T(s, a, { x: x + 0.15, y: 1.5, w: 2.0, h: 0.85, fontSize: 34, bold: true, color: C.accent1, fontFace: THEME.headFontFace, align: "center", valign: "middle" });
    T(s, b, { x: x + 0.15, y: 2.38, w: 2.0, h: 0.5, fontSize: 12, bold: true, color: C.text2, align: "center" });
    T(s, c, { x: x + 0.15, y: 2.88, w: 2.0, h: 0.5, fontSize: 10, color: C.accent4, align: "center" });
  });
  T(s, "These are targets we will measure and report honestly, including misses.", { x: 0.6, y: 3.6, w: 12.1, h: 0.35, fontSize: 11, italic: true, color: C.accent4 });
  card(s, 0.6, 4.1, 6.0, 2.7, { fill: C.background2, line: C.accent1, lw: 1.5, noShadow: true });
  T(s, "MVP: must ship", { x: 0.8, y: 4.2, w: 5.6, h: 0.4, fontSize: 15, bold: true, color: C.accent1 });
  T(s, bullets(["C360 with identity resolution, trust score, contract and DQ report", "Ask over governed metrics, SQL shown, refusals, RAG citations", "NBA with risk, hardship and affordability, plain-English reasons", "Approve / override with reason, specialist-only hardship, audit log", "Live re-decisioning on a new transcript"], { gap: 6 }), { x: 0.8, y: 4.65, w: 5.6, h: 2.1, fontSize: 13 });
  card(s, 6.75, 4.1, 6.0, 2.7, { fill: C.background1, line: C.accent5, noShadow: true });
  T(s, "Stretch: cut first if time is short, in this order", { x: 6.95, y: 4.2, w: 5.6, h: 0.4, fontSize: 15, bold: true, color: C.accent4 });
  T(s, bullets(["Counterfactual explanations", "Override insights (keep the reason codes)", "Free-form SQL fallback in Ask", "Channel and timing model beyond response rates"], { num: true, gap: 6 }), { x: 6.95, y: 4.65, w: 5.6, h: 2.1, fontSize: 13 });
  s.addNotes("Measurable targets for every AI component, reported honestly. A clear MVP and an ordered cut list, so the demo works even if time runs short.");

  // =====================================================================
  // 16. BUSINESS VALUE + SCALE
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Plan" });
  s.addText("Business value and the path to scale", { placeholder: "title" });
  const bh = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  s.addTable([
    [bh("KPI"), bh("Assumed baseline"), bh("Mechanism"), bh("Assumed target")],
    ["Promise-kept rate", "60%", "Affordable plans, payday timing", "+5 pts"],
    ["Roll rate", "current level", "Early, affordable plans before a roll", "lower"],
    ["Contact efficiency", "1 in 5 attempts", "Best channel and hour", "+15% relative"],
    ["Agent handle time", "10 min / account", "C360 + pre-built reasons", "−2 min (−20%)"],
    ["Analyst question", "days", "Ask with visible SQL", "minutes"],
  ], { x: 0.6, y: 1.4, w: 7.6, colW: [1.75, 1.6, 2.75, 1.5], fontSize: 11.5, rowH: 0.5, border: { type: "solid", color: H.lt2, pt: 1 }, color: C.text1, margin: 0.06, valign: "middle" });
  card(s, 0.6, 4.65, 7.6, 1.6, { fill: C.background2, line: C.accent5, noShadow: true });
  T(s, [{ text: "≈ 20", options: { fontSize: 40, bold: true, color: C.accent1, fontFace: THEME.headFontFace } }], { x: 0.8, y: 4.75, w: 1.6, h: 1.0, valign: "middle" });
  T(s, "agent-equivalents of capacity freed in a 100-agent team if handle time drops from 10 to 8 minutes: the same workload with about 80 agents.", { x: 2.45, y: 4.8, w: 5.6, h: 1.3, fontSize: 12.5, valign: "middle" });
  T(s, "All baselines and targets are our assumptions to be validated, not bank figures.", { x: 0.6, y: 6.4, w: 7.6, h: 0.35, fontSize: 10.5, italic: true, color: C.accent4 });
  T(s, "Prototype  →  production", { x: 8.55, y: 1.4, w: 4.2, h: 0.4, fontSize: 15, bold: true, color: C.text2 });
  [["DuckDB file", "Cloud warehouse + dbt / Airflow"], ["Batch rebuild", "Streaming CDC / Kafka"], ["Feature table", "Feature store service (Feast / Redis)"], ["Local model", "Registry, drift + fairness monitoring"], ["Single FastAPI", "Containers, SSO, role-based access"]].forEach(([a, b], i) => {
    const y = 1.9 + i * 0.9;
    chip(s, a, 8.55, y, 1.45, 0.6, { fill: C.background2, color: C.text2, size: 10.5 });
    arrow(s, 10.03, y + 0.3, 0.3, 0);
    chip(s, b, 10.36, y, 2.39, 0.6, { fill: C.accent1, color: C.background1, size: 10 });
  });
  s.addNotes("Value comes from more kept promises, fewer rolls, better contact efficiency and shorter handle time. Every number is an assumption we label as such. The same logic scales onto a warehouse, streaming and a feature store service.");

  // =====================================================================
  // 17. CLOSING
  pres.addSection({ title: "Close" });
  s = pres.addSlide({ masterName: "DARK", sectionTitle: "Close" });
  s.addText("The three-minute demo", { placeholder: "title" });
  const demo = [
    "Open R. Mitchell's Collections 360: nine sources, one ID, trust 0.94.",
    "Ask \"who will break a promise this week?\" and see the ranked list with its SQL.",
    "Ask \"who mentioned job loss?\" and see cited call quotes. Ask for his SIN and see a refusal.",
    "Drop in his new call transcript: hardship 45 → 85, the action changes to a specialist referral.",
    "Show M. Roy: high risk too, but he can afford it, so a call the day after payday.",
    "Override another case with a reason. The Governance tab shows the audit trail and fairness checks.",
  ];
  demo.forEach((t, i) => {
    const y = 1.75 + i * 0.68;
    s.addShape(S.OVAL, { x: 0.8, y, w: 0.46, h: 0.46, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    T(s, String(i + 1), { x: 0.8, y: y + 0.02, w: 0.46, h: 0.42, fontSize: 14, bold: true, color: C.text2, align: "center", valign: "middle", margin: 0 });
    T(s, t, { x: 1.45, y: y + 0.02, w: 10.8, h: 0.45, fontSize: 15, color: C.background1, valign: "middle" });
  });
  T(s, "Resolve360: stop chasing, start resolving.", { x: 0.8, y: 6.0, w: 11, h: 0.55, fontFace: THEME.headFontFace, fontSize: 24, italic: true, bold: true, color: C.accent2 });
  T(s, "Team Hack It  ·  Educational prototype on synthetic data", { x: 0.8, y: 6.6, w: 11, h: 0.35, fontSize: 11, color: C.accent5 });
  s.addNotes("The demo walks one customer through every layer and ends on governance. Thank you.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
