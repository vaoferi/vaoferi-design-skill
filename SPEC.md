# SPEC: Vaoferi Design Skill v1.1

## Статус

**Draft for owner approval.**

До затвердження цього SPEC не починати масштабну реалізацію, міграцію документації інших репозиторіїв або масове встановлення tooling.

Поточний технічний стопор по schema validation збережено: попередньо схвалений **варіант A** — абстракція `SchemaValidator` з першою реалізацією через Ajv, але код продовжується тільки після затвердження цього SPEC.

---

## 1. Ціль

`vaoferi-design-skill` має стати універсальним design-layer для поточних і майбутніх репозиторіїв.

Він повинен:

- задавати один спільний метод роботи з UI/design без копіювання тих самих правил у кожний repo;
- працювати і з greenfield, і з готовими сайтами;
- зберігати існуючу візуальну мову за замовчуванням;
- мінімізувати token burn через lazy-loading документації;
- робити machine-verifiable правила реально блокуючими, а не лише prose-інструкціями;
- не ламати загальну систему документації репозиторію і не конкурувати з окремою роботою над project governance;
- мати безпечний lifecycle: audit -> init/migrate/augment -> verify -> update -> doctor;
- залишатися model/tool agnostic: Codex, Claude, OpenCode, Hermes та інші агенти мають отримувати однаковий design contract.

Головна формула:

```text
existing product truth
-> design context
-> structure/grid/alignment/components/tokens
-> implementation
-> deterministic verification
-> visual evidence
```

---

## 2. Межа відповідальності

### 2.1. Design Skill володіє

- універсальним design workflow;
- правилами structure/grid/alignment/rhythm/responsive;
- component/token discipline;
- правилами адаптації до existing product;
- design-specific verification;
- design baseline/exceptions;
- design evidence;
- managed design integration blocks у project docs;
- шаблоном/форматом project `DESIGN.md`;
- design tooling adapters.

### 2.2. Design Skill НЕ володіє

- загальною архітектурою застосунку;
- бізнес-правилами;
- auth/permissions/domain logic;
- deploy runbooks;
- загальним agent governance;
- повною перебудовою `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md`;
- історією проєкту;
- project-specific brand values, якщо вони не витягнуті/підтверджені саме для цього проєкту.

### 2.3. Заборона перетину з паралельним documentation review

Поки окремо триває загальна перебудова документації, Design Skill:

- не переписує повністю `AGENTS.md`, `PROJECT_RULES.md`, `CLAUDE.md` в існуючих repo;
- може лише запропонувати або додати **чітко позначений managed design block**;
- усі загальні governance-зміни фіксуються як handoff/Linear follow-up, а не виконуються тут;
- design-specific canonical knowledge переноситься в `DESIGN.md`, `.design/*` або сам Design Skill.

---

## 3. Архітектура документації

Цільова схема для project repo:

```text
AGENTS.md
  -> короткий router: коли обов'язково активувати Design Skill

PROJECT_RULES.md
  -> тільки project hard constraints / stack / architecture

DESIGN.md
  -> project-specific visual contract

.design/
  manifest.json
  contract.json
  baseline.json
  exceptions.json
  evidence/
```

### 3.1. `AGENTS.md`

Не дублює design theory.

Managed block має містити лише routing:

```text
UI/CSS/layout/components/responsive/visual task
-> MUST use Vaoferi Design Skill
-> MUST read project DESIGN.md if present
-> MUST run design preflight
-> MUST run design verify before Done
```

### 3.2. `PROJECT_RULES.md`

Design Skill не переносить туди універсальні правила дизайну.

Допускається лише коротке project-specific посилання на design contract, якщо це потрібно для enforcement.

### 3.3. `DESIGN.md`

Містить тільки конкретну правду цього продукту:

- brand/visual direction;
- assets/logo rules;
- typography;
- colors/tokens;
- spacing/container system;
- radii/shadows/borders;
- breakpoints;
- grid/alignment anchors;
- component inventory;
- page/screen patterns;
- known deliberate exceptions;
- links/paths to design assets or external source of truth.

Не дублює універсальний workflow або загальну теорію з `SKILL.md`.

### 3.4. Окремий великий `DESIGN_RULES.md`

За замовчуванням **не створюється**.

Якщо конкретний agent/runtime потребує такого файла, він має бути коротким generated router, а не другим source of truth.

---

## 4. Lazy context / економія токенів

Design Skill не повинен завантажуватися для backend-only задач.

### Backend-only

```text
AGENTS -> PROJECT_RULES -> relevant code
```

