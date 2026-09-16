# Design Stages v1.2

Цей файл описує порядок design stages і ownership. Верхній `SKILL.md` містить лише короткий router; цей reference читай, коли задача входить у staged UI workflow.

## Before Stages: Resolve Scope

Scope resolution happens before the staged workflow. Resolve the touched surface using `references/scopes.md`, load that scope's local contract/profile, and stop with BLOCKED if ownership is ambiguous or unmapped.

For a multi-scope task, each scope runs the staged workflow against its own contract. Do not average or merge frontend/admin rules into one synthetic design system.

If the resolved profile is `admin-standard` or `admin-dense`, run the admin complexity gate. When it requires Interaction Topology, topology must be present and valid before structural implementation proceeds. Read `references/admin-workspace.md` only for those admin profiles.

## Canonical Order

```text
context/content inventory -> /frame -> /rhythm -> /place -> /align -> /flow -> /reference -> /visual -> /responsive -> /verify
```

Stage не запускається, поки обов'язковий попередник не `complete`.

## Ownership

| Stage | Володіє | Не має права мовчки змінювати |
|---|---|---|
| `context/content inventory` | source of truth, content, existing-site evidence | UI geometry |
| `/frame` | page/container macro geometry, primary regions, frame boundaries | downstream polish |
| `/rhythm` | spacing rhythm within approved frame | frame geometry |
| `/place` | component placement inside frame | frame geometry |
| `/align` | alignment lines, baselines, local alignment corrections | `frame.json` / macro geometry |
| `/flow` | content flow, wrapping, responsive relationships | locked upper-stage ownership without reopening it |
| `/reference` | comparison against project/reference UI | redesign by taste |
| `/visual` | approved tokens, typography, color, radius, shadows, polish | structural geometry |
| `/responsive` | browser-verified responsive behavior | bypassing unresolved structural defects |
| `/verify` | final deterministic gates and evidence | implementation state |

`/frame` is the only stage allowed to mutate frame-owned geometry. If a later stage discovers a frame defect, reopen `/frame`, change it there, then rerun affected successors.

## Existing Sites

Existing product is the first authority unless the user explicitly requested redesign. Before changing local UI:

1. inspect rendered UI and project design sources;
2. build/use the deterministic design fingerprint;
3. preserve dominant patterns and deliberate repeated exceptions;
4. change only the resolved scope required by the task;
5. treat new visual language, spacing systems, components or tokens as a proposal, not an automatic cleanup.

### Style Ownership Before Change

Before a CSS/layout/component change, identify the existing **style owner**: theme/token, component stylesheet, utility system, view/widget or other authored source that currently owns the behavior. Trace the winning rule and its consumers before editing.

- Prefer changing the actual owner or a deliberate project modifier over creating a new `override layer` whose only job is to beat unknown existing CSS.
- Do not stack a new stylesheet, selector specificity or `!important` over an unresolved source merely because it is faster locally; first establish ownership and scope.
- Reuse existing project/native/component capabilities before adding tooling. Do not add a **whole dependency/library** for one **trivial visual** need when the current stack can express it cleanly. If a new dependency is materially better, state the reuse/maintenance reason and verify its impact.

A local fix must not silently become a redesign. Adoption lifecycle operations also do not authorize production UI redesign; see `references/lifecycle.md`.

## Structure Before Decoration

Resolve geometry and flow before visual polish. Do not use color, shadows, gradients, absolute positioning or overflow masking to hide unresolved structural defects.

For component/source lookup, read `references/component-sources.md`. For hard verification rules, read `references/verification.md`.
