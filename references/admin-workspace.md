# Admin Workspace v1.2

Read this reference only after scope resolution selects an admin profile. It applies to `admin-standard` and `admin-dense`; it must not leak admin density or action policy into unrelated frontend scopes.

## Complexity Gate

Not every admin screen needs a full topology contract. Run the deterministic admin complexity gate first.

A simple screen may proceed without a dedicated topology when the gate says topology is not required. A complex screen must define and validate Interaction Topology before structural implementation continues.

Complexity is based on the combination of forms, fields, independent regions, save scopes, repeated collections, destructive actions, and related controls. Raw button count by itself is not a complexity verdict.

## Interaction Topology

Interaction Topology describes operational structure, not visual taste. It records:

- zones and their roles;
- field groups;
- save scopes;
- actions, action roles, and their regions.

Every topology must pass schema and semantic validation. References to unknown zones or save scopes are invalid. Significant actions must have explicit operational ownership.

## Action Hierarchy

Canonical action regions are:

- `page-actions` — page-level primary/secondary actions;
- `section-actions` — actions owned by one section or save scope;
- `row-actions` — record-level actions;
- `bulk-actions` — actions operating on a selected collection;
- `danger-zone` — dangerous destructive operations.

Do not mix routine and destructive actions into one operational group. Dangerous destructive actions belong in `danger-zone`. A complex workspace should not manufacture multiple competing page-primary actions.

## Density Profiles

`admin-standard` uses normal administrative density while retaining explicit topology when complexity requires it.

`admin-dense` permits higher information density, tighter legal rhythm, and more simultaneous operational regions. It does not weaken scope ownership, action hierarchy, responsive safety, destructive-action separation, or verification requirements.

Density is never permission to create one unstructured vertical chain of controls.

## Rendered Verification

For admin work that requires browser verification, deterministic rendered checks may enforce:

- no horizontal overflow across the configured continuous viewport interval;
- declared action regions remain measurable when required;
- critical actions are not accidentally hidden;
- unstructured form chains do not exceed the configured contract threshold;
- destructive and routine actions are not measurably mixed in the same action group.

These checks use explicit verifier hooks and geometry. They do not attempt to score whether the admin screen is aesthetically attractive.

## Relationship to Stages

Topology is a prerequisite contract for complex admin work, not a replacement for `/frame`, `/rhythm`, `/place`, `/align`, `/flow`, `/responsive`, or `/verify`. If topology exposes a macro-layout defect, reopen the owning structural stage rather than patching it from a later visual stage.
