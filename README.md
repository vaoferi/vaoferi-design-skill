# Vaoferi Design Skill

Design with structure, not decoration.
Use structure before decoration, spacing mode before grid, alignment before effects, components before custom code, and trace existing CSS before writing new CSS.

**Current release:** `0.4.0`  
**Contract architecture:** `1.2`

The skill starts design-system work with a portable project contract so Codex, Claude Code, Cursor, OpenCode, Stitch/Open Design-style tools, and similar agents can read the same source of truth instead of guessing the UI.

## Main rules

- Start from goal and hierarchy.
- Create or reuse `DESIGN.md` before designing multi-screen UI.
- Keep `SKILL.md` short; detailed rules live in `references/`.
- Resolve the design scope before staged UI decisions; one repository may contain unrelated frontend/admin/internal UI systems.
- Adoption/init/migration prepares the repository and must not silently redesign production UI.
- Start and fill the primitive library before generating page-specific elements.
- Build the grid first using Golden Canon-inspired structure.
- Preserve the existing spacing scale, or choose `4x` / `Fibonacci` for new work and record it in the active scope contract.
- Validate local snippets before using them as a component source.
- Reuse components before creating new ones.
- Match the existing UI first on operational screens and admin forms.
- Trace existing CSS before adding a new selector or override.
- New authored `!important` is a hard failure unless covered by an exact approved exception.
- Use design tokens before ad-hoc values.
- Ask before introducing new components, colors, or spacing scales.
- Required browser verification is fail-closed; missing capability is BLOCKED, not skipped.
- Validate responsive behavior across the configured width interval and declared orientation/aspect states.
- Pass required design gates with evidence; do not silently skip one.
- Finish only after verifier gates and visual QA pass.
- Stop on contract/scope conflicts rather than guessing.

## Teaser

This skill turns Golden Canon-inspired structure and an explicit existing/`4x`/`Fibonacci` spacing choice into a workflow that produces layouts which:
- behave predictably from narrow to wide viewports;
- reuse existing UI and existing CSS instead of inventing fresh styles;
- keep spacing and typography consistent through tokens;
- keep independent design scopes isolated inside the same repository;
- make dense admin workspaces follow explicit interaction and action topology instead of accidental vertical dumping.

## Quick start (recommended flow)

```text
goal
  -> resolve design scope
  -> DESIGN.md / scope contract
  -> existing-site fingerprint
  -> content inventory
  -> interaction topology when admin complexity requires it
  -> /frame
  -> /rhythm
  -> /place
  -> /align
  -> /flow
  -> /reference
  -> /visual
  -> /responsive
  -> /verify
```

If sources or libraries contradict each other, stop and use `SKILL.md` plus the focused references for the resolved scope/stage. `references/action-contract.md` is only a compatibility pointer.
If a new component, token, layout pattern, or exact exception is required, make the proposal explicit instead of silently changing the contract.

## Use

1. Understand the goal and user action.
2. Run design preflight and resolve scope.
3. Create or find `DESIGN.md` and the scope-local contract.
4. Preserve the existing spacing/design fingerprint unless migration or redesign is explicitly approved.
5. For complex admin work, produce Interaction Topology before layout implementation.
6. Build skeleton and responsive plan.
7. Build the grid/frame before placing elements.
8. Draw alignment lines and group content/actions deliberately.
9. Resolve components before creating new ones.
10. Trace existing CSS before adding new styles; do not add authored `!important` without an exact approved exception.
11. Validate local snippets source when project components are not enough.
12. Run deterministic static/policy checks.
13. Run required browser/responsive verification.
14. Protect photos, logos, critical status, and critical actions.
15. Produce machine-readable evidence before marking Done.

## What this skill does

