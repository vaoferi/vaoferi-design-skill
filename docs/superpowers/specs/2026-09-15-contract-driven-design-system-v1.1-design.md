# Vaoferi Design Skill v1.1 — Contract-driven, machine-verifiable UI

Date: 2026-09-15
Status: approved by owner for implementation
Target repository: `vaoferi/vaoferi-design-skill`

## 1. Goal

Turn the skill from prompt-driven design guidance into a universal design layer that can be installed into new and existing repositories, preserves project-specific visual systems, blocks unsafe silent drift, and produces machine-verifiable evidence before an agent can claim a UI task is done.

The trust model is:

```text
human/project chooses contract
        ↓
agent implements inside contract
        ↓
mandatory verifier checks changed work
        ↓
PASS / FAIL / BLOCKED + evidence
```

The skill is universal; brand, product, stack and visual identity remain project-local.

## 2. Non-negotiable principles

1. Geometry before decoration.
2. Locked upper layers: lower stages may not mutate higher stages.
3. No silent compromise: fitting problems fail instead of stretching the contract.
4. Few legal layout modes; no arbitrary local geometry proliferation.
5. References contribute selected DNA, not foreign frame/colors/spacing by default.
6. Responsive behavior is continuous, not validated only at named device widths.
7. Objective rules are machine gates; subjective qualities are separate review.
8. Evidence beats agent self-report.
9. Existing sites are preserved first; adoption does not imply redesign.
10. The skill is an orchestrator around project-local state and verifier outputs.
11. Missing verification capability is a blocker, not a reason to skip verification.
12. New or touched code is held to current rules even when untouched legacy remains baselined.

## 3. Documentation boundary

This skill owns only the design layer. It must not duplicate general repository governance.

Recommended target-repo ownership:

```text
AGENTS.md
  -> short router: when UI/design is touched, invoke Vaoferi Design Skill and read DESIGN.md

PROJECT_RULES.md
  -> project-only technical/business/deploy constraints

DESIGN.md
  -> project-local visual truth: brand, typography, palette, frame presets, spacing, components, approved exceptions

.design/
  -> machine-readable design truth and evidence
```

A large prose `DESIGN_RULES.md` is not created by default. If a host/tool requires it, create only a short generated router that points to the skill, `DESIGN.md`, and `.design/contract.json`.

The skill may add managed blocks to existing docs, but may not overwrite project-owned prose outside those blocks.

## 4. Managed ownership

Each installed project gets:

```text
.design/
  manifest.json
  contract.json
  status.json
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
  reports/
```

`manifest.json` records at minimum:

```text
skillVersion
schemaVersion
installMode
detectedStack
enabledAdapters
managedFiles
managedBlocks
baselineVersion
contractVersion
```

Lifecycle commands must update only managed files/blocks unless an explicit migration action is approved.

## 5. Lifecycle modes

The public lifecycle is:

```text
design audit
design init
design migrate
design augment
design update
design doctor
design rollback
```

### `design audit`

Read-only. Discovers stack, UI surface, existing docs, design tokens, components, test/browser capabilities, CI hooks, legacy debt, secrets/hygiene risks, generated/vendor paths and conflicts.

### `design init`

For greenfield repositories. Creates a strict design contract with zero legacy baseline by default.

### `design migrate`

For repositories where old design instructions/docs must be normalized into the new system. Never performs a blind rewrite.

### `design augment`

For existing or external projects where project-owned documentation must be preserved. Adds only managed blocks/files.

### `design update`

Updates the skill-owned layer without rewriting project-owned content.

### `design doctor`

Detects drift: missing managed blocks, disabled checks, enlarged baseline, broken adapters, changed stack, stale contract, disabled CI gate.

### `design rollback`

Restores only changes owned by the skill from the recorded manifest/state.

## 6. Existing Site Mode

Ready sites are preserved by default.

For a local UI task the skill first creates a minimal design fingerprint from representative pages/components, not a full redesign audit.

Minimum fingerprint:

- dominant container widths and gutters;
- header inner edges and major content alignment anchors;
- common spacing values/tokens;
- typography hierarchy;
- palette and semantic colors;
- radius, border and shadow language;
- existing buttons/cards/forms/navigation primitives;
- responsive breakpoints/topologies;
- framework/component library;
- deliberate exceptions that repeat consistently.

