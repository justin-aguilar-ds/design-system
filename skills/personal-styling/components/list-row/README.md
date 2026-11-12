# List row

A list of records with one value each — the name and a sub-line on the left, the value and a sub-line on the right — for reading down on a phone, where a table's columns don't fit.

From a bet tracker, where each bet was its name with the date under it, and the result with the odds under it.

## Rules

- **Two sides, two lines each.** Left: the name in Label, a sub-line under it in mono (a date, a count, a place). Right: the value in Label, right-aligned in tabular figures, a sub-line under it in mono (the odds, a unit, a share). `4px` between a line and its sub-line, `16px` between the sides. Two type styles, no third.
- **When it's this and when it's a table.** One value worth reading per record, on a phone or in a narrow column: a list row. More than one value to compare down a column: a table (`components/table/`).
- **Short names.** A row's name is the short form — `Tatum o26.5 pts`, not the full slip. The full record is one tap away (see `components/takeover/`).
- **It sits on the page.** Dividers between rows, none above the first or below the last, no card around the list.
- **A row you can open is a button or a link, and brightens.** Its fill (`--color-fill-subtle`) bleeds `16px` past the text either side, like a table row's, so the text stays in line with the page; the dividers either side fade so the fill reads as one shape. A picked row holds the fill.
- **The value can take polarity.** A signed value that is inherently good or bad takes `.ink-gain` or `.ink-loss`; its sub-line stays secondary. The name never does.
- **The value never wraps;** the name wraps if it has to.

## Use

- `ul.list-rows` › `li` › `.list-row` (a `<button>` or `<a>` to open, a `<div>` to read) › `.list-row-main` (`.list-row-name.t-label`, `.list-row-sub.t-mono`) and `.list-row-end` (`.list-row-value.t-label`, `.list-row-sub.t-mono`).
- Mark the picked row `.is-selected` or `aria-current="true"`.
- A list that scrolls inside a fixed height goes in a scroll fade (`components/scroll-fade/`). A row needs `16px` of room either side for its fill.
