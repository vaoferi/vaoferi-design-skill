# Contract-driven Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `vaoferi-design-skill` from a prompt-driven design checklist into a contract-driven UI system with locked design layers, deterministic verification, continuous responsive checks, and compact machine-readable failures.

**Architecture:** Keep `SKILL.md` as a short provider-neutral orchestrator, add project-local `.vaoferi-design/` state governed by JSON Schemas, and implement a TypeScript verifier package that owns contract integrity, static CSS checks, Playwright geometry checks, flow/alignment rules, and responsive sweeps. Higher layers are immutable to lower commands; `/frame` is an armored geometry layer whose changes require a separate impact-analysis + confirmation flow. Expensive visual heuristics remain optional and cannot override hard deterministic rules.

**Tech Stack:** TypeScript, Node.js, Vitest, Playwright, Stylelint custom plugins, fast-check, JSON Schema validation via Ajv, existing Python repo checks retained.

**Spec:** `docs/superpowers/specs/2026-09-15-contract-driven-design-system-design.md`

## Global Constraints

- `SKILL.md` remains a short entrypoint; detailed command semantics live under `references/` and executable behavior lives under `verifier/`.
- Target-project state lives under `.vaoferi-design/`; no prompts, transcripts, chain-of-thought, or provider logs are stored there.
- `/frame` is the only command allowed to mutate frame-owned state.
- Lower-level commands may read upper layers but may not silently modify them.
- No silent layout compromise: invalid content fit, undefined responsive topology, unauthorized contract mutation, overflow, overlap, frame drift, and hard orphan states must produce non-zero exit status.
- Existing sites use audit/baseline adoption; they are not mass-rewritten.
- Objective rules are hard failures; heuristic visual rules are warnings unless the project explicitly declares machine-readable metadata that makes them deterministic.
- `!important` is forbidden by default; suppression comments must not be added merely to make gates green.
- Golden Ratio/Fibonacci are explicit modes or macro constraints, not fake precision applied to every CSS value.
- Continuous responsive verification must use browser geometry and consume zero LLM tokens for normal PASS/FAIL evaluation.
- Verifier output must support compact JSON so coding agents receive violations rather than screenshot-heavy context.
- Existing repo Python checks and UTF-8/no-BOM requirements remain valid.

---

## File Structure

Create or modify these units. Keep each unit focused so it can be understood and tested independently.

```text
package.json
package-lock.json
tsconfig.json
vitest.config.ts
playwright.config.ts

verifier/
  src/
    cli.ts
    core/
      paths.ts
      types.ts
      errors.ts
      json.ts
      contract-loader.ts
      stage-order.ts
      layer-ownership.ts
      report.ts
      impact.ts
    commands/
      init.ts
      status.ts
      frame.ts
      rhythm.ts
      place.ts
      align.ts
      flow.ts
      reference.ts
      visual.ts
      responsive.ts
      verify.ts
    static/
      stylelint-plugin.ts
      stylelint-config.ts
    browser/
      launch.ts
      selectors.ts
      geometry.ts
      layout-signature.ts
      alignment.ts
      flow.ts
      responsive.ts
      media-safe-zones.ts
      screenshots.ts
  tests/
    fixtures/
      minimal-project/
      broken-layout/
      legacy-project/
    unit/
      contract-loader.test.ts
      stage-order.test.ts
      layer-ownership.test.ts
      impact.test.ts
      flow-cost.test.ts
      responsive-search.test.ts
      report.test.ts
      stylelint-plugin.test.ts
    browser/
      geometry.spec.ts
      alignment.spec.ts
      flow.spec.ts
      responsive.spec.ts
      media-safe-zones.spec.ts

schemas/
  contract.schema.json
  frame.schema.json
  rhythm.schema.json
  placement.schema.json
  alignment.schema.json
  flow.schema.json
  responsive.schema.json
  visual.schema.json
  references.schema.json
  exceptions.schema.json
  status.schema.json

references/
  contract-model.md
  command-frame.md
  command-rhythm.md
  command-place.md
  command-align.md
  command-flow.md
  command-reference.md
  command-visual.md
  command-responsive.md
  verifier.md
  legacy-adoption.md

examples/
  contracts/
    marketing-fibonacci/
    operational-4x/
    legacy-baseline/

.github/workflows/
  verifier.yml
```

