# Line chart

Series over time, for seeing one against the rest: a quiet bundle of grey lines, one in full ink, and a tooltip for the values.

## Rules

- **The focus is the story.** Every series draws in `--color-series`, a solid grey; the one in focus is full ink, one step heavier, drawn on top. A solid grey, never black at an opacity: where translucent lines cross they stack darker, and a bundle turns into a smear.
- **Give it the data's real resolution.** The curve rounds through every point, so its smoothness comes from the points: a season by week (20 or more) reads as a line, a handful reads as a few angles joined by bends. Plot the finest grain you have — weeks over months, days over weeks — and let the tooltip carry the exact values. Never thin the data to make a chart look calmer; never interpolate extra points to make it look smoother.
- **Lines are 2.25px, the focus 3.25px.** Round caps and joins. Curves are monotone: smooth, and never overshooting the data, so a curve never invents a peak or a dip that isn't there. `data-curve="straight"` for data that changes in steps.
- **Labels follow the width.** By default (`data-labels="auto"`) a chart wider than `630px` shows its axis labels and a narrower one doesn't: on a wide screen a chart is read for figures, on a phone for its shape, and the tooltip gives every value either way. It decides from its own width and redraws on resize. `data-labels="on"` keeps them at any width (a tool read for exact figures on a phone); `"off"` drops them (a hero read for its shape, a sparkline-like strip). Labels are mono `10.5px` in secondary ink, `16px` from the data, the X labels thinned until each has room.
- **Guides are dotted, and few.** At most five, on round steps (`data-density="more"` for about eight), as 1.5px dots 4px apart in `--color-hairline-strong`: reference, not data. `data-guides="base"` for a baseline only, `"none"` for a bare chart. No vertical guides, no axis lines.
- **The values come from a tooltip at the point.** Nearing a line previews it and grows a tooltip from the nearest point, in the tooltip component's style: name, X, value (and rank, with `data-rank="on"`). A small dot in the line's own ink, ringed by the ground, marks the point. No crosshair, no scrub line, and the accent never marks the point.
- **Click or tap a line, or a name, to make it the focus.** The rest stay grey.
- **The hover is timed from the duration tokens.** Lines fade on `--duration-base`, the tooltip grows on `--duration-pop` and follows on `--duration-fast`, all on `--ease-out`. Override `--line-chart-fade`, `--line-chart-grow` and `--line-chart-follow` on the chart to tune it.
- **The legend is names, below.** In the data's order, under the chart, never beside it. Every name carries the chip's dot: a ring, filled for the focus. `data-legend="off"` when one series is all there is.
- **Full width on a phone.** A chart sits on the page like a table, or on a surface like a card (`.line-chart--surface`).

## Changes in v0.2.1

- A rule for resolution: plot the finest grain the data has, so the monotone curve reads as a line rather than angles.

## Changes in v0.2.0

- `data-labels` defaults to `auto`: axis labels show once the chart is wider than 630px, and hide below. Before, they were off unless asked for.

## Use

- `<figure class="line-chart" aria-label="…">` with a `<script type="application/json">` inside: `{ "x": ["Wk 1", …], "series": [{ "name": "Ana", "values": [2, 5, …] }, …] }`. Values start from zero.
- Options as data attributes: `data-labels`, `data-guides`, `data-density`, `data-curve`, `data-legend`, `data-rank`, `data-focus`.
- `el.lineChart.focus(name)` and `el.lineChart.preview(name | null)` drive it from outside; it fires a bubbling `line-chart-focus` event with `detail.name`.
- Link a table to it with `data-chart="#chart-id"` on the table and `data-series` on each row (see `components/table/`).
- `lineChartSpark(values, { max })` returns a sparkline in the same spec, for a table cell.
- Needs `--color-series` from `tokens.css` v0.14.
