# Vaoferi Design Skill v1.2 — Design Scopes, Adoption Contract, and Admin Workspace Architecture

Date: 2026-09-16
Status: approved in conversation; implementation pending written-spec review
Target repository: `vaoferi/vaoferi-design-skill`
Base: v1.1 contract-driven verifier architecture

## 1. Purpose

v1.1 establishes a universal design contract, mandatory verification, browser regression checks, legacy baseline ratchet, anti-bypass, managed ownership, preflight, and evidence.

v1.2 adds three missing architectural layers:

1. **Adoption Contract** — installing/preparing the design system must not silently become redesign work.
2. **Design Scopes** — one repository may contain multiple unrelated UI/design systems such as public frontend, admin, cabinet, internal tools, embedded apps, or shared UI.
3. **Admin Workspace Architecture** — complex operational/admin screens need an information-and-action model optimized for dense work, not marketing-layout aesthetics.

The core principle becomes:

```text
repository != one design system
adoption != redesign
admin workspace != landing page
```

## 2. Trust model

The existing trust model remains:

```text
human/project chooses contract
        ↓
agent implements inside the resolved scope contract
        ↓
mandatory verifier checks changed work
        ↓
PASS / FAIL / BLOCKED + evidence
```

v1.2 adds an earlier routing layer:

```text
requested task / touched files / routes
        ↓
scope resolver
        ↓
one or more explicit design scopes
        ↓
profile + local contract
        ↓
implementation + verification
```

If scope resolution is ambiguous, the system fails closed rather than guessing.

## 3. Adoption Contract

The lifecycle must clearly separate repository preparation from UI work.

### 3.1 `design audit`

Read-only.

May inspect:

- stack;
- UI surfaces;
- routes and path ownership;
- current design docs;
- CSS/tokens/components;
- browser/test/CI capabilities;
- legacy violations;
- potential design scopes;
- generated/vendor boundaries;
- existing admin/public split;
- technical hygiene relevant to installation.

Must not modify production UI, styles, templates, components, or layout.

### 3.2 `design init`

Prepares a repository for future design work.

Allowed actions include:

- create/update skill-owned `.design/*` state;
- create managed design-router blocks in `AGENTS.md` or host-specific equivalents;
- create or normalize `DESIGN.md` routing information;
- create scope contracts;
- capture existing-site fingerprints;
- establish legacy baselines;
- install/configure required verifier dependencies when policy permits;
- configure browser verification/Playwright or equivalent adapter;
- wire scripts and CI gates;
- run installation verification.

`design init` must not redesign production UI.

### 3.3 `design migrate`

Migrates old design documentation/rules into the new ownership model.

It may move, condense, or replace duplicated design prose after preserving relevant project-local facts.

It must not treat migration as permission to restyle the product.

### 3.4 `design work`

Normal mode for a requested UI/design task.

This mode resolves the affected scope, loads only the necessary scope contract, performs the requested work, and runs strict changed-surface verification.

### 3.5 `design redesign`

Explicit mode for intentional system-level visual or structural change.

Only this mode, or an explicit approved stage action such as `/frame`, may intentionally change established geometry/system-level design assumptions beyond the local task.

### 3.6 Hard adoption invariant

```text
install / init / migrate != redesign
```

A test fixture must prove that adoption changes only managed documentation/tooling/state and does not mutate representative production UI files.

## 4. Repository-level design topology

A repository has a project-level design manifest plus zero or more design scopes.

Recommended machine structure:

```text
.design/
  project.json
  manifest.json
  reports/

  scopes/
    frontend/
      contract.json
      frame.json
      rhythm.json
      placement.json
      alignment.json
      flow.json
      responsive.json
      visual.json
      references.json
      exceptions.json
      baseline.json
      fingerprint.json
      status.json

    admin/
      ...same contract family...
```

Project-level state owns universal policy and scope routing. Scope-level state owns local visual/design truth.

## 5. Universal policy vs scope-local policy

The following remain repository-wide hard rules unless explicitly configured otherwise:

