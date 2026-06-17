# Skill Architecture And SkillOpt

## Diagnosis

The previous `SKILL.md` was too large for reliable agent execution.

Observed risk:

- 1000+ lines in the entrypoint;
- mandatory order mixed with references, examples, changelog and SkillOpt notes;
- repeated rules spread across several sections;
- agents could satisfy one local section while missing the actual execution order.

Fix:

- keep `SKILL.md` short;
- make it route to required reference files;
- put detailed gates in `references/`;
- use scripts for deterministic checks;
- use SkillOpt only with measured examples, not vague impressions.

## Plugin Or Agent Decision

Do not turn this into a plugin yet.

Reason:

- current failure is instruction architecture, not missing runtime capability;
- a plugin adds packaging cost but does not make a weak workflow clearer;
- a separate agent can help with review, but it does not replace the main design contract.

Use a plugin only when the skill needs bundled MCP tools, generated commands, browser automation, or a reusable distribution package.

Use a specialized agent only when repeated design review requires independent critique or parallel evaluation.

## SkillOpt Rule

SkillOpt is an improvement loop:

```text
real traces -> scored examples -> train/val/test -> candidate/best_skill.md -> validation gate -> human review -> intentional merge
```

Never auto-replace `SKILL.md` with `best_skill.md`.

Do not commit:

- `.env`;
- API keys;
- raw trace dumps;
- large optimizer output folders;
- `.skillopt/outputs/`.

Small reviewed benchmark items under `.skillopt/data/` are allowed when they are intentional and contain no secrets.

## Local SkillOpt Scaffold

This repo may keep:

```text
.skillopt/config.yaml
.skillopt/data/train/items.json
.skillopt/data/val/items.json
.skillopt/data/test/items.json
```

Validate the local scaffold:

```bash
python scripts/check_skill_structure.py
```

The installed `skillopt` package does not expose `python -m skillopt`. Upstream CLI usage is script-based:

```bash
python scripts/train.py --config <config.yaml>
python scripts/eval_only.py --config <config.yaml> --skill <best_skill.md>
```

If using the upstream repository, run those commands from the cloned SkillOpt repo and point `env.skill_init` or the benchmark config to this repo's `SKILL.md`.

## Acceptance Before Merge

Before accepting an optimized skill:

1. Compare `best_skill.md` with current `SKILL.md`.
2. Confirm it preserved:
   - structure before decoration;
   - existing UI first;
   - `DESIGN.md`;
   - primitive library;
   - spacing mode choice;
   - grid first;
   - component reuse;
   - token discipline;
   - approval before new components/colors;
   - visual QA;
   - all 20 principles.
3. Run repo checks.
4. Update `README.md`, `rubric.md`, examples and `docs/history/project_log.md` if behavior changed.
