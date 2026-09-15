# Vaoferi Design Skill v1.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a universal contract-driven design verifier and bootstrap layer that blocks UI work when required verification is unavailable, enforces strict rules on changed code, and verifies responsive geometry continuously.

**Architecture:** The skill remains a compact orchestrator. Project-local truth lives in `DESIGN.md` and `.design/*`; machine checks live in a TypeScript verifier with stable adapter interfaces. Third-party libraries such as Ajv and Playwright are isolated behind adapters so host repositories are not coupled to packaging/tool details.

**Tech Stack:** Node.js 22, TypeScript `NodeNext`, Vitest, Ajv draft-07, Stylelint, Playwright, fast-check, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-15-contract-driven-design-system-v1.1-design.md`

## Global Constraints

- Missing required browser/regression verification is `BLOCKED`, never a silent fallback.
- Browser UI changes require rendered browser verification.
- Touched UI uses strict focused sweep across every integer CSS-pixel width in the configured supported interval plus contract-defined orientation/aspect states.
- New `!important` in project-authored UI/CSS is a hard failure unless covered by a narrow explicit approved exception.
- Legacy debt may be baselined, but the baseline may not grow silently.
- New/changed authored code is held to current hard rules.
- Suppression comments, ignore-glob widening, disabling CI gates, deleting tests, or baseline growth to hide a new violation are anti-bypass failures.
- `/frame` is the only operation allowed to mutate frame-owned geometry.
- Existing sites are preserved first; local UI work must not silently become a redesign.
- MCP is optional. Core verification must work without MCP.
- Universal rules must not be duplicated into large project prose files.

---

## File Structure

### Core validation
- `verifier/src/core/schema-validator.ts` — stable schema validator interface and result types.
- `verifier/src/adapters/ajv-schema-validator.ts` — isolated Ajv implementation using Node compatibility boundary.
- `verifier/src/core/contract-loader.ts` — reads contract state and delegates validation through `SchemaValidator`.
- `verifier/src/core/errors.ts` — stable machine-readable verifier errors.

### Repository/capability audit
- `verifier/src/audit/repository-audit.ts` — detect UI surface, stack, docs, browser/test capabilities and ownership roots.
- `verifier/src/audit/capability-gate.ts` — `READY | INSTALLABLE | BLOCKED` decision for required verifier capabilities.
- `verifier/tests/unit/capability-gate.test.ts` — blocker semantics.

### Policy / changed-code enforcement
- `verifier/src/policy/ownership.ts` — authored/vendor/generated classification.
- `verifier/src/policy/important-policy.ts` — `!important` detection plus exception matching.
- `verifier/src/policy/baseline.ts` — baseline+ratchet classification.
- `verifier/src/policy/anti-bypass.ts` — suppression / ignore / gate weakening detection.
- `verifier/tests/unit/important-policy.test.ts`
- `verifier/tests/unit/baseline.test.ts`
- `verifier/tests/unit/anti-bypass.test.ts`

### Contract stages
- `verifier/src/core/stages.ts` — canonical stage order and ownership map.
- `verifier/src/core/stage-guard.ts` — predecessor and write-permission guard.
- `verifier/tests/unit/stage-guard.test.ts`

### Existing-site fingerprint
- `verifier/src/audit/design-fingerprint.ts` — deterministic extraction model from provided measurements/tokens.
- `verifier/tests/unit/design-fingerprint.test.ts`

### Browser verifier
- `verifier/src/browser/browser-adapter.ts` — stable rendered-browser interface.
- `verifier/src/adapters/playwright-browser.ts` — Playwright implementation.
- `verifier/src/browser/responsive-sweep.ts` — exhaustive focused viewport/orientation sweep.
- `verifier/src/browser/geometry-rules.ts` — overflow/collision/frame/alignment/orphan checks.
- `verifier/tests/unit/responsive-sweep.test.ts`
- `verifier/tests/browser/responsive-sweep.spec.ts`
- `verifier/tests/fixtures/responsive/*` — intentional pass/fail pages.

### CLI/lifecycle
- `verifier/src/cli.ts` — `audit/init/migrate/augment/update/doctor/rollback/verify` router.
- `verifier/src/lifecycle/*` — managed ownership and lifecycle actions.
- `schemas/manifest.schema.json`, `schemas/baseline.schema.json`, `schemas/exceptions.schema.json` — machine contracts.

### CI/docs
- `.github/workflows/verifier.yml` — build/unit tests and intentional-failure verification on working branch/PR.
- `SKILL.md` — short router + hard invariants only.
- `references/*` — lazy-loaded details by stage.

---

### Task 1: Stabilize `SchemaValidator` boundary and restore green build

**Files:**
- Create: `verifier/src/core/schema-validator.ts`
- Create: `verifier/src/adapters/ajv-schema-validator.ts`
- Modify: `verifier/src/core/contract-loader.ts`
- Test: `verifier/tests/unit/schema-validator.test.ts`
- Test: `verifier/tests/unit/contract-loader.test.ts`

**Interfaces:**
- Produces: `SchemaValidator.validate(schema: object, document: unknown): ValidationResult`
- Produces: `AjvSchemaValidator implements SchemaValidator`
- `ValidationResult = { valid: true; violations: [] } | { valid: false; violations: SchemaViolation[] }`
- `SchemaViolation = { instancePath: string; keyword: string; message?: string; params?: unknown }`

- [ ] **Step 1: Write failing validator test**

```ts
import { describe, expect, it } from 'vitest';
import { AjvSchemaValidator } from '../../src/adapters/ajv-schema-validator.js';

describe('AjvSchemaValidator', () => {
  it('returns a normalized violation without exposing Ajv types', () => {
    const validator = new AjvSchemaValidator();
    const result = validator.validate(
      { type: 'object', additionalProperties: false, properties: { ok: { type: 'boolean' } } },
      { ok: true, extra: 1 }
    );

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.violations[0]).toMatchObject({ keyword: 'additionalProperties' });
    }
  });
});
```

- [ ] **Step 2: Run unit/build verification and confirm RED**

Run in CI/local: `npm run build && npm test -- --run verifier/tests/unit/schema-validator.test.ts`

Expected: FAIL because `AjvSchemaValidator` does not exist.

- [ ] **Step 3: Implement stable interface and isolated Ajv adapter**

Use `createRequire(import.meta.url)` only inside `ajv-schema-validator.ts`; do not import Ajv directly from `contract-loader.ts`. Default Ajv draft-07 is sufficient for v1 schemas.

- [ ] **Step 4: Inject/reuse validator in contract loader**

`contract-loader.ts` compiles/validates through the stable interface and continues emitting `CONTRACT_SCHEMA_INVALID` with normalized violations.

- [ ] **Step 5: Run full build/unit suite**

Run: `npm run build && npm test`

Expected: PASS.

- [ ] **Step 6: Commit**

`git commit -m "refactor: isolate schema validation adapter"`

---

### Task 2: Add mandatory capability gate

**Files:**
- Create: `verifier/src/audit/capability-gate.ts`
- Create: `verifier/src/audit/repository-audit.ts`
- Test: `verifier/tests/unit/capability-gate.test.ts`

**Interfaces:**

```ts
type CapabilityStatus = 'READY' | 'INSTALLABLE' | 'BLOCKED';
interface BrowserCapabilityDecision {
  status: CapabilityStatus;
  selectedAdapter?: string;
  missing: string[];
  install?: { packageManager: string; packages: string[]; commands: string[] };
  blockedStages: string[];
}
```

- [ ] **Step 1: Write failing tests for READY, INSTALLABLE, BLOCKED**

Cases:
1. existing Playwright + browser runtime -> READY;
2. web UI + Node package manager + no browser harness -> INSTALLABLE with concrete Playwright install commands;
3. web UI + no usable/installable browser execution -> BLOCKED and `blockedStages` includes `responsive` and `verify`.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run verifier/tests/unit/capability-gate.test.ts`

- [ ] **Step 3: Implement pure decision function**

Do not install anything inside the decision function. It only makes the deterministic decision and produces the exact next action.

- [ ] **Step 4: Verify GREEN and full suite**

Run: `npm run build && npm test`

- [ ] **Step 5: Commit**

`git commit -m "feat: block UI work without verification capability"`

---

### Task 3: Enforce `!important` as a hard changed-code policy

**Files:**
- Create: `verifier/src/policy/ownership.ts`
- Create: `verifier/src/policy/important-policy.ts`
- Create: `schemas/exceptions.schema.json`
- Test: `verifier/tests/unit/important-policy.test.ts`

**Interfaces:**

```ts
interface ImportantFinding {
  file: string;
  line: number;
  column: number;
  classification: 'new-violation' | 'legacy-baselined' | 'approved-exception';
}
```

- [ ] **Step 1: Write RED tests**

Required cases:
- `color:red !important` in authored changed CSS -> `new-violation`;
- same occurrence in explicit baseline -> `legacy-baselined` only when unchanged;
- vendor/generated path -> excluded by ownership classification;
- exact narrow approved exception -> `approved-exception`;
- broad wildcard exception -> rejected as invalid policy input.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run verifier/tests/unit/important-policy.test.ts`

- [ ] **Step 3: Implement parser/scanner + ownership classification**

Prefer Stylelint `declaration-no-important` for CSS-aware detection, but normalize findings into verifier-owned output. Add `reportDisables`/anti-bypass coverage rather than trusting disable comments.

- [ ] **Step 4: Verify GREEN**

Run: `npm run build && npm test`

- [ ] **Step 5: Commit**

`git commit -m "feat: enforce no-important policy"`

---

### Task 4: Add baseline ratchet and anti-bypass

**Files:**
- Create: `schemas/baseline.schema.json`
- Create: `verifier/src/policy/baseline.ts`
- Create: `verifier/src/policy/anti-bypass.ts`
- Test: `verifier/tests/unit/baseline.test.ts`
- Test: `verifier/tests/unit/anti-bypass.test.ts`

**Interfaces:**

```ts
type DebtState = 'legacy-baselined' | 'new-violation' | 'baseline-regression' | 'fixed-legacy';
```

- [ ] **Step 1: RED tests for ratchet**

Assert: baseline count may stay equal or shrink; any new authored violation not mapped to existing baseline becomes `new-violation`; baseline expansion becomes `baseline-regression`.

- [ ] **Step 2: RED tests for bypass attempts**

Detect additions such as `stylelint-disable`, required-workflow `continue-on-error: true`, widened ignore glob covering authored source, or deletion/disable of required design command.

- [ ] **Step 3: Implement minimal pure policy functions**

- [ ] **Step 4: Run full suite**

- [ ] **Step 5: Commit**

`git commit -m "feat: add legacy ratchet and anti-bypass policy"`

---

### Task 5: Enforce stage order and ownership

**Files:**
- Create: `verifier/src/core/stages.ts`
- Create: `verifier/src/core/stage-guard.ts`
- Test: `verifier/tests/unit/stage-guard.test.ts`

**Interfaces:**

```ts
type DesignStage = 'frame' | 'rhythm' | 'place' | 'align' | 'flow' | 'reference' | 'visual' | 'responsive' | 'verify';
assertStageCanRun(stage, status): void;
assertStageWriteAllowed(stage, targetStateFile): void;
```

- [ ] **Step 1: RED test: `/align` cannot write `frame.json`**
- [ ] **Step 2: RED test: later stage cannot run with unresolved required predecessor**
- [ ] **Step 3: Implement canonical ownership map and predecessor guard**
- [ ] **Step 4: Full suite GREEN**
- [ ] **Step 5: Commit**

`git commit -m "feat: enforce design stage ownership"`

---

### Task 6: Implement Existing Site fingerprint

**Files:**
- Create: `verifier/src/audit/design-fingerprint.ts`
- Test: `verifier/tests/unit/design-fingerprint.test.ts`

**Interfaces:**

```ts
interface DesignFingerprint {
  containers: number[];
  gutters: number[];
  alignmentAnchors: string[];
  spacingScale: number[];
  colors: string[];
  typography: string[];
  componentPatterns: string[];
  breakpoints: number[];
  deliberateExceptions: string[];
}
```

- [ ] **Step 1: RED tests for dominant values and deliberate repeated exception preservation**
- [ ] **Step 2: Implement deterministic frequency/tolerance clustering**
- [ ] **Step 3: Verify no redesign recommendation is emitted from fingerprint extraction**
- [ ] **Step 4: Full suite GREEN**
- [ ] **Step 5: Commit**

`git commit -m "feat: add existing-site design fingerprint"`

---

### Task 7: Browser adapter and exhaustive responsive focused sweep

**Files:**
- Create: `verifier/src/browser/browser-adapter.ts`
- Create: `verifier/src/adapters/playwright-browser.ts`
- Create: `verifier/src/browser/responsive-sweep.ts`
- Create: `verifier/src/browser/geometry-rules.ts`
- Create: `verifier/tests/unit/responsive-sweep.test.ts`
- Create: `verifier/tests/browser/responsive-sweep.spec.ts`
- Create: `verifier/tests/fixtures/responsive/pass.html`
- Create: `verifier/tests/fixtures/responsive/horizontal-overflow.html`

**Interfaces:**

```ts
interface ViewportState { width: number; height: number; orientation: 'portrait' | 'landscape'; }
interface GeometrySnapshot { viewport: ViewportState; scrollWidth: number; boxes: Record<string, {x:number;y:number;width:number;height:number}>; }
interface BrowserAdapter { open(url: string): Promise<void>; setViewport(state: ViewportState): Promise<void>; measure(selectors: string[]): Promise<GeometrySnapshot>; close(): Promise<void>; }
```

- [ ] **Step 1: RED unit test for sweep generator**

`generateWidths(320, 323)` must return `[320,321,322,323]`, never sample.

- [ ] **Step 2: RED browser fixture test**

The overflow fixture must fail when `scrollWidth > viewport.width` at any tested width.

- [ ] **Step 3: Implement Playwright adapter using `page.setViewportSize()` and DOM geometry**

- [ ] **Step 4: Add breakpoint neighborhood expansion**

Each configured breakpoint adds `-2,-1,0,+1,+2` if inside supported interval.

- [ ] **Step 5: Add orientation/aspect states from contract**

Width-only validation is insufficient when the contract declares portrait/landscape states.

- [ ] **Step 6: Run unit + browser suite**

Run: `npm run build && npm test && npm run test:browser`

- [ ] **Step 7: Commit**

`git commit -m "feat: verify responsive geometry continuously"`

---

### Task 8: Lifecycle, preflight and managed docs

**Files:**
- Create: `schemas/manifest.schema.json`
- Create: `verifier/src/lifecycle/manifest.ts`
- Create: `verifier/src/lifecycle/preflight.ts`
- Create: `verifier/src/cli.ts`
- Modify: `SKILL.md`
- Create/modify: focused `references/*.md`
- Tests: lifecycle/preflight unit tests

**Required preflight output:**

```text
contractVersion
stage
importantPolicy=ENFORCED
changedFilesPolicy=STRICT
browserGate=READY|INSTALLABLE|BLOCKED
relevantExceptions=[...]
```

- [ ] **Step 1: RED tests for managed-block-only update and compaction/restart preflight**
- [ ] **Step 2: Implement lifecycle router and managed ownership**
- [ ] **Step 3: Keep `SKILL.md` compact; lazy-load stage references**
- [ ] **Step 4: Full suite GREEN**
- [ ] **Step 5: Commit**

`git commit -m "feat: add managed design lifecycle"`

---

### Task 9: CI self-verification and evidence

**Files:**
- Modify: `.github/workflows/verifier.yml`
- Create: `verifier/tests/fixtures/policy/*`
- Create: `verifier/src/report/evidence.ts`

- [ ] **Step 1: Make working branch and PR run build/unit checks**
- [ ] **Step 2: Add intentional-failure fixture job/test proving `!important` gate catches a defect**
- [ ] **Step 3: Add intentional responsive overflow failure fixture proving browser gate catches a defect**
- [ ] **Step 4: Ensure required jobs do not use `continue-on-error`**
- [ ] **Step 5: Emit machine-readable evidence report**
- [ ] **Step 6: Run/observe GitHub Actions GREEN**
- [ ] **Step 7: Commit**

`git commit -m "ci: make design gates self-verifying"`

---

### Task 10: Controlled fixture adoption before real multi-repo rollout

**Files:**
- Create: `verifier/tests/fixtures/repos/greenfield/*`
- Create: `verifier/tests/fixtures/repos/legacy/*`
- Create: `verifier/tests/fixtures/repos/existing-site/*`
- Create: `verifier/tests/fixtures/repos/blocked-capability/*`

- [ ] **Step 1: Greenfield fixture proves zero-baseline strict mode**
- [ ] **Step 2: Legacy fixture proves old debt tolerated but new debt rejected**
- [ ] **Step 3: Existing-site fixture proves fingerprint/augment does not redesign existing geometry**
- [ ] **Step 4: Blocked-capability fixture proves UI task cannot become Done without browser verification**
- [ ] **Step 5: Full verifier suite GREEN**
- [ ] **Step 6: Only then prepare the separate local multi-repo rollout prompt**

---

## Self-review

- Spec coverage: capability blocker, `!important`, changed-files strictness, anti-bypass, context preflight, existing-site preservation, responsive exhaustive focused sweep, stage ownership, managed docs and lifecycle are all mapped to tasks.
- No task permits a missing verifier capability to degrade into a pass.
- No task allows baseline growth or suppression directives as automatic remediation.
- Browser adapter is isolated from core contracts; Ajv is isolated from the contract loader.
- Multi-repo rollout is explicitly deferred until fixture adoption succeeds.
