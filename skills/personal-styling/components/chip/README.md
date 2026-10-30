# Toggle chip

A filter pill that states its own on/off, for when several filters can be on at once.

A filter is not the nav pill — the nav has one truth at a time, filters have many. So a chip states its own on/off rather than relying on an indicator sliding between options.

| State | Fill | Ink | Dot |
|---|---|---|---|
| Off | none, hairline border | secondary | `8px` ring, `1px` border, no fill |
| On | `--color-fill-subtle` | full ink | `8px` solid, full ink |
| Disabled | none, hairline border | 30% | ring at 30% |

## Rules

- The dot is what makes the state readable without colour. Keep it.
- **36px tall, like every other control**: `8px` vertical padding, `16px` horizontal, `8px` from dot to label; fully round. A chip row sits in a row of pickers, inputs and segmented controls without breaking the line.
- Transition `background` and `color` on `--duration-fast` with plain `ease`.
- A row of chips is `8px` gaps, wrapping.
- Hover brightens an off chip's ink to full; an on chip's fill deepens from 4% to 8%.
- On is state, so it takes `--color-fill-subtle`. Never the accent.

## Use

- Each chip is a `<button>` with `aria-pressed`. Put the row in a `role="group"` with an `aria-label` that names what it filters.
- `chip.js` toggles `aria-pressed` and fires a bubbling `chip-change` event with `detail.on`. Listen for it on the row.

## Changes in v0.4.0

- 36px tall (was 28px), the height the segmented control, picker, input and compact button share.

## Changes in v0.3.0

- On touch, a chip presses in to `--scale-tap` (0.97) as its ink brightens.

## Changes in v0.2.0

- On touch screens the hover response plays while the finger is down — the native tap flash is gone.

