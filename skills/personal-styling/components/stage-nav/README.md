# Stage navigation

Moving between the views on a stage — a calendar, a chart, the figures — with a link at each side that names the view it goes to.

Requires: carousel

From a bet tracker, where the stage held three views of the same bets and the way between them had to say where it went, not just which way.

## Rules

- **Each link names where it goes.** `← Chart` and `Calendar →`: the name of the view on that side, not "Previous" and "Next". You know what you'll see before you go.
- **Mono, with a bare arrow.** The labels are the stage's quiet names for its views, like a control panel's field labels, so they take the mono label style (one of the mono exceptions in `SKILL.md`). The arrow is a bare `10px` mark, `8px` from its label, lifted `1px` to sit on the capitals. No surface, no fill, no underline.
- **Ink only.** Secondary at rest, full ink on hover and press, on `--duration-fast` and plain `ease`.
- **The words drop, swap and rise.** When the view changes, both labels drop `16px` and fade, change while hidden, and rise back — the same move as the carousel's caption (`.swap` in `tokens.css`).
- **At an end, the link holds its place.** If the views don't loop, the link past the last one is hidden but keeps its space, so the other doesn't jump.
- **On the stage's edge.** At the stage's top, either side of its figure, or at its foot. It folds away with the stage's top row when a list opens beside it (see `patterns/stage-list/`).
- **Swipe and arrow keys still work.** The links are for reaching and reading; the carousel keeps its own gestures.

## Use

- `nav.stage-nav[data-carousel="<id>"]` › `button.stage-nav-link.stage-nav-prev.t-mono` and `.stage-nav-next`, each holding a `.stage-nav-label.swap` and an `svg.stage-nav-arrow`.
- The names come from the carousel's items' `data-title`. Use `data-frame="bare"` on the carousel so the views sit on the stage's ground.
- A click dispatches `carousel-set` with `detail.step`; the labels follow `carousel-change`. Load it after `carousel.js` or before: it reads the authored order either way.
