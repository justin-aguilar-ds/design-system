/* personal-styling · expressive-hero · v0.6.0 */

// Draws a page's title, or a title and its values, as large type in slow
// repeated motion on the hero grey. Every item, the title and each value,
// keeps a whole copy in view at rest and all through the motion, so the hero
// reads without waiting for it. The drawing is aria-hidden.
//
// On a stage:  <div class="expressive-hero" data-style="stack" data-text="Weekend|Sat 14|Sunny|3 plans" aria-hidden="true"></div>
// As the page's ground, the title on it:
//   <header class="expressive-hero expressive-hero--page" data-style="data" data-text="Weekend|Sat 14|Sunny">
//     <h1 class="expressive-hero-title t-display">Weekend</h1>
//   </header>
//   data-style   stack | data | rise | cross   (default stack)
//   data-text    title|value|value…  — the title first, then the values
//   data-scale   tiered (default): the title large, the values smaller
//                even: every item one size, shrunk until all fit
//                stack is always tiered
//   data-values  sans (default) | mono — the values' face; the title is sans
//   data-ratio   0.25–0.55, the values' size against the title's (0.4)
//   data-ground  wash | bloom | grey — a painted field in the hero's two
//                colours (wash), or of many colours (bloom), blurred and
//                drifting under the type; or the flat hero grey. Left out,
//                one of wash and bloom is chosen at random. There is no
//                default: where one look must be fixed, set wash.
//   data-palette bloom's palette: Garden | Meadow | Dusk | Harvest | Sea pinks (random if left out)
//   data-form    bloom's marks: heads | dabs (random if left out)
//   data-ink     bloom's type: white (default) | hero — the hero's ink, if light
//   data-tempo   1 by default; leave it there
// Changing any of these redraws the hero. el.expressiveHero.redraw() does
// too; el.expressiveHero.coverage() gives the share of items whole in view.
//
// One loop of motion is --duration-drift (tokens.css), read at run time.
// Under reduced motion the hero is drawn once and holds still. Off screen
// or in a hidden tab, it pauses.

