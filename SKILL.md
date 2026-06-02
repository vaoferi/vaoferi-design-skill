---
name: vaoferi-design-skill
description: Responsive design skill using Golden Canon-inspired grids, reusable components, design tokens, approval gates, and strict visual QA.
version: 0.1.0
---

# Vaoferi Design Skill

Use this skill when the task involves:

- UI design;
- landing pages;
- website sections;
- responsive layouts;
- visual systems;
- component libraries;
- design tokens;
- frontend design;
- YouTube thumbnails;
- banners;
- cards;
- dashboards;
- visual QA.

## Main Rule

Do not design from decoration.

Design from structure.

Correct order:

```text
goal → hierarchy → grid → alignment → components → tokens → style → visual QA
```

If this order is skipped, the design is not finished.


## Conflict Rule

If sources or libraries contradict each other, stop and ask the user which approach to follow. Do not silently choose one.

## Golden Canon Grid

All layout structures MUST follow the Golden Canon Grid unless the user explicitly overrides it.

**Required rules:**
- Desktop ratio: `grid-template-columns: 1.618fr 1fr` for Main Content / Sidebar.
- Responsive: start mobile-first with `1fr`, then activate golden ratio at `min-width: 701px`.
- Spacing: use Fibonacci steps (`5, 8, 13, 21px`) for `gap`, `padding`, and section separation.
- Typography: scale with `1.618` multiplier for `font-size` and `line-height` ratios.
- Antipatterns: NEVER use fixed `height` for layout containers. Use `min-height: 100vh` for sections instead. Use `minmax(300px, 1fr)` for flexible columns.
- Semantic areas: use `grid-template-areas` for readable structure (header, sidebar, content).
- Alignment levels: `justify-items` / `align-items` for cell content; `justify-content` / `align-content` for whole-grid positioning.
- Gap semantics: treat `row-gap` / `column-gap` as track spacing, not element margins.
- Propagation rule: changing a token in the base primitive must update dependent components automatically (umbrella effect).


## NotebookLM Integration

When analyzing sources, treat NotebookLM as a parallel research layer.

- Launch NotebookLM queries alongside material review, not after it.
- Use NotebookLM output to enrich rules, examples, and references in the skill.
- Never rely solely on NotebookLM; human review and approval are required before any changes are committed.
- Every unresolved point from NotebookLM must be marked as **pending** until the user approves it explicitly.

## Working Process

### 1. Approval Flow

Before implementing a new component, token, layout pattern, or non-trivial change, present a concrete proposal.

Use exactly this form for every blocking approval:

```text
[Пропозиція] коротко що і чому
```

Example of a concrete proposal:

```text
[Пропозиція] Додати токен `--radius-md: 8px` для карточок.
Чому: в проекті є `--radius-sm` і `--radius-lg`, але для середніх карточок немає проміжного значення, тому зараз кожен компонент вигадує власне число.
Де використовується: карточки товарів, карточки статей, модальні вікна.
Ефект на систему: уніфікація закруглень без нового компонента.
```

Wait for the user's reaction:
- 👍 / +1 / "так" / "апрув" → approved, commit and continue
- 👎 / "ні" / "відхилити" → discard, do not implement
- 💬 / text feedback → adjust and re-propose
- no reaction → do not assume approval, ask explicitly

### 2. Immediate Commits

All approved changes are committed immediately to the active branch.

After every commit:
- update `SKILL.md` if rules changed;
- check if `README.md` needs an update to stay accurate and engaging;
- push to remote if the connection is available.

### 3. READMAINTenance Rule

`README.md` must stay:
- accurate (reflects current SKILL.md rules);
- engaging (not gray, not boring);
- selling the skill (clear value for users, not just tech spec).

Before finalizing any session, verify README matches SKILL.md content.

## 1. Understand the Goal

Before designing, define:

- what this design must achieve;
- who will see it;
- what action the user should take;
- what content is most important;
- what visual hierarchy is needed.

Do not start from colors, effects, gradients, shadows, or decorative style.

First: purpose.

Then: structure.

Only after that: visual treatment.

## 2. Build the Grid First

Before placing elements, create a flexible layout grid.

Use principles inspired by:

- Golden Ratio;
- Golden Canon Grid;
- modular grids;
- responsive layout;
- visual rhythm.

The grid must define:

- main content area;
- margins;
- columns;
- alignment lines;
- spacing rhythm;
- key focal points;
- responsive behavior.

No important element should float randomly.

Every major element must have a reason for its position.

## 3. Draw Alignment Lines

The agent must decide where the main elements align before final styling.

Check alignment for:

- headings;
- text blocks;
- buttons;
- images;
- cards;
- logos;
- icons;
- navigation;
- section edges.

If elements do not align, fix the structure before adding decoration.

Do not use effects to hide weak composition.

## 4. Component Resolution Pipeline

When a new UI element is needed, resolve it in this exact order.

**1. Project's component library / design system**
- Where to look: the project's dedicated UI library, storybook, `src/design-system`, approved components folder.
- Why: these components already passed design review and consistency checks.
- Rule: use them unchanged unless the user explicitly requests a redesign.

**2. Existing project files (full redesign exception)**
- Where to look: current `src/`, `components/`, `pages/`, `app/`, `sections/`.
- Why: reusing existing code keeps consistency and reduces technical debt.
- Exception: skip this step only for a **full redesign**, where all old components are intentionally replaced.

**3. This skill's built-in library**
- Where to look: `references/components/` inside this skill.
- Why: these patterns are already aligned with this skill's rules.

