# Control panel

The controls of a tool, gathered into one collapsible surface directly under the intro.

Requires: accordion, segmented, picker, chip, slider, button

## Rules

- **Second in the page hierarchy.** It sits `24px` under the artifact intro, before the content it changes.
- **A card when open, a pill when collapsed, morphing between.** Collapsed, the panel is one row — just its heading — so it takes the pill shape of the buttons and pickers inside it. The corner animates with the height, from `--radius-card` (20px) to `--radius-row` (30px, half of `--pill-below`), on the accordion's `--duration-entrance` and `--ease-out`, so the shape changes continuously as it opens and closes.
- **One accordion item in the one surface style.** The whole heading row is the trigger, the chevron is at the far edge, and collapsing hides the body without removing the heading.
- **The persistent shadow is the exception.** The panel carries `--shadow-rest` at rest and keeps it, to put the controls on a layer above the content. It's the only surface whose shadow doesn't mean "this lifts", so it never lifts on hover.
- **The title is mono — the one documented exception** to the rule against mono labels. It reads as a quiet container label rather than a primary action. Keep it terse and singular: "Controls", "Filters".
- **Field labels inside stay Label.** Controls stay Interactive. Mono is spent once, on the title.
- **Fields flow in columns** of at least `240px`, `16px` apart, wrapping as the panel narrows. Each field is its label, `8px`, then its control.
- **Only controls go in.** A table or chart the controls change goes under or beside the panel, on the page. A contents list counts: it's a control that moves you through the page.

## Docked

`.control-panel--docked` puts the panel beside the content instead of above it. Use it when the controls stay in use while the content scrolls, or for a long page's contents list.

- **Docking changes where it sits, not what it is.** The same surface, persistent shadow, mono title and pill-to-card corner as the panel above a tool — so it reads as the control layer, not as part of the content beside it.
- **A `280px` column** (the tooltip's width), `24px` from the content — a card's distance. It stays in view while the page scrolls, the page inset from the top.
- **Wrap the content and the panel in `.control-dock`.** The content takes the room; the panel takes the column. Fields inside stack in one column.
- **Keep its content shorter than the screen.** On wide screens it doesn't scroll inside itself, so a picker menu in it can open past its edge.
- **On narrow screens it floats bottom right**, the page inset from both edges, as a pill only as wide as its label. Tapping it grows it upward into a card, and the chevron points up while closed, because that's the way it opens. Start it closed there with `data-closed-below="630"` on the accordion item.
- **A contents list is a segmented list** (`.segmented--list`) inside a docked panel: one section is current at a time, so it takes the gliding fill, not an ink change.
- Open by default. Collapse it when the controls are set-and-forget and the content needs the room.

## Use

- Swap the fields for the tool's own. Each needs a unique `id` and a label wired to its control (`aria-labelledby`, or `for` on a `<label>`).
- Wrap a segmented control or chip row in `.control-field`. The picker and slider bring their own field wrappers (`.picker-field`, `.slider-field`).
- Load the CSS and JS of every component inside it, plus `accordion.js`.

## Changes in v0.6.0

- The heading row is pinned to `--height-row`, so a collapsed panel is exactly 50px — the height of a large button.

## Changes in v0.5.0

- The docked panel is a surface with the persistent shadow, like the panel above a tool, instead of sitting on the page with a divider. It sits `24px` from the content.

## Changes in v0.4.0

- Docked variant: beside the content on wide screens, a floating pill bottom right on narrow ones.

## Changes in v0.3.0

- The corner animates between card and pill as the panel opens and closes, instead of switching when the collapse finishes.
