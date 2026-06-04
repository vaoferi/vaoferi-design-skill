# Project Log

## 2026-06-04
- Завдання: додати Microsoft SkillOpt у робочий процес skill для відстеження якості й періодичного покращення.
- Знайдено: `microsoft/SkillOpt` оптимізує skill як текстовий артефакт через цикл rollout -> reflect -> aggregate -> select -> update -> evaluate; результатом є `best_skill.md`, а не автоматична заміна `SKILL.md`.
- Змінено: у `SKILL.md` додано `SkillOpt Improvement Loop`; в `AGENTS.md` посилено правило SkillOpt; у `README.md` і `rubric.md` додано tracking, validation gate, review `best_skill.md` і заборону комітити raw run outputs/secrets.
- Чому так: SkillOpt корисний для повторюваних помилок і вимірюваних покращень, але небезпечний як автопереписувач, бо може послабити дизайн-системні guardrails.
- Перевірка: звірено актуальний README `microsoft/SkillOpt`, переглянуто diff, виконано `git diff --check`, BOM/mojibake-пошук.
- Ризики: реальний запуск SkillOpt потребує підготовленого train/val/test набору задач і credentials; без цього запуск буде шумом, а не навчанням.

- Завдання: додати в `vaoferi-design-skill` процес створення дизайн-систем, зрозумілих для Google Stitch, Open Design і кодерів/агентів.
- Знайдено: Stitch і Google `design.md` використовують `DESIGN.md` як переносимий контракт із YAML-токенами та Markdown-раціоналом; Open Design прив'язує генерацію до `DESIGN.md`, `SKILL.md` і живих файлів/артефактів.
- Змінено: у `SKILL.md` додано `Design System First`, `DESIGN.md Contract`, `Primitive Library Bootstrap`, generator compatibility prompt і handoff-вимоги; оновлено `README.md`, `rubric.md`, `examples/good-answer.md`, `examples/bad-answer.md`.
- Чому так: `DESIGN.md` дає спільну мову для Stitch/Open Design, а primitive library зупиняє дублювання кнопок, карточок, input-ів і станів на кожній сторінці.
- Перевірка: використано актуальні джерела Google Stitch / Google `design.md` / `nexu-io/open-design`; переглянуто diff і виконано пошук mojibake-патернів.
- Ризики: `@google/design.md` формат активний і може змінюватися; skill вимагає lint через CLI, коли Node/npm доступні у конкретному проєкті.

- Завдання: захистити `vaoferi-design-skill` від CSS-хаосу та розсипаного operational UI.
- Знайдено: у `SKILL.md` уже були правила про grid, tokens і visual QA, але не було жорсткої вимоги трасувати існуючий CSS перед новою правкою, а також не було явної заборони `!important`.
- Змінено: додано `CSS Guardrails`, посилено trigger description для operational UI/admin forms, оновлено `README.md` і `rubric.md`, створено позитивний і негативний приклади.
- Перевірка: переглянуто diff, звірено markdown-структуру, додано приклади та журнал змін.
- Ризики: це документаційне посилення, тому live browser QA ще не виконувалась; наступні UI-правки мають пройти preview/DevTools перевірку.
- Додаткове дослідження: NotebookLM підтвердив корисність BEM-style traceable naming та `@container` для компонентів, що живуть у різних контейнерах; ці правила додано в skill як доповнення до trace/reuse guardrails.
