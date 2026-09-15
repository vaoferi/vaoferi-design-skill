# Vaoferi Design Skill v1 — Contract-driven, machine-verifiable UI

Date: 2026-09-15
Status: design approved in conversation; implementation pending written-spec review
Target repository: `vaoferi/vaoferi-design-skill`

## 1. Problem

The current skill is primarily instruction-driven. It tells an agent to use a grid, spacing scale, alignment lines, responsive checks, visual QA, and a 20-principles gate, but most of those rules are still enforced by the same agent that produced the UI.

That creates a weak trust model:

```text
agent designs -> agent reviews itself -> agent says Pass
```

The v1 design changes the trust model to:

```text
human chooses design contract
        ↓
agent implements inside the contract
        ↓
deterministic verifier measures rendered UI
        ↓
PASS / FAIL + compact machine-readable evidence
```

The core goal is not to make an agent "more tasteful" through a longer prompt. The goal is to make important layout decisions explicit, versioned, hard to change accidentally, and machine-verifiable with little or no LLM token cost.

## 2. Design principles

1. **Geometry before decoration.** Page frame, spacing rhythm, placement, alignment, and flow are resolved before effects.
2. **Locked upper layers.** Lower-level commands may read higher-level contracts but cannot mutate them.
3. **No silent compromise.** If content or a component does not fit the active contract, the verifier fails instead of silently stretching the contract.
4. **Few legal choices.** Prefer a small set of explicit layout modes over an unlimited number of ad-hoc values.
5. **References provide DNA, not authority.** External screenshots/code may contribute selected traits, but do not import foreign spacing, colors, frame geometry, or breakpoints unless explicitly approved.
6. **Responsive behavior is continuous.** Canonical viewports are review anchors; intermediate widths are verified automatically.
7. **Machine rules first, heuristics second.** Objective properties produce hard failures. Subjective qualities remain warnings/manual review unless the project provides a measurable contract.
8. **Evidence, not self-report.** A rule is not passed because an agent says it looks correct.
9. **Existing sites are supported.** Adoption begins with an audit/baseline and does not require a full redesign.
10. **The skill is an orchestrator.** The durable source of truth is a project-local contract plus verifier outputs, not prose in `SKILL.md`.

## 3. What changes from v0.3

The current `structure first -> tokens/components first -> visual QA` workflow remains useful, but it is insufficient as enforcement.

v1 replaces the main execution model with a layered contract state machine:

```text
context/content inventory
        ↓
/frame        ← locked geometry boundary
        ↓
/rhythm       ← allowed metric vocabulary
        ↓
/place        ← content assigned to legal regions
        ↓
/align        ← approved alignment tracks
        ↓
/flow         ← collection topology and fill rules
        ↓
/reference    ← selected external design DNA only
        ↓
/visual       ← color/type/effects/motion inside geometry
        ↓
/responsive   ← canonical states + continuous behavior
        ↓
/verify       ← static + geometry + visual/perceptual gates
```

A later command automatically verifies that all mandatory predecessor stages exist. Missing predecessor stages are run in order when they can be derived safely; otherwise execution stops and asks for the missing decision. A later command never invents an upstream decision merely to continue.

`/frame` is the first command allowed to define page geometry. Content inventory may be collected before it, but that inventory does not assign geometry.

## 4. Project-local source of truth

Target projects receive a dedicated state directory:

```text
.vaoferi-design/
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
  status.json
  baselines/
  reports/
```

The skill repository owns schemas, command semantics, bootstrap scripts, lints, and verifier code. A target project owns its `.vaoferi-design/` state.

### 4.1 `contract.json`

Contains contract version, active modes, supported viewport range, verifier tolerances, and references to the layer files. It is the manifest, not a dumping ground for every rule.

### 4.2 Stage state

`status.json` records only durable stage state, for example:

```json
{
  "schemaVersion": 1,
  "stages": {
    "frame": "approved",
    "rhythm": "approved",
    "place": "approved",
    "align": "approved",
    "flow": "approved",
    "reference": "approved",
    "visual": "approved",
    "responsive": "approved"
  }
}
```

It is not an agent transcript and must not store chain-of-thought, prompts, or chat logs.

## 5. Locked-layer permission model

The command model is hierarchical.

