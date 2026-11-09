# Control panel

The controls of a tool, gathered into one collapsible surface directly under the intro.

Requires: accordion, segmented, picker, chip, slider, button

## Rules

- **Second in the page hierarchy.** It sits `24px` under the artifact intro, before the content it changes.
- **A card when open, a pill when collapsed, morphing between.** Collapsed, the panel is one row — just its heading — so it takes the pill shape of the buttons and pickers inside it. The corner animates with the height, from `--radius-card` (20px) to `--radius-row` (30px, half of `--pill-below`), on the accordion's `--duration-entrance` and `--ease-out`, so the shape changes continuously as it opens and closes.
- **One accordion item in the one surface style.** The whole heading row is the trigger, the chevron is at the far edge, and collapsing hides the body without removing the heading.
- **The persistent shadow is the exception.** The panel carries `--shadow-rest` at rest and keeps it, to put the controls on a layer above the content. It's the only surface whose shadow doesn't mean "this lifts", so it never lifts on hover.
- **The title is mono**, and so are the field labels: inside a panel, mono is the quiet voice for names, so the controls carry the weight. Keep the title terse and singular: "Controls", "Filters".
- **Field labels follow the label rules in SKILL.md.** Drop a label when the control names itself — chips reading Equities / Options, a period reading 1W / 1M / YTD — and keep it when the value alone is ambiguous: a number, a slider, an on/off pair. All the fields are labelled or none are; with none, put the controls in `.field-row` instead of `.control-panel-fields`, so they sit on one line. Labels that stay are mono (see above).
- **Fields are divided.** A divider between fields, `16px` either side, so a long panel reads as a list with a rhythm; the first row has none.
- **Each field is a row by default: the mono label on the left, the control on the right.** Every row shares two columns: the labels, then the controls. The control column is as wide as `--control-max` (`200px`), or what the panel can spare, and every control fills it: segments share it equally, a select runs across it with its chevron at the far end, a slider's track spans it. So every control starts and ends on the same lines, whatever its label. A long label wraps onto a second line; the control never drops under it.
- **A control too wide for the column goes under its label.** Four or more segments, a chip row (a set of toggles reads best on one line), or any field marked `.field--wide`, span both columns, the control `8px` under its label at the panel's full width. Left in the column, one wide control would widen the column for every row. In a `280px` panel (docked, or a sheet on a wide screen) there's room for a label of about 50px beside a control of about 180px; a field with a longer label or a wider control takes `.field--wide`. Keep the words short: a panel is controls, not text.
- **A slider's value is a tooltip.** It rides above the thumb while the slider is hovered, focused or dragged (see the slider), so the track can span the control column like everything else. A value printed beside the label or at the end of the track pushes the track out of line.
- **Fields follow the grid.** On a wide screen a panel above a tool lays its fields three across, `24px` apart, never more, each its label beside its control; on a phone and when docked, one column.
- **Two field styles.** Inline (the default): the label left, the control right at the max width — for a narrow panel, a docked one, a sheet, a phone, and three across on a wide screen. `.control-panel--full`: the label above, the control the full width of its column — segments share it equally, a select runs edge to edge with its chevron at the far end — for a wide panel whose controls should line up as columns. One style per panel.
- **Only controls go in.** A table or chart the controls change goes under or beside the panel, on the page. A contents list counts: it's a control that moves you through the page.

## Docked

`.control-panel--docked` docks the panel to the bottom-right corner instead of putting it above the content. Use it when the controls stay in use while the content scrolls, or for a long page's contents list.

- **Docked to the corner at every width, never a second column.** The content keeps the whole page; the panel floats over it, the page inset from the bottom and right edges. A two-column layout halves the content to hold a handful of controls, and stacks badly on phones; the corner works the same everywhere.
- **Docking changes where it sits, not what it is.** The same surface, persistent shadow, mono title and pill-to-card corner as the panel above a tool.
- **Closed, a pill only as wide as its label; open, a `280px` card** (the tooltip's width) that grows upward from the corner. The chevron points up while closed, because that's the way it opens. It opens by default on wide screens; start it closed on phones with `data-closed-below="630"` on the accordion item.
- **Taller than the screen, it scrolls inside itself.** Fields stack in one column.
- **On a phone, when the controls change something you need to watch** (a canvas, a preview), the docked panel would cover it. Use the stage and sheet pattern instead (`patterns/stage-sheet/`): opening the controls splits the screen into two surfaces, so the work stays in view.
- **If the page has a large button or a bottom slot**, which sit at the bottom edge on phones, the panel rises `16px` above it.
- **A contents list is a segmented list** (`.segmented--list`) inside a docked panel: one section is current at a time, so it takes the gliding fill, not an ink change.
- Keep the content clear of the corner where it matters: the open card covers the bottom right of whatever scrolls under it.
- `.control-dock` can stay as a wrapper around the content and the panel; it no longer lays anything out.

## Use

- Swap the fields for the tool's own. Each needs a unique `id` and a label wired to its control (`aria-labelledby`, or `for` on a `<label>`).
- Wrap a segmented control or chip row in `.control-field`: the label first, the control second. The picker and slider bring their own field wrappers (`.picker-field`, `.slider-field`). A slider is its label, then `.slider` with the `<output>` inside it, so the value is a tooltip.
- Load the CSS and JS of every component inside it, plus `accordion.js`.

## Changes in v0.14.0

- Fields share two columns, labels and controls, and every control fills the control column up to `--control-max` (200px): one set of lines down the panel. Long labels wrap instead of pushing their control under them.
- A slider sits beside its label, its track spanning the control column, its value in a tooltip on the thumb.
- Four or more segments, a chip row, or `.field--wide`, go under the label across the panel.
- Removed the stray "no dividers between fields" line, left over from v0.11; fields are divided, 16 either side.

## Changes in v0.13.0

- Dividers between fields.
- On a wide screen, fields sit three across on the grid (they flowed in 240px columns, as many as fit).
- `.control-panel--full`: labels above, controls the full width of their column, alongside the inline default.

## Changes in v0.12.0

- On phones the panel rises above the bottom slot as well as a large button, and clears their new 64px height. The collapsed panel stays 50px: it is a panel row, not part of the slot.

## Changes in v0.11.0

- Field labels are mono, and each field is a row: label left, control right, dropping underneath when it can't fit.

## Changes in v0.10.0

- The chevron beside the mono title lifts 1px, so it centres on the capitals rather than the line box.

## Changes in v0.9.0

- Docked means docked to the bottom-right corner at every width: the two-column layout on wide screens is gone.

## Changes in v0.8.0

- Labels are optional, by the label rules in SKILL.md. A panel of bare controls uses `.field-row`.
- `.control-field` moved to `tokens.css` v0.11.

## Changes in v0.7.0

- On phones, a docked panel rises above a pinned large button instead of covering it.

## Changes in v0.6.0

- The heading row is pinned to `--height-row`, so a collapsed panel is exactly 50px — the height of a large button.

## Changes in v0.5.0

- The docked panel is a surface with the persistent shadow, like the panel above a tool, instead of sitting on the page with a divider. It sits `24px` from the content.

## Changes in v0.4.0

- Docked variant: beside the content on wide screens, a floating pill bottom right on narrow ones.

## Changes in v0.3.0

- The corner animates between card and pill as the panel opens and closes, instead of switching when the collapse finishes.
