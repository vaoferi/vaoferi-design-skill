# Project Log

## 2026-06-06
- Завдання: додати опціональне правило `4x` і не пропустити жоден із 20 принципів дизайну.
- Знайдено: чинний skill жорстко вимагав Fibonacci spacing у частині правил, не мав явного `4x` mode, а performance, navigation, intuitive interaction, contextual details і cohesive palette не мали повного правила + доказу. `quick_validate.py` також виявив невалідне top-level поле `version` у frontmatter.
- Рішення: `4x` і `Fibonacci` визначено як альтернативні режими. Existing product зберігає поточні tokens; для роботи з нуля користувач обирає режим, а вибір фіксується в `DESIGN.md`. Golden Canon-inspired grid лишається macro guide і не перевизначає spacing mode.
- Змінено: створено `SPEC.md`; у `SKILL.md` додано spacing decision flow, ranges, exceptions, spacing QA і Mandatory 20 Principles Gate; оновлено `README.md`, `rubric.md`, good/bad examples; `version` перенесено в дозволений `metadata`.
- Джерела: NotebookLM notebook `e0d206d4-3820-44b1-95b3-4f9fd7bbcd22`; актуальні Vercel Web Interface Guidelines; W3C WCAG 2.2 contrast, non-text contrast, reflow, target size і consistent navigation; web.dev Core Web Vitals і performance budgets.
- Перевірка: `quick_validate.py` повернув `Skill is valid!`; `git diff --check` без помилок; автоматичний audit знайшов рівно `20/20` numbered rules у `SKILL.md` і `20/20` checks у `rubric.md`; baseline pressure-test пропустив `4x`, palette, performance, intuitive interaction і contextual details, після чого ці прогалини закрито; повторний pressure-test змусив заборонити агреговане `Pass: 1–20`; фінальний незалежний review підтвердив `Pass` для static/device scope, content-tested breakpoint і approved radius candidate; UTF-8/BOM та mojibake перевірено.
- Ризики: діапазони є guardrails, а не універсальними pixel laws; existing design system і реальний контекст мають пріоритет, але кожен виняток повинен бути названий і перевірений.

## 2026-06-04
- Завдання: додати в `vaoferi-design-skill` mobile-first і visual-polish правила, щоб скіл не тільки тримав структуру, а й виглядав спокійно на вузьких екранах.
- Знайдено: NotebookLM підтвердив mobile-first базу, `box-sizing: border-box`, `rem`, 44px touch targets, одну головну дію на мобільному екрані, shrinkable flex rows, responsive media з `max-width: 100%` / `height: auto` / `object-fit: cover`, локальний `overflow-x: auto` лише для інтенційно скролабельного контенту, а також важливість ритму, whitespace і стриманої motion-естетики.
- Змінено: у `SKILL.md` додано `Mobile-First Rules`, responsive media rules і `Visual Polish`; оновлено `README.md`, `rubric.md`, `examples/good-answer.md`, `examples/bad-answer.md`.
- Чому так: mobile-first має бути не аварійною компресією десктопа, а окремою уважною композицією, яка читається і працює пальцем.
- Перевірка: прогнано NotebookLM запит про mobile-first, переглянуто diff і звірено, що нові правила не дублюють вже наявні guardrails.
- Ризики: строгі 44px targets і одна головна дія можуть вимагати контекстних винятків для щільних адміністративних екранів.

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
