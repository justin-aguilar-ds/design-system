# Stepper

A small whole number set a step at a time — guests, copies, a quantity — as one pill holding minus, the number and plus.

## Rules

- **One pill, `36px`, on the button's surface:** the hairline, the rest shadow, the hover lift. It sits in a row with any other control.
- **The steps are bare marks, with a fill on hover.** A `10px` minus and plus (`--icon-mark`) at the centre of a square the pill's inner height (`34px`), which is the step's target. At rest there is no fill and no circle: a button inside a control is a control inside a control. On hover a quiet circle grows behind the mark, `4px` inside the square on every side — `26px` across, `4px` from the pill's top, bottom and end — the bare icon button's fill, fitted to the pill. On touch it shows while pressed, a step darker.
- **Marks are secondary ink, full ink on hover**, and give to `--scale-press` while held.
- **The number is a value someone can type:** full ink, 16px, tabular figures, three figures wide so the pill doesn't change width as it counts.
- **A step at its limit is disabled:** 30%, nothing happens. The number never leaves `data-min` to `data-max`.
- **Stepper or slider.** A count someone knows exactly, in a small range, moved by ones: a stepper. A continuous value found by feel: a slider (`components/slider/`). A number typed outright, such as a price or a year: an input (`components/input/`).
- **It hugs its number and ends its row, on the right, wherever it can.** Never stretch it across a column. In a control panel or a sheet it is on the right line of the control column; at the end of a list row it is the row's value. Under a label of its own (`.control-field`) it starts under that label.
- **The label follows the label rules:** Label, `8px` above, in `.control-field`; mono on the left in a control panel. A stepper always needs a name, because a bare number is a guess.

## Use

- `.stepper.surface.surface--rest.surface--pill` › `button.stepper-step` (minus), `input.stepper-input`, `button.stepper-step` (plus). The two buttons take `aria-label`s that say what they do to the thing counted ("Fewer", "More").
- `data-min`, `data-max` and `data-step` on `.stepper`. Without them it steps by one with no limits.
- Name the input with `aria-labelledby` (its visible label) or `aria-label`.
- `stepper.js` fires a bubbling `stepper-change` with `detail.value`. Arrow up and down step the number while the field is focused.
- Disable it with `disabled` on the input and both buttons.
- Needs the surface classes from `tokens.css`.

## Changes in v0.3.0

- A press springs back on the spring.
- The step's growing fill grows on the spring and shrinks on the ease.

## Changes in v0.2.0

- Each step is a 34px square with its mark at the centre; a quiet circle grows behind it on hover, 4px inside the pill all round. The mark used to sit 2px off where the circle would be.

