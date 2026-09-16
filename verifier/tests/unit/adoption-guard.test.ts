import { describe, expect, it } from 'vitest';
import {
  assertAdoptionMutationAllowed,
  type AdoptionChange
} from '../../src/adoption/adoption-guard.js';

const managedChanges: AdoptionChange[] = [
  { path: '.design/manifest.json', ownership: 'managed-state', operation: 'write' },
  { path: 'AGENTS.md', ownership: 'managed-doc', operation: 'write' },
  { path: '.github/workflows/design.yml', ownership: 'ci', operation: 'write' },
  { path: 'package.json', ownership: 'tooling', operation: 'write' }
];

describe('assertAdoptionMutationAllowed', () => {
  it('keeps design audit strictly read-only', () => {
    expect(() => assertAdoptionMutationAllowed('audit', [])).not.toThrow();
    expect(() =>
      assertAdoptionMutationAllowed('audit', [managedChanges[0]!])
    ).toThrow('ADOPTION_AUDIT_READ_ONLY');
  });

  it.each(['init', 'migrate'] as const)(
    '%s may update managed docs/state/tooling/CI',
    (mode) => {
      expect(() => assertAdoptionMutationAllowed(mode, managedChanges)).not.toThrow();
    }
  );

  it.each(['init', 'migrate'] as const)(
    '%s rejects production UI/style/template/component mutations',
    (mode) => {
      const productionChanges: AdoptionChange[] = [
        { path: 'frontend/components/Header.tsx', ownership: 'production-component', operation: 'write' },
        { path: 'frontend/styles/app.css', ownership: 'production-style', operation: 'write' },
        { path: 'backend/views/user/update.php', ownership: 'production-template', operation: 'write' }
      ];

      expect(() => assertAdoptionMutationAllowed(mode, productionChanges)).toThrow(
        'ADOPTION_PRODUCTION_MUTATION_FORBIDDEN'
      );
    }
  );

  it('does not use the adoption guard to block explicit work/redesign modes', () => {
    const production: AdoptionChange[] = [
      { path: 'frontend/components/Header.tsx', ownership: 'production-component', operation: 'write' }
    ];

    expect(() => assertAdoptionMutationAllowed('work', production)).not.toThrow();
    expect(() => assertAdoptionMutationAllowed('redesign', production)).not.toThrow();
  });

  it('rejects unknown project-owned mutations during init instead of guessing they are safe', () => {
    expect(() =>
      assertAdoptionMutationAllowed('init', [
        { path: 'mystery/file.txt', ownership: 'project-other', operation: 'write' }
      ])
    ).toThrow('ADOPTION_UNMANAGED_MUTATION_FORBIDDEN');
  });
});
