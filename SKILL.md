---
name: vaoferi-design-skill
description: Responsive design skill for operational UI, admin forms, dashboards, and existing product screens that must match the current interface. Use when Codex needs Golden Canon-inspired grids, reusable components, design tokens, strict CSS guardrails, and visual QA without one-off styling drift.
version: 0.1.0
---

# Vaoferi Design Skill

Use this skill when the task involves:

- creating a `DESIGN.md`;
- extracting or formalizing a design system for AI tools;
- making design systems compatible with Google Stitch and Open Design;
- building or extending a primitive/component library;
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

On operational screens, match the existing UI first. Do not invent a new visual language when the current product already has one.

Trace existing CSS before writing new CSS.

Treat `!important` as an emergency escape hatch, not a normal fix.

Correct order:

```text
goal → DESIGN.md → primitives → hierarchy → grid → alignment → components → tokens → style → visual QA
```

If this order is skipped, the design is not finished.

Покроковий сценарій роботи:

1. Зрозумій ціль і дію користувача.
2. Створи або знайди `DESIGN.md` як єдиний дизайн-контракт.
3. Почни primitive library перед сторінками.
4. Побудуй grid перед кольорами та ефектами.
5. Намалюй alignment lines.
6. Спочатку знайди існуючі компоненти.
7. Застосуй tokens перед ad-hoc значеннями.
8. Попроси approval перед новими компонентами, кольорами або scale.
9. Перевір responsive behavior на релевантних breakpoints.
10. Закінчуй тільки після visual QA.

### Інструменти

Використовуй детерміновані інструменти першими:

- скрипти `Bash`, `Python`, `Node.js`;
- `API`-виклики;
- довідкові файли;
- існуючі components і tokens;
- browser/preview для фінальної візуальної перевірки.

Код і скрипти тут надійніші за текст, бо вони детерміновані. Якщо є готовий скрипт або API, використовуй його замість ручного переписування логіки.

### Речення перед новим компонентом / токеном

Якщо потрібен новий токен чи компонент, спочатку дай конкретну пропозицію в такій формі:

- що додаємо;
- чому існуючих елементів не вистачає;
- де буде використовуватися;
- як це вплине на систему.

Пропозиція має бути зрозумілою без додаткових уточнень.


## Conflict Rule

If sources or libraries contradict each other, stop and ask the user which approach to follow. Do not silently choose one.

## Design System First

For any new product, redesign, landing, dashboard, admin UI, or multi-page flow, create or update the design system before creating screens.

The design system must be useful to both:

- Google Stitch / `DESIGN.md` consumers;
- Open Design / agent workflows that bind `DESIGN.md` + `SKILL.md` + live artifacts.

Minimum source-of-truth files:

```text
DESIGN.md
tokens.css
tokens.json
components/ or primitives/
```

If the project already has a different design-system location, use the existing location and do not duplicate it.

### `DESIGN.md` Contract

`DESIGN.md` is the portable design contract. It must combine:

- YAML front matter for machine-readable tokens;
- Markdown sections for human-readable intent and usage rules.

Use this canonical section order unless the project already has a stricter format:

```text
Overview
Colors
Typography
Layout
Elevation & Depth
Shapes
Components
Do's and Don'ts
```

