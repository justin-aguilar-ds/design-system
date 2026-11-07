/* personal-styling · table · v1.0.1 */

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

  // ---- Column focus: the column under the pointer comes up to full ink,
  // header included, so a value reads at the crossing of its row and column.
  let col = -1;
  const focusColumn = (index) => {
    if (index === col) return;
    table.querySelectorAll('.is-col').forEach((cell) => cell.classList.remove('is-col'));
    col = index;
    if (index < 0) return;
    for (const row of table.rows) row.cells[index]?.classList.add('is-col');
  };

  // ---- A linked chart (data-chart="#id", rows carry data-series): the row
  // under the pointer previews its line; a tapped row focuses it; a line
  // focused in the chart selects its row.
  const chart = table.dataset.chart ? document.querySelector(table.dataset.chart) : null;
  const select = (row) => {
    table.querySelectorAll('tbody tr.is-selected').forEach((r) => r.classList.remove('is-selected'));
    if (row) row.classList.add('is-selected');
    indicate(selected());
  };

  table.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return; // touch has no hover to show
    const cell = event.target.closest?.('td, th');
    if (cell && table.contains(cell)) focusColumn(cell.cellIndex);
    const row = rowOf(event.target);
    if (row) indicate(row);
    if (row && chart?.lineChart) chart.lineChart.preview(row.dataset.series || null);
  });
  table.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    focusColumn(-1);
    indicate(selected());
    chart?.lineChart?.preview(null);
  });
  if (chart) {
    table.addEventListener('click', (event) => {
      if (event.target.closest('button, a, input')) return;
      const row = rowOf(event.target);
      if (!row?.dataset.series) return;
      select(row);
      chart.lineChart?.focus(row.dataset.series);
    });
    chart.addEventListener('line-chart-focus', (event) => {
      select([...table.tBodies[0].rows].find((r) => r.dataset.series === event.detail.name) || null);
    });
  }

  // ---- Sparklines: a cell with data-spark="2,5,9" draws the row's series
  // in the line chart's spec (needs line-chart.js), all on one scale.
  const sparks = [...table.querySelectorAll('td[data-spark]')];
  if (sparks.length && typeof lineChartSpark === 'function') {
    const values = sparks.map((cell) => cell.dataset.spark.split(',').map(Number));
    const max = Math.max(...values.flat());
    sparks.forEach((cell, i) => { cell.innerHTML = lineChartSpark(values[i], { max }); });
  }
  table.addEventListener('focusin', (event) => indicate(rowOf(event.target) || selected()));
  table.addEventListener('focusout', (event) => {
    if (!table.contains(event.relatedTarget)) indicate(selected());
  });

  // ---- Sorting: a .table-sort button in a header sorts by that column.
  // Descending first, then ascending. Numbers compare as numbers ("4,210
  // ms", "+0.35", "99.8%"); anything else compares as text. With
  // data-sort="manual" on the table, only the header state and the
  // table-sort event change, and the app reorders its own rows.
  const toNumber = (text) => {
    const n = parseFloat(text.replace(/\u2212/g, '-').replace(/[^0-9.+-]/g, '')); // − (minus sign) counts as -
    return Number.isNaN(n) ? null : n;
  };
  // Rows slide from where they were to where they land, on --duration-base,
  // instead of jumping. A row is the same row by its data-key (or its first
  // cell), so it works when the app re-renders its own rows too.
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const keyOf = (row) => row.dataset.key || row.cells[0]?.textContent.trim();
  const slide = (before) => {
    if (still.matches) return;
    const css = getComputedStyle(document.documentElement);
    const duration = parseFloat(css.getPropertyValue('--duration-base')) || 250;
    const easing = css.getPropertyValue('--ease-out').trim() || 'ease-out';
    for (const row of table.tBodies[0].rows) {
      const dy = (before.get(keyOf(row)) ?? row.offsetTop) - row.offsetTop;
      if (dy) row.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration, easing });
    }
  };

  table.querySelectorAll('.table-sort').forEach((button) => {
    button.addEventListener('click', () => {
      const before = new Map([...table.tBodies[0].rows].map((row) => [keyOf(row), row.offsetTop]));
      const th = button.closest('th');
      const column = [...th.parentElement.children].indexOf(th);
      const direction = th.getAttribute('aria-sort') === 'descending' ? 'ascending' : 'descending';
      table.querySelectorAll('th[aria-sort]').forEach((other) => other.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', direction);
      if (table.dataset.sort !== 'manual') {
        const body = table.tBodies[0];
        const value = (row) => row.children[column]?.textContent.trim() ?? '';
        const rows = [...body.rows].sort((a, b) => {
          const x = value(a), y = value(b);
          const nx = toNumber(x), ny = toNumber(y);
          const order = nx !== null && ny !== null ? nx - ny : x.localeCompare(y);
          return direction === 'ascending' ? order : -order;
        });
        body.append(...rows);
        if (indicated) place(indicated);
      }
      table.dispatchEvent(new CustomEvent('table-sort', { bubbles: true, detail: { column, direction } }));
      slide(before);
      if (col >= 0) { const c = col; col = -1; focusColumn(c); }
    });
  });

  indicate(selected());
  // Late fonts, a resize, or rows changing all move the boxes.
  new ResizeObserver(() => indicated && place(indicated)).observe(table);
});
