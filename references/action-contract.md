# Action Contract

Цей файл описує обов'язковий порядок роботи для будь-якої UI/design задачі.

Головний принцип: дизайн починається зі структури, а не з декору.

## 1. Context Load

Перед дизайном або правкою UI перевір:

- `AGENTS.md`, `README.md`, `SPEC.md`, `rubric.md`;
- `DESIGN.md`, якщо він є в цільовому проєкті;
- `tokens.css`, `tokens.json`, theme config, Tailwind/shadcn config або інший token source;
- existing components/primitives;
- уже відрендерений UI, якщо задача стосується існуючого продукту;
- доступний preview/browser шлях для visual QA.

Якщо це існуючий продукт, поточний UI і tokens мають пріоритет над будь-якою красивою теорією.

## 2. Mandatory Order

Виконуй дизайн у такому порядку:

```text
goal -> source of truth -> spacing mode -> skeleton -> responsive plan -> grid -> alignment -> components -> tokens -> color/accent -> implementation -> visual QA
```

Не починай із кольорів, shadows, gradients, icons або animation.

## 3. Goal And Skeleton

До стилів визнач:

- primary user;
- primary task;
- success state;
- primary content;
- secondary content;
- loading/empty/error states;
- navigation/escape path.

Після цього зроби skeleton:

- semantic regions: header, nav, main, aside, footer, dialog, form, table, card list;
- content priority per viewport;
- що зникає, що переноситься, що лишається sticky/fixed;
- які дані мають прийти з API/БД/admin, а не бути зашиті вручну.

## 4. Spacing Mode

`4x` і `Fibonacci` є альтернативами.

Decision flow:

1. Existing product: знайди `DESIGN.md`, spacing tokens і computed styles. Збережи чинну шкалу.
2. Existing product with prior mode: якщо `DESIGN.md`, tokens або попередні налаштування вже фіксують `4x`, `Fibonacci` або custom scale, використовуй їх.
3. New work: якщо користувач має preference, використовуй його.
4. New work without preference:
   - `4x` для operational UI, admin, dashboards, forms, щільних systems;
   - `Fibonacci` для editorial, landing, marketing, виразнішої композиційної ритміки.
5. Якщо контекст неоднозначний і spacing rhythm є ключовим рішенням, постав одне коротке питання або обери `4x` як conservative default і назви це припущенням.

`4x` tokens:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
```

`Fibonacci` tokens:

```text
5, 8, 13, 21, 34, 55, 89
```

Винятки:

- borders/hairlines: `1-2px`;
- optical correction для icons/forms: `1-2px`, якщо пояснено;
- font size, line-height, letter-spacing беруться з readability/type tokens;
- responsive layout може використовувати `clamp()`, `minmax()`, `fr`, percentages, intrinsic sizing;
- touch target може мати невидиму hit area більшу за видимий icon.

## 5. Grid And Alignment

Побудуй grid до компонентів.

Рекомендований порядок:

1. Mobile-first base: `1fr`.
2. Content-driven breakpoints, а не випадкові device guesses.
3. Desktop macro layout може використовувати Golden Canon-inspired ratio, якщо це допомагає контенту.
4. `grid` для page structure, `flex` для внутрішнього розкладу компонента.
5. `gap` для rhythm, не margin hacks.
6. Alignment lines для key edges, baselines, controls, card boundaries.

Golden Canon-inspired layout є macro guide, не pixel prison. Existing project layout, accessibility і content behavior мають пріоритет.

## 6. Components And Tokens

Спочатку шукай, потім створюй.

Перед новим component/token перевір:

- project component library;
- primitives;
- existing CSS/classes;
- token files;
- snippets/component sources з `references/component-sources.md`;
- installed dependencies.

Новий component/token дозволений тільки після короткої пропозиції:

- що додаємо;
- чому існуючого не вистачає;
- де буде використовуватися;
- як впливає на систему.

## 7. CSS Guardrails

Заборонено як нормальний шлях:

- `!important`, крім documented emergency escape hatch;
- fixed heights for core layout;
- `overflow-x: hidden` як маскування layout bug;
- random z-index;
- absolute positioning для основної композиції;
- one-off hex/rgb values при наявних color tokens;
- new shadow/radius/button style без approval.

Якщо CSS треба додати, спочатку trace existing CSS і ownership.

## 8. Responsive Plan

Мінімальна web-перевірка:

```text
320, 375, 414, 768, 1024, 1366, 1440, 1920px
```

Якщо проєкт має власну matrix, використовуй її.

Перевір:

- mobile-first reflow;
- no accidental horizontal scroll;
- touch targets;
- table/card/list behavior;
- long labels;
- real data;
- zoom;
- loading/empty/error states.

## 9. Visual QA

UI не Done без browser/preview/screenshot або чітко названого fallback.

Фінально перевір:

- alignment;
- spacing;
- grid;
- hierarchy;
- contrast;
- readability;
- consistency;
- responsive behavior;
- console/network для web;
- no distorted photos/logos;
- no unapproved colors/components.

Використай `references/quality-gates.md` для повного gate.