### UI/design task

```text
AGENTS -> Design Skill entrypoint -> DESIGN.md -> relevant .design contract -> relevant UI code
```

### Design-system change

Додатково:

```text
brand/assets -> exceptions -> approval gate -> broader visual QA
```

`SKILL.md` залишається коротким router/invariant list. Деталі підвантажуються тільки за потреби з `references/`.

---

## 5. Existing Site Mode — головний default для готових сайтів

Design Skill **не має права трактувати готовий сайт як greenfield**.

За замовчуванням:

```text
preserve first -> inspect -> infer local system -> change minimally
```

Не запускати повну design migration, якщо задача — доробити одну сторінку/секцію/компонент.

### 5.1. Minimal Existing-Site Preflight

Для локальної UI-задачі агент має спочатку зібрати **мінімальний design fingerprint**, достатній саме для цієї зміни.

Перевірити:

- 2-5 репрезентативних існуючих screens/pages або найближчі аналоги;
- outer container / max-width / side gutters;
- header inner alignment та інші глобальні alignment anchors;
- повторювані spacing values;
- typography scale;
- dominant colors/accent/focus states;
- radius/shadow/border patterns;
- кнопки, cards, inputs, nav та інші primitives;
- responsive breakpoints/behavior;
- existing framework/library/components;
- CSS ownership і можливі legacy overrides.

Не потрібно сканувати весь сайт, якщо локальна задача цього не вимагає.

### 5.2. Alignment Anchor Rule

Нова сторінка/секція не повинна формуватися у відриві від існуючого сайту.

Перш за все визначити dominant alignment anchors:

- header inner edges;
- main content/container edges;
- grid columns;
- repeated section gutters;
- navigation/content alignment.

За замовчуванням новий layout наслідує dominant container/gutter system.

**Не робити універсального правила**, що header завжди має бути тієї самої ширини, що й content: існуючий продукт може мати свідомий wider header або іншу композицію. Existing product evidence має пріоритет.

### 5.3. Safe change threshold

Якщо preflight показує, що локальна задача вимагає широкого redesign/refactor:

- не починати його мовчки;
- оцінити impact;
- запропонувати окрему migration/design-system task;
- для поточної задачі залишитися в мінімальній сумісній зміні, якщо це можливо.

Мета — не перетворювати 20-хвилинну доробку на багатогодинну перебудову сайту.

---

## 6. Greenfield Mode

Для нового продукту або нового isolated surface без existing visual system:

1. goal;
2. content/information architecture;
3. spacing mode;
4. skeleton;
5. responsive plan;
6. grid;
7. alignment anchors;
8. components;
9. tokens;
10. color/accent;
11. implementation;
12. visual QA.

Existing project dependencies/design system завжди перевіряються до створення нового.

---

## 7. Managed ownership

Design Skill повинен знати, що саме він створив або може оновлювати.

`.design/manifest.json` мінімально зберігає:

```text
skillVersion
schemaVersion
installMode
detectedStack
enabledAdapters
managedFiles
managedBlocks
contractVersion
baselineVersion
```

### Режими ownership

- `managed` — для наших repo після контрольованого reset/migrate;
- `augment` — для чужого/існуючого repo, де Design Skill змінює тільки власні blocks/files;
- `audit-only` — нічого не змінює.

`design update` не має права переписувати project-owned content поза managed ownership.

---

## 8. Lifecycle commands / режими

Назви можуть уточнюватися під час реалізації, але семантика фіксована.

### `design audit`

Read-only:

- stack discovery;
- docs discovery;
- design sources;
- existing test/browser tooling;
- legacy debt;
- generated/vendor folders;
- potential secrets/hygiene risks;
- conflicts між docs/code/rendered UI.

### `design init`

Для greenfield або repo без design integration.

### `design migrate`

Для контрольованого reset існуючих наших repo:

- витягнути актуальні design-specific правила;
- прибрати design duplication;
- зберегти project-specific visual truth;
- створити canonical design integration;
- не торкатися загального governance поза design boundary.

### `design augment`

Для існуючого/чужого repo:

- мінімальні managed additions;
- без переписування існуючих docs.

### `design update`

Оновлює тільки managed content/tooling.

### `design doctor`

Шукає drift:

- `DESIGN.md` vs code/render;
- manifest vs actual stack;
- disabled/missing verifier;
- baseline growth;
- removed managed block;
- broken browser adapter;
- contract/schema mismatch.

### `design uninstall/rollback`

Видаляє/відкочує тільки те, чим володіє Design Skill, без пошкодження project-owned docs/code.

