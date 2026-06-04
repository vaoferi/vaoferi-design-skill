# Rubric: vaoferi-design-skill

Use this rubric to evaluate whether a design task is Done.

## 1. Goal and Hierarchy
- [ ] The goal is clearly defined.
- [ ] User action and content priority are known.
- [ ] Visual hierarchy is established before colors/effects.

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
- [ ] No random magic numbers.
- [ ] No duplicate selectors or duplicate button styles.
- [ ] No hardcoded colors or spacing when tokens already exist.
- [ ] No `overflow-x: hidden` used as a layout fix.
- [ ] `!important` is not used except for one explicit emergency escape hatch that is documented.
- [ ] Specificity stays low and each rule or class has one job.

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
