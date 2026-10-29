# Control panel

The controls of a tool, gathered into one collapsible surface directly under the intro.

Requires: accordion, segmented, picker, chip, slider, button

## Rules

- **Second in the page hierarchy.** It sits `24px` under the artifact intro, before the content it changes.
- **One accordion item in the one surface style.** The whole heading row is the trigger, the chevron is at the far edge, and collapsing hides the body without removing the heading.
- **The persistent shadow is the exception.** The panel carries `--shadow-rest` at rest and keeps it, to put the controls on a layer above the content. It's the only surface whose shadow doesn't mean "this lifts", so it never lifts on hover.
- **The title is mono — the one documented exception** to the rule against mono labels. It reads as a quiet container label rather than a primary action. Keep it terse and singular: "Controls", "Filters".
- **Field labels inside stay Label.** Controls stay Interactive. Mono is spent once, on the title.
- **Fields flow in columns** of at least `240px`, `16px` apart, wrapping as the panel narrows. Each field is its label, `8px`, then its control.
- **Only controls go in.** A table or chart the controls change goes under the panel, on the page.
- Open by default. Collapse it when the controls are set-and-forget and the content needs the room.

## Use

- Swap the fields for the tool's own. Each needs a unique `id` and a label wired to its control (`aria-labelledby`, or `for` on a `<label>`).
- Wrap a segmented control or chip row in `.control-field`. The picker and slider bring their own field wrappers (`.picker-field`, `.slider-field`).
- Load the CSS and JS of every component inside it, plus `accordion.js`.