- prevents random one-off CSS and component sprawl in operational/admin UI;
- keeps universal hard rules separate from project- and scope-local visual truth;
- supports multiple independent design scopes such as frontend, admin, cabinet, internal tools, and explicit shared UI;
- separates repository adoption/bootstrap from actual redesign work;
- keeps `SKILL.md` as a short entrypoint and moves detailed execution rules into `references/`;
- uses `config/component-libraries.json` plus scripts to verify libraries and return concrete snippets before relying on them;
- enforces token discipline so colors, spacing, radius, and typography stay consistent inside the resolved scope;
- supports existing project spacing or explicit `4x` / `Fibonacci` modes without forcing migration;
- applies Golden Canon-inspired structure as a macro guide rather than a pixel prison;
- keeps flat, traceable class naming and clear CSS ownership;
- tracks real usage and periodically uses SkillOpt-style review to improve the skill without auto-replacing `SKILL.md`;
- requires browser verification and explicit PASS / FAIL / BLOCKED evidence instead of "looks fine";
- uses legacy baseline + ratchet so old debt can remain known while new changed-code debt is rejected;
- adds dense-admin complexity, interaction-topology, action-hierarchy, and rendered-workspace checks.

## What this skill does NOT do

- it will not fix a broken product by adding decoration over a bad structure;
- it will not silently redesign production UI during `audit`, `init`, or `migrate`;
- it will not assume one repository equals one design system;
- it will not guess a scope when ownership is ambiguous or unmapped;
- it will not approve new colors, components, spacing, baselines, or exceptions implicitly;
- it will not treat `overflow-x: hidden`, arbitrary fixed heights, or `!important` as routine layout fixes;
- it will not silently continue without required browser verification;
- it will not accept `best_skill.md` from SkillOpt without human diff review and validation evidence;
- it will not claim a design is Done while any required scope/gate is FAIL or BLOCKED.

## What this skill emphasizes

- `DESIGN.md` is a project design-topology/router; scope-local machine truth lives under `.design/scopes/<scope>/`.
- Tokens can be mirrored to code-friendly files like `tokens.css` / `tokens.json` when needed.
- Primitive libraries prevent one-off buttons, cards, inputs, and badges on every page.
- SkillOpt is used as a periodic improvement loop: real traces, scored examples, validation gate, reviewed `best_skill.md`.
- Golden Canon is a macro guide, not a rigid pixel rule.
- `4x` and `Fibonacci` are alternative spacing modes; existing project tokens win unless migration is approved.
- `grid`, `subgrid`, `fr`, `minmax()`, `auto-fit`, and `clamp()` are useful layout primitives.
- `grid` commonly handles page structure; `flex` commonly handles component interiors.
- `gap` is preferred over margin hacks.
- CSS guardrails: trace before patching, low specificity, and no new authored `!important` except an exact approved exception.
- Traceable class naming and `@container` help keep component ownership and local responsiveness clear.
- Accessibility and responsive scaling are first-class requirements.
- Mobile/narrow-width behavior preserves workflow and information hierarchy rather than merely stacking source order.
- Visual polish comes from rhythm, whitespace, typography, and restrained motion, not extra decoration.
- The browser should do the math whenever possible; exhaustive changed-surface checks are machine work, not LLM work.

## Files

- `SKILL.md` — short mandatory router and hard invariants
- `references/scopes.md` — scope resolution, isolation, and multi-scope aggregation
- `references/lifecycle.md` — audit/init/migrate/work/redesign lifecycle and adoption guard
- `references/stages.md` — stage ownership and existing-site preservation
- `references/verification.md` — deterministic policy/browser/evidence gates
- `references/admin-workspace.md` — dense admin complexity, topology, actions, rendered checks
- `references/action-contract.md` — compatibility pointer to current focused references
- `references/component-sources.md` — component source order and local component library catalog
- `references/quality-gates.md` — visual QA gate
- `references/skillopt-and-architecture.md` — diagnosis, plugin/agent decision, SkillOpt workflow
- `config/component-libraries.json` — local catalog for Bootstrap, Bulma, and Shoelace
- `scripts/validate_snippets_source.py` — validates the local component catalog
- `scripts/get_component_snippet.py` — returns concrete snippets such as a `Далі` button
- `scripts/check_skill_structure.py` — validates skill structure, references, snippets and SkillOpt scaffold
- `.skillopt/` — small reviewed SkillOpt scaffold; outputs are ignored
- `.gitignore` — excludes SkillOpt outputs, caches, and local logs
- `SPEC.md` — legacy/current project specification entrypoint
- `AGENTS.md` — rules for working in this repository
- `README.md` — project overview
- `rubric.md` — Done checklist for design work
- `docs/history/project_log.md` — log of notable skill changes and decisions
- `examples/good-answer.md` — приклад правильної відповіді за скілом
- `examples/bad-answer.md` — приклад типових помилок