Existing `SKILL.md`, `README.md`, `SPEC.md`, `rubric.md`, `AGENTS.md`, `references/action-contract.md`, `references/quality-gates.md`, examples, and project log are updated only after executable behavior exists.

---

### Task 1: Bootstrap the TypeScript verifier and contract schemas

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `verifier/src/core/types.ts`
- Create: `verifier/src/core/paths.ts`
- Create: `verifier/src/core/json.ts`
- Create: `schemas/*.schema.json`
- Test: `verifier/tests/unit/contract-loader.test.ts`

**Interfaces:**
- Produces: `DesignContract`, `FrameContract`, `RhythmContract`, `StatusContract`, `Violation`, `VerificationReport` TypeScript types.
- Produces: `designStatePath(projectRoot, fileName): string`.
- Produces: JSON Schemas with `schemaVersion: 1` and `additionalProperties: false` for contract-owned files.

- [ ] **Step 1: Add a failing schema-loading test**

```ts
import { describe, expect, it } from 'vitest';
import { loadContractState } from '../../src/core/contract-loader.js';

it('rejects a frame with an unknown property', async () => {
  await expect(loadContractState(fixture('unknown-frame-key')))
    .rejects.toMatchObject({ code: 'CONTRACT_SCHEMA_INVALID' });
});
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
npx vitest run verifier/tests/unit/contract-loader.test.ts
```

Expected: FAIL because `contract-loader.ts` and schemas do not exist.

- [ ] **Step 3: Create the package/tooling files**

`package.json` must expose scripts:

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "test:browser": "playwright test verifier/tests/browser",
    "verify:skill": "python scripts/check_skill_structure.py",
    "vd": "tsx verifier/src/cli.ts"
  }
}
```

Install current stable releases of `typescript`, `tsx`, `vitest`, `ajv`, `stylelint`, `stylelint-test-rule-node`, `@playwright/test`, `fast-check`, and `@types/node`; commit the resolved `package-lock.json` so CI is reproducible.

- [ ] **Step 4: Define narrow v1 schemas**

`frame.schema.json` must support:

```json
{
  "schemaVersion": 1,
  "sectionModes": {
    "inset": { "gutterToken": "space.frame", "maxWidthToken": "size.content.max" },
    "edge-to-edge": { "gutter": 0 }
  },
  "sections": {
    "hero": {
      "mode": "viewport-hero",
      "height": "100dvh",
      "contentOverflow": "reject"
    }
  }
}
```

Allowed `contentOverflow` values: `reject`, `truncate`, `clamp-lines`, `internal-scroll`, `paginate`, `compact`.

`status.schema.json` must allow only `missing | proposed | approved | stale` per stage.

- [ ] **Step 5: Implement schema loading with Ajv**

Create `loadContractState(projectRoot)` that:
1. finds `.vaoferi-design/contract.json`;
2. validates manifest first;
3. loads only referenced layer files;
4. validates each layer against its schema;
5. throws `DesignContractError` with a stable code and JSON-pointer path.

- [ ] **Step 6: Run unit tests**

```bash
npx vitest run verifier/tests/unit/contract-loader.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts playwright.config.ts verifier/src/core verifier/tests/unit/contract-loader.test.ts schemas
git commit -m "feat: add design contract schemas and verifier bootstrap"
```

---

### Task 2: Enforce stage order and locked-layer ownership

**Files:**
- Create: `verifier/src/core/stage-order.ts`
- Create: `verifier/src/core/layer-ownership.ts`
- Create: `verifier/src/core/errors.ts`
- Test: `verifier/tests/unit/stage-order.test.ts`
- Test: `verifier/tests/unit/layer-ownership.test.ts`

**Interfaces:**
- Produces: `assertStageReady(status, targetStage): void`.
- Produces: `snapshotOwnedLayers(projectRoot): Promise<LayerSnapshot>`.
- Produces: `assertMutationAllowed(command, before, after): void`.
- Ownership map is code-defined and mirrors the spec command table.

- [ ] **Step 1: Write failing prerequisite tests**

```ts
expect(() => assertStageReady(status({ frame: 'missing' }), 'align'))
  .toThrowError(expect.objectContaining({ code: 'STAGE_PREREQUISITE_MISSING' }));
