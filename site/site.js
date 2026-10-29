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

// Rules contents: the section being read is full ink. On a narrow screen
// the list sits above the rules and starts collapsed (setAccordion is
// accordion.js's — site.js loads last, so it's defined), so it doesn't push
// the rules a screen down.
(() => {
  const links = [...document.querySelectorAll('.toc-link')];
  if (!links.length) return;
  const tocItem = document.querySelector('.rules-toc .accordion-item');
  if (tocItem && matchMedia('(max-width: 630px)').matches && typeof setAccordion === 'function') {
    setAccordion(tocItem, false);
    tocItem.classList.add('is-collapsed');
  }
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const headings = [...document.querySelectorAll('.prose--page > h2[id]')];
  const mark = () => {
    // The last heading above the top quarter of the screen is the one being read.
    let current = headings[0];
    for (const h of headings) if (h.getBoundingClientRect().top < innerHeight / 4) current = h;
    links.forEach((a) => a.classList.toggle('is-current', a === byId.get(current?.id)));
  };
  addEventListener('scroll', mark, { passive: true });
  mark();
})();
