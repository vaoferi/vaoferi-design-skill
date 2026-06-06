# Vaoferi Design Skill

Design with structure, not decoration.
Use grids before colors, alignment before effects, components before custom code, and trace existing CSS before writing new CSS.

Now the skill also starts design-system work with a portable `DESIGN.md` contract, so tools like Google Stitch, Open Design, Codex, Claude Code, Cursor, and similar coding agents can read the same source of truth instead of guessing the UI.

## Main rules

- Start from goal and hierarchy.
- Create or reuse `DESIGN.md` before designing multi-screen UI.
- Start and fill the primitive library before generating page-specific elements.
- Build the grid first using Golden Canon-inspired structure.
- Preserve the existing spacing scale, or choose `4x` / `Fibonacci` for new work and record it in `DESIGN.md`.
- Reuse components before creating new ones.
- Match the existing UI first on operational screens and admin forms.
- Trace existing CSS before adding a new selector or override.
- Treat `!important` as an emergency escape hatch, not a normal fix.
- Use design tokens before ad-hoc values.
- Ask before introducing new components, colors, or spacing scales.
- Validate responsive behavior across breakpoints.
- Pass all 20 design principles with evidence; do not silently skip one.
- Finish only after visual QA.
- Stop on conflicts and show the Conflict Form before proceeding.

## Teaser

This skill turns Golden Canon-inspired structure and an explicit `4x` or `Fibonacci` spacing choice into a workflow that produces layouts which:
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
8. Preserve the current spacing scale, or approve and record `4x` / `Fibonacci`.
9. Ask approval before adding new styles or CSS escape hatches.
10. Check all 20 principles.
11. Check responsive behavior.
12. Protect photos and logos.
13. Use design tokens only.
14. Verify in browser or preview before marking Done.

## What this skill does

- prevents random one-off CSS and component sprawl in operational/admin UI;
- creates a portable `DESIGN.md` contract that Stitch, Open Design, Codex, Claude Code, and Cursor can all read;
- enforces token discipline so colors, spacing, radius, and typography stay consistent;
- provides two explicit spacing modes without forcing a migration on existing products;
- applies Golden Canon-inspired structure so layouts have predictable rhythm;
- keeps flat, traceable class naming and clear CSS ownership;
- tracks real usage and periodically uses SkillOpt-style review to improve the skill without auto-replacing `SKILL.md`;
- requires visual QA with explicit Pass / Fail / Partial evidence instead of "looks fine";
- requires an evidence-based gate for spacing, grid, hierarchy, typography, contrast, balance, responsive behavior, accents, alignment, palette, readability, consistency, whitespace, navigation, performance, user focus, intuitive interaction, contextual detail, rhythm, and device testing.

## What this skill does NOT do

- this skill will not fix a broken product by adding decoration over a bad structure;
- it will not approve new colors, components, or spacing without an explicit proposal;
- it will not skip `DESIGN.md` because "we can just style the page directly";
- it will not treat `overflow-x: hidden` or fixed heights as acceptable layout fixes;
- it will not accept `best_skill.md` from SkillOpt without human diff review and validation evidence;
- it will not claim a design is Done without visual evidence.

## What this skill emphasizes

- `DESIGN.md` is the shared contract for Stitch/Open Design-style agents.
- Tokens must be mirrored to code-friendly files like `tokens.css` / `tokens.json` when needed.
- Primitive libraries prevent one-off buttons, cards, inputs, and badges on every page.
- SkillOpt is used as a periodic improvement loop: real traces, scored examples, validation gate, reviewed `best_skill.md`.
- Golden Canon is a macro guide, not a rigid pixel rule.
- `4x` and `Fibonacci` are alternative spacing modes; existing project tokens win unless migration is approved.
- `grid`, `subgrid`, `fr`, `minmax()`, `auto-fit`, and `clamp()` are the main primitives.
- `grid` handles page structure; `flex` handles the interior of components.
- `gap` is preferred over margin hacks.
- CSS guardrails: trace before patching, low specificity, no `!important` by default.
- Traceable class naming and `@container` help keep component ownership and local responsiveness clear.
- Accessibility and responsive scaling are first-class requirements.
- Mobile-first defaults start from the narrowest supported width, keep touch targets usable, and prefer `rem`, `box-sizing`, and intentional local scroll over cramped desktop fallbacks.
- Visual polish comes from rhythm, whitespace, typography, and restrained motion, not extra decoration.
- The browser should do the math whenever possible.

## Files

- `SKILL.md` — main skill entrypoint
- `SPEC.md` — current spacing-mode and 20-principles specification
- `AGENTS.md` — rules for working in this repository
- `README.md` — project overview
- `rubric.md` — Done checklist for design work
- `docs/history/project_log.md` — log of notable skill changes and decisions
- `examples/good-answer.md` — приклад правильної відповіді за скілом
- `examples/bad-answer.md` — приклад типових помилок
