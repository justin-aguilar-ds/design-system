/* personal-styling · picker · v0.4.0 */

// A button that opens a listbox (the "select-only combobox" pattern).
// Mouse: click to open, hover to move the fill, click to choose.
// Keyboard: Enter, Space or an arrow opens; arrows, Home, End and typing
// move; Enter or Space chooses; Escape closes; Tab closes and moves on.

// Mirrors --duration-base in tokens.css: a closing menu is hidden once it
// has finished scaling away.
const PICKER_CLOSE_MS = 250;
const PICKER_GAP = 8; // px between trigger and menu
const PICKER_TYPEAHEAD_MS = 500;

let pickerCount = 0;

document.querySelectorAll('.picker').forEach((picker) => {
  const trigger = picker.querySelector('.picker-trigger');
  const valueEl = picker.querySelector('.picker-value');
  const menu = picker.querySelector('.picker-menu');
  const list = picker.querySelector('.picker-list');
  const input = picker.querySelector('input[type="hidden"]');
  if (!trigger || !menu || !list) return;

  const fill = document.createElement('span');
  fill.className = 'picker-fill';
  fill.setAttribute('aria-hidden', 'true');
  menu.prepend(fill);

  const id = ++pickerCount;
  const options = [...list.querySelectorAll('[role="option"]')];
  options.forEach((option, i) => { if (!option.id) option.id = `picker-${id}-option-${i}`; });
  const enabled = () => options.filter((o) => o.getAttribute('aria-disabled') !== 'true');
  const selected = () => options.find((o) => o.getAttribute('aria-selected') === 'true');
  const isOpen = () => picker.classList.contains('is-open');

  let active = null;
  let closeTimer = null;
  let typed = '';
  let typedTimer = null;

  if (!selected()) picker.classList.add('is-placeholder');

  // A stable width: the trigger is as wide as its widest label, placeholder
  // included, so choosing an option never moves the chevron or the layout.
  // Measured on the trigger itself, so padding, chevron and type all count.
  const fitWidth = () => {
    if (!valueEl || !options.length) return;
    const current = valueEl.textContent;
    trigger.style.minWidth = '';
    let widest = 0;
    for (const label of [current, ...options.map((o) => o.textContent.trim())]) {
      valueEl.textContent = label;
      widest = Math.max(widest, trigger.offsetWidth);
    }
    valueEl.textContent = current;
    if (widest) trigger.style.minWidth = `${widest}px`; // 0 means hidden; measured again on open
  };
  fitWidth();
  document.fonts?.ready.then(fitWidth);

  // offsetLeft/Top ignore transforms, so the fill lands correctly even
  // while the menu is still scaling in. Options measure from the list
  // (it's positioned), so add the list's own offset inside the menu.
  const place = (option) => {
    fill.style.left = `${list.offsetLeft + option.offsetLeft}px`;
    fill.style.top = `${list.offsetTop + option.offsetTop}px`;
    fill.style.width = `${option.offsetWidth}px`;
    fill.style.height = `${option.offsetHeight}px`;
  };

  const setActive = (option, { instant = false, scroll = true } = {}) => {
    active?.classList.remove('is-indicated');
    active = option || null;
    if (!active) {
      menu.classList.remove('has-fill');
      list.removeAttribute('aria-activedescendant');
      return;
    }
    active.classList.add('is-indicated');
    list.setAttribute('aria-activedescendant', active.id);
    // On open the fill appears on the selected option; it only glides
    // once the menu is up.
    if (instant) {
      fill.style.transition = 'none';
      place(active);
      void fill.offsetWidth;
      fill.style.transition = '';
    } else {
      place(active);
    }
    menu.classList.add('has-fill');
    if (scroll) active.scrollIntoView({ block: 'nearest' });
  };

  const open = () => {
    if (isOpen()) return;
    clearTimeout(closeTimer);
    if (!trigger.style.minWidth) fitWidth();
    menu.hidden = false;
    // Open below, or above when there isn't room below the trigger.
    const roomBelow = innerHeight - trigger.getBoundingClientRect().bottom;
    picker.classList.toggle('is-above', roomBelow < menu.offsetHeight + PICKER_GAP);
    trigger.setAttribute('aria-expanded', 'true');
    setActive(selected() || enabled()[0], { instant: true });
    requestAnimationFrame(() => picker.classList.add('is-open'));
    list.focus({ preventScroll: true });
  };

  const close = ({ focusTrigger = true } = {}) => {
    if (!isOpen()) return;
    picker.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (focusTrigger) trigger.focus();
    closeTimer = setTimeout(() => {
      menu.hidden = true;
      setActive(null);
    }, PICKER_CLOSE_MS);
  };

  const choose = (option) => {
    if (!option || option.getAttribute('aria-disabled') === 'true') return;
    const previous = selected();
    if (option !== previous) {
      previous?.setAttribute('aria-selected', 'false');
      option.setAttribute('aria-selected', 'true');
      if (valueEl) valueEl.textContent = option.textContent.trim();
      picker.classList.remove('is-placeholder');
      const value = option.dataset.value ?? option.textContent.trim();
      if (input) input.value = value;
      picker.dispatchEvent(new CustomEvent('picker-change', { bubbles: true, detail: { value, option } }));
    }
    close();
  };

  const typeahead = (key) => {
    clearTimeout(typedTimer);
    typed += key.toLowerCase();
    typedTimer = setTimeout(() => { typed = ''; }, PICKER_TYPEAHEAD_MS);
    const match = enabled().find((o) => o.textContent.trim().toLowerCase().startsWith(typed));
    if (match) setActive(match);
  };

  trigger.addEventListener('click', () => (isOpen() ? close() : open()));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  });

  list.addEventListener('keydown', (event) => {
    const items = enabled();
    const i = items.indexOf(active);
    switch (event.key) {
      case 'ArrowDown': event.preventDefault(); setActive(items[Math.min(i + 1, items.length - 1)]); break;
      case 'ArrowUp': event.preventDefault(); setActive(items[Math.max(i - 1, 0)]); break;
      case 'Home': event.preventDefault(); setActive(items[0]); break;
      case 'End': event.preventDefault(); setActive(items[items.length - 1]); break;
      case 'Enter':
      case ' ': event.preventDefault(); choose(active); break;
      case 'Escape': event.preventDefault(); close(); break;
      case 'Tab': close({ focusTrigger: false }); break;
      default: if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) typeahead(event.key);
    }
  });

  list.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const option = event.target.closest('[role="option"]');
    if (option && option !== active && option.getAttribute('aria-disabled') !== 'true') setActive(option, { scroll: false });
  });
  list.addEventListener('click', (event) => choose(event.target.closest('[role="option"]')));

  document.addEventListener('pointerdown', (event) => {
    if (!picker.contains(event.target)) close({ focusTrigger: false });
  });
  list.addEventListener('focusout', (event) => {
    if (!picker.contains(event.relatedTarget)) close({ focusTrigger: false });
  });

  // A picker marked open in the markup (the sandbox's static state) shows its fill.
  if (isOpen()) setActive(selected() || enabled()[0], { instant: true, scroll: false });
});
