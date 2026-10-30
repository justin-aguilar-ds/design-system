---
name: personal-styling
description: House style for personal software — monochrome with one accent, five spacing steps, tight type, slow deliberate motion — plus a library of ready-made components to copy in. Use whenever building or styling any UI, page, component, artifact, dashboard or prototype for this user.
---

# Personal Styling

A distilled house style, extracted from a personal portfolio site and then deliberately tightened. The aesthetic is **monochrome with one accent, typographically flat, heavily motion-tuned**: five spacing steps, three type styles to a card, and the entire personality carried by timing and easing rather than decoration.

Everything this skill needs sits next to this file: `tokens.css`, the `components/` library and the `patterns/` that arrange them. The repository this skill lives in also builds a sandbox site that renders every component and its states.

**Start by copying `tokens.css` into the project verbatim**, then build with its tokens and type-role classes. Read on for the judgment calls the tokens can't encode.

## Start plain, then style

Build the boilerplate first: semantic HTML, default browser styles, no
tokens, no surfaces, no accent, no custom type. Get the structure and the
content right before a single styling decision exists.

Then add design only from this skill, one decision at a time, and only
when something on the page earns it:

- A second type style only when hierarchy demands it — three styles to a
  card, maximum, and usually fewer.
- A surface only when the thing inside is content, never to group a list.
- The accent only for the one thing that needs the eye.
- A shadow only on something that lifts.
- Colour (polarity) only for positive vs negative impact, when asked for
  it or when the data is inherently good or bad.
- A new component treatment only when a new kind of interaction appears.

Fewer styles by default. Every style and variation on the page should be
traceable to a reason and to a rule here. If you can't say why a style
exists, remove it. This skill is not a checklist to apply exhaustively —
it is the set of decisions to reach for when a plain page asks a question:
how do I show hierarchy, how do I group this, how do I mark state, how do
I make this interactive. Answer only the questions the page is actually
asking.

## The six rules that matter most

1. **Monochrome plus one accent, spent sparingly.** Black text, 50%-black secondary text, white ground, and `#FCFF28` for *attention* — never for state. If two things on screen are accented, the rule is already broken.
2. **Five spacing steps: 4, 8, 16, 24, 48.** Everything lands on one. `4` is the inner padding of a small control only — never a gap between blocks. A value off the scale is a mistake, not a nuance.
3. **Three type styles to a card.** A title, body copy, and one emphasis — the large number *or* the mono detail, never both. One headline to a view, with no eyebrow above it.
4. **Lists live on the page; surfaces are for content.** Dividers carry structure. A card is for an image, a chart, a demo, or a real card being shown — not for wrapping a list of rows. There is exactly **one** surface style: white fill + `#ececec` hairline, with `0 2px 14px rgba(0,0,0,.04)` added only if it lifts on hover. Buttons are the exception: every button-shaped control carries that shadow at rest — see Buttons.
5. **Two easing curves.** `cubic-bezier(0.23, 1, 0.32, 1)` for things entering or leaving the screen; plain `ease` for hover and colour. Never mix them up.
6. **Slower than feels right.** Overlays take 800ms. Nav takes 450ms. Default AI output lands at 200–300ms for everything; that's the single biggest tell.

## Colour

Effectively monochrome. The palette is a ground, a text colour, a half-strength text colour, and three near-invisible blacks.

| Role | Value | Where |
|---|---|---|
| Ground | `#ffffff` | page, every surface |
| Primary text | `#000000` | display type, button/nav labels only |
| Secondary text | `rgba(0,0,0,0.5)` | **the default** — chrome, intro copy, captions, all metadata |
| Hairline | `#ececec` | border on every floating surface |
| Subtle fill | `rgba(0,0,0,0.04)` | a quiet filled row or track |
| Accent | `#FCFF28` | one mark that needs the eye, under black text |
| Divider | `rgba(0,0,0,0.08)` | rules between list rows |

