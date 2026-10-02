# Apex Collections 360 Design System
**Educational Prototype — Banking & Debt Resolution UI**  
**Role:** Person B (UI & Frontend Lead)  

---

## 1. Visual Identity & Color Palette

The design system conveys established institutional trust, high data density, clear visual hierarchy, and instant risk legibility.

| Token Name | Hex Code | Tailwind Name | Role & Usage | Contrast vs Background |
|---|---|---|---|---|
| **Deep Navy** | `#141B2D` | `brand-navy` | Primary app header, heavy titles, primary buttons, high-contrast text | `14.2:1` (AAA compliant) |
| **Warm Cream** | `#F6F2EA` | `brand-cream` | Canvas background, soft workspace surface | Base |
| **Pure White** | `#FFFFFF` | `white` | Card backgrounds, table containers, popover surfaces | Clean separation |
| **Red-Orange** | `#C73E1D` | `brand-orange` | High break risk, severe hardship, 60+ DPD, override warnings | `5.2:1` on white (AA) |
| **Amber** | `#FFD580` | `brand-amber` | Medium break risk, 31–60 DPD, pending approvals, semantic tokens | Accent & highlights |
| **Amber Dark** | `#D97706` | `brand-amber-dark` | Text on amber chips, warning icons | `4.8:1` on cream |
| **Forest Green** | `#2D6A4F` | `brand-green` | Current bucket (0 DPD), approved decisions, passed DQ rules | `5.6:1` on white |
| **Slate Dark** | `#334155` | `slate-700` | Secondary body text, table cells | `7.8:1` on cream |
| **Slate Muted** | `#64748B` | `slate-500` | Captions, metadata, placeholder text | `4.5:1` on white |
| **Border Gray** | `#E2E8F0` | `slate-200` | Card borders, table dividers | Subtle structure |

---

## 2. Typography

- **Headings & Display:** Serif typeface (`Source Serif 4`, `Merriweather`, `Georgia`). Lends authoritative banking gravitas, editorial clarity, and distinguishes key customer figures.
- **Body & Controls:** Clean, high-legibility Sans-Serif (`Inter`, `system-ui`). Optimized for dense numbers, tables, badges, and micro-copy at 11–14px.
- **Code & SQL:** Monospace typeface (`JetBrains Mono`, `Fira Code`, `monospace`) for DuckDB queries, source IDs, and audit timestamps.

---

## 3. Delinquency Bucket & Risk Hierarchy

| Status / Bucket | Badge Style | Tailwind Classes |
|---|---|---|
| **Current (0 DPD)** | Subtle Green | `bg-emerald-50 text-emerald-800 border-emerald-200` |
| **Bucket 1 (1–30 DPD)** | Soft Yellow | `bg-amber-50 text-amber-800 border-amber-200` |
| **Bucket 2 (31–60 DPD)** | Warm Amber | `bg-orange-50 text-orange-800 border-orange-200` |
| **Bucket 3 (61–90 DPD)** | Crimson Red | `bg-rose-100 text-rose-800 border-rose-300 font-semibold` |
| **Bucket 4 (90+ DPD)** | Deep Burgundy | `bg-red-900 text-white font-bold` |
| **Severe Hardship** | High-Alert Orange | `bg-[#C73E1D] text-white font-bold animate-pulse-subtle` |
| **Hardship (Possible)** | Caution Amber | `bg-amber-100 text-amber-900 border-amber-300` |

---

## 4. Reusable Component Catalog

1. **`Card`:** Container with subtle shadow (`shadow-sm`), rounded corners (`rounded-lg`), white background, and crisp 1px border. Supports optional accent strips (navy, red, amber, green).
2. **`Table`:** High-density, accessible tabular data grid with sticky header option, zebra rows, right-aligned currency, and keyboard navigable rows.
3. **`Chip`:** Compact, interactive badge for consent channels, semantic filters, and search suggestions. Clickable with optional delete `(x)` icon.
4. **`Button`:**
   - Primary: Solid Navy (`#141B2D`) with white text and focus rings.
   - Danger / Override: Red-Orange (`#C73E1D`).
   - Success / Approve: Forest Green (`#2D6A4F`).
   - Secondary / Ghost: Border slate with hover highlight.
5. **`Badge`:** Color-coded categorical tags for DPD buckets, hardship status, decision statuses (`pending`, `approved`, `overridden`).
6. **`Drawer`:** Slide-over detail panel (slides from right on desktop, bottom sheet on mobile) for account explanations, SHAP drivers, and decision review.
7. **`CodeBlock`:** Formatted monospace container with syntax highlighting, line numbers, and instant "Copy SQL" button.
8. **`Skeleton`:** Shimmer loading state mirroring the layout geometry of headers, tables, and metric cards.
9. **`EmptyState`:** Contextual illustration/icon with clear explanation and immediate action button (e.g. "Reset filters" or "Ask sample question").
10. **`ErrorState`:** Accessible alert banner with technical details accordion and a "Retry" button.

---

## 5. Responsive Behavior & Viewport Standards

- **375px (Mobile Phone):**
  - Persistent top navigation collapses to compact title + icon menu.
  - Role switcher and Customer switcher accessible via quick tap.
  - Tables scroll horizontally with a frozen customer ID column.
  - Drawers expand to full-screen modals.
  - Action buttons expand to full container width (`w-full`).
- **768px (Tablet):**
  - 2-column wrapping grids.
  - Side drawers occupy 50% screen width.
- **1280px+ (Desktop):**
  - Full operational workstation layout.
  - Multi-column dashboards (C360 products + lineage side by side).
  - Side drawers occupy 440–480px width, preserving background context.

---

## 6. Accessibility & Compliance (WCAG 2.1 AA)

- All interactive controls have visible focus rings (`focus:ring-2 focus:ring-offset-2 focus:ring-[#141B2D]`).
- Screen reader friendly labels (`aria-label`) on icon buttons and expandable sections.
- Color is never used as the sole indicator of status (always paired with clear text labels and icons).
- Every page declares its document title and maintains a consistent landmark hierarchy (`header`, `main`, `footer`).
- Persistent legal disclaimer footer on every screen: `"Educational prototype — synthetic data only. Not endorsed by financial institutions."`
