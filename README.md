# Vaoferi Design Skill

Design with structure, not decoration.
Use grids before colors, alignment before effects, components before custom code, and trace existing CSS before writing new CSS.

Now the skill also starts design-system work with a portable `DESIGN.md` contract, so tools like Google Stitch, Open Design, Codex, Claude Code, Cursor, and similar coding agents can read the same source of truth instead of guessing the UI.

## Main rules

- Start from goal and hierarchy.
- Create or reuse `DESIGN.md` before designing multi-screen UI.
- Start and fill the primitive library before generating page-specific elements.
- Build the grid first using Golden Canon-inspired structure.
- Reuse components before creating new ones.
- Match the existing UI first on operational screens and admin forms.
- Trace existing CSS before adding a new selector or override.
- Treat `!important` as an emergency escape hatch, not a normal fix.
- Use design tokens before ad-hoc values.
- Ask before introducing new components, colors, or spacing scales.
- Validate responsive behavior across breakpoints.
- Finish only after visual QA.
- Stop on conflicts and show the Conflict Form before proceeding.

## Teaser

This skill turns `1: 618`, `1fr 1fr`, and Fibonacci spacing into a workflow that produces layouts which:
- behave the same on mobile and desktop;
- reuse existing UI and existing CSS instead of inventing fresh styles;
- keep spacing and typography consistent through tokens.

## Quick start (recommended flow)

```text
goal
  -> DESIGN.md
  -> primitive library
  -> hierarchy
  -> Golden Canon-inspired grid
  -> alignment lines
  -> component resolution
  -> existing components/tokens
  -> proposal if something new is required
  -> final styling
  -> visual QA
```

If sources or libraries contradict each other, stop and use the Conflict Form from `SKILL.md` before continuing.
If a new component, token, or layout pattern is required, use the Approval Flow from `SKILL.md`.

## Use

1. Understand the goal and user action.
2. Create or find `DESIGN.md`.
3. Start the primitive library: Button, Card, Input, Text, Grid, Container, states.
4. Build the grid before placing elements.
5. Draw alignment lines.
6. Resolve components before creating new ones.
7. Trace existing CSS before adding new styles.
8. Ask approval before adding new styles or CSS escape hatches.
9. Check responsive behavior.
10. Protect photos and logos.
11. Use design tokens only.
12. Verify in browser or preview before marking Done.

## What this skill emphasizes

- `DESIGN.md` is the shared contract for Stitch/Open Design-style agents.
- Tokens must be mirrored to code-friendly files like `tokens.css` / `tokens.json` when needed.
- Primitive libraries prevent one-off buttons, cards, inputs, and badges on every page.
- Golden Canon is a macro guide, not a rigid pixel rule.
- `grid`, `subgrid`, `fr`, `minmax()`, `auto-fit`, and `clamp()` are the main primitives.
- `grid` handles page structure; `flex` handles the interior of components.
- `gap` is preferred over margin hacks.
- CSS guardrails: trace before patching, low specificity, no `!important` by default.
- Traceable class naming and `@container` help keep component ownership and local responsiveness clear.
- Accessibility and responsive scaling are first-class requirements.
- The browser should do the math whenever possible.

## Files

- `SKILL.md` — main skill entrypoint
- `AGENTS.md` — rules for working in this repository
- `README.md` — project overview
- `rubric.md` — Done checklist for design work
- `docs/history/project_log.md` — log of notable skill changes and decisions
- `examples/good-answer.md` — приклад правильної відповіді за скілом
- `examples/bad-answer.md` — приклад типових помилок