- **Secondary is the default text colour**, not an exception. Black is reserved for the display line and for labels on interactive surfaces. This inversion of the usual habit is a large part of the look.
- **The accent is for attention, not state.** The whole budget is three things: a value that needs the reader's eye (`.flag`), the text they have selected (`::selection`), and the single point under the pointer on a chart. That's it.
- **A selected tab, a current nav item, a pressed segment are state** — they take `--color-fill-subtle`. Selection is structure; the accent is emphasis. Painting every active control with it is the mistake, and it's an easy one: the controls are the things you notice building a page, so they're the first place the colour lands.
- Always a *fill* under black text. Never a text colour on the ground (yellow on white is unreadable), never a data series, never decoration. Anything sitting on it takes `--color-accent-ink`.
- There is no placeholder grey. An empty box is `--color-fill-subtle` with a hairline.
- `--color-overlay-backdrop` is declared and unused. Leave it that way.
- De-emphasis is done with **opacity, not grey**: inactive nav labels sit at `0.3`, off-centre media at `0.2`.
- No gradients except functional fade-to-ground masks.

### Polarity — the one colour exception

Red and green are allowed for exactly one job: **positive vs negative
impact**. A contribution heatmap is the reference: each item's share
either helps or hurts a running total, and the fill says which way, at a
glance.

- Only when the user explicitly asks for it, or when the data itself is a
  good/bad signal (impact on a total, a gain vs a loss). Never decoration,
  never branding, never a status badge.
- The tints are `--color-gain-fill` and `--color-loss-fill`; in a table, `.table-gain` and `.table-loss`.
- Fills, not text. Soft tints on the cell, full-ink values on top. Never
  coloured text on the ground.
- The accent stays the attention colour. Polarity never replaces it, and
  the two never compete as signals on one view.

## State without colour

The hardest gap to fill, and the one most likely to be filled badly. The
style bans coloured status badges; the replacement is **glyph + word**, not
opacity.

**Meaning never rides on opacity.** Opacity de-emphasises things that carry
no information — an inactive tab label, an off-centre carousel item, chrome
that isn't in play. The moment a value means something ("not allowed",
"failed", "over quota"), it must be legible on its own terms.

| State | Glyph | Ink |
|---|---|---|
| Good / allowed / delivered | `✓` | secondary text |
| Warning / limited / retrying | `!` | **full ink** |
| Bad / failed / not allowed | `✗` | **full ink** |
| Unknown / not applicable | `–` | secondary text |

- The glyph and the word always travel together. Never the glyph alone, and
  never the word alone in a colour that is doing the work.
- **Problems get full ink, not less.** The instinct is to fade the negative
  state; it inverts the hierarchy — the thing you most need to see becomes
  the hardest to read.
- Mono uppercase is the right treatment for a status token inside a table or
  a row. It is a value, which is mono's actual job.

**Contrast floor.** Two of this system's own values are below WCAG AA and are
only legal on decoration:

| Value | Where it's fine | Where it is not |
|---|---|---|
| `rgba(0,0,0,0.3)` | an inactive nav label beside an active one, a disabled control | any text carrying information |
| `rgba(0,0,0,0.5)` at 10.5–11px | a dense table cell, an axis tick, a year range | a status, a quantity, anything acted on |

If a value is meaningful and small, it takes **full ink**. If it's meaningful
and secondary, it takes `--color-text-secondary` at 14px or larger, never at
mono's 10.5px. When in doubt, raise the ink, not the size.

**The one exception is the tooltip.** Its text stays secondary at 10.5px
mono, meaningful or not. A tooltip is a reveal the reader asked for, on its
own surface, read at a glance and then dismissed — the quieter ink is what
keeps it a gloss rather than a second page. Everything else that is small
and meaningful takes full ink, including a toast, which arrives unasked.

## Type

`SF Pro Display` stack for everything; a mono stack for metadata only.

When two pieces of text need a hierarchy, take a pairing from `patterns/type-pairs/` — seven of them, subtle to expressive — rather than composing one.