**4. Libraries already used in the project**
- Where to look: UI frameworks, kits, and dependencies already in `package.json` or imports.
- Rule:
  - If a component is exactly suitable — use it.
  - If it is partially suitable (for example, a button shape is correct but color/hover is wrong) — reuse it and adapt only the mismatched parts.
  - Do not add a new library just for one element.

**5. User reference images**
- Where to look: `references/`, `assets/references/`, or any folder the user specified as visual reference.
- Rule: if an image there matches the requested element, use it as a base.

**6. Generate from scratch**
- Only if all above return nothing usable.
- Even then, generated elements must follow this skill's layout and token rules.

## 5. New Component Approval

The agent must ask the user before adding:

- a new button style;
- a new card style;
- a new icon style;
- a new arrow style;
- a new form style;
- a new layout pattern;
- a new color;
- a new font;
- a new shadow;
- a new radius;
- a new spacing scale.

New components must have a clear purpose.

No “just because it looks nice”.

If a new component is needed, explain:

- why existing components are not enough;
- what the new component does;
- where it will be reused;
- how it affects the design system.

## 6. Use Design Tokens

Use tokens for:

- colors;
- typography;
- spacing;
- radius;
- shadows;
- borders;
- sizes;
- breakpoints.

Do not invent random CSS values if a token already exists.

If a token is missing, propose it and ask for approval.

Design tokens must keep the project consistent across pages and screen sizes.

## 7. Responsive Behavior

The layout must stay stable across screen sizes.

Check at least:

```text
mobile
tablet
desktop
wide desktop
```

For serious web layouts, also check specific widths when possible:

```text
320px
375px
414px
768px
1024px
1366px
1440px
1920px
```

The design fails if:

- elements overlap;
- text becomes unreadable;
- buttons move randomly;
- images stretch badly;
- logos are distorted;
- cards lose rhythm;
- horizontal scroll appears without intention;
- spacing collapses;
- hierarchy becomes unclear.

A responsive layout must adapt, not fall apart politely.

## 8. Photos, Logos, and Alt Context

Do not distort photos.

Do not stretch logos.

Do not crop important faces, hands, objects, or text without purpose.

Check:

- aspect ratio;
- focal point;
- contrast;
- readability;
- logo visibility;
- image quality.

Photos and logos are not clay. Do not torture them into the layout.

Fix the layout instead.

## 9. CSS Rules

CSS must support the design system.

Prefer:

- reusable classes;
- tokens;
- variables;
- components;
- responsive rules;
- clear layout logic.

Avoid:

- random magic numbers;
- one-off styles;
- duplicate button styles;
- hardcoded colors;
- layout hacks;
- hiding overflow as a fake fix.

Do not use `overflow-x: hidden` as a blanket solution for bad layout.

First find the element causing the problem.

Then fix the real cause.

## 10. Visual QA

A design task is not Done until visually checked.

Check:

- grid alignment;
- spacing;
- typography;
- contrast;
- responsive behavior;
- component consistency;
- no accidental horizontal scroll;
- no distorted media;
- no unapproved tokens;
- no duplicated components;
- no broken visual hierarchy.

If browser, preview, screenshot, or design preview tools are available, use them.

If visual QA is not possible, state the limitation clearly.

Do not claim visual quality without seeing the result.

## Definition of Done

The task is Done only when:

- the goal is clear;
- hierarchy is defined;
- the grid is defined;
- alignment is checked;
- components are reused;
- new elements are approved;
- tokens are respected;
- layout is responsive;
- photos are not distorted;
- logos are not stretched;
- visual QA is complete;
- risks are reported;
- limitations are stated clearly.

If any of these are missing, the task is not Done.

## Short Self-Check

Before the final answer, verify:

```text
Did I understand the goal?
Did I define hierarchy?
Did I build a grid?
Did I align elements?
Did I reuse components?
Did I avoid random styles?
Did I check responsiveness?
Did I protect photos and logos?
Did I visually confirm the result?
```

If not, the task is not Done.


## Golden Canon & CSS Grid

Treat the Golden Ratio as a structural rule, not a decoration.

Core numbers:
- phi ≈ 1.618
- Fibonacci steps for spacing: 5, 8, 13, 21

Golden Canon rules:
- Desktop layout ratio: `1.618fr 1fr`
- Typography scale: `1.618`
- Grid columns may use Fibonacci coefficients: `2fr 3fr 5fr`
- Grid gap is track spacing, not element margin
- Semantic layout: use `grid-template-areas` only for major regions; do not force every component into a named area.

Responsiveness:
- Mobile first with `1fr` base; restore canon proportions only when content and width allow it
- Use `minmax(min, max)` and breakpoints, not fixed `fr` on narrow screens
- At `min-width: 701px` enable a wider canon grid; below that keep fewer columns or single column layout

CSS Grid architecture:
- Grid for macro layout
- Flexbox for micro alignment inside cells and component internals
- Avoid fixed heights; prefer `min-height: 100vh` for sections
- Modal overflow: `max-height: 100%` with `overflow-y: auto` on inner container

Naming / tokens:
- `--space-canon-s: 5rem` for small gaps and internal padding
- `--space-canon-l: 15rem` for section vertical rhythm
- `--grid-main-cols: 1.618fr 1fr` for desktop canon layout

Health check:
- Content resilience under overflow and zoom
- No fixed heights
- Primitive registry concept for base components
- Token propagation: changing one token updates dependent components
- Breakpoint logic changes structure, not only sizes
