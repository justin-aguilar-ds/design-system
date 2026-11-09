// The System page's hero: the same mock pages as examples/expression.html,
// stepping from a page with an object as its hero to a tool. Needs
// line-chart.js (for lineChartPath) and segmented.js, which every site page
// loads first.
(() => {
if (!document.getElementById('showcase-screens')) return;
const state = { hero: 'object' };
const REG = [
  { name: 'Page', fit: true, inset: [24, 48], block: [48, 48], section: [48, 48], inner: 16, rowPad: 16,
    note: 'A title, a hero in the first screen, content below it. A type toy, an about page, a post, a tracker you check: one register, four kinds of hero.',
    things: '', hero: '', carries: [] },
  { name: 'Tool', fit: false, inset: [24, 24], block: [48, 48], section: [48, 48], inner: 16, rowPad: 8,
    note: 'You work through data: many figures, a table, many controls. A league tool, a dashboard, a ledger. Precision is the expression.',
    things: 'Intro, docked panel, figures, chart, table', hero: 'The data itself',
    carries: [['Space', '48 between groups, like a page; the table at its tightest'], ['Layout', 'Two columns on a wide screen; the panel docked to the corner'], ['Interaction', 'The same hover, tooltip and timing as a page']] },
];
// Page's three heroes: the same register, the same composition.
const PAGE_HERO = {
  object: { things: 'A title, the object, a caption, the nav', hero: 'An object to look at or play with, sized from the screen',
    carries: [['Layout', 'The object right under the title; the caption at the bottom'], ['Words', 'Few: the object carries the page'], ['Motion', 'The object is picked up and carried, never tilted on hover']] },
  statement: { things: 'A statement, a list, one action', hero: 'The statement itself, in display type',
    carries: [['Layout', 'Statement at the top; the list at the bottom with little content, after the gap with lots'], ['Type', 'The statement carries the page'], ['Width', 'Full width, so the statement stays on one line']] },
  media: { things: 'A title, media, paragraphs', hero: 'Media at the column’s full width',
    carries: [['Layout', 'Title, then the media with its text the gap below, as one block'], ['Width', '720 on a wide screen: there are paragraphs to read'], ['Type', 'Secondary ink for the text, so the media leads']] },
  chart: { things: 'A title, the chart card, its numbers, then more', hero: 'The main chart in a card about 60% of the screen tall',
    carries: [['Layout', 'Title, then the chart card; numbers at the bottom or after the gap'], ['Space', 'The card takes the screen; the numbers wait below it'], ['Interaction', 'Hover and tooltips on the chart carry the feel']] },
};
const sec = (reg, k) => reg.section[k];
// The max width each register suggests; the control follows the register.

const CHEV = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 6.5 5 3.5 8 6.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEV_DOWN = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW = '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M2 5h6M5.5 2.5 8 5 5.5 7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const INFO = '<span class="m-info surface surface--rest" aria-hidden="true"><svg viewBox="0 0 16 16"><circle cx="8" cy="4.25" r="1.25" fill="currentColor"/><path d="M8 7.25v5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg></span>';
const nav = (a, b, on = 0) => `<div class="segmented segmented--large" aria-hidden="true"><span class="segmented-indicator" style="opacity:0"></span><span class="segmented-option t-label${on === 0 ? ' is-indicated' : ''}">${a}</span><span class="segmented-option t-label${on === 1 ? ' is-indicated' : ''}">${b}</span></div>`;
const head = (right = 'About', sub = '') => `<div class="m-head"><div class="m-stack"><span class="t-body m-quiet">Studio Folio</span>${sub ? `<p class="t-body m-quiet">${sub}</p>` : ''}</div><span class="t-body m-quiet">${right}</span></div>`;

// A chart: one series in ink, two quiet ones in the series grey.
const chart = (w, h) => {
  // Forty weeks a series, drawn through the line chart's own monotone curve
  // (lineChartPath, components/line-chart/): smooth, never overshooting.
  const N = 40;
  const series = (seed, amp, lift) => Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return h * 0.7 - (Math.sin(t * 8 + seed) * amp + Math.sin(t * 19 + seed * 1.7) * amp * 0.35 + Math.sin(t * 3 + seed * 0.5) * amp * 0.6) - t * h * lift;
  });
  const path = (ys) => lineChartPath(ys.map((y, i) => [(i * w) / (N - 1), y]), true);
  return `<svg class="m-chart" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    ${[0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${w}" y1="${h * f}" y2="${h * f}" stroke="var(--color-hairline-strong)" stroke-dasharray="0 4" stroke-linecap="round"/>`).join('')}
    <path d="${path(series(2, h * 0.11, 0.18))}" stroke="var(--color-series)" stroke-width="2.25"/>
    <path d="${path(series(4, h * 0.1, 0.1))}" stroke="var(--color-series)" stroke-width="2.25"/>
    <path d="${path(series(0, h * 0.14, 0.34))}" stroke="var(--color-text)" stroke-width="3.25"/></svg>`;
};
const PEOPLE = ['Ana Ruiz', 'Ben Okafor', 'Chloe Park', 'Dev Shah', 'Eli Moreau', 'Fay Lin', 'Gus Romero', 'Hana Ito', 'Ivo Petrov', 'Jun Ahn', 'Kai Berg', 'Lia Costa', 'Max Ross', 'Nia Cole', 'Omar Haddad', 'Pia Lund', 'Quinn Ray', 'Rex Hale', 'Sol Vega', 'Tao Wen'];
const table = (rows) => `<table class="m-table"><thead><tr><th class="t-label">Player</th><th class="t-label">Team</th><th class="t-label num">Pts</th></tr></thead><tbody>${PEOPLE.slice(0, rows).map((p, i) => `<tr><td class="t-body">${p}</td><td class="t-mono">${['NYK', 'BOS', 'DEN', 'LAL', 'MIA'][i % 5]}</td><td class="t-mono num">${(48.2 - i * 1.7).toFixed(1)}</td></tr>`).join('')}</tbody></table>`;
const figures = (n) => `<div class="m-figures">${[['Points', '1,284'], ['Rank', '3rd'], ['Win rate', '64%'], ['Trades', '12']].slice(0, n).map(([k, v]) => `<div class="m-stack"><span class="t-mono">${k}</span><span class="t-title">${v}</span></div>`).join('')}</div>`;

const PAGE_RENDER = {};  // filled below: one story, a fantasy basketball league
const RENDER = [
  // Page
  (c, d) => PAGE_RENDER[state.hero](c, d),
  // Tool
    (c, d) => ({
    head: `<div class="m-intro"><h4 class="t-display">What-if league</h4>${INFO}</div>`,
    main: `${figures(4)}
      <div class="m-split${d ? ' is-two' : ''}"><div class="m-stack" style="gap: var(--m-gap-inner)"><span class="t-label">Projected points</span>${chart(d ? 620 : 340, d ? 240 : 160)}</div>
      <div class="m-stack" style="gap: var(--m-gap-inner)"><span class="t-label">Roster</span>${table([4, 10, 20][c])}</div></div>`,
    corner: `<span class="m-pill surface surface--rest"><span class="t-mono">Controls</span>${CHEV}</span>`,
  }),

];


// The five steps: four heroes of a page, then a tool.
const STEPS = [
  { r: 0, hero: 'object' },
  { r: 0, hero: 'statement' },
  { r: 0, hero: 'media' },
  { r: 0, hero: 'chart' },
  { r: 1, hero: null },
];
// ---- One story: a fantasy basketball league, from draft night to the trade tool.
const spark = (seed) => {
  // A player's points over the season, through the line chart's monotone curve.
  const N = 24;
  const v = Array.from({ length: N }, (_, i) => 18 + Math.sin(i * 0.45 + seed) * 9 + Math.sin(i * 1.1 + seed * 2) * 4);
  const max = Math.max(...v), min = Math.min(...v);
  const pts = v.map((n, i) => [(i * 168) / (N - 1), 36 - ((n - min) / (max - min || 1)) * 30]);
  return `<svg class="m-wave" viewBox="0 0 168 40" aria-hidden="true"><path d="${lineChartPath(pts, true)}" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};
