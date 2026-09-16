# Design Lifecycle v1.2

Цей reference описує install/update/repair lifecycle. Він потрібен для `audit`, `init`, `migrate`, `augment`, `update`, `doctor`, `rollback` і для context preflight.

## Commands

```text
design audit
design init
design migrate
design augment
design update
design doctor
design rollback
design verify --changed
design verify --full
```

Bare `design verify` означає changed-scope verification; відсутній scope не означає пропуск перевірки.

## Adoption is not redesign

Adoption is not redesign. Installing, migrating, augmenting, auditing, or repairing the design system is a contract/tooling operation unless the user separately authorized a production design change.

- `audit` is read-only: it may inspect repo structure, capabilities, mappings, contracts, ownership, and verification state, but it must not mutate files.
- `init`, `migrate`, and `augment` may create or update explicitly allowed design-managed state, schemas, generated documentation, tooling configuration, CI integration, and contract files.
- Adoption must not change production UI, templates, components, application styles, page geometry, user-facing content, or application behavior merely to make the project conform to a preferred design.
- A project-owned file not explicitly classified as adoption-managed is fail-closed. Do not assume it is safe because its name looks like configuration.
- If adoption discovers a production UI defect, report it separately. Fix it only under an explicit UI/design task and the normal scope/stage/verifier flow.

Multi-scope adoption creates or updates scope contracts independently. It does not make one scope inherit another scope's palette, density, tokens, or component policy unless an explicit shared source is part of the contract.

## Manifest

`.design/manifest.json` є machine-owned описом lifecycle state. Canonical fields:

- `skillVersion`
- `schemaVersion`
- `installMode`
- `detectedStack`
- `enabledAdapters`
- `managedFiles`
- `managedBlocks`
- `baselineVersion`
- `contractVersion`

Manifest валідний тільки за `schemas/manifest.schema.json`. Unknown top-level fields не допускаються.

## Managed Ownership

Updater має право змінювати лише те, що явно записано в manifest:

- `managedFiles` — файл повністю належить design lifecycle;
- `managedBlocks` — тільки блок між точними markers.

Markers:

```text
<!-- vaoferi-design:start:<blockId> -->
...
<!-- vaoferi-design:end:<blockId> -->
```

Missing, duplicate або malformed markers = BLOCKED. Не переписуй весь human-owned документ, щоб «полагодити» markers.

`update` не може мовчки привласнити нові файли або блоки. `rollback` працює тільки з manifest-owned state.

## Compact Preflight

Preflight запускається:

1. на task start;
2. після context compaction;
3. після context restart;
4. перед stage transition.

Мінімальний snapshot:

```text
contractVersion=<version>
scope=<scopeId|BLOCKED>
profile=<profile>
stage=<stage>
importantPolicy=ENFORCED
changedFilesPolicy=STRICT
browserGate=READY|INSTALLABLE|BLOCKED
relevantExceptions=[...]
```

Для browser-required stage `INSTALLABLE` означає: спочатку встановити/увімкнути потрібний verifier. `BLOCKED` означає: не продовжувати stage і не називати задачу Done.

## Lifecycle Semantics

- `audit` — тільки діагностика repo/capabilities/ownership; не мутує проект.
- `init` — створює design contract для нового/неінстальованого проекту, не переписуючи production UI.
- `migrate` — переводить стару керовану версію на нову schema/contract version без втрати human-owned content і без redesign.
- `augment` — додає contract до існуючого проекту, зберігаючи його design fingerprint і deliberate exceptions.
- `update` — змінює тільки managed ownership.
- `doctor` — перевіряє manifest, schemas, adapters, markers, gates і browser capability.
- `rollback` — відновлює попередній managed state, не торкаючись human-owned content поза ownership.

Scope routing semantics знаходяться в `references/scopes.md`; hard verification semantics — у `references/verification.md`; stage ownership — у `references/stages.md`.
