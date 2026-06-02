# AGENTS.md

## Hermes working directory

Hermes should work in this local Windows/NAS path:

```text
\\NAS\homes\vaoferi\Work\vaoferi-design-skill
```

Git Bash sees the same folder as:

```text
//NAS/homes/vaoferi/Work/vaoferi-design-skill
```

If this NAS path is inaccessible, do not silently fall back to another workspace—stop, report the exact failure, and wait for a decision. Do not switch to `C:\Users\vaoferi` or another unrelated folder for this repository unless the user explicitly asks.

## Repository

GitHub repository:

```text
https://github.com/vaoferi/vaoferi-design-skill
```

Local remote should be:

```bash
git remote set-url origin https://github.com/vaoferi/vaoferi-design-skill.git
```

Main branch:

```text
main
```

## Normal workflow

Before work:

```bash
git status --short --branch
git fetch origin main
git pull --ff-only origin main
```

After work:

```bash
git status --short
git add <changed-files>
git commit -m "Short clear message"
git push origin main
```

## Auth warning

If `git push` fails with auth errors, do not claim the push succeeded.

Known local blockers on this machine:

```text
gh auth status -> token for vaoferi is invalid
ssh -T git@github.com -> Permission denied (publickey)
git push without interactive credentials -> fatal: unable to get password from user
```

In that case:

1. Keep the local commit in this repository.
2. Report the exact blocker.
3. If a GitHub connector/API write tool is available, use it to update the remote.
4. Then run `git fetch origin main` and `git pull --rebase origin main` to align the NAS copy.

## Skill entrypoint

The skill entrypoint is:

```text
SKILL.md
```

Keep it UTF-8 without BOM.

Do not commit secrets, tokens, cookies, `.env`, private keys, generated cache files, temporary exports, or local machine credentials.

## Repository purpose

This repository is not just a collection of design tips.

It defines a working method for AI agents that must create visual interfaces through structure, not decoration.

The skill must teach agents to:

1. Understand the project context.
2. Check the existing visual language.
3. Check existing components.
4. Build a grid.
5. Draw alignment lines.
6. Place elements on the grid.
7. Use existing tokens.
8. Reuse existing components.
9. Ask before adding new components.
10. Verify the result visually.

## Golden Grid Principle

The agent must not place elements randomly.

For every serious layout task, the agent should first define a flexible composition grid inspired by Golden Ratio / Golden Canon Grid principles.

The grid must help control:

- section structure;
- alignment;
- spacing;
- visual rhythm;
- hierarchy;
- responsive behavior.

The grid must remain flexible across screen sizes.

If the layout changes width, the composition must still preserve its logic.

## Component Library Principle

The agent must not create a new button, color, font, card, icon, arrow, spacing value, shadow, radius, or layout pattern just because it needs one.

First, it must check the project component library.

If the component exists, reuse it.

If a new component or token is needed, the agent must:

1. Explain why the existing library is not enough.
2. Propose the new component/token.
3. Ask the user for approval.
4. Add it only after approval.

## Design Tokens Principle

The agent should use design tokens for:

- colors;
- typography;
- spacing;
- radius;
- shadows;
- borders;
- sizes;
- breakpoints.

Do not invent random CSS values if a token already exists.

If a token is missing, propose it and ask before adding it.

## Visual QA Rule

A design task is not Done until the result is visually checked.

The agent must verify:

- layout alignment;
- responsive behavior;
- visual balance;
- text readability;
- component consistency;
- spacing consistency;
- no random horizontal scroll;
- no distorted photos;
- no stretched logos;
- no unapproved colors;
- no unapproved components;
- no broken hierarchy.

If browser, preview, screenshot, or visual inspection tools are available, use them.

If visual QA is not possible, state the limitation clearly.

## SkillOpt Rule

This repository is intended to work with Microsoft SkillOpt.

Do not treat `SKILL.md` as a random prompt file.

`SKILL.md` is the human-written seed skill.

If SkillOpt optimization is used, the optimized artifact should be saved as:

```text
best_skill.md
```

Do not replace `SKILL.md` with `best_skill.md` automatically.

Before accepting an optimized version, verify that it did not remove or weaken the core rules:

- grid first;
- alignment lines;
- Golden Canon-inspired structure;
- component reuse;
- token discipline;
- approval before new components;
- approval before new colors;
- responsive visual QA;
- no random decoration-first design;
- no distorted photos or logos;
- no Done without visual verification.

If SkillOpt produces a better version, update the repository intentionally:

1. Review `best_skill.md`.
2. Compare it with `SKILL.md`.
3. Check that core principles remain.
4. Keep the better parts.
5. Commit only the reviewed result.

## Expected files

Minimum useful repository structure:

```text
AGENTS.md
README.md
SKILL.md
rubric.md
examples/
```

Optional future files:

```text
best_skill.md
docs/grid-method.md
docs/component-library.md
docs/design-tokens.md
docs/visual-qa.md
examples/good-answer.md
examples/bad-answer.md
```

Do not create many files just to look organized.

Create new files only when they make the skill easier to use, test, or improve.

## Work style

When editing this repository:

1. Keep instructions short and practical.
2. Prefer clear rules over vague design theory.
3. Avoid decorative language.
4. Preserve the core design method.
5. Keep markdown valid.
6. Keep files UTF-8 without BOM.
7. Do not add copyrighted grid files or proprietary assets.
8. Do not claim Golden Canon Grid ownership.
9. Use “Golden Canon-inspired” unless licensed material is explicitly added.

## Final check before commit

Before committing changes, verify:

```text
[ ] AGENTS.md is valid markdown.
[ ] SKILL.md is the main entrypoint.
[ ] README.md explains the project clearly.
[ ] rubric.md exists if evaluation is being prepared.
[ ] No secrets or local credentials are committed.
[ ] No generated junk files are committed.
[ ] Core design rules are still present.
[ ] UTF-8 encoding is preserved.
```
