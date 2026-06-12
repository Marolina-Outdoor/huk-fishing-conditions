# HUK Fishing Conditions Widget

A lightweight, dependency-free widget for Shopify that shows live local fishing conditions, tides, and a weighted cast score to customers while they shop.

**Live Preview:** [huk-fishing.vercel.app/test/fishing-conditions-test.html](https://huk-fishing.vercel.app/test/fishing-conditions-test.html)

---

## What It Does

- Detects the customer's location (with permission)
- Pulls live weather data from [Open-Meteo](https://open-meteo.com) — free, no API key
- Pulls tide predictions from [NOAA CO-OPS](https://tidesandcurrents.noaa.gov) — free, no API key
- Scores 7 fishing conditions (water temp, tide, current, wind, pressure, surf, visibility)
- Displays a 0–100 Cast Score with a label, summary sentence, and 6 condition cards
- Shows state-specific fishing license info based on the customer's location
- Available as a floating FAB button or an embeddable homepage section

---

## Cast Score Labels

| Score | Label | Meaning |
|---|---|---|
| 90–100 | Pack the Cooler | About as good as it gets |
| 75–89 | Fish On | Strong conditions with real potential |
| 60–74 | Wet a Line | Worth the trip with the right approach |
| 40–59 | Keep the Tip Up | Mixed bag — timing and technique matter |
| 20–39 | Bird's Nest | Tough conditions, manage expectations |
| 0–19 | Skunk Watch | Rough day, maybe scout instead |

---

## Files

| File | Purpose |
|---|---|
| `assets/fishing-conditions.js` | Core widget — all logic, scoring engine, HTML rendering |
| `assets/fishing-conditions.css` | All styles — brand colors, layout, responsive |
| `snippets/fishing-conditions-float.liquid` | Floating FAB button + slide-up panel (Shopify snippet) |
| `sections/fishing-conditions.liquid` | Embeddable homepage section (Shopify section) |
| `test/fishing-conditions-test.html` | Local test harness with mock locations |

---

## Local Development

Requires [Node.js](https://nodejs.org) installed.

```bash
# Install a simple static server (one time)
npm install -g serve

# Start the local server
npx serve -l 3333 .
```

Then open: [http://localhost:3333/test/fishing-conditions-test.html](http://localhost:3333/test/fishing-conditions-test.html)

Use the mock location buttons (Seattle, San Diego, Miami, etc.) to test without needing GPS access.

---

## Shopify Installation

> ⚠️ Not yet deployed to the live theme. Widget is in active development.

When ready to install:

1. Upload `assets/fishing-conditions.js` and `assets/fishing-conditions.css` to **Shopify Admin → Themes → Assets**
2. Upload `snippets/fishing-conditions-float.liquid` to **Snippets**
3. Add `{% render 'fishing-conditions-float' %}` before `</body>` in `layout/theme.liquid`
4. Optionally add `sections/fishing-conditions.liquid` to **Sections** for a homepage block

---

## How the Score Is Calculated

Each condition is scored 0–100 based on live data, then combined into a weighted average:

| Condition | Weight |
|---|---|
| Sea Surface Temp | 18% |
| Tide | 17% |
| Current | 15% |
| Wind | 14% |
| Pressure | 12% |
| Surf | 10% |
| Visibility | 8% |

If a data source is unavailable, its weight is dropped and the remaining weights are scaled up proportionally. Realism caps are applied for extreme conditions (thunderstorms, big surf, rapidly changing pressure, etc.).

---

## Data Sources

| Source | Data | Cost |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Weather + marine (waves, water temp) | Free, no key |
| [NOAA CO-OPS](https://tidesandcurrents.noaa.gov) | Tide predictions | Free, no key |
| [Nominatim/OSM](https://nominatim.org) | Reverse geocoding (coords → state) | Free, no key |

Data is cached in `sessionStorage` for 30 minutes to minimize API calls.

---

## Brand

- **Primary color:** `#0f4c81` (HUK Navy)
- **Fonts:** Styrene A (headings), Manrope (body) — loaded by Shopify theme
- Widget inherits theme fonts automatically when installed on Shopify