Token references must use `{path.to.token}` style where supported, for example:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3}"
```

Hard rules:

- Tokens are normative. Prose explains intent.
- Do not create page designs before primary colors, typography, spacing, radius, and base components are named.
- Do not use purely aesthetic names like `blue1` or `nice-card`; use semantic names like `primary`, `surface`, `button-primary`, `card-default`.
- Unknown sections may be preserved, but duplicate canonical sections are a defect.
- Component variants are separate named entries when the format expects that, for example `button-primary-hover`.

When Node/npm is available, validate `DESIGN.md` with the Google CLI:

```bash
npx @google/design.md lint DESIGN.md
```

On Windows package scripts, prefer the `designmd` binary alias if `.md` command resolution breaks.

### Primitive Library Bootstrap

Before making the first screen, start a primitive library. It prevents every page from inventing a new button, card, input, badge, or spacing value.

Minimum primitives:

```text
Button
IconButton
TextField
Textarea
Select
Checkbox
Radio
Switch
Card
Badge
Link
Heading
Text
Stack
Cluster
Grid
Container
Section
Divider
Modal/Dialog
Toast/Alert
Tabs
Accordion
Tooltip
Dropdown
Table/DataList
Pagination
EmptyState
LoadingState
ErrorState
```

Each primitive must have:

- purpose;
- allowed variants;
- states;
- token dependencies;
- accessibility notes;
- one minimal code/example usage;
- where it is used first.

Do not build a large component family upfront. Start with the smallest primitives needed for the current flow, then extend only when reuse is real.

### Generator Compatibility Prompt

When asking Stitch, Open Design, Codex, Claude Code, Cursor, or another agent to generate UI, include:

```text
Use DESIGN.md as the source of truth.
Use existing primitives before creating new elements.
If a primitive or token is missing, propose it first.
Do not invent new colors, spacing, radius, shadows, button styles, or card styles.
Return code that maps back to named tokens and primitives.
```

If a generator returns HTML/CSS that uses unnamed values, convert those values back into tokens or reject the output as draft-only.

### Handoff Requirements

A design system is not ready for a coder until it includes:

- `DESIGN.md` with canonical sections;
- exact token values for colors, typography, spacing, radius, and elevation;
- primitive list with reuse rules;
- component-state rules for hover, focus, active, disabled, loading, empty, error;
- responsive breakpoints and container rules;
- accessibility requirements;
- examples of allowed and forbidden patterns.

If any item is missing, report it as a gap instead of pretending the system is complete.

## Golden Canon Grid

All layout structures MUST follow the Golden Canon Grid unless the user explicitly overrides it.

**Golden Canon Grid** — це структура, а не декорація. Вона задає порядок у розміченні: де головне, де другорядне, де рамка, де ритм. Без цієї структури кожен елемент буде “плавати” і вирівнюватись на sight, а не за правилом.

**Required rules:**
- Desktop ratio: `grid-template-columns: 1.618fr 1fr` for Main Content / Sidebar.
- Responsive: start mobile-first with `1fr`, then activate golden ratio at `min-width: 701px`.
- Spacing: use Fibonacci steps (`5, 8, 13, 21px`) for `gap`, `padding`, and section separation.
- Typography: prefer modular scale; `1.618` may be used for one-step size jumps, but do not force every header/body pair through a strict `1.618` cascade.
- Antipatterns:
  - NEVER use fixed `height` for layout containers.
  - Use `min-height: 100vh` for full sections only when it makes sense.
  - Use `minmax(300px, 1fr)` for flexible columns instead of forcing exact widths.
  - NEVER rely on `float` for layout.
  - Avoid absolute positioning for core layout.
  - Don't use random margin hacks on children to compensate for a broken grid.
- Semantic areas: use `grid-template-areas` for readable structure (header, sidebar, content).
- Alignment levels: `justify-items` / `align-items` for cell content; `justify-content` / `align-content` for whole-grid positioning.
- Gap semantics: treat `row-gap` / `column-gap` as track spacing, not element margins.
- Propagation rule: changing a token in the base primitive must update dependent components automatically (umbrella effect).

### Golden Canon Pattern

Use this as a starting reference for desktop composition.

- Primary content occupies the larger golden track.
- Sidebar or secondary content occupies the smaller track.
- Page content stays inside one centered global container.
- Use token-based padding and Fibonacci spacing to preserve rhythm.
- Keep key visual focal points inside golden columns, not edge-aligned.

## Golden Canon Anti-patterns

If you recognize any of these, redesign before adding decoration.

- Layout that looks balanced only when window is fully maximized.
- Content pinned to the bottom by an enormous fixed height.
- Two columns collapsing into one another on tablet because of hardcoded pixel widths.
- Elements aligned to the right edge but not to any visible grid column.
- Box model drift caused by children adding their own margins instead of trusting grid gap.
- Responsive breakpoint chosen by guessing screen percentage instead of content needs.

### What to do instead

- Use `max-width` on a centered container, not full-width justification as balance.
- Replace fixed `height` with `min-height` or natural content height.
- Use `minmax()` and flexible tracks; switch layout at content-needed breakpoints.
- Align key elements to explicit grid tracks, not viewport edges.
- Keep spacing in the grid layer (`gap`, padding, section rhythm); avoid child margin resets.
- Choose breakpoints from content behavior, not device percentages.

## Audio-derived principles

The audio reviews added one more important rule: Golden Canon is a planning tool, not a prison.

Use it like this:

- Apply golden proportions to the macro layout first.
- Use `subgrid` for strict alignment only where a child must inherit the parent lines. For example, a card section with aligned headings, bodies, and actions across rows often benefits from inheriting the parent grid tracks rather than recreating spacing tokens inside each card.
- Use `repeat(auto-fit, minmax(...))` for card zones, galleries, and flexible collections.
- Use `clamp()` for typography and spacing when the value must grow safely with viewport size.
- Use `fr` units for available space, not fixed percentages or pixel locks.
- Keep `grid` for page structure and `flex` for the interior of components.
- Prefer `gap` over child margins for rhythm.
- Treat `justify-content` and `justify-items` as different tools:
  - `justify-content` moves the whole track system inside the container;
  - `justify-items` aligns content inside each cell.
- Allow the browser to do the math. Do not hand-compute every column or every line when the browser can preserve the same proportion for you.

### What the audio warned against

- Do not force a literal 1.618 ratio on every block.
- Do not build a giant 16-column matrix when the page only needs a simpler layout.
- Do not use fixed `px` widths for core structure if the layout must breathe.
- Do not solve macro layout with `float`, `clearfix`, or margin hacks.
- Do not let accessibility collapse when font size or viewport size changes.

### What the audio encouraged

- Use one global grid for the page.
- Use local nested grids for sections that need their own rhythm.
- Let cards reflow naturally as the viewport narrows.
- Keep the system elegant, but make it cheap for the browser to render.
- Preserve aesthetics without creating invisible complexity for the next developer.


## NotebookLM Integration

Use NotebookLM as a lightweight research layer only when its CLI is available and authenticated.

**Typical workflow for this skill:**
```text
notebooklm list
notebooklm use <id>
notebooklm ask "<запит>"
```

Use this form in project log:

```text
NotebookLM ask: "<текст запиту>" -> [used / pending]
```

Treat output as draft reference only.
Use it to pressure-test candidate rules and examples, not as the source of truth.
Human review and approval required before committing NotebookLM-derived rules.

If NotebookLM access fails: do not retry in a loop. Mark the status once, switch to other sources/docs/web search, and continue. Mark current session access as unavailable until auth is restored.

## Examples

Read `examples/good-answer.md` when you need the shape of a correct response on an operational UI task.

Read `examples/bad-answer.md` when you need the anti-patterns in front of you: new CSS first, `!important`, overflow hacks, and fixed heights.

## Working Process

### 1. Approval Flow

Before implementing a new component, token, layout pattern, CSS escape hatch, or non-trivial change, present a concrete proposal.

Use exactly this form for every blocking approval:

```text
[Пропозиція] коротко що і чому
```

Example of a concrete proposal:

```text
[Пропозиція] Додати токен `--radius-md: 8px` для карточок.
Чому: в проекті є `--radius-sm` і `--radius-lg`, але для середніх карточок немає проміжного значення — зараз кожен компонент вигадує власне число.
Де використовується: карточки товарів, карточки статей, модальні вікна.
Ефект на систему: уніфікація радіусів без нового компонента.
```

Example of a realistic blocking case:

```text
[Пропозиція] Використати єдиний макет HERO на всіх лендінгах.
Чому: зараз кожен лендінг має свій HERO-рішення без спільної сітки; це ламає дизайн-систему і ускладнює масштабування.
Де використовується: всі лендінги проєкту.
Ефект на систему: один еталонний макет, решта адаптується через варіанти, а не за новим компонентом.
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

