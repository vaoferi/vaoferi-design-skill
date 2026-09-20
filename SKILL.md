---
name: vaoferi-design-skill
description: Use when designing or changing UI, screens, dashboards, admin forms, landing sections, visual systems, DESIGN.md, components, tokens, responsive layouts, or preserving an existing product.
metadata:
  version: 0.4.2
---

# Vaoferi Design Skill

Contract-driven router for UI/design work. Detailed rules are lazy-loaded from focused references.

## Preflight

Run at task start, after context compaction/restart, and before every stage transition:

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

If a required source is unavailable, stop the dependent stage and name the missing source.

## Scope Resolution

Resolve design scope before any staged UI decision. Read `references/scopes.md` when the project has scope mappings, multiple UI surfaces, or shared files.

Resolution priority is explicit scope, then path mapping, then route mapping. Shared UI resolves only through an explicit shared scope mapping; `sharedWith` is compatibility metadata, not a fallback. Unmapped or ambiguous ownership = BLOCKED. Do not infer scope from appearance.

For multi-scope tasks, keep contract/profile state and verification independent per scope. Aggregate PASS requires every required scope to PASS.

## Stage Order

```text
context/content inventory -> /frame -> /rhythm -> /place -> /align -> /flow -> /reference -> /visual -> /responsive -> /verify
```

Previous required stage must be complete. `/frame` alone owns frame geometry.

## Hard Rules

- Existing product first; preserve established patterns and deliberate exceptions unless redesign is explicitly requested.
- Adoption/configuration is not permission to redesign production UI.
- Changed/touched authored UI code is strict. New `!important` is a hard failure unless covered by an exact approved exception.
- Missing required browser verification = BLOCKED.
- Browser-required stages proceed only when `browserGate=READY`.
- Responsive verification checks every integer CSS-pixel width in the configured supported interval plus declared orientation/aspect states.
- A task is Done only after required verifier gates PASS and evidence is produced.

## References

Read only what the resolved scope/current stage requires:

- `references/scopes.md` — scope resolution, contract isolation, multi-scope aggregation.
- `references/lifecycle.md` — lifecycle, adoption guard, manifest, managed ownership, preflight.
- `references/stages.md` — stage ownership, existing-site preservation and style-owner-first changes.
- `references/verification.md` — deterministic gates, browser sweep, policy, evidence.
- `references/admin-workspace.md` — only for resolved `admin-standard` or `admin-dense` profiles; complexity, Interaction Topology, actions, rendered checks.
- `references/component-sources.md` — component/snippet sources.
- `references/quality-gates.md` — visual quality after structural gates.
- `references/skillopt-and-architecture.md` — only when changing skill architecture.

`references/action-contract.md` is a compatibility pointer; contract architecture v1.2 authority is split across focused lifecycle/scope/stage/verification references.

## Verify

Use `design verify --changed` for touched-surface work. Use `design verify --full` for broad CI/release or broad-impact changes. Multi-scope work verifies every resolved scope. Do not declare Done on FAIL or BLOCKED.