PAGE_RENDER.object = (c) => {
  const picks = [[2, 'Ben Okafor', 'Forward'], [3, 'Chloe Park', 'Centre'], [4, 'Dev Shah', 'Guard'], [5, 'Eli Moreau', 'Guard'], [6, 'Fay Lin', 'Forward']];
  const shown = c === 0 ? picks.slice(2, 3) : picks;
  const card = ([n, name, pos]) => `<div class="m-card${n === 4 ? '' : ' is-side'}"><span class="t-mono">Round 1 · ${pos}</span><div class="m-stack" style="gap: var(--space-8)"><span class="t-display">${n}</span><span class="t-label" style="color: inherit">${name}</span>${spark(n)}</div></div>`;
  return { head: '',
    title: `<h4 class="t-display">Draft night</h4>`,
    hero: `<div class="m-carousel">${shown.map(card).join('')}</div>`,
    support: `<div class="m-stack m-center"><p class="t-body m-quiet">Round 1 of 13 · you’re on the clock</p>${c ? '<p class="t-body m-quiet">Picks lock in 90 seconds</p>' : ''}</div>`,
    slot: nav('Draft', 'Board', 0) };
};
PAGE_RENDER.statement = (c) => {
  const rows = [['2025 champion', 'Chloe Park'], ['2024 champion', 'Dev Shah'], ['2023 champion', 'Chloe Park'], ['2022 champion', 'Ana Ruiz'], ['2021 champion', 'Gus Romero'], ['2020 champion', 'Ben Okafor'], ['2019 champion', 'Hana Ito'], ['2018 champion', 'Fay Lin']].slice(0, [2, 4, 8][c]);
  return { head: '',
    title: `<h4 class="t-display">Twelve friends, one league, since 2014.</h4>`,
    support: `<div class="m-list">${rows.map(([y, n]) => `<div class="m-row"><span class="t-mono">${y}</span><span class="t-title">${n}</span></div>`).join('')}</div>`,
    slot: `<button class="button surface surface--rest surface--pill t-label m-big" type="button">Copy invite link</button>`,
  };
};
PAGE_RENDER.media = (c) => {
  const P = ['Twelve teams, thirteen rounds, one long winter. The draft is Sunday at eight, and the board below is where it starts.', 'Last season came down to the final week and a single free throw. This year the waiver order resets, trades close at the deadline, and the playoffs move to six teams.', 'Keepers are due Friday. Each team holds two, and a keeper costs the round they were drafted in, one earlier each season.'];
  const Q = ['Blocks and steals now count double, and turnovers cost a point. Big men get a little more valuable; careless guards a little less.', 'Three-pointers made stay at one point, but a made three no longer also counts as a field goal. Shooters lose a point a game on average.', 'The changes were voted in at the end of last season, nine to three. They apply from the draft on.'];
  return { head: '',
    title: `<h4 class="t-display">The 2026 season preview</h4>`,
    hero: `<div class="m-stack" style="gap: var(--m-section)"><div class="m-media surface"><span class="t-label m-quiet">Draft board</span></div><div class="m-prose">${P.slice(0, [1, 2, 3][c]).map((t) => `<p class="t-body">${t}</p>`).join('')}</div></div>`,
    support: c ? `<div class="m-prose"><h5 class="t-label">Scoring changes</h5>${Q.slice(0, c === 2 ? 3 : 1).map((t) => `<p class="t-body">${t}</p>`).join('')}</div>` : '',
    slot: '' };
};
PAGE_RENDER.chart = (c, d) => ({ head: '',
  title: `<div class="m-intro"><h4 class="t-display">My team</h4>${INFO}</div>`,
  hero: `<div class="m-hero-card surface"><div class="m-stack"><span class="t-mono">Projected this week</span><span class="t-title">1,310</span></div>${chart(d ? 1200 : 300, d ? 440 : 380)}</div>`,
  support: `<div class="m-stack" style="gap: var(--m-section)">${figures(d ? 4 : 2)}${c ? `<div class="m-stack" style="gap: var(--m-gap-inner)"><span class="t-label">Roster</span>${table(c === 2 ? 10 : 4)}</div>` : ''}</div>`,
  corner: `<span class="m-pill surface surface--rest"><span class="t-mono">Controls</span>${CHEV}</span>` });