- no new authored `!important` except exact approved exception;
- changed/touched authored code is strict;
- anti-bypass;
- baseline may not grow without approval;
- required browser verification may not be skipped;
- PASS/FAIL/BLOCKED evidence;
- managed ownership boundaries;
- stage ownership rules;
- capability gate;
- context/preflight rules.

The following may differ by scope:

- colors/palette;
- typography;
- spacing/rhythm;
- density;
- container widths;
- gutters;
- frame modes;
- component families;
- radius/borders/shadows;
- breakpoints/topologies;
- allowed responsive transformations;
- interaction profile;
- visual references;
- deliberate local exceptions.

No visual inheritance between scopes is assumed by default.

## 6. Scope declaration

Each scope has a stable ID and routing hints.

Example:

```json
{
  "id": "admin",
  "profile": "admin-dense",
  "paths": ["backend/**", "views/admin/**"],
  "routes": ["/admin/**"],
  "entrypoints": ["backend/web/index.php"],
  "sharedWith": [],
  "contractPath": ".design/scopes/admin/contract.json"
}
```

Another scope may be:

```json
{
  "id": "frontend",
  "profile": "public-content",
  "paths": ["frontend/**", "views/public/**"],
  "routes": ["/**"],
  "excludeRoutes": ["/admin/**"]
}
```

Exact schema details are implementation work; the architectural invariant is explicit scope ownership.

## 7. Scope resolver

The resolver determines which scope contract applies to the requested/touched work.

Evidence may include:

1. explicit user-selected scope;
2. exact path mapping;
3. route mapping;
4. framework/module ownership;
5. component ownership metadata;
6. existing manifest mapping.

Priority must be deterministic.

### 7.1 Ambiguous scope

If a changed file belongs to multiple unrelated scopes and no explicit shared scope exists:

```text
SCOPE_AMBIGUOUS -> BLOCKED
```

The agent must not silently choose frontend/admin based on style preference.

### 7.2 Unknown scope

If a UI file/route is not mapped:

```text
SCOPE_UNMAPPED -> BLOCKED or explicit mapping proposal
```

The system may propose a new scope or mapping, but must not silently attach the file to an existing scope.

### 7.3 Multi-scope task

A task may legitimately touch multiple scopes.

Each touched scope gets independent preflight, contract loading, and verification evidence.

A PASS in frontend does not hide FAIL/BLOCKED in admin.

## 8. Shared UI

Shared components are explicit, not inferred.

Valid patterns include:

- a dedicated `shared-ui` scope;
- shared primitive package with its own contract;
- explicit `sharedWith` declaration plus compatibility rules.

A component used by frontend and admin must not automatically inherit either scope's palette, spacing, or density.

Shared primitives should expose neutral structure/tokens where practical; scope adapters may apply local visual tokens.

## 9. Project documentation routing

`DESIGN.md` becomes a short design topology/router when multiple scopes exist.

Example:

```text
Design scopes

frontend
- docs/design/frontend.md
- .design/scopes/frontend/

admin
- docs/design/admin.md
- .design/scopes/admin/
```

Do not duplicate the universal Vaoferi Design rules inside each scope document.

`AGENTS.md` remains a short mandatory router: UI/design work must resolve the design scope and invoke the design preflight before implementation.

## 10. Surface profiles

A scope declares a surface profile. Initial profiles:

- `public-content` — general public/product/content UI;
- `marketing-editorial` — expressive landing/editorial composition;
- `application-standard` — general app/workflow UI;
- `admin-standard` — operational UI with moderate density;
- `admin-dense` — complex operational workspace with high information/action density;
- `custom-approved`.

Profiles provide defaults and required planning behavior. They do not override an existing project fingerprint.

## 11. Admin Workspace principle

Admin UI is optimized for operational work:

```text
find information quickly
understand current state
edit safely
perform frequent actions efficiently
avoid accidental destructive actions
retain context while working
```

The primary quality target is not dramatic visual whitespace or marketing aesthetics.

Admin design prioritizes:

- information hierarchy;
- scanability;
- density control;
- logical grouping;
- action hierarchy;
- safe destructive operations;
- predictable form structure;
- state visibility;
- efficient keyboard/mouse use where applicable;
- responsive preservation of critical workflow.

