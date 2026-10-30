# Icon button

An icon alone as a control — back, more, share, close — in two treatments: lifted, or on the quiet fill.

## Rules

- **Two treatments, like the button.** **Primary** is the lifted surface: white, hairline, rest shadow, lifting on hover — use it for the control a screen leans on, such as back. **Secondary** sits on the quiet fill (`--color-fill-quiet`): no edge, no shadow, the fill deepening on hover — use it for everything else in the cluster. Two treatments in a cluster at most.
- **A 40px circle**, the visual and the touch target. `.icon-button--large` is `--height-row` (50px), the height of a large button, for a phone's top bar.
- **The icon is 20px** (`--icon-control`), full ink, a `1.5px` stroke with round caps and joins, outlined rather than filled — a dot is the only filled shape.
- **An icon alone needs a name.** Every icon button takes an `aria-label`. If the icon isn't instantly clear, it isn't the right control — use a button with a label.
- **The quiet fill is never a container and never state.** It's the surface of a secondary control. A selected icon button takes `--color-fill-subtle`, the same as every other selection.
- **Disabled** drops to 30% and loses its shadow.

## Use

- Primary: `<button class="icon-button surface surface--rest surface--pill" aria-label="…">` with an `<svg class="icon" viewBox="0 0 20 20">` inside.
- Secondary: `<button class="icon-button icon-button--secondary" aria-label="…">`.
- Draw icons on a viewBox the size they render (`0 0 20 20` here), `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, round caps and joins.
- No JavaScript.
