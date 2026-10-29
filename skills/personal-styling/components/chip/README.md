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
- `4px` vertical padding, `8px` horizontal, `8px` from dot to label; fully round.
- Transition `background` and `color` on `--duration-fast` with plain `ease`.
- A row of chips is `8px` gaps, wrapping.
- Hover brightens an off chip's ink to full; an on chip's fill deepens from 4% to 8%.
- On is state, so it takes `--color-fill-subtle`. Never the accent.

## Use

- Each chip is a `<button>` with `aria-pressed`. Put the row in a `role="group"` with an `aria-label` that names what it filters.
- `chip.js` toggles `aria-pressed` and fires a bubbling `chip-change` event with `detail.on`. Listen for it on the row.