---

## 9. Capability Detection

Перед встановленням tooling визначити реальний стек.

Приклади capabilities:

```text
browser UI?
Node?
PHP/Yii?
Next?
Vite?
static HTML/CSS/JS?
Playwright installed?
Cypress/Backstop/Vitest?
existing CI?
existing MCP?
existing project test command?
```

Design Skill не має права бездумно додавати Node/Playwright/MCP у кожний repo.

---

## 10. Tooling isolation

Universal design verifier має бути відділений від application architecture.

Node/PHP/static repo можуть інтегрувати verifier різними wrapper-командами, але project app не повинен залежати від внутрішньої реалізації Design Skill без потреби.

### MCP

MCP — optional adapter, не core dependency.

Core design verification має працювати без MCP.

### Playwright

Playwright використовується, якщо browser verification потрібна і доступна.

Якщо у project вже є сумісний browser/E2E tool, Design Skill має спочатку спробувати reuse, а не встановлювати дубль.

---

## 11. Schema validation — рішення A

На рівні архітектури використовується interface:

```text
SchemaValidator
  validate(schema, document)
  -> valid | violations
```

Перша реалізація:

```text
AjvSchemaValidator
```

Ajv є implementation detail, а не контрактом усього Design Skill.

Мета — дозволити майбутню заміну validator без зміни lifecycle/stage logic.

---

## 12. Verification Pyramid

Lint не є достатнім доказом якості UI.

Design verification має бути layered:

```text
1. schema validation
2. policy lint
3. static design-contract tests
4. application/component tests
5. browser responsive tests
6. visual regression / screenshot evidence
7. human/physical-device review where required
```

Кожне правило реалізується на найнижчому рівні, де воно може бути перевірене надійно.

Не намагатися regex-ом довести semantic design rule.

---

## 13. Legacy baseline + ratchet

### Greenfield

```text
new violation -> FAIL
```

### Legacy

Старий борг може бути зафіксований baseline-ом.

```text
existing violations = tolerated baseline
new violation       = FAIL
baseline grows       = FAIL unless explicitly approved
violation removed    = baseline may shrink
```

Це стосується machine-verifiable design debt, наприклад `!important`, forbidden patterns або інші затверджені rules.

Baseline не є виправданням для нового боргу.

---

## 14. Exceptions

Винятки з hard rules мають бути explicit і searchable.

`.design/exceptions.json` містить мінімально:

```text
rule
scope/path
reason
approvedBy/approval reference
createdAt
optional expiry/review trigger
```

Агент не може створити exception лише тому, що verifier заважає завершити задачу.

---

## 15. Anti-bypass

Заборонено робити green шляхом послаблення verifier-а без explicit approval.

Design gate повинен виявляти або блокувати, де це технічно можливо:

- lint-disable / rule suppression, додані лише для обходу;
- `continue-on-error` для mandatory design checks;
- silent removal of CI design gate;
- baseline growth без approval;
- schema/contract weakening для проходження поточного коду;
- видалення тесту замість виправлення дефекту.

Правильний порядок:

```text
code violates contract -> fix code
```

а не:

```text
code violates contract -> weaken contract
```

---

## 16. Hygiene preflight перед migration

Перед автоматичним читанням/консолідацією старої документації:

- exclude vendor/node_modules/generated/cache/build artifacts;
- detect `.env`, credentials, tokens, cookie dumps та інші secret-like sources;
- detect raw session logs/traces;
- не переносити secret-like data в canonical docs;
- не трактувати dependency docs як project-owned truth.

Migration має працювати з redacted/verified project knowledge.

---

## 17. Evidence / Done

Агент не може завершити design task лише фразою «має працювати».

Мінімальний evidence залежить від типу задачі, але report повинен сказати:

- що перевірено;
- яким verifier/test/browser path;
- які viewport/state були перевірені;
- що не вдалося перевірити;
- які ризики лишилися.

Для browser UI, якщо можливо, evidence зберігається у `.design/evidence/` або в existing project test artifact system.

---

## 18. Project Design Fingerprint

Для existing product Design Skill може створити/оновити компактний machine-readable fingerprint, якщо це дає користь без дублювання `DESIGN.md`.

Можливі поля:

```text
containers/gutters
spacing candidates
typography roles
color roles
radii/shadows/borders
breakpoints
alignment anchors
component sources
representative routes/screens
```

Fingerprint не є автоматичною «істиною» лише тому, що values часто зустрічаються. Він є evidence для побудови/оновлення `DESIGN.md` і локальної задачі.

