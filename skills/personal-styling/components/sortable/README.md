# Sortable list

A short list whose order is the user's to set — priorities, steps, a queue — moved by picking an item up and dropping it somewhere else.

## Rules

- **Each item is a thing you can pick up, so it sits on the surface.** The one surface style with the rest shadow, `16px` apart — rows are 16 apart. One line is under `--pill-below`, so a pill; an item that wraps keeps the `20px` card radius. `sortable.js` measures.
- **A row holds a name and, if it has one, a value.** The name is Label (or Body for a sentence); the value is mono, at the far edge. The whole row is what you grab.
- **The grip is optional.** Six dots at `--icon-inline`, `8px` before the name, waiting at secondary ink. Add it when a row is long or touch matters: a finger drags from the grip at once instead of after a long press. Leave it off and the row looks like any other row.
- **The cursor says what's happening.** The open hand (`grab`) over a row; the closed hand (`grabbing`) from the moment it's pressed until it's let go, wherever the pointer strays.
- **Hover lifts the row** to `--shadow-lift` and brings a grip to full ink. On touch it plays while the finger is down.
- **Picking up takes three beats.**
  1. *Press* — the item gives to `--scale-tap` on `--duration-fast`, already lifted.
  2. *Lift* — once it moves, it springs past its size to `--scale-lift` (1.03) and rises to `--shadow-media` on `--duration-pop`. The one scale above 1: held, it comes towards you.
  3. *Carry* — it follows the pointer 1:1 up and down, with resistance past either end and sideways, and leans up to 3° into a sideways move, easing back when the pointer stops.
- **The rest of the list makes room.** The others settle flat — hairline only — so the held item is the only thing with depth, and glide out of its way on `--duration-base`: rows are dense targets. An empty hairline slot marks where it will land.
- **Dropping is the lift in reverse.** It glides into the slot, back to its size and the rest shadow, on `--duration-pop`. Escape, or a cancelled touch, sends it home the same way.
- **Touch never steals the scroll.** A row picks up after a `--duration-base` long press, and a finger that moves first is scrolling. A grip, if there is one, drags at once. Phones that can buzz give a tick on pick-up, on each new place and on the drop.
- **The page scrolls itself** when the held item reaches the top or bottom `48px` of the window.
- **The keyboard has the same moves.** Tab to the row (or its grip, when it has one); Space or Enter picks up, the arrows move a place at a time (Home and End to the ends), Space or Enter drops, Escape puts it back. Each move is announced.
- **Reduced motion keeps the shadow, not the scale or the lean.**

## Use

- `ul.sortable` › `li.sortable-item` › `.sortable-label` and an optional `.sortable-meta`. For a grip, put `button.sortable-handle` (the six-dot SVG) first in the row. Give the list an `aria-label` and each item a `data-id`.
- Without a grip, `sortable.js` makes each row focusable. With one, it names the grip "Move <label>" unless it already has an `aria-label`. Either way it adds the instructions and a live region after the list.
- It fires a bubbling `sortable-change` event with `detail.from`, `detail.to`, `detail.item` and `detail.order` (the `data-id`s in their new order).
- Controls inside a row — a link, a button other than the grip — keep their own clicks and don't start a drag.
- For a list of more than a dozen or so, or one with more than one value per row, it's a table, not this.
- Needs `--scale-lift` from `tokens.css` v0.10.

## Changes in v0.2.1

- Rows added after `sortable.js` runs reorder correctly: a drop into the last place no longer lands at the top.

## Changes in v0.2.0

- The grip is optional, and off in the shipped markup. Without one, the row takes focus and a finger picks up with a long press.
- The cursor closes to `grabbing` the moment a row is pressed, not once it moves, and holds until release even off the item.
