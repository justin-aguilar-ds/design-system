/* personal-styling · carousel · v0.4.0 */

// One item at a time. Moves by drag or swipe (1:1, then a snap past 40% of
// the width or a flick), by horizontal trackpad or wheel, and by the arrow
// keys while the carousel has focus. Vertical scrolling is never taken.

// Mirrors --duration-carousel: input waits while a slide settles.
const CAROUSEL_LOCK_MS = 1200;
// Mirrors --duration-base: the caption's leave, before its words swap.
const CAROUSEL_CAPTION_MS = 250;
const CAROUSEL_DRAG_RATIO = 0.4;   // of the carousel's width
const CAROUSEL_FLICK = 0.5;        // px per ms — fast enough counts, however short
const CAROUSEL_WHEEL = 100;        // accumulated horizontal delta per slide
const CAROUSEL_TAP = 10;           // px — less movement than this is a tap, not a drag

document.querySelectorAll('.carousel').forEach((carousel) => {
  const viewport = carousel.querySelector('.carousel-viewport');
  const track = carousel.querySelector('.carousel-track');
  const caption = carousel.querySelector('.carousel-caption');
  const title = carousel.querySelector('.carousel-caption-title');
  const meta = carousel.querySelector('.carousel-caption-meta');
  if (!viewport || !track) return;
  const items = [...track.children];
  const frames = items.map((item) => item.querySelector('.carousel-frame'));
  if (!items.length) return;

  // The resting scale and opacity come from the tokens, so the drag
  // interpolation can never disagree with the CSS.
  const root = getComputedStyle(document.documentElement);
  const SCALE_AWAY = parseFloat(root.getPropertyValue('--scale-inactive')) || 0.8;
  // NEW (v0.3): data-edges="open" — nothing clips, so an item away from
  // the centre is gone rather than faint (see carousel.css).
  const OPACITY_AWAY = carousel.dataset.edges === 'open' ? 0 : parseFloat(root.getPropertyValue('--opacity-inactive')) || 0.2;

  // NEW (v0.3): data-loop makes it a circle — past the last item is the
  // first, and back from the first is the last. It needs three items or
  // more. The track is still a row: while it rests, the item at the far
  // end is moved round to the other side so the centred one always has a
  // neighbour both ways, for a drag as much as for a key.
  const order = [...items];   // the authored order: slide numbers and event indexes never change
  const loop = carousel.hasAttribute('data-loop') && items.length > 2;

  let active = Math.max(0, items.findIndex((item) => item.classList.contains('is-active')));
  let locked = false;
  const width = () => viewport.clientWidth;
  const restingOffset = () => -active * width();
  const setTrack = (px) => { track.style.transform = `translateX(${px}px)`; };

  // Only the centred item can be reached: the others are inert, so they
  // leave the tab order and can't be clicked while they're out of view.
  const render = () => {
    items.forEach((item, i) => {
      const on = i === active;
      item.classList.toggle('is-active', on);
      item.inert = !on;
      item.setAttribute('aria-label', `${order.indexOf(item) + 1} of ${items.length}`);
    });
    setTrack(restingOffset());
  };
  // Move the track without its 1200ms glide — first paint and resizes.
  const jump = () => {
    track.style.transition = 'none';
    render();
    void track.offsetWidth;
    track.style.transition = '';
  };

  const rebalance = () => {
    if (!loop || locked) return;
    if (active === items.length - 1) {
      items.push(items.shift()); frames.push(frames.shift());
      track.append(items[items.length - 1]);
      active -= 1;
    } else if (active === 0) {
      items.unshift(items.pop()); frames.unshift(frames.pop());
      track.prepend(items[0]);
      active += 1;
    } else return;
    jump();   // the same item, centred, at its new place in the row
  };

  const setCaption = () => {
    if (title) title.textContent = items[active].dataset.title || '';
    if (meta) meta.textContent = items[active].dataset.meta || '';
  };
  const changeCaption = () => {
    if (!caption) return setCaption();
    caption.classList.add('is-leaving');
    setTimeout(() => {
      setCaption();
      void caption.offsetWidth; // commit the hidden state before reversing it
      caption.classList.remove('is-leaving');
    }, CAROUSEL_CAPTION_MS);
  };
  // A video plays from the start each time its slide arrives.
  const restartVideo = () => {
    const video = items[active].querySelector('video');
    if (!video) return;
    video.currentTime = 0;
    video.play?.()?.catch(() => {});
  };

  const goTo = (index) => {
    if (locked) return;
    const step = index - active;
    rebalance();
    const next = Math.max(0, Math.min(items.length - 1, active + step));
    if (next === active) { render(); return; } // the ends: snap back
    active = next;
    locked = true;
    if (typeof hideTooltip === 'function') hideTooltip(); // tooltip.js: a dropped note belonged to the item we left
    render();
    changeCaption();
    restartVideo();
    carousel.dispatchEvent(new CustomEvent('carousel-change', { bubbles: true, detail: { index: order.indexOf(items[active]), item: items[active] } }));
    setTimeout(() => { locked = false; }, CAROUSEL_LOCK_MS);
  };

  // ---- Drag. Only the centred item and its two neighbours can be in view
  // during a one-slide drag, so only they follow the pointer: 1 at the
  // centre, easing to the resting scale and opacity a full width away.
  const dragScale = (trackPx) => {
    [active - 1, active, active + 1].forEach((i) => {
      const frame = frames[i];
      if (!frame) return;
      const away = Math.min(1, Math.abs(i * width() + trackPx) / width());
      frame.style.scale = String(1 + (SCALE_AWAY - 1) * away);
      frame.style.opacity = String(1 + (OPACITY_AWAY - 1) * away);
    });
  };
  // Hand scale back to the CSS, which glides from wherever the drag left it.
  const clearDragScale = () => frames.forEach((frame) => {
    if (!frame) return;
    frame.style.scale = '';
    frame.style.opacity = '';
  });

  let drag = null;
  viewport.addEventListener('pointerdown', (event) => {
    if (locked || (event.pointerType === 'mouse' && event.button !== 0)) return;
    rebalance();
    drag = { id: event.pointerId, x: event.clientX, dx: 0, t: performance.now(), moving: false };
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    drag.dx = event.clientX - drag.x;
    // Until it moves past the tap distance it's still a tap, and the frame's
    // own click (the tooltip) gets it. Capture only once it's a drag.
    if (!drag.moving) {
      if (Math.abs(drag.dx) < CAROUSEL_TAP) return;
      drag.moving = true;
      carousel.classList.add('is-dragging');
      viewport.setPointerCapture(drag.id);
    }
    const px = restingOffset() + drag.dx;
    setTrack(px);
    dragScale(px);
  });
  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const done = drag;
    drag = null;
    if (!done.moving) return;
    carousel.classList.remove('is-dragging');
    clearDragScale();
    const velocity = Math.abs(done.dx) / Math.max(1, performance.now() - done.t);
    if (Math.abs(done.dx) > width() * CAROUSEL_DRAG_RATIO || velocity > CAROUSEL_FLICK) {
      goTo(active + (done.dx < 0 ? 1 : -1));
    } else {
      render(); // not far or fast enough: back to where it was
    }
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // ---- Horizontal trackpad or wheel only; vertical belongs to the page.
  let wheel = 0;
  viewport.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (locked) return;
    wheel += event.deltaX;
    if (Math.abs(wheel) > CAROUSEL_WHEEL) {
      goTo(active + Math.sign(wheel));
      wheel = 0;
    }
  }, { passive: false });

  // ---- NEW (v0.3): from outside — a page's own previous and next
  // controls. Dispatch `carousel-set` on the carousel with
  // { detail: { step: 1 } } (or -1), or { detail: { index } } in the
  // authored order. Like every other input, it waits while a slide settles.
  carousel.addEventListener('carousel-set', (event) => {
    const { step, index } = event.detail || {};
    if (Number.isInteger(step)) goTo(active + step);
    else if (Number.isInteger(index) && order[index]) goTo(items.indexOf(order[index]));
  });

  // ---- Arrow keys while the carousel, or its centred item, has focus.
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); }
  });

  // ---- NEW (v0.4): a size-driven hold. While something outside is
  // resizing the carousel (a panel opening beside it, a screen splitting),
  // the track's offset is a product of a width that is still moving, so
  // nothing settles toward it: .is-resizing turns the track's and the
  // frames' transitions off and the track follows the width frame by
  // frame. The hold is released by the sizes themselves — two animation
  // frames with no change — never by a timer: the tail of an ease-out
  // moves the width by less than a pixel a frame, and a timer lets go
  // mid-move.
  let resizeFrame = 0;
  let quietFrames = 0;
  const resizeTick = () => {
    if (++quietFrames < 2) { resizeFrame = requestAnimationFrame(resizeTick); return; }
    resizeFrame = 0;
    carousel.classList.remove('is-resizing');
  };
  let sized = false;
  new ResizeObserver(() => {
    if (!sized) { sized = true; return; }   // the first report is the size it already has
    quietFrames = 0;
    carousel.classList.add('is-resizing');
    render();
    if (!resizeFrame) resizeFrame = requestAnimationFrame(resizeTick);
  }).observe(viewport, { box: 'border-box' });
  jump();
  setCaption();
});
