export type AdoptionMode = 'audit' | 'init' | 'migrate' | 'work' | 'redesign';

export type AdoptionOwnership =
  | 'managed-state'
  | 'managed-doc'
  | 'ci'
  | 'tooling'
  | 'production-component'
  | 'production-style'
  | 'production-template'
  | 'production-ui'
  | 'project-other';

export type AdoptionOperation = 'write' | 'create' | 'delete';

export interface AdoptionChange {
  path: string;
  ownership: AdoptionOwnership;
  operation: AdoptionOperation;
}

const SAFE_ADOPTION_OWNERSHIP = new Set<AdoptionOwnership>([
  'managed-state',
  'managed-doc',
  'ci',
  'tooling'
]);

const PRODUCTION_OWNERSHIP = new Set<AdoptionOwnership>([
  'production-component',
  'production-style',
  'production-template',
  'production-ui'
]);

export function assertAdoptionMutationAllowed(
  mode: AdoptionMode,
  changes: AdoptionChange[]
): void {
  if (mode === 'audit') {
    if (changes.length > 0) {
      throw new Error('ADOPTION_AUDIT_READ_ONLY');
    }
    return;
  }

  if (mode === 'work' || mode === 'redesign') {
    return;
  }

  for (const change of changes) {
    if (PRODUCTION_OWNERSHIP.has(change.ownership)) {
      throw new Error('ADOPTION_PRODUCTION_MUTATION_FORBIDDEN');
    }

    if (!SAFE_ADOPTION_OWNERSHIP.has(change.ownership)) {
      throw new Error('ADOPTION_UNMANAGED_MUTATION_FORBIDDEN');
    }
  }
}