| Command | May read | May write |
|---|---|---|
| `/frame` | project context, content inventory | `frame.json`, frame-related contract keys |
| `/rhythm` | frame | `rhythm.json` |
| `/place` | frame, rhythm, content inventory | `placement.json` |
| `/align` | frame, rhythm, placement | `alignment.json` |
| `/flow` | frame, rhythm, placement, alignment | `flow.json` |
| `/reference` | all approved structure layers | `references.json`, explicit proposed exceptions only |
| `/visual` | all approved structure layers, references | `visual.json` |
| `/responsive` | all approved layers | `responsive.json`, responsive baselines |
| `/verify` | all | reports only |

A non-`/frame` command **must fail** when it changes `frame.json` or frame-owned contract keys.

This is verifier-enforced rather than an operating-system sandbox. An agent can technically edit any writable repository file, but the command wrapper and CI gate must detect unauthorized layer mutations and refuse completion.

Implementation should use normalized-file hashes or diff ownership checks before/after each command so unauthorized upper-layer mutation is deterministic and cheap to detect.

## 6. `/frame`: the armored geometry contract

`/frame` defines the outer composition rules. No other command may alter them.

### 6.1 Small preset vocabulary

A project chooses a small number of legal section/frame modes. Default maximum: five project-wide modes. Recommended initial modes:

1. `inset` — content uses one global project gutter and optional max-width.
2. `edge-to-edge` — content/background reaches viewport edges.
3. `inset-wide` — optional approved wider container variant.
4. `viewport-hero` — section occupies exactly one configured viewport fraction.
5. `split-canon` — optional Golden Canon-inspired macro split.

The point is not that every project must use all five. The point is to prevent dozens of one-off container widths and gutters.

### 6.2 Global gutter invariant

All `inset` sections use the same active gutter at a given responsive state. Different arbitrary section gutters are forbidden.

A project may explicitly allow `edge-to-edge`; this is a different section mode, not a different random gutter.

### 6.3 Viewport-height sections

For sections configured as viewport-locked, height is concrete.

Example policies:

```json
{
  "hero": {
    "mode": "viewport-hero",
    "height": "100dvh",
    "contentOverflow": "reject"
  },
  "contacts": {
    "mode": "viewport-hero",
    "height": "61.8dvh",
    "contentOverflow": "clamp"
  }
}
```

Default new-site hero policy: `100dvh`.

Alternative approved proportion: Golden Ratio-derived `61.8dvh`, or another explicit project preset.

The layout may not silently grow because extra text was added. Overflow behavior is an explicit content policy.

### 6.4 Frame change protocol

Changing frame is a high-risk action and requires re-running `/frame`.

Before applying a change, the command produces impact analysis:

```text
current value
proposed value
affected routes
section/component count
canonical viewport states affected
responsive baselines affected
risk level
```

A frame change cannot be authorized by `/visual`, `/align`, `/reference`, or a generic "change contract" instruction. The specific `/frame` action is required.

## 7. Content fit policy

"The frame is locked" must not degrade into indiscriminate `overflow: hidden`.

Each constrained region declares one of these policies:

- `reject` — fail verification; content or composition must be changed.
- `truncate` — one-line truncation is intended.
- `clamp-lines` — fixed line clamp is intended.
- `internal-scroll` — region scrolls internally.
- `paginate` — content is split across pages/steps.
- `compact` — component switches to a pre-approved compact topology.

A command may not invent a new overflow policy to make a test green.

## 8. `/rhythm`: metric vocabulary

`/rhythm` chooses the legal spacing/size system for the project or maps an existing project scale into the contract.

Supported initial strategies:

- `existing` — preserve an established project scale.
- `4x` — operational UI, forms, dashboards, dense systems.
- `fibonacci` — editorial/marketing composition where expressive rhythm is desired.
- `custom-approved` — explicit project token set.

Example default scales:

```text
4x:        4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
Fibonacci: 5, 8, 13, 21, 34, 55, 89
```

Fibonacci is a vocabulary, not a requirement that every width be a Fibonacci number. Golden Ratio is primarily a macro-composition option, not fake mathematical precision for every icon and line-height.

The static linter should reject raw one-off spacing values when the property is contract-controlled and an approved token exists.

## 9. `/place`: assign content to legal regions

`/place` takes known content and assigns it to frame regions without changing frame geometry.

Default invariant: an element belongs to one legal region and stays inside it.

Cross-region elements require an explicit exception in `exceptions.json` describing:

- element/component ID;
- allowed boundary crossing;
- reason;
- affected responsive states;
- verifier treatment.

The exception prevents a later agent from "fixing" an intentional overlap.

## 10. `/align`: magnetic alignment tracks

`/align` formalizes the "magnetic lines" concept.

