/* personal-styling · chip · v0.4.0 */

// Each chip owns its own on/off. Delegated, so chips added later work too.
// Disabled buttons never fire click, so there's no check for them here.
document.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  const on = chip.getAttribute('aria-pressed') === 'true';
  chip.setAttribute('aria-pressed', String(!on));
  chip.dispatchEvent(new CustomEvent('chip-change', { bubbles: true, detail: { on: !on } }));
});
