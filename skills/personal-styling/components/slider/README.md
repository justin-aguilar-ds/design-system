# Range slider

A continuous value set by drag or keyboard, drawn like a compact segmented control rather than a hairline with an oversized knob.

## Rules

- **Track:** `16px` high, fully round, filled with `--color-range-track` (`rgba(0,0,0,0.12)` in light mode; `rgba(255,255,255,0.24)` in dark mode).
- **Thumb:** `12px` circular white handle, inset `2px` on every side, with the small two-layer `--shadow-range-thumb` so it reads like a segmented-control handle.
- **At rest:** no value fill. The neutral grey track stays quiet.
- **While dragging or changing the value from the keyboard:** a black progress fill runs from the start of the track to `8px` past the thumb's centre, so the white thumb reads as nested inside the fill. On release or key-up it fades out over `--duration-base` with plain `ease`.
- Only the fill's opacity transitions. Its width tracks the value immediately, so the control feels connected to the pointer.
- **Touch target vs. visual size:** the track is `16px`, the hit area is `44px` tall with the track centred in it. A restyle that shrinks the hit area makes dragging harder on touch devices.
- **Gesture collisions:** `touch-action: none` on the control, pointer capture for the drag, and horizontal overscroll containment, so a drag never fights iOS swipe-back. Verify any visual change on the real gesture, not just the look.
- The native range input stays for semantics and keyboard support. The visual track takes the focus outline.

## Use

- Copy the whole `.slider-field`. Give every input a unique `id` and point the `<label for>` and `<output for>` at it.
- The value readout is optional. Delete the `<output>` if the value isn't worth printing.
- `slider.js` sets `--slider-pct` and toggles `.is-active`. Load it after the markup.

## Open question

`--color-range-progress` is `#000000` in both themes, so in dark mode the fill is black on a light track over a black page. Decide whether dark mode should get a white fill, and change the token if so.