A composition defines a small set of horizontal and vertical alignment tracks. Elements should:

- start/end on a track;
- center on a track;
- align a baseline to a track; or
- use an explicit optical correction tolerance.

Default target for a local composition: no more than two dominant vertical and two dominant horizontal tracks unless the layout type requires more.

Adding a new dominant track is not a silent local tweak. The command must explain why the element cannot use an existing track and record the approved addition.

Verifier input uses actual DOM geometry (`getBoundingClientRect`) and project tolerance, for example `±1 CSS px` or a token-derived tolerance.

## 11. `/flow`: balanced collections, no accidental orphans

`/flow` governs repeated collections: cards, badges, links, statistics, footer groups, tiles, etc.

### 11.1 Orphan rule

Default hard rule for balanced collections:

- `2+2+1` is invalid when a legal balanced topology exists.
- `3+3+1` is invalid when `3+4`, `4+3`, `2+2+3`, or another approved balanced topology fits.
- One empty grid cell or one isolated final item is a high-penalty state.
- All items in one row is valid.
- All items in one column is valid.
- A single-item collection is valid.

The verifier must not force a worse solution merely to remove an orphan. Min/max item width, reading order, touch size, and frame constraints remain hard constraints.

### 11.2 Deterministic topology selection

For a collection of `N` items, legal candidate column counts are evaluated with a deterministic cost function. Suggested priority:

1. reject any min/max width violation;
2. reject overflow/overlap;
3. heavily penalize a last row of one item when `N > 1`;
4. penalize empty cells in the last row;
5. minimize row-size imbalance;
6. prefer fewer topology changes across adjacent viewport widths;
7. tie-break with the project's declared preferred density.

The implementation must expose the scoring result in verifier output so an agent cannot claim an arbitrary layout is "more balanced".

## 12. `/reference`: import design DNA, not foreign geometry

References may be code, screenshots, websites, components, or design examples.

The command extracts only selected traits such as:

- card fusion/overlap concept;
- border treatment;
- image treatment;
- hover/motion behavior;
- typography character;
- icon treatment;
- surface/elevation idea.

By default a reference may **not** override:

- frame mode;
- project gutter;
- approved spacing scale;
- alignment tracks;
- responsive topology;
- palette;
- typography tokens;
- section height policy.

If the user explicitly chooses one reference trait that conflicts with the contract, the exception is recorded narrowly in `exceptions.json`; unrelated reference traits remain non-authoritative.

## 13. `/visual`: decoration inside locked geometry

`/visual` applies:

- color tokens;
- typography tokens;
- radius/border/shadow tokens;
- icon style;
- image treatment;
- hover/focus states;
- restrained motion/effects.

It is not allowed to solve visual problems by changing frame, arbitrary spacing, alignment tracks, or collection topology.

This is the command that replaces the old tendency to make decoration and layout edits in one step.

## 14. Background images and visual mass

This layer is split into deterministic and heuristic rules.

### 14.1 Deterministic when metadata exists

An asset or section may define:

- focal point;
- protected/safe zones;
- subject bounding box;
- allowed crop modes;
- minimum text-background contrast zone.

When these are declared, the verifier may hard-fail text/controls that overlap a protected zone or crop away a required focal region.

### 14.2 Heuristic when metadata does not exist

Computer-vision saliency, visual-mass balance, face/object detection, and whitespace distribution may produce warnings and scores, but do not become hard failures solely from an opaque heuristic.

LLM vision is optional escalation, not the base verifier.

## 15. `/responsive`: canonical states plus continuous verification

Responsive design has two complementary layers.

### 15.1 Canonical review states

The project declares five principal screen classes and relevant orientations. Exact pixel sizes are configuration, not universal device truth.

A recommended starter matrix is:

- small phone portrait;
- phone landscape;
- tablet portrait;
- tablet landscape;
- laptop/desktop;
- wide desktop when the product uses it.

Canonical states are used for human/visual baselines and explicit topology review.

### 15.2 Continuous width sweep

Between the minimum and maximum supported width, geometry is machine-checked.

For a typical `320..1920 CSS px` range, an exhaustive 1px sweep is only 1601 widths and consumes zero LLM tokens. It may be used for focused components/routes when runtime is acceptable.

For broad CI, use adaptive sampling:

1. check canonical widths;
2. check every declared breakpoint at `-2, -1, 0, +1, +2`;
3. coarse-sample the remaining intervals;
4. compare a compact layout signature;
5. recursively bisect intervals where topology or invariant status changes;
6. on failure, shrink to the smallest reproducible width/range.

