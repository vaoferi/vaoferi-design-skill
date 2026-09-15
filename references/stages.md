# Design Stages v1.1

Цей файл описує порядок design stages і ownership. Верхній `SKILL.md` містить лише короткий router; цей reference читай, коли задача входить у staged UI workflow.

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
4. change only the scope required by the task;
5. treat new visual language, spacing systems, components or tokens as a proposal, not an automatic cleanup.

A local fix must not silently become a redesign.

## Structure Before Decoration

Resolve geometry and flow before visual polish. Do not use color, shadows, gradients, absolute positioning or overflow masking to hide unresolved structural defects.

For component/source lookup, read `references/component-sources.md`. For hard verification rules, read `references/verification.md`.