### 3. Conflict Form

Use this form when sources, libraries, or rules conflict:

```text
[Конфлікт] що суперечить чому / що треба вибрати
```

Example:

```text
[Конфлікт] `btn()` у проекті використовує `--radius-sm`, а в інструкції пропонується `--radius-md` для карточок.
Паралельний конфлікт: дизайн-токен проти layout-рекомендації.
Чекаю вибору: який стандарт перемагає?
```

Wait for the user's reaction:
- 👍 / +1 / "так" / "Правильно" → apply the first option
- 👎 / "ні" → apply the second
- 💬 / text feedback → adjust and re-propose
- no reaction → do not assume preference; notify that work is blocked until resolved

### 4. README maintenance rule

`README.md` must stay:
- accurate (reflects current SKILL.md rules);
- engaging (not gray, not boring);
- selling the skill (clear value for users, not just tech spec).

Before finalizing any session, verify README matches SKILL.md content.

**READMAINTenance Pipeline**

Use this before publishing changes to `README.md`:

```text
1. Confirm each key rule from SKILL.md
2. Add a short value statement for the user
3. Check that the code example matches the current stack
4. Remove outdated fragments
```

If `README.md` describes one set of rules, and `SKILL.md` has others:
- do not rewrite `SKILL.md` to fit the old README;
- update `README.md` to match the active skill.

