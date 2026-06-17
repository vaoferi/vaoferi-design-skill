# Quality Gates

Кожен design/UI результат має пройти ці gates. Якщо перевірка неможлива, звіт має назвати точну причину.

## 20 Principles Gate

| # | Принцип | Правило | Evidence |
|---|---|---|---|
| 1 | Відступи | `padding`, `margin`, `gap` використовують existing scale, `4x` або `Fibonacci`; винятки documented. | Computed styles/tokens checked. |
| 2 | Сітка | Спочатку global grid, потім local grids; Golden Canon-inspired ratio тільки коли допомагає контенту. | Grid overlay/DOM/CSS evidence. |
| 3 | Візуальна ієрархія | Primary task/content/CTA видно першими; secondary content не конкурує. | Squint/grayscale/manual visual check. |
| 4 | Типографіка | Project fonts/type tokens; body приблизно `0.875-1.125rem`, line-height `1.4-1.7`, headings `1.1-1.3` unless justified. | Browser zoom/base-font check. |
| 5 | Контраст | Normal text `4.5:1`, large text `3:1`, meaningful non-text/focus `3:1`; color не є єдиним носієм значення. | Contrast check for states. |
| 6 | Баланс елементів | Visual weight навмисний на mobile і desktop; асиметрія має focal reason. | Mobile/desktop visual review. |
| 7 | Масштабованість | Mobile-first; content-driven breakpoints; reflow до `320 CSS px`, zoom до `200%`/`400%` where relevant. | Responsive matrix evidence. |
| 8 | Акценти | Акцент веде до primary task/status/change; одночасні акценти обмежені. | Blur/grayscale/state review. |
| 9 | Вирівнювання | Edges, baselines і controls прив'язані до alignment lines; optical correction `1-2px` documented. | Grid lines/coordinates. |
| 10 | Цілісність кольорової палітри | Semantic color tokens і brand palette; new color only with approval. | Token audit, no unapproved hex/rgb. |
| 11 | Читаємість тексту | Long text `45-75` chars per line where relevant; no centered long paragraphs; labels/units/errors clear. | Real content and language expansion. |
| 12 | Послідовність стилів | Same role uses same component/token/interaction pattern. | Component/token audit. |
| 13 | Вільний простір | Whitespace shows grouping/hierarchy; compact admin UI still separates related/unrelated groups. | Grouping review. |
| 14 | Зрозуміла навігація | Current location, back/close behavior, destination links and shareable state are clear where relevant. | Route/keyboard/pointer check. |
| 15 | Швидкість завантаження / вага сторінки | Do not regress agreed budget; new web target: `LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1`; static assets checked by size/export. | Lighthouse/WebPageTest/baseline or export metrics. |
| 16 | Фокус на користувачі | Every screen has primary user, task and success outcome. | Main flow can be completed. |
| 17 | Інтуїтивність взаємодії | Semantic controls and visible states: focus, active, hover, loading, success, error. Touch target aim around `44px`; WCAG minimum `24x24 CSS px` or valid spacing exception. | Keyboard/pointer/touch check. |
| 18 | Контекст у деталях | Labels, units, status, permissions, consequences, timestamps, error next steps shown where needed. | Real data plus empty/error/loading states. |
| 19 | Візуальна ритміка | Approved spacing/type/component/section patterns repeat; rhythm breaks only for focal point. | Whole-page and neighboring-screen review. |
| 20 | Тестування на різних пристроях | Web/app: mobile, tablet, desktop, wide desktop; static: every intended export size/crop. | Screenshot/DevTools/E2E/rendered export. |

## Gate Output

Do not write:

```text
Pass: 1-20
```

Write per principle:

```text
[20 Principles Gate]
Spacing mode: existing scale / 4x / Fibonacci
1. Відступи — Pass / Fail / N/A — evidence
2. Сітка — Pass / Fail / N/A — evidence
...
20. Тестування на різних пристроях — Pass / Fail / N/A — evidence
```

`N/A` is valid only with a concrete reason and artifact scope.

## Visual QA Form

```text
Visual QA
- Browser/preview used:
- Viewports checked:
- Console:
- Network:
- Horizontal scroll:
- Alignment:
- Spacing:
- Typography:
- Contrast:
- Responsive behavior:
- Components/tokens:
- Photos/logos:
- Performance:
- Remaining risks:
```

## Done Threshold

Done requires evidence, not hope.

Minimum:

- `quick_validate.py` for this skill repo when the skill changes;
- `git diff --check`;
- exact 20-principle presence check after gate edits;
- UTF-8 without BOM;
- no mojibake patterns;
- visual/browser evidence for UI implementation tasks.