`fast-check` may be used for seeded property-based fuzzing and counterexample shrinking. Playwright provides real browser viewport control and DOM execution.

### 15.3 No undefined responsive state

Complex components declare allowed topologies, for example:

```text
Header:
- wide-single-row
- compact-single-row
- two-row
- mobile-menu
```

If no approved topology satisfies constraints at a width, verification fails. The agent does not invent a fifth topology silently.

## 16. Smoothness and breakpoint behavior

A breakpoint is not itself a bug. A topology may change abruptly at a declared boundary.

What must not happen:

- overlap;
- clipping outside policy;
- accidental horizontal scroll;
- unexplained giant whitespace;
- sudden geometry jump outside an approved topology change;
- element disappearance outside policy;
- orphan topology;
- alignment-track drift;
- frame gutter drift.

The verifier should compare adjacent widths and report large deltas when no approved topology transition occurred.

## 17. Machine verifier architecture

The verifier is layered by cost.

### Tier 0 — contract integrity

Fast, deterministic, no browser:

- JSON Schema validation;
- required stage order;
- upper-layer mutation ownership;
- exception schema;
- locked-file hashes/diff ownership;
- no missing contract references.

### Tier 1 — source lint

Fast static checks:

- `!important` forbidden;
- `stylelint-disable` or equivalent suppression for protected rules forbidden without an approved exception;
- random project-controlled spacing/color/radius values rejected when tokens exist;
- `overflow-x: hidden` cannot be used as a generic layout fix;
- absolute positioning for primary layout is forbidden unless contract-authorized;
- arbitrary frame/container values rejected;
- CSS ownership and selector rules as configured by project.

Stylelint custom plugins are the preferred CSS AST layer. Rules must have positive/negative tests.

### Tier 2 — browser geometry

Playwright opens a real rendered route/component and collects DOM geometry/computed style.

Hard checks include:

- frame edges and gutters;
- alignment-track distance;
- overlap;
- viewport/container overflow;
- clipping policy;
- section-height policy;
- min/max component dimensions;
- repeated gap consistency;
- orphan/empty-cell collection topology;
- declared safe-zone overlap;
- accidental horizontal scroll;
- adjacent-width geometry discontinuity outside approved transitions.

Output is compact JSON, not screenshots by default.

### Tier 3 — visual regression

Canonical states receive screenshot baselines. Screenshot diffs catch rendered changes that geometry rules do not model.

Visual regression is not the sole oracle because font/rendering differences can create false positives. Baselines must run in a pinned browser/font/OS environment in CI.

### Tier 4 — perceptual/CV heuristics

Optional:

- SSIM/perceptual image comparison;
- saliency and visual-mass balance;
- focal-point preservation;
- face/object safe zones;
- whitespace/density warnings.

These are advisory unless the project provides deterministic annotations/thresholds.

### Manual/LLM review

Used only for remaining subjective questions or low-confidence CV findings. The LLM receives verifier JSON and selected crops, not thousands of full screenshots.

## 18. Verifier output contract

All verifiers emit machine-readable violations.

Example:

```json
{
  "rule": "flow.no-orphan-last-row",
  "severity": "error",
  "route": "/",
  "component": "FooterLinks",
  "viewport": { "width": 893, "height": 900 },
  "actual": { "rows": [3, 3, 1] },
  "expected": { "allowed": [[4, 3], [3, 4], [2, 2, 3]] },
  "evidence": {
    "itemCount": 7,
    "minItemWidth": 180,
    "availableWidth": 843
  }
}
```

Exit codes:

- `0` — all required hard gates passed;
- `1` — hard contract violation;
- `2` — verifier/configuration failure;
- warnings do not change exit code unless project policy upgrades them.

## 19. Token-cost strategy

The default pipeline is intentionally non-LLM:

```text
contract/schema
→ Stylelint/custom AST
→ Playwright geometry
→ screenshot diff
→ optional CV
→ LLM only for unresolved findings
```

For normal coding-agent feedback, send only:

- failed rule IDs;
- route/component;
- smallest failing viewport/range;
- actual vs expected measurements;
- related contract key.

Do not send full browser traces or image sets unless a failure actually needs them.

## 20. Existing-site adoption

A legacy site does not bypass the system; it enters through baseline mode.