A README with a different technical description than SKILL.md is a potential conflict source. Resolve it before treating the task as done.

### 5. SkillOpt Improvement Loop

Use Microsoft SkillOpt as a periodic improvement tool, not as an automatic editor.

SkillOpt reference behavior:
- it treats the skill document as trainable text while the target model stays frozen;
- it uses rollout -> reflect -> aggregate -> select -> update -> evaluate;
- candidate edits must pass validation gates before becoming the best artifact;
- the deployable output is `best_skill.md`.

Routine tracking after real skill use:

```text
1. Capture the task prompt.
2. Capture which skill rules were used.
3. Capture result quality: Pass / Partial / Fail.
4. Capture concrete misses: skipped DESIGN.md, weak primitives, CSS drift, poor QA, unclear approval, etc.
5. Capture the smallest rule change that might prevent the miss.
```

Record notable observations in `docs/history/project_log.md`.

Run a SkillOpt review only when there is enough signal:

```text
- after 5+ real uses with repeated friction;
- after 3+ failures of the same type;
- before a major rewrite of SKILL.md;
- monthly, if the skill is actively used.
```

Do not run SkillOpt on one anecdote.

When running SkillOpt:

```text
pip install skillopt
python scripts/train.py ...
```

Use project-specific design tasks as the benchmark split. Include both good and bad examples.

Required split shape:

```text
train/ - examples allowed to teach from
val/   - validation gate; candidate must improve here
test/  - final check; do not tune against it
```

Acceptance rule:

```text
best_skill.md is evidence, not authority.
```

Before accepting `best_skill.md`:
- compare it against `SKILL.md`;
- reject any change that weakens Design System First, primitive reuse, token discipline, approval flow, CSS guardrails, visual QA, accessibility, or no-Done-without-evidence;
- keep rejected edit notes so the same weak idea is not retried blindly;
- manually merge only the useful parts into `SKILL.md`;
- update `README.md`, `rubric.md`, examples, and `project_log.md` if behavior changed.

Optional monitoring:

```text
pip install "skillopt[webui]"
python -m skillopt_webui.app
```

Use the WebUI only for reviewing runs. Do not commit raw run outputs, API keys, `.env`, or large generated artifacts.

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

## 4. Component Library

Treat the project component library as the first source of truth.

If a component exists, reuse it unchanged unless the user explicitly requests a redesign.

If the project has `DESIGN.md`, `tokens.css`, `tokens.json`, `components/`, or `primitives/`, read those before checking page-level code.

If a component does not exist, continue through the resolution pipeline below.

## 5. Component Resolution Pipeline

When a new UI element is needed, resolve it in this exact order.

**1. Project's component library / design system**
- Where to look: `DESIGN.md`, `tokens.css`, `tokens.json`, `src/design-system`, `components/`, `primitives/`, storybook, approved components folder.
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
- If the generated element will be reused, add it to the primitive library first, then use it on the page.

## 6. New Component Approval

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

## 7. Responsive Behavior

The layout must stay stable across screen sizes.

Check at least:

```text
readable
mobile-friendly
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

### Mobile-First Rules

- Start from the narrowest supported width first; 320px and 360px are real targets, not edge cases.
- Write mobile styles as the default. Add larger-screen changes with `@media (min-width: ...)`, not the other way around.
- Set `box-sizing: border-box` before width math so padding and borders do not break narrow layouts.
- Keep interactive controls large enough for touch. Aim for about `44px` minimum hit size when the control matters.
- Prefer `rem` for text and spacing that must respect user font settings.
- Let flex items shrink. Long labels and controls must not force a row wider than the screen.
- Keep one primary action per small screen when possible. Move secondary actions into a sheet, menu, or another step instead of crowding the first view.
- Allow local horizontal scroll only when the content is intentionally scrollable. Never use it as a repair for a broken layout.
- Keep mobile line length, spacing, and card density calm. If the screen looks squeezed, simplify the composition before adding more chrome.

## 8. Photos, Logos, and Alt Context

Do not distort photos.

Do not stretch logos.

Do not crop important faces, hands, objects, or text without purpose.

On mobile, scale media with `max-width: 100%` and `height: auto` by default.

Use `object-fit: cover` when a crop must fill a card without distortion.

Use `<picture>` when mobile needs a different crop or source instead of stretching the desktop image.

Check:

- aspect ratio;
- focal point;
- contrast;
- readability;
- logo visibility;
- image quality.

Photos and logos are not clay. Do not torture them into the layout.

Fix the layout instead.

## 9. Default UI Component Library

Agent must treat this list as standard reusable UI building blocks.

Before generating any new element, verify whether one of these already exists in the project:

```text
button
icon button
card
media card
badge / tag
input
textarea
checkbox
radio
select
combobox
toggle / switch
link
nav / navbar
footer
section
heading
paragraph
list
table / data list
modal / dialog
sidebar
pagination
toast / alert
tabs
accordion
breadcrumb
tooltip
dropdown
step / progress indicator
carousel / slider
```

Rule:
- reuse existing component when matched;
- otherwise adapt the closest one only in mismatched parts;
- generate from scratch only after all sources are checked.

No design task should start with creating a new button, card, or badge just because one version exists.

## 10. CSS Guardrails

CSS must support the design system and must not fight it.

Before changing a UI element:

- trace the existing selector, component, token, utility, or inherited rule that already owns it;
- inspect the current page styles before writing new CSS;
- prefer extending the existing source of truth over stacking a new rule on top.

Hard rules:

- Do not write new CSS if an existing selector, token, variant, or component can solve the change cleanly.
- `!important` is forbidden by default. Use it only for one explicitly justified emergency escape hatch for the whole site.
- Do not use one-off margin hacks, fixed heights for core layout, `overflow-x: hidden` as a fix, random z-index escalation, duplicate selectors, dead CSS, or hardcoded spacing/color values when tokens already exist.
- Prefer flat, traceable class naming for components, BEM-style or equivalent, so ownership stays obvious.
- Use `@container` for component-local adaptation when the same component appears in different widths or wrappers; use viewport media queries for page-level layout.

Code hygiene:

- Keep specificity low.
- Give each class or rule one job.
- Prefer composition, variants, and tokens over duplicated styles.
- If the source of a style is unclear, trace it before patching visually.
- Fix the real cause, not the symptom.

## 11. Use Design Tokens

Prefer the token names and values from `DESIGN.md` first.

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

Token output should be portable:

- `DESIGN.md` for agents and Stitch/Open Design workflows;
- `tokens.css` for CSS custom properties;
- `tokens.json` for code tooling or future exports;
- optional Tailwind config only if the project already uses Tailwind.

If `npx @google/design.md lint DESIGN.md` is available, run it before claiming the design contract is valid. Treat warnings as review items, not automatic failure, unless they break the current project.

### 11.1 Missing Token/Component Fallback

When an element, token, or primitive is not available:

1. Try the nearest existing component and adapt only the mismatched parts.
2. If nothing matches, propose a minimal addition first:
   - one token;
   - one variant;
   - one helper.
3. Do not add full new libraries, themes, or component families for a single case.
4. Every addition must have:
   - purpose;
   - reuse scope;
   - effect on the design system.

If there is no approval path, stop and report why the task is blocked.

### 11.2 Component Shape

A new component should have the smallest reusable shape, not every feature imagined upfront.

Checklist before adding one:
- one primary purpose;
- smallest meaningful contract: inputs, variants, states;
- default, loading, empty, and error states covered only if the component really needs them;
- reuse existing primitives for style, not custom duplications;
- adapt nearest existing component before generating new markup;
- limit new variants to what is actually reused.

If a component is created for one case only, it is probably not a component. Use a helper, a variant, or a token instead.

## 12. Visual QA

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

### Visual Polish

Good design should feel calm and intentional, not merely functional.

- rhythm, spacing, and whitespace feel balanced;
- typography is readable and restrained;
- color accents are limited and purposeful;
- motion, hover, and focus states are subtle;
- the mobile version looks designed, not like a squeezed desktop fallback.

### Visual QA Threshold Rule

First fix must keep:
- layout alignment;
- readable content;
- accessible controls;
- preserved media quality.

Second attempt:
- if the result drifts or breaks responsive behavior, roll back the last change instead of adding another layer of fixes.

Third attempt:
- stop.
- report:
  - current symptom;
  - last change;
  - suspected root cause;
  - proposed next step that cannot break layout.

Escalation:
- if the symptom returns twice, escalate to the user before the next fix.

### Visual QA Checklist

Use this checklist to verify the result concretely.

```text
- Структура гриду?
  - Візуальна сітка зберігає ієрархію?
  - Елементи не плавають випадково?
  - Відсутній випадковий горизонтальний скрол?