Header/content alignment is a strong candidate invariant, not a universal law. If the current product consistently uses a wider header than body content, that established pattern is preserved and documented.

A small requested change must not silently expand into a site redesign. If a local implementation can preserve the current system, do that. If the task requires a systematic redesign, report the scope/risk and stop for explicit approval.

## 7. Capability gate — verification may not be skipped

Before any implementation that requires rendered UI verification, the skill performs capability detection.

It checks for usable browser/test tooling, for example:

- existing Playwright;
- another browser automation stack with equivalent required capabilities;
- installed browser runtime;
- existing CI/browser harness;
- optional MCP adapters.

The result is one of:

```text
READY
INSTALLABLE
BLOCKED
```

### READY

A supported capability exists and can run required checks.

### INSTALLABLE

Required capability is absent but can be added safely. The skill must stop normal implementation, name the missing capability, propose the concrete installation/integration, and install it only when the current execution environment permits and project policy allows it.

### BLOCKED

The skill cannot obtain the required capability in the current environment. It must not mark the UI task Done or silently downgrade regression verification. It reports exactly what is missing, which stages cannot be trusted, and the next action required.

MCP is an optional adapter, never the only path. The core verifier must work without MCP.

## 8. Browser verification is mandatory for web UI

For a browser-based UI, regression geometry tests are not optional.

If no supported browser automation is available, the process stops at the capability gate.

The verifier must support real rendered geometry via DOM/browser APIs; static source inspection alone is insufficient for responsive proof.

## 9. Responsive verification — exhaustive focused sweep

Canonical viewports remain useful as human review anchors, but they are not enough.

For each changed/touched responsive component or route, the default focused verification is exhaustive across every integer CSS-pixel width in the configured supported interval unless the project contract explicitly narrows the interval.

Example:

```text
320, 321, 322, ... 1919, 1920
```

For each width, validate all required orientation/aspect configurations declared by the contract. Portrait/landscape are explicit states; relevant height/aspect ranges are not inferred from width alone.

The verifier must detect at minimum:

- overlap/collision;
- forbidden clipping;
- accidental horizontal scroll;
- unexplained large empty regions;
- element disappearance outside policy;
- frame/gutter drift;
- alignment-track drift;
- illegal orphan topology;
- illegal topology not declared in the contract;
- breakpoint jump outside an approved transition;
- content overflow outside declared policy.

Canonical breakpoints are additionally tested at `-2, -1, 0, +1, +2`.

For full-repository/nightly CI, adaptive sampling may be used for unchanged surfaces, but **changed/touched UI must receive the strict focused sweep**.

No sampling mode may silently replace the strict changed-surface sweep.

## 10. Changed-files strictness and legacy ratchet

Legacy repositories use baseline + ratchet.

Untouched historical violations may be recorded in `baseline.json`.

Rules for current work:

1. A newly created file must satisfy all active hard rules.
2. A modified file is subject to hard rules on changed code and, where safe and unambiguous, the entire file.
3. The baseline may not grow without explicit approval.
4. Removing old violations shrinks the baseline.
5. CI fails if a change introduces a new violation even when identical legacy violations still exist elsewhere.

The verifier must distinguish:

```text
legacy-baselined
new-violation
baseline-regression
fixed-legacy
```

## 11. `!important` hard rule

`!important` is forbidden in project-authored UI/CSS by default.

This is a machine-enforced hard rule, not merely prose.

Default policy:

```text
new `!important` in authored code -> FAIL
baseline legacy `!important` -> tolerated only while untouched/baselined
baseline growth -> FAIL
```

A project may define a tiny explicit exception allowlist only when technically unavoidable. Each exception must include:

- exact file/rule/location scope;
- reason;
- owner approval reference;
- expiry/review intent where practical.

A broad `stylelint-disable`, inline disable directive, or verifier exclusion may not be used as a shortcut.

Third-party/vendor/generated code is excluded by ownership classification, not by ad-hoc agent judgment.

## 12. Anti-bypass

The following are themselves policy violations unless explicitly approved:

