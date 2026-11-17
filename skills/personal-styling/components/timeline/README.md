# Timeline

Steps over time — an order, a booking, a process — drawn as the slider standing up: a grey track, ink through the steps done, the slider's thumb on the step happening now.

## Rules

- **It is the slider's parts.** A `16px` track in `--color-range-track`, full ink (`--color-range-progress`) through the steps done, and the slider's `12px` thumb on the current step. The track's ends sit `8px` past the first and last step's centre, rounded, as the slider's do.
- **Small dots, one large.** Each step done carries a `4px` dot in the ground colour on the ink; each step still to come a `4px` dot in the grey ink on the track. Only the current step has the `12px` thumb.
- **An even ring around the thumb.** The ink stops `2px` below the thumb — the `2px` the track leaves either side of it — so the thumb sits in an even ring. No shadow on the thumb here: on a ring of ink it would only shrink the gap below.
- **Each step is a row.** At least `36px` (`--height-control`), the step's name in Body, its time or date at the end in mono. Done and current steps take full ink; steps to come stay secondary. A row can wrap; each step draws its own piece of the track, so the ink still ends at its step.
- **It reads, it doesn't act.** No hover, no press. A step that opens something is a list row (`components/list-row/`).
- **One current step, always.** When everything is done, the last step is the current one.
- **State without colour.** The ink and the thumb carry the progress; never the accent, never green.

## Use

- `ol.timeline` (with an `aria-label`) › `li.timeline-step` › `span.timeline-dot[aria-hidden="true"]`, the name (`.t-body`) and the time (`.t-mono`).
- Mark steps done `.is-done`, and the current one `.is-current` with `aria-current="step"`.
- No JavaScript.

## Changes in v0.1.1

- When every step is done, the ink ends with the track, rounded, instead of running square past its end.
