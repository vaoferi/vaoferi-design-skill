# Action Contract — Compatibility Pointer

Canonical v1.1 design contract is split across focused references:

- `references/lifecycle.md` — lifecycle, manifest, managed ownership, preflight;
- `references/stages.md` — canonical stage order, stage ownership, existing-site preservation;
- `references/verification.md` — deterministic hard gates, browser capability, changed-code policy, exhaustive responsive verification, evidence;
- `references/component-sources.md` — component and snippet sources;
- `references/quality-gates.md` — visual quality review after structural gates.

For v1.1 hard rules, the three focused references `lifecycle.md`, `stages.md`, and `verification.md` are authoritative.

Legacy named-device sampling is not sufficient responsive verification. Required browser verification is fail-closed according to `references/verification.md`.
