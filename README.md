# Personal styling

A personal design system: the rules, the tokens, and a library of components that agents copy into projects.

```
skills/personal-styling/     the skill — everything an agent needs
  SKILL.md                   rules, judgment calls, pattern and component index
  tokens.css                 the token block, copied into every project verbatim
  patterns/<name>/           page pieces built from components — same files as below,
                             plus a "Requires:" line naming the components they use
  components/<name>/
    <name>.html              markup        ┐
    <name>.css               tokens only   ├ shipped: copied into projects
    <name>.js                if it behaves ┘
    README.md                states, rules, usage
    demo.html                sandbox only: every state, side by side
site/                        sandbox chrome (site.css, site.js)
scripts/
  lint.mjs                   enforces the rules that can be checked mechanically
  build-site.mjs             builds the sandbox into dist/ from the skill's files
```

The sandbox renders the same files the skill ships, so the two can't drift.

## Working on the library

```bash
npm run check        # lint, then build the sandbox
open dist/index.html
```

No dependencies — Node 18 or later is all it needs.

### Adding a component

1. Make `skills/personal-styling/components/<name>/` with `<name>.html`, `<name>.css`, `README.md`, and `<name>.js` if it has behaviour.
2. Start every shipped file with the header `personal-styling · <name> · v0.1.0` in a comment.
3. Write `README.md` as `# Title`, then a one-sentence summary (the sandbox index uses it), then the rules.
4. Add `demo.html` showing every state. Put `force-hover` or `force-focus` on an element to show that state at rest.
5. Add a row to the component index in `SKILL.md`. If the component's rules were in `SKILL.md`, move them into its README.
6. `npm run check`.

### Changing a component

Bump the version in every shipped file's header. Projects carry the header in their copy, so you can grep a project for `personal-styling ·` to see which versions it's on.

## Using it in a project

The skill folder is the whole package. Pull it from GitHub in any of these ways.

**As a personal Claude Code skill (every project on this machine).** Clone once, symlink, and `git pull` to update:

```bash
git clone https://github.com/<you>/personal-styling ~/src/personal-styling
```

```bash
ln -s ~/src/personal-styling/skills/personal-styling ~/.claude/skills/personal-styling
```

**Inside one project's repo (works in cloud sessions too).** Copy just the skill folder in and commit it:

```bash
npx degit <you>/personal-styling/skills/personal-styling .claude/skills/personal-styling
```

Rerun it with `--force` to update.

**For agents that don't read skills.** Copy the folder in the same way, then add this to the project's `AGENTS.md`:

```markdown
## Styling
Follow `.claude/skills/personal-styling/SKILL.md` for every UI decision.
Copy `tokens.css` from there verbatim, and copy components from its
`components/` folder rather than writing new ones.
```
