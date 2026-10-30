/* personal-styling · table · v0.6.0 */

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
  wrap.classList.add('table-wrap--fill');

  let indicated = null;
  const selected = () => table.querySelector('tbody tr.is-selected');
  const pillBelow = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pill-below')) || 60;

  // Layout offsets, not on-screen rects: a row measures from the table, the
  // table from the wrap — the fill's own reference — and offsets ignore
  // scrolling, transforms and zoom, so the fill lands correctly anywhere.
  // The fill bleeds past the row by the wrap's own inline padding (16px),
  // so the content is never flush with its edges.
  const bleed = parseFloat(getComputedStyle(wrap).paddingLeft) || 0;
  const place = (row) => {
    fill.style.left = `${table.offsetLeft + row.offsetLeft - bleed}px`;
    fill.style.top = `${table.offsetTop + row.offsetTop}px`;
    fill.style.width = `${row.offsetWidth + 2 * bleed}px`;
    fill.style.height = `${row.offsetHeight}px`;
    fill.classList.toggle('is-pill', row.offsetHeight < pillBelow); // one row is a pill
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
