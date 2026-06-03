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

## Core workflow

1. Understand the goal and user action.
2. Define hierarchy and content priority.
3. Build the grid before placing elements.
4. Draw alignment lines.
5. Resolve components before creating new ones.
6. Use design tokens only.
7. Check responsive behavior.
8. Run visual QA and only then mark Done.

## Files

- `SKILL.md` — main skill entrypoint
- `AGENTS.md` — rules for working in this repository
- `rubric.md` — Done checklist for design work
