# Project Log

## 2026-06-15 — NLM admin responsive review follow-up
- Завдання: виправити `/content/article/index`, `/content/category/index`, dashboard map/header та `/content/public-team/create` після Crit-коментарів.
- Знайдено:
  1. Попередній article mobile layout мав зайві рамки/дані: прев’ю, ID, slug, автор, дати, статус і дії займали забагато місця.
  2. Category mobile/tablet layout переносив кнопки, а drag handle міг опинитися нижче іконок; частина карток не показувала thumbnail через відсутність `thumbnail_base_url`.
  3. Dashboard row/container gutter створював зсув за межі viewport, тому map виглядала зміщеною праворуч; header із кнопками періоду не мав повної мобільної перекомбінації.
  4. Public-team translation form мав потенційно різну ширину полів через Bootstrap gutter/колонки.
- Змінено:
  - `backend/modules/content/views/article/index.php` — вимкнено filter row, mobile/tablet article rows перебудовано в compact card-grid: thumbnail ~20%, назва + категорія, статус-іконка поверх прев’ю, дії іконками в одному ряду.
  - `backend/modules/content/views/category/index.php` — додано fallback placeholder для відсутніх thumbnail, прибрано Slug/ID з мобільного вигляду, thumbnail займає повну висоту картки, кнопки не переносяться, текст обрізається, drag handle сховано на mobile.
  - `backend/web/css/style.css` — виправлено `.content-page .row` через `margin-inline: 0`, dashboard header/title перекомбіновано в повну ширину, map SVG центрується, додано article/category compact responsive styles.
  - `backend/modules/content/views/public-team/_form.php` + `backend/web/css/style.css` — translation tab отримав спільні правила для рівних полів і mobile `100%` width.
- Чому так:
  - Попередній article mobile layout був технічно без горизонтального скролу, але композиційно слабкий: занадто багато другорядних даних і великі рамки. Це не відповідає mobile-first/reflow принципу.
  - Category layout має залишатися щільним: thumbnail + title + controls, без wrap і без нижнього drag handle.
  - Dashboard overflow не можна маскувати `overflow-x: hidden`; треба прибрати джерело зсуву через row gutter і правильно перекомбінувати header.
- Перевірка:
  - `git diff --check` для змінених файлів без помилок.
  - Crit replies додано без `--resolve`.
- Signal для SkillOpt:
  - Для admin tables/card lists треба окреме правило: mobile layout має показувати лише primary identity + primary action; secondary metadata/controls ховаються або стають icons, а drag handles не повинні ламати row alignment.

## 2026-06-07
- Завдання: на `/about` (UA/EN/DE) узгодити палітру, прибрати контент-override'и у view, прибрати кнопку "Детальніше" на team-cards у мобільній версії, перевірити візуально всі блоки.
- Знайдено (pain-points від агента):
  1. У `frontend/views/site/_ua_team_head.php` два override'и `getPosition()` ламали БД-джерело правди: для DE ("Leiter und Gründer…") і для UA ("Керівник і засновник…"). Обидва видалено — view тепер делегує позицію в `User::getPosition($lang)`.
  2. CSS-палітра `/about` мала 3 різні блідий-синіх surfaces: `#f1f6ff` (motto), `#f2f5f9` (tab default), `#f2f7ff` (metric). Усі три мали писатися одним токеном. Також знайдено mid-blue `#1a5e92` у `.deabout__awards-indicator.is-active` (slick-style) — не primary.
  3. `pagination-modern.css` (вже виправлений раніше) і `team-cards.css` — у tablet media блоці лишався `display: block` для `team-card__btn-more`. Кнопка дублювала 2 наявні клікабельні зони картки, тому прибрано повністю.
  4. Архітектурний підвох: в проекті існує дві паралельні копії `about_ru/uk/de.php` — `frontend/web/site/*` (legacy, ~7 KB) і `frontend/views/site/*` (active, ~15-19 KB). Спочатку агент редагував `web/site/*` — це не впливало на прод. CSS-каскад у view потребує перевищення специфічності inline-стилів partial-views (`.about-content-block .X`), бо вони реєструються ПІСЛЯ `registerCssFile`.
  5. `deabout__awards-indicator` не має батька `.about-content-block` (він у `.deabout__awards > .deabout__awards-indicators`), тому `body .X` selector — коректний override.
