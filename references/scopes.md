# Design Scopes v1.2

Scope routing runs before staged UI work. The resolver decides which local design contract and profile apply before the agent may make frame, spacing, component, visual, or responsive decisions.

## Resolution Priority

Canonical priority:

```text
explicit scope > path mapping > route mapping
```

Resolution is fail-closed:

- exactly one matching scope -> resolve it;
- no matching scope -> BLOCKED unless the task supplies an explicit valid scope;
- ambiguous or overlapping matches -> BLOCKED;
- visual appearance, file naming style, or agent intuition must never infer a scope.

Shared UI is legal only through an **explicit shared scope mapping**: explicit scope selection, a dedicated shared path mapping, or a dedicated shared route mapping. A file that happens to be reused by multiple surfaces is not automatically shared. `sharedWith` describes compatibility/relationships after ownership is resolved; it is not a routing fallback.

## Scope-Local Contracts

Each scope loads its own contract from `.design/scopes/<scopeId>/contract.json`. Palette, density, tokens, component policy, responsive rules, and profile are local to that scope unless an explicit shared contract source is declared.

Do not copy frontend rules into admin, or admin rules into frontend, merely because both live in the same repository. Scope isolation is part of correctness.

Compact preflight records at least:

```text
scope=<scopeId|BLOCKED>
profile=<profile>
contractVersion=<version>
```

## Multi-Scope Tasks

A multi-scope task resolves every touched path independently, loads each resolved scope contract independently, and verifies each scope independently.

Aggregate status is PASS only when every required scope is PASS. A FAIL or BLOCKED scope prevents aggregate PASS.

When one changed file maps to multiple scopes and no explicit shared ownership exists, resolution is ambiguous and therefore BLOCKED. Do not choose the visually closest scope and do not silently split ownership.

## Profiles

Profiles describe behavior within a resolved scope; they do not replace scope resolution. Examples include ordinary frontend profiles and the admin-specific `admin-standard` and `admin-dense` profiles.

Only load profile-specific references after the scope is resolved. For admin profiles, load `references/admin-workspace.md`.
