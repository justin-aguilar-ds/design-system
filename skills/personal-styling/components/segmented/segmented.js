/* personal-styling · segmented · v0.3.0 */

// The indicator is placed on the "indicated" option: the active one, or the
// one under a mouse as a preview of where a click would land. Buttons switch
// in place and fire `segmented-change`; links navigate, and the page marks
// the active one with .is-active. To move the selection from script — a
// contents list following the scroll — dispatch `segmented-set` on the
// control with { detail: { option } }.
document.querySelectorAll('.segmented').forEach((control) => {
  const indicator = control.querySelector('.segmented-indicator');
  const options = [...control.querySelectorAll('.segmented-option')];
  if (!indicator || !options.length) return;

  let active = control.querySelector('.segmented-option.is-active') || options[0];
  let indicated = null;

  // Layout offsets, not on-screen rects: an option's offsetLeft/Top are
  // measured from the control's padding edge — exactly where the absolutely
  // positioned indicator measures from — and they ignore transforms and
  // zoom, so the fill lands correctly inside anything scaled.
  const place = (option) => {
    indicator.style.left = `${option.offsetLeft}px`;
    indicator.style.top = `${option.offsetTop}px`;
    indicator.style.width = `${option.offsetWidth}px`;
    indicator.style.height = `${option.offsetHeight}px`;
  };

  const indicate = (option) => {
    indicated = option;
    options.forEach((o) => o.classList.toggle('is-indicated', o === option));
    place(option);
  };

  const select = (option) => {
    if (option === active) return;
    // Buttons are pressed; links are the current location.
    const state = option.tagName === 'A' ? 'aria-current' : 'aria-pressed';
    active.classList.remove('is-active');
    if (state === 'aria-current') active.removeAttribute(state); else active.setAttribute(state, 'false');
    option.classList.add('is-active');
    option.setAttribute(state, 'true');
    active = option;
    indicate(option);
    control.dispatchEvent(new CustomEvent('segmented-change', {
      bubbles: true,
      detail: { option, value: option.value || option.textContent.trim() },
    }));
  };

  // The first placement appears in place instead of sliding in from 0,0.
  // Forcing a reflow commits it before the transition comes back.
  indicator.style.transition = 'none';
  indicate(active);
  void indicator.offsetWidth;
  indicator.style.transition = '';

  options.forEach((option) => {
    option.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse' || option === indicated) return; // touch has no hover to preview
      indicate(option);
    });
    if (option.tagName === 'BUTTON') option.addEventListener('click', () => select(option));
  });

  control.addEventListener('segmented-set', (event) => {
    if (options.includes(event.detail?.option)) select(event.detail.option);
  });

  control.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse' || indicated === active) return;
    indicate(active);
  });

  // Fonts loading late, a resize, or the control being revealed all change
  // the options' boxes.
  new ResizeObserver(() => place(indicated)).observe(control);
});
