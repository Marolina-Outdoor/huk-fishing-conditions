/**
 * HUK Fishing Conditions Widget
 * Data sources:
 *   - Open-Meteo (weather + marine)  — free, no key
 *   - NOAA CO-OPS API (tides)        — free, no key
 *   - Nominatim / OSM (state lookup) — free, no key
 *   - Zippopotam.us (zip → state)    — free, no key
 */

(function () {
  'use strict';

  const CACHE_KEY = 'huk_fishing_conditions_v3';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  const CONDITION_INFO = {
    wind:          { icon: '💨', title: 'Why Wind Matters',          sweetSpot: 'Ideal: 5–15 mph. Calmer than 5 can be glassy and spooky. Above 25 mph most anglers call it a day.',                                                                            weight: '14%' },
    tide:          { icon: '🌊', title: 'Why Tide Matters',          sweetSpot: 'Best: Incoming within 2 hrs of high, or outgoing within 2 hrs of low. Slack water (±30 min of the change) scores lowest.',                                                       weight: '17%' },
    current:       { icon: '🔄', title: 'Why Current Matters',       sweetSpot: 'Ideal: 0.5–1.5 knots. Too slow and fish have time to inspect the bait. Faster than 3 knots and most presentations lose their action.',                                          weight: '15%' },
    seaSurfaceTemp:{ icon: '🌡️', title: 'Why Water Temp Matters',    sweetSpot: 'General saltwater sweet spot: 65–84°F. Below 55°F most inshore fish become sluggish. Above 88°F oxygen stress sets in.',                                                        weight: '18%' },
    surf:          { icon: '🏄', title: 'Why Surf Matters',          sweetSpot: 'Ideal: Under 2 ft for shore or kayak; under 4 ft for small boats. Above 6 ft conditions become dangerous for most nearshore fishing.',                                           weight: '10%' },
    pressure:      { icon: '📊', title: 'Why Pressure Matters',      sweetSpot: 'Best: Slowly falling pressure over 3–6 hrs. Stable high pressure is also good. Rapid drops or rapid rises both tend to shut down feeding.',                                      weight: '12%' },
    visibility:    { icon: '👁️', title: 'Why Sky Conditions Matter', sweetSpot: 'Overcast and partly cloudy typically score higher than full sun. Fog and heavy rain reduce visibility enough to hurt most presentations.',                                        weight: '8%'  },
    solunar:       { icon: '🌙', title: 'Why Solunar Matters',        sweetSpot: 'Plan around the major windows — roughly 2 hrs each, twice a day, when the moon is overhead or underfoot. Minor windows track moonrise and moonset.',                            weight: '26%' },
    moon:          { icon: '🌙', title: 'Why Moon Phase Matters',     sweetSpot: 'Feeding activity tends to peak near the new and full moon, when solunar windows are strongest.',                                                                            weight: '8%'  },
  };

  // ── Line-icon set (SF-Symbols style) ────────────────────────
  const LINE_ICON = {
    wind:          '<path d="M3 8h9.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h13a3 3 0 1 1-3 3"/><path d="M3 16h7a2 2 0 1 1-2 2"/>',
    tide:          '<path d="M2 9c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0"/><path d="M2 14c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0"/>',
    current:       '<path d="M4 8.5a8 8 0 0 1 13.5-2.8L20 8"/><path d="M20 4v4h-4"/><path d="M20 15.5a8 8 0 0 1-13.5 2.8L4 16"/><path d="M4 20v-4h4"/>',
    seaSurfaceTemp:'<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a3.6 3.6 0 1 1-4 0z"/><line x1="12" y1="13" x2="12" y2="8.5"/>',
    surf:          '<path d="M21 9.5C18.7 5.2 13.2 4.6 10 8c-2.1 2.2-1.7 5.4.5 7 1.8 1.3 4.3.6 4.8-1.4.4-1.5-.6-2.8-2-3"/><path d="M2.5 17.5c3 2.2 6.5 2.2 9.5 0"/>',
    pressure:      '<path d="M4 14a8 8 0 1 1 16 0"/><line x1="12" y1="14" x2="16" y2="10.5"/><circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none"/>',
    visibility:    '<circle cx="8" cy="8" r="3"/><path d="M8 2.5V4M2.5 8H4M4.3 4.3l1 1"/><path d="M9 19a3.5 3.5 0 0 1 0-7 4.5 4.5 0 0 1 8.6-1A3.2 3.2 0 0 1 18 19z"/>',
    humidity:      '<path d="M12 3s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9z"/>',
    skyCover:      '<path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.6-1.3A3.8 3.8 0 0 1 18 18z"/>',
    pin:           '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    nav:           '<path d="M3 11l18-8-8 18-2-8-8-2z"/>',
    solunar:       '<circle cx="12" cy="12" r="7"/><path d="M12 5a7 7 0 0 0 0 14z" fill="currentColor" stroke="none"/>',
    moon:          '<path d="M17 4a8 8 0 1 0 3 13A9 9 0 0 1 17 4z"/>',
  };
  function lineSvg(key, cls) {
    const p = LINE_ICON[key];
    if (!p) return '';
    return `<svg class="${cls || 'huk-fc-ln'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }

  // ── NOAA tide stations ──────────────────────────────────────
  // [lat, lon, stationId, label]
  const NOAA_STATIONS = [
    [47.6, -122.3, '9447130', 'Seattle, WA'],
    [37.8, -122.5, '9414290', 'San Francisco, CA'],
    [32.7, -117.2, '9410170', 'San Diego, CA'],
    [34.0, -118.2, '9410660', 'Los Angeles, CA'],
    [45.5, -122.7, '9439040', 'Astoria, OR'],
    [21.3, -157.9, '1612340', 'Honolulu, HI'],
    [29.3, -94.8,  '8771341', 'Galveston, TX'],
    [29.9, -90.1,  '8761724', 'New Orleans, LA'],
    [25.8, -80.2,  '8723170', 'Miami Beach, FL'],
    [30.3, -81.7,  '8720219', 'Jacksonville, FL'],
    [32.1, -81.0,  '8670870', 'Savannah, GA'],
    [32.8, -79.9,  '8665530', 'Charleston, SC'],
    [34.2, -77.9,  '8658120', 'Wilmington, NC'],
    [36.9, -76.3,  '8638863', 'Norfolk, VA'],
    [38.9, -77.0,  '8594900', 'Washington, DC'],
    [39.4, -75.6,  '8551910', 'Reedy Point, DE'],
    [40.7, -74.0,  '8518750', 'The Battery, NY'],
    [41.5, -71.3,  '8452660', 'Newport, RI'],
    [42.4, -71.1,  '8443970', 'Boston, MA'],
    [44.7, -67.0,  '8413320', 'Bar Harbor, ME'],
    [61.2, -149.9, '9455920', 'Anchorage, AK'],
  ];

  // ── State fishing license URLs ──────────────────────────────
  const LICENSE = {
    AL: { name: 'Alabama',        url: 'https://www.outdooralabama.com/licenses-and-fees/fishing' },
    AK: { name: 'Alaska',         url: 'https://www.adfg.alaska.gov/sf/FishingLicense/' },
    AZ: { name: 'Arizona',        url: 'https://www.azgfd.com/licensing/' },
    AR: { name: 'Arkansas',       url: 'https://www.agfc.com/en/licensing/' },
    CA: { name: 'California',     url: 'https://www.wildlife.ca.gov/Licensing/Fishing' },
    CO: { name: 'Colorado',       url: 'https://cpw.state.co.us/buyapply/Pages/Fishing.aspx' },
    CT: { name: 'Connecticut',    url: 'https://ct.buygtlicenses.com/' },
    DE: { name: 'Delaware',       url: 'https://www.fw.delaware.gov/Fishing/Pages/FishingLicenses.aspx' },
    FL: { name: 'Florida',        url: 'https://gooutdoorsflorida.com/' },
    GA: { name: 'Georgia',        url: 'https://gooutdoorsgeorgia.com/' },
    HI: { name: 'Hawaii',         url: 'https://dlnr.hawaii.gov/dar/fishing/freshwater-fishing/licenses/' },
    ID: { name: 'Idaho',          url: 'https://idfg.idaho.gov/licenses/' },
    IL: { name: 'Illinois',       url: 'https://www.dnr.illinois.gov/LicensePermitCatalog/' },
    IN: { name: 'Indiana',        url: 'https://www.in.gov/dnr/fish-and-wildlife/licenses-and-fees/' },
    IA: { name: 'Iowa',           url: 'https://www.iowadnr.gov/Fishing/Fishing-Regulations/Fishing-Licenses' },
    KS: { name: 'Kansas',         url: 'https://ksoutdoors.com/Fishing/Fishing-Licenses' },
    KY: { name: 'Kentucky',       url: 'https://fw.ky.gov/License/Pages/default.aspx' },
    LA: { name: 'Louisiana',      url: 'https://www.wlf.louisiana.gov/licenses/' },
    ME: { name: 'Maine',          url: 'https://www.maine.gov/ifw/fishing-boating/fishing/licenses-permits/' },
    MD: { name: 'Maryland',       url: 'https://dnr.maryland.gov/fisheries/Pages/recreational/licensing.aspx' },
    MA: { name: 'Massachusetts',  url: 'https://www.mass.gov/how-to/purchase-a-fishing-or-hunting-license' },
    MI: { name: 'Michigan',       url: 'https://www.michigan.gov/dnr/licenses/fishing' },
    MN: { name: 'Minnesota',      url: 'https://www.dnr.state.mn.us/licenses/fishing/index.html' },
    MS: { name: 'Mississippi',    url: 'https://www.mdwfp.com/license-boat-registration/' },
    MO: { name: 'Missouri',       url: 'https://mdc.mo.gov/licenses' },
    MT: { name: 'Montana',        url: 'https://fwp.mt.gov/buyandapply' },
    NE: { name: 'Nebraska',       url: 'https://outdoornebraska.gov/fishing/' },
    NV: { name: 'Nevada',         url: 'https://www.ndow.org/license/' },
    NH: { name: 'New Hampshire',  url: 'https://www.wildlife.nh.gov/license.html' },
    NJ: { name: 'New Jersey',     url: 'https://www.njfishandwildlife.com/ang_licens.htm' },
    NM: { name: 'New Mexico',     url: 'https://www.wildlife.state.nm.us/fishing/' },
    NY: { name: 'New York',       url: 'https://www.dec.ny.gov/permits/6104.html' },
    NC: { name: 'North Carolina', url: 'https://www.ncwildlife.org/Licensing' },
    ND: { name: 'North Dakota',   url: 'https://gf.nd.gov/licenses' },
    OH: { name: 'Ohio',           url: 'https://ohiodnr.gov/wps/portal/gov/odnr/buy-and-apply/fishing' },
    OK: { name: 'Oklahoma',       url: 'https://www.wildlifedepartment.com/licenses' },
    OR: { name: 'Oregon',         url: 'https://myodfw.com/articles/buy-hunting-fishing-license' },
    PA: { name: 'Pennsylvania',   url: 'https://www.fishandboat.com/Fishing/Licenses/Pages/default.aspx' },
    RI: { name: 'Rhode Island',   url: 'https://dem.ri.gov/programs/fish-wildlife/licenses.php' },
    SC: { name: 'South Carolina', url: 'https://www.dnr.sc.gov/licenses/' },
    SD: { name: 'South Dakota',   url: 'https://gfp.sd.gov/licenses/' },
    TN: { name: 'Tennessee',      url: 'https://gooutdoorstennessee.com/' },
    TX: { name: 'Texas',          url: 'https://tpwd.texas.gov/business/licenses/' },
    UT: { name: 'Utah',           url: 'https://wildlife.utah.gov/licenses-permits.html' },
    VT: { name: 'Vermont',        url: 'https://www.vtfishandwildlife.com/licenses-and-registrations/hunting-and-fishing-licenses' },
    VA: { name: 'Virginia',       url: 'https://www.dgif.virginia.gov/licenses/' },
    WA: { name: 'Washington',     url: 'https://wdfw.wa.gov/licenses/fishing' },
    WV: { name: 'West Virginia',  url: 'https://wvdnr.gov/licenses-and-hunting/' },
    WI: { name: 'Wisconsin',      url: 'https://gowild.wi.gov/' },
    WY: { name: 'Wyoming',        url: 'https://wgfd.wyo.gov/Fishing' },
    DC: { name: 'Washington DC',  url: 'https://doee.dc.gov/service/recreational-fishing-dc' },
  };

  // ── Geo helpers ─────────────────────────────────────────────
  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function nearestNoaaStation(lat, lon) {
    let best = NOAA_STATIONS[0], bestDist = Infinity;
    for (const s of NOAA_STATIONS) {
      const d = getDistanceKm(lat, lon, s[0], s[1]);
      if (d < bestDist) { bestDist = d; best = s; }
    }
    return { id: best[2], name: best[3], distKm: Math.round(bestDist) };
  }

  // ── Solunar / moon (SunCalc-derived, MIT-licensed algorithm) ──
  const SC_RAD = Math.PI / 180, SC_DAYMS = 86400000, SC_J1970 = 2440588, SC_J2000 = 2451545, SC_E = SC_RAD * 23.4397;
  function scToDays(d) { return (d.valueOf() / SC_DAYMS - 0.5 + SC_J1970) - SC_J2000; }
  function scRA(l, b) { return Math.atan2(Math.sin(l) * Math.cos(SC_E) - Math.tan(b) * Math.sin(SC_E), Math.cos(l)); }
  function scDec(l, b) { return Math.asin(Math.sin(b) * Math.cos(SC_E) + Math.cos(b) * Math.sin(SC_E) * Math.sin(l)); }
  function scSidereal(d, lw) { return SC_RAD * (280.16 + 360.9856235 * d) - lw; }
  function scAltitude(H, phi, dec) { return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)); }
  function scSunCoords(d) {
    const M = SC_RAD * (357.5291 + 0.98560028 * d);
    const C = SC_RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const L = M + C + SC_RAD * 102.9372 + Math.PI;
    return { dec: scDec(L, 0), ra: scRA(L, 0) };
  }
  function scMoonCoords(d) {
    const L = SC_RAD * (218.316 + 13.176396 * d), M = SC_RAD * (134.963 + 13.064993 * d), F = SC_RAD * (93.272 + 13.229350 * d);
    const l = L + SC_RAD * 6.289 * Math.sin(M), b = SC_RAD * 5.128 * Math.sin(F), dt = 385001 - 20905 * Math.cos(M);
    return { ra: scRA(l, b), dec: scDec(l, b), dist: dt };
  }
  function scMoonAlt(date, lat, lng) {
    const lw = SC_RAD * -lng, phi = SC_RAD * lat, d = scToDays(date), c = scMoonCoords(d);
    const H = scSidereal(d, lw) - c.ra;
    return scAltitude(H, phi, c.dec);
  }
  function moonPhaseInfo(date) {
    const d = scToDays(date), s = scSunCoords(d), m = scMoonCoords(d);
    const sdist = 149598000;
    const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
    const inc = Math.atan2(sdist * Math.sin(phi), m.dist - sdist * Math.cos(phi));
    const angle = Math.atan2(Math.cos(s.dec) * Math.sin(s.ra - m.ra), Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra));
    const fraction = (1 + Math.cos(inc)) / 2;
    const phase = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI; // 0=new, .5=full, 1=new
    const names = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
    const name = names[Math.round(phase * 8) % 8];
    return { fraction, phase, name };
  }
  // Scan the local day for moon transit (overhead), antitransit (underfoot), rise & set.
  function computeSolunar(lat, lon) {
    const now = new Date();
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    let maxAlt = -Infinity, minAlt = Infinity, transitMs = null, antiMs = null;
    const crossings = []; // {ms, dir} dir: 'rise'|'set'
    let prevAlt = scMoonAlt(start, lat, lon), prevMs = start.getTime();
    for (let i = 1; i <= 144; i++) { // 10-min steps across 24h
      const t = new Date(start.getTime() + i * 10 * 60000);
      const a = scMoonAlt(t, lat, lon);
      if (a > maxAlt) { maxAlt = a; transitMs = t.getTime(); }
      if (a < minAlt) { minAlt = a; antiMs = t.getTime(); }
      if (prevAlt < 0 && a >= 0) crossings.push({ ms: prevMs + (t.getTime() - prevMs) / 2, dir: 'rise' });
      if (prevAlt >= 0 && a < 0) crossings.push({ ms: prevMs + (t.getTime() - prevMs) / 2, dir: 'set' });
      prevAlt = a; prevMs = t.getTime();
    }
    const phase = moonPhaseInfo(now);
    // Major periods ≈ moon overhead (transit) & underfoot (antitransit), ~2 hrs each.
    // Minor periods ≈ moonrise & moonset, ~1 hr each.
    const mkWin = (ms, halfMin, kind) => ms == null ? null : { startMs: ms - halfMin * 60000, endMs: ms + halfMin * 60000, kind };
    const majors = [mkWin(transitMs, 60, 'major'), mkWin(antiMs, 60, 'major')].filter(Boolean);
    const minors = crossings.map(c => mkWin(c.ms, 30, 'minor')).filter(Boolean);
    // Strength scales with proximity to new/full moon (illumination extremes).
    const fullness = Math.abs(phase.phase - 0.5); // 0 at full, .5 at new
    const strong = phase.fraction > 0.85 || phase.fraction < 0.15; // near full or new
    return { phase, majors, minors, strong };
  }

  // ── State detection ─────────────────────────────────────────
  async function fetchStateFromCoords(lat, lon) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=5`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'HukFishingWidget/1.0' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const raw = data.address?.['ISO3166-2-lvl4'] || '';
      const code = raw.replace('US-', '').toUpperCase().trim();
      return LICENSE[code] ? { stateCode: code, stateName: LICENSE[code].name } : null;
    } catch { return null; }
  }

  async function fetchStateFromZip(zip) {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) throw new Error('ZIP not found');
    const data = await res.json();
    const place = data.places[0];
    const code = place['state abbreviation'].toUpperCase();
    return {
      stateCode: code,
      stateName: place['state'],
      city:      place['place name'],
      lat:       parseFloat(place.latitude),
      lon:       parseFloat(place.longitude),
    };
  }

  // ── Maps deep links ─────────────────────────────────────────
  function mapsLinks(lat, lon, label) {
    const q    = encodeURIComponent(`fishing license near ${label}`);
    const gUrl = `https://www.google.com/maps/search/${q}/@${lat},${lon},12z`;
    const aUrl = `https://maps.apple.com/?q=${q}&sll=${lat},${lon}&z=12`;
    return { google: gUrl, apple: aUrl };
  }

  // ── Weather helpers ─────────────────────────────────────────
  function windDescription(speed_kmh, deg) {
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    const dir = dirs[Math.round(deg / 45) % 8];
    if (speed_kmh < 10) return `Light ${dir} wind`;
    if (speed_kmh < 25) return `Moderate ${dir} wind`;
    if (speed_kmh < 45) return `Strong ${dir} wind`;
    return `Very strong ${dir} wind`;
  }

  function windDirLabel(deg) {
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    return dirs[Math.round(deg / 45) % 8];
  }

  function windIntensity(speed_kmh) {
    if (speed_kmh < 10) return 'Light';
    if (speed_kmh < 25) return 'Moderate';
    if (speed_kmh < 45) return 'Strong';
    return 'Very strong';
  }

  function humidityDesc(rh) {
    if (rh < 30) return 'Dry';
    if (rh < 50) return 'Comfortable';
    if (rh < 65) return 'Moderate';
    if (rh < 75) return 'Humid';
    if (rh < 85) return 'Muggy';
    return 'Very muggy';
  }

  function cloudCoverDesc(pct) {
    if (pct < 20) return 'Clear';
    if (pct < 50) return 'Partly cloudy';
    if (pct < 80) return 'Mostly cloudy';
    return 'Overcast';
  }

  // Single source of truth: fishing score → brand color tier
  function scoreToColor(score) {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#84cc16';
    if (score >= 60) return '#f0b429';
    if (score >= 40) return '#f59e0b';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  }

  function buildTideGraph(tides) {
    if (!tides || tides.length < 2) return '';
    const pts = tides.map(t => ({
      ms: new Date(t.t.replace(' ', 'T')).getTime(),
      h: parseFloat(t.v),
      type: t.type
    })).sort((a, b) => a.ms - b.ms);
    if (pts.length < 2) return '';

    const W = 300, H = 58, PX = 6, PY = 15;
    const minH = Math.min(...pts.map(p => p.h));
    const maxH = Math.max(...pts.map(p => p.h));
    const hRange = (maxH - minH) || 1;
    const tStart = pts[0].ms, tEnd = pts[pts.length - 1].ms;
    const tRange = tEnd - tStart;

    const tx = t => PX + ((t - tStart) / tRange) * (W - PX * 2);
    const ty = h => H - PY - ((h - minH) / hRange) * (H - PY * 2);

    const STEPS = 180;
    const curve = [];
    for (let i = 0; i < STEPS; i++) {
      const t = tStart + (i / (STEPS - 1)) * tRange;
      let j = 0;
      while (j < pts.length - 2 && pts[j + 1].ms <= t) j++;
      const p0 = pts[j], p1 = pts[j + 1];
      const f = (t - p0.ms) / (p1.ms - p0.ms);
      const h = p0.h + (p1.h - p0.h) * (1 - Math.cos(f * Math.PI)) / 2;
      curve.push([tx(t), ty(h)]);
    }

    const line = curve.map((p, i) => (i === 0 ? `M${p[0].toFixed(1)},${p[1].toFixed(1)}` : `L${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join(' ');
    const area = line + ` L${curve[curve.length-1][0].toFixed(1)},${H} L${curve[0][0].toFixed(1)},${H} Z`;

    const now = Date.now();
    const nowX = (now >= tStart && now <= tEnd) ? tx(now) : null;
    const nowLine = nowX ? `<line x1="${nowX.toFixed(1)}" y1="0" x2="${nowX.toFixed(1)}" y2="${H}" stroke="rgba(239,68,68,0.5)" stroke-width="1.5" stroke-dasharray="3,2"/>` : '';

    const dotLabels = pts.map((p, i) => {
      const xNum = tx(p.ms);
      const x = xNum.toFixed(1);
      const y = ty(p.h).toFixed(1);
      const isH = p.type === 'H';
      const color = isH ? '#29ABE2' : '#0f4c81';
      const time = new Date(p.ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const labelY = (isH ? parseFloat(y) - 5 : parseFloat(y) + 11).toFixed(1);
      // Keep edge labels inside the viewBox so they don't get clipped
      const anchor = i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle';
      const labelX = (i === 0 ? Math.max(xNum - 4, 1) : i === pts.length - 1 ? Math.min(xNum + 4, W - 1) : xNum).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="2.5" fill="${color}"/>
        <text x="${labelX}" y="${labelY}" text-anchor="${anchor}" font-size="6.5" fill="${color}" font-family="Manrope,sans-serif" font-weight="600">${time}</text>`;
    }).join('');

    return `<div class="huk-fc-tide-graph">
      <svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hukTideGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#29ABE2" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#29ABE2" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path d="${area}" fill="url(#hukTideGrad)"/>
        <path d="${line}" fill="none" stroke="#29ABE2" stroke-width="1.5" stroke-linejoin="round"/>
        ${nowLine}
        ${dotLabels}
      </svg>
    </div>`;
  }

  function tidePhaseLabel(predictions) {
    if (!predictions || predictions.length < 2) return { label: 'Unknown', incoming: null };
    const now = Date.now();
    let closest = null, closestDist = Infinity;
    for (let i = 0; i < predictions.length - 1; i++) {
      const t = new Date(predictions[i].t.replace(' ', 'T')).getTime();
      const dist = Math.abs(t - now);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    }
    if (closest === null) return { label: 'Unknown', incoming: null };
    const curr = parseFloat(predictions[closest].v);
    const next = parseFloat(predictions[Math.min(closest + 1, predictions.length - 1)].v);
    const incoming = next > curr;
    return { label: incoming ? 'Incoming' : 'Outgoing', incoming };
  }

  // ── Fishing Score Engine ─────────────────────────────────────
  const SCORE_WEIGHTS = { seaSurfaceTemp:18, tide:17, current:15, wind:14, pressure:12, surf:10, visibility:8 };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(x, x0, x1, y0, y1) { return y0 + clamp((x - x0) / (x1 - x0), 0, 1) * (y1 - y0); }
  function condLabel(s) {
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 60) return 'Fair';
    if (s >= 40) return 'Tough';
    if (s >= 20) return 'Poor';
    return 'Bad';
  }
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function scoreWind(mph) {
    let s;
    if (mph <= 3)       s = lerp(mph, 0,  3,  60, 70);
    else if (mph <= 10) s = lerp(mph, 4,  10, 88, 100);
    else if (mph <= 15) s = lerp(mph, 11, 15, 88, 78);
    else if (mph <= 20) s = lerp(mph, 16, 20, 72, 55);
    else if (mph <= 25) s = lerp(mph, 21, 25, 50, 30);
    else                s = lerp(mph, 26, 45, 25, 0);
    s = clamp(Math.round(s), 0, 100);
    const reason = mph <= 3  ? 'Calm — easy conditions but drift fishing is trickier.'
      : mph <= 10 ? 'Light to moderate wind — ideal for casting and drift.'
      : mph <= 15 ? 'Moderate wind — very fishable with manageable drift.'
      : mph <= 20 ? 'Getting breezy — manageable but affecting presentation.'
      : mph <= 25 ? 'Strong wind — tough casting and choppy conditions.'
      : 'Too windy — rough conditions significantly limiting fishability.';
    return { score: s, label: condLabel(s), reason };
  }

  function scoreTideFromData(tidePhase, tides) {
    const now = Date.now();
    const sorted = (tides || []).map(t => ({
      ms: new Date(t.t.replace(' ', 'T')).getTime(),
      h: parseFloat(t.v), type: t.type,
    })).sort((a, b) => a.ms - b.ms);
    const prev = [...sorted].filter(t => t.ms <= now).pop();
    const next = sorted.find(t => t.ms > now);
    if (!prev || !next) {
      const base = tidePhase.incoming === true ? 82 : tidePhase.incoming === false ? 76 : 32;
      return { score: base, label: condLabel(base),
        reason: tidePhase.incoming === true  ? 'Incoming tide is moving water — fish are actively feeding.'
          : tidePhase.incoming === false ? 'Outgoing tide is productive, pulling bait into structure.'
          : 'Slack tide — fish activity drops near tidal stops.' };
    }
    const frac    = (now - prev.ms) / (next.ms - prev.ms);
    const hrsTo   = (next.ms - now) / 3600000;
    const hrsSince = (now - prev.ms) / 3600000;
    if (hrsTo < 0.75 || hrsSince < 0.75) {
      const prox = Math.min(hrsTo, hrsSince);
      const base = (next.type === 'H' || prev.type === 'H') ? 45 : 30;
      const s = clamp(Math.round(lerp(prox, 0, 0.75, base - 10, base + 10)), 0, 100);
      return { score: s, label: condLabel(s),
        reason: next.type === 'H' ? 'Approaching high slack — water movement slowing down.'
          : 'Near low slack — tough window, limited water movement.' };
    }
    let score, reason;
    if (prev.type === 'L' && next.type === 'H') {
      if (frac < 0.25)     { score = lerp(frac, 0,    0.25, 60, 82); reason = 'Incoming tide building — fish activity rising.'; }
      else if (frac < 0.6) { score = lerp(frac, 0.25, 0.6,  82, 97); reason = 'Strong incoming tide — prime feeding window.'; }
      else                 { score = lerp(frac, 0.6,  1.0,  97, 58); reason = 'Incoming tide easing toward high — still good.'; }
    } else {
      if (frac < 0.25)     { score = lerp(frac, 0,    0.25, 52, 74); reason = 'Outgoing tide building momentum.'; }
      else if (frac < 0.6) { score = lerp(frac, 0.25, 0.6,  74, 88); reason = 'Strong outgoing tide — productive for structure fishing.'; }
      else                 { score = lerp(frac, 0.6,  1.0,  88, 48); reason = 'Outgoing tide easing toward low — window closing.'; }
    }
    score = clamp(Math.round(score), 0, 100);
    return { score, label: condLabel(score), reason };
  }

  function scoreCurrentFromTide(tideScore) {
    let ktEst, score;
    if (tideScore >= 90)      { ktEst = 1.2; score = 95; }
    else if (tideScore >= 75) { ktEst = 0.9; score = 88; }
    else if (tideScore >= 60) { ktEst = 0.6; score = 78; }
    else if (tideScore >= 40) { ktEst = 0.3; score = 52; }
    else                       { ktEst = 0.1; score = 28; }
    const reason = ktEst < 0.2 ? 'Little current — bait presentation is sluggish.'
      : ktEst < 0.7 ? 'Moderate current is moving bait naturally through structure.'
      : ktEst <= 1.5 ? 'Good current — ideal for drift fishing and lure action.'
      : 'Strong current — heavier weights or adjusted technique needed.';
    return { score: clamp(score, 0, 100), label: condLabel(score), reason, estimatedKt: ktEst };
  }

  function scoreSeaSurfaceTemp(tempF) {
    let s;
    if (tempF < 45)       s = lerp(tempF, 30, 45, 10, 30);
    else if (tempF < 55)  s = lerp(tempF, 45, 55, 30, 55);
    else if (tempF < 65)  s = lerp(tempF, 55, 65, 55, 75);
    else if (tempF <= 78) s = lerp(tempF, 65, 78, 85, 100);
    else if (tempF <= 84) s = lerp(tempF, 78, 84, 100, 78);
    else if (tempF <= 89) s = lerp(tempF, 84, 89, 78, 50);
    else                  s = lerp(tempF, 89, 96, 50, 15);
    s = clamp(Math.round(s), 0, 100);
    const reason = tempF < 55 ? 'Cold water slows metabolism — fish are sluggish and deep.'
      : tempF < 65 ? 'Cool water — some activity but below the ideal range.'
      : tempF <= 78 ? 'Ideal water temp — fish are actively feeding and moving.'
      : tempF <= 84 ? 'Warm water is still highly productive for coastal species.'
      : tempF <= 89 ? 'Hot water — fish moving to depth or shade to stay comfortable.'
      : 'Very hot surface — look for deeper, cooler structure.';
    return { score: s, label: condLabel(s), reason };
  }

  function scoreSurf(waveHeightFt, wavePeriodSec) {
    let s;
    if (waveHeightFt <= 0.5)      s = lerp(waveHeightFt, 0,   0.5, 75,  83);
    else if (waveHeightFt <= 2.0) s = lerp(waveHeightFt, 0.5, 2.0, 90, 100);
    else if (waveHeightFt <= 3.0) s = lerp(waveHeightFt, 2.0, 3.0, 90,  72);
    else if (waveHeightFt <= 4.0) s = lerp(waveHeightFt, 3.0, 4.0, 72,  50);
    else if (waveHeightFt <= 6.0) s = lerp(waveHeightFt, 4.0, 6.0, 45,  20);
    else                           s = lerp(waveHeightFt, 6.0, 12,  20,   0);
    if (wavePeriodSec != null) {
      if (wavePeriodSec >= 10) s += 10;
      else if (wavePeriodSec < 7 && wavePeriodSec >= 5) s -= 10;
      else if (wavePeriodSec < 5) s -= 20;
    }
    s = clamp(Math.round(s), 0, 100);
    const reason = waveHeightFt <= 0.5 ? 'Glass-calm — easy conditions but limited wave action to move bait.'
      : waveHeightFt <= 2.0 ? 'Light surf — ideal for shore, pier, and kayak fishing.'
      : waveHeightFt <= 3.0 ? 'Moderate surf — fishable with attention to casting and footing.'
      : waveHeightFt <= 4.0 ? 'Rough surf — challenging, especially for shore anglers.'
      : 'Very rough — dangerous conditions for most nearshore fishing.';
    return { score: s, label: condLabel(s), reason };
  }

  function scorePressure(presHpa, hourlyPres, hrIdx) {
    const inHg = presHpa / 33.8639;
    let trend = 'stable', s = 82;
    if (hourlyPres && hrIdx >= 3) {
      const diff = presHpa - (hourlyPres[Math.max(0, hrIdx - 3)] || presHpa);
      if (diff <= -3)      { trend = 'rapidly_falling'; s = 52; }
      else if (diff <= -1) { trend = 'slowly_falling';  s = 95; }
      else if (diff >= 3)  { trend = 'rapidly_rising';  s = 47; }
      else if (diff >= 1)  { trend = 'slowly_rising';   s = 72; }
    }
    if (inHg >= 29.80 && inHg <= 30.20) s = clamp(s + 5, 0, 100);
    else if (inHg < 29.50 || inHg > 30.40) s = clamp(s - 10, 0, 100);
    s = clamp(Math.round(s), 0, 100);
    const reason = trend === 'slowly_falling'  ? 'Slowly falling pressure activates fish feeding — strong window.'
      : trend === 'stable'          ? 'Stable pressure keeps fish on predictable patterns.'
      : trend === 'slowly_rising'   ? 'Rising pressure after a front — moderate fish activity.'
      : trend === 'rapidly_falling' ? 'Rapid drop signals incoming weather — brief activity spike, then slow.'
      : trend === 'rapidly_rising'  ? 'Rapid rise post-front — fish often go deep and inactive.'
      : 'Stable pressure conditions.';
    return { score: s, label: condLabel(s), reason, trend, inHg: inHg.toFixed(2) };
  }

  function scoreVisibility(weatherCode, cloudCover) {
    let s;
    const cc = cloudCover || 0;
    if (weatherCode >= 95)                           s = 5;
    else if (weatherCode >= 71 && weatherCode <= 86) s = 25;
    else if (weatherCode >= 61 && weatherCode <= 67) s = lerp(weatherCode, 61, 67, 72, 55);
    else if (weatherCode >= 51 && weatherCode <= 57) s = 72;
    else if (weatherCode >= 45 && weatherCode <= 48) s = 30;
    else if (weatherCode === 3)                      s = 90;
    else if (weatherCode <= 1)                       s = cc < 10 ? 65 : 78;
    else                                              s = lerp(cc, 10, 70, 80, 93);
    s = clamp(Math.round(s), 0, 100);
    const reason = weatherCode >= 95 ? 'Thunderstorm — unsafe conditions, do not fish.'
      : weatherCode >= 61 ? 'Rain is reducing surface light and visibility.'
      : weatherCode >= 45 ? 'Fog or mist is severely limiting visibility.'
      : weatherCode === 3 ? 'Overcast sky reduces glare — fish less wary near the surface.'
      : cc < 20 ? 'Bright clear sky — harsh glare can push fish deeper or into shade.'
      : 'Partly cloudy — optimal light for most species near the surface.';
    return { score: s, label: condLabel(s), reason };
  }

  function computeFishingScore(weather, tides, tidePhase) {
    const wc      = weather.current.weather_code;
    const windKmh = weather.current.wind_speed_10m;
    const windMph = kmhToMph(windKmh);
    const windDir = weather.current.wind_direction_10m;
    const cloudCov = weather.current.cloud_cover ?? null;
    const presHpa  = weather.current.surface_pressure ?? null;
    const hrPres   = weather.hourly?.surface_pressure ?? null;

    // Current hour index in hourly arrays
    let hrIdx = 0;
    if (weather.hourly?.time) {
      const nowStr = new Date().toISOString().slice(0, 13);
      const found  = weather.hourly.time.findIndex(t => t.startsWith(nowStr));
      if (found >= 0) hrIdx = found;
    }

    const waveM   = weather.hourly?.wave_height?.[hrIdx]       ?? null;
    const waveFt  = waveM   != null ? parseFloat(metersToFt(waveM)) : null;
    const wavePer = weather.hourly?.wave_period?.[hrIdx]        ?? null;
    const sstC    = weather.hourly?.water_temperature?.[hrIdx]  ?? null;
    const sstF    = sstC    != null ? Math.round(sstC * 9/5 + 32) : null;

    const windRes = scoreWind(windMph);
    const tideRes = scoreTideFromData(tidePhase, tides);
    const currRes = scoreCurrentFromTide(tideRes.score);
    const surfRes = waveFt  != null ? scoreSurf(waveFt, wavePer) : null;
    const sstRes  = sstF    != null ? scoreSeaSurfaceTemp(sstF)  : null;
    const presRes = presHpa != null ? scorePressure(presHpa, hrPres, hrIdx) : null;
    const visRes  = scoreVisibility(wc, cloudCov);

    const C = {
      wind:     { ...windRes, value: `${windMph} mph ${windDirLabel(windDir)}`, weight: SCORE_WEIGHTS.wind },
      tide:     { ...tideRes, value: `${tidePhase.label} now`,                  weight: SCORE_WEIGHTS.tide },
      current:  { ...currRes, value: `~${currRes.estimatedKt.toFixed(1)} kt`,   weight: SCORE_WEIGHTS.current },
      ...(surfRes ? { surf:         { ...surfRes, value: `${waveFt} ft`,    weight: SCORE_WEIGHTS.surf } } : {}),
      ...(sstRes  ? { seaSurfaceTemp:{ ...sstRes,  value: `${sstF}°F`,      weight: SCORE_WEIGHTS.seaSurfaceTemp } } : {}),
      ...(presRes ? { pressure:     { ...presRes, value: `${presRes.inHg} inHg`, weight: SCORE_WEIGHTS.pressure } } : {}),
      visibility: { ...visRes, value: weatherCodeText(wc),                       weight: SCORE_WEIGHTS.visibility },
    };

    const entries  = Object.values(C);
    const totalW   = entries.reduce((s, c) => s + c.weight, 0);
    let weighted   = entries.reduce((s, c) => s + c.score * c.weight, 0) / totalW;

    // Realism caps
    const majorKeys = ['seaSurfaceTemp','tide','current','wind','pressure','surf'];
    const below60   = majorKeys.filter(k => C[k] && C[k].score < 60).length;
    if (wc >= 95)                                    weighted = Math.min(weighted, 20);
    if (below60 >= 2)                                weighted = Math.min(weighted, 89);
    if (waveFt != null && waveFt >= 4)               weighted = Math.min(weighted, 84);
    if (windMph >= 21)                               weighted = Math.min(weighted, 84);
    if (tideRes.score < 40 && currRes.score < 60)    weighted = Math.min(weighted, 74);
    const pt = presRes?.trend;
    if (pt === 'rapidly_falling' || pt === 'rapidly_rising') weighted = Math.min(weighted, 79);

    const overallScore = clamp(Math.round(weighted), 0, 100);

    let overallLabel, overallColor;
    if (overallScore >= 90) { overallLabel = 'Drop Everything'; overallColor = '#22c55e'; }
    else if (overallScore >= 75) { overallLabel = 'Fish On';        overallColor = '#84cc16'; }
    else if (overallScore >= 60) { overallLabel = 'Worth the Trip'; overallColor = '#f0b429'; }
    else if (overallScore >= 40) { overallLabel = 'Grind It Out';   overallColor = '#f59e0b'; }
    else if (overallScore >= 20) { overallLabel = 'Slow Pick';      overallColor = '#f97316'; }
    else                          { overallLabel = 'Skunked';        overallColor = '#ef4444'; }

    const taglines = {
      'Drop Everything':  'About as good as it gets. Go.',
      'Fish On':          'Strong conditions with real potential.',
      'Worth the Trip':   'Solid window with the right approach.',
      'Grind It Out':     'Mixed bag — timing and technique matter.',
      'Slow Pick':        'Tough bite. Manage expectations.',
      'Skunked':          'Rough day. Maybe scout instead.',
    };

    const confidence = entries.length >= 6 ? 'high' : entries.length >= 4 ? 'medium' : 'low';
    const nameMap = { wind:'wind', tide:'tide movement', current:'current', surf:'surf',
      seaSurfaceTemp:'water temp', pressure:'pressure', visibility:'light conditions' };
    const positives = Object.entries(C).filter(([,v]) => v.score >= 75).map(([k]) => nameMap[k] || k);
    const negatives = Object.entries(C).filter(([,v]) => v.score < 60).map(([k]) => nameMap[k] || k);
    let overallSummary;
    if (wc >= 95) overallSummary = 'Thunderstorm conditions — unsafe for fishing.';
    else if (negatives.length === 0) overallSummary = positives.length >= 2
      ? `${capitalize(positives[0])} and ${positives[1]} are both working in your favor.`
      : 'Solid conditions across all key factors.';
    else if (negatives.length === 1) overallSummary = positives.length > 0
      ? `${capitalize(positives[0])} is helping, but ${negatives[0]} is holding the score back.`
      : `${capitalize(negatives[0])} is the main limiting factor right now.`;
    else overallSummary = `${capitalize(negatives[0])} and ${negatives[1]} are creating a tougher window.`;

    return { overallScore, overallLabel, overallColor, overallTagline: taglines[overallLabel],
      overallSummary, confidence, conditionScores: C, waveFt, sstF, cloudCov };
  }

  // ── Inland (freshwater) scoring — no tide/current/surf; solunar-driven ──
  function fmtClock(ms) { return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
  function computeInlandScore(weather, solunar) {
    const wc       = weather.current.weather_code;
    const windMph  = kmhToMph(weather.current.wind_speed_10m);
    const windDir  = weather.current.wind_direction_10m;
    const cloudCov = weather.current.cloud_cover ?? null;
    const presHpa  = weather.current.surface_pressure ?? null;
    const hrPres   = weather.hourly?.surface_pressure ?? null;
    const airF     = Math.round(weather.current.temperature_2m);

    const windRes = scoreWind(windMph);
    const presRes = presHpa != null ? scorePressure(presHpa, hrPres, 0) : { score: 60, label: 'Steady', reason: 'Pressure data unavailable.', inHg: null };
    const visRes  = scoreVisibility(wc, cloudCov);

    // Solunar sub-score: is a feeding window active or near?
    const now = Date.now();
    const inWin = (w) => now >= w.startMs && now <= w.endMs;
    const nearWin = (w) => Math.abs(now - (w.startMs + w.endMs) / 2) <= 90 * 60000;
    const activeMajor = solunar.majors.some(inWin);
    const activeMinor = solunar.minors.some(inWin);
    const nearMajor   = solunar.majors.some(nearWin);
    let solScore, solLabel;
    if (activeMajor)      { solScore = 92; solLabel = 'Major window now'; }
    else if (activeMinor) { solScore = 80; solLabel = 'Minor window now'; }
    else if (nearMajor)   { solScore = 78; solLabel = 'Major window soon'; }
    else                  { solScore = 58; solLabel = 'Between windows'; }
    if (solunar.strong) solScore = Math.min(100, solScore + 5);
    const nextMajor = solunar.majors.map(w => w.startMs).filter(m => m > now).sort((a,b)=>a-b)[0] || solunar.majors[0]?.startMs;
    const solValue = nextMajor ? `Major ${fmtClock(nextMajor)}` : '—';

    // Moon phase sub-score: new & full peak
    const moonScore = Math.round(60 + 40 * Math.abs(solunar.phase.fraction - 0.5) * 2);

    const W = { pressure: 32, solunar: 26, wind: 20, visibility: 14, moon: 8 };
    const C = {
      pressure:  { ...presRes, value: presRes.inHg ? `${presRes.inHg} inHg` : '—', weight: W.pressure },
      solunar:   { score: solScore, label: solLabel, reason: `Solunar theory: fish feed hardest during major periods (moon overhead/underfoot). ${solLabel}.`, value: solValue, weight: W.solunar },
      wind:      { ...windRes, value: `${windMph} mph ${windDirLabel(windDir)}`, weight: W.wind },
      visibility:{ ...visRes, value: weatherCodeText(wc), weight: W.visibility },
      moon:      { score: moonScore, label: solunar.phase.name, reason: `Moon phase influences feeding intensity; new and full moons tend to peak. Now: ${solunar.phase.name}.`, value: `${Math.round(solunar.phase.fraction * 100)}%`, weight: W.moon },
    };
    const entries = Object.values(C);
    const totalW  = entries.reduce((s, c) => s + c.weight, 0);
    let weighted  = entries.reduce((s, c) => s + c.score * c.weight, 0) / totalW;
    if (wc >= 95) weighted = Math.min(weighted, 20);
    if (windMph >= 21) weighted = Math.min(weighted, 84);
    const pt = presRes.trend;
    if (pt === 'rapidly_falling' || pt === 'rapidly_rising') weighted = Math.min(weighted, 79);
    const overallScore = clamp(Math.round(weighted), 0, 100);

    let overallLabel, overallColor;
    if (overallScore >= 90) { overallLabel = 'Drop Everything'; overallColor = '#22c55e'; }
    else if (overallScore >= 75) { overallLabel = 'Fish On';        overallColor = '#84cc16'; }
    else if (overallScore >= 60) { overallLabel = 'Worth the Trip'; overallColor = '#f0b429'; }
    else if (overallScore >= 40) { overallLabel = 'Grind It Out';   overallColor = '#f59e0b'; }
    else if (overallScore >= 20) { overallLabel = 'Slow Pick';      overallColor = '#f97316'; }
    else                          { overallLabel = 'Skunked';        overallColor = '#ef4444'; }
    const taglines = { 'Drop Everything':'About as good as it gets. Go.', 'Fish On':'Strong conditions with real potential.', 'Worth the Trip':'Solid window with the right approach.', 'Grind It Out':'Mixed bag — timing and technique matter.', 'Slow Pick':'Tough bite. Manage expectations.', 'Skunked':'Rough day. Maybe scout instead.' };
    let summary;
    if (activeMajor) summary = `A <b>major solunar window</b> is active now${pt && pt.includes('falling') ? ' with falling pressure' : ''} — prime feeding.`;
    else if (pt && pt.includes('falling')) summary = `<b>Falling pressure</b> is in your favor; next major window ${fmtClock(nextMajor)}.`;
    else summary = `Best bite around the <b>major window</b> at ${fmtClock(nextMajor)}.`;

    return { overallScore, overallLabel, overallColor, overallTagline: taglines[overallLabel], overallSummary: summary, confidence: 'medium', conditionScores: C, airF };
  }

  function weatherCodeIcon(code) {
    if (code === 0)  return '☀️';
    if (code <= 2)   return '🌤️';
    if (code <= 3)   return '☁️';
    if (code <= 48)  return '🌫️';
    if (code <= 57)  return '🌧️';
    if (code <= 67)  return '🌧️';
    if (code <= 77)  return '❄️';
    if (code <= 82)  return '🌦️';
    if (code <= 86)  return '🌨️';
    if (code >= 95)  return '⛈️';
    return '🌡️';
  }

  function weatherCodeText(code) {
    if (code === 0)  return 'Clear skies';
    if (code <= 2)   return 'Partly cloudy';
    if (code <= 3)   return 'Overcast';
    if (code <= 48)  return 'Foggy';
    if (code <= 57)  return 'Drizzle';
    if (code <= 67)  return 'Rain';
    if (code <= 77)  return 'Snow';
    if (code <= 82)  return 'Rain showers';
    if (code <= 86)  return 'Snow showers';
    if (code >= 95)  return 'Thunderstorm';
    return 'Mixed';
  }

  function kmhToMph(k) { return Math.round(k * 0.621371); }
  function metersToFt(m) { return (m * 3.28084).toFixed(1); }

  // ── API fetches ─────────────────────────────────────────────
  async function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,cloud_cover,surface_pressure&hourly=surface_pressure&daily=wind_speed_10m_max,weather_code,precipitation_sum&wind_speed_unit=kmh&temperature_unit=fahrenheit&precipitation_unit=inch&forecast_days=7&timezone=auto`;
    const marineUrl  = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_period,sea_surface_temperature&daily=wave_height_max&forecast_days=7&timezone=auto`;

    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(marineUrl).catch(() => null),
    ]);

    if (!weatherRes.ok) throw new Error('Weather fetch failed');
    const weather = await weatherRes.json();

    if (marineRes && marineRes.ok) {
      const marine = await marineRes.json();
      weather.hourly = weather.hourly || {};
      weather.hourly.wave_height       = marine.hourly?.wave_height;
      weather.hourly.wave_period       = marine.hourly?.wave_period;
      weather.hourly.water_temperature = marine.hourly?.sea_surface_temperature;
      weather.daily  = weather.daily  || {};
      weather.daily.wave_height_max    = marine.daily?.wave_height_max;
    }

    return weather;
  }

  async function fetchTides(stationId) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=168&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=huk_fishing_widget&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Tide fetch failed');
    const data = await res.json();
    return data.predictions || [];
  }

  // ── 7-day helpers ───────────────────────────────────────────
  function computeDayScore(windMaxKph, waveMaxM, weatherCode) {
    const windMph = windMaxKph * 0.621371;
    const windS = windMph <= 3 ? 65 : windMph <= 15 ? 90 : windMph <= 20 ? 65 : windMph <= 25 ? 40 : 20;
    const waveS = waveMaxM == null ? 75 : waveMaxM <= 0.5 ? 83 : waveMaxM <= 1.5 ? 92 : waveMaxM <= 3 ? 65 : waveMaxM <= 5 ? 35 : 15;
    const wxS   = weatherCode >= 95 ? 15 : weatherCode >= 80 ? 50 : weatherCode >= 61 ? 62 : weatherCode >= 51 ? 72 : 85;
    let s = Math.round(windS * 0.4 + waveS * 0.3 + wxS * 0.3);
    if (weatherCode >= 95) s = Math.min(s, 30);
    return Math.min(Math.max(s, 5), 100);
  }

  function build7DayPaneHTML(weather) {
    const daily = weather.daily;
    if (!daily || !daily.time) return '<div class="huk-fc-7day"><p style="font-size:12px;opacity:.5;padding:12px 0;">7-day forecast not available.</p></div>';
    const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const scored = daily.time.map((dateStr, i) => {
      const d     = new Date(dateStr + 'T12:00:00');
      const name  = i === 0 ? 'Today' : DAYS_SHORT[d.getDay()];
      const score = computeDayScore(daily.wind_speed_10m_max?.[i] || 0, daily.wave_height_max?.[i] ?? null, daily.weather_code?.[i] || 0);
      let color, label;
      if (score >= 90)      { color = '#22c55e'; label = 'Drop Everything'; }
      else if (score >= 75) { color = '#84cc16'; label = 'Fish On'; }
      else if (score >= 60) { color = '#f0b429'; label = 'Worth the Trip'; }
      else if (score >= 40) { color = '#f59e0b'; label = 'Grind It Out'; }
      else if (score >= 20) { color = '#f97316'; label = 'Slow Pick'; }
      else                   { color = '#ef4444'; label = 'Skunked'; }
      const conf = i < 2 ? 1.0 : i < 5 ? 0.72 : 0.45;
      return { name, score, color, label, conf, code: daily.weather_code?.[i] || 0 };
    });
    const best = scored.slice(1).reduce((b, d) => d.score > b.score ? d : b, scored[1] || scored[0]);
    const cards = scored.map((d, i) => {
      const windMph  = Math.round((daily.wind_speed_10m_max?.[i] || 0) * 0.621371);
      const waveM    = daily.wave_height_max?.[i];
      const waveFt   = waveM != null ? (waveM * 3.28084).toFixed(1) : null;
      const precip   = daily.precipitation_sum?.[i];
      const wxDesc   = weatherCodeText(d.code);
      const detailParts = [];
      if (windMph)          detailParts.push(`💨 ${windMph} mph`);
      if (waveFt != null)   detailParts.push(`🌊 ${waveFt} ft`);
      if (precip > 0.05)    detailParts.push(`🌧 ${precip.toFixed(1)}" rain`);
      return `
      <div class="huk-fc-7day-card${d.name === 'Today' ? ' today' : ''}" style="opacity:${d.conf};">
        <div class="huk-fc-7day-row-top">
          <div class="huk-fc-7day-left">
            <span class="huk-fc-7day-name">${d.name}</span>
            <span class="huk-fc-7day-wx">${weatherCodeIcon(d.code)} ${wxDesc}</span>
          </div>
          <div class="huk-fc-7day-right">
            <span class="huk-fc-7day-score-num" style="color:${d.color};">${d.score}</span>
            <span class="huk-fc-7day-label" style="color:${d.color};">${d.label}</span>
          </div>
        </div>
        <div class="huk-fc-7day-bar-track"><div class="huk-fc-7day-bar-fill" style="width:${d.score}%;background:${d.color};"></div></div>
        ${detailParts.length ? `<div class="huk-fc-7day-detail">${detailParts.join('<span class="huk-fc-7day-sep"> · </span>')}</div>` : ''}
      </div>`;
    }).join('');
    return `
      <div class="huk-fc-7day">
        <div class="huk-fc-best-callout">
          <span class="huk-fc-best-callout-label">Best day</span>
          <span class="huk-fc-best-callout-val">${best.name} · ${best.score} · ${best.label}</span>
        </div>
        <div class="huk-fc-7day-grid">${cards}</div>
        <div class="huk-fc-7day-conf-note">
          <span class="huk-fc-7day-conf-dot" style="background:#16a34a;"></span>Days 1–2 solid
          <span class="huk-fc-7day-conf-dot" style="background:#f59e0b;margin-left:6px;"></span>Days 3–5 moderate
          <span class="huk-fc-7day-conf-dot" style="background:#94a3b8;margin-left:6px;"></span>Days 6–7 estimated
        </div>
      </div>`;
  }

  // ── HTML builders ───────────────────────────────────────────
  const MAP_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`;

  function buildLicenseHTML(stateCode, lat, lon, label) {
    const info = LICENSE[stateCode];
    if (!info) return '';
    const { google: mapsUrl } = mapsLinks(lat, lon, label || info.name);
    return `
      <div class="huk-fc-license" data-lat="${lat}" data-lon="${lon}">
        <div class="huk-fc-license-header">
          <span class="huk-fc-license-q">Need a Fishing License?</span>
          <span class="huk-fc-license-loc">Your location · ${info.name}</span>
        </div>
        <div class="huk-fc-license-btns">
          <a href="${info.url}" target="_blank" rel="noopener" class="huk-fc-btn huk-fc-btn-primary">
            Get A Fishing License <span class="huk-fc-btn-arrow">→</span>
          </a>
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="huk-fc-btn huk-fc-btn-map">
            ${MAP_ICON} Get Directions
          </a>
        </div>
        <div class="huk-fc-travel-wrap">
          <button type="button" class="huk-fc-travel-toggle" aria-expanded="false">
            <span class="huk-fc-travel-toggle-text">🎣 Going on a fishing trip? <span class="huk-fc-travel-sub">Get a license before you go.</span></span>
            <span class="huk-fc-travel-chevron">›</span>
          </button>
          <div class="huk-fc-travel-body" hidden>
            <p class="huk-fc-travel-hint">Enter your destination ZIP for the correct license and local directions.</p>
            <div class="huk-fc-zip-row">
              <input
                type="text"
                inputmode="numeric"
                pattern="[0-9]{5}"
                maxlength="5"
                placeholder="Destination ZIP"
                class="huk-fc-zip-input"
                aria-label="Destination ZIP code"
              >
              <button type="button" class="huk-fc-zip-submit">Look Up</button>
            </div>
            <div class="huk-fc-travel-result" aria-live="polite"></div>
          </div>
        </div>
      </div>`;
  }

  function buildTravelResultHTML(place) {
    const info = LICENSE[place.stateCode];
    if (!info) return `<p class="huk-fc-travel-err">No license info found for that ZIP.</p>`;
    const { google: mapsUrl } = mapsLinks(place.lat, place.lon, `${place.city}, ${place.stateCode}`);
    return `
      <div class="huk-fc-travel-destination">
        <div class="huk-fc-travel-dest-header">
          <div class="huk-fc-travel-dest-text">
            <div class="huk-fc-travel-dest-place">📍 ${place.city}, ${place.stateCode}</div>
            <div class="huk-fc-travel-dest-state">${info.name} Fishing License</div>
          </div>
        </div>
        <div class="huk-fc-license-btns">
          <a href="${info.url}" target="_blank" rel="noopener" class="huk-fc-btn huk-fc-btn-primary">
            Get Fishing License <span class="huk-fc-btn-arrow">→</span>
          </a>
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="huk-fc-btn huk-fc-btn-map">
            ${MAP_ICON} Directions
          </a>
        </div>
      </div>`;
  }

  function fmtClockShort(ms) {
    return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(' AM', 'a').replace(' PM', 'p');
  }
  function buildSolunarPanel(solunar) {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const dayStart = start.getTime(), DAY = 86400000, now = Date.now();
    const pct = ms => Math.max(0, Math.min(100, ((ms - dayStart) / DAY) * 100));
    const bands = [...solunar.majors.map(w => ({ ...w, cls: 'maj' })), ...solunar.minors.map(w => ({ ...w, cls: 'min' }))]
      .map(w => `<div class="huk-fc-sol-band ${w.cls}" style="left:${pct(w.startMs).toFixed(1)}%;width:${(pct(w.endMs) - pct(w.startMs)).toFixed(1)}%"></div>`).join('');
    const nowPct = pct(now);
    const pickNext = (arr) => arr.slice().sort((a, b) => a.startMs - b.startMs).find(w => w.endMs > now) || arr.slice().sort((a, b) => a.startMs - b.startMs)[0];
    const maj = pickNext(solunar.majors), min = solunar.minors.length ? pickNext(solunar.minors) : null;
    const row = (w, cls, label, strength) => w ? `<div class="huk-fc-frow ${cls}"><span class="huk-fc-frow-ic">●</span><span class="huk-fc-frow-mid"><span class="huk-fc-frow-l">${label} · <b>${strength}</b></span><span class="huk-fc-frow-v">${fmtClockShort(w.startMs)}–${fmtClockShort(w.endMs)}</span></span></div>` : '';
    const strong = solunar.strong ? 'Strong' : 'Fair';
    return `<div class="huk-fc-tides">
      <div class="huk-fc-tides-title">Solunar Feeding Times</div>
      <div class="huk-fc-sol-track">${bands}<div class="huk-fc-sol-now" style="left:${nowPct.toFixed(1)}%"></div></div>
      <div class="huk-fc-sol-ticks"><span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>12a</span></div>
      <div class="huk-fc-frows">${row(maj, 'maj', 'Major', strong)}${row(min, 'min', 'Minor', 'Fair')}</div>
    </div>`;
  }

  function buildWidgetHTML(weather, tides, station, tidePhase, lat, lon, stateCode, solunar) {
    const isInland     = !!solunar;
    const sc           = isInland ? computeInlandScore(weather, solunar) : computeFishingScore(weather, tides, tidePhase);
    const score        = sc.overallScore;
    const scoreColor   = sc.overallColor;
    const wc           = weather.current.weather_code;
    const temp         = Math.round(weather.current.temperature_2m);
    const windKmh      = weather.current.wind_speed_10m;
    const windDir      = weather.current.wind_direction_10m;
    const humidity     = weather.current.relative_humidity_2m;
    const C            = sc.conditionScores;

    const now = Date.now();
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    const todayTides = tides.filter(t => t.t.startsWith(todayStr));
    const upcoming = todayTides
      .filter(t => new Date(t.t.replace(' ', 'T')).getTime() >= now - 30 * 60 * 1000)
      .slice(0, 4);

    const nextTide = tides.find(t => new Date(t.t.replace(' ', 'T')).getTime() > now);
    const nextTideNote = nextTide
      ? `${nextTide.type === 'H' ? 'High' : 'Low'} at ${new Date(nextTide.t.replace(' ', 'T')).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
      : '';

    const tideRows = upcoming.slice(0, 2).map(t => {
      const d = new Date(t.t.replace(' ', 'T'));
      const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const isHigh = t.type === 'H';
      return `<div class="huk-fc-frow ${isHigh ? 'hi' : 'lo'}">
        <span class="huk-fc-frow-ic">${isHigh ? '▲' : '▼'}</span>
        <span class="huk-fc-frow-mid"><span class="huk-fc-frow-l">Next ${isHigh ? 'High' : 'Low'}</span><span class="huk-fc-frow-v">${time}</span></span>
        <span class="huk-fc-frow-r">${parseFloat(t.v).toFixed(1)} ft</span>
      </div>`;
    }).join('');

    // Build condition cards — inland (freshwater) vs coastal sets
    const cardDefs = isInland ? [
      { key: 'pressure',      icon: '📊', label: 'Pressure',   val: C.pressure?.value,  sub: C.pressure?.label },
      { key: 'solunar',       icon: '🌙', label: 'Solunar',    val: C.solunar?.value,   sub: C.solunar?.label },
      { key: 'wind',          icon: '💨', label: 'Wind',       val: C.wind?.value,      sub: C.wind?.label },
      { key: 'visibility',    icon: '👁️', label: 'Sky',        val: weatherCodeText(wc),sub: C.visibility?.label },
      { key: 'moon',          icon: '🌙', label: 'Moon',       val: C.moon?.value,      sub: C.moon?.label },
      { key: 'seaSurfaceTemp',icon: '🌡️', label: 'Air Temp',   val: `${sc.airF}°F`,     sub: 'Current air' },
    ] : [
      { key: 'wind',          icon: '💨', label: 'Wind',       val: C.wind?.value,                                   sub: C.wind?.label },
      { key: 'tide',          icon: '🌊', label: 'Tide',       val: tidePhase.label,                                 sub: nextTideNote || C.tide?.label },
      { key: 'current',       icon: '🔄', label: 'Current',    val: C.current?.value,                                sub: C.current?.label },
      { key: 'seaSurfaceTemp',icon: '🌡️', label: 'Water Temp', val: sc.sstF != null ? `${sc.sstF}°F` : null,        sub: C.seaSurfaceTemp?.label },
      { key: 'surf',          icon: '🏄', label: 'Surf',       val: sc.waveFt != null ? `${sc.waveFt} ft` : null,   sub: C.surf?.label },
      { key: 'pressure',      icon: '📊', label: 'Pressure',   val: C.pressure ? `${C.pressure.inHg} inHg` : null,  sub: C.pressure?.label },
      { key: 'visibility',    icon: '👁️', label: 'Visibility', val: weatherCodeText(wc),                            sub: C.visibility?.label },
      { key: 'humidity',      icon: '💧', label: 'Humidity',   val: `${humidity}%`,                                 sub: humidityDesc(humidity) },
      { key: 'skyCover',      icon: '☁️', label: 'Sky Cover',  val: sc.cloudCov != null ? `${sc.cloudCov}%` : null, sub: sc.cloudCov != null ? cloudCoverDesc(sc.cloudCov) : null },
    ];

    const available = cardDefs.filter(c => c.val != null);
    const cards     = available.slice(0, 6);
    // Pad to 6 if needed (shouldn't happen but be safe)
    while (cards.length < 6) cards.push({ key: 'pad' + cards.length, icon: '—', label: '', val: '—', sub: '' });

    const cardsHTML = cards.map(c => {
      const condData = C[c.key];
      const whyBtn = CONDITION_INFO[c.key] && condData
        ? `<button type="button" class="huk-fc-why-btn" aria-label="More info about ${c.label}" data-cond="${c.key}" data-score="${condData.score}" data-reason="${(condData.reason || '').replace(/"/g, '&quot;')}"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></button>`
        : '';
      const iconHTML = LINE_ICON[c.key] ? `<span class="huk-fc-stat-ic">${lineSvg(c.key)}</span>` : `<span class="huk-fc-stat-ic huk-fc-stat-ic-emoji">${c.icon}</span>`;
      return `<div class="huk-fc-stat">
        <div class="huk-fc-stat-hd">${iconHTML}<span class="huk-fc-stat-label">${c.label}</span>${whyBtn}</div>
        <strong>${c.val}</strong>
        ${c.sub ? `<span class="huk-fc-stat-sub">${c.sub}</span>` : ''}
      </div>`;
    }).join('');

    const licenseHTML = stateCode ? buildLicenseHTML(stateCode, lat, lon, station.name) : '';
    const tideGraph   = buildTideGraph(todayTides);
    const panelHTML   = isInland
      ? buildSolunarPanel(solunar)
      : (upcoming.length > 0 ? `<div class="huk-fc-tides"><div class="huk-fc-tides-title">Today's Tide</div>${tideGraph}<div class="huk-fc-frows">${tideRows}</div></div>` : '');
    const confidenceBadge = sc.confidence === 'high' ? '' :
      `<span class="huk-fc-conf huk-fc-conf-${sc.confidence}">${sc.confidence} confidence</span>`;

    // Tab teaser — best day from 7-day forecast
    const DAYS_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let bestDayTeaser = '';
    if (weather.daily?.time) {
      let bScore = 0, bName = '';
      weather.daily.time.slice(1).forEach((ds, idx) => {
        const i  = idx + 1;
        const s7 = computeDayScore(weather.daily.wind_speed_10m_max?.[i] || 0, weather.daily.wave_height_max?.[i] ?? null, weather.daily.weather_code?.[i] || 0);
        if (s7 > bScore) { bScore = s7; bName = DAYS_S[new Date(ds + 'T12:00:00').getDay()]; }
      });
      if (bName) bestDayTeaser = `<span class="huk-fc-tab-best">★ Best ${bName}</span>`;
    }
    const seenDot = (() => { try { return !!sessionStorage.getItem('huk_fc_7day_seen'); } catch { return false; } })();
    const dotHTML = seenDot ? '' : `<span class="huk-fc-tab-dot" aria-hidden="true"></span>`;

    const dateStr = new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const locName = stateCode && LICENSE[stateCode] ? LICENSE[stateCode].name : (station && station.name ? station.name.replace(/ tide.*$/i, '') : 'Your location');
    const stationLine = isInland
      ? `<div class="huk-fc-modeline">${lineSvg('pin','huk-fc-ln-sm')} Inland · weather, pressure, moon &amp; sun times</div>`
      : (station && station.name
          ? `<div class="huk-fc-modeline">${lineSvg('pin','huk-fc-ln-sm')} ${station.name}${station.distKm != null ? ` · ${station.distKm} mi` : ''}</div>`
          : '');

    const hero = `
      <div class="huk-fc-hero">
        <div class="huk-fc-hero-top">
          <span class="huk-fc-loc">${lineSvg('pin','huk-fc-ln-sm')} ${locName}</span>
          <span>${dateStr}</span>
        </div>
        <div class="huk-fc-score-block">
          <div class="huk-fc-score-num">${score}</div>
          <div class="huk-fc-score-verdict">${sc.overallLabel}</div>
          <div class="huk-fc-score-tagline">${sc.overallTagline}</div>
        </div>
        <div class="huk-fc-scale-eyebrow">Cast score scale</div>
        <div class="huk-fc-score-track"><div class="huk-fc-score-dot" style="left:${score}%"></div></div>
        <div class="huk-fc-score-scale"><span>Skunked</span><span>Slow</span><span>Grind</span><span>Worth It</span><span>Fish On</span><span>Drop All</span></div>
        <div class="huk-fc-hero-weather">
          <span class="huk-fc-cond">${weatherCodeIcon(wc)} ${weatherCodeText(wc)}</span>
          <span class="huk-fc-temp">${temp}°</span>
        </div>
        ${confidenceBadge}
      </div>`;

    const todayPane = `
      ${sc.overallSummary ? `<div class="huk-fc-summary">${sc.overallSummary}</div>` : ''}
      <div class="huk-fc-body">
        <div class="huk-fc-col-main">
          <div class="huk-fc-stats">${cardsHTML}</div>
          <div class="huk-fc-info-drawer" aria-live="polite">
            <div class="huk-fc-info-drawer-inner">
              <div class="huk-fc-info-drawer-hd">
                <span class="huk-fc-info-drawer-title"></span>
                <button type="button" class="huk-fc-info-close" aria-label="Close info">✕</button>
              </div>
              <div class="huk-fc-info-drawer-body">
                <p class="huk-fc-info-why"></p>
                <div class="huk-fc-score-bar-wrap">
                  <div class="huk-fc-score-bar-label"><span>Sub-score</span><span class="huk-fc-score-bar-val"></span></div>
                  <div class="huk-fc-score-bar-track"><div class="huk-fc-score-bar-fill"></div></div>
                </div>
                <div class="huk-fc-sweet-spot"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="huk-fc-col-side">
          ${panelHTML}
          ${licenseHTML}
        </div>
      </div>`;

    return `
      ${hero}
      <div class="huk-fc-tabs" role="tablist">
        <button class="huk-fc-tab active" data-tab="today" role="tab" aria-selected="true">
          <span class="huk-fc-tab-name">Today</span>
        </button>
        <button class="huk-fc-tab" data-tab="7day" role="tab" aria-selected="false">
          <span class="huk-fc-tab-name">7-Day</span>
          ${(bestDayTeaser || dotHTML) ? `<span class="huk-fc-tab-meta">${bestDayTeaser}${dotHTML}</span>` : ''}
        </button>
      </div>
      ${stationLine}
      <div class="huk-fc-pane huk-fc-pane-today" role="tabpanel">${todayPane}</div>
      <div class="huk-fc-pane huk-fc-pane-7day huk-fc-pane-hidden" role="tabpanel">${build7DayPaneHTML(weather)}</div>`;
  }

  function buildLoadingHTML() {
    return `<div class="huk-fc-loading">
      <div class="huk-fc-spinner"></div>
      <span>Loading conditions…</span>
    </div>`;
  }

  function buildErrorHTML(msg) {
    return `<div class="huk-fc-error">
      <span>⚠️ ${msg || 'Unable to load conditions. Allow location access to see local data.'}</span>
    </div>`;
  }

  // ── License section interactivity ───────────────────────────
  // Uses event delegation on the container so it survives re-renders.
  function attachWidgetHandlers(root) {
    // Guard against double-attachment (loadConditions can render twice:
    // cached then fresh). A second listener would toggle every click twice.
    if (root.dataset.hukHandlersAttached === '1') return;
    root.dataset.hukHandlersAttached = '1';

    // Tab switching
    root.addEventListener('click', function(e) {
      const tab = e.target.closest('.huk-fc-tab');
      if (tab) {
        const tabName = tab.dataset.tab;
        root.querySelectorAll('.huk-fc-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.tab === tabName);
          t.setAttribute('aria-selected', t.dataset.tab === tabName ? 'true' : 'false');
        });
        root.querySelectorAll('.huk-fc-pane').forEach(p => {
          const isToday = p.classList.contains('huk-fc-pane-today');
          const is7day  = p.classList.contains('huk-fc-pane-7day');
          if (tabName === 'today') { p.classList.toggle('huk-fc-pane-hidden', !isToday); }
          else                     { p.classList.toggle('huk-fc-pane-hidden', !is7day);  }
        });
        // Dismiss discovery dot
        if (tabName === '7day') {
          try { sessionStorage.setItem('huk_fc_7day_seen', '1'); } catch {}
          const dot = root.querySelector('.huk-fc-tab-dot');
          if (dot) dot.remove();
        }
        return;
      }

      // Why? button
      const whyBtn = e.target.closest('.huk-fc-why-btn');
      if (whyBtn) {
        const drawer = root.querySelector('.huk-fc-info-drawer');
        if (!drawer) return;
        const key = whyBtn.dataset.cond;
        const info = CONDITION_INFO[key];
        if (!info) return;
        const score  = parseInt(whyBtn.dataset.score, 10);
        const reason = whyBtn.dataset.reason;
        const scoreColor = scoreToColor(score);
        const alreadyOpen = drawer.classList.contains('open') && drawer.dataset.cond === key;
        if (alreadyOpen) {
          drawer.classList.remove('open');
          drawer.removeAttribute('data-cond');
          return;
        }
        drawer.dataset.cond = key;
        drawer.querySelector('.huk-fc-info-drawer-title').textContent = `${info.icon} ${info.title}`;
        drawer.querySelector('.huk-fc-info-why').textContent = reason || info.sweetSpot;
        drawer.querySelector('.huk-fc-score-bar-val').textContent = `${score}/100`;
        const fill = drawer.querySelector('.huk-fc-score-bar-fill');
        fill.style.width = `${score}%`;
        fill.style.background = scoreColor;
        drawer.querySelector('.huk-fc-sweet-spot').textContent = `Sweet spot: ${info.sweetSpot}`;
        drawer.classList.add('open');
        return;
      }

      // Info drawer close button
      if (e.target.closest('.huk-fc-info-close')) {
        const drawer = root.querySelector('.huk-fc-info-drawer');
        if (drawer) { drawer.classList.remove('open'); drawer.removeAttribute('data-cond'); }
        return;
      }
    });

    // Existing license handlers
    attachLicenseHandlers(root);
  }

  function attachLicenseHandlers(root) {
    root.addEventListener('click', async function handler(e) {
      // Travel toggle
      const toggle = e.target.closest('.huk-fc-travel-toggle');
      if (toggle) {
        const body = toggle.closest('.huk-fc-travel-wrap').querySelector('.huk-fc-travel-body');
        const open = body.hasAttribute('hidden');
        if (open) { body.removeAttribute('hidden'); } else { body.setAttribute('hidden', ''); }
        toggle.setAttribute('aria-expanded', open);
        toggle.querySelector('.huk-fc-travel-chevron').textContent = open ? '⌄' : '›';
        return;
      }

      // ZIP submit button
      const submitBtn = e.target.closest('.huk-fc-zip-submit');
      if (submitBtn) {
        const wrap   = submitBtn.closest('.huk-fc-travel-body');
        const input  = wrap.querySelector('.huk-fc-zip-input');
        const result = wrap.querySelector('.huk-fc-travel-result');
        const zip    = input.value.trim();

        if (!/^\d{5}$/.test(zip)) {
          result.innerHTML = `<p class="huk-fc-travel-err">Please enter a valid 5-digit ZIP code.</p>`;
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '…';
        result.innerHTML = '';

        try {
          const place = await fetchStateFromZip(zip);
          result.innerHTML = buildTravelResultHTML(place);
        } catch {
          result.innerHTML = `<p class="huk-fc-travel-err">ZIP code not found. Try another.</p>`;
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Look Up';
        }
        return;
      }

      // Allow Enter key on ZIP input
    });

    root.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.classList.contains('huk-fc-zip-input')) {
        const submit = e.target.closest('.huk-fc-zip-row').querySelector('.huk-fc-zip-submit');
        if (submit) submit.click();
      }
    });
  }

  // ── Cache ───────────────────────────────────────────────────
  function getCached() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) return null;
      return data;
    } catch { return null; }
  }

  function setCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch {}
  }

  // ── Render helpers ──────────────────────────────────────────
  function renderInto(el, html) {
    const target = el.querySelector('.huk-fc-inner') || el;
    target.innerHTML = html;
    el.classList.remove('huk-fc-loaded', 'huk-fc-error-state');
  }

  function markLoaded(el) {
    el.classList.add('huk-fc-loaded');
    el.classList.remove('huk-fc-error-state');
  }

  function markError(el) {
    el.classList.add('huk-fc-error-state');
    el.classList.remove('huk-fc-loaded');
  }

  // ── Main load ───────────────────────────────────────────────
  function buildLocationPromptHTML() {
    return `<div class="huk-fc-loc-prompt">
      <span class="huk-fc-loc-icon">📍</span>
      <div class="huk-fc-loc-text">
        <strong>See conditions near you</strong>
        <span>Share your location to get live fishing conditions, tides, and a cast score for your area.</span>
      </div>
      <button type="button" class="huk-fc-loc-btn">Allow Location</button>
    </div>`;
  }

  async function loadConditions(containers) {
    const cached = getCached();
    if (cached) {
      containers.forEach(el => {
        renderInto(el, buildWidgetHTML(...cached));
        markLoaded(el);
        attachWidgetHandlers(el.querySelector('.huk-fc-inner') || el);
      });
      return;
    }

    // Check if permission already granted — skip prompt if so
    let permState = 'prompt';
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      permState = result.state;
    } catch {}

    if (permState === 'prompt') {
      containers.forEach(el => renderInto(el, buildLocationPromptHTML()));
      await new Promise(resolve => {
        containers.forEach(el => {
          const btn = (el.querySelector('.huk-fc-inner') || el).querySelector('.huk-fc-loc-btn');
          if (btn) btn.addEventListener('click', resolve, { once: true });
        });
      });
    }

    containers.forEach(el => renderInto(el, buildLoadingHTML()));

    // Geolocation
    let lat, lon;
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
          maximumAge: 5 * 60 * 1000,
        })
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {
      containers.forEach(el => {
        renderInto(el, buildErrorHTML('Location access required for local conditions.'));
        markError(el);
      });
      return;
    }

    try {
      const station = nearestNoaaStation(lat, lon);
      // Inland if the nearest NOAA tide station is too far to be relevant.
      const isInland = station.distKm > 45;

      // Fetch weather, tides (coastal only), and state in parallel
      const [weather, tides, stateInfo] = await Promise.all([
        fetchWeather(lat, lon),
        isInland ? Promise.resolve([]) : fetchTides(station.id),
        fetchStateFromCoords(lat, lon),
      ]);

      const stateCode = stateInfo?.stateCode || null;
      const tidePhase = isInland ? { label: '—', incoming: null } : tidePhaseLabel(tides);
      const solunar   = isInland ? computeSolunar(lat, lon) : null;
      const args      = [weather, tides, station, tidePhase, lat, lon, stateCode, solunar];
      setCache(args);

      containers.forEach(el => {
        renderInto(el, buildWidgetHTML(...args));
        markLoaded(el);
        attachWidgetHandlers(el.querySelector('.huk-fc-inner') || el);
      });

      document.dispatchEvent(new CustomEvent('huk-fc-data', {
        detail: { weather, tides, station, tidePhase, lat, lon, stateCode },
      }));
    } catch (err) {
      console.error('[FishingWidget]', err);
      containers.forEach(el => {
        renderInto(el, buildErrorHTML('Could not load conditions right now.'));
        markError(el);
      });
    }
  }

  function getAllContainers() {
    return [
      ...document.querySelectorAll('.huk-fc-section-body'),
      ...document.querySelectorAll('.huk-fc-float-body'),
    ];
  }

  // ── Floating widget toggle ──────────────────────────────────
  function initFloatingWidget() {
    const fab   = document.getElementById('huk-fc-fab');
    const panel = document.getElementById('huk-fc-float-panel');
    const close = document.getElementById('huk-fc-float-close');
    if (!fab || !panel) return;

    fab.addEventListener('click', () => {
      const open = panel.classList.toggle('huk-fc-panel-open');
      fab.setAttribute('aria-expanded', open);
      if (open && !panel.classList.contains('huk-fc-loaded')) {
        loadConditions([panel.querySelector('.huk-fc-float-body') || panel]);
      }
    });

    if (close) {
      close.addEventListener('click', () => {
        panel.classList.remove('huk-fc-panel-open');
        fab.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function reload(containers) {
    sessionStorage.removeItem(CACHE_KEY);
    loadConditions(containers || getAllContainers());
  }

  function init() {
    const sections = Array.from(document.querySelectorAll('.huk-fc-section-body'));
    if (sections.length > 0) loadConditions(sections);
    initFloatingWidget();

    document.addEventListener('huk-fc-reload', (e) => {
      const targets = e.detail && e.detail.containers
        ? e.detail.containers
        : getAllContainers();
      reload(targets);
    });
  }

  window.HukFishingConditions = { reload, loadConditions };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
