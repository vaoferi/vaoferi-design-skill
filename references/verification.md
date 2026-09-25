# Deterministic Verification v1.1

Цей reference є authority для hard design gates. Природномовні інструкції можуть пояснювати намір, але PASS/FAIL/BLOCKED визначає verifier.

## Trust Model

```text
agent edit -> deterministic verifier -> PASS | FAIL | BLOCKED -> evidence
```

Відсутня required verification capability не перетворюється на warning або pass.

## Capability Gate

`browserGate` має один зі станів:

- `READY` — required browser adapter/runtime доступний;
- `INSTALLABLE` — точний шлях встановлення відомий, але verifier ще не READY;
- `BLOCKED` — required rendered-browser verification неможлива в поточному середовищі.

Для `/responsive` і `/verify` тільки `READY` дозволяє продовжити. Missing required browser verification = BLOCKED.

## Changed Authored Code

Changed/touched project-authored UI code перевіряється strict-policy незалежно від legacy debt. Vendor, generated, cache/build output не вважаються authored source і класифікуються ownership policy.

Новий `!important` у changed authored source = hard FAIL, окрім exact narrow approved exception. Broad wildcard exception заборонений.

## Legacy Ratchet

Legacy findings можуть бути baselined, але baseline є ratchet:

- старий незмінений finding може залишитися `legacy-baselined`;
- виправлений finding зменшує debt;
- новий finding не може зайняти місце старого лише тому, що count не виріс;
- baseline expansion = regression, якщо вона не пройшла явний approved lifecycle.

## Anti-Bypass

Hard FAIL для спроб зробити gate зеленим через weakening verification, включно з:

- новими suppression/disable comments;
- ignore-glob widening на authored source;
- `continue-on-error` для required gate;
- видаленням або no-op підміною required verifier command;
- видаленням required tests;
- baseline growth для приховування нового finding.

Не виправляй policy failure послабленням policy.

## Responsive Browser Sweep

Для touched responsive UI focused sweep проходить every integer CSS-pixel width у configured supported interval. Sampling тільки на named device widths не є достатньою перевіркою.

Якщо contract оголошує portrait/landscape або інші aspect profiles, кожна ширина перевіряється у відповідних states. Breakpoint neighborhoods `-2,-1,0,+1,+2` можуть додаватися як explicit evidence, але не замінюють exhaustive interval.

Rendered browser geometry перевіряє щонайменше:

- horizontal overflow;
- collisions/overlap для declared critical selectors;
- frame containment;
- required alignment relationships;
- orphaned/hidden critical content, якщо правило оголошене contract.

Browser adapter вимірює DOM; geometry rules лишаються verifier-owned pure rules.

## Changed vs Full

- `design verify --changed` — fast strict gate для touched surface; це default для bare `design verify`.
- `design verify --full` — broad verification для CI/release/nightly або коли зміна може впливати поза touched surface.

Changed verification не означає weaker rules; воно означає менший verified scope.

## Done And Evidence

UI задача не Done лише тому, що сторінка рендериться або HTTP повертає 200. Done потребує required deterministic gates PASS і machine-readable evidence.

Evidence має містити contract/stage, executed gates, verified scope, browser states, findings/exceptions і фінальний status. Якщо будь-який required gate `FAIL` або `BLOCKED`, фінальний status не може бути `PASS`.

MCP може давати додаткові tools, але не є required trusted path. Core verifier має працювати без MCP.

## Universal DoD inheritance

Completion authority є Start Here `DEFINITION_OF_DONE.md` у цільовому repository. Цей reference додає design-specific assertions; він не замінює ту authority і не переказує її матрицю сюди.

- Перед новою design implementation pre-existing staged/modified/untracked стан — hard preflight: інвентаризувати й прив'язати до задачі, інакше статус лишається `In Progress / BLOCKED`.
- Design handoff є review-ready лише після commit + push + remote head == local head + `WORKTREE CLEAN: PASS` від `python .vaoferi/check_worktree_clean.py`.
- UI/layout/responsive зміни потребують кожну affected surface × 10 canonical viewport states з універсального DoD. Проєктні breakpoint-и можуть додавати стани й посилювати перевірки; вони never replace і не можуть мовчки скорочувати цю матрицю.
- Automated browser geometry/visibility regression лишається mandatory для responsive/layout роботи, а ручна visual QA на reviewer-accessible target — поверх неї.
- Якщо `DEFINITION_OF_DONE.md` у цільовому repository відсутній або застарілий, design робота fail-closed за baseline-правилами сесії: спершу adoption DoD, потім design зміни.
