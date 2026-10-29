/* personal-styling · slider · v0.3.0 */

// Keys that change a range input's value. Holding one shows the progress fill.
const SLIDER_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

document.querySelectorAll('.slider').forEach((slider) => {
  const input = slider.querySelector('.slider-input');
  const output = slider.closest('.slider-field')?.querySelector('.slider-value');

  const update = () => {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    slider.style.setProperty('--slider-pct', (input.value - min) / (max - min));
    if (output) output.textContent = input.value;
  };
  const start = () => slider.classList.add('is-active');
  const end = () => slider.classList.remove('is-active');

  input.addEventListener('input', update);
  input.addEventListener('pointerdown', (event) => {
    input.setPointerCapture(event.pointerId);
    start();
  });
  input.addEventListener('pointerup', end);
  input.addEventListener('pointercancel', end);
  input.addEventListener('keydown', (event) => { if (SLIDER_KEYS.has(event.key)) start(); });
  input.addEventListener('keyup', end);
  input.addEventListener('blur', end);
  update();
});