---

## 19. Approval Gates

Explicit owner approval потрібен перед:

- broad redesign existing product;
- migration spacing system;
- зміною brand palette/type system;
- новим global component/token, якщо existing system недостатня;
- baseline growth;
- permanent exception from hard rule;
- rewrite project-owned docs;
- dependency/tool installation, яка істотно змінює project stack;
- mass rollout Design Skill у всі repo.

Локальна сумісна UI-правка не повинна зупинятися на approval для кожної дрібниці.

---

## 20. Non-goals

У v1.1 не робимо:

- formal verification усього UI/application;
- повний rewrite усіх repo docs;
- автоматичний redesign готових сайтів;
- автоматичний перехід усіх продуктів на 4x/Fibonacci;
- обов'язковий MCP;
- обов'язковий Playwright для non-browser repo;
- автоматичне merge SkillOpt output;
- machine enforcement semantic правил, які неможливо надійно виміряти.

---

## 21. Реалізаційні фази після approval

### Phase 1 — Core contract

- stage model/status;
- schema contracts;
- `SchemaValidator` interface;
- `AjvSchemaValidator` implementation;
- deterministic error model;
- tests.

### Phase 2 — Repository audit/bootstrap

- capability detection;
- ownership manifest;
- audit-only mode;
- generated/vendor exclusions;
- hygiene checks.

### Phase 3 — Existing-site adaptation

- minimal design fingerprint;
- representative route selection;
- alignment anchor detection;
- safe-change threshold;
- project `DESIGN.md` bootstrap/update proposal.

### Phase 4 — Managed documentation integration

- compact AGENTS router block;
- optional PROJECT_RULES pointer;
- DESIGN.md template;
- augment vs managed mode;
- conflict-safe update.

### Phase 5 — Verification adapters

- policy/static checks;
- project test-command integration;
- Playwright/browser adapter where relevant;
- MCP optional adapter;
- evidence output.

### Phase 6 — Legacy ratchet / exceptions / anti-bypass

- baseline;
- exceptions;
- CI guardrails;
- verifier self-protection tests.

### Phase 7 — Lifecycle

- audit/init/migrate/augment/update/doctor/rollback semantics;
- dry-run;
- clear diff/evidence report.

### Phase 8 — Skill packaging and evaluation

- keep `SKILL.md` compact;
- split references by task type;
- update rubric/examples;
- run structure validation;
- use SkillOpt only after enough real traces.

### Phase 9 — Controlled rollout

Після окремого owner approval:

- підготувати один migration prompt/plan для локального агента;
- `git fetch/pull` кожного repo;
- audit first;
- не overwrite local uncommitted work;
- install/update Design Skill integration repo-by-repo;
- record blockers/follow-ups in Linear;
- no mass push without review.

---

## 22. Перевірка самого Design Skill

Перед Done:

```bash
python scripts/check_skill_structure.py
python scripts/validate_snippets_source.py --json
git diff --check
```

Додатково після реалізації v1.1:

- unit tests contract/validator/lifecycle;
- fixture repos: greenfield, legacy, existing static site, Node app, PHP/Yii;
- intentional failure tests for anti-bypass;
- baseline ratchet tests;
- dry-run migration tests;
- UTF-8 without BOM;
- no mojibake;
- no secrets/generated junk.

---

## 23. Критерії готовності v1.1

V1.1 готовий, коли:

- existing site можна безпечно доробити без обов'язкового redesign;
- greenfield та legacy мають різну enforcement semantics;
- design docs не дублюють general governance;
- Design Skill володіє лише своїми managed blocks/files;
- Design Skill не потребує MCP як core dependency;
- tooling встановлюється за capabilities, а не бездумно;
- schema validation абстрагований від Ajv;
- new machine-verifiable violations блокуються;
- legacy debt не може непомітно рости;
- bypass verifier-а не є легальним шляхом до Done;
- UI task має evidence-based Done;
- один repo можна audit/migrate/update/doctor без ручного переписування всього;
- rollout у всі repo залишається окремим, контрольованим етапом після owner approval.

---

## 24. Поточний approval checkpoint

Після затвердження цього SPEC:

1. не робити mass rollout;
2. не чіпати загальну документацію інших repo;
3. повернутися до зупиненого core implementation;
4. реалізовувати v1.1 по фазах з тестами;
5. design-specific follow-ups, що потребують локальних repo або перетинаються з global docs review, фіксувати в Linear;
6. окремо погодити rollout/migration prompt після стабілізації Design Skill.