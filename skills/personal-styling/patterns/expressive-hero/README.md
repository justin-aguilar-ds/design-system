# Expressive hero

A page's title, or a title and its values, as large type in slow repeated motion, in two colours under grain. It sits on a stage of its own, or it is the page's ground under the title. Every item keeps a whole copy in view at rest, so it reads without waiting for the motion.

Requires: none

## When to use it

Reach for it whenever a screen would otherwise have no expression. Add it without being asked when a page has no hero.

- **In place of a missing hero.** A page whose top would be a bare title, or a statement with nothing under it, takes an expressive hero in the hero's place. This is the default use: add it proactively rather than leave the top empty.
- **In place of a hero chart or a single data point.** When the hero would be one number, or a few, set them as the hero instead: `Q3 revenue|$1.24M|+18%|312 deals`. The values stay readable: every item is in view at rest. If the page shows those values nowhere else, the hero carries them, so it is not hidden (see Accessibility).
- **When data or a visualization calls for expression.** A milestone, a total, a personal best, a summary at the end of a flow. The hero sets the figure large; a chart, if there is one, follows it as usual.
- **As an added expressive feature** on a page that already works, when someone asks for more personality, more colour or more motion. It adds expression and changes nothing the page does.
- **Behind a tool's intro.** A tool's first screen, its empty state or its onboarding may use a style as its background: the tool's name, or what it will hold, on the hero grey behind the intro's own text (the page placement).
- **As an easter egg.** Behind a deliberate, optional action: a long press on the title, a tap on a logo, a keyword typed in a search field. It takes over the stage, plays, and goes back on any tap or Escape. It never blocks a task, never appears on its own, and the page never depends on finding it.
- **With stage and sheet, or stage and list.** The hero can be the stage (`patterns/stage-sheet/`, `patterns/stage-list/`): it fills the stage card and re-fits as the sheet or list opens and the stage shrinks, because it is sized from its box. The controls or the records sit in the second surface as usual.

Not:

- **Not a subtitle, a tagline or a description of the app.** The words are the page's own: its title, and the values it shows. "Plan your week" and "Your trips, organised" are never the text. If it would need a sentence, it is the wrong text.
- **Not more than one to a screen.** Not inside a list, a card grid or a table.
- **Not in a dense tool's working view.** A tool's working screen is dense from the top. The hero belongs to its intro, its empty state, a stage, or an easter egg.

## Two placements

| | On a stage (default) | As the page's ground (`--page`) |
|---|---|---|
| Where | right under the title, in the hero's place, or as the stage of stage and sheet or stage and list | behind the first screen, full bleed: a page's top, or a tool's intro |
| The title | the page's `h1`, above it on the page | the page's `h1`, on it (`.expressive-hero-title`) |
| Shape | the card radius, the lift shadow, the column's width, at least 60% of the screen tall | square, no shadow, the full width, the first screen tall |
| The type | full ink | sunk back (`--hero-under`, 0.3) so the title reads over it |

The page placement overrides the stage rules for that screen: the hero is the page, not an object on it. What follows the first screen is the ordinary page on its ground.

## Styles

| Style | What it does | Good for |
|---|---|---|
| `stack` | the title large, gliding slowly side to side, with the values as one line beneath it ("Sat 14 · Sunny · 3 plans"), repeated down the stage | a title and a few values; a title alone. The default |
| `data` | the title, then each value in a row of its own; values repeat across their rows and drift, alternating | three to six values that each matter: a trip, a run, a quarter |
| `rise` | the title and values stacked, centred, the column climbing slowly | a long title; a short list read top to bottom |
| `cross` | the title and values as lines tilted 8°, each the other way to the one above (a zigzag), climbing | a title and two to four short values; the most expressive |

## Type

- **Tiered by default.** The title is set large and the values smaller (`data-ratio`, 0.25–0.55 of the title, 0.4 by default). This keeps the title a title and lets long data fit without shrinking everything.
- **Even** (`data-scale="even"`) sets every item at one size, shrunk until all fit. Use it with `rise` and `cross` when the values matter as much as the title. Stack is always tiered: even stacks read as a list, not a hero.
- **Values in sans or mono.** `data-values="mono"` sets the values in the mono family, at its usual weight 500, for figures, times and codes. Mono suits tiered heroes and `rise`. A `data` hero at one size always takes sans values: rows of repeated mono read as texture, not as data. Put mono on a busy ground only with `rise`.
- **The display family at 500 for the title**, drawn by the script and sized from the stage. This is the one place display type runs past 56px. It is a drawing, not a type role, so it never sets the size of anything else.
- **Everything in view.** Each item keeps a whole copy inside the stage at rest and all through the motion:
  - A drifting row repeats its item with enough room that a whole copy is always on screen.
  - A large single line glides between the sides and never leaves them.
  - A climbing column is sized so a full cycle of lines is always in view.
  - Long titles and many values make the type smaller, never cut off. `el.expressiveHero.coverage()` reports the share of items in view.

