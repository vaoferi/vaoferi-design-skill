# Component Sources

Цей файл визначає, звідки агент бере елементи, патерни і primitives.

## Source Order

1. Existing product UI and `DESIGN.md`.
2. Existing tokens and components in the current project.
3. Existing dependencies already installed in the project.
4. Local snippets source from NLM config.
5. User-provided references, screenshots, brand docs.
6. External pattern references listed below.
7. New component/token proposal with approval.

Не переставляй цей порядок без причини.

## NLM Snippets Source

Local source:

```text
\\NAS\homes\vaoferi\Work\nlm\public_html\config\config\mcp-snippets.config.json
```

Validate before relying on it:

```bash
python scripts/validate_snippets_source.py
```

Expected enabled libraries today:

- `bootstrap`;
- `bulma`;
- `shoelace`;
- `bootstrap-icons` through the `bootstrap.iconsNpm` field.

Rules:

- snippets are component vocabulary, not automatic visual authority;
- map snippets to project tokens, spacing mode, radius, color roles and accessibility rules;
- do not add a new snippets library without approval;
- if the config is missing or invalid, report the blocker and continue with project-local sources.

Known implementation detail: the NLM snippets server reads `config/mcp-snippets.config.json` relative to its own script/CWD, so client-side environment variables alone may not update the server catalog.

## External Patterns Borrowed

Use these as patterns, not as mandatory dependencies.

### `brijr/craft`

Borrow:

- small layout primitives: `Layout`, `Main`, `Section`, `Container`, `Nav`;
- semantic section/container separation;
- responsive layout as a first-class primitive;
- prose/content handling as part of the system.

Do not copy its visual style into an existing product unless it matches the product.

### `brijr/components`

Borrow:

- copy/paste component discipline;
- shadcn/Tailwind-compatible component vocabulary;
- type-safe component examples;
- component library as source before invention.

Use it only after checking project components and tokens.

### Anthropic Skills And Matt Pocock Skills

Borrow:

- short `SKILL.md` entrypoints;
- folderized references/examples/scripts;
- progressive disclosure instead of one giant prompt;
- deterministic scripts for repeated checks.

### `VoltAgent/awesome-design-md`

Borrow:

- `DESIGN.md` as a plain Markdown design contract;
- no special parser requirement;
- agents should read design intent from project files, not infer style from thin air.

### `bergside/awesome-design-skills`

Borrow:

- paired `SKILL.md` + `DESIGN.md`;
- explicit brand/style foundations;
- component families;
- accessibility rules;
- quality gates and do/don't rules.

### `DesignPatternsPHP`

Borrow:

- pattern choice must be based on the problem and tradeoffs;
- naming a pattern is not enough;
- document when to use a pattern and when not to use it.

For UI this means: do not add a new layout/component pattern unless the current problem actually needs it.