```

- [ ] **Step 2: Write failing frame-ownership test**

```ts
const before = snapshot({ frame: 'aaa', alignment: 'bbb' });
const after = snapshot({ frame: 'ccc', alignment: 'ddd' });
expect(() => assertMutationAllowed('align', before, after))
  .toThrowError(expect.objectContaining({ code: 'UNAUTHORIZED_LAYER_MUTATION' }));
```

- [ ] **Step 3: Implement immutable ownership table**

```ts
export const commandWrites = {
  frame: new Set(['frame.json']),
  rhythm: new Set(['rhythm.json']),
  place: new Set(['placement.json']),
  align: new Set(['alignment.json']),
  flow: new Set(['flow.json']),
  reference: new Set(['references.json', 'exceptions.json']),
  visual: new Set(['visual.json']),
  responsive: new Set(['responsive.json']),
  verify: new Set<string>()
} as const;
```

Hash normalized JSON, not raw whitespace, so formatting changes do not create false ownership violations.

- [ ] **Step 4: Implement dependency order**

Hard order:

```text
frame -> rhythm -> place -> align -> flow -> reference -> visual -> responsive
```

A command may run when predecessors are `approved`; `reference` may be `missing` only when no reference is used; all other skipped stages require an explicit schema-supported `notRequired` decision rather than implicit omission.

- [ ] **Step 5: Run tests and commit**

```bash
npx vitest run verifier/tests/unit/stage-order.test.ts verifier/tests/unit/layer-ownership.test.ts
git add verifier/src/core verifier/tests/unit
git commit -m "feat: enforce design stage ownership"
```

---

### Task 3: Add project initialization, status, and frame impact/apply commands

**Files:**
- Create: `verifier/src/cli.ts`
- Create: `verifier/src/commands/init.ts`
- Create: `verifier/src/commands/status.ts`
- Create: `verifier/src/commands/frame.ts`
- Create: `verifier/src/core/impact.ts`
- Test: `verifier/tests/unit/impact.test.ts`
- Create: `references/command-frame.md`

**Interfaces:**
- CLI: `npm run vd -- init --project <path>`.
- CLI: `npm run vd -- status --project <path> --json`.
- CLI: `npm run vd -- frame impact --project <path> --proposal <json-file>`.
- CLI: `npm run vd -- frame apply --project <path> --proposal <json-file> --confirm <impact-hash>`.
- Produces: `FrameImpactReport` with stable SHA-256 `approvalHash` over normalized current frame + proposal + affected inventory.

- [ ] **Step 1: Test that a frame change cannot apply without impact confirmation**

```ts
await expect(applyFrameChange({ projectRoot, proposal, confirm: undefined }))
  .rejects.toMatchObject({ code: 'FRAME_CONFIRMATION_REQUIRED' });
