# Vaoferi Design Skill v1.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add fail-closed multi-scope design routing, adoption-vs-redesign separation, and admin-workspace planning/verification on top of the v1.1 verifier.

**Architecture:** Repository-wide hard policy stays global, while each resolved design scope owns its local visual contract, fingerprint, baseline, exceptions, responsive rules, and density. `audit/init/migrate` are adoption operations that may change only managed docs/tooling/state; `work/redesign` are the only modes that may intentionally touch production UI according to contract. Complex admin scopes gain an `interaction-topology` planning gate before layout work.

**Tech Stack:** TypeScript, Node 22, Vitest, Ajv-compatible JSON Schema validation, Stylelint, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-16-design-scopes-admin-workspace-v1.2-design.md`

## Global Constraints

- `repository != one design system`.
- `audit/init/migrate != redesign`.
- Scope ambiguity/unmapped UI fails closed.
- No visual inheritance across unrelated scopes by default.
- Repository-wide hard rules remain global: `!important` ban, changed-code strictness, anti-bypass, baseline ratchet, browser capability gate, evidence.
- Existing-site fingerprints outrank profile defaults.
- Admin complexity may force `interaction-topology` before `/frame`.
- Adoption may install/configure verifier dependencies when policy permits, but must not mutate production UI.

---

## File map

- `schemas/project-design.schema.json` — repository-level scope topology schema.
- `schemas/scope.schema.json` — one design scope declaration/schema.
- `schemas/interaction-topology.schema.json` — complex-admin planning artifact.
- `verifier/src/scopes/scope-resolver.ts` — deterministic scope resolution and ambiguity errors.
- `verifier/src/scopes/scope-contract.ts` — scope-local contract loading/validation.
- `verifier/src/adoption/adoption-guard.ts` — protects production UI during audit/init/migrate.
- `verifier/src/admin/complexity.ts` — deterministic weighted score + hard triggers.
- `verifier/src/admin/interaction-topology.ts` — validates zones/actions/save scopes.
- `verifier/src/admin/action-policy.ts` — action hierarchy/region policy.
- `verifier/src/lifecycle/preflight.ts` — include resolved scope/profile/complexity state.
- `references/scopes.md` — multi-scope routing rules.
- `references/admin-workspace.md` — admin-dense workflow/rules.
- `SKILL.md` — short router linking new references.
- `verifier/tests/unit/*` — TDD coverage.
- `verifier/tests/fixtures/scopes/*` — frontend/admin/shared/ambiguous fixtures.
- `verifier/tests/fixtures/admin/*` — simple/complex/bad-action-layout fixtures.

---

### Task 1: Project scope schema and deterministic resolver

**Files:**
- Create: `schemas/project-design.schema.json`
- Create: `schemas/scope.schema.json`
- Create: `verifier/src/scopes/scope-resolver.ts`
- Test: `verifier/tests/unit/scope-resolver.test.ts`

**Interfaces:**
- Produces `DesignScope`, `ScopeResolutionInput`, `ScopeResolutionResult` and `resolveDesignScopes(input)`.
- Result status is `RESOLVED | AMBIGUOUS | UNMAPPED`.

- [x] **Step 1: Write failing tests** covering explicit scope priority, exact path match, route match, multi-scope task, ambiguous overlap, unmapped UI, and explicit `shared-ui` handling.
- [ ] **Step 2: Run unit suite** and confirm RED because resolver/schema do not exist.
- [ ] **Step 3: Implement minimal schemas and resolver** with deterministic priority: explicit selection > exact path/module mapping > route mapping > declared shared scope; never guess by styling.
- [ ] **Step 4: Run tests** and verify GREEN.
- [ ] **Step 5: Commit** `feat: add deterministic design scope resolver`.

---

### Task 2: Scope-local contract loading and preflight routing

**Files:**
- Create: `verifier/src/scopes/scope-contract.ts`
- Modify: `verifier/src/lifecycle/preflight.ts`
- Test: `verifier/tests/unit/scope-contract.test.ts`
- Test: `verifier/tests/unit/preflight.test.ts`

**Interfaces:**
- Produces `loadScopeContract(root, scopeId)` and extends preflight with `scopeIds`, `profiles`, `scopeContracts`, `complexityGate`.

- [ ] **Step 1: Write failing tests** proving frontend/admin contracts remain isolated and multi-scope preflight loads both independently.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement scope-local loading/validation** and update compact preflight output.
- [ ] **Step 4: Verify GREEN**, including existing v1.1 preflight tests.
- [ ] **Step 5: Commit** `feat: route preflight through scope-local contracts`.

---

### Task 3: Adoption guard — init/migrate may not redesign

**Files:**
- Create: `verifier/src/adoption/adoption-guard.ts`
- Test: `verifier/tests/unit/adoption-guard.test.ts`
- Create fixtures: `verifier/tests/fixtures/adoption/*`

**Interfaces:**
- Produces `assertAdoptionMutationAllowed(mode, changes, ownershipMap)`.
- Modes: `audit | init | migrate | work | redesign`.

- [ ] **Step 1: Write failing tests** proving `audit` is read-only; `init/migrate` may edit managed docs/tooling/state; representative production UI/CSS/template/component edits are rejected; `work/redesign` are evaluated separately.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement minimal mutation guard** using explicit ownership categories instead of filename guessing alone.
- [ ] **Step 4: Verify GREEN**.
- [ ] **Step 5: Commit** `feat: separate adoption from redesign mutations`.

---

### Task 4: Admin complexity gate

**Files:**
- Create: `verifier/src/admin/complexity.ts`
- Test: `verifier/tests/unit/admin-complexity.test.ts`

**Interfaces:**
- Produces `AdminComplexityInput`, `AdminComplexityResult`, `evaluateAdminComplexity(input)`.
- Result includes `score`, `hardTriggers`, `requiresTopology`.

- [ ] **Step 1: Write failing tests** for a simple form, dense page with many controls/actions, multiple save scopes + destructive actions hard trigger, and a page with many buttons but coherent low-complexity structure.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement deterministic weighted scoring + hard triggers**. Do not use a single naive threshold such as button count alone.
- [ ] **Step 4: Verify GREEN**.
- [ ] **Step 5: Commit** `feat: add admin workspace complexity gate`.

---

### Task 5: Interaction topology and action hierarchy

**Files:**
- Create: `schemas/interaction-topology.schema.json`
- Create: `verifier/src/admin/interaction-topology.ts`
- Create: `verifier/src/admin/action-policy.ts`
- Test: `verifier/tests/unit/interaction-topology.test.ts`
- Test: `verifier/tests/unit/action-policy.test.ts`

**Interfaces:**
- Produces `validateInteractionTopology(topology)` and `evaluateActionPolicy(topology)`.

- [ ] **Step 1: Write failing tests** for zones, field groups, save scopes, page/section/row/bulk/danger actions, multiple equal primaries, destructive/routine mixing, orphan actions, and missing topology when required.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement schema + pure policy functions**.
- [ ] **Step 4: Verify GREEN**.
- [ ] **Step 5: Commit** `feat: add admin interaction topology contract`.

---

### Task 6: Admin rendered verification hooks

**Files:**
- Create: `verifier/src/admin/rendered-admin-rules.ts`
- Test: `verifier/tests/browser/admin-workspace.spec.ts`
- Create fixtures: `verifier/tests/fixtures/admin/simple.html`, `dense-good.html`, `dense-bad.html`

**Interfaces:**
- Produces browser-measured findings for uncontrolled horizontal overflow, missing declared action regions, excessive unstructured vertical form chains, hidden critical actions, and illegal destructive-action mixing where machine-detectable.

- [ ] **Step 1: Write browser RED tests** against intentionally bad dense-admin fixture.
- [ ] **Step 2: Verify RED** in CI/browser runner.
- [ ] **Step 3: Implement rendered rule adapter** reusing existing browser abstraction and pure geometry helpers.
- [ ] **Step 4: Verify GREEN** across strict width sweep for touched admin fixture.
- [ ] **Step 5: Commit** `feat: verify dense admin workspace geometry`.

---

### Task 7: Documentation router and lazy context for scopes/admin

**Files:**
- Create: `references/scopes.md`
- Create: `references/admin-workspace.md`
- Modify: `SKILL.md`
- Modify: `references/lifecycle.md`
- Modify: `references/stages.md`
- Test: `verifier/tests/unit/skill-router.test.ts`

**Interfaces:**
- `SKILL.md` remains a short router; detailed multi-scope/admin rules are lazy-loaded only when relevant.

- [ ] **Step 1: Extend router tests** to require scope resolution before UI work and admin-workspace reference only for admin profiles.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Add focused references and compact router changes** without copying the v1.2 spec wholesale.
- [ ] **Step 4: Verify GREEN**.
- [ ] **Step 5: Commit** `docs: route design scopes and admin workspace rules`.

---

### Task 8: Controlled multi-scope/adoption fixtures and CI evidence

**Files:**
- Create: `verifier/tests/fixtures/scopes/frontend-admin/*`
- Create: `verifier/tests/fixtures/scopes/ambiguous/*`
- Create: `verifier/tests/fixtures/adoption/no-redesign/*`
- Test: `verifier/tests/unit/v1-2-adoption-fixtures.test.ts`
- Modify: `.github/workflows/verifier.yml` only if a distinct v1.2 self-test step is needed.

**Interfaces:**
- Fixtures exercise production resolver, adoption guard, complexity gate, topology policy, browser checks, and evidence aggregation.

- [ ] **Step 1: Write failing integration tests** proving frontend/admin isolation, ambiguous shared file BLOCKED, init leaves production UI unchanged, dense admin requires topology, and one scope FAIL/BLOCKED prevents aggregate PASS.
- [ ] **Step 2: Verify RED** on missing fixtures/behavior only.
- [ ] **Step 3: Add minimal fixtures and any missing integration glue**.
- [ ] **Step 4: Run full unit + browser + self-tests + evidence**.
- [ ] **Step 5: Open artifact and verify aggregate `finalStatus` from actual gates**.
- [ ] **Step 6: Commit** `test: prove v1.2 scope and adoption contracts end to end`.

---

## Self-review

- Spec coverage: adoption guard, multi-scope routing, isolated contracts, shared UI, ambiguity blocking, admin profiles, complexity gate, interaction topology, action hierarchy, density/admin responsive verification, lazy context, and end-to-end fixtures are mapped.
- Placeholder scan: no TBD/TODO steps.
- Type consistency: scope resolver feeds scope contract/preflight; admin complexity feeds topology requirement; topology feeds action/rendered policy; all feed evidence.
- Multi-repo rollout remains deferred until v1.2 controlled fixtures pass.
