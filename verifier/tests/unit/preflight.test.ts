import { describe, expect, it } from 'vitest';
import {
  buildPreflight,
  formatPreflight,
  type PreflightTrigger
} from '../../src/lifecycle/preflight.js';

const triggers: PreflightTrigger[] = [
  'task-start',
  'context-compaction',
  'context-restart',
  'stage-transition'
];

describe('design preflight', () => {
  it.each(triggers)('refreshes hard invariants for %s', (trigger) => {
    const snapshot = buildPreflight({
      contractVersion: '1.1',
      stage: 'align',
      browserGate: 'READY',
      relevantExceptions: ['IMP-1'],
      trigger
    });

    expect(snapshot).toEqual({
      trigger,
      contractVersion: '1.1',
      stage: 'align',
      importantPolicy: 'ENFORCED',
      changedFilesPolicy: 'STRICT',
      browserGate: 'READY',
      relevantExceptions: ['IMP-1'],
      canProceed: true
    });
  });

  it('formats only the compact invariant snapshot, not a long prose policy', () => {
    const output = formatPreflight(
      buildPreflight({
        contractVersion: '1.1',
        stage: 'responsive',
        browserGate: 'READY',
        relevantExceptions: ['IMP-1', 'LEGACY-2'],
        trigger: 'context-compaction'
      })
    );

    expect(output).toBe(
      [
        'contractVersion=1.1',
        'stage=responsive',
        'importantPolicy=ENFORCED',
        'changedFilesPolicy=STRICT',
        'browserGate=READY',
        'relevantExceptions=[IMP-1,LEGACY-2]',
        'canProceed=true'
      ].join('\n')
    );
  });

  it('blocks browser-required stages when the browser gate is BLOCKED', () => {
    const snapshot = buildPreflight({
      contractVersion: '1.1',
      stage: 'verify',
      browserGate: 'BLOCKED',
      relevantExceptions: [],
      trigger: 'stage-transition'
    });

    expect(snapshot.canProceed).toBe(false);
    expect(snapshot.blockedReason).toBe('BROWSER_VERIFICATION_BLOCKED');
  });

  it('does not let INSTALLABLE masquerade as READY for browser-required stages', () => {
    const snapshot = buildPreflight({
      contractVersion: '1.1',
      stage: 'responsive',
      browserGate: 'INSTALLABLE',
      relevantExceptions: [],
      trigger: 'task-start'
    });

    expect(snapshot.canProceed).toBe(false);
    expect(snapshot.blockedReason).toBe('BROWSER_VERIFICATION_INSTALL_REQUIRED');
  });

  it('normalizes and sorts relevant exception ids for deterministic output', () => {
    const snapshot = buildPreflight({
      contractVersion: '1.1',
      stage: 'frame',
      browserGate: 'READY',
      relevantExceptions: [' Z-2 ', 'A-1', 'A-1', ''],
      trigger: 'task-start'
    });

    expect(snapshot.relevantExceptions).toEqual(['A-1', 'Z-2']);
  });

  it('keeps frontend and admin scope summaries isolated in one multi-scope preflight', () => {
    const snapshot = buildPreflight({
      contractVersion: '1.2',
      stage: 'place',
      browserGate: 'READY',
      relevantExceptions: [],
      trigger: 'task-start',
      scopeIds: ['frontend', 'admin', 'frontend'],
      profiles: {
        frontend: 'public-content',
        admin: 'admin-dense'
      },
      scopeContracts: {
        frontend: 'frontend@1.2',
        admin: 'admin@1.2'
      },
      complexityGate: 'REQUIRED'
    });

    expect(snapshot.scopeIds).toEqual(['admin', 'frontend']);
    expect(snapshot.profiles).toEqual({
      admin: 'admin-dense',
      frontend: 'public-content'
    });
    expect(snapshot.scopeContracts).toEqual({
      admin: 'admin@1.2',
      frontend: 'frontend@1.2'
    });
    expect(snapshot.complexityGate).toBe('REQUIRED');

    expect(formatPreflight(snapshot)).toContain(
      'scopeIds=[admin,frontend]\nprofiles=[admin:admin-dense,frontend:public-content]\nscopeContracts=[admin:admin@1.2,frontend:frontend@1.2]\ncomplexityGate=REQUIRED'
    );
  });
});