const SIZES = { phone: [390, 844], desktop: [1440, 900] };
const STEP_MS = 3600;                 // a beat to land, a beat to read
const screens = [...document.querySelectorAll('.screen')];
let step = 0, timer = null;

// Both screens share one height; together they fit the column.
const fit = () => {
  // One screen shows: it takes the stage's room, less the stage's padding,
  // and the height the title, the steps and the bottom slot leave.
  const host = document.getElementById('showcase-screens');
  const cs = getComputedStyle(host);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const W = host.clientWidth - padX;
  // The stage is 60% of the screen; the screen fits inside its padding.
  const free = host.clientHeight - padY;
  const H = Math.max(160, free);
  screens.forEach((el) => {
    const [w, hh] = SIZES[el.dataset.size];
    const k = Math.min(H / hh, W / w);
    el.style.width = `${w}px`; el.style.height = `${hh}px`; el.style.transform = `scale(${k})`;
    el.parentElement.style.width = `${w * k}px`; el.parentElement.style.height = `${hh * k}px`;
  });
};

const build = (el) => {
  const s = STEPS[step], d = el.dataset.size === 'desktop', k = d ? 1 : 0;
  if (s.hero) state.hero = s.hero;
  const reg = REG[s.r];
  const parts = RENDER[s.r](s.hero === 'media' ? 2 : 1, d);   // the media page is a long read
  const main = parts.main ?? ['title', 'hero', 'support'].filter((r) => parts[r]).map((r) => `<div class="m-part" data-role="${r}">${parts[r]}</div>`).join('');
  const maxw = s.hero === 'media' && d ? 720 : 0;
  const padB = parts.slot ? 24 : reg.block[k];
  const vars = `--m-inset:${reg.inset[k]}px;--m-block:${reg.block[k]}px;--m-pad-b:${padB}px;--m-section:${sec(reg, k)}px;--m-gap-inner:${reg.inner}px;--m-row-pad:${reg.rowPad}px;--m-inset-b:24px${maxw ? `;--m-maxw:${maxw}px` : ''}`;
  el.innerHTML = `<div class="m${reg.fit ? ' is-fit' : ''} comp-top" style="${vars}">${parts.head}<div class="m-main">${main}</div>${parts.slot ? `<div class="m-slot">${parts.slot}</div>` : ''}${parts.corner ? `<div class="m-corner">${parts.corner}</div>` : ''}</div>`;
  // Stagger the groups in, top first: JS sets the order, CSS the motion.
  const groups = [...el.querySelectorAll('.m > .m-head, .m > .m-intro, .m-main > *, .m-slot, .m-corner')];
  groups.forEach((g) => g.classList.add('is-in'));
  requestAnimationFrame(() => requestAnimationFrame(() => groups.forEach((g, i) => setTimeout(() => g.classList.add('is-shown'), i * 100))));
};

