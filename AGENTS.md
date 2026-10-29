# Working on this repository

This repo is a design system, not an app. The skill in `skills/personal-styling/` is the product; `site/` and `scripts/` exist to develop and check it.

- `SKILL.md` and `tokens.css` are the source of truth. Component CSS follows them; never the other way round.
- Component CSS uses tokens only: no literal colours, durations or curves, spacing on 4 / 8 / 16 / 24 / 48, radius 20px or fully round.
- Every shipped component file starts with the header `personal-styling · <name> · v<version>`. Bump it on any change.
- A component's rules live in its `README.md`. `SKILL.md` keeps only the system-wide rules and the component index.
- Run `npm run check` before committing. It must pass.
- Build output (`dist/`) is not committed.
