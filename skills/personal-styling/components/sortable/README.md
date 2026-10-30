# Sortable list

A short list whose order is the user's to set — priorities, steps, a queue — moved by picking an item up and dropping it somewhere else.

## Rules

- **Each item is a thing you can pick up, so it sits on the surface.** The one surface style with the rest shadow, `16px` apart — rows are 16 apart. One line is under `--pill-below`, so a pill; an item that wraps keeps the `20px` card radius. `sortable.js` measures.
- **A row holds a grip, a name and, if it has one, a value.** The grip is six dots at `--icon-inline`, `8px` from the name, waiting at secondary ink. The name is Label (or Body for a sentence); the value is mono, at the far edge.
- **Hover lifts the row** to `--shadow-lift` and brings the grip to full ink. On touch it plays while the finger is down.
- **Picking up takes three beats.**
  1. *Press* — the item gives to `--scale-tap` on `--duration-fast`, already lifted.
  2. *Lift* — once it moves, it springs past its size to `--scale-lift` (1.03) and rises to `--shadow-media` on `--duration-pop`. The one scale above 1: held, it comes towards you.
  3. *Carry* — it follows the pointer 1:1 up and down, with resistance past either end and sideways, and leans up to 3° into a sideways move, easing back when the pointer stops.
- **The rest of the list makes room.** The others settle flat — hairline only — so the held item is the only thing with depth, and glide out of its way on `--duration-base`: rows are dense targets. An empty hairline slot marks where it will land.
- **Dropping is the lift in reverse.** It glides into the slot, back to its size and the rest shadow, on `--duration-pop`. Escape, or a cancelled touch, sends it home the same way.
- **Touch never steals the scroll.** The grip drags at once; anywhere else on the row picks up after a `--duration-base` long press, and a finger that moves first is scrolling. Phones that can buzz give a tick on pick-up, on each new place and on the drop.
- **The page scrolls itself** when the held item reaches the top or bottom `48px` of the window.
- **The keyboard has the same moves.** Tab to a grip; Space or Enter picks up, the arrows move a place at a time (Home and End to the ends), Space or Enter drops, Escape puts it back. Each move is announced.
- **Reduced motion keeps the shadow, not the scale or the lean.**

## Use

- `ul.sortable` › `li.sortable-item` › `button.sortable-handle` (the grip SVG), `.sortable-label`, and an optional `.sortable-meta`. Give the list an `aria-label` and each item a `data-id`.
- `sortable.js` names each grip "Move <label>" unless it already has an `aria-label`, and adds the instructions and a live region after the list.
- It fires a bubbling `sortable-change` event with `detail.from`, `detail.to`, `detail.item` and `detail.order` (the `data-id`s in their new order).
- Controls inside a row — a link, a button other than the grip — keep their own clicks and don't start a drag.
- For a list of more than a dozen or so, or one with more than one value per row, it's a table, not this.
- Needs `--scale-lift` from `tokens.css` v0.10.
