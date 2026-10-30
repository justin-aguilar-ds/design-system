# Input

A single line of text — a name, a URL, a search — in the same pill as the picker, with its label above.

## Rules

- **It's the picker's trigger, made for typing.** The same pill, surface, rest shadow and hover lift, and the same 36px height as a compact picker, so an input and a picker sit side by side as one family.
- **The label sits above**, in Label type, `8px` from the field. Never inside the field (a placeholder isn't a label) and never beside it, so every input is the same height whatever its label says.
- **Typed text is 16px.** Below 16px, iOS zooms the page when the field is focused. It sits on an 18px line, a pixel tighter than Body, so the field lands on 36px.
- **Typed text is full ink; the placeholder is secondary ink.** The system has no placeholder grey, and a placeholder is an example, not an instruction — "https://api.example.com/hooks", not "Enter a URL".
- **Focus without a ring.** The field lifts to `--shadow-lift` and its edge firms to `--color-hairline-strong` for as long as it's being typed in; the caret does the rest.
- **Errors are glyph + word, at full ink.** `aria-invalid="true"` gives the field a full-ink edge, and the message under it says what to do: "✗ Enter a full URL, starting with https://". Problems get more ink, never less.
- **Help is one line of Caption** under the field, in secondary ink. If it needs two, it belongs in a tooltip.
- **Disabled** drops to 30% and loses its shadow.
- **It fills its field.** Width comes from the container — a control panel column, a form, a docked panel.

## Use

- Each field is `.input-field` › `<label>`, `<input class="input">`, and an optional `<p class="input-message t-caption">`. Wire the label with `for`, and the message with `aria-describedby`.
- **Search:** wrap the input in `<span class="input-wrap input-wrap--search">` with the glyph before it, and use `type="search"`.
- **Error:** set `aria-invalid="true"` on the input, add `.is-error` to the message, and start the message with `✗`.
- In a control panel, put `.input-field` straight into `.control-panel-fields` beside the other fields.
- No JavaScript.

## Changes in v0.2.0

- Its glyph is sized by the icon tokens (`--icon-mark` / `--icon-inline`) instead of a fixed number.
