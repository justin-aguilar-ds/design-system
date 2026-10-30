# Control panel

The controls of a tool, gathered into one collapsible surface directly under the intro.

Requires: accordion, segmented, picker, chip, slider, button

## Rules

- **Second in the page hierarchy.** It sits `24px` under the artifact intro, before the content it changes.
- **A card when open, a pill when collapsed, morphing between.** Collapsed, the panel is one row — just its heading — so it takes the pill shape of the buttons and pickers inside it. The corner animates with the height, from `--radius-card` (20px) to `--radius-row` (30px, half of `--pill-below`), on the accordion's `--duration-entrance` and `--ease-out`, so the shape changes continuously as it opens and closes.
- **One accordion item in the one surface style.** The whole heading row is the trigger, the chevron is at the far edge, and collapsing hides the body without removing the heading.
- **The persistent shadow is the exception.** The panel carries `--shadow-rest` at rest and keeps it, to put the controls on a layer above the content. It's the only surface whose shadow doesn't mean "this lifts", so it never lifts on hover.
- **The title is mono — the one documented exception** to the rule against mono labels. It reads as a quiet container label rather than a primary action. Keep it terse and singular: "Controls", "Filters".
- **Field labels follow the label rules in SKILL.md.** Drop a label when the control names itself — chips reading Equities / Options, a period reading 1W / 1M / YTD — and keep it when the value alone is ambiguous: a number, a slider, an on/off pair. All the fields are labelled or none are; with none, put the controls in `.field-row` instead of `.control-panel-fields`, so they sit on one line. Labels that stay are Label; mono is spent once, on the title.
- **Fields flow in columns** of at least `240px`, `16px` apart, wrapping as the panel narrows. Each field is its label, `8px`, then its control.
- **Only controls go in.** A table or chart the controls change goes under or beside the panel, on the page. A contents list counts: it's a control that moves you through the page.

## Docked

`.control-panel--docked` docks the panel to the bottom-right corner instead of putting it above the content. Use it when the controls stay in use while the content scrolls, or for a long page's contents list.

- **Docked to the corner at every width, never a second column.** The content keeps the whole page; the panel floats over it, the page inset from the bottom and right edges. A two-column layout halves the content to hold a handful of controls, and stacks badly on phones; the corner works the same everywhere.
- **Docking changes where it sits, not what it is.** The same surface, persistent shadow, mono title and pill-to-card corner as the panel above a tool.
- **Closed, a pill only as wide as its label; open, a `280px` card** (the tooltip's width) that grows upward from the corner. The chevron points up while closed, because that's the way it opens. It opens by default on wide screens; start it closed on phones with `data-closed-below="630"` on the accordion item.
- **Taller than the screen, it scrolls inside itself.** Fields stack in one column.
- **If the page has a large button**, which pins itself to the bottom edge on phones, the panel rises `16px` above it.
- **A contents list is a segmented list** (`.segmented--list`) inside a docked panel: one section is current at a time, so it takes the gliding fill, not an ink change.
- Keep the content clear of the corner where it matters: the open card covers the bottom right of whatever scrolls under it.
- `.control-dock` can stay as a wrapper around the content and the panel; it no longer lays anything out.

## Use

- Swap the fields for the tool's own. Each needs a unique `id` and a label wired to its control (`aria-labelledby`, or `for` on a `<label>`).
- Wrap a segmented control or chip row in `.control-field`. The picker and slider bring their own field wrappers (`.picker-field`, `.slider-field`).
- Load the CSS and JS of every component inside it, plus `accordion.js`.

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
