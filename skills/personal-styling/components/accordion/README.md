# Accordion

Sections that open and close under a heading row, for content worth having but not worth showing all at once.

## Rules

- **A set of sections is a list, so it sits on the page** with dividers between items. No card around it. The one exception is the control panel, where a single item sits in a surface (see `patterns/control-panel/`).
- **The whole heading row is the trigger.** Title on the left, chevron at the far edge. A real `<button>` with `aria-expanded` and `aria-controls`, inside a heading.
- **The title takes the context's type role.** Label on the page; mono inside a control panel, as that pattern's one documented exception.
- **The panel opens to its content's real height** over `--duration-entrance` (500ms) on `--ease-out`, fading in as it goes — a container appearing. It closes the same way. The heading never moves or disappears.
- **The chevron turns 180°** over `--duration-base` on `--ease-out`, the same as the picker's.
- **Hover brightens the row to full ink**, chevron included. No background change.
- **Closed panels are inert**: their controls leave the tab order and the accessibility tree.
- **Independent by default.** Any number of items can be open. `data-accordion="single"` on the group keeps one open at a time — use it only when the sections are alternatives, not when someone might want to compare two.

## Use

- Each item: `.accordion-item` › heading › `.accordion-trigger`, then `.accordion-panel` › `.accordion-content` › `.accordion-body`. Keep all three panel layers: the middle one clips during the motion, and the inner one carries the padding.
- Start an item open with `.is-open` and `aria-expanded="true"`; start it closed with `aria-expanded="false"` and `inert` on the panel.
- Give every trigger and panel a unique `id` pair.
- `data-closed-below="630"` on an item starts it closed on screens 630px wide or narrower, whatever its markup says.
- `accordion.js` fires a bubbling `accordion-toggle` event with `detail.open`.
- Once a panel has finished opening it stops clipping (`.is-settled`), so a picker menu or tooltip inside it isn't cut off. Once it has finished closing the item gets `.is-collapsed`, so a container can change shape at a moment its height is final.

## Changes in v0.5.0

- On touch screens the hover response plays while the finger is down — the native tap flash is gone.

## Changes in v0.4.0

- Its glyph is sized by the icon tokens (`--icon-mark` / `--icon-inline`) instead of a fixed number.
