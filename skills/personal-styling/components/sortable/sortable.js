/* personal-styling · sortable · v0.2.1 */

// A list put in order by hand. Pointer: press, then move, and the item
// lifts and follows; the rest part to show where it will land; let go and
// it drops in. Touch: a long press picks up, so a swipe still scrolls the
// page — or the optional grip, which drags at once. Keyboard: Space or
// Enter on the item (or its grip, when it has one) picks up, the arrows
// move, Space or Enter drops, Escape puts it back.

// Mirrors --duration-pop: a dropped item has landed.
const SORTABLE_DROP_MS = 350;
// Mirrors --duration-base: how long a finger holds a row before it lifts.
const SORTABLE_HOLD_MS = 250;
const SORTABLE_START = 4;      // px a mouse or the grip moves before it's a drag, not a click
const SORTABLE_SLOP = 8;       // px a long press may wander before it's a scroll
const SORTABLE_STRETCH = 0.3;  // past either end, the item follows at this rate
const SORTABLE_SWAY = 0.15;    // sideways, it follows at this rate
const SORTABLE_TILT = 3;       // deg at most, leaning into a sideways move
const SORTABLE_EDGE = 48;      // px from the window's edge where the page scrolls itself
const SORTABLE_SCROLL = 12;    // px per frame at the very edge

let sortableCount = 0;

