# Line chart

Series over time, for seeing one against the rest: a quiet bundle of grey lines, one in full ink, and a tooltip for the values.

## Rules

- **The focus is the story.** Every series draws in `--color-series`, a solid grey; the one in focus is full ink, one step heavier, drawn on top. A solid grey, never black at an opacity: where translucent lines cross they stack darker, and a bundle turns into a smear.
- **Give it the data's real resolution.** The curve rounds through every point, so its smoothness comes from the points: a season by week (20 or more) reads as a line, a handful reads as a few angles joined by bends. Plot the finest grain you have — weeks over months, days over weeks — and let the tooltip carry the exact values. Never thin the data to make a chart look calmer; never interpolate extra points to make it look smoother.
- **Lines are 2.25px, the focus 3.25px.** Round caps and joins. Curves are monotone: smooth, and never overshooting the data, so a curve never invents a peak or a dip that isn't there. `data-curve="straight"` for data that changes in steps.
- **Labels follow the width.** By default (`data-labels="auto"`) a chart wider than `630px` shows its axis labels and a narrower one doesn't: on a wide screen a chart is read for figures, on a phone for its shape, and the tooltip gives every value either way. It decides from its own width and redraws on resize. `data-labels="on"` keeps them at any width (a tool read for exact figures on a phone); `"off"` drops them (a hero read for its shape, a sparkline-like strip). Labels are mono `10.5px` in secondary ink, `16px` from the data, the X labels thinned until each has room.
- **Guides are dotted, and few.** At most five, on round steps (`data-density="more"` for about eight), as 1.5px dots 4px apart in `--color-hairline-strong`: reference, not data. `data-guides="base"` for a baseline only, `"none"` for a bare chart. No vertical guides, no axis lines.
- **The values come from a tooltip at the point.** Nearing a line previews it and grows a tooltip from the nearest point, in the tooltip component's style: name, X, value (and rank, with `data-rank="on"`). A small dot in the line's own ink, ringed by the ground, marks the point. It stays as long as the pointer is over the chart: away from every line it keeps to the line it's on, or the line in focus. No crosshair, no scrub line, and the accent never marks the point.
- **Click or tap a line, or a name, to make it the focus.** The rest stay grey.
- **The point travels along the line.** Moving to the next data point, the dot glides there on the line itself, through the curve that's drawn rather than a straight cut, and the tooltip rides with it. Changing lines, it settles onto the new one over the same move. It appears in place the first time, then travels. Under reduced motion it steps.
- **Or the point tracks the mouse** (`data-hover="track"`). It follows the pointer along the line wherever it is, and snaps to a data point as it comes within `12px` of one, or half the gap to the next if the points are closer. The tooltip stays up and rides with it, on both axes, showing the nearest data point's values: the words change as the pointer passes halfway between two points, the tooltip doesn't come and go. With few points it runs free between them and is pulled in near each; with many, the snaps meet and it steps from point to point. A snap is a short glide, not a jump. A tap on a phone still goes to the nearest point.
- **The hover is timed from the duration tokens.** Lines fade on `--duration-base`, the tooltip grows on `--duration-pop`, and the point and tooltip glide on `--duration-base`, all on `--ease-out`. Override `--line-chart-fade`, `--line-chart-grow` and `--line-chart-glide` on the chart to tune it.
- **The legend is names, below.** In the data's order, under the chart, never beside it. Every name carries the chip's dot: a ring, filled for the focus. `data-legend="off"` when one series is all there is.
- **Full width on a phone.** A chart sits on the page like a table, or on a surface like a card (`.line-chart--surface`).

## Changes in v0.8.0

- Tracking: the tooltip stays visible and rides with the point; its values are the nearest data point's.

## Changes in v0.7.0

- `data-hover="track"`: the point follows the mouse along the line and snaps to nearby data points, where the tooltip shows.
- The glide is back on `--duration-base`.

## Changes in v0.6.0

- The hover point glides along the line from data point to data point, following the curve, with the tooltip riding along; it stays while the pointer is over the chart. `--line-chart-glide` replaces `--line-chart-follow`.

## Changes in v0.5.0

- X labels are placed by their own widths: none collide at the start of a narrow chart with `data-labels="on"`. The last label always shows.

## Changes in v0.4.0

- `data-labels="y"` shows the value labels and drops the ones along the bottom, for a narrow chart whose X labels would collide; the tooltip still names every point.

## Changes in v0.3.0

- Values can go below zero: the guides step down from zero as well as up, so a running total that dips negative stays inside the chart. A chart with no negative values draws exactly as before.
- `data-prefix` sets a unit before every value, after a real minus sign: `−$12.50`. With a unit, a value that isn't whole keeps two decimals.
- `el.lineChart.update(data)` redraws from new data.
- A click or tap at a point fires `line-chart-point` with `detail.index`, `detail.x`, `detail.name` and `detail.value`, so a page can show what's behind that point.

## Changes in v0.2.1

- A rule for resolution: plot the finest grain the data has, so the monotone curve reads as a line rather than angles.

## Changes in v0.2.0

- `data-labels` defaults to `auto`: axis labels show once the chart is wider than 630px, and hide below. Before, they were off unless asked for.

## Use

- `<figure class="line-chart" aria-label="…">` with a `<script type="application/json">` inside: `{ "x": ["Wk 1", …], "series": [{ "name": "Ana", "values": [2, 5, …] }, …] }`. The value axis always includes zero, and reaches below it when the data does.
- Options as data attributes: `data-labels`, `data-guides`, `data-density`, `data-curve`, `data-legend`, `data-rank`, `data-focus`, `data-prefix`.
- `el.lineChart.focus(name)`, `el.lineChart.preview(name | null)` and `el.lineChart.update(data)` drive it from outside; it fires bubbling `line-chart-focus` (`detail.name`) and `line-chart-point` (`detail.index`, `detail.x`, `detail.name`, `detail.value`) events.
- Link a table to it with `data-chart="#chart-id"` on the table and `data-series` on each row (see `components/table/`).
- `lineChartSpark(values, { max })` returns a sparkline in the same spec, for a table cell.
- Needs `--color-series` from `tokens.css` v0.14.
