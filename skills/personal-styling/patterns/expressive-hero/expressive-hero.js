/* personal-styling · expressive-hero · v0.4.0 */

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
      const style = STYLES.includes(d.style) ? d.style : 'stack';
      const parts = (d.text ?? '').split('|').map((s) => s.trim()).filter(Boolean);
      if (!parts.length) parts.push(' ');
      // Stack is always tiered; data at one size takes sans values (mono rows
      // read as texture, not data). See README.md, Type.
      const scale = style === 'stack' || d.scale !== 'even' ? 'tiered' : 'even';
      const mono = d.values === 'mono' && !(style === 'data' && scale === 'even');
      hero.items = parts.map((p, i) => item(p, i > 0 && mono));
      hero.tempo = Math.max(0, parseFloat(d.tempo) || 1);
      const o = { scale, ratio: Math.min(0.55, Math.max(0.25, parseFloat(d.ratio) || 0.4)) };
      const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true', focusable: 'false' });
      const type = el('g', { fill: 'currentColor' }, svg);
      hero.frame = BUILD[style](type, hero.items, W, H, driftSeconds(), o);
      hero.frame(hero.t);
      node.prepend(svg);
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
    new MutationObserver(redraw).observe(node, { attributes: true, attributeFilter: ['data-style', 'data-text', 'data-tempo', 'data-scale', 'data-values', 'data-ratio'] });
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
