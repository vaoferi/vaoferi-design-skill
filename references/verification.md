# Deterministic Verification v1.2

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

## Risk-tiered Browser Verification

Verification strictness stays fail-closed, but **verified scope is proportional to risk and blast radius**. A local visual correction must not repeatedly certify unrelated subsystems; a broad/high-risk change must not hide behind a tiny smoke test.

### V1 — Inner loop

After each small implementation step:

- run the focused RED → GREEN regression for the changed behavior;
- run the smallest useful lint/type/static check for the touched area;
- if browser behavior is involved, exercise the exact affected interaction/state.

Do not run the full project/browser matrix after every CSS/helper/timing edit.

### V2 — Candidate gate

When the task is ready as a candidate:

- verify every **affected surface**;
- include the owner-reproduced viewport/state;
- for affected responsive breakpoints, check boundary neighborhoods `n-1 / n / n+1`;
- include representative narrow and desktop states when the change can cross those classes;
- include only relevant themes/orientations/interactions;
- layout/responsive changes still require automated geometry/visibility assertions, but scoped to the affected surface/range.

If the blast radius is unclear, widen the candidate gate instead of guessing that the change is local.

### V3 — Stable acceptance

For reviewer-visible UI:

- use the exact pushed candidate SHA/version on the canonical reviewer-accessible target;
- repeat the key affected visual/interaction checks there;
- when the project has temporary → durable preview topology, inherit Start Here runtime-preview promotion/parity rules.

### V4 — Full health

Use exhaustive configured intervals, all relevant browser engines/states, and the broad project matrix when any of these apply:

- shared/global layout or design tokens;
- app shell/router or cross-surface primitives;
- broad multi-surface redesign/refactor;
- accessibility/security/privacy-sensitive UI;
- release/production checkpoint, CI/nightly health;
- focused evidence shows a larger blast radius than expected;
- project contract or owner explicitly requires full certification.

An ordinary localized UI task normally gets at most **two full-health runs**: one final candidate run and one repeat after a focused fix to a real failure. A third full-health run requires a written reason stating what new risk it proves and why a focused rerun is insufficient.

### Failure ownership / flaky tests

A red test is evidence, not automatic permission to expand scope.

1. Failure inside the affected surface/contract blocks the current task and is diagnosed there.
2. Failure outside the affected surface is isolated with the smallest owning test and a bounded repeat (typically 2–3 runs).
3. A reproducible unrelated defect belongs to its owning task/follow-up; the current task records it and does not start repairing another subsystem.
4. A timing-sensitive/flaky assertion without a reproduced user-visible defect is hardened as test work; do **not** change product behavior merely to satisfy the flake.
5. After a focused fix, rerun the affected candidate gate; run another full-health gate only when the risk tier requires it.

## Changed vs Full

- `design verify --changed` — fast strict gate для touched/affected surface; це default для bare `design verify` і V1/V2.
- `design verify --full` — V4 broad verification для CI/release/nightly, shared/global UI або іншого доведеного broad/high-risk impact.

Changed verification не означає weaker rules; воно означає менший verified scope. Full verification не є ритуалом після кожної дрібної правки.

## Done And Evidence

UI задача не Done лише тому, що сторінка рендериться або HTTP повертає 200. Done потребує required deterministic gates PASS і machine-readable evidence.

Evidence має містити contract/stage, executed gates, verified scope, browser states, findings/exceptions і фінальний status. Якщо будь-який required gate `FAIL` або `BLOCKED`, фінальний status не може бути `PASS`.

MCP може давати додаткові tools, але не є required trusted path. Core verifier має працювати без MCP.

## Universal DoD inheritance

Completion authority є Start Here `DEFINITION_OF_DONE.md` у цільовому repository. Цей reference додає design-specific assertions; він не замінює ту authority і не переказує її матрицю сюди.

- Перед новою design implementation pre-existing staged/modified/untracked стан — hard preflight: інвентаризувати й прив'язати до задачі, інакше статус лишається `In Progress / BLOCKED`.
- Design handoff є review-ready лише після commit + push + remote head == local head + `WORKTREE CLEAN: PASS` від `python .vaoferi/check_worktree_clean.py`.
- UI/layout/responsive зміни успадковують **risk-tiered** browser matrix з універсального DoD: V2 перевіряє affected surfaces + owner-reproduced states + affected breakpoint boundaries; повна canonical matrix належить V4 broad/high-risk/release health.
- Automated browser geometry/visibility regression лишається mandatory для responsive/layout роботи, але його range має відповідати affected surface/risk tier. Exhaustive interval потрібен для V4 або для bounded edge range, де він реально доводить ризик; ручна visual QA на reviewer-accessible target лишається поверх machine evidence.
- Якщо `DEFINITION_OF_DONE.md` у цільовому repository відсутній або застарілий, design робота fail-closed за baseline-правилами сесії: спершу adoption DoD, потім design зміни.
