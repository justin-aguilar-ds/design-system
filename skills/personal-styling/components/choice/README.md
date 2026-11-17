# Choice

A checkbox or a radio: a small round mark beside a line of text, for a choice that needs its own sentence.

| | Off | On |
|---|---|---|
| Checkbox | a ring | filled with ink, a check in the ground colour |
| Radio | a ring | the ring, a solid `8px` dot |
| Label | secondary | full ink |

## Rules

- **Both marks are a `16px` circle.** The system has no small corner, so there is no square checkbox. `16px` is the height of the slider's and the switch's track: every small control is one size. What tells the two apart is the fill: a checkbox fills and takes a check, a radio keeps its ring and takes a dot.
- **The mark ends its row, on the right, wherever it can.** A choice fills its line: the label leads on the left and the mark sits at the right end, at least `16px` from the label, so a column of choices has one line of marks down its right edge. The label is Body; secondary when off, full ink when on, like a chip.
- **Keep the column narrow enough to read across.** A mark a long way from its label is hard to pair with it: put a group in a panel, a sheet, a card or one column of the grid, not across the full reading width.
- **Each choice is a `36px` row** (`--height-control`), stacked with nothing between, so a column of them has a control's rhythm and a finger has room. The whole row is the target.
- **State without colour.** Ink and a glyph. Never the accent.
- **Checkbox, chip or switch.** Short filters on one line are chips (`components/chip/`). A setting that acts at once is a switch (`components/switch/`). A checkbox is for a choice with a sentence to it, or one that waits for a button: a list to tick off, terms to accept.
- **Radio or segmented control.** A few short options are a segmented control (`components/segmented/`). Radios are for options that each need a full line. More than five or six, a picker (`components/picker/`).
- **A group has a name.** `fieldset.choice-group` with a `legend` in Label, `8px` above the first choice. Under a heading that already names it, drop the legend and give the fieldset an `aria-label`.
- **In a control panel**, a lone checkbox is a bare mark at the end of its row, named by the panel's mono label; a group goes under its label, across the panel (`.field--wide`).
- **Hover brightens** the label and its ring to full ink. On touch the mark presses to `--scale-press`.
- **The check and the dot pop in** from `0` on `--duration-base` with `--ease-out`.
- **Focus is on the mark:** the system's full-ink outline, `2px` off it.

## Use

- `<label class="choice t-body">` › `<input class="choice-input" type="checkbox">` (or `type="radio"`), then `.choice-mark` holding the check (`svg.choice-check`) or the dot (`span.choice-dot`), then the text.
- Radios in one group share a `name`.
- A bare mark has no text; give the input `aria-label` or `aria-labelledby`.
- Listen for the inputs' own `change` events.
- No JavaScript.

## Changes in v0.3.0

- A checkbox's ink is a disc that grows with its check on the spring, instead of a fill that fades; the check and a radio's dot pop in on it and leave on the ease. A touch press springs back on the spring.

## Changes in v0.2.0

- A choice fills its line and the mark ends it, on the right, with the label leading.
