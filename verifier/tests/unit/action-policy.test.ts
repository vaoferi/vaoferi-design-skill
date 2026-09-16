import { describe, expect, it } from 'vitest';
import { evaluateActionPolicy } from '../../src/admin/action-policy.js';
import type { InteractionTopology } from '../../src/admin/interaction-topology.js';

function topologyWith(actions: InteractionTopology['actions']): InteractionTopology {
  return {
    scopeId: 'admin',
    profile: 'admin-dense',
    zones: [
      { id: 'form', role: 'primary-form', fieldGroups: [] },
      { id: 'table', role: 'table', fieldGroups: [] },
      { id: 'danger', role: 'danger-zone', fieldGroups: [] }
    ],
    saveScopes: [],
    actions
  };
}

describe('evaluateActionPolicy', () => {
  it('accepts explicit page, section, row, bulk and danger action regions', () => {
    const result = evaluateActionPolicy(
      topologyWith([
        { id: 'save', role: 'primary', region: 'page-actions', groupId: 'page-main' },
        {
          id: 'reset-section',
          role: 'secondary',
          region: 'section-actions',
          zoneId: 'form',
          groupId: 'form-tools'
        },
        {
          id: 'edit-row',
          role: 'row',
          region: 'row-actions',
          zoneId: 'table',
          groupId: 'row-tools'
        },
        {
          id: 'export-selected',
          role: 'bulk',
          region: 'bulk-actions',
          zoneId: 'table',
          groupId: 'bulk-tools'
        },
        {
          id: 'delete-account',
          role: 'dangerous-destructive',
          region: 'danger-zone',
          zoneId: 'danger',
          groupId: 'danger-tools'
        }
      ])
    );

    expect(result).toEqual([]);
  });

  it('flags multiple visually-equal primary page actions', () => {
    const result = evaluateActionPolicy(
      topologyWith([
        { id: 'save', role: 'primary', region: 'page-actions', groupId: 'page-main' },
        { id: 'publish', role: 'primary', region: 'page-actions', groupId: 'page-main' }
      ])
    );

    expect(result).toContain('MULTIPLE_PAGE_PRIMARY_ACTIONS');
  });

  it('flags destructive and routine actions mixed in the same action group', () => {
    const result = evaluateActionPolicy(
      topologyWith([
        {
          id: 'save',
          role: 'primary',
          region: 'section-actions',
          zoneId: 'form',
          groupId: 'mixed'
        },
        {
          id: 'delete',
          role: 'destructive',
          region: 'section-actions',
          zoneId: 'form',
          groupId: 'mixed'
        }
      ])
    );

    expect(result).toContain('DESTRUCTIVE_ROUTINE_ACTION_MIX:mixed');
  });

  it('flags section/row/bulk actions without a local zone', () => {
    const result = evaluateActionPolicy(
      topologyWith([
        { id: 'section', role: 'secondary', region: 'section-actions', groupId: 's' },
        { id: 'row', role: 'row', region: 'row-actions', groupId: 'r' },
        { id: 'bulk', role: 'bulk', region: 'bulk-actions', groupId: 'b' }
      ])
    );

    expect(result).toEqual(
      expect.arrayContaining([
        'ACTION_REGION_ORPHANED:section',
        'ACTION_REGION_ORPHANED:row',
        'ACTION_REGION_ORPHANED:bulk'
      ])
    );
  });

  it('requires dangerous-destructive actions to live in the danger zone', () => {
    const result = evaluateActionPolicy(
      topologyWith([
        {
          id: 'delete-account',
          role: 'dangerous-destructive',
          region: 'page-actions',
          groupId: 'page-main'
        }
      ])
    );

    expect(result).toContain('DANGEROUS_ACTION_OUTSIDE_DANGER_ZONE:delete-account');
  });

  it('requires bulk actions to use the bulk-actions region', () => {
    const result = evaluateActionPolicy(
      topologyWith([
        {
          id: 'export-selected',
          role: 'bulk',
          region: 'page-actions',
          zoneId: 'table',
          groupId: 'bulk-tools'
        }
      ])
    );

    expect(result).toContain('BULK_ACTION_REGION_INVALID:export-selected');
  });
});
