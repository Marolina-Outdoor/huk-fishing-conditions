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

  const CACHE_KEY = 'huk_fishing_conditions_v2';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

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

    const dotLabels = pts.map(p => {
      const x = tx(p.ms).toFixed(1);
      const y = ty(p.h).toFixed(1);
      const isH = p.type === 'H';
      const color = isH ? '#29ABE2' : '#0f4c81';
      const time = new Date(p.ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const labelY = (isH ? parseFloat(y) - 5 : parseFloat(y) + 11).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="2.5" fill="${color}"/>
        <text x="${x}" y="${labelY}" text-anchor="middle" font-size="6.5" fill="${color}" font-family="Manrope,sans-serif" font-weight="600">${time}</text>`;
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
    if (overallScore >= 90) { overallLabel = 'Pack the Cooler'; overallColor = '#22c55e'; }
    else if (overallScore >= 75) { overallLabel = 'Fish On';         overallColor = '#84cc16'; }
    else if (overallScore >= 60) { overallLabel = 'Wet a Line';      overallColor = '#f0b429'; }
    else if (overallScore >= 40) { overallLabel = 'Keep the Tip Up'; overallColor = '#f59e0b'; }
    else if (overallScore >= 20) { overallLabel = "Bird's Nest";     overallColor = '#f97316'; }
    else                          { overallLabel = 'Skunk Watch';     overallColor = '#ef4444'; }

    const taglines = {
      'Pack the Cooler':  'Conditions are dialed. Get out there.',
      'Fish On':          'Good window with strong potential.',
      'Wet a Line':       'Fishable, but stay sharp.',
      'Keep the Tip Up':  'Mixed conditions. Timing matters.',
      "Bird's Nest":      'Tough conditions and low confidence.',
      'Skunk Watch':      'Rough day. Expectations low.',
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
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,cloud_cover,surface_pressure&hourly=surface_pressure&wind_speed_unit=kmh&temperature_unit=fahrenheit&forecast_days=1&timezone=auto`;
    const marineUrl  = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_period,sea_surface_temperature&forecast_days=1&timezone=auto`;

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
    }

    return weather;
  }

  async function fetchTides(stationId) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=24&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=huk_fishing_widget&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Tide fetch failed');
    const data = await res.json();
    return data.predictions || [];
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

  function buildWidgetHTML(weather, tides, station, tidePhase, lat, lon, stateCode) {
    const sc           = computeFishingScore(weather, tides, tidePhase);
    const score        = sc.overallScore;
    const scoreColor   = sc.overallColor;
    const wc           = weather.current.weather_code;
    const temp         = Math.round(weather.current.temperature_2m);
    const windKmh      = weather.current.wind_speed_10m;
    const windDir      = weather.current.wind_direction_10m;
    const humidity     = weather.current.relative_humidity_2m;
    const C            = sc.conditionScores;

    const now = Date.now();
    const upcoming = tides
      .filter(t => new Date(t.t.replace(' ', 'T')).getTime() >= now - 30 * 60 * 1000)
      .slice(0, 4);

    const nextTide = tides.find(t => new Date(t.t.replace(' ', 'T')).getTime() > now);
    const nextTideNote = nextTide
      ? `${nextTide.type === 'H' ? 'High' : 'Low'} at ${new Date(nextTide.t.replace(' ', 'T')).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
      : '';

    const tideRows = upcoming.map(t => {
      const d = new Date(t.t.replace(' ', 'T'));
      const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const isHigh = t.type === 'H';
      return `<div class="huk-fc-tide-row">
        <span class="huk-fc-tide-type ${isHigh ? 'high' : 'low'}">${isHigh ? '▲' : '▼'} ${isHigh ? 'High' : 'Low'} tide</span>
        <span class="huk-fc-tide-time">${time}</span>
        <span class="huk-fc-tide-ht">${parseFloat(t.v).toFixed(1)} ft</span>
      </div>`;
    }).join('');

    // Build exactly 6 condition cards in priority order
    // Priority: Wind, Tide, Current, Water Temp (if available), Surf (if available), Pressure, Visibility, Humidity
    const cardDefs = [
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

    const cardsHTML = cards.map(c => `
      <div class="huk-fc-stat">
        <div class="huk-fc-stat-hd"><span class="huk-fc-stat-icon">${c.icon}</span><span class="huk-fc-stat-label">${c.label}</span></div>
        <strong>${c.val}</strong>
        ${c.sub ? `<span class="huk-fc-stat-sub">${c.sub}</span>` : ''}
      </div>`).join('');

    const licenseHTML = stateCode ? buildLicenseHTML(stateCode, lat, lon, station.name) : '';
    const tideGraph   = buildTideGraph(tides);
    const confidenceBadge = sc.confidence === 'high' ? '' :
      `<span class="huk-fc-conf huk-fc-conf-${sc.confidence}">${sc.confidence} confidence</span>`;

    return `
      <div class="huk-fc-data">
        <div class="huk-fc-cast-row">
          <div class="huk-fc-score-ring" style="--score-color:${scoreColor}">
            <svg viewBox="0 0 48 48" class="huk-fc-ring-svg">
              <circle cx="24" cy="24" r="20" stroke="#e5e7eb" stroke-width="4" fill="none"/>
              <circle cx="24" cy="24" r="20" stroke="${scoreColor}" stroke-width="4" fill="none"
                stroke-dasharray="${(score / 100 * 125.66).toFixed(1)} 125.66"
                stroke-dashoffset="31.4" stroke-linecap="round"
                transform="rotate(-90 24 24)"/>
            </svg>
            <div class="huk-fc-ring-inner">
              <span class="huk-fc-score-num">${score}</span>
              <span class="huk-fc-score-sub">SCORE</span>
            </div>
          </div>
          <div class="huk-fc-cast-meta">
            <span class="huk-fc-cast-label">Cast Score</span>
            <span class="huk-fc-cast-headline" style="color:${scoreColor}">${score}/100 · ${sc.overallLabel}</span>
            <span class="huk-fc-cast-detail">${sc.overallTagline}</span>
            ${confidenceBadge}
          </div>
        </div>
        <div class="huk-fc-weather-row">
          <span class="huk-fc-icon">${weatherCodeIcon(wc)}</span>
          <span class="huk-fc-weather-desc">${weatherCodeText(wc)}</span>
          <span class="huk-fc-weather-sep">·</span>
          <span class="huk-fc-temp">${temp}°F</span>
        </div>
        ${sc.overallSummary ? `<div class="huk-fc-summary">${sc.overallSummary}</div>` : ''}
        <div class="huk-fc-stats">
          ${cardsHTML}
        </div>
        ${upcoming.length > 0 ? `
        <div class="huk-fc-tides">
          <div class="huk-fc-tides-title">Today's tide times</div>
          ${tideGraph}
          ${tideRows}
        </div>` : ''}
        ${licenseHTML}
      </div>`;
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
  async function loadConditions(containers) {
    containers.forEach(el => renderInto(el, buildLoadingHTML()));

    const cached = getCached();
    if (cached) {
      containers.forEach(el => {
        renderInto(el, buildWidgetHTML(...cached));
        markLoaded(el);
        attachLicenseHandlers(el.querySelector('.huk-fc-inner') || el);
      });
      return;
    }

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

      // Fetch weather, tides, and state in parallel
      const [weather, tides, stateInfo] = await Promise.all([
        fetchWeather(lat, lon),
        fetchTides(station.id),
        fetchStateFromCoords(lat, lon),
      ]);

      const stateCode = stateInfo?.stateCode || null;
      const tidePhase = tidePhaseLabel(tides);
      const args      = [weather, tides, station, tidePhase, lat, lon, stateCode];
      setCache(args);

      containers.forEach(el => {
        renderInto(el, buildWidgetHTML(...args));
        markLoaded(el);
        attachLicenseHandlers(el.querySelector('.huk-fc-inner') || el);
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
