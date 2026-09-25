# Action Contract — Compatibility Pointer

Canonical v1.1 design contract is split across focused references:

- `references/lifecycle.md` — lifecycle, manifest, managed ownership, preflight;
- `references/stages.md` — canonical stage order, stage ownership, existing-site preservation;
- `references/verification.md` — deterministic hard gates, browser capability, changed-code policy, exhaustive responsive verification, evidence;
- `references/component-sources.md` — component and snippet sources;
- `references/quality-gates.md` — visual quality review after structural gates.

For v1.1 hard rules, the three focused references `lifecycle.md`, `stages.md`, and `verification.md` are authoritative.

Preferred touch target is `48x48 CSS px` for every authored interactive control. Smaller values are compliance floors or documented existing-product exceptions, never the default an agent may choose; a smaller rendered target needs hit-area evidence.

Balanced peer-row policy classification: `STRONG_HEURISTIC_WITH_EXCEPTIONS`. Random orphan rows (`2+1`, `3+1`) among equal wrapping peers fail the balance principle unless a documented semantic, compositional or accessibility exception is recorded with the evidence. The classification is a strong heuristic with named exceptions — it is never a licence to weaken a required gate, and it does not replace the universal DoD checks below.

Universal completion (zero uncommitted files, commit + push + remote sync + `WORKTREE CLEAN: PASS`) and the 10 canonical viewport browser matrix are owned by the repository's Start Here `DEFINITION_OF_DONE.md`; this skill routes to it in `references/verification.md` and does not restate it.

Legacy named-device sampling is not sufficient responsive verification. Required browser verification is fail-closed according to `references/verification.md`.
