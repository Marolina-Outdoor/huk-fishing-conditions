# 🎣 HUK Fishing Conditions App

A live "should I fish today?" widget for the HUK Shopify store. Pulls real weather,
marine, and tide data for the user's location, scores conditions 0–100 (the **Cast
Score**), explains *why*, and points to a license + gear. Works **coastal** (tide-driven)
and **inland** (solunar-driven).

> This folder is the project's home base / manifest. The widget's runtime files must
> live in the Shopify theme's `assets/` and `snippets/` folders (Shopify requirement),
> so they are **documented here, not moved**.

---

## Live previews (Vercel)

- **Real widget + test harness** (live data, city toggles, "How It Works" tab):
  https://huk-fishing.vercel.app/test/fishing-conditions-test.html
- **Design mockups** (static):
  - Original redesign: https://huk-fishing.vercel.app/test/redesign-mockup.html
  - Multi-placement: https://huk-fishing.vercel.app/test/placements.html
  - v2 (decision-first concept): https://huk-fishing.vercel.app/test/redesign-v2-placements.html

GitHub: `Marolina-Outdoor/huk-fishing-conditions` · branch `feature/7day-forecast`
Vercel alias must be re-pointed after each `npx vercel --prod` deploy:
`npx vercel alias <deployment-url> huk-fishing.vercel.app`

---

## File inventory (paths relative to theme root, one level up)

**Runtime (must stay in theme):**
- `../assets/fishing-conditions.js` — the widget (IIFE): data fetch, scoring, solunar, render, handlers
- `../assets/fishing-conditions.css` — all styles (light/dark theming, container-query placements)
- `../snippets/fishing-conditions-float.liquid` — the floating FAB button + panel
- `../assets/StyreneA-*.woff2`, `../assets/Manrope-VariableFont_wght.ttf` — brand fonts

**Demo / test (Vercel only — NOT part of the theme):**
- `../test/fishing-conditions-test.html` — test harness: mock city toggles, live API, light/dark/FAB previews, **How It Works** tab
- `../test/placements.html`, `../test/redesign-mockup.html`, `../test/redesign-v2-placements.html` — design mockups

> ⚠️ `../layout/theme.liquid` is intentionally **untouched** — nothing is wired into the
> live theme yet. This is a controlled-environment build.

---

## Data sources
- **Open-Meteo** — weather, wind, pressure, cloud cover, marine waves & sea-surface temp, 7-day outlook
- **NOAA CO-OPS** — tide predictions (nearest station)
- **Computed astronomy** — moon phase + solunar windows (SunCalc-derived, no third-party service)
- **OpenStreetMap / Nominatim** — coordinates → state for the license link

## The Cast Score
Weighted blend (coastal): Water Temp 18 · Tide 17 · Current 15 · Wind 14 · Pressure 12 · Surf 10 · Sky 8,
with realism caps (storms, high wind/surf, rapid pressure swings). Inland: Pressure 32 · Solunar 26 ·
Wind 20 · Sky 14 · Moon 8. Verdict tiers: **Drop Everything** (90+) · **Fish On** (75+) ·
**Worth the Trip** (60+) · **Grind It Out** (40+) · **Slow Pick** (20+) · **Skunked** (0+).

## Open items / next up
- Reconcile the Today Cast Score vs the 7-day "Today" score (two different formulas)
- Make the inland 7-day pane solunar-aware (currently weather/wave-based)
- Add a "next flood tide" line (data already available — next low → next high)
- Real lake water-temp source for inland (currently shows air temp)
- Decide placements to ship: Shopify section block, pop-out modal, FAB drawer
