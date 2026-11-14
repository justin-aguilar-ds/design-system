/* personal-styling · menu · v0.1.0 */

// A button that opens a menu of actions (the "menu button" pattern).
// Mouse: click to open, hover to move the fill, click to choose.
// Keyboard: Enter, Space or ↓ opens on the first action; arrows, Home and
// End move; Enter or Space chooses; Escape closes; Tab closes and moves on.
// Choosing closes the menu and fires a bubbling `menu-select` with
// detail.value (the item's data-value, or its text) and detail.item.

// Mirrors --duration-base in tokens.css: a closing menu is hidden once it
// has finished scaling away.
const MENU_CLOSE_MS = 250;
const MENU_GAP = 8; // px between trigger and menu

document.querySelectorAll('.menu').forEach((menu) => {
  const trigger = menu.querySelector('.menu-trigger');
  const surface = menu.querySelector('.menu-surface');
  const list = menu.querySelector('.menu-list');
  if (!trigger || !surface || !list) return;

  const fill = document.createElement('span');
  fill.className = 'menu-fill';
  fill.setAttribute('aria-hidden', 'true');
  surface.prepend(fill);

  const items = () => [...list.querySelectorAll('.menu-item:not(:disabled)')];
  const isOpen = () => menu.classList.contains('is-open');
  let active = null;
  let closeTimer = null;

  // offsetLeft/Top ignore transforms, so the fill lands correctly while
  // the menu is still scaling in. The first placement appears in place;
  // after that it glides.
  const indicate = (item) => {
    active?.classList.remove('is-indicated');
    active = item || null;
    if (!active) { surface.classList.remove('has-fill'); return; }
    active.classList.add('is-indicated');
    const row = active.parentElement;
    if (!surface.classList.contains('has-fill')) fill.style.transition = 'none';
    fill.style.left = `${list.offsetLeft + row.offsetLeft}px`;
    fill.style.top = `${list.offsetTop + row.offsetTop}px`;
    fill.style.width = `${row.offsetWidth}px`;
    fill.style.height = `${row.offsetHeight}px`;
    void fill.offsetWidth;
    fill.style.transition = '';
    surface.classList.add('has-fill');
  };

  const open = ({ keyboard = false } = {}) => {
    if (isOpen()) return;
    clearTimeout(closeTimer);
    surface.hidden = false;
    // Below, or above when there isn't room below the trigger.
    const roomBelow = innerHeight - trigger.getBoundingClientRect().bottom;
    menu.classList.toggle('is-above', roomBelow < surface.offsetHeight + MENU_GAP);
    trigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    if (keyboard) {
      const first = items()[0];
      first?.focus({ preventScroll: true });
      indicate(first);
    }
  };

  const close = ({ focusTrigger = true } = {}) => {
    if (!isOpen()) return;
    menu.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (focusTrigger) trigger.focus();
    closeTimer = setTimeout(() => {
      surface.hidden = true;
      indicate(null);
    }, MENU_CLOSE_MS);
  };

  // A click with no pointer behind it (detail 0) came from the keyboard.
  trigger.addEventListener('click', (event) => {
    if (isOpen()) close(); else open({ keyboard: event.detail === 0 });
  });
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); open({ keyboard: true }); }
  });

  list.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const item = event.target.closest('.menu-item:not(:disabled)');
    if (item && item !== active) indicate(item);
  });
  list.addEventListener('pointerleave', () => { if (!list.contains(document.activeElement)) indicate(null); });
  list.addEventListener('keydown', (event) => {
    const all = items();
    const i = all.indexOf(document.activeElement);
    const to = {
      ArrowDown: all[Math.min(i + 1, all.length - 1)],
      ArrowUp: all[Math.max(i - 1, 0)],
      Home: all[0],
      End: all[all.length - 1],
    }[event.key];
    if (to) { event.preventDefault(); to.focus({ preventScroll: true }); indicate(to); }
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab') close({ focusTrigger: false });
  });
  list.addEventListener('click', (event) => {
    const item = event.target.closest('.menu-item');
    if (!item || item.disabled) return;
    close();
    menu.dispatchEvent(new CustomEvent('menu-select', {
      bubbles: true,
      detail: { value: item.dataset.value ?? item.textContent.trim(), item },
    }));
  });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.contains(event.target)) close({ focusTrigger: false });
  });
});