- disabling a design/lint rule merely to get green CI;
- adding `stylelint-disable`/equivalent suppression around new violations;
- adding `continue-on-error` to a required design gate;
- deleting or weakening a failing test instead of fixing the code;
- expanding ignore/vendor/generated globs to hide project-authored files;
- enlarging the baseline to absorb new violations;
- skipping browser verification because no browser tool was already present.

The verifier/CI configuration must be tested with intentional failure fixtures so a green result proves the gate can actually catch defects.

## 13. Context economy and re-read policy

Do not repeatedly inject the entire design documentation into the LLM context.

Use a layered strategy:

1. `AGENTS.md` contains a short mandatory router.
2. `SKILL.md` contains stage order + hard invariants + links to lazy-loaded references.
3. Detailed stage references load only when that stage is executed.
4. Machine gates catch violations independently of agent memory.
5. Before every UI/design implementation batch and after any known context compaction/restart, run a small `design preflight` that re-reads the short invariant manifest and current project contract status.

The preflight must include at least:

- active contract/version;
- current stage permissions;
- `!important` hard ban;
- changed-files strictness;
- required browser/regression gate;
- approved exceptions relevant to touched files.

The system must not rely on proving that an LLM remembered a long Markdown file.

## 14. Layered design state machine

Mandatory order:

```text
context/content inventory
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
/reference
        ↓
/visual
        ↓
/responsive
        ↓
/verify
```

A later stage checks predecessor state. Missing predecessors are run only when safely derivable; otherwise stop and request the missing decision.

Only `/frame` may change frame-owned geometry.

## 15. Frame contract

The project chooses a small legal vocabulary of frame modes, normally at most five.

Recommended initial modes:

- `inset`;
- `edge-to-edge`;
- `inset-wide`;
- `viewport-hero`;
- optional project-approved macro split.

All `inset` sections share the active global gutter for the responsive state. Arbitrary section-specific gutter values are forbidden.

Viewport-locked sections use explicit content-fit policies; extra content may not silently increase the section height.

Changing frame requires a `/frame` action with impact analysis and explicit approval.

## 16. Content fit policy

Allowed policies:

- `reject`;
- `truncate`;
- `clamp-lines`;
- `internal-scroll`;
- `paginate`;
- `compact`.

A stage may not invent a new overflow policy merely to pass verification.

## 17. Rhythm

Supported strategies:

- `existing`;
- `4x`;
- `fibonacci`;
- `custom-approved`.

Raw one-off spacing is rejected when the contract controls the property and an approved token exists.

## 18. Placement and alignment

Elements remain inside their legal region by default. Cross-region overlap requires a recorded exception.

Alignment uses a small set of dominant horizontal/vertical tracks. New dominant tracks require an explicit reason and contract update rather than a silent local nudge.

Rendered geometry is measured from the browser with project-defined tolerance.

## 19. Flow and orphan prevention

Balanced repeated collections reject accidental orphan topologies when a legal balanced topology exists.

Examples of invalid defaults:

```text
2 + 2 + 1
3 + 3 + 1
```

All-in-one-row, all-in-one-column, and true single-item collections remain valid.

Topology choice is deterministic and constrained by min/max width, reading order, touch size, overflow and declared density.

## 20. Reference handling

References may contribute narrowly selected visual/interaction traits. They do not silently override frame, project gutters, spacing scale, alignment tracks, responsive topology, palette, typography tokens or section-height policy.

Explicit reference exceptions are recorded in `exceptions.json` so later agents do not "fix" intentional differences.

## 21. Visual layer

Color, typography, radius, border, shadow, icon treatment, imagery, hover/focus and restrained motion are applied only after structural layers are approved.

The visual stage may not repair a problem by changing locked geometry.

## 22. Visual mass and media

Where focal point/safe-zone/subject metadata exists, it is deterministic and may hard-fail invalid crops or overlaps.

Opaque saliency/vision heuristics may warn but do not become hard blockers by themselves unless converted into an explicit project contract.

## 23. Verifier pyramid

The verifier is layered by cost:

```text
Tier 0  contract/schema/stage ownership
Tier 1  static policy lint
Tier 2  source-level design contract tests
Tier 3  component/behavior tests
Tier 4  browser geometry + responsive sweep
Tier 5  visual regression / screenshot evidence
Tier 6  human/physical-device review when required
```

