(function () {
  'use strict';

  /* =========================================================================
     Reference / seed data
     ========================================================================= */

  var STORAGE_KEY = 'shopifyAdminMock:v1';
  var ONBOARD_KEY = 'shopifyAdminMock:onboarded';

  var VIEWS = ['home', 'orders', 'products', 'customers', 'analytics', 'marketing', 'discounts', 'content', 'settings'];

  var DEFAULT_STATE = {
    storeName: "Theo's Store",
    ownerName: 'Theo',
    currency: '$',
    periodDays: 30,
    sessionsPerDay: 280,
    conversionRate: 3.7,
    aov: 68.4,
    returningRate: 27,
    seed: 42
  };

  var KPI_DEFS = [
    { key: 'totalSales', label: 'Total sales', type: 'currency' },
    { key: 'orders', label: 'Orders', type: 'integer' },
    { key: 'conversionRate', label: 'Conversion rate', type: 'percent' },
    { key: 'sessions', label: 'Sessions', type: 'integer' },
    { key: 'aov', label: 'Average order value', type: 'currency' },
    { key: 'returningRate', label: 'Returning customer rate', type: 'percent' }
  ];

  var CHANNEL_SPLIT = [
    { name: 'Online Store', share: 0.64 },
    { name: 'Point of Sale', share: 0.14 },
    { name: 'Social', share: 0.12 },
    { name: 'Direct', share: 0.10 }
  ];

  var DEVICE_SPLIT = [
    { name: 'Mobile', share: 0.66 },
    { name: 'Desktop', share: 0.29 },
    { name: 'Tablet', share: 0.05 }
  ];

  var PRODUCTS = [
    { name: 'Classic Tee', price: 24, weight: 0.14 },
    { name: 'Pullover Hoodie', price: 58, weight: 0.13 },
    { name: 'Canvas Tote Bag', price: 22, weight: 0.10 },
    { name: 'Ceramic Mug', price: 16, weight: 0.09 },
    { name: 'Wool Beanie', price: 20, weight: 0.08 },
    { name: 'Leather Wallet', price: 48, weight: 0.08 },
    { name: 'Dot-grid Notebook', price: 14, weight: 0.07 },
    { name: 'Sticker Pack', price: 8, weight: 0.07 },
    { name: 'Steel Water Bottle', price: 26, weight: 0.06 },
    { name: 'Baseball Cap', price: 22, weight: 0.05 },
    { name: 'Phone Case', price: 19, weight: 0.05 },
    { name: 'Crew Socks (2-pack)', price: 13, weight: 0.04 },
    { name: 'Enamel Pin Set', price: 12, weight: 0.03 },
    { name: 'Soy Candle', price: 28, weight: 0.01 }
  ];

  var FIRST_NAMES = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Elijah', 'Sophia', 'Lucas', 'Mia', 'Mason',
    'Isabella', 'Ethan', 'Amelia', 'Logan', 'Harper', 'Jacob', 'Evelyn', 'Aiden', 'Abigail', 'Benjamin',
    'Freya', 'Oscar', 'Nora', 'Felix', 'Ines'];

  var LAST_NAMES = ['Johansson', 'Bergstrom', 'Andersson', 'Karlsson', 'Nilsson', 'Lindqvist', 'Svensson',
    'Berg', 'Holm', 'Lund', 'Ekstrom', 'Nystrom', 'Dahl', 'Wallin', 'Fors', 'Hedlund', 'Moller', 'Novak',
    'Fischer', 'Rossi', 'Dubois', 'Kowalski', 'Murphy', 'Costa', 'Hughes'];

  var LOCATIONS = ['Stockholm, SE', 'Gothenburg, SE', 'Oslo, NO', 'Copenhagen, DK', 'Helsinki, FI',
    'Berlin, DE', 'Amsterdam, NL', 'London, UK', 'Paris, FR', 'Dublin, IE', 'New York, US', 'Austin, US',
    'Toronto, CA', 'Vancouver, CA', 'Sydney, AU', 'Auckland, NZ'];

  var AVATAR_COLORS = ['#008060', '#5c6ac4', '#de3618', '#f49342', '#47c1bf', '#9c6ade', '#eec200', '#006fbb'];

  /* =========================================================================
     Small utilities
     ========================================================================= */

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function distributeInt(total, weights) {
    total = Math.max(0, Math.round(total));
    var sum = weights.reduce(function (a, b) { return a + b; }, 0) || 1;
    var raw = weights.map(function (w) { return (w / sum) * total; });
    var floors = raw.map(Math.floor);
    var remainder = total - floors.reduce(function (a, b) { return a + b; }, 0);
    var order = raw.map(function (v, i) { return { i: i, frac: v - floors[i] }; })
      .sort(function (a, b) { return b.frac - a.frac; });
    var result = floors.slice();
    for (var k = 0; k < remainder && k < order.length; k++) { result[order[k].i]++; }
    return result;
  }

  function scaleToSum(arr, targetSum) {
    var sum = arr.reduce(function (a, b) { return a + b; }, 0) || 1;
    var factor = targetSum / sum;
    return arr.map(function (v) { return v * factor; });
  }

  function formatCurrency(v) {
    var sign = v < 0 ? '-' : '';
    return sign + state.currency + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function formatInt(v) { return Math.round(v).toLocaleString('en-US'); }
  function formatByType(v, type) {
    if (type === 'currency') return formatCurrency(v);
    if (type === 'percent') return v.toFixed(1) + '%';
    return formatInt(v);
  }
  function badgeCount(n) { return n > 999 ? '999+' : formatInt(n); }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function formatAxisDate(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

  function formatRelativeDate(d) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var dd = new Date(d); dd.setHours(0, 0, 0, 0);
    var diffDays = Math.round((today - dd) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return formatAxisDate(dd);
  }

  function colorFor(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }
  function initials(name) {
    return name.split(' ').filter(Boolean).map(function (p) { return p[0]; }).slice(0, 2).join('').toUpperCase();
  }

  /* =========================================================================
     State: load / persist / derive
     ========================================================================= */

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var merged = {};
        for (var k in DEFAULT_STATE) { merged[k] = (parsed[k] !== undefined) ? parsed[k] : DEFAULT_STATE[k]; }
        return merged;
      }
    } catch (e) { /* ignore corrupted storage */ }
    var copy = {};
    for (var k2 in DEFAULT_STATE) { copy[k2] = DEFAULT_STATE[k2]; }
    return copy;
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  var state = loadState();
  var _baselineCache = null;

  function computeDerived(s) {
    var sessions = Math.max(1, Math.round(s.sessionsPerDay * s.periodDays));
    var orders = Math.max(0, Math.round(sessions * s.conversionRate / 100));
    var totalSales = Math.round(orders * s.aov * 100) / 100;
    var customers = Math.max(0, Math.round(orders / (1 + s.returningRate / 100)));
    return { sessions: sessions, orders: orders, totalSales: totalSales, customers: customers };
  }

  /* ---- editable-field setters: each holds the "other" driver constant ---- */

  function setSessions(v) {
    v = Math.max(1, Math.round(v));
    state.sessionsPerDay = v / state.periodDays;
  }
  function setOrders(v) {
    var d = computeDerived(state);
    v = Math.max(0, Math.round(v));
    state.conversionRate = clamp(d.sessions > 0 ? (v / d.sessions * 100) : 0, 0, 100);
  }
  function setConversionRate(v) { state.conversionRate = clamp(v, 0, 100); }
  function setAov(v) { state.aov = Math.max(0, v); }
  function setTotalSales(v) {
    var d = computeDerived(state);
    state.aov = d.orders > 0 ? Math.max(0, v / d.orders) : state.aov;
  }
  function setReturningRate(v) { state.returningRate = clamp(v, 0, 100); }

  /* =========================================================================
     Organic daily series generation (seeded, deterministic, exact-sum)
     ========================================================================= */

  function makeShape(n, seed) {
    var rand = mulberry32(seed);
    var level = 1;
    var vals = [];
    for (var i = 0; i < n; i++) {
      level += (rand() - 0.5) * 0.25;
      level = clamp(level, 0.25, 2.2);
      var dow = i % 7;
      var weekend = (dow === 5 || dow === 6) ? 1.12 : 1;
      vals.push(level * weekend);
    }
    var sum = vals.reduce(function (a, b) { return a + b; }, 0);
    return vals.map(function (v) { return v / sum; });
  }

  function blendShapes(a, b, wA) {
    var out = a.map(function (v, i) { return v * wA + b[i] * (1 - wA); });
    var sum = out.reduce(function (x, y) { return x + y; }, 0);
    return out.map(function (v) { return v / sum; });
  }

  function getBaseline() {
    if (_baselineCache && _baselineCache.seed === state.seed) return _baselineCache;
    var n = 90;
    var sessionsShape = makeShape(n, state.seed * 3 + 1);
    var ordersRaw = makeShape(n, state.seed * 3 + 2);
    var ordersShape = blendShapes(sessionsShape, ordersRaw, 0.65);
    var salesRaw = makeShape(n, state.seed * 3 + 3);
    var salesShape = blendShapes(ordersShape, salesRaw, 0.75);
    _baselineCache = { seed: state.seed, n: n, sessionsShape: sessionsShape, ordersShape: ordersShape, salesShape: salesShape };
    return _baselineCache;
  }

  function correctedFullSeries(shape, periodTotal, N) {
    var n = shape.length;
    var lastNSum = shape.slice(n - N).reduce(function (a, b) { return a + b; }, 0) || 1e-9;
    var factor = periodTotal / lastNSum;
    return shape.map(function (v) { return v * factor; });
  }

  function getPeriodData() {
    var d = computeDerived(state);
    var base = getBaseline();
    var n = base.n;
    var N = state.periodDays;

    var sessionsFull = correctedFullSeries(base.sessionsShape, d.sessions, N);
    var ordersFull = correctedFullSeries(base.ordersShape, d.orders, N);
    var salesFull = correctedFullSeries(base.salesShape, d.totalSales, N);

    var sessionsDaily = distributeInt(d.sessions, base.sessionsShape.slice(n - N));
    var ordersDaily = distributeInt(d.orders, base.ordersShape.slice(n - N));
    var salesDaily = scaleToSum(base.salesShape.slice(n - N), d.totalSales);

    var dates = [];
    var today = new Date();
    for (var i = N - 1; i >= 0; i--) {
      var dt = new Date(today);
      dt.setDate(today.getDate() - i);
      dates.push(dt);
    }

    return {
      N: N, derived: d,
      sessionsDaily: sessionsDaily, ordersDaily: ordersDaily, salesDaily: salesDaily,
      sessionsFull: sessionsFull, ordersFull: ordersFull, salesFull: salesFull,
      dates: dates
    };
  }

  function sum(arr) { return arr.reduce(function (a, b) { return a + b; }, 0); }

  function deltaFromFull(full, N) {
    var n = full.length, cur, prev;
    if (2 * N <= n) { cur = full.slice(n - N); prev = full.slice(n - 2 * N, n - N); }
    else { var half = Math.floor(n / 2); cur = full.slice(half); prev = full.slice(0, half); }
    var curSum = sum(cur), prevSum = sum(prev);
    return prevSum > 0 ? (curSum - prevSum) / prevSum * 100 : 0;
  }

  function deltaRatio(numFull, denFull, N) {
    var n = numFull.length, curN, curD, prevN, prevD;
    if (2 * N <= n) {
      curN = sum(numFull.slice(n - N)); curD = sum(denFull.slice(n - N));
      prevN = sum(numFull.slice(n - 2 * N, n - N)); prevD = sum(denFull.slice(n - 2 * N, n - N));
    } else {
      var half = Math.floor(n / 2);
      curN = sum(numFull.slice(half)); curD = sum(denFull.slice(half));
      prevN = sum(numFull.slice(0, half)); prevD = sum(denFull.slice(0, half));
    }
    var cur = curD > 0 ? curN / curD : 0, prev = prevD > 0 ? prevN / prevD : 0;
    return prev > 0 ? (cur - prev) / prev * 100 : 0;
  }

  function kpiRawValue(key, pd) {
    switch (key) {
      case 'totalSales': return pd.derived.totalSales;
      case 'orders': return pd.derived.orders;
      case 'conversionRate': return state.conversionRate;
      case 'sessions': return pd.derived.sessions;
      case 'aov': return state.aov;
      case 'returningRate': return state.returningRate;
    }
  }
  function sparkSeriesFor(key, pd) {
    switch (key) {
      case 'totalSales': return pd.salesDaily;
      case 'orders': return pd.ordersDaily;
      case 'sessions': return pd.sessionsDaily;
      case 'conversionRate': return pd.ordersDaily.map(function (o, i) { return pd.sessionsDaily[i] > 0 ? o / pd.sessionsDaily[i] * 100 : 0; });
      case 'aov': return pd.salesDaily.map(function (s, i) { return pd.ordersDaily[i] > 0 ? s / pd.ordersDaily[i] : state.aov; });
      default: return [];
    }
  }
  function kpiDelta(key, pd) {
    switch (key) {
      case 'totalSales': return deltaFromFull(pd.salesFull, pd.N);
      case 'orders': return deltaFromFull(pd.ordersFull, pd.N);
      case 'sessions': return deltaFromFull(pd.sessionsFull, pd.N);
      case 'conversionRate': return deltaRatio(pd.ordersFull, pd.sessionsFull, pd.N);
      case 'aov': return deltaRatio(pd.salesFull, pd.ordersFull, pd.N);
      default: return 0;
    }
  }

  /* =========================================================================
     Synthetic rows: orders / customers / products
     ========================================================================= */

  function generateOrders(count, totalSales, seed, N) {
    var rand = mulberry32(seed * 7 + 13);
    var displayCount = Math.min(count, 250);
    var avg = count > 0 ? totalSales / count : 0;
    var jitter = [];
    for (var i = 0; i < displayCount; i++) jitter.push(0.4 + rand() * 1.6);
    var revenues = scaleToSum(jitter, avg * displayCount);
    var rows = [];
    for (i = 0; i < displayCount; i++) {
      var daysAgo = Math.floor(rand() * Math.max(1, N));
      var date = new Date(); date.setDate(date.getDate() - daysAgo);
      var first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
      var last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
      var pRoll = rand();
      var payment = pRoll < 0.83 ? 'Paid' : (pRoll < 0.94 ? 'Pending' : 'Refunded');
      var fRoll = rand();
      var fulfillment = payment === 'Refunded' ? 'Cancelled' : (fRoll < 0.78 ? 'Fulfilled' : 'Unfulfilled');
      rows.push({ id: 0, date: date, customer: first + ' ' + last, payment: payment, fulfillment: fulfillment, total: revenues[i] });
    }
    rows.sort(function (a, b) { return b.date - a.date; });
    rows.forEach(function (r, idx) { r.id = 1000 + count - idx; });
    return rows;
  }

  function generateCustomers(count, totalSales, totalOrders, returningRate, seed) {
    var rand = mulberry32(seed * 17 + 5);
    var displayCount = Math.min(count, 200);
    var avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    var rows = [];
    for (var i = 0; i < displayCount; i++) {
      var first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
      var last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
      var isReturning = rand() * 100 < returningRate;
      var orders = isReturning ? 2 + Math.floor(rand() * 5) : 1;
      var spent = orders * avgOrderValue * (0.75 + rand() * 0.5);
      var location = LOCATIONS[Math.floor(rand() * LOCATIONS.length)];
      rows.push({ name: first + ' ' + last, location: location, orders: orders, spent: spent });
    }
    rows.sort(function (a, b) { return b.spent - a.spent; });
    return rows;
  }

  /* =========================================================================
     Chart rendering (hand-rolled SVG, no dependencies)
     ========================================================================= */

  var SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function smoothPath(pts) {
    if (pts.length === 0) return '';
    if (pts.length === 1) return 'M ' + pts[0][0].toFixed(2) + ',' + pts[0][1].toFixed(2);
    var d = 'M ' + pts[0][0].toFixed(2) + ',' + pts[0][1].toFixed(2);
    for (var i = 1; i < pts.length; i++) {
      var x0 = pts[i - 1][0], y0 = pts[i - 1][1], x1 = pts[i][0], y1 = pts[i][1];
      var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      d += ' Q ' + x0.toFixed(2) + ',' + y0.toFixed(2) + ' ' + mx.toFixed(2) + ',' + my.toFixed(2);
    }
    var last = pts[pts.length - 1];
    d += ' L ' + last[0].toFixed(2) + ',' + last[1].toFixed(2);
    return d;
  }

  function renderSparkline(svg, values, opts) {
    opts = opts || {};
    var w = 160, h = 44, pad = 3;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '';
    if (!values || values.length < 2) return;
    var color = opts.color || '#008060';
    var max = Math.max.apply(null, values.concat([0.0001]));
    var min = Math.min.apply(null, values.concat([0]));
    var range = (max - min) || 1;
    var n = values.length;
    var stepX = n > 1 ? (w - 2 * pad) / (n - 1) : 0;
    var pts = values.map(function (v, i) { return [pad + i * stepX, pad + (1 - (v - min) / range) * (h - 2 * pad)]; });
    var lineD = smoothPath(pts);
    var gradId = 'sg' + Math.random().toString(36).slice(2, 9);
    var defs = svgEl('defs', {});
    var grad = svgEl('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': '0.28' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '0' }));
    defs.appendChild(grad);
    svg.appendChild(defs);
    var areaD = lineD + ' L ' + pts[pts.length - 1][0].toFixed(2) + ',' + (h - pad) + ' L ' + pts[0][0].toFixed(2) + ',' + (h - pad) + ' Z';
    svg.appendChild(svgEl('path', { d: areaD, fill: 'url(#' + gradId + ')', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: lineD, fill: 'none', stroke: color, 'stroke-width': '1.75', 'stroke-linecap': 'round' }));
  }

  function renderMainChart(svg, values, dates, formatter, opts) {
    opts = opts || {};
    var w = 760, h = 220, padL = 44, padR = 12, padT = 14, padB = 26;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '';
    if (!values || values.length === 0) return;
    var color = opts.color || '#008060';
    var innerW = w - padL - padR, innerH = h - padT - padB;
    var max = Math.max.apply(null, values.concat([1]));
    var n = values.length;
    var stepX = n > 1 ? innerW / (n - 1) : 0;
    var pts = values.map(function (v, i) { return [padL + i * stepX, padT + (1 - v / max) * innerH]; });

    var gridG = svgEl('g', {});
    for (var i = 0; i <= 3; i++) {
      var y = padT + innerH * i / 3;
      gridG.appendChild(svgEl('line', { x1: padL, x2: w - padR, y1: y.toFixed(2), y2: y.toFixed(2), stroke: '#ececec', 'stroke-width': '1' }));
      var t = svgEl('text', { x: 2, y: (y + 4).toFixed(2), 'font-size': '10', fill: '#8c9196' });
      t.textContent = formatter(max * (1 - i / 3));
      gridG.appendChild(t);
    }
    svg.appendChild(gridG);

    var lineD = smoothPath(pts);
    var gradId = 'mg' + Math.random().toString(36).slice(2, 9);
    var defs = svgEl('defs', {});
    var grad = svgEl('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': '0.22' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '0' }));
    defs.appendChild(grad);
    svg.appendChild(defs);
    var areaD = lineD + ' L ' + pts[pts.length - 1][0].toFixed(2) + ',' + (padT + innerH) + ' L ' + pts[0][0].toFixed(2) + ',' + (padT + innerH) + ' Z';
    svg.appendChild(svgEl('path', { d: areaD, fill: 'url(#' + gradId + ')', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: lineD, fill: 'none', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round' }));

    var labelCount = Math.min(6, n);
    for (i = 0; i < labelCount; i++) {
      var idx = Math.round(i * (n - 1) / Math.max(1, labelCount - 1));
      var anchor = i === 0 ? 'start' : (i === labelCount - 1 ? 'end' : 'middle');
      var lt = svgEl('text', { x: pts[idx][0].toFixed(2), y: h - 6, 'font-size': '10', fill: '#8c9196', 'text-anchor': anchor });
      lt.textContent = formatAxisDate(dates[idx]);
      svg.appendChild(lt);
    }

    var hoverLine = svgEl('line', { y1: padT, y2: padT + innerH, stroke: '#8c9196', 'stroke-dasharray': '3,3' });
    hoverLine.style.display = 'none';
    var dot = svgEl('circle', { r: '3.5', fill: color });
    dot.style.display = 'none';
    var tipBg = svgEl('rect', { rx: '4', fill: '#202223' });
    tipBg.style.display = 'none';
    var tip = svgEl('text', { 'font-size': '11', fill: '#fff' });
    tip.style.display = 'none';
    svg.appendChild(hoverLine); svg.appendChild(dot); svg.appendChild(tipBg); svg.appendChild(tip);

    var overlay = svgEl('rect', { x: padL, y: padT, width: innerW, height: innerH, fill: 'transparent' });
    overlay.addEventListener('mousemove', function (e) {
      var rect = svg.getBoundingClientRect();
      var scaleX = w / rect.width;
      var mx = (e.clientX - rect.left) * scaleX;
      var idx2 = stepX > 0 ? Math.round((mx - padL) / stepX) : 0;
      idx2 = clamp(idx2, 0, n - 1);
      var x = pts[idx2][0], yv = pts[idx2][1];
      hoverLine.setAttribute('x1', x); hoverLine.setAttribute('x2', x); hoverLine.style.display = 'block';
      dot.setAttribute('cx', x); dot.setAttribute('cy', yv); dot.style.display = 'block';
      var label = formatAxisDate(dates[idx2]) + '  ' + formatter(values[idx2]);
      tip.textContent = label; tip.style.display = 'block';
      var tw = label.length * 6.2 + 14;
      var tx = x + 10; if (tx + tw > w) tx = x - tw - 10;
      tip.setAttribute('x', tx + 7); tip.setAttribute('y', 24);
      tipBg.setAttribute('x', tx); tipBg.setAttribute('y', 10); tipBg.setAttribute('width', tw); tipBg.setAttribute('height', 20);
      tipBg.style.display = 'block';
    });
    overlay.addEventListener('mouseleave', function () {
      hoverLine.style.display = 'none'; dot.style.display = 'none'; tip.style.display = 'none'; tipBg.style.display = 'none';
    });
    svg.appendChild(overlay);
  }

  /* =========================================================================
     HTML fragment helpers
     ========================================================================= */

  function kpiCardHTML(def, value, deltaPct) {
    var displayVal = formatByType(value, def.type);
    var extra;
    if (def.key === 'returningRate') {
      var ret = clamp(state.returningRate, 0, 100);
      extra = '<div class="kpi-split"><span style="width:' + ret + '%"></span><span style="width:' + (100 - ret) + '%"></span></div>' +
        '<div class="kpi-split-labels"><span>Returning ' + ret.toFixed(0) + '%</span><span>New ' + (100 - ret).toFixed(0) + '%</span></div>';
    } else {
      var deltaCls = deltaPct >= 0 ? 'up' : 'down';
      var arrow = deltaPct >= 0 ? '▲' : '▼';
      extra = '<span class="kpi-delta ' + deltaCls + '">' + arrow + ' ' + Math.abs(deltaPct).toFixed(1) + '% vs. prior period</span>' +
        '<svg class="kpi-chart" data-spark="' + def.key + '"></svg>';
    }
    return '<div class="card kpi-card">' +
      '<span class="kpi-label">' + def.label + '</span>' +
      '<div class="kpi-value-row"><span class="kpi-value" data-key="' + def.key + '" tabindex="0" title="Click to edit">' + displayVal + '</span></div>' +
      extra +
      '</div>';
  }

  function breakdownRowHTML(name, valueText, share) {
    var pct = Math.round(share * 1000) / 10;
    return '<div class="breakdown-row">' +
      '<div class="breakdown-top"><span class="name">' + name + '</span><span class="val">' + valueText + '</span></div>' +
      '<div class="breakdown-bar"><span style="width:' + pct + '%"></span></div>' +
      '</div>';
  }

  function paymentBadge(p) {
    var cls = p === 'Paid' ? 'badge-green' : (p === 'Pending' ? 'badge-yellow' : 'badge-red');
    return '<span class="badge ' + cls + '">' + p + '</span>';
  }
  function fulfillmentBadge(f) {
    var cls = f === 'Fulfilled' ? 'badge-green' : (f === 'Unfulfilled' ? 'badge-gray' : 'badge-red');
    return '<span class="badge ' + cls + '">' + f + '</span>';
  }
  function emptyRowHTML(colspan, text) {
    return '<tr><td colspan="' + colspan + '" style="text-align:center;color:var(--text-muted);padding:32px;">' + text + '</td></tr>';
  }
  function emptyStateHTML(title, text) {
    return '<div class="view-header"><h1>' + title + '</h1></div>' +
      '<div class="card"><div class="empty-state">' +
      '<svg viewBox="0 0 48 48" width="48" height="48"><rect x="6" y="6" width="36" height="36" rx="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<h2>Nothing here yet</h2>' +
      '<p>' + text + '</p>' +
      '</div></div>';
  }

  /* =========================================================================
     View renderers
     ========================================================================= */

  var els = {};

  function greetingText() {
    var h = new Date().getHours();
    var part = h < 12 ? 'morning' : (h < 18 ? 'afternoon' : 'evening');
    return 'Good ' + part + ', ' + (state.ownerName || 'there');
  }

  function currentView() {
    var h = location.hash.replace('#', '');
    return VIEWS.indexOf(h) !== -1 ? h : 'home';
  }

  function renderShell() {
    var pd = getPeriodData();
    els.storeNameTop.textContent = state.storeName;
    var avatarChar = (state.ownerName || 'T').trim().charAt(0).toUpperCase() || 'T';
    els.avatarBtn.textContent = avatarChar;
    document.title = state.storeName + ' · ' + capitalize(currentView());
    els.navOrdersBadge.textContent = badgeCount(pd.derived.orders);
  }

  function renderHome() {
    var pd = getPeriodData();
    els.greeting.textContent = greetingText() + ' — here’s how ' + state.storeName + ' is doing.';

    var pdBtns = els.periodSelect.querySelectorAll('button');
    for (var b = 0; b < pdBtns.length; b++) {
      pdBtns[b].classList.toggle('active', parseInt(pdBtns[b].dataset.days, 10) === state.periodDays);
    }

    els.kpiGrid.innerHTML = KPI_DEFS.map(function (def) {
      var val = kpiRawValue(def.key, pd);
      var delta = def.key === 'returningRate' ? 0 : kpiDelta(def.key, pd);
      return kpiCardHTML(def, val, delta);
    }).join('');
    var sparks = els.kpiGrid.querySelectorAll('svg[data-spark]');
    for (var i = 0; i < sparks.length; i++) {
      var key = sparks[i].getAttribute('data-spark');
      renderSparkline(sparks[i], sparkSeriesFor(key, pd));
    }

    els.chartTotalSalesLabel.textContent = formatCurrency(pd.derived.totalSales);
    renderMainChart(els.mainChart, pd.salesDaily, pd.dates, formatCurrency, { color: '#008060' });
    els.chartSessionsLabel.textContent = formatInt(pd.derived.sessions);
    renderMainChart(els.sessionsChart, pd.sessionsDaily, pd.dates, formatInt, { color: '#5c6ac4' });

    var channelAmounts = scaleToSum(CHANNEL_SPLIT.map(function (c) { return c.share; }), pd.derived.totalSales);
    els.channelList.innerHTML = CHANNEL_SPLIT.map(function (c, i2) {
      return breakdownRowHTML(c.name, formatCurrency(channelAmounts[i2]), c.share);
    }).join('');

    var deviceAmounts = distributeInt(pd.derived.sessions, DEVICE_SPLIT.map(function (d) { return d.share; }));
    els.deviceList.innerHTML = DEVICE_SPLIT.map(function (d, i2) {
      return breakdownRowHTML(d.name, formatInt(deviceAmounts[i2]), d.share);
    }).join('');

    var revenues = scaleToSum(PRODUCTS.map(function (p) { return p.weight; }), pd.derived.totalSales);
    var ranked = PRODUCTS.map(function (p, i2) { return { name: p.name, revenue: revenues[i2] }; })
      .sort(function (a, b) { return b.revenue - a.revenue; }).slice(0, 6);
    els.topProductsTable.innerHTML = ranked.map(function (p) {
      return '<tr><td>' + p.name + '</td><td class="num">' + formatCurrency(p.revenue) + '</td></tr>';
    }).join('');
  }

  function renderOrders() {
    var pd = getPeriodData();
    var rows = generateOrders(pd.derived.orders, pd.derived.totalSales, state.seed, pd.N);
    var filter = (els.orderSearch.value || '').toLowerCase().trim();
    var filtered = filter ? rows.filter(function (r) {
      return String(r.id).indexOf(filter) !== -1 || r.customer.toLowerCase().indexOf(filter) !== -1;
    }) : rows;
    els.ordersTableBody.innerHTML = filtered.length ? filtered.map(function (r) {
      return '<tr>' +
        '<td><a class="order-link" href="#orders">#' + r.id + '</a></td>' +
        '<td>' + formatRelativeDate(r.date) + '</td>' +
        '<td><div class="customer-cell"><span class="avatar-sm" style="background:' + colorFor(r.customer) + '">' + initials(r.customer) + '</span>' + r.customer + '</div></td>' +
        '<td>' + paymentBadge(r.payment) + '</td>' +
        '<td>' + fulfillmentBadge(r.fulfillment) + '</td>' +
        '<td class="num">' + formatCurrency(r.total) + '</td>' +
        '</tr>';
    }).join('') : emptyRowHTML(6, 'No orders match your search.');
    els.ordersFooter.textContent = 'Showing ' + filtered.length + ' of ' + formatInt(pd.derived.orders) + ' orders';
  }

  function renderProducts() {
    var pd = getPeriodData();
    var revenues = scaleToSum(PRODUCTS.map(function (p) { return p.weight; }), pd.derived.totalSales);
    var rand = mulberry32(state.seed * 13 + 3);
    var rows = PRODUCTS.map(function (p, i) {
      var units = Math.max(0, Math.round(revenues[i] / p.price));
      var inventory = 8 + Math.floor(rand() * 140);
      var status = rand() < 0.9 ? 'Active' : 'Draft';
      return { name: p.name, price: p.price, units: units, inventory: inventory, status: status };
    }).sort(function (a, b) { return b.units - a.units; });
    els.productsTableBody.innerHTML = rows.map(function (p) {
      var swatchInitials = p.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('');
      var statusBadge = p.status === 'Active' ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-gray">Draft</span>';
      return '<tr>' +
        '<td><div class="product-cell"><span class="product-swatch" style="background:' + colorFor(p.name) + '">' + swatchInitials + '</span>' + p.name + '</div></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td class="num">' + formatInt(p.inventory) + '</td>' +
        '<td class="num">' + formatInt(p.units) + '</td>' +
        '<td class="num">' + formatCurrency(p.price) + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderCustomers() {
    var pd = getPeriodData();
    var rows = generateCustomers(pd.derived.customers, pd.derived.totalSales, pd.derived.orders, state.returningRate, state.seed);
    els.customersTableBody.innerHTML = rows.length ? rows.map(function (c) {
      return '<tr>' +
        '<td><div class="customer-cell"><span class="avatar-sm" style="background:' + colorFor(c.name) + '">' + initials(c.name) + '</span>' + c.name + '</div></td>' +
        '<td>' + c.location + '</td>' +
        '<td class="num">' + c.orders + '</td>' +
        '<td class="num">' + formatCurrency(c.spent) + '</td>' +
        '</tr>';
    }).join('') : emptyRowHTML(4, 'No customers yet.');
    els.customersFooter.textContent = 'Showing ' + rows.length + ' of ' + formatInt(pd.derived.customers) + ' customers';
  }

  function renderAnalytics() {
    var pd = getPeriodData();
    var sessions = pd.derived.sessions, orders = pd.derived.orders;
    var addedToCart = Math.round(sessions * 0.30);
    var reachedCheckout = Math.round(addedToCart * 0.6);
    reachedCheckout = Math.max(reachedCheckout, orders);
    addedToCart = Math.max(addedToCart, reachedCheckout);
    var steps = [
      { label: 'Sessions', value: sessions },
      { label: 'Added to cart', value: addedToCart },
      { label: 'Reached checkout', value: reachedCheckout },
      { label: 'Converted', value: orders }
    ];
    els.funnel.innerHTML = steps.map(function (s) {
      var pct = sessions > 0 ? Math.max(2, s.value / sessions * 100) : 0;
      return '<div class="funnel-row"><span class="label">' + s.label + '</span><div class="track"><span style="width:' + pct + '%"></span></div><span class="count">' + formatInt(s.value) + '</span></div>';
    }).join('');
    renderMainChart(els.ordersChart, pd.ordersDaily, pd.dates, formatInt, { color: '#5c6ac4' });
    var aovDaily = pd.salesDaily.map(function (s, i) { return pd.ordersDaily[i] > 0 ? s / pd.ordersDaily[i] : state.aov; });
    renderMainChart(els.aovChart, aovDaily, pd.dates, formatCurrency, { color: '#de3618' });
  }

  function renderSettings() {
    els.settingStoreName.value = state.storeName;
    els.settingOwnerName.value = state.ownerName;
    els.settingCurrency.value = state.currency;
  }

  function renderView(name) {
    switch (name) {
      case 'home': renderHome(); break;
      case 'orders': renderOrders(); break;
      case 'products': renderProducts(); break;
      case 'customers': renderCustomers(); break;
      case 'analytics': renderAnalytics(); break;
      case 'settings': renderSettings(); break;
      default: break;
    }
  }

  function showView(name) {
    var sections = document.querySelectorAll('.view');
    for (var i = 0; i < sections.length; i++) { sections[i].hidden = sections[i].getAttribute('data-view') !== name; }
    var links = document.querySelectorAll('.nav-link');
    for (var j = 0; j < links.length; j++) { links[j].classList.toggle('active', links[j].getAttribute('data-view') === name); }
    els.sidebar.classList.remove('open');
    renderShell();
    renderView(name);
  }

  function renderAll() {
    persist();
    renderShell();
    renderView(currentView());
  }

  /* =========================================================================
     Inline KPI editing
     ========================================================================= */

  function rawEditString(v, type) {
    if (type === 'currency') return v.toFixed(2);
    if (type === 'percent') return v.toFixed(1);
    return String(Math.round(v));
  }

  function beginEdit(span) {
    var key = span.getAttribute('data-key');
    var def = null;
    for (var i = 0; i < KPI_DEFS.length; i++) { if (KPI_DEFS[i].key === key) { def = KPI_DEFS[i]; break; } }
    var pd = getPeriodData();
    var raw = kpiRawValue(key, pd);
    var input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'decimal';
    input.className = 'kpi-input kpi-edit-input';
    input.setAttribute('data-key', key);
    input.value = rawEditString(raw, def.type);
    span.replaceWith(input);
    input.focus();
    input.select();
  }

  function applyEdit(key, val) {
    switch (key) {
      case 'totalSales': setTotalSales(val); break;
      case 'orders': setOrders(val); break;
      case 'conversionRate': setConversionRate(val); break;
      case 'sessions': setSessions(val); break;
      case 'aov': setAov(val); break;
      case 'returningRate': setReturningRate(val); break;
    }
  }

  function commitEdit(input) {
    var key = input.getAttribute('data-key');
    if (input.getAttribute('data-cancel') !== '1') {
      var num = parseFloat(input.value.replace(/[^0-9.\-]/g, ''));
      if (!isNaN(num)) applyEdit(key, num);
    }
    renderAll();
  }

  /* =========================================================================
     Static wiring + init
     ========================================================================= */

  function cacheEls() {
    els = {
      onboarding: document.getElementById('onboarding'),
      onboardingClose: document.getElementById('onboardingClose'),
      navToggle: document.getElementById('navToggle'),
      sidebar: document.getElementById('sidebar'),
      storeLogo: document.getElementById('storeLogo'),
      storeNameTop: document.getElementById('storeNameTop'),
      avatarBtn: document.getElementById('avatarBtn'),
      greeting: document.getElementById('greeting'),
      periodSelect: document.getElementById('periodSelect'),
      kpiGrid: document.getElementById('kpiGrid'),
      chartTotalSalesLabel: document.getElementById('chartTotalSalesLabel'),
      chartSessionsLabel: document.getElementById('chartSessionsLabel'),
      mainChart: document.getElementById('mainChart'),
      sessionsChart: document.getElementById('sessionsChart'),
      channelList: document.getElementById('channelList'),
      deviceList: document.getElementById('deviceList'),
      topProductsTable: document.getElementById('topProductsTable'),
      orderSearch: document.getElementById('orderSearch'),
      ordersTableBody: document.getElementById('ordersTableBody'),
      ordersFooter: document.getElementById('ordersFooter'),
      productsTableBody: document.getElementById('productsTableBody'),
      customersTableBody: document.getElementById('customersTableBody'),
      customersFooter: document.getElementById('customersFooter'),
      funnel: document.getElementById('funnel'),
      ordersChart: document.getElementById('ordersChart'),
      aovChart: document.getElementById('aovChart'),
      navOrdersBadge: document.getElementById('navOrdersBadge'),
      settingStoreName: document.getElementById('settingStoreName'),
      settingOwnerName: document.getElementById('settingOwnerName'),
      settingCurrency: document.getElementById('settingCurrency'),
      randomizeBtn: document.getElementById('randomizeBtn'),
      resetBtn: document.getElementById('resetBtn')
    };
  }

  function setupEmptyStates() {
    document.getElementById('view-marketing').innerHTML = emptyStateHTML('Marketing', 'Run campaigns across email, social, and search to bring customers to your store.');
    document.getElementById('view-discounts').innerHTML = emptyStateHTML('Discounts', 'Create discount codes and automatic promotions to drive more sales.');
    document.getElementById('view-content').innerHTML = emptyStateHTML('Content', 'Manage blog posts, pages, and metaobjects for your store’s content.');
  }

  function wireStaticEvents() {
    els.onboardingClose.addEventListener('click', function () {
      els.onboarding.hidden = true;
      try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (e) { /* ignore */ }
    });
    els.navToggle.addEventListener('click', function () { els.sidebar.classList.toggle('open'); });

    els.periodSelect.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-days]');
      if (!btn) return;
      state.periodDays = parseInt(btn.getAttribute('data-days'), 10);
      renderAll();
    });

    els.kpiGrid.addEventListener('click', function (e) {
      var val = e.target.closest('.kpi-value');
      if (val) beginEdit(val);
    });
    els.kpiGrid.addEventListener('keydown', function (e) {
      if (!e.target.matches('.kpi-edit-input')) return;
      if (e.key === 'Enter') e.target.blur();
      if (e.key === 'Escape') { e.target.setAttribute('data-cancel', '1'); e.target.blur(); }
    });
    els.kpiGrid.addEventListener('focusout', function (e) {
      if (e.target.matches && e.target.matches('.kpi-edit-input')) commitEdit(e.target);
    });

    els.orderSearch.addEventListener('input', renderOrders);

    els.settingStoreName.addEventListener('input', function (e) { state.storeName = e.target.value || 'My Store'; persist(); renderShell(); });
    els.settingOwnerName.addEventListener('input', function (e) { state.ownerName = e.target.value || 'there'; persist(); renderShell(); });
    els.settingCurrency.addEventListener('input', function (e) { state.currency = e.target.value || '$'; persist(); renderShell(); });

    els.randomizeBtn.addEventListener('click', function () {
      state.seed = Math.floor(Math.random() * 100000);
      _baselineCache = null;
      renderAll();
    });
    els.resetBtn.addEventListener('click', function () {
      if (!window.confirm('Reset all numbers back to the sample defaults? This clears anything you changed.')) return;
      var copy = {};
      for (var k in DEFAULT_STATE) { copy[k] = DEFAULT_STATE[k]; }
      state = copy;
      _baselineCache = null;
      renderAll();
      renderSettings();
    });

    window.addEventListener('hashchange', function () { showView(currentView()); });
  }

  function init() {
    cacheEls();
    setupEmptyStates();
    wireStaticEvents();
    var onboarded = false;
    try { onboarded = !!localStorage.getItem(ONBOARD_KEY); } catch (e) { /* ignore */ }
    if (!onboarded) els.onboarding.hidden = false;
    showView(currentView());
  }

  document.addEventListener('DOMContentLoaded', init);
})();
