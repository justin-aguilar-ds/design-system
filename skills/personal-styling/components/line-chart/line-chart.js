/* personal-styling · line-chart · v0.1.0 */

// Draws a .line-chart from the JSON inside it:
//   { "x": ["Wk 1", …], "series": [{ "name": "Ana", "values": [2, 5, …] }, …] }
// Options as data attributes on the figure (defaults first):
//   data-labels   off | on            axis labels
//   data-guides   grid | base | none  dotted guides
//   data-density  few | more          how many guides (about 4 or 8)
//   data-curve    rounded | straight
//   data-legend   names | off
//   data-rank     off | on            rank among the series, in the tooltip
//   data-focus    a series name       the series in full ink at rest
// Hover (or tap) near a line: it previews, and a tooltip grows from the
// nearest point. Click or tap: it becomes the focus. API on the element:
// el.lineChart.focus(name), el.lineChart.preview(name | null), and a
// bubbling `line-chart-focus` event with detail.name.

const LINE_CHART_HEIGHT = 240;        // px, phones
const LINE_CHART_HEIGHT_WIDE = 280;   // px, from 500px wide
const LINE_CHART_GAP = 16;            // px between labels and the data
const LINE_CHART_DIGIT = 7;           // px, a mono 10.5 digit
const LINE_CHART_NEAR = 16;           // px from a line that counts as near, mouse
const LINE_CHART_NEAR_TOUCH = 28;     // px, finger
const LINE_CHART_NS = 'http://www.w3.org/2000/svg';

// Monotone cubic (Fritsch–Carlson): smooth, and never overshoots the data,
// so a curve never invents a peak or a dip that isn't there.
function lineChartPath(pts, rounded = true) {
  const n = pts.length;
  if (!rounded || n < 3) return 'M' + pts.map((p) => p.join(',')).join('L');
  const dx = [], m = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]; }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) {
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : 3 * (dx[i - 1] + dx[i]) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  }
  t[n - 1] = m[n - 2];
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

// A sparkline in the same spec, as SVG markup — for a table cell
// (see components/table/, .table-spark).
function lineChartSpark(values, { max = Math.max(...values), width = 64, height = 20 } = {}) {
  const pts = values.map((v, i) => [(width * i) / (values.length - 1), height - (height * v) / (max || 1)]);
  const end = pts[pts.length - 1];
  return `<svg class="table-spark" viewBox="0 0 ${width} ${height}" aria-hidden="true"><path d="${lineChartPath(pts)}"/><circle r="3" cx="${end[0]}" cy="${end[1]}"/></svg>`;
}

