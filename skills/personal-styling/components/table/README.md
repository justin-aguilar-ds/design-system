# Table

Rows of records for tools: full width of its container, sitting on the page with dividers, and every row brightening on hover.

## Rules

**A table is a list, so it sits on the page** — a heading, then the rows, with dividers. No card around it. A card around a table gives you two nested borders and a scroll container inside a rounded box, which is where the awkward negative-margin gutters come from.

- **Full width of its container.** The table is `width: 100%` inside `.table-wrap`. It never sets its own max-width; the container does.
- **Column headers are Label** (16/19, 600, full ink) — never mono, never uppercase. Left-aligned, `16px` bottom padding.
- **Every data cell is 10.5 mono**, weight 500: values, figures, timestamps, IDs, statuses, details. Tables don't inherit font sizes for mono.
- **Value vs detail is ink, not size.** The identifying column (id, name) carries full ink; first-column position is what makes a row scannable. Anything else that must be read takes `.table-ink`. The rest is secondary.
- **Row dividers:** `1px solid var(--color-divider)`. None under the last row, no vertical rules, no zebra striping.
- **Cells:** `16px` vertical padding, `24px` between columns.
- **Row hover is mandatory, and it is a fill.** One `--color-fill-subtle` fill glides from row to row as the pointer moves, over `--duration-base` (250ms) on `--ease-out` — the segmented control's indicator, turned on its side, and one step faster because rows are dense, repeated targets. The row's ink brightens to full over the same 250ms with plain `ease`, and the dividers either side of it fade, so the fill reads as one shape.
- **A one-line row's fill is a pill.** Rows under `--pill-below` (60px) — any row that doesn't wrap — get a fully round fill, matching the segmented control and picker; a row that wraps to two lines keeps 20px corners. `table.js` decides per row as the fill moves.
- **The fill appears in place, then glides.** Entering the table fades it in on the row under the pointer; it never slides in from somewhere else. Leaving fades it out, or sends it back to the selected row.
- **Selection is the same fill, held.** A row with `.is-selected` keeps the fill when nothing is hovered, the way the segmented control returns to its active option. The fill is the only shape: the row's own `.is-selected` background is switched off while `table.js` runs, and comes back only as the no-JS fallback.
- **Cells:** `16px` at the table's outer edges, so text sits inside the fill's rounded ends.
- **Status is glyph + word** — `✓ Delivered`, `! Retrying`, `✗ Failed`, `– Unknown`. Warnings and failures take `.table-ink`: problems get full ink, not less.
- **Figures align right** with `.table-num`, on the header and the cells.
- **Scroll, don't shrink.** A wide table scrolls inside `.table-wrap`. Never drop the type size to make it fit. The identifying column never wraps.
- **A verification table takes exactly one size** (`.table--uniform`): 10.5 mono throughout, headers included. Reconciliation has no hierarchy to show, so the one-size rule wins over the headers-are-labels rule.

## Use

- Wrap the `<table class="table">` in `<div class="table-wrap">`. Give headers `scope="col"`. Load `table.js` after the markup: it adds the fill to every `.table-wrap`.
- **Selected row:** add `.is-selected` and `aria-selected="true"` to the `<tr>`. Move them yourself when the selection changes; the fill follows on the next hover or focus.
- **Clickable rows:** put `<a class="table-link" href="…">` around the text in the identifying cell. The whole row becomes the hit area, and the row takes the focus outline.
- **Wide tables:** add `.table--sticky` to keep the identifying column in view while scrolling.
- If the table sits in a grid or flex column, that column needs `min-width: 0`, or the table will widen the column instead of scrolling inside it.
- Put a heading above the table, in Label or Title. The table has no caption styling of its own.

## Changes from the earlier rules

- Hover now brightens the **whole row**. The old rule said "brighten the row label", but the label column is already full ink, so that hover changed nothing.
- v0.2.0: rows take a gliding background fill on hover, modelled on the segmented control. The old rule was "no background change". The table's outer edges gain `16px` of padding to make room for the fill's radius.
- v0.3.0: the fill moves on `--duration-base`, not `--duration-deliberate` — rows are dense. A selected row no longer shows a square background behind the rounded fill.
- Right-aligned figures (`.table-num`), row links and the column gap are new decisions.
