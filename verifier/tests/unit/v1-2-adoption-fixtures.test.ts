import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  resolveDesignScopes,
  type DesignScope
} from '../../src/scopes/scope-resolver.js';
import { loadScopeContract } from '../../src/scopes/scope-contract.js';
import {
  assertAdoptionMutationAllowed,
  type AdoptionChange
} from '../../src/adoption/adoption-guard.js';
import {
  evaluateAdminComplexity,
  type AdminComplexityInput
} from '../../src/admin/complexity.js';
import { validateInteractionTopology } from '../../src/admin/interaction-topology.js';
import { createEvidenceReport } from '../../src/report/evidence.js';

function fixtureRoot(relativePath: string): string {
  return fileURLToPath(new URL(`../fixtures/${relativePath}/`, import.meta.url));
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

describe('v1.2 controlled adoption and multi-scope fixtures', () => {
  it('keeps frontend and admin scope resolution/contracts isolated', async () => {
    const root = fixtureRoot('scopes/frontend-admin');
    const project = readJson<{ scopes: DesignScope[] }>(
      join(root, '.design', 'project-design.json')
    );

    const resolution = resolveDesignScopes({
      touchedFiles: ['frontend/pages/home.tsx', 'backend/views/user/update.php'],
      routes: [],
      scopes: project.scopes
    });

    expect(resolution).toEqual({
      status: 'RESOLVED',
      scopeIds: ['admin', 'frontend'],
      resolution: 'path'
    });

    const [frontend, admin] = await Promise.all([
      loadScopeContract(root, 'frontend'),
      loadScopeContract(root, 'admin')
    ]);

    expect(frontend).toMatchObject({
      scopeId: 'frontend',
      profile: 'public-content',
      density: 'comfortable'
    });
    expect(admin).toMatchObject({
      scopeId: 'admin',
      profile: 'admin-dense',
      density: 'dense'
    });
    expect(frontend.tokens).not.toEqual(admin.tokens);
  });

  it('blocks an ambiguous shared UI file instead of inheriting either visual system', () => {
    const root = fixtureRoot('scopes/ambiguous');
    const project = readJson<{ scopes: DesignScope[] }>(
      join(root, '.design', 'project-design.json')
    );

    expect(
      resolveDesignScopes({
        touchedFiles: ['src/ui/Button.tsx'],
        routes: [],
        scopes: project.scopes
      })
    ).toEqual({
      status: 'AMBIGUOUS',
      candidates: ['admin', 'frontend'],
      subject: 'src/ui/Button.tsx'
    });
  });

  it('proves init adoption leaves representative production UI byte-for-byte unchanged', () => {
    const root = fixtureRoot('adoption/no-redesign');
    const before = readFileSync(join(root, 'production-ui.before.tsx'), 'utf8');
    const after = readFileSync(join(root, 'production-ui.after.tsx'), 'utf8');
    const changes = readJson<AdoptionChange[]>(join(root, 'allowed-changes.json'));

    expect(() => assertAdoptionMutationAllowed('init', changes)).not.toThrow();
    expect(after).toBe(before);
  });

  it('requires interaction topology for the dense admin fixture before frame work', () => {
    const root = fixtureRoot('scopes/frontend-admin');
    const input = readJson<AdminComplexityInput>(
      join(root, 'admin-complexity.json')
    );
    const complexity = evaluateAdminComplexity(input);

    expect(complexity.requiresTopology).toBe(true);
    expect(validateInteractionTopology(null, { required: complexity.requiresTopology })).toEqual({
      valid: false,
      violations: ['INTERACTION_TOPOLOGY_REQUIRED']
    });
  });

  it('never reports aggregate PASS when one required scope FAILs or is BLOCKED', () => {
    const failed = createEvidenceReport({
      contractVersion: '1.2',
      stage: 'verify',
      scope: 'full',
      generatedAt: '2026-09-16T00:00:00.000Z',
      gates: [
        { name: 'scope:frontend', status: 'PASS', required: true },
        { name: 'scope:admin', status: 'FAIL', required: true }
      ]
    });
    const blocked = createEvidenceReport({
      contractVersion: '1.2',
      stage: 'verify',
      scope: 'full',
      generatedAt: '2026-09-16T00:00:00.000Z',
      gates: [
        { name: 'scope:frontend', status: 'PASS', required: true },
        { name: 'scope:admin', status: 'BLOCKED', required: true }
      ]
    });

    expect(failed.finalStatus).toBe('FAIL');
    expect(blocked.finalStatus).toBe('BLOCKED');
  });
});