1. Audit actual containers, gutters, spacing values, components, breakpoints, and recurring topologies.
2. Classify findings as approved legacy contract, legacy debt, or true violation.
3. Generate a baseline contract without mass-reformatting the site.
4. Enforce new hard rules on changed code first.
5. Migrate individual sections/components intentionally.
6. Never use a giant baseline to permit new violations silently.

Existing site reality may inform the initial contract, but once a layer is approved it becomes the same locked source of truth as a new project.

## 21. Skill repository architecture

Proposed v1 repository structure:

```text
SKILL.md
AGENTS.md
README.md
SPEC.md
rubric.md

commands/
  frame.md
  rhythm.md
  place.md
  align.md
  flow.md
  reference.md
  visual.md
  responsive.md
  verify.md

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

scripts/
  bootstrap_project.py
  validate_contract.py
  verify_layer_permissions.py
  verify_skill_structure.py

verifier/
  package.json
  src/
    cli.ts
    contract/
    source/
    geometry/
    responsive/
    visual/
    report/
  tests/

references/
  architecture.md
  migration.md
  machine-verification.md
  component-sources.md
  skillopt-and-architecture.md

docs/superpowers/specs/
```

`SKILL.md` remains a short router. It explains which command/stage to invoke and requires verifier evidence. Detailed semantics live in command/reference files and executable code.

Host-specific adapters for Codex, Claude Code, OpenCode, etc. are secondary packaging. The underlying contract files and verifier must remain model-agnostic.

## 22. Dependencies and current API choices

### Playwright

Use current Playwright Test/Playwright APIs for real browser rendering. Current documentation supports per-context viewport configuration and `page.setViewportSize(...)`, which is sufficient for deterministic width sweeps. Browser-page execution is used to read DOM geometry and computed style.

### Stylelint

Use Stylelint's plugin API for custom contract rules. Current documentation supports custom plugins via `createPlugin(...)`, direct plugin configuration, and dedicated rule tests.

### fast-check

Use property-based tests where adaptive fuzzing adds value. Current documentation supports asynchronous properties, deterministic seeds for replay, and counterexample/shrink details.

These dependencies are implementation details. The public verifier contract is the JSON report and exit status, so the underlying tool may be replaced later without rewriting the design contract.

## 23. Error and conflict behavior

The system fails closed for these cases:

- malformed contract;
- missing required predecessor stage;
- unauthorized upper-layer mutation;
- frame hash/diff ownership mismatch;
- no legal responsive topology;
- hard geometry invariant failure;
- verifier runtime/configuration error.

It does **not** silently:

- create a new spacing value;
- add a new alignment line;
- create a new topology;
- resize a locked viewport section;
- import a reference's foreign frame;
- suppress a linter rule;
- hide overflow to make tests green.

## 24. Exceptions

Exceptions are narrow, named, and durable.

Example:

```json
{
  "id": "hero-product-overhang",
  "scope": "HomeHero.ProductImage",
  "rules": ["placement.inside-region"],
  "allowed": {
    "rightOverhang": "21px"
  },
  "reason": "approved composition motif",
  "responsiveStates": ["desktop", "wide"]
}
```

An exception to one rule does not disable neighboring rules.

There is no generic `disable verifier` escape hatch.

## 25. Testing strategy

### Contract/schema tests

- valid examples pass;
- missing/unknown keys fail where appropriate;
- unauthorized command write scopes fail;
- exception scope cannot be global by accident.

### Stylelint rule tests

Each protected rule has accept/reject fixtures, including attempts to bypass it with disable comments.

### Geometry fixture tests

Create tiny deterministic HTML fixtures that intentionally contain:

- 1px alignment drift;
- wrong gutter;
- overlap;
- horizontal overflow;
- `3+3+1` orphan row;
- illegal section growth;
- protected-zone overlap;
- breakpoint-only failure.

Each fixture must fail for exactly the intended rule.

### Responsive tests

- canonical states;
- breakpoint `±2/±1/0` neighborhoods;
- seeded fuzz runs;
- counterexample replay;
- optional exhaustive width sweep for focused fixtures/components.

### End-to-end dogfood

The skill repository should contain at least one small example project or fixture page that is bootstrapped, deliberately broken, repaired, and verified by the real CLI.

## 26. CI strategy

Fast path on every relevant change:

```text
schema/contract integrity
→ source lint
→ changed-component geometry checks
```

PR/main gate:

```text
fast path
→ canonical viewport suite
→ adaptive responsive sweep
→ canonical screenshot regression
```

Optional nightly/deep run:

```text
all registered routes/components
→ exhaustive or denser width sampling
→ perceptual/CV advisory checks
```

