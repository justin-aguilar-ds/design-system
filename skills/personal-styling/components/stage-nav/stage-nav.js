/* personal-styling · stage-nav · v0.1.0 */

// Links that move a carousel of views, each naming the view it goes to.
// data-carousel="<id>" on the .stage-nav points at the carousel; the views'
// names are its items' data-title. When the view changes, each label
// drops, swaps and rises (.swap in tokens.css).

// Mirrors --duration-base: the label's leave, before its words swap.
const STAGE_NAV_SWAP_MS = 250;

document.querySelectorAll('.stage-nav[data-carousel]').forEach((nav) => {
  const carousel = document.getElementById(nav.dataset.carousel);
  if (!carousel) return;
  const prev = nav.querySelector('.stage-nav-prev');
  const next = nav.querySelector('.stage-nav-next');
  // Views in their authored order. A looping carousel may have reordered
  // its items already; its "2 of 5" labels keep the authored order.
  const slot = (item, i) => parseInt(item.getAttribute('aria-label'), 10) || i + 1;
  const items = [...carousel.querySelectorAll('.carousel-item')]
    .map((item, i) => [slot(item, i), item]).sort((a, b) => a[0] - b[0]).map(([, item]) => item);
  const names = items.map((item) => item.dataset.title || '');
  const loop = carousel.hasAttribute('data-loop') && items.length > 2;
  let index = Math.max(0, items.findIndex((item) => item.classList.contains('is-active')));

  const target = (step) => {
    const i = index + step;
    if (loop) return (i + names.length) % names.length;
    return i >= 0 && i < names.length ? i : -1;
  };
  const write = (link, step) => {
    if (!link) return;
    const i = target(step);
    link.hidden = i < 0;
    const label = link.querySelector('.stage-nav-label');
    if (label && i >= 0) label.textContent = names[i];
    link.setAttribute('aria-label', i >= 0 ? `Go to ${names[i]}` : '');
  };
  const set = () => { write(prev, -1); write(next, 1); };

  // Drop, swap, rise.
  const labels = nav.querySelectorAll('.stage-nav-label');
  let timer = 0;
  const change = () => {
    labels.forEach((l) => l.classList.add('is-leaving'));
    clearTimeout(timer);
    timer = setTimeout(() => {
      set();
      labels.forEach((l) => { void l.offsetWidth; l.classList.remove('is-leaving'); });
    }, STAGE_NAV_SWAP_MS);
  };

  prev?.addEventListener('click', () => carousel.dispatchEvent(new CustomEvent('carousel-set', { detail: { step: -1 } })));
  next?.addEventListener('click', () => carousel.dispatchEvent(new CustomEvent('carousel-set', { detail: { step: 1 } })));
  carousel.addEventListener('carousel-change', (event) => {
    if (event.detail?.index === index) return;
    index = event.detail.index;
    change();
  });
  set();
});
