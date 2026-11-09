/* personal-styling · stage-sheet · v0.5.0 */

// Opens and closes the sheet, splits the screen on phones, and lets the
// sheet's heading resize the split by drag. Fires a bubbling
// `stage-sheet-toggle` event with detail.open.

const STAGE_SHEET_PHONE = 630;                // px wide or narrower is a phone
const STAGE_SHEET_SNAPS = [0.4, 0.55, 0.75];  // sheet heights, as a share of the screen
const STAGE_SHEET_CLOSE_BELOW = 0.28;         // let go lower than this and it closes
const STAGE_SHEET_MIN = 0.2;
const STAGE_SHEET_MAX = 0.85;
const STAGE_SHEET_FLICK = 0.6;                // px per ms: a flick, however short
const STAGE_SHEET_TAP = 6;                    // px: less movement than this is a tap

document.querySelectorAll('.stage-sheet').forEach((root) => {
  const sheet = root.querySelector('.stage-sheet-sheet');
  const toggle = root.querySelector('.stage-sheet-toggle');
  const body = root.querySelector('.stage-sheet-body');
  if (!sheet || !toggle || !body) return;

  const css = getComputedStyle(root);
  const px = (name) => parseFloat(css.getPropertyValue(name)) || 0;
  const ROW = px('--height-row') || 50;
  const SLOT = px('--height-slot') || 64;   // the closed pill on a phone sits in the bottom slot
  const set = (name, value) => root.style.setProperty(name, value);
  const phone = () => root.clientWidth <= STAGE_SHEET_PHONE;

  let open = false;
  let frac = STAGE_SHEET_SNAPS[1];

  // The pill is as wide as its heading; the wide-screen card as tall as its
  // controls, within the screen.
  const title = toggle.querySelector('.stage-sheet-title');
  const measure = () => {
    // On a phone the title is Label type, like the large button in the
    // bottom slot; on a wide screen it is the docked panel's mono.
    title?.classList.toggle('t-label', phone());
    title?.classList.toggle('t-mono', !phone());
    const clone = toggle.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.cssText = 'position:absolute;visibility:hidden;width:auto;';
    sheet.append(clone);
    set('--sheet-pill-w', `${clone.offsetWidth + 2 * px(phone() ? '--inset-slot' : '--inset-control') + 2}px`);
    clone.remove();
    const room = root.clientHeight - 2 * px('--space-page');
    set('--sheet-card-h', `${Math.min(room, toggle.offsetHeight + body.scrollHeight + 2)}px`);
  };

  const apply = ({ instant = false } = {}) => {
    if (instant) root.classList.add('is-resizing');
    const split = open && phone();
    root.classList.toggle('is-open', open);
    root.classList.toggle('is-ground', split);   // at once, both ways
    set('--open', open ? 1 : 0);
    set('--split', split ? 1 : 0);
    set('--sheet-h', `${split ? frac * root.clientHeight : phone() ? SLOT : ROW}px`);
    toggle.setAttribute('aria-expanded', String(open));
    body.inert = !open;
    if (instant) {
      void root.offsetWidth;
      root.classList.remove('is-resizing');
    }
  };

  const setOpen = (next) => {
    if (next === open) return;
    open = next;
    if (!open) frac = STAGE_SHEET_SNAPS[1];
    apply();
    root.dispatchEvent(new CustomEvent('stage-sheet-toggle', { bubbles: true, detail: { open } }));
  };

  // ---- Drag the heading to resize the split (phones, open).
  let drag = null;
  let suppressClick = false;
  toggle.addEventListener('pointerdown', (event) => {
    suppressClick = false; // a drag that ended without a click mustn't swallow this tap
    if (!open || !phone()) return;
    drag = { y: event.clientY, frac, moved: false, lastY: event.clientY, lastT: performance.now(), v: 0 };
    toggle.setPointerCapture(event.pointerId);
  });
  toggle.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.abs(dy) < STAGE_SHEET_TAP) return;
    drag.moved = true;
    root.classList.add('is-resizing');
    const now = performance.now();
    drag.v = (event.clientY - drag.lastY) / Math.max(1, now - drag.lastT);
    drag.lastY = event.clientY;
    drag.lastT = now;
    frac = Math.max(STAGE_SHEET_MIN, Math.min(STAGE_SHEET_MAX, drag.frac - dy / root.clientHeight));
    set('--sheet-h', `${frac * root.clientHeight}px`);
  });
  const endDrag = () => {
    if (!drag) return;
    const done = drag;
    drag = null;
    void root.offsetWidth;
    root.classList.remove('is-resizing');
    if (!done.moved) return;
    suppressClick = true;
    if (frac < STAGE_SHEET_CLOSE_BELOW || done.v > STAGE_SHEET_FLICK) { setOpen(false); return; }
    // A flick up goes to the next height; otherwise the nearest.
    let target = STAGE_SHEET_SNAPS.reduce((a, b) => (Math.abs(b - frac) < Math.abs(a - frac) ? b : a));
    if (done.v < -STAGE_SHEET_FLICK) target = STAGE_SHEET_SNAPS.find((s) => s > done.frac + 0.01) || STAGE_SHEET_SNAPS[STAGE_SHEET_SNAPS.length - 1];
    frac = target;
    apply();
  };
  toggle.addEventListener('pointerup', endDrag);
  toggle.addEventListener('pointercancel', endDrag);
  toggle.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    setOpen(!open);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
  });

  // Starts open on wide screens unless data-open="false"; always closed on phones.
  open = !phone() && root.dataset.open !== 'false';
  measure();
  apply({ instant: true });
  document.fonts?.ready.then(() => { measure(); apply({ instant: true }); });
  let width = root.clientWidth;
  new ResizeObserver(() => {
    measure();
    if (root.clientWidth !== width) { width = root.clientWidth; apply({ instant: true }); }
  }).observe(root);
});
