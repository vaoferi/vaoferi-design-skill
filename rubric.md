# Rubric: vaoferi-design-skill

Use this rubric to evaluate whether a design task is Done.

## 1. Goal and Hierarchy
- [ ] The goal is clearly defined.
- [ ] User action and content priority are known.
- [ ] Visual hierarchy is established before colors/effects.

## 1.1 Design System Contract
- [ ] `DESIGN.md` exists or the reason for not creating it is stated.
- [ ] `DESIGN.md` has YAML tokens plus Markdown rationale.
- [ ] Canonical sections are present when relevant: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
- [ ] Token names are semantic, not visual guesses.
- [ ] Component token references use `{path.to.token}` where supported.
- [ ] `npx @google/design.md lint DESIGN.md` was run when Node/npm access is available, or the limitation is stated.

## 1.2 Primitive Library
- [ ] Primitive library was checked before page-specific UI was created.
- [ ] Missing primitives were added only with purpose, states, token dependencies, accessibility notes, and first-use location.
- [ ] Button, Card, TextField/Input, Text, Heading, Stack/Grid/Container, Empty/Loading/Error states are covered when relevant.
- [ ] New primitives are minimal and reusable, not one-off page fragments.

## 2. Grid
- [ ] A layout grid is defined first.
- [ ] Golden Canon / Golden Ratio informs desktop ratios where appropriate.
- [ ] Mobile-first base is `1fr`; canon proportions activate at sensible breakpoints.
- [ ] Spacing uses Fibonacci steps (`5, 8, 13, 21px`) consistency.

## 3. Alignment
- [ ] Main elements align to the grid.
- [ ] Heading, text, buttons, images, cards, nav, and section edges are aligned.
- [ ] No element relies on effects to hide weak composition.

## 4. Component Reuse
- [ ] Agent checked project component library / design system.
- [ ] Agent checked `DESIGN.md`, `tokens.css`, `tokens.json`, `components/`, and `primitives/` when present.
- [ ] Agent checked existing project components.
- [ ] Agent checked skill built-in references.
- [ ] Agent checked project dependencies before generating new components.
- [ ] New components are approved before being added.

## 5. Design Tokens
- [ ] Colors, typography, spacing, radius, shadows, borders, sizes, breakpoints use tokens.
- [ ] No invented CSS values if a token exists.
- [ ] Missing tokens are proposed and approved before use.

## 6. Responsive Behavior
- [ ] Breakpoints checked: mobile, tablet, desktop, wide desktop.
- [ ] Key widths checked when possible: 320px, 375px, 414px, 768px, 1024px, 1366px, 1440px, 1920px.
- [ ] No overlap, unreadable text, random button movement, stretched media, broken cards.
- [ ] No unintended horizontal scroll.

## 7. Media Integrity
- [ ] Photos keep aspect ratio and visible focal points.
- [ ] Logos are not stretched or cropped.
- [ ] No distorted media; layout adapts to content.

## 8. CSS Guardrails
- [ ] Existing selectors, components, tokens, or inherited rules were traced before adding new CSS.
- [ ] Reusable classes and tokens are preferred over one-off styles.
- [ ] Class naming stays flat and traceable enough to show ownership quickly.
- [ ] No random magic numbers.
- [ ] No duplicate selectors or duplicate button styles.
- [ ] No hardcoded colors or spacing when tokens already exist.
- [ ] No `overflow-x: hidden` used as a layout fix.
- [ ] `!important` is not used except for one explicit emergency escape hatch that is documented.
- [ ] Specificity stays low and each rule or class has one job.
- [ ] `@container` is used when a component must adapt to its own space instead of the viewport.

## 9. Visual QA
- [ ] Result visually checked.
- [ ] Browser / preview / screenshot / DevTools used when available.
- [ ] If visual QA is impossible, the limitation is stated explicitly.
- [ ] Visual QA result is recorded using the Visual QA Form: Pass / Fail / Partial; what was checked; found issues; fixes; risks.

## 9.1 Proposal Readiness
- [ ] Every new component/token/pattern was proposed first: what, why, where, system impact.
- [ ] Proposals are clear enough to approve or reject without extra guessing.

## 10. Documentation Sync
- [ ] `SKILL.md` reflects rules used.
- [ ] `README.md` remains accurate.
- [ ] `docs/history/project_log.md` updated if an architectural decision or notable issue was found.
- [ ] `examples/good-answer.md` and `examples/bad-answer.md` match the current guardrails.
