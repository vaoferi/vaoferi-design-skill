# Design Lifecycle v1.1

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
stage=<stage>
importantPolicy=ENFORCED
changedFilesPolicy=STRICT
browserGate=READY|INSTALLABLE|BLOCKED
relevantExceptions=[...]
```

Для browser-required stage `INSTALLABLE` означає: спочатку встановити/увімкнути потрібний verifier. `BLOCKED` означає: не продовжувати stage і не називати задачу Done.

## Lifecycle Semantics

- `audit` — тільки діагностика repo/capabilities/ownership; не мутує проект.
- `init` — створює design contract для нового/неінстальованого проекту.
- `migrate` — переводить стару керовану версію на нову schema/contract version без втрати human-owned content.
- `augment` — додає contract до існуючого проекту, зберігаючи його design fingerprint і deliberate exceptions.
- `update` — змінює тільки managed ownership.
- `doctor` — перевіряє manifest, schemas, adapters, markers, gates і browser capability.
- `rollback` — відновлює попередній managed state, не торкаючись human-owned content поза ownership.

Hard verification semantics знаходяться в `references/verification.md`; stage ownership — у `references/stages.md`.