```

- [ ] **Step 2: Implement `init`**

Create `.vaoferi-design/` with validated starter manifest and `status.json`; do not guess frame/rhythm values. For a greenfield project, write `frame: proposed`; for audit mode, write all stages `missing` until baseline discovery.

- [ ] **Step 3: Implement impact analysis**

At minimum report:
- changed frame keys;
- routes/components known from project inventory file when available;
- canonical viewport baselines affected;
- count of contract files whose validity depends on the changed key;
- risk `low | medium | high`, with any gutter/viewport-height/max-width change marked `high` by default.

- [ ] **Step 4: Implement two-step frame apply**

`apply` recomputes the impact hash immediately before writing. If it differs from the supplied hash, fail `FRAME_IMPACT_STALE` rather than applying an outdated approval.

- [ ] **Step 5: Run tests and smoke CLI**

```bash
npx vitest run verifier/tests/unit/impact.test.ts
npm run vd -- init --project verifier/tests/fixtures/minimal-project
npm run vd -- status --project verifier/tests/fixtures/minimal-project --json
```

- [ ] **Step 6: Commit**

```bash
git add verifier/src/cli.ts verifier/src/commands verifier/src/core/impact.ts verifier/tests/unit/impact.test.ts references/command-frame.md
git commit -m "feat: add guarded frame contract workflow"
```

---

### Task 4: Implement rhythm, placement, alignment, flow, reference, visual, and responsive state commands

**Files:**
- Create: `verifier/src/commands/rhythm.ts`
- Create: `verifier/src/commands/place.ts`
- Create: `verifier/src/commands/align.ts`
- Create: `verifier/src/commands/flow.ts`
- Create: `verifier/src/commands/reference.ts`
- Create: `verifier/src/commands/visual.ts`
- Create: `verifier/src/commands/responsive.ts`
- Create: `references/command-*.md`
- Test: extend unit tests for stage order and layer ownership.

**Interfaces:**
- Every command runs `assertStageReady` and layer snapshot checks.
- Every command supports `--json` result output.
- Command output includes `changedFiles`, `stage`, `status`, and violations/warnings.

- [ ] **Step 1: Add failing tests proving each command cannot mutate `frame.json`**

Create one table-driven test over every non-frame command.

- [ ] **Step 2: Implement `/rhythm` modes**

Support:

```ts
type RhythmMode = 'existing' | '4x' | 'fibonacci' | 'custom-approved';
```

Default token examples remain exactly:

```text
4x: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
Fibonacci: 5, 8, 13, 21, 34, 55, 89
```

- [ ] **Step 3: Implement placement and explicit cross-region exceptions**

A placement entry must reference one region. Cross-region behavior requires an `exceptions.json` entry with element ID, allowed crossing, reason, responsive states, and verifier treatment.

- [ ] **Step 4: Implement alignment track state**

Store track IDs, axis, source (`grid`, `edge`, `baseline`, `center`, `custom-approved`), value/token, and tolerance. Adding a fifth dominant local track must require an explicit reason field when the composition already has two vertical and two horizontal dominant tracks.

- [ ] **Step 5: Implement flow policies**

Store item selector/component ID, min/max item width, preferred density, legal topology names, and orphan policy.

- [ ] **Step 6: Implement reference and visual state**

Reference traits are allowlisted fields; imported raw geometry/palette cannot write into upper-layer files. Visual state contains tokens/effects only.

- [ ] **Step 7: Implement responsive state**

Store min/max supported width, canonical states, orientation, declared breakpoints, topology map, and sweep mode (`focused-exhaustive | adaptive`).

- [ ] **Step 8: Run unit tests and commit**

```bash
npx vitest run verifier/tests/unit
git add verifier/src/commands references/command-*.md verifier/tests/unit
git commit -m "feat: add layered design contract commands"
```

---

### Task 5: Add static CSS contract enforcement with Stylelint

**Files:**
- Create: `verifier/src/static/stylelint-plugin.ts`
- Create: `verifier/src/static/stylelint-config.ts`
- Test: `verifier/tests/unit/stylelint-plugin.test.ts`
- Create: `references/verifier.md`

**Interfaces:**
- Produces Stylelint plugin rules:
  - `vaoferi/no-raw-contract-spacing`
  - `vaoferi/no-layout-overflow-mask`
  - `vaoferi/no-contract-suppression`
- Uses built-in `declaration-no-important: true`.

- [ ] **Step 1: Write rule tests before implementation**

Reject:

```css
.card { gap: 17px; }
.hero { overflow-x: hidden; }
.x { color: red !important; }
/* stylelint-disable vaoferi/no-raw-contract-spacing */
```

Accept token-backed or explicitly non-contract properties:

```css
.card { gap: var(--space-3); }
.logo { border-width: 1px; }
```

- [ ] **Step 2: Implement `no-raw-contract-spacing`**

Read approved spacing token values/names from `.vaoferi-design/rhythm.json`. Only enforce properties declared contract-controlled; do not ban every numeric CSS value globally.

- [ ] **Step 3: Implement suppression guard**

A suppression is legal only when paired with a machine-readable approved exception ID, e.g.:

```css
/* vaoferi-exception: EXC-0004 */
```

and that ID exists in `exceptions.json`. A bare `stylelint-disable` for Vaoferi rules fails.

- [ ] **Step 4: Run rule tests**

```bash
npx vitest run verifier/tests/unit/stylelint-plugin.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add verifier/src/static verifier/tests/unit/stylelint-plugin.test.ts references/verifier.md
git commit -m "feat: enforce static design contract rules"
```

---

### Task 6: Build the Playwright geometry collector and hard layout invariants

**Files:**
- Create: `verifier/src/browser/launch.ts`
- Create: `verifier/src/browser/selectors.ts`
- Create: `verifier/src/browser/geometry.ts`
- Create: `verifier/src/core/report.ts`
- Test: `verifier/tests/browser/geometry.spec.ts`
- Test: `verifier/tests/unit/report.test.ts`

**Interfaces:**
- Produces `collectGeometry(page, selectors): Promise<ElementGeometry[]>`.
- Geometry includes `x`, `y`, `width`, `height`, `right`, `bottom`, computed display/position/overflow, scroll sizes, visibility, text clamp state, and parent region ID.
- Produces compact `Violation` objects with stable codes and no screenshot payload by default.

- [ ] **Step 1: Create a broken fixture with overlap, horizontal scroll, and region escape**

- [ ] **Step 2: Write failing browser tests**

Assert stable codes:

```text
LAYOUT_OVERLAP
HORIZONTAL_SCROLL_UNINTENDED
REGION_BOUNDARY_VIOLATION
CONTENT_OVERFLOW_REJECTED
FRAME_GUTTER_DRIFT
```

- [ ] **Step 3: Implement collector via `getBoundingClientRect()` and computed styles**

Run JavaScript in the browser context; do not use screenshot interpretation for geometry.

- [ ] **Step 4: Implement contract checks**

Use CSS-pixel tolerance from contract. `viewport-hero` must match configured `dvh` target within tolerance and must follow declared content policy.

- [ ] **Step 5: Implement compact report**

Example:

```json
{
  "ok": false,
  "route": "/",
  "viewport": { "width": 893, "height": 900 },
  "violations": [
    {
      "code": "FRAME_GUTTER_DRIFT",
      "selector": "[data-vd-region=main]",
      "expected": 34,
      "actual": 43,
      "delta": 9
    }
  ]
}
```

- [ ] **Step 6: Run browser tests and commit**

```bash
npx playwright test verifier/tests/browser/geometry.spec.ts
git add verifier/src/browser verifier/src/core/report.ts verifier/tests/browser/geometry.spec.ts verifier/tests/unit/report.test.ts
git commit -m "feat: verify rendered layout geometry"
```

---

### Task 7: Implement magnetic alignment tracks

**Files:**
- Create: `verifier/src/browser/alignment.ts`
- Test: `verifier/tests/browser/alignment.spec.ts`

**Interfaces:**
- Produces `verifyAlignment(elements, alignmentContract): Violation[]`.
- Stable codes: `ALIGNMENT_TRACK_MISS`, `UNAPPROVED_ALIGNMENT_TRACK`, `OPTICAL_CORRECTION_OUT_OF_RANGE`.

- [ ] **Step 1: Add a fixture where one sibling is 7px off its approved track**

- [ ] **Step 2: Write failing test**

Expected report includes track ID, expected coordinate, actual coordinate, and delta.

- [ ] **Step 3: Implement edge/center/baseline matching**

An element passes when at least one declared attachment rule is satisfied inside tolerance. Do not silently create a new track from observed geometry.

- [ ] **Step 4: Test optical corrections**

Only explicitly declared corrections pass; arbitrary 3+ px nudges fail unless contract tolerance says otherwise.

- [ ] **Step 5: Commit**

```bash
git add verifier/src/browser/alignment.ts verifier/tests/browser/alignment.spec.ts
git commit -m "feat: verify contract alignment tracks"
```

---

### Task 8: Implement balanced collection topology and orphan detection

**Files:**
- Create: `verifier/src/browser/flow.ts`
- Test: `verifier/tests/unit/flow-cost.test.ts`
- Test: `verifier/tests/browser/flow.spec.ts`

**Interfaces:**
- Produces `scoreTopology(input: TopologyInput): TopologyScore`.
- Produces `verifyFlow(collectionGeometry, flowContract): Violation[]`.
- Stable codes: `FLOW_ORPHAN_ITEM`, `FLOW_EMPTY_CELL`, `FLOW_ITEM_TOO_NARROW`, `FLOW_UNAPPROVED_TOPOLOGY`.

- [ ] **Step 1: Write deterministic score tests**

Cases:
- 5 items: `3+2` or `2+3` beats `2+2+1`.
- 7 items: `3+4` or `4+3` beats `3+3+1` when widths satisfy constraints.
- 3 items: one row of 3 or one column of 3 is legal.
- No candidate may beat another by violating min item width or overflow constraints.

- [ ] **Step 2: Implement cost tuple, not fuzzy prose**

Use lexicographic priority:

```ts
[
  hardConstraintViolations,
  orphanPenalty,
  emptyCellPenalty,
  rowImbalance,
  topologyTransitionPenalty,
  densityPenalty
]
```

Lower tuple wins lexicographically. This makes decisions explainable and repeatable.

- [ ] **Step 3: Build browser grouping from element rows**

Cluster items into rows using y-coordinate tolerance; derive observed row counts and compare to approved/optimal topology.

- [ ] **Step 4: Run tests and commit**

```bash
npx vitest run verifier/tests/unit/flow-cost.test.ts
npx playwright test verifier/tests/browser/flow.spec.ts
git add verifier/src/browser/flow.ts verifier/tests/unit/flow-cost.test.ts verifier/tests/browser/flow.spec.ts
git commit -m "feat: verify balanced collection flow"
```

---

### Task 9: Add continuous responsive verification and shrinking

**Files:**
- Create: `verifier/src/browser/layout-signature.ts`
- Create: `verifier/src/browser/responsive.ts`
- Test: `verifier/tests/unit/responsive-search.test.ts`
- Test: `verifier/tests/browser/responsive.spec.ts`

**Interfaces:**
- Produces `layoutSignature(report): string` based on topology + invariant status, not raw every-pixel coordinates.
- Produces `sweepResponsive(options): Promise<ResponsiveSweepResult>`.
- Modes: exhaustive 1px or adaptive.

- [ ] **Step 1: Unit-test breakpoint probe generation**

For a breakpoint at `768`, required probes are exactly:

```text
766, 767, 768, 769, 770
```

clamped to supported range.

- [ ] **Step 2: Unit-test adaptive bisection**

Given stable signatures at 800 and 1000 but changed signature at 900, recursively narrow the transition interval until it is 1 CSS px or the configured minimum interval.

- [ ] **Step 3: Add fast-check property test**

Generate widths inside `[minWidth, maxWidth]`, run geometry invariants, and retain `seed` + `counterexamplePath` on failure so the exact width is reproducible.

- [ ] **Step 4: Implement focused exhaustive mode**

`320..1920` means exactly 1601 viewport widths. This mode is valid for one component/route and must not call an LLM.

- [ ] **Step 5: Implement adaptive CI mode**

Order:
1. canonical widths;
2. breakpoint ±2/±1/0;
3. coarse interval samples;
4. signature comparison;
5. recursive bisection around changes/failures;
6. fast-check seeded fuzz pass.

- [ ] **Step 6: Add adjacent-width jump detection**

Large coordinate/size delta is legal only when responsive contract declares a topology transition. Otherwise emit `RESPONSIVE_UNDECLARED_JUMP`.

- [ ] **Step 7: Run tests and commit**

```bash
npx vitest run verifier/tests/unit/responsive-search.test.ts
npx playwright test verifier/tests/browser/responsive.spec.ts
git add verifier/src/browser/layout-signature.ts verifier/src/browser/responsive.ts verifier/tests/unit/responsive-search.test.ts verifier/tests/browser/responsive.spec.ts
git commit -m "feat: add continuous responsive verifier"
```

---

### Task 10: Add deterministic media safe-zone checks and screenshot regression tier

**Files:**
- Create: `verifier/src/browser/media-safe-zones.ts`
- Create: `verifier/src/browser/screenshots.ts`
- Test: `verifier/tests/browser/media-safe-zones.spec.ts`
- Modify: `playwright.config.ts`

**Interfaces:**
- Safe-zone hard checks require declared metadata; no opaque CV score may hard-fail by itself.
- Screenshots are Tier 3 evidence, not the geometry oracle.

- [ ] **Step 1: Define asset metadata contract**

Support focal point `[0..1, 0..1]`, protected rectangles, allowed crop modes, and minimum protected visibility ratio.

- [ ] **Step 2: Test text/CTA overlap with protected background zone**

Emit `MEDIA_PROTECTED_ZONE_OVERLAP` with overlap area and involved selectors.

- [ ] **Step 3: Test focal-point crop visibility**

Using image element/background geometry and `object-fit/object-position` or background-size/position, calculate whether the declared focal point remains in the visible crop.

- [ ] **Step 4: Add canonical screenshot assertions**

Use Playwright `toHaveScreenshot()` only for canonical states. Keep browser/OS/font environment pinned in CI to reduce false positives.

- [ ] **Step 5: Commit**

```bash
git add verifier/src/browser/media-safe-zones.ts verifier/src/browser/screenshots.ts verifier/tests/browser/media-safe-zones.spec.ts playwright.config.ts
git commit -m "feat: verify media safe zones and visual baselines"
```

---

### Task 11: Build the unified `verify` command and tiered performance strategy

**Files:**
- Create: `verifier/src/commands/verify.ts`
- Modify: `verifier/src/cli.ts`
- Modify: `verifier/src/core/report.ts`
- Create: `references/verifier.md`
- Test: add CLI integration fixture tests.

**Interfaces:**
- CLI:

```text
vd verify --project <path> --tier fast
vd verify --project <path> --tier geometry --route /
vd verify --project <path> --tier responsive --route /
vd verify --project <path> --tier full
```

- Exit `0` only when all hard rules in requested tier pass.
- JSON result never embeds screenshots; it may contain artifact paths.

- [ ] **Step 1: Define tiers**

```text
fast       = schema + ownership + static CSS
geometry   = fast + rendered hard invariants
responsive = geometry + continuous sweep
full       = responsive + canonical screenshots + deterministic media checks
```

- [ ] **Step 2: Implement changed-files/affected-route hooks**

Accept `--changed-file` multiple times and `--route` multiple times. When mapping is unavailable, fall back to configured critical routes rather than pretending complete coverage.

- [ ] **Step 3: Add cache key**

Cache read-only results by verifier version + normalized contract hash + route + viewport + source revision/file digest. Never cache a PASS across changed relevant inputs.

- [ ] **Step 4: Add concise agent output**

Human mode: grouped violations.
JSON mode: stable schema with only actionable evidence and artifact references.

- [ ] **Step 5: Integration-test exit codes**

Broken fixture must return non-zero and include at least one stable violation code; fixed fixture returns zero.

- [ ] **Step 6: Commit**

```bash
git add verifier/src/commands/verify.ts verifier/src/cli.ts verifier/src/core/report.ts references/verifier.md verifier/tests
git commit -m "feat: add tiered design verification command"
```

---

### Task 12: Add legacy audit/baseline adoption without hiding new regressions

**Files:**
- Create: `verifier/src/commands/audit.ts`
- Create: `references/legacy-adoption.md`
- Create: `examples/contracts/legacy-baseline/`
- Test: fixture-based audit tests.

**Interfaces:**
- CLI: `vd audit --project <path> --routes <...> --json`.
- Baseline records exact existing violations with fingerprints; it does not globally disable rules.
- New violations and worsened fingerprints still fail.

- [ ] **Step 1: Write failing test for baseline behavior**

Existing known `FRAME_GUTTER_DRIFT` may be recorded as legacy debt; an additional new route/selector violation must still fail.

- [ ] **Step 2: Implement violation fingerprinting**

Fingerprint from stable code + route + selector/component ID + contract key, not message text or pixel value alone.

- [ ] **Step 3: Implement `audit` report-only mode**

Audit never autofixes a legacy project. It classifies:
- hard existing debt;
- potential contract inference;
- generated/vendor paths to exclude;
- candidate critical routes/components.

- [ ] **Step 4: Commit**

```bash
git add verifier/src/commands/audit.ts references/legacy-adoption.md examples/contracts/legacy-baseline verifier/tests
git commit -m "feat: add legacy design contract audit mode"
```

---

### Task 13: Replace prompt-only skill behavior with command orchestration

**Files:**
- Modify: `SKILL.md`
- Modify: `references/action-contract.md`
- Modify: `references/quality-gates.md`
- Modify: `README.md`
- Modify: `SPEC.md`
- Modify: `rubric.md`
- Modify: `AGENTS.md`
- Modify: `examples/good-answer.md`
- Modify: `examples/bad-answer.md`
- Modify: `docs/history/project_log.md`
- Create: `references/contract-model.md`

**Interfaces:**
- `SKILL.md` routes agents to contract commands and `vd verify` rather than asking the same agent to self-award Pass.
- Old 20-principles list remains only where it is useful, but each principle must be classified as deterministic gate, heuristic warning, or manual review.

- [ ] **Step 1: Rewrite the mandatory order**

New canonical flow:

```text
context/content inventory
-> /frame
-> /rhythm
-> /place
-> /align
-> /flow
-> /reference (when used)
-> /visual
-> /responsive
-> /verify
```

- [ ] **Step 2: Remove contradictory guidance**

Remove or rewrite statements equivalent to:
- Golden Canon is merely a guide after a project has explicitly selected a hard frame contract;
- fixed heights are always forbidden, because viewport-locked sections are now an explicit legal frame mode;
- human/agent visual review is enough evidence for hard geometry rules.

Keep accessibility as an explicit contract concern; do not allow it to silently mutate frame. If accessibility requirements conflict with a locked frame, emit a conflict requiring an intentional `/frame` or content-policy decision.

- [ ] **Step 3: Document references as DNA only**

Make it explicit that external code/screenshots contribute selected traits and cannot override unrelated contract layers.

- [ ] **Step 4: Update examples**

Good example must show a verifier failure, compact evidence, and a correction without mutating frame. Bad example must show self-reported visual PASS, ad-hoc spacing, and silent contract drift.

- [ ] **Step 5: Run existing Python structure checks plus Markdown diff check**

```bash
python scripts/check_skill_structure.py
python scripts/validate_snippets_source.py --json
git diff --check
```

- [ ] **Step 6: Commit**

```bash
git add SKILL.md references README.md SPEC.md rubric.md AGENTS.md examples docs/history/project_log.md
git commit -m "docs: make design skill contract driven"
```

---

### Task 14: Add CI, fixtures, and end-to-end verification

**Files:**
- Create: `.github/workflows/verifier.yml`
- Create/complete: `verifier/tests/fixtures/*`
- Modify: `scripts/check_skill_structure.py` to validate new required v1 files.

**Interfaces:**
- PR CI runs static/unit tests on every change.
- Browser tests run in a pinned Playwright environment.
- Exhaustive responsive sweeps are focused/nightly or explicitly requested; normal PR CI uses adaptive mode on affected routes.

- [ ] **Step 1: Add CI jobs**

Jobs:
1. `repo-structure` — Python checks and `git diff --check`.
2. `unit` — `npm ci`, TypeScript build, Vitest.
3. `browser` — install Playwright Chromium and run browser suite.
4. `self-verify` — run verifier against its own fixture projects.

- [ ] **Step 2: Add explicit no-bypass regression tests**

Test sequence:
1. add `!important` -> gate fails;
2. add bare `stylelint-disable` -> gate fails;
3. shift an aligned fixture by 7px -> gate fails;
4. produce `3+3+1` where `4+3` fits -> gate fails;
5. fail only at an intermediate width -> responsive sweep finds it;
6. mutate frame from `/align` path -> ownership gate fails;
7. restore valid fixture -> full suite passes.

- [ ] **Step 3: Run complete verification locally**

```bash
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
python scripts/check_skill_structure.py
python scripts/validate_snippets_source.py --json
git diff --check
```

Expected: all PASS.

- [ ] **Step 4: Self-review against the design spec**

Confirm every spec section maps to executable behavior, documentation, or an explicitly optional/future heuristic. In particular, verify:
- armored frame;
- content-fit policies;
- rhythm/token enforcement;
- placement exceptions;
- magnetic alignment tracks;
- deterministic orphan/topology scoring;
- reference DNA isolation;
- visual layer isolation;
- deterministic background safe zones;
- canonical + continuous responsive verification;
- compact JSON output;
- legacy baseline mode;
- no mandatory LLM inference in normal verification.

- [ ] **Step 5: Commit**

```bash
git add .github verifier scripts/check_skill_structure.py
git commit -m "ci: verify design contracts end to end"
```

---

## Deferred after v1 core

These are intentionally not required for the first stable implementation:

- LPIPS/SSIM as a hard design oracle;
- generic CV saliency as a hard failure;
- LLM-vision review in normal CI;
- automatic redesign/fixing of failed layouts;
- provider-specific MCP/plugin packaging;
- published npm package/registry release;
- automatic migration of existing projects;
- broad ban on `position:absolute` without contract context.

They can be added later without weakening the deterministic v1 core.

## Final acceptance

The implementation is complete only when a fixture can prove the full trust model:

```text
human-approved contract
       ↓
agent changes CSS/UI
       ↓
static verifier
       ↓
real Chromium geometry
       ↓
continuous responsive checks
       ↓
compact JSON PASS/FAIL
```

A final successful run must demonstrate that the verifier catches at least one bug that exists only at an intermediate viewport width and at least one unauthorized attempt to modify the frame from a lower layer.