## 12. Interaction Topology stage

For `admin-standard` and especially `admin-dense`, complex pages add a planning stage before frame/layout implementation:

```text
content inventory
        ↓
interaction topology
        ↓
/frame
        ↓
/rhythm
        ↓
/place
        ↓
/align
        ↓
/flow
        ↓
/visual
        ↓
/responsive
        ↓
/verify
```

The topology describes what belongs together and how the operator works with the page.

At minimum it may classify:

- summary/status information;
- frequent-edit fields;
- rare-edit fields;
- read-only metadata;
- repeated collections;
- table/list areas;
- primary page actions;
- section-level actions;
- row/context actions;
- bulk actions;
- destructive actions;
- danger zone;
- audit/history/log data;
- secondary/disclosable information.

The topology is structural, not decorative.

## 13. Admin complexity gate

A simple admin form may proceed with the normal workflow.

A sufficiently complex page must produce an interaction topology before implementation.

Complexity signals may include combinations of:

- many forms;
- many editable controls;
- many actions/buttons;
- multiple unrelated data regions;
- tables plus forms plus summary state;
- destructive actions;
- bulk operations;
- nested/repeated sections;
- substantial read-only metadata;
- long vertical form chains;
- multiple save/apply scopes.

The exact threshold should be deterministic enough for tooling but must not use one naive rule such as `buttons > 7`.

Recommended model: weighted complexity score plus hard triggers.

Example conceptual score:

```text
forms * weight
+ editable controls * weight
+ action count * weight
+ destructive actions * higher weight
+ independent regions * weight
+ repeated collections * weight
```

Hard triggers may force topology regardless of score, e.g. multiple save scopes plus destructive actions.

## 14. Admin zones

A complex workspace is composed from explicit zones rather than free-form vertical stacking.

Possible zone roles:

- `summary`;
- `status`;
- `identity`;
- `primary-form`;
- `secondary-form`;
- `related-data`;
- `table`;
- `history`;
- `metadata`;
- `actions`;
- `danger-zone`;
- custom project-approved roles.

The verifier should be able to reason about zone ownership and action locality.

## 15. Action hierarchy

Every significant action belongs to a declared role and region.

Initial roles:

- `primary`;
- `secondary`;
- `contextual`;
- `row`;
- `bulk`;
- `navigation`;
- `destructive`;
- `dangerous-destructive`.

Initial regions:

- page actions;
- section actions;
- row actions;
- bulk actions;
- danger zone.

Rules:

1. A page should not accumulate multiple visually-equal primary actions without explicit reason.
2. Destructive actions must not be visually mixed with routine save/navigation actions without an approved pattern.
3. Section actions stay associated with their section.
4. Row actions stay associated with row/item context.
5. Bulk actions appear only when bulk selection/context exists.
6. Action placement must be consistent across repeated admin patterns.

## 16. Form composition

Admin forms must not default to one endless vertical column when the information model supports clearer grouping.

The agent must first identify:

- logical field groups;
- dependency/order relationships;
- fields requiring full width;
- fields that can share a row;
- validation/error relationships;
- frequent vs rare fields;
- save scope;
- read-only vs editable content.

Allowed strategies may include:

- compact multi-column field groups;
- section cards/panels;
- tabs when categories are genuinely distinct;
- accordions/disclosure for secondary low-frequency content;
- split workspace layouts;
- sticky/fixed local action regions when contract allows;
- progressive disclosure;
- modal/drawer only when context and task justify it.

Tabs/accordions are not automatic dumping grounds for complexity; they must preserve discoverability and workflow.

## 17. Density contract

Density is scope-local.

Initial values:

```text
comfortable
compact
dense
custom-approved
```

An admin scope may use a tighter rhythm such as 4/8/12/16/24 while frontend uses an unrelated system.

The verifier must not treat cross-scope spacing differences as drift.

Within a scope, arbitrary local spacing still violates the active rhythm contract.

## 18. Admin responsive model

