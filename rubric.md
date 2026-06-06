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
- [ ] Golden Canon is treated as a macro guide, not forced onto every block.

## 2.1 Spacing Mode
- [ ] Existing products preserve their current spacing tokens unless migration was approved.
- [ ] New work explicitly chooses `4x` or `Fibonacci` and records the choice in `DESIGN.md`.
- [ ] `4x` and `Fibonacci` are not silently mixed.
- [ ] Padding, margin, gap, and section spacing use the selected tokens or a documented exception.
- [ ] Borders/hairlines and optical corrections are the only unexplained `1–2px` candidates.

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
- [ ] Web/app breakpoints checked: mobile, tablet, desktop, wide desktop. Static artifacts use their intended export sizes/crops.
- [ ] Web/app key widths checked: 320px, 375px, 414px, 768px, 1024px, 1366px, 1440px, 1920px, or a documented project matrix; unavailable checks have exact limitations.
- [ ] Mobile starts from the narrowest supported width and grows up with `min-width`.
- [ ] `box-sizing: border-box` is set or clearly justified.
- [ ] Flex rows and controls can shrink without forcing horizontal overflow.
- [ ] Touch targets are large enough for the primary mobile controls.
- [ ] One primary action stays visible on small screens when possible.
- [ ] Text stays readable and the layout does not feel cramped on mobile.
- [ ] No overlap, unreadable text, random button movement, stretched media, broken cards.
- [ ] Any horizontal scroll is intentional and local only.

## 7. Media Integrity
- [ ] Photos keep aspect ratio and visible focal points.
- [ ] Logos are not stretched or cropped.
- [ ] No distorted media; layout adapts to content.
- [ ] Mobile media scales with `max-width: 100%` / `height: auto`, and `picture` is used when a different crop is needed.

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
- [ ] Spacing, typography, and color rhythm feel intentional, calm, and readable.
- [ ] The mobile version looks designed, not like a squeezed desktop fallback.

## 9.1 Proposal Readiness
- [ ] Every new component/token/pattern was proposed first: what, why, where, system impact.
- [ ] Proposals are clear enough to approve or reject without extra guessing.

## 9.2 Mandatory 20 Principles Gate
- [ ] 1. Відступи: approved spacing mode використано; grouping читається; computed values перевірено.
- [ ] 2. Сітка: global/local grids і ключові alignment tracks перевірено.
- [ ] 3. Візуальна ієрархія: primary task, content і CTA читаються першими.
- [ ] 4. Типографіка: type tokens, line-height, zoom і збільшений base font перевірено.
- [ ] 5. Контраст: text `4.5:1` / large text `3:1` / meaningful non-text `3:1` або краще.
- [ ] 6. Баланс: visual weight навмисний на mobile і desktop.
- [ ] 7. Масштабованість: reflow до `320 CSS px`, zoom і content-driven breakpoints перевірено.
- [ ] 8. Акценти: є зрозуміла перша точка уваги; акценти не конкурують.
- [ ] 9. Вирівнювання: edges/baselines/controls прив'язані до alignment lines; optical exceptions пояснені.
- [ ] 10. Цілісність палітри: semantic tokens і existing brand palette використані; unapproved colors відсутні.
- [ ] 11. Читаємість: line length, real content, long text, labels, units і language expansion перевірено.
- [ ] 12. Послідовність стилів: одна роль використовує ті самі components/tokens/patterns.
- [ ] 13. Вільний простір: whitespace показує grouping і hierarchy без злипання або випадкових дір.
- [ ] 14. Зрозуміла навігація: relative order, current location, back/close, deep links і refresh state перевірено.
- [ ] 15. Швидкість/вага: web performance budget/baseline або static export size перевірено; web-ціль: `LCP ≤ 2.5s`, `INP ≤ 200ms`, `CLS ≤ 0.1`.
- [ ] 16. Фокус на користувачі: primary user/task/success outcome названі та проходяться без зайвих кроків.
- [ ] 17. Інтуїтивність: semantic controls, feedback states, keyboard/pointer/touch і target sizes перевірено.
- [ ] 18. Контекст у деталях: labels, units, status, permissions, consequences, errors і next steps зрозумілі.
- [ ] 19. Візуальна ритміка: approved patterns повторюються; навмисні порушення rhythm мають причину.
- [ ] 20. Різні пристрої: web/app перевірено на mobile/tablet/desktop/wide; static artifacts перевірено в intended export sizes/crops; real device використано, коли доступний.
- [ ] Для кожного принципу є окремий numbered рядок `Pass / Fail / N/A` з доказом або конкретною причиною.
- [ ] Gate не згорнуто до загального `Pass: 1–20`.
- [ ] Кожен `N/A`, включно з web-only checks для static artifacts, називає перевірений artifact і конкретну причину.

## 10. Documentation Sync
- [ ] `SKILL.md` reflects rules used.
- [ ] `SPEC.md` remains accurate for the active behavior change.
- [ ] `README.md` remains accurate.
- [ ] `docs/history/project_log.md` updated if an architectural decision or notable issue was found.
- [ ] `examples/good-answer.md` and `examples/bad-answer.md` match the current guardrails.

## 11. SkillOpt Improvement Loop
- [ ] Real task observations are logged when the skill succeeds, partially fails, or misses an important rule.
- [ ] Repeated failures are grouped by cause before proposing skill changes.
- [ ] SkillOpt is considered only after enough signal: 5+ real uses, 3+ similar failures, monthly active-use review, or before a major rewrite.
- [ ] Any SkillOpt run uses train/val/test separation, not one-off anecdotes.
- [ ] `best_skill.md` is reviewed against `SKILL.md` before any manual merge.
- [ ] No SkillOpt change weakens Design System First, primitive reuse, token discipline, approval flow, CSS guardrails, visual QA, or accessibility.
- [ ] Raw SkillOpt run folders, `.env`, API keys, and large optimizer artifacts are not committed.
