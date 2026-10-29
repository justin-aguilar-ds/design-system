# Range slider

A continuous value set by drag or keyboard, drawn like a compact segmented control rather than a hairline with an oversized knob.

## Rules

- **Track:** `16px` high, fully round, filled with `--color-range-track` (`rgba(0,0,0,0.12)` in light mode; `rgba(255,255,255,0.24)` in dark mode).
- **Thumb:** `12px` circle in the ground colour (`--color-range-thumb`), inset `2px` on every side, with the small two-layer `--shadow-range-thumb` so it reads like a segmented-control handle.
- **The fill** runs from the start of the track to `8px` past the thumb's centre, so the thumb reads as nested inside it. It's full ink (`--color-range-progress`), so it flips with the theme.
- **The fill deepens in steps, never pops.** The same ladder as a segmented control's label:

| State | Fill |
|---|---|
| Rest | none — the grey track stays quiet |
| Hover, keyboard focus | 30% — a preview of the value, and the slider's hover response |
| Dragging, arrow keys | full ink |

- **It comes in fast and leaves slower.** In on `--duration-fast`, because it answers a hand; out on `--duration-base`. Both plain `ease`: it's a colour change, not something entering the screen.
- Only the fill's opacity transitions. Its width tracks the value immediately, so the control feels connected to the pointer.
- **Spacing is measured from the visible track.** The 44px hit area hangs outside the slider's layout box, so the label sits `8px` above the track, on the scale.
- **Touch target vs. visual size:** the track is `16px`, the hit area is `44px` tall with the track centred in it. A restyle that shrinks the hit area makes dragging harder on touch devices.
- **Gesture collisions:** `touch-action: none` on the control, pointer capture for the drag, and horizontal overscroll containment, so a drag never fights iOS swipe-back. Verify any visual change on the real gesture, not just the look.
- The native range input stays for semantics and keyboard support. The visual track takes the focus outline.

## Use

- Copy the whole `.slider-field`. Give every input a unique `id` and point the `<label for>` and `<output for>` at it.
- The value readout is optional. Delete the `<output>` if the value isn't worth printing.
- `slider.js` sets `--slider-pct` and toggles `.is-active`. Load it after the markup.

## Changes in v0.2.0

- Hover and focus now show the fill at 30%. The slider had no hover response, which the rules count as a defect.
- Pressing deepens the fill from wherever it is instead of popping from nothing to black.
- The fill is `--color-text` and the thumb is `--color-bg`, so dark mode gets a white fill with a dark thumb. This settles the old open question.
- Label to track is `8px`, not `22px`.