- **Weight 500 everywhere.** 600 on anything interactive. Never 400, never 700, never bold display type.
- **Five roles.** Display 56/64, Title 32/38, Label 16/19 at 600, Body 16/19, Caption 14/18 — plus Interactive and Mono below. A card uses three of them, maximum.
- **Tracking is negative only where the size earns it.** Everything 16px and under sits at `-0.1px` — Label, Interactive, Body and Caption alike. Display takes `-1px` at 56px, Title `-0.6px` at 32px. Positive `0.3px` on uppercase mono.
- Don't give a label tighter tracking than the body text beside it. At interface sizes the source's `-0.25px` reads cramped, and a mismatch between a title and its own paragraph is just a defect.
- **Line-heights are px, and tight**: `16/19` (≈1.19), `14/18`, `56/64`. Not 1.5, not 1.6. Only mono uses a ratio (1.5).
- **Flat hierarchy on purpose.** The intro paragraph and the career-timeline company names are the *same* 56px — there is no size step between them. Prefer flattening to adding a tier.
- **Controls take the display family, never mono.** Two steps: **Label** (16/19, 600) for a primary action, **Interactive** (14/18, 600) for compact controls — segments, tabs, card actions. The one deliberate exception is the title inside a collapsible control panel: that title uses the mono label style so it reads as a quiet container label rather than a primary action.
- **Mono is for values and identifiers, and nothing else**: a figure in a table, a tick on an axis, a timestamp, an ID, a hex code, a year range. Uppercase, `+0.3px`, secondary, 10.5px, weight 500. **Table content defaults to 10.5 mono** — tables do not inherit font sizes for mono; every data cell is 10.5 mono (see `components/table/`). Weight is always 500.
- **Mono is always weight 500 — never bold.** Set the weight explicitly on the mono role so heading/title semantics, inherited control styles, and browser defaults can never promote it to 600 or 700. The collapsible control-panel title exception changes mono’s role, not its weight.
- **Rule of thumb: a number is often mono, a word almost never is.** If the mono text you're about to write is a phrase, it belongs in Caption or Label.
- **Mono is never a subtitle, a general section header, a field label, or a table column header.** Overusing it is the single easiest way to make the style look like a costume rather than a system — it turns ordinary labels into metadata and slows the whole page down to be read. Three exceptions, and only three: the title inside a collapsible control panel, the tooltip, and the name above a figure in a type pair (`patterns/type-pairs/`) — a figure's name is closer to an axis label than a heading. Budget mono like the accent: if a view is speckled with small caps, cut it back.
- The one exception the source documents is a **label under the cursor** — the hover-cursor pill is `-0.25px` and full black, because it has to read instantly at pointer speed.

## Icons

- **Three sizes, one stroke.** `--icon-mark` (10px) for a chevron or arrow inside a control, beside its label; `--icon-inline` (16px) for an icon beside text; `--icon-control` (20px) for the icon in an icon button. Draw each on a viewBox the size it renders, so a `1.5` stroke is `1.5px`.
- **Outlined, round, current colour.** `fill="none"`, `stroke="currentColor"`, round caps and joins. A dot is the only filled shape.
- **Ink follows the job.** An icon in a control is full ink. An icon beside text takes the text's ink. A mark that only appears on hover — a sort arrow, a chevron — can wait at 0 until it's wanted.
- **An icon alone is a control, and needs a name.** Use the icon button: primary on the lifted surface, secondary on the quiet fill. Every one takes an `aria-label`. If the icon isn't instantly clear, use a labelled button.

## Space & layout

- **Five steps, and nothing between them: `4 / 8 / 16 / 24 / 48`.**
  - `4` — inner padding of a small control (pill, chip, segment button). Never a gap between blocks.
  - `8` — label to value, icon to text.
  - `16` — inside a card, between fields.
  - `24` — the page inset, on all four sides, and card to card.
  - `48` — section to section.
- **`24px` is the page inset**, top/right/bottom/left, for everything pinned to an edge.
- **Cap reading content at `1280px` and centre it.**
- **Layout is binary per surface.** Centred at a max-width (reading surfaces) *or* full-width with the `24px` page inset (data-dense tools, wide tables). A surface that is neither — content that looks centred but isn't constrained, a wide table floating in an unconstrained frame — is a defect. Pick one and hold it; never let a container drift between the two.
- **Derived positions are written as `calc()` with a comment explaining the arithmetic**, never as a hardcoded magic number. E.g. `top: calc(var(--space-page) + 35px); /* site-name line-height 19px + 16px margin */`.
- Layout is **fixed-position chrome over a full-viewport content layer**, not a document that scrolls. `height: 100vh; overflow: hidden` on the page, content pinned to the edges, the middle given over to the main object.
- **One breakpoint: `630px`.** Don't build a four-tier responsive system.
- Every grid and flex item that can hold a chart, a table or a long string needs `min-width: 0`, or its content will widen the column instead of scrolling inside it.
- A floating detail card over a canvas (a map, a diagram) is `position: absolute` within a positioned parent, `max-height: calc(100% - 48px)`, with its own `overflow-y: auto`.
- Content ends are masked with a **gradient fade to the ground colour**; scrollbars are hidden (`scrollbar-width: none` + the webkit pseudo-element).

