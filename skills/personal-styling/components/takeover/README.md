# Takeover

One thing, opened over everything — a record's detail, a full view of a piece — in the page's own ground, with the way back under the thumb on a phone and in the top-right corner on a wide screen.

Requires: button

From a bet tracker, where a bet opened from the list became the whole screen, and the button that opened the list became the way back.

## Rules

- **Opaque, never dimmed.** It covers the screen in `--color-bg`, like a page. A dimmed modal over a page you can half see asks you to read two things at once; a takeover is one.
- **It arrives like a large surface.** Scale from `--scale-enter` (0.95) with opacity, on `--duration-slow` (800ms) and `--ease-out`; it leaves the same way. Nothing slides in from an edge.
- **It is a page.** The title first, at display or title size, then the rest at the gap; the reading width (`--container-read`); the page's inset and block. Nothing small above the title.
- **The way back: under the thumb on a phone, the top-right corner on a wide screen.** On a phone it is a 64px round button with a chevron, bottom centre, where the bottom slot sits; if a thumb button opened it (see `patterns/stage-list/`), that same button turns into the way back instead, in the same spot. Wider than `630px` (the takeover's own width, so a contained one follows its frame) it is an X at an icon button's size, `36px`, the page inset from the top and the right: there's no thumb to keep it near, and a wide page's close sits where the eye ends the title's line. The content's foot no longer leaves room for it.
- **No click outside to close.** There is no outside. The button and Escape close it, and focus returns to what opened it.
- **One at a time, one deep.** A takeover never opens another; a second level is a sign the first should be a page.
- **Its content scrolls inside it,** under the way back, ending clear of it on a phone.

## Use

- A button with `data-takeover="<id>"` opens `.takeover#<id>`. Give the takeover `role="dialog"`, `aria-modal="true"` and `aria-labelledby` its title.
- Put the content in `.takeover-body` and the way back in `button.takeover-close` with the button's pill classes, `aria-label="Close"`, and both marks: `svg.takeover-close-back` (the chevron) and `svg.takeover-close-x` (the X). The takeover shows the one for its width.
- `.takeover--contained` takes over its positioned parent instead of the screen: a pattern that is the page, or a framed demo.
- `el.takeover.open()` and `.close()`; `.isOpen`. It fires a bubbling `takeover-toggle` event with `detail.open`, and puts `.has-takeover` on `<html>` while open.

## Changes in v0.5.0

- On a wide screen (the takeover wider than 630px) the way back is an X in the top-right corner at an icon button's size; on a phone it stays the chevron at the bottom centre. The button carries both marks and is labelled Close.

## Changes in v0.4.0

- Its icon draws at the 2 stroke.

## Changes in v0.3.0

- The fade is quick, `--duration-base`; the scale keeps the spring.

## Changes in v0.2.0

- It scales in from 0.95 on the spring, its fade with it, and leaves the same way.