Admin responsive behavior is workflow-preserving rather than purely aesthetic.

Typical topology transition:

```text
wide workspace
-> reduced multi-column workspace
-> 2-column
-> single-column / staged disclosure
```

The contract must preserve:

- primary actions;
- critical status;
- destructive safeguards;
- accessible validation/errors;
- required context for editing;
- tables/lists via approved overflow or alternative presentation;
- logical form grouping.

A mobile layout that merely stacks every control in source order may fail if it destroys the planned information/action hierarchy.

## 19. Admin anti-pattern checks

The verifier should gradually gain deterministic checks for common failures.

Examples:

- excessive unrelated full-width controls when grouping is available;
- accidental single-column serialization of a complex workspace;
- too many equal-priority primary actions;
- destructive controls mixed into routine action clusters;
- action buttons visually detached from their owning section/item;
- giant unexplained empty regions;
- form fields or sections with inconsistent alignment/rhythm;
- unplanned horizontal overflow;
- critical actions/status disappearing at responsive widths;
- repeated forms with inconsistent save/action placement;
- orphan buttons/controls;
- page-height explosion caused by an avoidable layout topology.

These checks must be evidence-based and not become arbitrary aesthetic scoring.

## 20. Existing-site fingerprint becomes scope-local

v1.1 fingerprinting is extended per scope.

For example:

```text
frontend fingerprint
!=
admin fingerprint
```

If the admin is Bootstrap-like and the frontend is custom editorial design, both are preserved independently.

A consistent local exception in one scope must not leak into another.

## 21. Scope-local baseline and exceptions

Legacy debt is tracked per scope where practical.

This prevents frontend legacy CSS debt from hiding new admin violations or vice versa.

Evidence should identify:

```text
scopeId
rule
file
location
classification
```

Exceptions are also scope-local unless explicitly repository-wide.

## 22. Scope-aware preflight

The compact preflight gains at least:

```text
contractVersion=<version>
scope=<resolved-scope>
profile=<surface-profile>
stage=<stage>
importantPolicy=ENFORCED
changedFilesPolicy=STRICT
browserGate=READY|INSTALLABLE|BLOCKED
complexityGate=READY|TOPOLOGY_REQUIRED|BLOCKED
relevantExceptions=[...]
```

For multi-scope tasks, preflight must list all resolved scopes and their independent state.

## 23. Scope-aware browser verification

Responsive/browser verification operates on the touched scope/route/component.

The exhaustive changed-surface width sweep remains mandatory where applicable.

The browser verifier must not assume the same frame/gutter/topology across scopes.

## 24. Initialization flow with scopes

Recommended adoption flow:

```text
design audit
  ↓
detect candidate UI surfaces
  ↓
propose scope map
  ↓
resolve ambiguities
  ↓
classify each scope profile
  ↓
capture per-scope fingerprints
  ↓
create per-scope contracts/baselines
  ↓
install verifier/browser/CI infrastructure
  ↓
verify adoption
```

No production redesign occurs during this flow.

## 25. Greenfield behavior

For a new project with public frontend + admin from the beginning:

- create two scopes immediately if their design systems are expected to diverge;
- do not force a shared visual contract merely because the stack/components are shared;
- shared primitives are explicit;
- zero-baseline strict mode applies independently.

## 26. Legacy behavior

For an existing multi-surface project:

- audit actual current systems;
- do not normalize frontend/admin into one visual system unless explicitly requested;
- preserve deliberate differences;
- baseline debt per scope;
- treat unmapped mixed files as migration decisions, not automatic guesses.

## 27. Machine contracts to add

v1.2 implementation should add machine-readable contracts for at least:

- project scope registry;
- scope definition;
- scope profile;
- path/route mapping;
- scope-local contract path;
- ambiguity/unknown-scope result;
- admin complexity result;
- interaction topology;
- action hierarchy;
- density;
- scope-aware preflight/evidence.

Schema details should remain minimal and extensible.

## 28. Required deterministic states

Scope resolver:

```text
RESOLVED
MULTI_SCOPE
SCOPE_AMBIGUOUS
SCOPE_UNMAPPED
```