- Компоненти?
  - Компоненти використовуються з бібліотеки?
  - Стилі повторюються логічно?
  - Дублікатів немає?
  - Не створено нових стилів без необхідності?

- Токени?
  - Кольори беруться з токенів?
  - Відступи йдуть через токени?
  - Радіуси/тіні нормалізовані?
  - Нема випадкових hex/rem чисел поза токенами?

- Адаптив?
  - Як виглядає на 320px, 768px, 1024px, 1440px?
  - Карточки не змикаються?
  - Текст є читабельним?
  - Кнопки залишаються доступними?

- Медіа?
  - Фото не розтягнуті?
  - Логотипи не спотворені?
  - Картинки зберігають пропорції?

- Поведінка та стани?
  - Loading, error, empty, disabled, hover, focus?
  - Кнопки, форми, карточки мають явні стани?
  - Немає "шаблонного" стану, який глючить при інтеракції?
```

If any item fails, stop. Fix the structure first.
Only after checklist is clean the design can be considered Done.

### Visual QA Form

Use this exact form to report the result of every visual QA check:

```text
[Результат QA] Pass / Fail / Partial
Де перевірено: ... (browser / preview / outro)
Що саме перевірено: ...
Які недоліки знайдено: ... / None
Що виправлено: ... / None
Ризики: ...
```

QA is visual evidence, not hope.
Do not replace this block with generic status text.

## 13. Accessibility & Resilience QA

Accessibility must not be an afterthought.

For serious layouts verify that:
- keyboard focus remains visible and logical;
- interactive controls are reachable and operable;
- text remains readable when base font size increases;
- layout does not break at browser zoom up to 150%;
- meaningful media do not lose context when scaled.

If visual or browser inspection is not possible, state the limitation explicitly.

If an issue is found, fix it before marking Done.

## 14. Text/Encoding Done

The task is Done only when:
- the goal is clear;
- hierarchy is defined;
- the grid is defined;
- alignment is checked;
- components are reused;
- new elements are approved;
- tokens are respected;
- layout is responsive;
- accessibility and resilience are verified;
- photos are not distorted;
- logos are not stretched;
- visual QA is complete;
- risks are reported;
- limitations are stated clearly.

If any of these are missing, the task is not Done.

## 15. Golden Canon Layout Blueprint

Use this blueprint as a concrete starting point for a standard editorial/service layout:

```html
<section class="section">
  <div class="container">
    <div class="golden-grid">
      <header class="header" aria-label="Page header">...</header>
      <main class="content" aria-label="Main content" id="main-content">
        <h1>Primary heading</h1>
        <p>Supporting text, CTAs, content blocks.</p>
      </main>
      <aside class="sidebar" aria-label="Secondary content">...</aside>
      <footer class="footer" aria-label="Page footer">...</footer>
    </div>
  </div>
</section>
```

```css
.section {
  /* Use min-height only when the content needs more vertical room.
     Do not force every section to 100vh. */
}

