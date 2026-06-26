# HUK Fishing Conditions — Design Handoff Spec

**For:** Harrison + design team
**Purpose:** Source-of-truth reference for a design pass on the weather/fishing-conditions widgets.
**Live preview:** https://huk-fishing-conditions.vercel.app/forecast
**Last updated:** 2026-06-26

> This documents the **current** built state so the team has accurate tokens, components, states, and measurements to design against. Pair it with the Figma starter file. When you mark up changes, note them against the component names below so they map cleanly back to code.

---

## 1. Surfaces (where the widget appears)

| Surface | What it is | File |
|---------|-----------|------|
| **Homepage Section** | Full-width section block, light or dark theme | `sections/fishing-conditions.liquid` |
| **Floating Widget (FAB)** | Bottom-right button → slide-up panel | `snippets/fishing-conditions-float.liquid` |
| **Landing Page** | Standalone weekly email/SMS forecast page | `test/fishing-conditions-test.html` (Vercel) |

All three share the same styles/logic: `assets/fishing-conditions.css`, `assets/fishing-conditions.js`.

---

## 2. Design Tokens

### Color (light theme)
| Token | Value | Use |
|-------|-------|-----|
| `--huk-navy` | `#0f4c81` | Primary brand navy |
| `--huk-navy-dark` | `#0e4174` | Headings, darker navy |
| `--huk-navy-body` | `#17314b` | Body text |
| `--huk-accent` | `#0581ff` | Accent / interactive blue |
| `--huk-sky` | `#29ABE2` | Sky blue (ring fill, highlights) |
| `--huk-teal` | `#00A99D` | Teal accent |
| `--huk-stat-bg` | `rgba(15,76,129,0.07)` | Condition card background |
| `--huk-border` | `rgba(15,76,129,0.12)` | Hairline borders |

### Color (dark theme overrides)
| Token | Value |
|-------|-------|
| `--huk-navy-body` | `#e8f0f8` |
| `--huk-navy-dark` | `#ffffff` |
| `--huk-stat-bg` | `rgba(255,255,255,0.08)` |
| `--huk-border` | `rgba(255,255,255,0.12)` |

### Hero gradient
`linear-gradient(165deg, #0b3766, #0f4c81 55%, #14527f)` + radial green glow bottom-right + subtle Barbed-U hook pattern overlay (white, 5% opacity).

### Verdict / Cast Score tier colors (0–100)
| Score | Verdict | Color |
|-------|---------|-------|
| 90–100 | Drop Everything | `#16a34a` |
| 75–89 | Fish On | `#65a30d` |
| 60–74 | Worth the Trip | `#ca8a04` |
| 40–59 | Grind It Out | `#d97706` |
| 20–39 | Slow Pick | `#ea580c` |
| 0–19 | Skunked | `#dc2626` |

### Typography
| Role | Font | Notes |
|------|------|-------|
| Display / numbers | `Styrene A` (Black/900) | Hero score, temps |
| Body / UI | `Manrope` | Labels, descriptions |
| Fallbacks | Arial, sans-serif | |

Key sizes: hero score `82px/900`, hero temp `26px/700`, verdict `26px/800`, landing score ring `42px/800`, section title `22px`.

### Geometry
- Corner radius: `--huk-radius: 10px` (cards), pills/badges use larger radii.
- Borders: 1px hairline at `--huk-border`.
- Barbed-U hook background pattern: tile `47×37`, viewBox `2.8 3.5 194.5 153.1`, white fill, **0.05 opacity** (recently design-tuned — keep subtle).

---

## 3. Components

### 3.1 Score Hero
- **Contents:** location + date (top row), big score number, verdict label, sub-line, Cast Score Scale meter, weather condition + temp (bottom row).
- **Background:** navy gradient + hook pattern.
- **States:** score drives the verdict text + meter dot position + color. Thunderstorm caps score at 20.

### 3.2 Cast Score Scale (meter)
- Horizontal gradient bar (red→green) with labeled stops: Skunked · Slow · Grind · Worth It · Fish On · Drop All.
- A dot marks current score position.

### 3.3 Tabs (Today / 7-Day)
- Two-segment toggle. Active = white (light) / dark fill (dark theme). "7-Day" shows a "★ Best [Day]" hint.

### 3.4 Condition Cards (grid of 6)
- Wind, Tide, Current, Water Temp, Surf, Pressure (coastal). Each: icon + label + value + qualitative rating (Excellent/Good/Fair) + ℹ️ info icon that opens sub-score detail.
- Inland mode swaps to: Pressure, Solunar, Wind, Sky, Moon, Air Temp.

### 3.5 7-Day Forecast Row
- Per day: name + date, weather icon + summary + wind, score bar, score number, confidence dot (● solid days 1–2, ◐ moderate 3–5, ○ estimated 6–7). "★ Best Day" badge on the top-scoring day.

### 3.6 Landing Page Hero
- HUK wordmark + "Weekly Fish Forecast" + date range, location, circular score ring ("Today's Score" / number / "out of 100"), verdict, sub-line, hook pattern background.

### 3.7 Floating FAB + Panel
- FAB: sky-blue pill, HUK logo + "Check Fishing Conditions". Opens a scrollable panel containing the hero + tabs + condition cards.

---

## 4. States to design for (each component)
- **Default / loaded**
- **Loading** (skeleton or spinner)
- **Error / no data** ("Location access required", API failure)
- **Empty** (no tide station nearby → Inland mode)
- **Light theme / Dark theme** (both must work)
- **Score extremes** (Skunked 0 → Drop Everything 100) — verify color + legibility at each tier
- **Responsive:** mobile-first; section is full-width, FAB panel ~340px, landing page max 680px.

---

## 5. Accessibility (current baseline — please preserve)
- Logo SVGs `aria-hidden`, FAB has `aria-label` + `aria-expanded` + `aria-controls`.
- Panel is `role="dialog"`. Section uses semantic headings.
- Maintain color contrast at all score tiers (the orange/red tiers on navy need checking).

---

## 6. How notes come back to me
Mark changes against the component names in §3 (e.g. "3.4 Condition Cards — increase value size to 18px, drop the qualitative rating"). Token changes → reference §2 names. Send the revised Figma file or annotated frames and I'll implement against the live code.