const show = (n) => {
  step = n;
  const opt = document.querySelector(`#showcase-steps .segmented-option[value="${step}"]`);
  if (!opt.classList.contains('is-active')) document.getElementById('showcase-steps').dispatchEvent(new CustomEvent('segmented-set', { detail: { option: opt } }));
  screens.forEach((el) => {
    const m = el.querySelector('.m');
    if (!m) { build(el); return; }
    m.classList.add('is-leaving');
    setTimeout(() => build(el), 160);   // mirrors --duration-fast
  });
};

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const play = (delay = STEP_MS) => {
  clearTimeout(timer);
  if (reduced) return;                // with reduced motion, the steps wait for a tap
  timer = setTimeout(() => { show((step + 1) % STEPS.length); play(); }, delay);
};

// A tap on a step jumps there and holds it a little longer before moving on.
document.getElementById('showcase-steps').addEventListener('segmented-change', (e) => {
  const n = Number(e.detail.value);
  if (n !== step) show(n);
  play(STEP_MS * 2);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else play(); });

// The screen toggle: the phone by default, the desktop on request.
document.getElementById('showcase-device')?.addEventListener('segmented-change', (e) => {
  document.getElementById('showcase-screens').classList.toggle('is-desktop', e.detail.value === 'desktop');
  fit();
});
new ResizeObserver(fit).observe(document.getElementById('showcase-screens'));
fit();
show(0);
play();
})();