A higher tier does not excuse a missing lower tier.

The required tier set is derived from task type. Browser UI changes require Tier 4 at minimum.

## 24. Tooling architecture

The verifier exposes stable interfaces rather than library-specific contracts.

Example:

```text
SchemaValidator
  validate(schema, document) -> valid | violations
```

Initial implementation:

```text
AjvSchemaValidator
  -> isolated CommonJS/ESM compatibility adapter
  -> Ajv
```

The rest of the system must not depend directly on Ajv packaging details.

Browser verification similarly uses an adapter interface. Playwright is the preferred initial implementation when no adequate project-native browser harness exists.

MCP adapters remain optional integration surfaces.

## 25. Bootstrap capability detection

Before adding dependencies, audit the project and prefer reuse in this order:

1. working project-native verifier/tool;
2. installed dependency with equivalent capability;
3. skill-managed isolated tool/adaptor;
4. new project dependency only when integration requires it.

Never downgrade required verification simply because nothing was installed beforehand.

## 26. Hygiene before documentation migration

Before extracting/merging old documentation, scan for:

- `.env`/credentials/secrets;
- session dumps/logs/raw traces;
- generated/vendor files;
- obsolete docs;
- historical docs that must not become current truth.

Migration must not copy secrets or historical operational data into new canonical docs.

## 27. CI semantics

Fast local command:

```text
design verify --changed
```

Expected responsibility:

- contract integrity;
- strict changed-file policy;
- anti-bypass;
- static lints;
- focused browser sweep for touched UI when browser verification is required.

Full command:

```text
design verify --full
```

Used in CI/nightly/release validation for broader repository coverage.

A required gate failing or being unavailable produces non-zero status. "Tool missing" is not a pass.

## 28. General linter/governance handoff

The following ideas are design-derived but generally useful and should be handed to the repository-wide documentation/lint governance track instead of duplicated here:

- no new suppression directives solely to make checks green;
- strict changed-files/new-code policy with legacy ratchet;
- intentional-failure self-tests for critical CI gates;
- forbid widening ignore globs to hide authored code;
- generated/vendor ownership classification;
- encoding/mojibake checks;
- secret/credential checks before documentation migration.

The design skill owns the design-specific implementations such as `!important`, visual tokens, geometry and responsive verification.

## 29. Done criteria

A design/UI task is Done only when all applicable conditions hold:

- predecessor design stages are approved;
- unauthorized upper-layer mutation is absent;
- required capability gate is READY;
- changed/new authored files pass hard rules;
- no new `!important` appears outside an explicit approved exception;
- focused responsive sweep passes for touched UI;
- browser geometry checks pass when the task renders in a browser;
- baseline did not grow;
- anti-bypass checks pass;
- evidence report exists;
- any manual review explicitly required by the contract is recorded.

If any mandatory capability is unavailable, status is BLOCKED, never Done.

## 30. Implementation order

1. Stabilize core validator boundary (`SchemaValidator`, initial Ajv adapter).
2. Implement contract/status/frame schemas and ownership checks.
3. Implement repository audit + capability detection.
4. Implement managed ownership/manifest.
5. Implement changed-files baseline/ratchet and anti-bypass.
6. Implement `!important` hard rule and allowlist mechanism.
7. Implement Existing Site fingerprint.
8. Implement stage state machine and layer permissions.
9. Implement browser adapter and capability blocker.
10. Implement responsive focused exhaustive sweep.
11. Add static design-contract tests and intentional failure fixtures.
12. Implement lifecycle commands: audit/init/migrate/augment/update/doctor/rollback.
13. Integrate CI adapters and evidence reports.
14. Add repository fixtures for greenfield, legacy, existing-site and blocked-capability scenarios.
15. Only after the skill is stable, prepare controlled multi-repo rollout/migration instructions.

## 31. Explicit non-goals for v1.1

- Do not redesign existing sites automatically.
- Do not make MCP a mandatory runtime dependency.
- Do not force every repository to adopt the same application stack.
- Do not duplicate universal design rules across every project doc.
- Do not make opaque vision heuristics hard blockers without explicit measurable contracts.
- Do not mass-migrate all user repositories until the verifier and lifecycle are tested on fixtures and at least one controlled real project.
