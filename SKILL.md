---
name: vaoferi-design-skill
description: Use when designing or changing UI, screens, dashboards, admin forms, landing sections, visual systems, DESIGN.md, components, tokens, responsive layouts, or when output must match an existing product instead of random styling.
metadata:
  version: 0.3.0
---

# Vaoferi Design Skill

Цей skill існує, щоб агент не ліпив UI з випадкових кольорів, відступів і компонентів.

Головне правило:

```text
structure first -> existing system first -> tokens/components first -> visual QA before Done
```

## Required References

Для будь-якої UI/design задачі прочитай перед роботою:

- `references/action-contract.md` — порядок дій, spacing mode, grid, alignment, responsive, CSS guardrails;
- `references/component-sources.md` — де шукати елементи, включно з NLM snippets config;
- `references/quality-gates.md` — 20 principles gate і visual QA form.

Для зміни самого skill також прочитай:

- `references/skillopt-and-architecture.md` — діагноз, коли потрібен plugin/agent, SkillOpt workflow.

Якщо reference недоступний, не вигадуй правило з пам'яті. Назви файл, який не прочитався, і працюй з найкращим fallback.

## Mandatory Order

Виконуй дизайн у такому порядку:

```text
goal -> source of truth -> spacing mode -> skeleton -> responsive plan -> grid -> alignment -> components -> tokens -> color/accent -> implementation -> visual QA
```

Цей порядок не декоративний. Якщо він пропущений, задача не Done.

## Context Load

Спочатку знайди джерела правди:

- `DESIGN.md`, якщо є;
- existing UI/screens;
- tokens: colors, typography, spacing, radius, shadows, borders, sizes, breakpoints;
- primitives/components;
- existing CSS and ownership;
- project dependencies;
- preview/browser path для перевірки.

Existing product має пріоритет. Не мігруй spacing, colors, components або visual language без approval.

## Spacing Mode

Обери один режим:

- existing project scale — для існуючих продуктів за замовчуванням;
- `4x` — для operational UI, admin, forms, dashboards, щільних систем;
- `Fibonacci` — для editorial, landing, marketing layouts із виразнішою rhythm.

Правило вибору:

1. Якщо користувач або `DESIGN.md` уже задав режим, використовуй його.
2. Якщо це існуючий продукт, збережи попередні налаштування.
3. Якщо це робота з нуля і preference не заданий, рекомендуй режим за типом інтерфейсу.
4. Якщо контекст неоднозначний і вибір критичний, постав одне коротке питання або обери conservative default `4x` і назви це припущенням.
5. Зафіксуй режим у `DESIGN.md` або звіті.

Не змішуй `4x` і `Fibonacci` мовчки в одному product/flow.

## Component Source Order

Не створюй новий component/token, доки не перевірив:

1. Project `DESIGN.md` and existing UI.
2. Project components/primitives/tokens.
3. Installed dependencies.
4. Local NLM snippets config:

```text
\\NAS\homes\vaoferi\Work\nlm\public_html\config\config\mcp-snippets.config.json
```

Перевір snippets source командою:

```bash
python scripts/validate_snippets_source.py
```

Після цього можна брати зовнішні references як патерни, але не як автоматичну style authority.

## New Component Approval

Якщо потрібен новий component, token, color, radius, shadow, spacing scale або layout pattern, спочатку дай коротку пропозицію:

- що додаємо;
- чому existing system не вистачає;
- де буде використовуватися;
- як це вплине на систему.

Додай тільки після approval або коли користувач явно попросив реалізацію без паузи і зміна не ламає design system.

## 20 Principles Gate

Жоден принцип не пропускається:

1. Відступи.
2. Сітка.
3. Візуальна ієрархія.
4. Типографіка.
5. Контраст.
6. Баланс елементів.
7. Масштабованість.
8. Акценти.
9. Вирівнювання.
10. Цілісність кольорової палітри.
11. Читаємість тексту.
12. Послідовність стилів.
13. Вільний простір.
14. Зрозуміла навігація.
15. Швидкість завантаження / вага сторінки.
16. Фокус на користувачі.
17. Інтуїтивність взаємодії.
18. Контекст у деталях.
19. Візуальна ритміка.
20. Тестування на різних пристроях.

Повний gate і evidence format: `references/quality-gates.md`.

## Visual QA

UI не Done без реальної перевірки.

Для web/app перевір:

- browser/preview render;
- console;
- network;
- mobile, tablet, desktop, wide desktop;
- no accidental horizontal scroll;
- alignment and spacing;
- text readability;
- component consistency;
- no distorted photos/logos;
- no unapproved colors/components.

Якщо browser/preview/DevTools недоступні, прямо назви fallback і ризик.

## Plugin Or Agent Decision

Не роби plugin або окремого agent за замовчуванням.

Поточна форма skill має працювати як короткий entrypoint + references + scripts.

Plugin потрібен лише коли треба пакувати MCP/tools/commands. Окремий agent потрібен лише для незалежного review або parallel evaluation.

## SkillOpt

SkillOpt використовується тільки як measured improvement loop:

```text
real traces -> scored examples -> train/val/test -> best_skill.md -> validation gate -> human review -> intentional merge
```

Не замінюй `SKILL.md` автоматично. Не коміть raw outputs, API keys або `.env`.

## Repo Checks

Після зміни цього skill запусти:

```bash
python scripts/check_skill_structure.py
python C:\Users\vaoferi\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
git diff --check
```

Потім перевір UTF-8 без BOM і відсутність mojibake.

## Final Report

Фінальний звіт має бути коротким:

```text
Diagnosis Report
- Проблема:
- Очікувана поведінка:
- Фактична поведінка:
- Знайдена причина:
- Що змінено:
- Як перевірено:
- Що залишилось/ризики:
```
