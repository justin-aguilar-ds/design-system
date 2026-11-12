/* personal-styling · stage-list · v0.2.0 */

// Three depths — the stage, its list, one record's detail — and one thumb
// button that walks them: with its label it opens the list, as a cross it
// closes it, as a chevron it goes back from the detail.
// API on the element:
//   el.stageList.open()  .close()        the list, on a phone
//   el.stageList.detail(true | false)    the detail, at any width
//   el.stageList.isOpen  .isDetail  .isPhone
// Events, bubbling: `stage-list-toggle` (detail.open) when the list opens
// or closes; `stage-list-detail` (detail.open) when the detail does.
// Escape goes back one depth.

const STAGE_LIST_PHONE = 630;   // px wide or narrower is a phone
const STAGE_LIST_ICONS = {
  close: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

document.querySelectorAll('.stage-list').forEach((root) => {
  const stage = root.querySelector('.stage-list-stage');
  const list = root.querySelector('.stage-list-list');
  const thumb = root.querySelector('.stage-list-thumb');
  const detail = root.querySelector('.stage-list-detail');
  const top = root.querySelector('.stage-list-top');
  if (!stage || !list || !thumb) return;

  const label = thumb.textContent.trim() || 'List';
  const phone = () => root.clientWidth <= STAGE_LIST_PHONE;
  let open = false;
  let inDetail = false;
  let from = null;

  const apply = () => {
    const mode = inDetail ? 'back' : open ? 'close' : 'open';
    thumb.dataset.mode = mode;
    thumb.innerHTML = mode === 'open' ? label : STAGE_LIST_ICONS[mode];
    thumb.setAttribute('aria-label', { open: `Open ${label.toLowerCase()}`, close: `Close ${label.toLowerCase()}`, back: 'Back' }[mode]);
    root.classList.toggle('is-open', open);
    root.classList.toggle('is-detail', inDetail);
    root.style.setProperty('--list-open', open ? 1 : 0);
    // On a phone a closed list is off the screen; wide, it is always there.
    list.inert = inDetail || (phone() && !open);
    stage.inert = inDetail;
    if (detail) detail.inert = !inDetail;
  };

  const setOpen = (next) => {
    if (next === open) return;
    open = next;
    apply();
    root.dispatchEvent(new CustomEvent('stage-list-toggle', { bubbles: true, detail: { open } }));
  };
  const setDetail = (next) => {
    if (!detail || next === inDetail) return;
    if (next) from = document.activeElement;
    inDetail = next;
    apply();
    if (next) { detail.scrollTop = 0; thumb.focus({ preventScroll: true }); }
    else from?.focus?.({ preventScroll: true });
    root.dispatchEvent(new CustomEvent('stage-list-detail', { bubbles: true, detail: { open: inDetail } }));
  };

  thumb.addEventListener('click', () => { if (inDetail) setDetail(false); else setOpen(!open); });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (inDetail) setDetail(false);
    else if (open && phone()) setOpen(false);
  });

  // The top row folds away on a phone: its real height drives the fold.
  // Wrap its content in one element (.stage-list-top-in) to be measured.
  const inner = top?.querySelector('.stage-list-top-in');
  if (inner) new ResizeObserver(() => root.style.setProperty('--list-top-h', `${inner.offsetHeight}px`)).observe(inner);

  // Crossing the breakpoint changes whether a closed list is reachable.
  let wasPhone = phone();
  new ResizeObserver(() => { if (phone() !== wasPhone) { wasPhone = phone(); apply(); } }).observe(root);

  root.stageList = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    detail: (next) => setDetail(Boolean(next)),
    get isOpen() { return open; },
    get isDetail() { return inDetail; },
    get isPhone() { return phone(); },
  };
  apply();
});