document.querySelectorAll('.line-chart').forEach((fig) => {
  const source = fig.querySelector('script[type="application/json"]');
  if (!source) return;
  const data = JSON.parse(source.textContent);
  const series = data.series || [];
  const xs = data.x || [];
  const n = xs.length;
  if (!series.length || n < 2) return;

  const opt = (key, fallback) => fig.dataset[key] || fallback;
  const el = (name, attrs, parent) => {
    const node = document.createElementNS(LINE_CHART_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.append(node);
    return node;
  };

  const svg = el('svg', { role: 'img', 'aria-label': fig.getAttribute('aria-label') || 'Line chart' });
  const tip = document.createElement('div');
  tip.className = 'line-chart-tip t-mono';
  tip.setAttribute('aria-hidden', 'true');
  const legend = document.createElement('ul');
  legend.className = 'line-chart-legend';
  fig.append(svg, tip, legend);

  let focus = opt('focus', series[0].name);
  let preview = null;
  const shown = () => preview || focus;
  let geo = null;

  const niceTicks = (max, count) => {
    const raw = (max || 1) / count;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((v) => v * mag).find((v) => v >= raw);
    const ticks = [];
    for (let v = 0; ; v += step) { ticks.push(v); if (v >= max) break; }
    return ticks;
  };

  function draw() {
    const W = svg.clientWidth || fig.clientWidth || 320;
    const H = W < 500 ? LINE_CHART_HEIGHT : LINE_CHART_HEIGHT_WIDE;
    const labels = opt('labels', 'off') === 'on';
    const guides = opt('guides', 'grid');
    const yMax = Math.max(...series.flatMap((s) => s.values));
    const ticks = niceTicks(yMax, opt('density', 'few') === 'more' ? 8 : 4);
    const top = ticks[ticks.length - 1];
    const L = labels ? LINE_CHART_DIGIT * String(top).length + LINE_CHART_GAP : 4;
    const R = 4, T = 8, B = labels ? 15 + LINE_CHART_GAP : 4;
    const pw = W - L - R, ph = H - T - B;
    const x = (i) => L + (pw * i) / (n - 1);
    const y = (v) => T + ph * (1 - v / top);
    geo = { L, pw, x, y };
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('height', H);
    svg.replaceChildren();
    ticks.forEach((v) => {
      if (guides === 'grid' || (guides === 'base' && v === 0)) el('line', { class: 'line-chart-guide', x1: L, x2: W - R, y1: y(v), y2: y(v) }, svg);
      if (labels) el('text', { x: L - LINE_CHART_GAP, y: y(v) + 3.5, 'text-anchor': 'end' }, svg).textContent = v;
    });
    if (labels) {
      const every = Math.ceil((LINE_CHART_DIGIT * 5 + LINE_CHART_GAP) / (pw / (n - 1)));
      for (let i = 0; i < n; i += every) {
        el('text', { x: x(i), y: H - 2, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle' }, svg).textContent = xs[i];
      }
    }
    series.forEach((s) => {
      el('path', { class: 'line-chart-series', d: lineChartPath(s.values.map((v, i) => [x(i), y(v)]), opt('curve', 'rounded') === 'rounded'), 'data-name': s.name }, svg);
    });
    el('circle', { class: 'line-chart-end', r: 3 }, svg);
    el('circle', { class: 'line-chart-point', r: 4 }, svg);
    legend.hidden = opt('legend', 'names') === 'off';
    legend.innerHTML = series.map((s) => `<li><button type="button" class="t-mono" data-name="${s.name}"><span class="line-chart-dot" aria-hidden="true"></span>${s.name}</button></li>`).join('');
    restyle();
  }

  // Focus changes restyle rather than redraw, so lines fade instead of jumping.
  function restyle() {
    const name = shown();
    const s = series.find((d) => d.name === name) || series[0];
    const end = svg.querySelector('.line-chart-end');
    svg.querySelectorAll('.line-chart-series').forEach((p) => {
      const me = p.dataset.name === s.name;
      p.classList.toggle('is-focus', me);
      if (me) svg.insertBefore(p, end);   // the focus draws on top
    });
    end.setAttribute('cx', geo.x(n - 1));
    end.setAttribute('cy', geo.y(s.values[n - 1]));
    legend.querySelectorAll('button').forEach((b) => b.classList.toggle('is-focus', b.dataset.name === s.name));
  }

  function setFocus(name, { announce = true } = {}) {
    focus = name;
    preview = null;
    restyle();
    if (announce) fig.dispatchEvent(new CustomEvent('line-chart-focus', { bubbles: true, detail: { name } }));
  }
  function setPreview(name) {
    if (preview === name) return;
    preview = name;
    restyle();
  }

  function showTip(event) {
    const r = svg.getBoundingClientRect();
    const px = event.clientX - r.left, py = event.clientY - r.top;
    const i = Math.max(0, Math.min(n - 1, Math.round(((px - geo.L) / geo.pw) * (n - 1))));
    let near = null;
    let best = event.pointerType === 'mouse' ? LINE_CHART_NEAR : LINE_CHART_NEAR_TOUCH;
    series.forEach((s) => { const d = Math.abs(geo.y(s.values[i]) - py); if (d < best) { best = d; near = s; } });
    if (!near) { hideTip(); return null; }
    setPreview(near.name);
    const cx = geo.x(i), cy = geo.y(near.values[i]);
    const point = svg.querySelector('.line-chart-point');
    point.setAttribute('cx', cx);
    point.setAttribute('cy', cy);
    let text = `${near.name} · ${xs[i]} · ${near.values[i].toLocaleString()}`;
    if (opt('rank', 'off') === 'on') {
      const rank = series.map((s) => s.values[i]).sort((a, b) => b - a).indexOf(near.values[i]) + 1;
      text += ` · ${rank}${['st', 'nd', 'rd'][((rank + 90) % 100 - 10) % 10 - 1] || 'th'}`;
    }
    tip.textContent = text;
    const pad = parseFloat(getComputedStyle(fig).paddingLeft) || 0;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const below = cy - h - 12 < 0;
    tip.classList.toggle('is-below', below);
    const left = Math.max(0, Math.min(fig.clientWidth - w, pad + cx - w / 2));
    tip.style.translate = `${left}px ${pad + (below ? cy + 12 : cy - h - 12)}px`;
    fig.classList.add('has-tip');
    return near;
  }
  function hideTip() {
    fig.classList.remove('has-tip');
    setPreview(null);
  }

  svg.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') showTip(e); });
  svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hideTip(); });
  svg.addEventListener('click', (e) => { const near = showTip(e); if (near) setFocus(near.name); });
  document.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' && !fig.contains(e.target)) hideTip(); });
  legend.addEventListener('click', (e) => { const b = e.target.closest('button[data-name]'); if (b) setFocus(b.dataset.name); });
  legend.addEventListener('pointerover', (e) => { const b = e.target.closest('button[data-name]'); if (b && e.pointerType === 'mouse') setPreview(b.dataset.name); });
  legend.addEventListener('pointerleave', () => setPreview(null));

  fig.lineChart = {
    focus: (name) => setFocus(name),
    preview: (name) => setPreview(name),
    get focused() { return focus; },
  };

  let width = 0;
  new ResizeObserver(() => { if (fig.clientWidth !== width) { width = fig.clientWidth; draw(); } }).observe(fig);
  draw();
});
