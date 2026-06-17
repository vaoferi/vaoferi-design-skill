# SPEC: Design Skill Architecture, Snippets Source, SkillOpt

## Ціль

Зробити `vaoferi-design-skill` стабільним для агентів:

- короткий `SKILL.md` як entrypoint;
- жорсткий порядок дій від skeleton до visual QA;
- опціональний вибір spacing mode: existing scale, `4x` або `Fibonacci`;
- усі 20 принципів дизайну як перевірюваний gate;
- local component library catalog як валідоване джерело елементів;
- SkillOpt як вимірювана петля покращення, не автопереписувач.

## Діагноз

Попередній `SKILL.md` був завеликий: понад 1000 рядків. Він змішував workflow, довідник, CSS rules, visual QA, changelog і SkillOpt. Це робить виконання нестабільним: агент може прочитати файл, але пропустити порядок дій або важливий gate.

Проблема не в тому, що skill має бути plugin. Проблема в архітектурі інструкції.

## Рішення

- `SKILL.md` лишається коротким маршрутизатором.
- Деталі винесені в `references/`.
- Перевірки винесені в `scripts/`.
- Plugin не створюємо зараз: немає потреби пакувати MCP/tools як окремий bundle.
- Окремий agent не створюємо зараз: спершу потрібен стабільний design contract.

## Що змінюємо

- `SKILL.md` — короткий entrypoint із mandatory order.
- `references/action-contract.md` — повний порядок design execution.
- `references/component-sources.md` — source order і local component library catalog.
- `references/quality-gates.md` — 20 principles gate і visual QA form.
- `references/skillopt-and-architecture.md` — діагноз, plugin/agent decision, SkillOpt workflow.
- `config/component-libraries.json` — catalog бібліотек компонентів.
- `scripts/validate_snippets_source.py` — перевірка catalog.
- `scripts/get_component_snippet.py` — отримання конкретних snippets, наприклад кнопки `Далі`.
- `scripts/check_skill_structure.py` — структурна перевірка skill.
- `README.md`, `rubric.md`, `docs/history/project_log.md` — синхронізація.

## Що не змінюємо

- Не створюємо plugin без потреби.
- Не додаємо нових runtime dependencies.
- Не замінюємо `SKILL.md` output-ом SkillOpt.
- Не мігруємо existing products на `4x` або `Fibonacci` без approval.
- Не комітимо raw SkillOpt outputs, secrets, `.env`, cache або великі run folders.

## Snippets Source

Валідоване джерело:

```text
config/component-libraries.json
```

Очікувані enabled libraries:

- `bootstrap`;
- `bulma`;
- `shoelace`;
- `bootstrap-icons` через `iconsNpm`.

Перевірка:

```bash
python scripts/validate_snippets_source.py --json
python scripts/get_component_snippet.py button --label "Далі" --json
```

## SkillOpt

Використовуємо тільки measured loop:

```text
real traces -> scored examples -> train/val/test -> best_skill.md -> validation gate -> human review -> intentional merge
```

Локальний scaffold:

```text
.skillopt/config.yaml
.skillopt/data/train/items.json
.skillopt/data/val/items.json
.skillopt/data/test/items.json
```

`python -m skillopt` не є валідною CLI-командою для встановленого пакета. Upstream CLI script-based:

```bash
python scripts/train.py --config <config.yaml>
python scripts/eval_only.py --config <config.yaml> --skill <best_skill.md>
```

## План перевірки

- `python scripts/validate_snippets_source.py --json`
- `python scripts/check_skill_structure.py`
- `python C:\Users\vaoferi\.codex\skills\.system\skill-creator\scripts\quick_validate.py .`
- `git diff --check`
- exact 20 principles in `SKILL.md`, `rubric.md`, `references/quality-gates.md`
- UTF-8 without BOM
- no mojibake patterns

## Критерії готовності

- `SKILL.md` коротший за 250 рядків.
- Усі reference файли існують і читаються.
- Snippets config валідний і показує enabled libraries.
- Усі 20 принципів присутні в entrypoint/rubric/quality gate.
- SkillOpt scaffold має train/val/test приклади.
- Перевірки проходять.
- У project log зафіксовано діагноз, рішення і ризики.
