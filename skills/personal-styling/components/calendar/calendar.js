/* personal-styling · calendar · v0.1.0 */

// Draws a .calendar from the JSON inside it:
//   { "end": "2026-11-09", "values": { "2026-10-29": 0.3, "2026-10-30": -0.28, … } }
// `end` is the last day that has happened (default: today); later days in
// its week draw as days to come. Options as data attributes on the element:
//   data-weeks    5 | a number | all   how many weeks to draw, ending on
//                                     end's week; all starts at the first value
//   data-prefix   a unit, e.g. $      set before every value: −$12.50
//   data-ground   page | surface | stage   what the scroll fade fades to
// A day with a value is a button. Picking it fires a bubbling
// `calendar-pick` event with detail.date and detail.value; picking it
// again clears the pick (detail.date is null). API on the element:
// el.calendar.update(data), el.calendar.pick(date | null), el.calendar.picked.

document.querySelectorAll('.calendar').forEach((root) => {
  const source = root.querySelector('script[type="application/json"]');
  if (!source) return;
  let data = JSON.parse(source.textContent);
  let picked = null;

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const day = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const prefix = () => root.dataset.prefix || '';
  const sign = (v) => (v < 0 ? '−' : v > 0 ? '+' : '');
  // The full figure, and a short one for a narrow tile: no unit, and
  // fewer decimals as the figure grows. The exact value is in the label.
  const full = (v) => `${sign(v)}${prefix()}${Math.abs(v).toLocaleString(undefined, Number.isInteger(v) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const short = (v) => { const a = Math.abs(v); return `${sign(v)}${a >= 100 ? Math.round(a) : a >= 10 ? a.toFixed(1) : Number.isInteger(a) ? a : a.toFixed(2)}`; };

  const head = document.createElement('ol');
  head.className = 'calendar-head t-mono';
  head.setAttribute('aria-hidden', 'true');
  head.innerHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<li>${d}</li>`).join('');
  const fade = document.createElement('div');
  fade.className = `scroll-fade${{ surface: ' scroll-fade--surface', stage: ' scroll-fade--stage' }[root.dataset.ground] || ''}`;
  const area = document.createElement('div');
  area.className = 'scroll-fade-area';
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', root.getAttribute('aria-label') || 'Calendar');
  area.append(grid);
  fade.append(area);
  root.append(head, fade);

  function draw() {
    const values = data.values || {};
    const end = data.end ? day(data.end) : new Date();
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate() + (6 - end.getDay()));
    const dates = Object.keys(values).sort();
    let weeks = Number(root.dataset.weeks) || 5;
    if (root.dataset.weeks === 'all' && dates.length) {
      const first = day(dates[0]);
      weeks = Math.round((last - new Date(first.getFullYear(), first.getMonth(), first.getDate() - first.getDay())) / 6048e5 + 1 / 7);
    }
    const start = new Date(last.getFullYear(), last.getMonth(), last.getDate() - 7 * weeks + 1);
    let html = '';
    for (let d = new Date(start); d <= last; d.setDate(d.getDate() + 1)) {
      const key = iso(d);
      const month = d.getDate() === 1 || key === iso(start) ? `<span class="calendar-month">${d.toLocaleDateString('en-US', { month: 'short' })} </span>` : '';
      const date = `<span class="calendar-date t-mono">${month}${d.getDate()}</span>`;
      if (d > end) { html += `<div class="calendar-day calendar-day--future">${date}</div>`; continue; }
      if (!(key in values)) { html += `<div class="calendar-day calendar-day--idle">${date}<span class="t-mono" aria-hidden="true">–</span></div>`; continue; }
      const v = values[key];
      const kind = v > 0 ? 'gain' : v < 0 ? 'loss' : 'flat';
      const ink = v > 0 ? ' ink-gain' : v < 0 ? ' ink-loss' : '';
      html += `<button class="calendar-day calendar-day--${kind}" type="button" data-date="${key}" aria-pressed="${key === picked}"
        aria-label="${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, ${full(v)}">${date}<span class="t-mono${ink}" aria-hidden="true"><span class="calendar-full">${full(v)}</span><span class="calendar-short">${short(v)}</span></span></button>`;
    }
    grid.innerHTML = html;
    root.classList.toggle('has-pick', Boolean(picked) && picked in values);
    area.scrollTop = area.scrollHeight;   // the latest week is the one in view
  }

  function pick(date, { announce = true } = {}) {
    picked = date && date in (data.values || {}) ? date : null;
    grid.querySelectorAll('button.calendar-day').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.date === picked)));
    root.classList.toggle('has-pick', Boolean(picked));
    if (announce) root.dispatchEvent(new CustomEvent('calendar-pick', { bubbles: true, detail: { date: picked, value: picked ? data.values[picked] : null } }));
  }

  grid.addEventListener('click', (event) => {
    const b = event.target.closest('button.calendar-day');
    if (b) pick(b.dataset.date === picked ? null : b.dataset.date);
  });

  root.calendar = {
    update: (next) => { data = next || {}; if (picked && !(picked in (data.values || {}))) picked = null; draw(); },
    pick: (date) => pick(date, { announce: false }),
    get picked() { return picked; },
  };

  draw();
  if (typeof scrollFade === 'function') scrollFade(fade);   // scroll-fade.js: the cut ends dissolve
});
