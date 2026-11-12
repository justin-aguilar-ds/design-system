# Carousel

One piece of content at a time — a project, a photo, a video — centred, with its caption, moved by drag, swipe, trackpad or arrow keys.

Requires: tooltip

From the source site's project carousel.

## Rules

- **One item at a time, centred.** The ones beside it wait at `--scale-inactive` (0.8) and `--opacity-inactive` (0.2), out of view; only the centred item can be focused or clicked.
- **It settles slowly.** The track and the frames glide on `--duration-carousel` (1200ms) with `--ease-out` — the main object settling, the slowest motion in the system. Input waits until it has.
- **Drag is 1:1.** The track follows the pointer with no transition, and the centred item and its neighbours scale and fade with it. Release past 40% of the width, or with a flick, and it moves on; otherwise it springs back.
- **Resized from outside, it follows and doesn't settle.** When a panel opens beside it or a screen splits around it, the centred item stays centred on every frame of the move: no glide toward a width that is still changing. Whatever resizes it owns the motion; the carousel only keeps up, and re-centres for good once its size has stopped changing. Sub-pixel movement at the end of an ease-out is still movement.
- **It never takes the page's scroll.** Only horizontal trackpad and wheel movement moves it; a vertical swipe or scroll still scrolls the page. Arrow keys work while it has focus.
- **The item always has lift.** The frame is the one surface style — `20px` radius, the hairline — with `--shadow-lift` at all times, not only on hover: it's the object you pick up and move, so it stays raised. Empty or still loading, it's the bare surface. The viewport clips sideways only, so the shadow is never cut off.
- **The caption is one unit under the item:** a title in Label and a value — a year, a date — in mono, `8px` apart, `16px` below the frame. When the item changes it drops `16px` and fades, swaps its words while hidden, then rises back in, on `--duration-base`.
- **A video plays from the start** each time its slide arrives — autoplay, muted, looping, inline.
- **"Learn more" is the tooltip component.** `data-cursor` gives the frame the cursor pill; `data-tooltip-drop` drops the description where it's tapped. A drag never drops one, and moving to another item closes it.

## Use

- Each item is an `<li class="carousel-item">` with `data-title` and `data-meta` for the caption, holding a `<button class="carousel-frame">` around an `<img>` or `<video autoplay muted loop playsinline>`. Mark the first item `.is-active`.
- Change an item's shape with `--item-aspect-ratio` (default `4 / 5`) and `--item-width` (default `min(360px, 70%)`) on its frame.
- Give the carousel an `aria-label`; `carousel.js` labels each slide "2 of 5" and the caption announces itself when it changes.
- `carousel.js` fires a bubbling `carousel-change` event with `detail.index` and `detail.item`.
- `data-loop` makes it a circle (three items or more). `data-edges="open"` drops the clip and fades the neighbours out. Dispatch `carousel-set` with `detail.step` or `detail.index` to move it from your own controls.
- Load `tooltip.css` and `tooltip.js` for the cursor pill and the dropped description; without them it's a plain carousel.

## Changes in v0.5.0

- `data-frame="bare"`: no surface, hairline or shadow, for views on a stage.

## Changes in v0.4.0

- A size-driven resize hold. While its container resizes it (a panel opening beside it, a stage and sheet splitting), the track follows the width with no settle and the frames hold their scale. The hold releases after two animation frames with no change in size, never on a timer.

## Changes in v0.3.0

- `data-loop` on the carousel makes it a circle: past the last item is the first, and back from the first is the last, by drag, wheel or arrow key. It needs three items or more. Slide numbers and `detail.index` keep the authored order.
- The caption is optional: leave `.carousel-caption` out when the items name themselves.
- `data-frame="bare"`: views on a stage rather than objects on a page. The frame drops its surface, hairline and shadow, and neighbours don't shrink; each view slides and fades on the stage's ground, and the stage never moves. Pair it with `data-edges="open"` and stage navigation (`components/stage-nav/`) to name the views.
- `carousel-set`: move it from outside, for a page's own previous and next controls. Dispatch it on the carousel with `{ detail: { step: 1 } }` (or `-1`), or `{ detail: { index } }` in the authored order.
- `data-edges="open"`: the viewport doesn't clip and an item away from the centre fades to nothing, so there is no edge inside the page where an item is cut. For items as wide as the carousel. Something further out must end it: the page, or a scroller with `overflow-x: hidden`.

## Changes in v0.2.0

- Items always carry `--shadow-lift`, on the surface fill instead of the subtle fill.
- The viewport clips sideways only (`overflow-x: clip`), so the lift shows above and below.

## Changes from the source

- It lives in the page instead of taking over the screen, so it only answers horizontal scrolling — the source took every wheel movement on the page — and arrow keys only while it has focus.
- A tap is told apart from a drag before the pointer is captured, so a tap always reaches the tooltip.
- Neighbouring items are inert while they're out of view, and each slide is labelled for screen readers.
- The caption moves `16px`, not `20px`, to stay on the scale, and pairs a Label title with a mono year.