- Змінено:
  - `frontend/views/site/_ua_team_head.php` — обидва override'и position ВИДАЛЕНО.
  - `frontend/web/css/team-cards.css` — ВИДАЛЕНО tablet media block для `.team-card__btn-more`.
  - `frontend/web/css/pagination-modern.css` — solid border `#173750`, без box-shadow, disabled з `rgba(0.4)`.
  - `frontend/web/css/de-grid37.css` — title `padding-bottom: calc(var(--pad-y) * 0.4)`, `grid-template-rows: var(--row-size) minmax(var(--row-size), auto) var(--row-size)`, icon `color: #173750` з border `rgba(23,55,80,0.45)`, `.de-grid37__band-inner` через grid + gap.
  - `frontend/web/css/deabout-tokens.css` — створено; tokens override: `body .deabout__awards-indicator` → `#173750`, `div.about-content-block .deabout__motto` → bg `#eef4fb` color `#173750`, `div.about-content-block .deabout__metric` → bg `#eef4fb`, `body .deabout__awards h3` → `#173750`.
  - `frontend/views/site/about_ru.php`, `about_uk.php`, `about_de.php`, `about.php` — додано `$this->registerCssFile('@web/css/deabout-tokens.css');` ПІСЛЯ `registerCss` блоків (для EN — це `about.php` fallback, бо `about_en.php` не існує).
  - `docs/history/project_log.md` (NLM) — додано запис 2026-06-07 зі станом БД по position полях.
- Чому так:
  - Контент у view = джерело правди — порушення AGENTS.md і Design-from-structure принципу.
  - Узгоджена палітра = менше cognitive load, всі елементи на сторінці належать до однієї системи.
  - Кнопка "Детальніше" дублювала два наявні лінки картки (`.team-card__main-link` і `.team-card__info-link`), видалення — це redundancy reduction.
  - `deabout-tokens.css` як single source of truth, а не редагування 6 дублікатів inline-стилів (3 partial views × 2 проєкти).
  - Підвищення специфічності через `body .X` (0,1,1) і `div.X .Y` (0,2,1) — type+class дозволяє перебити inline (0,2,0) без `!important`, що заборонено правилами.
- Перевірка:
  - `team_head_probe.py` + DOM-виміри 1024/1280/1440/1920: band gap 49.1/52.8/52.8/52.8 px (стабільно), `bandOverflow: 0`, `innerOverflow: 0` при 2-рядковому position (h=53.75).
  - `about_tokens_qa.py` через Playwright + JSON: 8 селекторів × 3 мови — ВСІ тепер мають primary `#173750` і pale `#eef4fb`, EN раніше fallback на `about.php` без tokens — виправлено.
  - 18 повних скрінів `deabout_about_{ua,en,de}_{375,768,1024,1280,1440,1920}.png` — палітра візуально узгоджена, motto/metric/awards-indicator у всіх мовах і на всіх ширинах.
  - `team-card__btn-more: 51` — на 375 rect 0x0 (`display: none`), на 768+ до правки — `display: block` (BUG), після правки — також приховано через відсутність правила (cascades to default `display: none`).
- Ризики:
  - `deabout-tokens.css` з підвищеною специфічністю може перебити майбутні стилі у design system; при переході на компонентну бібліотеку краще винести tokens у `:root` custom properties і прибрати override-файл.
  - EN fallback на `about.php` (немає `about_en.php`) — крихкий контракт; якщо EN колись отримає окремий view, треба додати registerCssFile і туди.
  - Решта дизайн-системних патернів (наприклад, `slick-arrows` `#1a5e92` у slick.min.css) ще не вкриті — наступний цикл.
- Signal для SkillOpt: цей сценарій показав, що skill потребує явного правила: "при наявності дублікатів views (`web/site/*` vs `views/site/*`) — обов'язково перевіряти, який саме файл рендериться через `renderLang`/controller". Також варто додати `cascade specificity` rule: "не використовувати `!important`; якщо inline-стиль перебиває CSS-файл, підвищуй специфічність через type-selector prefix".

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

## 2026-06-07 (сесія 2) — User profile bg fix
- **Завдання:** Сторінка `/ua/user/{slug}` мала `background: #f4f7fb`, який відрізнявся від `body { background: #fff }` — єдина сторінка з таким фоном.
- **Процес (design-skill вперше):** 1. Прочитано `SKILL.md` з NAS 2. `goal → DESIGN.md → proposal → approval → implementation → QA → 20 Principles Gate` 3. Дизайн-контракт створено в `frontend/views/user/DESIGN.md` 4. Запропоновано 3 варіанти композиції (A/B/C), користувач обрав A. 5. Реалізовано: `#f4f7fb` → `transparent` у 2 файлах (frontend + common дублікат)
- **Visual QA:** Playwright 375/768/1024/1440 — bg збігається, без hscroll
- **20 Principles Gate:** All Pass
- **Знайдено:** дублікат CSS у `common/frontend/web/css/user-profile.css` (ідентичний frontend/web/css/user-profile.css). Обидва оновлено.
