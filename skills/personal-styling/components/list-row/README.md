# List row

A list of records with one value each — the name with its value on the same line, one sub-line under both, and an icon or an avatar leading — for reading down on a phone, where a table's columns don't fit.

From a bet tracker, where each bet is its name and its result, with the date and the odds under them.

## Rules

- **Name and value on one line; one sub-line under both.** The name in Label on the left, the value in Label on the right in tabular figures, on the same baseline. Under them, one sub-line in Body, secondary ink: a date, a count, a place, a short sentence. `4px` from the name's line to the sub-line. Two type styles, no mono.
- **A circle can lead the row.** `36px` (a control's height) on the quiet fill (`--color-fill-quiet`, so it shows on the page and on the stage alike), `16px` from the text, centred on the two lines. It holds a `20px` icon in full ink, or an avatar: a person's initials in Interactive type, or their photo. It is a mark, not a button: no edge, no shadow, no hover of its own. A list leads every row or none.
- **`24px` above and below.** With two lines of text a row is `90px`, divider to divider; with the name alone, `67px`.
- **Dividers stay.** It sits on the page, a divider between rows, none above the first or below the last, edge to edge under the circle. No card around the list, and never space alone between rows.
- **Polarity is ink, on the value.** A signed value that is inherently good or bad takes `.ink-gain` or `.ink-loss`. The circle never takes the colour: it stays grey with its icon in black, so each record carries one signal. The name and the sub-line never take it either. A value that isn't settled (open, pushed) stays in the usual ink.
- **When it's this and when it's a table.** One value worth reading per record, on a phone or in a narrow column: a list row. More than one value to compare down a column: a table (`components/table/`).
- **Short names.** A row's name is the short form — `Tatum o26.5 pts`, not the full slip. The full record is one tap away (see `components/takeover/`).
- **A row you can open is a button or a link, and brightens.** Its fill (`--color-fill-subtle`) bleeds `16px` past the text either side, like a table row's, so the text stays in line with the page; the dividers either side fade so the fill reads as one shape. A picked row holds the fill.
- **The value never wraps;** the name wraps if it has to.
- **A second value goes under the first, rarely.** When a record has two values the place names both — a result over its odds — use the two-sided row: the name over a mono sub-line on the left, the value over a mono sub-line on the right. Prefer the one-value row and put the second value in the sub-line's sentence ("Nov 3, at +115").

## Use

- `ul.list-rows` › `li` › `.list-row` (a `<button>` or `<a>` to open, a `<div>` to read) › an optional `.list-row-lead`, then `.list-row-body` holding `.list-row-name.t-label`, `.list-row-value.t-label` and `.list-row-sub.t-body`.
- The circle: `span.list-row-lead[aria-hidden="true"]` holding an `<svg>` drawn on a 20 viewBox, or initials with `.t-control`, or an `<img>`.
- Leave out `.list-row-sub` for a one-line row, or `.list-row-value` for a row with no value.
- Mark the picked row `.is-selected` or `aria-current="true"`.
- Two sides: `.list-row-main` (`.list-row-name.t-label`, `.list-row-sub.t-mono`) and `.list-row-end` (`.list-row-value.t-label`, `.list-row-sub.t-mono`) in place of the body.
- A list that scrolls inside a fixed height goes in a scroll fade (`components/scroll-fade/`). A row needs `16px` of room either side for its fill.

## Changes in v0.2.0

- The value sits on the name's line and one Body sub-line runs under both, `4px` below; the two-sided row with mono sub-lines stays for a second value.
- A leading circle, `36px`, for an icon or an avatar.
- `24px` above and below a row, up from `16px`.
- Polarity is ink on the value, never a fill on the circle.
