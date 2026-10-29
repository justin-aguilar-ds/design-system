/* personal-styling · table · v0.2.0 */

// One fill per table, gliding to the row under the pointer or keyboard
// focus — the segmented control's indicator, turned on its side. With no
// row indicated it rests on the .is-selected row, or fades out.
document.querySelectorAll('.table-wrap').forEach((wrap) => {
  const table = wrap.querySelector('.table');
  if (!table || !table.tBodies.length) return;

  const fill = document.createElement('span');
  fill.className = 'table-fill';
  fill.setAttribute('aria-hidden', 'true');
  wrap.prepend(fill);

  let indicated = null;
  const selected = () => table.querySelector('tbody tr.is-selected');

  // The fill lives inside the scroll container, so add its scroll offset;
  // absolute left/top resolve against the padding edge, so subtract its border.
  const place = (row) => {
    const frame = wrap.getBoundingClientRect();
    const box = row.getBoundingClientRect();
    fill.style.left = `${box.left - frame.left - wrap.clientLeft + wrap.scrollLeft}px`;
    fill.style.top = `${box.top - frame.top - wrap.clientTop + wrap.scrollTop}px`;
    fill.style.width = `${box.width}px`;
    fill.style.height = `${box.height}px`;
  };

  const indicate = (row) => {
    if (row === indicated) return;
    indicated?.classList.remove('is-indicated');
    if (!row) {
      indicated = null;
      wrap.classList.remove('has-fill');
      return;
    }
    // Arriving from nothing: place it without a glide, then fade it in.
    // Forcing a reflow commits the position before the transition returns.
    if (!indicated) {
      fill.style.transition = 'none';
      place(row);
      void fill.offsetWidth;
      fill.style.transition = '';
    } else {
      place(row);
    }
    indicated = row;
    row.classList.add('is-indicated');
    wrap.classList.add('has-fill');
  };

  const rowOf = (target) => {
    const row = target.closest?.('tr');
    return row && row.parentElement.tagName === 'TBODY' && table.contains(row) ? row : null;
  };

  table.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return; // touch has no hover to show
    const row = rowOf(event.target);
    if (row) indicate(row);
  });
  table.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') indicate(selected());
  });
  table.addEventListener('focusin', (event) => indicate(rowOf(event.target) || selected()));
  table.addEventListener('focusout', (event) => {
    if (!table.contains(event.relatedTarget)) indicate(selected());
  });

  indicate(selected());
  // Late fonts, a resize, or rows changing all move the boxes.
  new ResizeObserver(() => indicated && place(indicated)).observe(table);
});
