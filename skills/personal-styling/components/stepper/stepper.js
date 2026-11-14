/* personal-styling · stepper · v0.1.0 */

// Minus and plus move the number by data-step (1 unless set), held between
// data-min and data-max. A step at its limit is disabled. The number can
// also be typed, or moved with the arrow keys; whatever is typed is
// rounded to a step and held in range when the field is left.
// Fires a bubbling `stepper-change` with detail.value.
document.querySelectorAll('.stepper').forEach((stepper) => {
  const input = stepper.querySelector('.stepper-input');
  const [down, up] = stepper.querySelectorAll('.stepper-step');
  if (!input || !down || !up) return;

  const num = (v, fallback) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? fallback : Number(v));
  const min = num(stepper.dataset.min, -Infinity);
  const max = num(stepper.dataset.max, Infinity);
  const step = num(stepper.dataset.step, 1);
  let value = null;

  const set = (n, { silent = false } = {}) => {
    const base = Number.isFinite(min) ? min : 0;
    const snapped = Number.isFinite(n) ? base + Math.round((n - base) / step) * step : (value ?? base);
    const next = Math.min(max, Math.max(min, snapped));
    input.value = next;
    if (!input.disabled) {
      down.disabled = next <= min;
      up.disabled = next >= max;
    }
    if (next === value) return;
    value = next;
    if (!silent) stepper.dispatchEvent(new CustomEvent('stepper-change', { bubbles: true, detail: { value } }));
  };

  down.addEventListener('click', () => set(value - step));
  up.addEventListener('click', () => set(value + step));
  input.addEventListener('change', () => set(parseFloat(input.value)));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') { event.preventDefault(); set(value + step); }
    if (event.key === 'ArrowDown') { event.preventDefault(); set(value - step); }
  });
  set(parseFloat(input.value), { silent: true });
});
