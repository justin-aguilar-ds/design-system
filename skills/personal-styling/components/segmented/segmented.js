/* personal-styling · segmented · v0.2.0 */

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

  // getBoundingClientRect deltas are border-box to border-box, but absolute
  // left/top resolve against the padding edge, so subtract the frame's own
  // border (clientLeft / clientTop).
  const place = (option) => {
    const frame = control.getBoundingClientRect();
    const box = option.getBoundingClientRect();
    indicator.style.left = `${box.left - frame.left - control.clientLeft}px`;
    indicator.style.top = `${box.top - frame.top - control.clientTop}px`;
    indicator.style.width = `${box.width}px`;
    indicator.style.height = `${box.height}px`;
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