Changed-files/affected-routes mapping and caching should prevent a large project from re-rendering every page for every CSS change when impact is local.

## 27. Security-style treatment of design invariants

Frame is treated like a high-impact interface contract. A small unauthorized change can propagate through many routes and devices, so it must have:

- a narrow owner (`/frame`);
- impact analysis;
- explicit user approval;
- deterministic regression checks;
- versioned state;
- no silent downstream override.

This is analogous to protecting a public API/schema: not because layout is security-sensitive, but because uncontrolled shared-contract changes have a large blast radius.

## 28. Non-goals for v1

v1 does not attempt to:

- mathematically prove that a page is beautiful;
- make Golden Ratio mandatory everywhere;
- replace accessibility testing;
- auto-rewrite arbitrary legacy CSS into a perfect design system;
- make CV/LLM taste judgments hard blockers by default;
- physically sandbox every agent process from writing contract files;
- support unlimited layout modes.

## 29. Implementation phases

### Phase A — contract core

- schemas;
- project bootstrap;
- layer ownership/lock verification;
- `/frame`, `/rhythm`, `/place`, `/align`, `/flow` command contracts;
- migration of existing prose rules into the new architecture.

### Phase B — static verifier

- Stylelint integration;
- `!important` hard ban;
- suppression guard;
- design-token/raw-value rules;
- tests.

### Phase C — browser geometry verifier

- Playwright CLI;
- geometry snapshot collection;
- frame/alignment/overflow/section-height checks;
- flow/orphan rule;
- compact JSON reporting.

### Phase D — responsive engine

- canonical matrix;
- breakpoint neighborhoods;
- adaptive interval sampling;
- fast-check fuzz/replay/shrinking;
- topology-transition validation.

### Phase E — visual and media layer

- canonical screenshot baselines;
- reference DNA workflow;
- focal/safe-zone metadata;
- optional CV/perceptual warnings.

### Phase F — legacy adoption and packaging

- audit/baseline command;
- changed-files policy;
- model/host adapters;
- documentation/examples;
- SkillOpt evaluation after real traces exist.

## 30. Acceptance criteria for v1

v1 is not considered complete until all of the following are true:

1. A new project can bootstrap `.vaoferi-design/` from the skill.
2. `/frame` creates an explicit locked frame contract.
3. A non-frame command changing frame state fails verification.
4. `!important` fails the static gate.
5. A suppression attempt for a protected rule fails unless a narrow approved exception exists.
6. A 1px alignment drift can be detected by a fixture test.
7. A wrong global gutter can be detected.
8. `3+3+1` can fail when a valid balanced topology exists.
9. An intentional all-one-row/all-one-column layout can pass.
10. A viewport-locked section that grows beyond contract can fail.
11. A breakpoint-only failure is found by the responsive engine.
12. A failing width can be reported as a compact reproducible counterexample.
13. Canonical screenshot regression runs in a pinned environment.
14. An external reference cannot silently overwrite frame/rhythm/palette.
15. An explicit reference exception survives later repair/verification passes.
16. Existing projects can enter baseline mode without mass autofix.
17. Agent-facing output is compact JSON/evidence instead of a request to inspect every screenshot manually.
18. `SKILL.md` remains a concise router rather than a 1000-line instruction dump.
19. `README.md`, `rubric.md`, examples, and project log match the new behavior.
20. Repository validation and all verifier tests pass before release.

## 31. Migration of current good ideas

Retain and adapt rather than discard:

- existing / `4x` / Fibonacci spacing choices;
- design tokens;
- component reuse and component-source catalog;
- `DESIGN.md` as a human-readable design-system document where useful;
- explicit visual QA;
- SkillOpt as a measured post-deployment improvement loop;
- current component snippet tooling where still useful.

Replace or demote:

- self-reported 20-principles Pass/Fail as primary evidence;
- static breakpoint list as the whole responsive strategy;
- "Golden Canon as guidance" when a project has explicitly locked a Golden Canon frame mode;
- emergency `!important` as a normal documented escape hatch;
- broad prose instructions that cannot be checked by code.

## 32. Decision summary

The central architectural decision is:

> Vaoferi Design Skill v1 is not primarily a design-advice prompt. It is a contract-driven UI engineering system in which AI may generate and repair implementations, while deterministic tools own the final verdict for every rule that can be measured.

`/frame` is the most protected contract layer. Lower layers are compositional refinements inside it, not opportunities to renegotiate it silently.
