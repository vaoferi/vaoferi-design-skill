# Vaoferi Design Skill

Design with structure, not decoration.
Use grids before colors, alignment before effects, components before custom code.

## Main rules

- Start from goal and hierarchy.
- Build the grid first using Golden Canon-inspired structure.
- Reuse components before creating new ones.
- Use design tokens before ad-hoc values.
- Ask before introducing new components, colors, or spacing scales.
- Validate responsive behavior across breakpoints.
- Finish only after visual QA.
- Stop on conflicts and show the Conflict Form before proceeding.

## Teaser

This skill turns `1: 618`, `1fr 1fr`, and Fibonacci spacing into a workflow that produces layouts which:
- behave the same on mobile and desktop;
- reuse existing UI instead of inventing fresh styles;
- keep spacing and typography consistent through tokens.

## Quick start (recommended flow)

```text
goal
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
2. Build the grid before placing elements.
3. Draw alignment lines.
4. Resolve components before creating new ones.
5. Ask approval before adding new styles.
6. Check responsive behavior.
7. Protect photos and logos.
8. Use design tokens only.
9. Run visual QA and only then mark Done.

## What this skill emphasizes

- Golden Canon is a macro guide, not a rigid pixel rule.
- `grid`, `subgrid`, `fr`, `minmax()`, `auto-fit`, and `clamp()` are the main primitives.
- `grid` handles page structure; `flex` handles the interior of components.
- `gap` is preferred over margin hacks.
- Accessibility and responsive scaling are first-class requirements.
- The browser should do the math whenever possible.

## Files

- `SKILL.md` — main skill entrypoint
- `AGENTS.md` — rules for working in this repository
- `README.md` — project overview
- `rubric.md` — Done checklist for design work
- `examples/good-answer.md` — приклад правильної відповіді за скілом
- `examples/bad-answer.md` — приклад типових помилок