## Surfaces

- **Default to no surface.** The page is the ground and most things belong directly on it, separated by `1px solid var(--color-divider)`. Reach for a card only when the thing inside is *content*: an image, a chart, a live demo, or a card you are literally demonstrating.
- **A list is never a card.** A table, a feed, a spec list, a set of rows — those get a heading and dividers on the page. Wrapping each one in a card is the fastest way to turn a calm page into a deck of floating boxes.
- **There is exactly one surface style.** `background: #fff` + `1px solid #ececec`. No second, quieter container — a box of `--color-fill-subtle` is not a softer card, it is a *second card style*, and two is one too many.
- **One quiet fill, for secondary controls only.** `--color-fill-quiet` is the surface of a secondary control — a secondary icon button: grey, no edge, no shadow, deepening to `--color-fill-quiet-hover` on hover. It is never a container and never state; selection keeps `--color-fill-subtle`.
- `--color-fill-subtle` has one job: the **selected state** (a pressed segment, the current nav item, a chip that's on). It is not a background, not a well, not a panel, not a demo stage. If you are filling an area to group it, use a divider or nothing.
- The hairline is the constant.
- **The shadow is conditional, not part of the recipe.** `0 2px 14px rgba(0,0,0,.04)` goes on things that lift on hover — the nav pill, a floating call to action. Buttons are excepted: every button-shaped control carries the rest shadow at rest (see Buttons). The one persistent-elevation exception is the collapsible control panel near the top of an artifact; its shadow establishes the control layer above the content. The tooltip, the toast and the cursor pill carry the hairline alone. Shipping a shadow on any other surface that can't be hovered is the mistake, not shipping one without a shadow.
- **Radius reads binary**: `20px` for cards and media; fully round for pills and buttons. Nothing in the 4–12px range.
- **Rows decide the radius; 60px is the test.** A surface that holds one row — one line of text, or one row of controls — is a pill. Two rows or more, it's a card. When unsure, measure: under `--pill-below` (60px) is one row. The number is `20 + 20 + 20`, the least height where the straight side is as long as a card corner; between 40 and 60px a 20px radius makes a near-pill that matches nothing else in the system.
  - Fixed surfaces are decided in the markup: a toast is always one row, so always a pill; a picker menu is always several, so always a card.
  - Surfaces whose content or state varies — a tooltip of unknown length, a table row that might wrap, a panel that collapses — are measured by their script once their height is known, and take `.is-pill` under the threshold.
  - When a surface changes rows in motion — a panel collapsing — animate the corner with the height, on the same duration and curve, from `--radius-card` to `--radius-row` (30px, half of `--pill-below`). A one-row surface is under 60px, so 30px always renders fully round, and since the browser draws the smaller of the corner and half the height, the shape changes continuously. Never animate toward `999px`: it passes the half-height cap within a few frames and reads as a snap. (The source actually uses 20, 50, 80, 110 and 999px — every value over 20px exceeds its own box height, so they all render the same. Use 20px or `999px`.)
- Three shadow levels only: rest `0 2px 14px/.04`, hover-lift `0 6px 20px/.18`, media `0 14px 34px/.24`.
- `backdrop-filter: blur(20px)` over a 50%-white fill — used once, on the floating cursor pill. It's a garnish, not a theme.
- `box-shadow`, not `filter: drop-shadow`, on anything transform-animated (iOS Safari smears the latter).

## Composition

The constraint that does the most work in practice.

- **Three type styles to a card, maximum.** A title (Label), body copy (Body), and one emphasis — the large number (Display/Title) *or* the mono detail. Picking both is the mistake. Chart internals — axis ticks, tooltips, legends — sit outside the budget.
- **One headline to a view.** No eyebrow above it, no kicker below it, **and nothing on the line beside it.** A heading followed by a `<span>` descriptor — `## Colour · seven greys and one accent` — is the same mistake wearing a different hat: it turns the heading into a label and buries the summary in chrome. Say `Relay`, then describe it in body copy on its own line; not `RELAY · DELIVERY PLATFORM` stacked over `Overview`, and not `Colour` with a trailing gloss.
- If the descriptor is worth reading, it is a sentence under the heading. If it isn't, delete it.
- **If a card needs a second line, it is body copy**, not a smaller heading and not mono.
- A four-style card is the commonest failure: eyebrow, title, number, mono footer. Drop the eyebrow and turn the footer into a sentence.

**Show the rule, don't describe it.** When you need to state a choice — a rule, a do/don't, a before/after — the default form is a **two-column comparison row**: the generic version on the left under a secondary label, the house version on the right under a full-ink one, on the page with a divider above. It is faster to read than a paragraph, it proves the rule instead of asserting it, and it needs no card. Use it wherever you would otherwise write "prefer X to Y".

## Components

The things the source site never needed. It was a handful of fixed elements
over one draggable object, so anything with filters, tables, panels or
status had to be invented. These are the decisions, so they stop being a fresh guess each
time. Change them freely — but change them here.

### The component library

Built components live in `components/`, next to this file. Each folder is
one component: `<name>.html` (markup), `<name>.css` (tokens only),
`<name>.js` when it has behaviour, and a `README.md` with its states and
rules.

1. Reach for a component only when the page asks the question it answers.
   The index below says which question that is.
2. Read its `README.md` before copying anything.
3. Copy the `.html`, `.css` and `.js` into the project as they are, header
   comment included. The header names the component and its version, so a
   project can be checked against the library later.
4. Change a copied component only to fit the project's content. If the
   change is a better rule, it belongs in the library, not the project.

| Component | Reach for it when | Folder |
|---|---|---|
| Button | an action needs a control — the pill, the large pill for a screen's main action, or the quiet text treatment for infrequent actions | `components/button/` |
| Toggle chip | several filters can be on at once | `components/chip/` |
| Range slider | a continuous value, set by drag or keyboard | `components/slider/` |
| Segmented control | one choice out of a few, always visible — a view switch, a denominator, the page nav | `components/segmented/` |
| Tooltip | a detail worth having but not worth printing — inline, dropped on click, or announced by the cursor pill | `components/tooltip/` |
| Toast | an action finished somewhere the result can't be seen — copied, saved, sent | `components/toast/` |
| Table | rows of records — any list with more than one value per row | `components/table/` |
| Picker | one choice from a list too long to show at once — a select menu | `components/picker/` |
| Accordion | sections worth having but not worth showing all at once | `components/accordion/` |
| Input | a line of text has to be typed — a name, a URL, a search | `components/input/` |
| Icon button | an action is clear from an icon alone — back, more, share, close | `components/icon-button/` |

### Patterns

A pattern arranges components into a piece of a page: the answer to "how does this page open?" rather than "how do I build this control?". The test is whether it contains other components. Patterns live in `patterns/`, in the same shape as components, and each README starts with the components it needs (`Requires: …`) — copy those too.

Patterns add layout and nothing else. Every colour, type style and surface inside one comes from the tokens and the components; a pattern that sets its own type is forking the system.

For a tool, reach for the patterns first, then fill them with components.

| Pattern | Reach for it when | Folder |
|---|---|---|
| Artifact intro | a tool opens with a title and needs to say what it is | `patterns/artifact-intro/` |
| Control panel | a tool has controls that change the content beside or below them — or a long page needs a contents list | `patterns/control-panel/` |
| Type pairs | two pieces of text need a hierarchy — a title and a line, a number and its name, a page's opening | `patterns/type-pairs/` |
| Carousel | one piece of content at a time — projects, photos, videos — each with a caption | `patterns/carousel/` |

The sections below cover components not yet in the library. When one is
built, its section moves into that component's `README.md` and it joins the
index.

### Links, focus, disabled

- **Links**: no underline, `--color-text-secondary`, full ink on hover.
  Inside running prose, underline on hover instead — a 50% link in a 50%
  paragraph is invisible.
- **Focus**: `:focus-visible { outline: 2px solid var(--color-text);
  outline-offset: 2px; }`. Full ink, not the accent — the accent means
  attention, and focus is a position, not a highlight. Never remove the
  outline without replacing it.
- **Disabled**: `rgba(0,0,0,0.3)` ink, no hover, no shadow,
  `cursor: not-allowed`, and the real `disabled` attribute. The one place a
  30% value is correct, because it signals *nothing will happen here*.

### Theming

Theme by **overriding token values, never by renaming tokens**. A theme is a
block that redefines `--color-*` on `:root[data-theme="x"]`; every component
keeps reading the same names. If a prototype needs a different look, change
the values and leave the vocabulary alone.

## Diagrams and SVG

- **Text inside a scaled `viewBox` does not stay at its nominal size.** If
  the SVG is 1200 units wide and renders at 600px, 16px type draws at 8px.
  Either set `viewBox` units equal to the rendered pixel size and redraw on
  resize (what the charts in the reference site do), or divide every font
  size by the scale factor. Check it at the smallest width you support.
- Node fill: `--color-surface` with a `1px` `--color-hairline` stroke.
  Selected: the hairline goes to full ink at `1px` — not a glow, not a
  colour. A second `2px` ring at `--color-fill-subtle` if you need more.
- Solid black node fills are for one or two emphasis nodes only; label them
  in `--color-bg`. More than that and the diagram reads as a bar chart.
- Edges: `1px` `--color-hairline-strong`, round caps. Directed edges get a
  small solid triangle in the same ink; never an outlined arrowhead.
- Dashed is reserved for **provisional or optional** — a planned edge, a
  drop zone. Never for a live edge, and never on gridlines or axis rules.
- Edge labels sit on a `--color-bg` rect with no stroke (a halo), so the
  edge doesn't run through the text. Caption or mono, secondary ink.
- Hit targets: at least `24px`, separate from the drawn mark.

## Motion — where the personality lives

**Durations**

| Token | Value | Use |
|---|---|---|
| fast | `160ms` | hover, colour, fades that should feel instant |
| base | `250ms` | small UI scaling in/out, text swaps, a moving fill over dense targets |
| deliberate | `450ms` | nav, and a moving fill over a few large targets — meant to read as considered, not snappy |
| entrance | `500ms` | a container appearing |
| slow | `800ms` | full-surface takeovers, cross-page transitions |
| carousel | `1200ms` | the main draggable object settling (`--duration-carousel`, `patterns/carousel/`) |

**Duration follows density, not component.** The same motion runs at different speeds depending on how often the pointer crosses its targets. A fill gliding between two or three large options — the page nav, a segmented control — takes `deliberate`: it moves rarely, and the pause reads as care. The same fill gliding between dense, repeated targets — table rows, list items — steps down to `base`, because at 450ms it trails a pointer sweeping down a column. Step down one token; never invent a value in between.

**Easing — the rule is strict**

- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — a strong ease-out, for anything **entering or exiting** the screen.
- Plain `ease` — for **hover states and colour changes**. Using the strong curve here makes hovers feel sludgy.
- A matching `--ease-in-out` exists and is unused. There is no bounce, no spring, no `cubic-bezier` with overshoot anywhere.

**Patterns**

- **Scale-in from `0`** for small things that pop (pills, tooltips, toasts) with a chosen `transform-origin` — a tooltip grows from the corner you clicked, a toast from the button it confirms.
- **Scale-in from `0.95`** for large surfaces, paired with opacity.
- **Press scales down.** A handle under a finger or a held key (a slider thumb, a drag handle) scales to `--scale-press` (0.85) while held: in on `fast`, back on `base`, on `--ease-out`. It's the tactile counterpart to the tooltip's scale-in.
- **On touch, button-shaped controls press too — just less.** A pill button, an icon button or a chip under a finger scales to `--scale-tap` (0.97) as well as playing its hover response: in at once, back on `base`, on `--ease-out`. Touch only — with a pointer, buttons lift and don't press. Large surfaces never press: the large button, rows, cards and panels keep their lift or ink change. Nothing presses under reduced motion.
- **Blur as a crossfade bridge**: a flat opacity crossfade reads flat however you tune it. A hover reveal is `opacity 0→1` + `scale 1.015→1` + `blur(6px)→0` over `300ms` plain `ease`.
- **Clip-path reveals text**, not width: `clip-path: inset(0 100% 0 0)` → `inset(0)` wipes left-to-right and works across wrapped lines.
- **Stagger with JS, not `transition-delay`** when it should only apply on entrance — a CSS delay applies symmetrically and makes the close sequence run backwards. ~100ms is the stagger.
- **Animate named properties, never `all`.** Transform and opacity by default; layout properties only with a comment justifying the reflow.
- **Every transition gets a `prefers-reduced-motion` counterpart** setting `transition-duration: 1ms`.
- Where a JS constant mirrors a CSS duration, say so in a comment on both sides.

## Hover states and tooltips — lean in

The source site puts an unusual amount of its information *behind* a hover,
and that is a feature worth copying, not a quirk to tolerate. The custom
cursor pill, the click-to-drop tooltip, an image that reveals its details on
hover and the nav indicator's hover preview all exist so the resting page can
stay quiet.

- **Default to a hover reveal rather than permanent secondary text.** If a
  value is useful but not load-bearing — a precise figure behind a rounded
  one, a full timestamp behind "Yest.", a definition, the arithmetic behind a
  total — put it in a tooltip instead of printing it.
- **The tooltip is the one place mono is unreservedly right.** `10.5px`,
  `+0.3px`, uppercase, secondary ink, on a `20px`-radius surface with the
  hairline. It is a value or a terse gloss, so it gets the value treatment.
  Expanding tooltip use is the cheapest way to cut mono out of the resting
  page without losing it from the system.
- **Grow it from where it belongs.** `transform: scale(0)` → `scale(1)` over
  `--duration-pop` (350ms) with the ease-out curve, and set `transform-origin` to the thing it
  explains — the click point, the button it confirms, the mark it labels.
  A tooltip that fades in place reads as a layer; one that grows from a point
  reads as that point speaking.
- **Then reveal the text.** `clip-path: inset(0 100% 0 0)` → `inset(0)` over
  `--duration-reveal` (550ms), starting once the box has finished scaling. Wiping beats fading
  and survives wrapped lines, which a width transition doesn't.
- **Hover is mandatory, and the bias is toward more of it.** Every interactive element — buttons, pills, selects, segments, chips, table rows, links, toggles — responds on hover: lift for buttons and surfaces, ink-brighten for text, a gliding fill for table rows (see `components/table/`), fill-deepening for chips and segments. A control with no hover response is a defect, not a minimalism choice. A hidden layer crossfades through a 6px blur.
- **No native tap highlight.** The grey box a mobile browser flashes on every tap is the plainest sign of a web view, so `tokens.css` turns it off for everything (`-webkit-tap-highlight-color: transparent`). Never bring it back.
- **On touch, the hover response is the press.** A touch screen can't hover, so the same response — lift, ink-brighten, fill-deepening — plays while the finger is down: in at once (`--duration-instant`), out on its usual timing when it lifts. Wrap it in `@media (hover: none)` beside the hover rule it mirrors. iOS only applies `:active` when the page listens for touches: put `ontouchstart` on `<body>`.
- Hover-only information still needs a non-hover path: a tooltip on a chart
  point needs the table view; a tooltip carrying a definition needs the
  definition somewhere reachable. Hover is an upgrade, never the only route.

## Interaction signatures

These are the recognisable moves. Reach for them when the context fits; don't force all of them in.

- **Custom cursor pill.** `cursor: none` on the target, a small uppercase-mono pill ("Learn more", "Open", "Play") follows the pointer and scales in. Position tracks instantly; only the scale transitions.
- **Hover means lift or brighten.** Shadow deepens, or secondary text goes to full black. Never a background or colour change — except the one moving fill: a segmented control's indicator, or a table's row fill, gliding to the thing under the pointer.
- **Opaque full-bleed takeover** instead of a dimmed modal. No click-outside-to-close — an explicit Close link and Escape.
- **Moving indicator as its own element**, absolutely positioned behind the links rather than a background on the active link, so it can glide between tabs. Hovering a sibling tab retargets it as a preview of where you'd land.
- **Drag-first input.** Grab cursors, `touch-action: none`, pointer-tracked 1:1 with no transition mid-drag, then snap on release past a distance *or* velocity threshold.
- Page-to-page uses native cross-document view transitions: dismiss the outgoing snapshot in 1ms, animate only the incoming one, so motion reads as arrival rather than dissolve.

## Voice

Sentence case. Em dashes with spaces. Short, flat, unsold: "Designer at a small software company", "Built for checking quickly.", "Previously — a spreadsheet, then a script". No exclamation marks, no "Unlock", no "Seamlessly". Mono microcopy is uppercase.

## Avoid these defaults

The point of this skill is output that doesn't read as model-generated. These are the tells:

| Tell | Instead |
|---|---|
| Indigo/violet/blue gradient hero or heading | Achromatic. Black on white. |
| Inter, or a generic system-ui stack | The SF Pro Display stack |
| `border-radius: 8px`–`12px` | 20px, or fully round |
| `transition: all 0.3s ease` | Named properties, the duration tokens, the right curve |
| Everything at 200–300ms | 450ms for nav, 800ms for surfaces |
| `line-height: 1.5` / `1.6` on headings and UI | Tight px line-heights |
| `font-weight: 600`/`700` headings | 500 |
| Grey-100/200 borders and `shadow-lg` cards | `#ececec` hairline, shadow only if it lifts |
| Three-column feature grid with icon circles | One object, centred, with chrome pinned to the edges |
| Emoji in headings or labels | Nothing, or uppercase mono |
| Coloured badge pills (green/amber/red tints) | Mono uppercase text at 50% black — polarity fills excepted (see Colour) |
| Centred hero: big title, subtitle, two CTAs | A short name block in the top-left corner and one nav pill |
| Glassmorphism throughout | One blurred element, at most |
| Tailwind utility soup with arbitrary values | The tokens in `tokens.css` |
| Mono as a subtitle, section header, column header or button label | Label for subtitles and headers, Interactive for controls |
| The accent on every active tab and toggle | Subtle fill for state; accent for one flagged value |
| An eyebrow stacked over every title | One headline, then body copy |
| A `<span>` descriptor on the heading line | A sentence under the heading, or nothing |
| Permanent secondary text for every detail | A hover reveal, with the detail in a tooltip |
| A coloured status badge, or status by opacity | Glyph + word at full ink |
| A card with four type styles | Title + body + one emphasis |
| `gap: 10px`, `padding: 13px`, odd one-off values | 4 / 8 / 16 / 24 / 48, no exceptions |
| Content running the full width of a 2560px monitor | `--container: 1280px`, centred |
| A list, table or feed wrapped in a card | A heading and dividers on the page |
| A `fill-subtle` box used as a quieter card | Nothing, or a divider. One surface style only |
| A shadow on a card that can't be hovered | Hairline alone; shadow means it lifts |

## Common mistakes

- **Using the strong ease-out on hovers.** It's reserved for enter/exit. Hovers use plain `ease`.
- **Adding a third type size** because the display size "feels too big next to body." Flat is the intent.
- **Reaching for a mid-grey** (`#888`, `#666`) instead of `rgba(0,0,0,0.5)`. The palette has no opaque greys.
- **Using mono because it looks technical.** It is a treatment for values, not a flavour. Count the mono on a finished page — if it's more than a handful outside tables and axes, cut it.
- **Letting a value land between steps.** `12px` and `20px` feel harmless and are exactly how the scale dies.
- **Spending the accent on control states.** Every toggle, tab and segment is a tempting target and all of them are wrong. State is the subtle fill; the accent is for the one thing you want looked at.
- **Yellow text, or yellow on a coloured fill.** The accent is a fill under black ink. Full stop.
- **Shipping a shadow on something that doesn't lift.** The hairline is unconditional; the shadow earns its place by being hoverable.
- **Reaching for a card to group things.** Grouping is what a heading and a divider are for. The card is for content.
- **Inventing a second container by filling it.** `fill-subtle` as a panel background is a card wearing a disguise.
- **Speeding motion up** because 800ms feels slow in isolation. It doesn't in context.
- **Skipping the reduced-motion block.**
