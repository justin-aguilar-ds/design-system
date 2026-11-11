# Calendar

A value a day on a real calendar — seven across, a week to a row — where each day's tile says which way the day went and how far.

Requires the scroll fade (`components/scroll-fade/`).

From a bet tracker, where the calendar was invented twice before it settled: a day's net profit or loss, green or red, on the dates it happened.

## Rules

- **It is a real calendar.** Seven columns, Sunday to Saturday, with the weekday names above in mono. Weeks run down; the latest week is the bottom row and the one in view.
- **The tile is the value.** The date sits over the day's figure, and the two are one treatment: both `.t-mono`, one size, told apart by ink alone — the date in full ink, the figure in its own.
- **Polarity takes the fill and the ink together here.** A gain day is `--color-gain-fill` under `--color-gain-ink`; a loss day the same in red. Everywhere else a value takes one or the other. On a tile this small the ink alone is too faint and the fill alone doesn't say how far, so this is the one place it takes both (see Polarity in `SKILL.md`).
- **Three quiet tiles.** A day that came out even takes the quiet fill. A day with nothing is the surface held by its hairline, with a dash for the value. A day still to come is the same tile with no dash and its date in secondary ink.
- **A card's corner, at any size.** Tiles take `--radius-card`. On a wide calendar they are 4:3; on a narrow one they are squares, and a 20px corner on a tile about 40px wide renders fully round. Never a radius in between.
- **Narrow by its own width.** At `630px` wide or less the tiles turn square, the gaps drop from `8` to `4`, and the figure takes its short form — no unit, fewer decimals as it grows (`+8.02`, `−10.2`, `−120`) — so a signed value fits. The exact value stays in the tile's accessible name.
- **A day with a value is a button; the rest are not.** Picking a day is for showing what's behind it: a list, a detail.
- **Picked reads by contrast, not a ring.** While a day is picked every other tile drops to `--opacity-inactive` (0.2) and the picked one stays at full strength. Picking it again clears it. A ring on a tile at the edge of the grid is clipped by whatever holds the calendar; the fade can't be. The faded days are out of play, not unreadable: what they hold is still in the list or view the pick opened.
- **Hover firms up the tile's edge** (the strong hairline, inside the tile); the fill is the value's and never changes. On touch the same edge shows on press and the tile gives to `--scale-tap`.
- **More weeks than fit, it scrolls inside itself**, and the cut end dissolves with the scroll fade rather than slicing a row. Tell it what it sits on with `data-ground`.
- **It suits the stage.** A calendar is a view of data, the kind of small tool the stage is for (see Surfaces in `SKILL.md`). How far it sits inside the stage is the stage's to set.

## Use

- `<div class="calendar" aria-label="…">` with a `<script type="application/json">` inside: `{ "end": "2026-11-09", "values": { "2026-10-29": 0.3, … } }`. `end` is the last day that has happened; it defaults to today.
- Options as data attributes: `data-weeks` (`5`, a number, or `all` to start at the first value), `data-prefix` (a unit before every value), `data-ground` (`page`, `surface` or `stage`: what the scroll fade fades to).
- It fires a bubbling `calendar-pick` event with `detail.date` and `detail.value`; `detail.date` is `null` when a pick is cleared.
- `el.calendar.update(data)` redraws from new data; `el.calendar.pick(date | null)` sets the pick from outside without firing the event; `el.calendar.picked` reads it.
- Give it a height from its layout to make it scroll (a grid row, or `max-height`); without one it is as tall as its weeks.
- Load `scroll-fade.css` and `scroll-fade.js` as well, in either order.
