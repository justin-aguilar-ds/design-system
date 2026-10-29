/* personal-styling · tooltip · v0.2.0 */

// Four declarative pieces:
//   [data-tooltip="…"]         inline information — grows from the trigger on
//                              hover, focus or tap
//   [data-tooltip-toggle="id"] a button opens and closes the authored tooltip
//                              with that id — for prose that has to stay put
//   [data-tooltip-drop="…"]    a click drops a tooltip where it landed; the
//                              next click anywhere closes it
//   [data-cursor="…"]          a pill replaces the cursor over the element
// One tooltip is open at a time.

// Mirrors --duration-pop in tokens.css: the text starts its wipe as the box
// finishes scaling, and a closing box is removed once it has shrunk away.
const TOOLTIP_POP_MS = 350;
const TOOLTIP_GAP = 8; // px between a trigger and its tooltip

let openTooltip = null; // { el, owner, reveal, authored }
let tooltipCount = 0;

// Anchor the tooltip's corner at x, above `top` — or below `bottom` if there
// is no room above. offsetWidth/Height are the natural size even while
// scale(0) hides the box, so the anchor is exact for any length of copy.
function showTooltip(text, owner, x, top, bottom) {
  hideTooltip();
  const el = document.createElement('div');
  el.className = 'tooltip';
  el.id = `tooltip-${++tooltipCount}`;
  el.setAttribute('role', 'tooltip');
  const p = document.createElement('p');
  p.className = 'tooltip-text t-mono';
  p.textContent = text;
  el.append(p);
  document.body.append(el);

  let y = top - el.offsetHeight;
  if (y < TOOLTIP_GAP) {
    el.classList.add('is-below');
    y = bottom;
  }
  el.style.left = `${Math.max(0, Math.min(x, innerWidth - el.offsetWidth))}px`;
  el.style.top = `${y}px`;

  owner.setAttribute('aria-describedby', el.id);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  const reveal = setTimeout(() => el.classList.add('is-text-visible'), TOOLTIP_POP_MS);
  openTooltip = { el, owner, reveal };
}

// Only the scale reverses — the text stays revealed until the box is gone.
// An authored tooltip is hidden rather than removed, and re-clipped once
// it's out of sight so the next open wipes in again.
function hideTooltip() {
  if (!openTooltip) return;
  const { el, owner, reveal, authored } = openTooltip;
  openTooltip = null;
  clearTimeout(reveal);
  owner.removeAttribute('aria-describedby');
  owner.classList.remove('has-tooltip');
  el.classList.remove('is-visible');
  if (!authored) {
    setTimeout(() => el.remove(), TOOLTIP_POP_MS);
    return;
  }
  owner.setAttribute('aria-expanded', 'false');
  setTimeout(() => {
    if (openTooltip?.el === el) return; // reopened while closing
    el.hidden = true;
    el.classList.remove('is-text-visible');
  }, TOOLTIP_POP_MS);
}

// ---- Toggled ----
function openAuthored(owner) {
  const el = document.getElementById(owner.dataset.tooltipToggle);
  if (!el) return;
  hideTooltip();
  el.hidden = false;
  void el.offsetWidth; // commit the scale(0) start before it grows
  owner.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => el.classList.add('is-visible'));
  const reveal = setTimeout(() => el.classList.add('is-text-visible'), TOOLTIP_POP_MS);
  openTooltip = { el, owner, reveal, authored: true };
}

// ---- Inline ----
const inlineTrigger = (target) => target.closest?.('[data-tooltip]');

function showInline(trigger) {
  if (openTooltip?.owner === trigger) return;
  const box = trigger.getBoundingClientRect();
  showTooltip(trigger.dataset.tooltip, trigger, box.left, box.top - TOOLTIP_GAP, box.bottom + TOOLTIP_GAP);
}

document.addEventListener('pointerover', (event) => {
  const trigger = event.pointerType === 'mouse' && inlineTrigger(event.target);
  if (trigger) showInline(trigger);
});
document.addEventListener('pointerout', (event) => {
  const trigger = event.pointerType === 'mouse' && inlineTrigger(event.target);
  if (trigger && !trigger.contains(event.relatedTarget) && openTooltip?.owner === trigger
      && document.activeElement !== trigger) hideTooltip();
});
document.addEventListener('focusin', (event) => {
  const trigger = inlineTrigger(event.target);
  if (trigger) showInline(trigger);
});
document.addEventListener('focusout', (event) => {
  const trigger = inlineTrigger(event.target);
  if (trigger && openTooltip?.owner === trigger) hideTooltip();
});

// ---- Clicks: tap an inline trigger, drop on a frame, or close ----
document.addEventListener('click', (event) => {
  // Reading or following a link inside an open authored tooltip keeps it open.
  if (openTooltip?.authored && openTooltip.el.contains(event.target)) return;

  const toggle = event.target.closest('[data-tooltip-toggle]');
  if (toggle) {
    if (openTooltip?.owner === toggle) hideTooltip();
    else openAuthored(toggle);
    return;
  }

  const inline = inlineTrigger(event.target);
  if (inline) { showInline(inline); return; }

  const frame = event.target.closest('[data-tooltip-drop]');
  if (openTooltip) {
    const sameFrame = openTooltip.owner === frame;
    hideTooltip();
    if (sameFrame || !frame) return;
  }
  if (!frame) return;

  // A keyboard click (detail 0) has no pointer position, so drop at the centre.
  const box = frame.getBoundingClientRect();
  const keyboard = event.detail === 0;
  const x = keyboard ? box.left + box.width / 2 : event.clientX;
  const y = keyboard ? box.top + box.height / 2 : event.clientY;
  showTooltip(frame.dataset.tooltipDrop, frame, x, y, y);
  frame.classList.add('has-tooltip');
  cursorPill?.classList.remove('is-visible'); // the click was the invitation's answer
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !openTooltip) return;
  if (openTooltip.authored) openTooltip.owner.focus();
  hideTooltip();
});

// ---- Cursor pill ----
let cursorPill = null;

document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') return; // touch and pen have no cursor to replace
  const target = event.target.closest?.('[data-cursor]');
  if (!target && !cursorPill) return;
  if (!cursorPill) {
    cursorPill = document.createElement('div');
    cursorPill.className = 'cursor-pill';
    cursorPill.setAttribute('aria-hidden', 'true');
    cursorPill.innerHTML = '<div class="cursor-pill-inner"></div>';
    document.body.append(cursorPill);
  }
  cursorPill.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  const show = Boolean(target) && !target.classList.contains('has-tooltip');
  if (show) cursorPill.firstChild.textContent = target.dataset.cursor;
  cursorPill.classList.toggle('is-visible', show);
});
document.documentElement.addEventListener('mouseleave', () => cursorPill?.classList.remove('is-visible'));