.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-canon-s, 8px);
}

.golden-grid {
  display: grid;
  gap: var(--space-canon-s, 16px);
  align-items: start;
}

@media (min-width: 701px) {
  .golden-grid {
    grid-template-columns: 1.618fr 1fr;
  }
  .header,
  .footer {
    grid-column: 1 / -1;
  }
}
```

Blueprint rules:
- larger track = primary content
- smaller track = secondary content
- header and footer span the full grid explicitly, not with margin hacks or `width: 100%` overrides
- `gap` and container padding are the source of rhythm, not child margins
- if the screen is narrower than `701px`, collapse to a single column unless there is a concrete usability reason

If the task fits this structure, start from this blueprint first and only diverge for a concrete content or accessibility reason.

## Short Self-Check
Before the final answer, verify:

```text
Did I understand the goal?
Did I create or respect DESIGN.md for a design-system or multi-screen task?
Did I start or update the primitive library before inventing page-specific elements?
Did I define hierarchy?
Did I build a grid?
Did I align elements?
Did I reuse components?
Did I avoid random styles?
Did I check responsiveness?
Did I protect photos and logos?
Did I verify keyboard and zoom resilience?
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
- Typography scale: prefer a modular scale; `1.618` can be used for major jumps, but avoid forcing every heading/body pair through a strict cascade
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
- `--space-canon-s: 16px` for small gaps and internal padding
- `--space-canon-l: 15rem` for section vertical rhythm
- `--grid-main-cols: 1.618fr 1fr` for desktop canon layout

Health check:
- Content resilience under overflow and zoom
- No fixed heights
- Primitive registry concept for base components
- Token propagation: changing one token updates dependent components
- Breakpoint logic changes structure, not only sizes

## Minimal Token Contract (No-Token Project Fallback)

If the project has no token system yet, use this minimal shared contract before creating one-off values.

Record it in `DESIGN.md` first, then mirror it to CSS variables.

```text
--space-xs: 4px
--space-sm: 8px
--space-md: 13px
--space-lg: 21px
--space-xl: 34px
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
```

Rules:
- Map every project spacing decision to one of these eight values.
- Map every radius decision to `--radius-sm | --radius-md | --radius-lg`.
- Use this contract as a temporary primitive registry until a full token system is approved.
- Create the first primitives against this contract before styling full pages.

## References and Updates

Track only verified sources:

- Project log: record notable rule changes and decisions in `docs/history/project_log.md`.
- Golden Canon-inspired references: retain official or canonical sources only when applicable; otherwise mark `goldenCanon-inspired`.
- CSS Grid and component libraries: add only advice that already aligns with current repository rules.
- Web research and GitHub references: quote link, issue, commit, or demo; do not rely on generic wording.
- NotebookLM output: log when it was used; do not treat it as a primary source for rules.
- Modern layout guidance: prefer CSS Grid for macro layout, Flexbox for component internals, and `repeat(auto-fit, minmax(...))` for flexible content collections.
- Component naming guidance: name variants by role or meaning, not by visual detail or color, so reuse stays stable when one variant changes.
- SkillOpt guidance: use `microsoft/SkillOpt` only with recorded rollouts, train/val/test splits, validation gates, and reviewed `best_skill.md`.

## Changelog

- 2026-01-28 — initial curation pass completed. Added visual QA threshold rule, visual QA form, visual QA checklist.
- 2026-06-04 — added mobile-first guardrails and visual-polish checks: mobile as the default, `box-sizing`, `rem`, 44px touch targets, one primary action per small screen, and calm composition on narrow widths.
- 2026-06-04 — tightened CSS guardrails for operational UI. Added selector tracing, `!important` emergency-only rule, and clean-code constraints for style changes.
- 2026-06-04 — added Design System First workflow for `DESIGN.md`, Stitch/Open Design compatibility, primitive library bootstrap, and generator handoff rules.
- 2026-06-04 — improved README.md: added explicit “What this skill does / does NOT do” statements to reduce interpretation drift.
- 2026-06-04 — added SkillOpt Improvement Loop for trace collection, periodic review, validation-gated `best_skill.md`, and manual merge safeguards.
