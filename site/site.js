// Theme toggle: an infrequent action, so the quiet text treatment. It names
// the theme it switches to. The choice is a per-viewer convenience, so
// storage failures are ignored.
const toggle = document.getElementById('theme-toggle');
const currentTheme = () => document.documentElement.dataset.theme
  || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const renderToggle = () => { toggle.textContent = currentTheme() === 'dark' ? 'Light' : 'Dark'; };

toggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ps-theme', next); } catch {}
  renderToggle();
});
renderToggle();

// Rules contents: the section being read is the segmented list's selection,
// moved with segmented-set as the page scrolls. On a narrow screen the
// panel is a floating pill; choosing a section closes it again
// (setAccordion is accordion.js's — site.js loads last, so it's defined).
(() => {
  const list = document.querySelector('.rules-contents .segmented--list');
  if (!list) return;
  const links = [...list.querySelectorAll('.segmented-option')];
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const headings = [...document.querySelectorAll('.prose--page > h2[id]')];
  let current = null;
  const mark = () => {
    // The last heading above the top quarter of the screen is the one being read.
    let heading = headings[0];
    for (const h of headings) if (h.getBoundingClientRect().top < innerHeight / 4) heading = h;
    const link = byId.get(heading?.id);
    if (link && link !== current) {
      current = link;
      list.dispatchEvent(new CustomEvent('segmented-set', { detail: { option: link } }));
    }
  };
  addEventListener('scroll', mark, { passive: true });
  mark();

  const item = list.closest('.accordion-item');
  list.addEventListener('click', (event) => {
    if (event.target.closest('a') && matchMedia('(max-width: 630px)').matches) setAccordion(item, false);
  });
})();

// Foundations: every value shown is read from the live page — tokens from
// :root, type metrics from the specimen itself — so the page can't drift
// from tokens.css, and theme or screen-size changes update it.
(() => {
  const tokens = [...document.querySelectorAll('[data-token]')];
  const metrics = [...document.querySelectorAll('[data-metrics-for]')];
  if (!tokens.length && !metrics.length) return;
  const round = (n) => Math.round(parseFloat(n) * 100) / 100;
  const fill = () => {
    const root = getComputedStyle(document.documentElement);
    tokens.forEach((el) => { el.textContent = `${el.dataset.token} · ${root.getPropertyValue(el.dataset.token).trim()}`; });
    metrics.forEach((el) => {
      const s = getComputedStyle(document.getElementById(el.dataset.metricsFor));
      el.textContent = `${round(s.fontSize)} / ${round(s.lineHeight)} · ${s.fontWeight} · ${s.letterSpacing}`;
    });
  };
  fill();
  toggle.addEventListener('click', () => requestAnimationFrame(fill));
  addEventListener('resize', fill);
})();