document.querySelectorAll('.sortable').forEach((list) => {
  const id = ++sortableCount;
  const itemsOf = () => [...list.querySelectorAll(':scope > .sortable-item')];
  const label = (item) => item.querySelector('.sortable-label')?.textContent.trim() || 'Item';
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  // The slot marks where the held item will land.
  const slot = document.createElement('li');
  slot.className = 'sortable-slot';
  slot.setAttribute('aria-hidden', 'true');
  list.append(slot);

  // How to use it, read with each grip, and a quiet voice for what happened.
  const help = document.createElement('p');
  help.id = `sortable-${id}-help`;
  help.hidden = true;
  help.textContent = 'Press Space to pick up. Use the arrow keys to move, Space to drop, Escape to cancel.';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
  list.after(help, status);
  const say = (text) => { status.textContent = text; };

  // Rows decide the radius: one line is under --pill-below, so a pill.
  const pillBelow = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pill-below')) || 60;
  const measure = () => itemsOf().forEach((item) => {
    item.classList.toggle('is-pill', item.offsetHeight < pillBelow);
    // The grip is optional. Without one, the item itself takes focus.
    const handle = item.querySelector('.sortable-handle');
    const target = handle || item;
    if (!handle && !item.hasAttribute('tabindex')) item.tabIndex = 0;
    target.setAttribute('aria-describedby', help.id);
    if (handle && !handle.hasAttribute('aria-label')) handle.setAttribute('aria-label', `Move ${label(item)}`);
  });
  measure();
  new ResizeObserver(measure).observe(list);

  // ---- One drag at a time. Offsets, not bounding boxes: they ignore the
  // transforms in play, so the layout read at pick-up stays true.
  let drag = null;
  let dropping = false;

  const gap = () => parseFloat(getComputedStyle(list).rowGap) || 0;

  const begin = (item, { keyed = false } = {}) => {
    const items = itemsOf();
    const from = items.indexOf(item);
    drag = {
      item, items, from, to: from, keyed,
      tops: items.map((el) => el.offsetTop),
      heights: items.map((el) => el.offsetHeight),
      step: item.offsetHeight + gap(),
      x: 0, y: 0, vx: 0, lastX: null, lastT: 0, tilt: 0,
    };
    item.classList.remove('is-pressed');
    item.classList.add('is-lifted');
    item.classList.toggle('is-keyed', keyed);
    list.classList.add('is-sorting');
    slot.classList.toggle('is-pill', item.classList.contains('is-pill'));
    slot.style.transition = 'none';
    slot.style.height = `${drag.heights[from]}px`;
    slot.style.top = `${drag.tops[from]}px`;
    void slot.offsetWidth;
    slot.style.transition = '';
    navigator.vibrate?.(8);
    say(`Picked up ${label(item)}. Position ${from + 1} of ${items.length}.`);
  };

  // Where the held item would land, and everything between there and where
  // it started moves one place to make room.
  const reflow = (to) => {
    const { items, from, step, tops, heights } = drag;
    if (to !== drag.to) {
      drag.to = to;
      navigator.vibrate?.(4);
    }
    items.forEach((el, i) => {
      if (el === drag.item) return;
      let shift = 0;
      if (from < to && i > from && i <= to) shift = -step;
      if (from > to && i >= to && i < from) shift = step;
      el.style.transform = shift ? `translateY(${shift}px)` : '';
    });
    const top = to > from ? tops[to] + heights[to] - heights[from] : tops[to];
    slot.style.top = `${top}px`;
    return top - tops[from];
  };

  // Pointer drag: the item follows 1:1 up and down, with resistance past
  // the ends and sideways, leaning into sideways speed.
  const follow = () => {
    const { item, items, from, tops, heights } = drag;
    const min = tops[0] - tops[from];
    const max = tops[items.length - 1] + heights[items.length - 1] - heights[from] - tops[from];
    let y = drag.y;
    if (y < min) y = min + (y - min) * SORTABLE_STRETCH;
    if (y > max) y = max + (y - max) * SORTABLE_STRETCH;
    const tilt = still.matches ? 0 : Math.max(-SORTABLE_TILT, Math.min(SORTABLE_TILT, drag.vx * 2));
    drag.tilt += (tilt - drag.tilt) * 0.3;
    const x = still.matches ? 0 : drag.x * SORTABLE_SWAY;
    item.style.transform = `translate(${x}px, ${y}px) rotate(${drag.tilt}deg)`;

    // Its centre against everyone else's middle, as they stood at pick-up.
    const centre = tops[from] + drag.y + heights[from] / 2;
    let to = from;
    for (let i = from + 1; i < items.length; i++) if (centre > tops[i] + heights[i] / 2) to = i;
    for (let i = from - 1; i >= 0; i--) if (centre < tops[i] + heights[i] / 2) to = i;
    reflow(to);
  };

  const finish = ({ cancel = false } = {}) => {
    const { item, items, from, keyed } = drag;
    const to = cancel ? from : drag.to;
    const offset = reflow(to);
    drag = null;
    dropping = true;
    list.classList.remove('is-sorting');
    item.classList.remove('is-lifted', 'is-keyed');
    item.classList.add('is-dropping');
    item.style.transform = `translate(0px, ${offset}px)`;
    navigator.vibrate?.(cancel ? 0 : 8);

    setTimeout(() => {
      // Commit: move the node, then clear every transform without a
      // transition — each item is already standing where the DOM now puts it.
      const focused = document.activeElement;
      if (to !== from) {
        const rest = items.filter((el) => el !== item);
        list.insertBefore(item, rest[to] || null); // last place: the end, wherever the slot sits
      }
      itemsOf().forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = '';
      });
      void list.offsetWidth;
      itemsOf().forEach((el) => { el.style.transition = ''; });
      item.classList.remove('is-dropping');
      if (item.contains(focused)) focused.focus({ preventScroll: true });
      dropping = false;

      const name = label(item);
      if (cancel || to === from) {
        say(keyed || cancel ? `${name} put back at position ${from + 1}.` : '');
        return;
      }
      say(`${name} dropped at position ${to + 1} of ${items.length}.`);
      list.dispatchEvent(new CustomEvent('sortable-change', {
        bubbles: true,
        detail: { item, from, to, order: itemsOf().map((el) => el.dataset.id ?? label(el)) },
      }));
    }, SORTABLE_DROP_MS);
  };

  // ---- Pointer
  let press = null;
  let frame = 0;

  // Each frame while held: scroll the page near its edges, keep the tilt
  // easing back once the pointer stops.
  const tick = () => {
    if (!drag || drag.keyed) return;
    drag.vx *= 0.85;
    const edge = press.clientY < SORTABLE_EDGE ? -1 : press.clientY > innerHeight - SORTABLE_EDGE ? 1 : 0;
    if (edge) {
      const depth = edge < 0 ? SORTABLE_EDGE - press.clientY : press.clientY - (innerHeight - SORTABLE_EDGE);
      scrollBy(0, edge * Math.ceil(SORTABLE_SCROLL * Math.min(1, depth / SORTABLE_EDGE)));
    }
    drag.y = press.clientY + scrollY - press.pageY;
    follow();
    frame = requestAnimationFrame(tick);
  };

  const lift = () => {
    clearTimeout(press.hold);
    begin(press.item);
    press.item.setPointerCapture?.(press.id);
    frame = requestAnimationFrame(tick);
  };

  list.addEventListener('pointerdown', (event) => {
    const item = event.target.closest('.sortable-item');
    if (!item || drag || dropping || press) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // Links and other controls inside a row keep their own clicks.
    const control = event.target.closest('a, input, select, textarea, button:not(.sortable-handle)');
    if (control && item.contains(control)) return;
    const onHandle = Boolean(event.target.closest('.sortable-handle'));
    const touchBody = event.pointerType === 'touch' && !onHandle;
    press = {
      item, id: event.pointerId, touchBody,
      x: event.clientX, clientY: event.clientY, pageY: event.clientY + scrollY,
      hold: touchBody ? setTimeout(() => press && lift(), SORTABLE_HOLD_MS) : 0,
    };
    item.classList.add('is-pressed');
    // The hand closes as soon as it takes hold, and stays closed wherever
    // the pointer wanders until it lets go.
    document.documentElement.classList.add('sortable-grabbing');
  });

  document.addEventListener('pointermove', (event) => {
    if (!press || event.pointerId !== press.id) return;
    press.clientY = event.clientY;
    if (!drag) {
      const moved = Math.hypot(event.clientX - press.x, event.clientY + scrollY - press.pageY);
      if (press.touchBody) {
        if (moved > SORTABLE_SLOP) release(); // it's a scroll
        return;
      }
      if (moved < SORTABLE_START) return;
      lift();
    }
    const now = performance.now();
    if (drag.lastX !== null) drag.vx = (event.clientX - drag.lastX) / Math.max(1, now - drag.lastT) * 16;
    drag.lastX = event.clientX;
    drag.lastT = now;
    drag.x = event.clientX - press.x;
  });

  const release = ({ cancel = false } = {}) => {
    if (!press) return;
    clearTimeout(press.hold);
    cancelAnimationFrame(frame);
    press.item.classList.remove('is-pressed');
    document.documentElement.classList.remove('sortable-grabbing');
    press = null;
    if (drag && !drag.keyed) finish({ cancel });
  };
  document.addEventListener('pointerup', (event) => { if (press && event.pointerId === press.id) release(); });
  document.addEventListener('pointercancel', (event) => { if (press && event.pointerId === press.id) release({ cancel: true }); });

  // Once a row is up, the finger belongs to it: no scroll, no menu.
  document.addEventListener('touchmove', (event) => { if (drag && !drag.keyed) event.preventDefault(); }, { passive: false });
  list.addEventListener('contextmenu', (event) => { if (press || drag) event.preventDefault(); });

  // ---- Keyboard, on the grip.
  list.addEventListener('keydown', (event) => {
    // From the grip, or from the item itself when it has no grip.
    const handle = event.target.closest('.sortable-handle');
    const item = handle ? handle.closest('.sortable-item') : event.target.closest('.sortable-item');
    if (!item || dropping) return;
    if (!handle && (event.target !== item || item.querySelector('.sortable-handle'))) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!drag) begin(item, { keyed: true });
      else if (drag.keyed) finish();
      return;
    }
    if (!drag || !drag.keyed) return;
    if (event.key === 'Escape') { event.preventDefault(); finish({ cancel: true }); return; }
    const dir = { ArrowUp: -1, ArrowDown: 1, Home: -Infinity, End: Infinity }[event.key];
    if (!dir) return;
    event.preventDefault();
    const to = Math.max(0, Math.min(drag.items.length - 1, drag.to + dir));
    if (to === drag.to) return;
    const offset = reflow(to);
    item.style.transform = `translate(0px, ${offset}px)`;
    say(`${label(item)}, position ${to + 1} of ${drag.items.length}.`);
  });
  // Tabbing away mid-move drops it where it is.
  list.addEventListener('focusout', (event) => {
    if (drag?.keyed && !list.contains(event.relatedTarget)) finish();
  });
});
