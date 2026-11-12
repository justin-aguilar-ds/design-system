/* personal-styling · takeover · v0.1.0 */

// One thing, opened over everything. A button with data-takeover="<id>"
// opens the takeover with that id; its .takeover-close, or Escape, closes
// it, and focus goes back to whatever opened it. No click outside: there
// is no outside — the takeover is the screen.
// API on the element: el.takeover.open() / .close(), el.takeover.isOpen.
// Event, bubbling: `takeover-toggle` with detail.open.

document.querySelectorAll('.takeover').forEach((el) => {
  let from = null;
  const body = el.querySelector('.takeover-body');
  const close = el.querySelector('.takeover-close');
  el.inert = !el.classList.contains('is-open');

  const set = (open) => {
    if (open === el.classList.contains('is-open')) return;
    if (open) from = document.activeElement;
    el.classList.toggle('is-open', open);
    el.inert = !open;
    document.documentElement.classList.toggle('has-takeover', open);
    if (open) {
      if (body) body.scrollTop = 0;
      (close || el).focus({ preventScroll: true });
    } else {
      from?.focus?.({ preventScroll: true });
    }
    el.dispatchEvent(new CustomEvent('takeover-toggle', { bubbles: true, detail: { open } }));
  };

  close?.addEventListener('click', () => set(false));
  el.addEventListener('keydown', (event) => { if (event.key === 'Escape') set(false); });

  el.takeover = {
    open: () => set(true),
    close: () => set(false),
    get isOpen() { return el.classList.contains('is-open'); },
  };
});

document.addEventListener('click', (event) => {
  const trigger = event.target.closest?.('[data-takeover]');
  if (!trigger) return;
  document.getElementById(trigger.dataset.takeover)?.takeover?.open();
});
