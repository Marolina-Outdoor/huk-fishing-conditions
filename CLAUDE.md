# huk-com11MAY2026 — Claude Code Briefing

## What This Repo Is

This is the **live Huk.com Shopify theme** — a custom Liquid theme built on the Marolina/Acadaca base theme framework. It serves huk.com and all its regional variants (B2B, CA).

The repo also contains the **Fishing Conditions App** — a floating widget and standalone web app that shows real-time fishing conditions based on the user's location. This is the primary active development area.

**Owner:** Don Price (dprice@marolina.com) — Marolina Outdoor  
**GitHub:** https://github.com/Marolina-Outdoor/huk-fishing-conditions  
**Shopify Store:** huk.com  
**Vercel App:** huk-fishing-conditions (Vercel project — the standalone Fishing Conditions web app)

---

## Repo Structure

```
assets/          Standard Shopify theme assets (CSS/JS). 
                 Fishing Conditions widget files are prefixed: fishing-conditions.*
config/          Theme settings (settings_data.json, settings_schema.json, markets.json)
layout/          theme.liquid (main layout), password.liquid
locales/         Translation strings (en, de, es, fr, it, nl, tr)
sections/        Shopify sections. Key: fishing-conditions.liquid
snippets/        Reusable Liquid snippets. Key: fishing-conditions-float.liquid
templates/       Page/product/collection templates (JSON + Liquid)
test/            HTML mockup files for local widget development (no Shopify needed)
Fishing Conditions App/   Project manifest and home base for the app feature
.claude/         Claude Code settings (launch.json runs local test server on port 3333)
.vercel/         Vercel project config (projectId: prj_6vLbCSA92xBUVBygkKxpOP5khI8g)
```

---

## Active Work in Progress

**Branch:** `feature/7day-forecast`  
**Status:** Pushed to GitHub, ahead of main

### Fishing Conditions Widget
A floating FAB button on huk.com that opens a fishing conditions panel. Features built:
- Current conditions (tide, wind, swell, solunar)
- 7-day forecast tab
- Inland mode (solunar-only for freshwater fishing)
- Why? info drawer explaining scores
- Verdict score system (named scoring A)
- Gradient hero design, line icons, segmented tabs
- ADA Phase 1 compliance fixes
- Responsive (mobile-first)
- Placements: drawer, modal, and Shopify section variants

**Key widget files:**
- `assets/fishing-conditions.js` — main widget logic
- `assets/fishing-conditions.css` — widget styles
- `sections/fishing-conditions.liquid` — Shopify section wrapper
- `snippets/fishing-conditions-float.liquid` — FAB float button
- `test/fishing-conditions-test.html` — standalone test page (run with `npx serve -l 3333 .`)

**Vercel deployment** of the standalone app is at the huk-fishing-conditions Vercel project. Push to `feature/7day-forecast` may trigger a Vercel preview deployment — this is NOT the live Shopify theme.

---

## Related Repos

**marolina-themes** (`~/Desktop/Visual Studio/Huk Theme/marolina-themes`)  
The Acadaca/Marolina base theme this repo was derived from. When base theme updates land there, they need to be manually ported here. The fishing conditions files have been copied to marolina-themes as well.

---

## Rules & Gotchas

**NEVER run `shopify theme push` without explicit confirmation from Don.**  
This deploys directly to the live huk.com store. There is no staging gate on this repo.

**Never commit directly to `main`.** Always work on feature branches. The branch naming convention from the base theme is `feature/ticket-id` or `feature/description`.

**The `.gitignore` only excludes:** `.DS_Store`, `node_modules/`, `*.log`, `.vercel`  
Everything else (all theme files) is now tracked — this was intentional as of June 2026.

**To run the widget locally:**
```bash
npx serve -l 3333 .
# Then open test/fishing-conditions-test.html in browser
```

**Git identity:** Make sure your global git config is set:
```bash
git config --global user.name "Don Price"
git config --global user.email "dprice@marolina.com"
```

**The `_archive/` folder** at `../` (parent of this repo) is for old theme snapshots. The `huk-com11MAY2026.zip` in the parent is the original May 2026 migration zip — safe to archive or delete now that GitHub is the source of truth.

---

## Context Files

- `~/Documents/HUK/Claude - Shop Functions/` — Shopify scripts, HUK context decisions doc, discount plan
- `~/Documents/HUK/Claude - Shop Functions/HUK_Context_Decisions.docx` — key product/UX decisions
- `~/Documents/HUK/Claude - Shop Functions/HUK_Discount_Plan.docx` — discount strategy
- `~/Documents/HUK/Claude - Shop Functions/shopify-scripts.rb` — legacy Shopify Scripts (pre-Functions)

---

## Machine Setup (M5 MacBook Air, migrated June 2026)

- Node/NVM: working
- Homebrew: working  
- Claude Code: authenticated as Don-Marolina
- gh CLI: authenticated as Don-Marolina
- Previous machine: M3 MacBook Pro (still intact as of migration)