(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const STYLES = ['stack', 'data', 'rise', 'cross'];
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const ctx = document.createElement('canvas').getContext('2d');
  const rootCss = () => getComputedStyle(document.documentElement);
  const face = (mono) => rootCss().getPropertyValue(mono ? '--font-mono' : '--font-display').trim() || (mono ? 'monospace' : 'sans-serif');
  const driftSeconds = () => (parseFloat(rootCss().getPropertyValue('--duration-drift')) || 40000) / 1000;
  const TRACK = -0.02, GAP = 0.6, TILT = (8 * Math.PI) / 180;

  // An item: its text, face and weight; measured at 1px.
  function item(text, mono) {
    ctx.font = `500 100px ${face(mono)}`;
    const track = mono ? 0 : TRACK, n = [...text].length;
    const w = (ctx.measureText(text).width + track * 100 * Math.max(0, n - 1)) / 100;
    const cap = ctx.measureText('H').actualBoundingBoxAscent / 100;
    return { text, mono, w, cap, track };
  }
  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    parent?.append(node);
    return node;
  };
  const wrap = (v, m) => ((v % m) + m) % m;
  const textNode = (g, it, size, x, y, extra = {}) => {
    const t = el('text', { x, y, 'font-size': size.toFixed(2), 'font-family': face(it.mono).replace(/"/g, "'"), 'font-weight': 500, 'letter-spacing': `${it.track}em`, ...extra }, g);
    t.textContent = it.text;
    return t;
  };

  // ---- Lanes: horizontal rows. A drifting lane repeats its item with a gap;
  // a whole copy stays in view all the way through when 2 copies and a gap
  // fit the width. A swaying lane is one copy, gliding between the sides.
  const driftFit = (it, W) => (W * 0.96) / (2 * it.w + GAP);
  const swayFit = (it, W) => (W * 0.92) / it.w;
  const PITCH = 1.0;   // line pitch in em: cap height plus air, tight like display type
  function lanes(svg, seq, W, H, drift) {
    // seq: [{ it, size, mode }] — fill the height by repeating the sequence,
    // whole sequences first, then as many of its lanes as still fit.
    const rows = [];
    let used = 0;
    for (let k = 0; k < 60; k++) {
      const l = seq[k % seq.length];
      // A little room at the foot, so the last row's descenders aren't clipped.
      if (used + l.size * PITCH + l.size * 0.12 > H) break;
      rows.push(l); used += l.size * PITCH;
    }
    let y = (H - used) / 2;
    const speed = W / drift;
    const frames = rows.map((l, i) => {
      const g = el('g', {}, svg);
      const base = y + l.size * PITCH * 0.5 + (l.it.cap * l.size) / 2;
      y += l.size * PITCH;
      if (l.mode === 'sway') {
        const c = l.it.w * l.size, amp = Math.max(0, (W - c) / 2 - W * 0.02);
        textNode(g, l.it, l.size, (W - c) / 2, base);
        const omega = (2 * Math.PI) / (drift * 1.2), ph = i * 1.3;
        return (t) => g.setAttribute('transform', `translate(${(amp * Math.sin(t * omega + ph)).toFixed(1)} 0)`);
      }
      const tile = (l.it.w + GAP) * l.size, copies = Math.ceil(W / tile) + 2;
      for (let k = 0; k < copies; k++) textNode(g, l.it, l.size, k * tile, base);
      const dir = i % 2 ? 1 : -1;
      return (t) => g.setAttribute('transform', `translate(${(wrap(dir * t * speed + i * tile * 0.37, tile) - tile).toFixed(1)} 0)`);
    });
    return (t) => frames.forEach((f) => f(t));
  }

  // ---- Columns: lines stacked and climbing (rise), or tilted in a zigzag
  // (cross). The column repeats; every line is whole in view all the way
  // through when one full period plus its tallest line fits the height.
  function column(svg, lines, W, H, drift, tilt) {
    const pitchOf = (l) => l.size * (l.it.cap * 1.25 + (tilt ? l.it.w * Math.sin(TILT) * 0.85 : 0.18));
    const period = lines.length % 2 && tilt ? [...lines, ...lines] : lines;
    const block = period.reduce((s, l) => s + pitchOf(l), 0);
    const count = Math.ceil(H / Math.min(...period.map(pitchOf))) + period.length * 2;
    const g = el('g', {}, svg);
    let y = 0;
    for (let i = 0; i < count; i++) {
      const l = period[i % period.length], w = l.it.w * l.size * (tilt ? Math.cos(TILT) : 1);
      const x = (W - w) / 2, yy = y + l.it.cap * l.size;
      const extra = tilt ? { transform: `rotate(${i % 2 ? 8 : -8} ${(x + w / 2).toFixed(1)} ${(yy - (l.it.cap * l.size) / 2).toFixed(1)})` } : {};
      textNode(g, l.it, l.size, x, yy, extra);
      y += pitchOf(l);
    }
    const speed = (H * 0.6) / drift;
    return { block, maxPitch: Math.max(...period.map(pitchOf)), frame: (t) => g.setAttribute('transform', `translate(0 ${(-wrap(t * speed, block)).toFixed(1)})`) };
  }

  // Sizes for the column: each line no wider than the stage (tilt included),
  // then all scaled down together until a period and a line fit the height.
  function columnSizes(items, W, H, scale, ratio, tilt) {
    const across = (it) => it.w * (tilt ? Math.cos(TILT) : 1) + (tilt ? it.cap * Math.sin(TILT) : 0);
    const widthFit = (it) => (W * 0.9) / across(it);
    let sizes;
    if (scale === 'tiered') {
      const st = widthFit(items[0]);
      sizes = items.map((it, i) => (i ? Math.min(st * ratio, widthFit(it)) : st));
    } else {
      const s = Math.min(...items.map(widthFit));
      sizes = items.map(() => s);
    }
    const pitch = (it, s) => s * (it.cap * 1.25 + (tilt ? it.w * Math.sin(TILT) * 0.85 : 0.18));
    const n = items.length % 2 && tilt ? 2 : 1;
    const need = items.reduce((a, it, i) => a + pitch(it, sizes[i]), 0) * n + Math.max(...items.map((it, i) => pitch(it, sizes[i])));
    const k = Math.min(1, H / need);
    return sizes.map((s) => s * k);
  }

  // ---- Grounds. grey: the hero grey, flat (the default). wash: a painted
  // field in the hero's own two colours. bloom: a painted field of many
  // colours from a palette, veiled until the type clears 3.5:1 on it.
  // Both painted grounds are blurred well past recognition: they read as a
  // background, never as flowers or marks to pick out.
  const GROUNDS = ['grey', 'wash', 'bloom'];
  // Bloom palettes: a ground, the foliage around the blooms, and the blooms
  // with their weights. Mid values, so the type reads once the veil is on.
  // Drawing data, like a chart's series: the pattern's own, not page colours.
  const PALETTES = {
    'Garden':    { ground: '#2f5e5a', foliage: ['#3c7a63', '#2f6f7a', '#4a6fa0', '#5a8a55'], blooms: [['#efe6d6', 3], ['#e9b8b4', 3], ['#d98b92', 2], ['#e3c13c', 3], ['#d99a35', 2], ['#d2492f', 2]] },
    'Meadow':    { ground: '#2e5a46', foliage: ['#3e8a4f', '#2e6e7a', '#4f78b0', '#6f8f3a'], blooms: [['#d8452a', 4], ['#e48a2a', 3], ['#e8c83a', 3], ['#e9d9a0', 1], ['#c95a6a', 1]] },
    'Dusk':      { ground: '#3b3f6e', foliage: ['#4b5a8f', '#5d4f86', '#3f6f8a'], blooms: [['#c9a2d6', 3], ['#e5b3c4', 3], ['#f0d9c2', 2], ['#8fa6d9', 2], ['#d97a8f', 1]] },
    'Harvest':   { ground: '#4a4a26', foliage: ['#6b6f2f', '#7a5a2a', '#3f5f3a'], blooms: [['#e0a53a', 4], ['#d4692f', 3], ['#b8432f', 2], ['#ead38a', 2], ['#9fae4a', 1]] },
    'Sea pinks': { ground: '#285f6e', foliage: ['#2f7f86', '#3a6aa0', '#4f8f7a'], blooms: [['#f08a8a', 3], ['#f5b7a0', 3], ['#f0e3c8', 2], ['#7cc0b8', 2], ['#e85f6a', 1]] },
  };
  const FORMS = ['heads', 'dabs'];
  const rng = (seed) => { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e6) / 1e6; }; };
  const hashText = (t) => [...t].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);
  // Any CSS colour as #rrggbb, through the canvas's own parser.
  const toHex = (c) => { ctx.fillStyle = '#000'; ctx.fillStyle = c; const v = ctx.fillStyle; if (v.startsWith('#')) return v; const n = v.match(/[\d.]+/g).map(Number); return `#${n.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`; };
  const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const lum = (h) => rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const mixHex = (a, b, k) => { const [x, y] = [rgb(a), rgb(b)]; return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('')}`; };
  const shade = (h, k) => `rgb(${rgb(h).map((v) => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))).join(',')})`;
  const pickW = (r, list) => { let t = r() * list.reduce((s, [, w]) => s + w, 0); return list.find(([, w]) => (t -= w) <= 0)[0]; };
  // The wash: the hero's ground in light and shade, and blooms mixed part way
  // to the ink. The ink itself is kept for the type.
  const washPalette = (g, i) => ({ ground: g, foliage: [mixHex(g, '#000000', 0.12), mixHex(g, '#ffffff', 0.14), mixHex(g, i, 0.12), g],
    blooms: [[mixHex(g, i, 0.3), 3], [mixHex(g, i, 0.5), 3], [mixHex(g, '#ffffff', 0.3), 2], [mixHex(g, '#000000', 0.25), 2], [mixHex(i, g, 0.25), 1]] });
  function stroke(c, x, y, len, width, ang, bend, colour) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round';
    const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
    c.beginPath(); c.moveTo(x - dx / 2, y - dy / 2); c.quadraticCurveTo(x - dy * bend, y + dx * bend, x + dx / 2, y + dy / 2); c.stroke();
  }
  // Paint w × h CSS pixels. Returns nothing; the veil is painted in.
  function paintGround(canvas, w, h, dpr, pal, form, seed, typeHex) {
    const c = canvas.getContext('2d'), r = rng(seed);
    canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = pal.ground; c.fillRect(0, 0, w, h);
    const S = Math.min(w, h), rad = S * 0.12;
    c.globalAlpha = 0.55;
    for (let k = 0; k < 40; k++) { c.fillStyle = pal.foliage[Math.floor(r() * pal.foliage.length)]; c.beginPath(); c.arc(r() * w, r() * h, rad * (0.8 + r() * 1.6), 0, Math.PI * 2); c.fill(); }
    c.globalAlpha = 1;
    for (let k = 0; k < (w * h) / (rad * rad) * 2.5; k++) stroke(c, r() * w, r() * h, rad * (0.4 + r() * 0.5), rad * 0.16, r() * Math.PI * 2, (r() - 0.5) * 0.8, shade(pal.foliage[Math.floor(r() * pal.foliage.length)], (r() - 0.5) * 0.4));
    const step = rad * 2, cells = [];
    for (let y = -step / 2; y < h + step; y += step * 0.86) for (let x = -step / 2; x < w + step; x += step) cells.push([x + (r() - 0.5) * step * 0.9, y + (r() - 0.5) * step * 0.9]);
    cells.sort(() => r() - 0.5);
    for (const [x, y] of cells) {
      if (r() > 0.85) continue;
      const colour = pickW(r, pal.blooms), size = rad * (0.6 + r() * 0.7);
      if (form === 'dabs') { for (let k = 0; k < 9; k++) stroke(c, x + (r() - 0.5) * size * 1.6, y + (r() - 0.5) * size * 1.6, size * (0.35 + r() * 0.35), size * 0.22, r() * Math.PI * 2, (r() - 0.5) * 0.9, shade(colour, (r() - 0.45) * 0.5)); continue; }
      const n = Math.round(26 + (size / rad) * 30);   // a head: short strokes from a centre, lit from above
      for (let k = 0; k < n; k++) { const a = r() * Math.PI * 2, dd = size * Math.sqrt(r()) * 0.75; stroke(c, x + Math.cos(a) * dd, y + Math.sin(a) * dd, size * (0.35 + r() * 0.4), size * (0.13 + r() * 0.1), a + (r() - 0.5) * 0.8, (r() - 0.5) * 0.6, shade(colour, (r() - 0.45) * 0.45)); }
      for (let k = 0; k < n / 4; k++) { const a = -Math.PI * 0.75 + (r() - 0.5) * 1.6, dd = size * r() * 0.55; stroke(c, x + Math.cos(a) * dd, y + Math.sin(a) * dd, size * 0.25, size * 0.09, a, 0.2, shade(colour, 0.35 + r() * 0.3)); }
    }
    // The veil: measure the field, then darken it (light type) or lighten it
    // (dark type) just enough that the type clears 3.5:1 on its average.
    const probe = document.createElement('canvas'); probe.width = probe.height = 32;
    const pc = probe.getContext('2d'); pc.drawImage(canvas, 0, 0, 32, 32);
    const px = pc.getImageData(0, 0, 32, 32).data;
    let L = 0;
    for (let i = 0; i < px.length; i += 4) L += lum(`#${[px[i], px[i + 1], px[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`);
    L /= px.length / 4;
    const Lt = lum(typeHex);
    let veil = 0, dark = true;
    if (Lt >= L) { const target = (Lt + 0.05) / 3.5 - 0.05; veil = target <= 0 ? 0.6 : L > target ? Math.min(0.6, 1 - target / L) : 0; }
    else { dark = false; const target = 3.5 * (Lt + 0.05) - 0.05; veil = L < target ? Math.min(0.6, (target - L) / (1 - L)) : 0; }
    if (veil) { c.fillStyle = dark ? `rgba(0,0,0,${veil.toFixed(3)})` : `rgba(255,255,255,${veil.toFixed(3)})`; c.fillRect(0, 0, w, h); }
  }

  const BUILD = {
    // Every item a lane of its own, the sequence repeated to fill the stage.
    data(svg, items, W, H, drift, o) {
      let seq;
      if (o.scale === 'tiered') {
        const st = Math.min(swayFit(items[0], W), H * 0.42);
        seq = [{ it: items[0], size: st, mode: 'sway' }, ...items.slice(1).map((it) => ({ it, size: Math.min(st * o.ratio, driftFit(it, W)), mode: 'drift' }))];
      } else {
        const s = Math.min(...items.map((it) => driftFit(it, W)), H / (items.length * PITCH + 0.12));
        seq = items.map((it) => ({ it, size: s, mode: 'drift' }));
      }
      // Every lane once, with the foot's room, must fit.
      const total = seq.reduce((a, l) => a + l.size * PITCH, 0) + seq[seq.length - 1].size * 0.12;
      if (total > H) seq.forEach((l) => { l.size *= (H / total) * 0.995; });
      return lanes(svg, seq, W, H, drift);
    },
    // The title in rows, with the values as one line between: fewer, longer lines.
    // Both lines glide as single copies, so the long values line can be large.
    stack(svg, items, W, H, drift, o) {
      const vals = items.length > 1 ? item(items.slice(1).map((v) => v.text).join('  ·  '), items[1].mono) : null;
      const st = Math.min(swayFit(items[0], W), H * (vals ? 0.42 : 0.6));
      const sv = vals ? (o.scale === 'tiered' ? Math.min(st * o.ratio, swayFit(vals, W)) : Math.min(st, swayFit(vals, W))) : 0;
      const ts = o.scale === 'tiered' || !vals ? st : sv;
      const seq = vals ? [{ it: items[0], size: ts, mode: 'sway' }, { it: vals, size: sv, mode: 'sway' }] : [{ it: items[0], size: ts, mode: 'sway' }];
      return lanes(svg, seq, W, H, drift);
    },
    rise(svg, items, W, H, drift, o) {
      const sizes = columnSizes(items, W, H, o.scale, o.ratio, false);
      return column(svg, items.map((it, i) => ({ it, size: sizes[i] })), W, H, drift, false).frame;
    },
    cross(svg, items, W, H, drift, o) {
      const sizes = columnSizes(items, W, H, o.scale, o.ratio, true);
      return column(svg, items.map((it, i) => ({ it, size: sizes[i] })), W, H, drift, true).frame;
    },
  };

  const heroes = new Set();
  let raf = 0, last = 0;
  const running = () => !still.matches && !document.hidden && [...heroes].some((h) => h.visible);
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    heroes.forEach((h) => { if (h.visible) { h.t += dt * h.tempo; h.frame?.(h.t); } });
    raf = running() ? requestAnimationFrame(tick) : 0;
  }
  const wake = () => { if (!raf && running()) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  function mount(node) {
    const hero = { node, t: 0, tempo: 1, visible: true, frame: null, items: [] };
    const draw = () => {
      const W = node.clientWidth, H = node.clientHeight;
      node.querySelector(':scope > svg')?.remove();
      if (!W || !H) return;
      const d = node.dataset;
      // No ground asked for: one is chosen at random, wash or bloom (and for
      // bloom a palette and marks), once per hero, kept through its redraws.
      const pick = (list) => list[Math.floor(Math.random() * list.length)];
      if (!hero.chance) hero.chance = { ground: pick(['wash', 'bloom']), palette: pick(Object.keys(PALETTES)), form: pick(FORMS) };
      const ground = GROUNDS.includes(d.ground) ? d.ground : hero.chance.ground;
      const style = STYLES.includes(d.style) ? d.style : 'stack';
      const parts = (d.text ?? '').split('|').map((s) => s.trim()).filter(Boolean);
      if (!parts.length) parts.push(' ');
      // Stack is always tiered; data at one size takes sans values (mono rows
      // read as texture, not data). See README.md, Type.
      const scale = style === 'stack' || d.scale !== 'even' ? 'tiered' : 'even';
      // Mono values don't hold on the wash, except in rise. See README.md, Grounds.
      const mono = d.values === 'mono' && !(style === 'data' && scale === 'even') && !(ground === 'wash' && style !== 'rise');
      hero.items = parts.map((p, i) => item(p, i > 0 && mono));
      hero.tempo = Math.max(0, parseFloat(d.tempo) || 1);
      const o = { scale, ratio: Math.min(0.55, Math.max(0.25, parseFloat(d.ratio) || 0.4)) };
      const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true', focusable: 'false' });
      const type = el('g', { fill: 'currentColor' }, svg);
      const typeFrame = BUILD[style](type, hero.items, W, H, driftSeconds(), o);
      node.prepend(svg);
      // The painted ground, under the type: painted once, blurred, drifting.
      let canvas = node.querySelector(':scope > canvas.expressive-hero-ground');
      if (ground === 'grey') { canvas?.remove(); canvas = null; node.style.removeProperty('color'); }
      else {
        if (!canvas) canvas = Object.assign(document.createElement('canvas'), { className: 'expressive-hero-ground' });
        node.prepend(canvas);
        const css = getComputedStyle(node);
        const g = toHex(css.getPropertyValue('--color-hero').trim() || '#808080');
        const ink = toHex(css.getPropertyValue('--color-hero-ink').trim() || css.color);
        const white = css.getPropertyValue('--color-hero-bloom-ink').trim() || '#ffffff';
        // Bloom's type is white, or the hero's ink when it asks for it and is light enough.
        const pairInk = ground === 'bloom' && d.ink === 'hero' && lum(ink) >= 0.45;
        node.style.color = ground === 'bloom' && !pairInk ? white : '';
        const typeHex = toHex(getComputedStyle(node).color);
        const pal = ground === 'wash' ? washPalette(g, ink) : PALETTES[d.palette] || PALETTES[hero.chance.palette];
        const seed = parseInt(d.seed, 10) || hashText((d.text || '') + ground + (d.palette || ''));
        paintGround(canvas, W, H, Math.min(2, devicePixelRatio || 1), pal, FORMS.includes(d.form) ? d.form : hero.chance.form, seed, typeHex);
        // The more painterly the ground, the more it is blurred: bloom's many
        // colours furthest, so no mark reads as a flower or a petal; the
        // wash's two colours less. Both scale with the stage.
        const S = Math.min(W, H);
        const blur = ground === 'bloom' ? Math.max(12, S * 0.045) : Math.max(8, S * 0.03);
        canvas.style.filter = `blur(${blur.toFixed(1)}px)`;
      }
      const pad = canvas ? 1 + (parseFloat(canvas.style.filter.slice(5)) * 4) / W + 0.04 : 1;
      hero.frame = (t) => {
        typeFrame(t);
        if (canvas) canvas.style.transform = `translate(${(Math.sin(t * 0.05) * 1.2).toFixed(2)}%, ${(Math.cos(t * 0.037) * 1).toFixed(2)}%) scale(${pad.toFixed(4)})`;
      };
      hero.frame(hero.t);
      wake();
    };
    // The share of items with at least one whole copy inside the stage now.
    const coverage = () => {
      const svg = node.querySelector(':scope > svg');
      if (!svg) return 0;
      const box = svg.getBoundingClientRect(), nodes = [...svg.querySelectorAll('text')];
      // The line box runs above the capitals and below the baseline; judge by the letters.
      const inside = (r) => r.left >= box.left - 1 && r.right <= box.right + 1 && r.top + r.height * 0.22 >= box.top && r.bottom - r.height * 0.22 <= box.bottom;
      const seen = hero.items.filter((it) => nodes.some((n) => n.textContent.split('  ·  ').includes(it.text) && inside(n.getBoundingClientRect())));
      return seen.length / hero.items.length;
    };
    let pending = 0;
    const redraw = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(draw); };
    new ResizeObserver(redraw).observe(node);
    new MutationObserver(redraw).observe(node, { attributes: true, attributeFilter: ['data-style', 'data-text', 'data-tempo', 'data-scale', 'data-values', 'data-ratio', 'data-ground', 'data-palette', 'data-form', 'data-ink', 'data-seed'] });
    new IntersectionObserver(([e]) => { hero.visible = e.isIntersecting; wake(); }).observe(node);
    node.expressiveHero = { redraw, coverage };
    heroes.add(hero);
    document.fonts?.ready.then(redraw);
    redraw();
  }

  document.addEventListener('visibilitychange', wake);
  still.addEventListener?.('change', wake);
  const scan = (root = document) => root.querySelectorAll('.expressive-hero').forEach((n) => { if (!n.expressiveHero) mount(n); });
  scan();
  new MutationObserver(() => scan()).observe(document.documentElement, { childList: true, subtree: true });
})();