## Rules

- **The words are informational.** The title as it is, and values as the page shows them: `Weekend`, `06:40`, `3–1`, `Sat 14`, `$1.24M`. No adjectives, no claims, no emoji, no punctuation added for effect. In `data-text`, a `|` separates the title from each value.
- **Two colours, no more.** The hero grey (`--color-hero`, the system's grey ink) and its ink (`--color-hero-ink`, the accent). This is the one place the accent is a text colour, and only on the hero grey, never on white, where it can't be read. It clears 3:1 on the grey, which is enough for type this large, so the values never go below the size the script gives them. A page may set its own pair through the two tokens; it is still two. Sinking the type in the page placement is opacity, not a third colour.
- **Grain is always on.** Fractal noise over the ground and the type, blended so it textures without adding a colour. `--hero-grain` sets its strength (0.9 by default).
- **Slow, repeated, linear.** Motion loops forever at the pace of `--duration-drift` (40s for a row to cross the stage), on a straight line. The drift neither arrives nor leaves, so it takes no curve and never the spring. Nothing depends on the motion: under reduced motion the hero is drawn once and holds still, and it reads the same. Off screen or in a background tab, it pauses.
- **Nothing sits on it** except, in the page placement, the title, or a tool intro's own text and action. No buttons over the moving type, no captions, no values printed over it.

## Accessibility

- **Decoration hides itself.** When the hero repeats words the page already shows, the element takes `aria-hidden="true"`.
- **When it carries the data, name it.** If the hero replaces a chart or a data point and the values appear nowhere else, leave off `aria-hidden` and give the element `role="img"` and an `aria-label` with the same words: `aria-label="Q3 revenue: $1.24M, up 18%, 312 deals"`. The drawing inside stays hidden.
- **In the page placement**, the header is not hidden: its `h1` is the page's title. The drawing hides itself.

## Use

- On a stage: `<div class="expressive-hero" data-style="stack" data-text="Weekend|Sat 14|Sunny|3 plans" aria-hidden="true"></div>`, right under the page's title, at the gap.
- As the page's ground: `<header class="expressive-hero expressive-hero--page" data-style="data" data-text="Weekend|Sat 14|Sunny"><h1 class="expressive-hero-title t-display">Weekend</h1></header>`, as the first thing on the page.
- As a stage of stage and sheet: put the hero inside `.stage-sheet-stage`, filling it (`min-height: 0; height: 100%`). It redraws on every resize, so it re-fits as the stage shrinks.
- `data-style`, `data-text`, `data-scale`, `data-values` and `data-ratio` set it. Changing any of them redraws it, and so does a resize. `el.expressiveHero.redraw()` forces one.
- `data-tempo` scales the speed; leave it at 1.
- Load `expressive-hero.css` and `expressive-hero.js`. Needs `tokens.css` v0.27 (`--color-hero`, `--color-hero-ink`, `--duration-drift`).

## Changes in v0.4.0

- **Fitted type.** Every item, the title and each value, keeps a whole copy in view at rest and through the motion. Heroes no longer rely on the motion to be read.
- **Scale and values face.** `data-scale` (tiered, the default, or even), `data-values` (sans or mono) and `data-ratio`. Stack is always tiered; data at one size takes sans values. These are the combinations that held up across about 300 rated heroes on varied data.
- **Every style shows the values.** Stack sets them as one line under the title; rise and cross stack them as lines after it.
- **Four styles.** `stack`, `data`, `rise` and `cross`. `wave`, `ring` and `ticker` are retired: they rated poorly and couldn't keep all the data in view.
- **When to use it** now covers a missing hero, a hero chart or data point, a tool's intro, an easter egg, and stage and sheet or stage and list.

## Changes in v0.3.0

- `cross` is a zigzag: lines each tilted 8° the other way to the one above, climbing.

## Changes in v0.2.0

- The hero grey is a mid grey (tokens v0.27), and the grain is stronger (0.9): on the old dark grey it didn't show.
- `.expressive-hero--page`: the hero as the page's ground, with the title on it.