Admin complexity gate:

```text
READY
TOPOLOGY_REQUIRED
BLOCKED
```

Adoption result:

```text
PASS
FAIL
BLOCKED
```

No ambiguous state may silently degrade into PASS.

## 29. Verification strategy

### Unit

Test:

- exact path resolves correct scope;
- frontend/admin overlapping match becomes `SCOPE_AMBIGUOUS` unless explicitly shared;
- unmapped authored UI becomes `SCOPE_UNMAPPED`;
- multi-scope task returns independent scope set;
- scope-local visual contracts do not inherit each other;
- complexity scoring/hard triggers;
- action hierarchy invariants;
- adoption cannot modify production UI fixture files.

### Integration fixtures

Create representative fixtures:

1. frontend + completely different admin;
2. shared component explicitly declared;
3. ambiguous shared file without declaration -> BLOCKED;
4. dense admin page requiring topology;
5. simple admin form not requiring topology;
6. adoption/init fixture proving tooling/docs change without UI redesign;
7. legacy multi-scope repo with independent baselines.

### Browser

For admin-dense fixture verify at least:

- planned action zones remain associated across widths;
- primary actions remain available;
- destructive actions remain separated;
- no accidental horizontal page overflow;
- topology transitions are declared;
- stacking does not destroy critical grouping.

## 30. Anti-bypass additions

The following are policy violations unless explicitly approved:

- changing scope mapping merely to avoid a failing scope contract;
- moving an authored file into `shared-ui` to weaken stricter frontend/admin rules;
- declaring an unrelated scope exception globally;
- marking a complex admin page `simple` merely to skip topology planning;
- deleting a scope mapping because verification fails;
- making frontend/admin share a visual contract merely to reduce verifier work;
- using adoption/init mode as permission to rewrite production UI.

## 31. Documentation economy

Do not load every scope contract into context.

Default runtime context:

```text
AGENTS router
-> project design topology
-> resolved scope only
-> relevant stage reference only
```

For a backend-only task, no design scope is loaded.

For admin work, frontend visual docs are not loaded unless the task genuinely crosses both scopes.

## 32. Compatibility

v1.1 single-scope repositories remain valid.

A repository without an explicit scope registry is treated as a single default scope until migrated.

Migration to multi-scope must be intentional and should not change visual output by itself.

## 33. Acceptance criteria

v1.2 is complete when all of the following are proven:

1. One repo can define frontend and admin with unrelated visual contracts.
2. A frontend file resolves only frontend rules.
3. An admin file resolves only admin rules.
4. Ambiguous ownership blocks rather than guesses.
5. Shared UI is explicit.
6. Multi-scope tasks verify every touched scope independently.
7. `design init` prepares docs/tooling/contracts without modifying production UI fixtures.
8. Existing-site fingerprints are scope-local.
9. Baselines/exceptions can be scope-local.
10. `admin-dense` complex page requires interaction topology.
11. Simple admin form can proceed without unnecessary topology ceremony.
12. Admin action roles/regions are machine-readable.
13. Destructive and routine actions cannot be silently treated as one undifferentiated action cluster.
14. Scope-specific density/rhythm does not count as cross-scope drift.
15. Responsive admin verification preserves critical workflow and action hierarchy.
16. Scope/profile/complexity state appears in preflight/evidence.
17. All existing v1.1 hard gates remain active.
18. CI contains intentional failure/self-verification for new scope/complexity gates.

## 34. Non-goals for v1.2

Do not attempt to solve:

- automatic universal UX redesign;
- subjective beauty scoring;
- one perfect admin page layout template;
- forced visual unification of frontend/admin;
- full automatic information architecture from arbitrary business semantics without review;
- replacing project-specific domain knowledge.

v1.2 builds routing, constraints, topology discipline, and verification surfaces so future UI work becomes predictable and reviewable.

## 35. Implementation boundary

This document defines architecture only.

After owner review, implementation must proceed through a separate Superpowers implementation plan and TDD.

The current v1.1 verifier remains the base. v1.2 should extend it rather than rewrite proven v1.1 gates.
