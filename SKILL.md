---
name: vaoferi-design-skill
description: Use when designing or changing UI, screens, dashboards, admin forms, landing sections, visual systems, DESIGN.md, components, tokens, responsive layouts, or preserving an existing product.
metadata:
  version: 1.1.0
---

# Vaoferi Design Skill

Contract-driven router for UI/design work. Detailed rules are lazy-loaded from focused references.

## Preflight

Run at task start, after context compaction/restart, and before every stage transition:

```text
contractVersion=<version>
stage=<stage>
importantPolicy=ENFORCED
changedFilesPolicy=STRICT
browserGate=READY|INSTALLABLE|BLOCKED
relevantExceptions=[...]
```

If a required source is unavailable, stop the dependent stage and name the missing source.

## Stage Order

```text
context/content inventory -> /frame -> /rhythm -> /place -> /align -> /flow -> /reference -> /visual -> /responsive -> /verify
```

Previous required stage must be complete. `/frame` alone owns frame geometry.

## Hard Rules

- Existing product first; preserve established patterns and deliberate exceptions unless redesign is explicitly requested.
- Changed/touched authored UI code is strict. New `!important` is a hard failure unless covered by an exact approved exception.
- Missing required browser verification = BLOCKED.
- Browser-required stages proceed only when `browserGate=READY`.
- Responsive verification checks every integer CSS-pixel width in the configured supported interval plus declared orientation/aspect states.
- A task is Done only after required verifier gates PASS and evidence is produced.

## References

Read only what the current work requires:

- `references/lifecycle.md` — lifecycle, manifest, managed ownership, preflight.
- `references/stages.md` — stage ownership and existing-site preservation.
- `references/verification.md` — deterministic gates, browser sweep, policy, evidence.
- `references/component-sources.md` — component/snippet sources.
- `references/quality-gates.md` — visual quality after structural gates.
- `references/skillopt-and-architecture.md` — only when changing skill architecture.

`references/action-contract.md` is a compatibility pointer; v1.1 authority is split across lifecycle/stages/verification.

## Verify

Use `design verify --changed` for touched-surface work. Use `design verify --full` for broad CI/release or broad-impact changes. Do not declare Done on FAIL or BLOCKED.
