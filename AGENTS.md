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

Do not switch to `C:\Users\vaoferi` for this repository unless the user explicitly asks.

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
Do not commit secrets, tokens, cookies, `.env`, private keys, or generated cache files.
