# Unified design workflow (candidate)
Only one discoverable Vaoferi design skill. These are intent arguments, not assumed registered shell or slash commands. In Codex use $vaoferi-design-skill workflow; in other harnesses invoke the installed skill by its native mechanism. Natural-language UI work triggers workflow automatically. Existing lifecycle and stage contracts remain authoritative.

| Intent | Execution |
|---|---|
| workflow | Full affected-scope pipeline below |
| improve | Existing-site fingerprint, critique/audit, repair affected defects; no unapproved redesign |
| grid | Frame plan plus alignment pass; explicit grid profile required for migration |
| motion | Interface motion only; plan then implement and verify |
| immersive | Explicit opt-in for scroll narrative, 3D, WebGL or advanced motion; load references/immersive.md; budget and fallback first |
| tokens | Inspect existing semantic tokens; propose missing tokens before editing |
| components | Existing component source order and primitive library |
| stitch | Optional concept adapter; only if configured and user authorizes sending context; do not invent access or quotas |
| verify | Read-only rendered and deterministic gates; changed/full as existing contract |
| update | Upstream check, review, approval, scoped checkout and validation; not project lifecycle update |

Existing lifecycle commands audit/init/migrate/augment/doctor/rollback and design update remain unchanged. Do not confuse design update (managed project files) with upstream update (external dependencies). Unrecognized intent: report choices; do not guess destructive behavior.

## Execution card (mandatory for workflow and improve)
Record target routes/components, scope, user goal, lifecycle, risk tier, existing design truth, grid profile, spacing profile, motion intent, browser readiness, and dependency status. Follow this sequence, retaining the canonical stage order from stages.md. Each item must have an artifact or explicit BLOCKED reason; do not merely print a checklist.
1. Resolve scope and project policy. Read scopes.md, lifecycle.md, stages.md; admin topology when required. Identify style owner and baseline. Capture existing rendered state before editing if available.
2. Read upstream-tools.md. Check only relevant upstream refs once per task/session; review changed versions before using. For HTML/CSS/client JS load Modern Web Guidance and search concrete platform features BEFORE implementation. Read its retrieved guide and fallback requirements. If required tool cannot run, mark that gate BLOCKED, no invented results.
3. Plan: content inventory, grid and spacing profiles, responsive anchors, motion semantics and overflow policy. Read grid-and-motion.md. Preserve existing tokens. Impeccable shape/new-work or critique as appropriate; use its actual installed playbook, not a fabricated command. Preserve scope and project truth; do not allow upstream init/document to replace canonical DESIGN.md.
4. Execute /frame -> /rhythm -> /place -> /align -> /flow -> /reference -> /visual. Use grid first, then components, then polish; implement motion alongside components. Existing stage ownership rules still apply; reopen owning stage on structural defect. Upstream advice is subordinate to approved scope/brand and hard gates.
5. Candidate browser checks: stable end state, global and component gridlines with real content and relevant overlays; explicit anchor assertions and overflow checks per grid-and-motion.md. Save before/after captures. Confirm probe outliers visually; fix shared style owner, not arbitrary offsets. Test motion separately, normal/reduced motion and interruption. Impeccable audit/harden/adapt/polish only as relevant; recheck changed geometry after any edit. Preserve V1-V4 risk tiers, not repeated full matrix for small edits.
6. Run canonical deterministic design verification and 20 principles gate. Missing runtime, missing relevant coverage or unresolved findings = BLOCKED/FAIL. Evidence includes target SHA, routes/states, selectors, computed coordinates, screenshots, exceptions, upstream SHAs, test results. Never claim PASS because a command printed output. Follow Start Here DoD.

## Precedence and collisions
Owner-approved project contract > Vaoferi hard gates and stage ownership > selected upstream recommendations. Where upstream suggests a new palette, component, layout system or destructive action, stop and ask owner. Do not silently rename public commands; report collisions and propose mapping. Do not auto-discover all upstream skills as globally available. Load only the required file from the private dependency root. Optional third-party services never block unrelated local work.
