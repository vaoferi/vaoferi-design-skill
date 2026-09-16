import { describe, expect, it } from 'vitest';
import {
  validateInteractionTopology,
  type InteractionTopology
} from '../../src/admin/interaction-topology.js';

const validTopology: InteractionTopology = {
  scopeId: 'admin',
  profile: 'admin-dense',
  zones: [
    {
      id: 'summary',
      role: 'summary',
      fieldGroups: []
    },
    {
      id: 'identity',
      role: 'primary-form',
      fieldGroups: [
        {
          id: 'identity-fields',
          fields: ['name', 'email'],
          saveScopeId: 'main-save'
        }
      ]
    },
    {
      id: 'users-table',
      role: 'table',
      fieldGroups: []
    },
    {
      id: 'danger',
      role: 'danger-zone',
      fieldGroups: []
    }
  ],
  saveScopes: [
    {
      id: 'main-save',
      zoneIds: ['identity']
    }
  ],
  actions: [
    {
      id: 'save',
      role: 'primary',
      region: 'page-actions',
      groupId: 'page-main'
    },
    {
      id: 'edit-row',
      role: 'row',
      region: 'row-actions',
      zoneId: 'users-table',
      groupId: 'row-default'
    },
    {
      id: 'delete',
      role: 'dangerous-destructive',
      region: 'danger-zone',
      zoneId: 'danger',
      groupId: 'danger-actions'
    }
  ]
};

describe('validateInteractionTopology', () => {
  it('accepts a structured admin topology with explicit zones, field groups, save scopes and actions', () => {
    expect(validateInteractionTopology(validTopology, { required: true })).toEqual({
      valid: true,
      violations: []
    });
  });

  it('reports missing topology when the complexity gate requires one', () => {
    expect(validateInteractionTopology(null, { required: true })).toEqual({
      valid: false,
      violations: ['INTERACTION_TOPOLOGY_REQUIRED']
    });
  });

  it('allows no topology when the complexity gate says it is not required', () => {
    expect(validateInteractionTopology(null, { required: false })).toEqual({
      valid: true,
      violations: []
    });
  });

  it('rejects references to unknown zones and save scopes', () => {
    const broken: InteractionTopology = {
      ...validTopology,
      saveScopes: [{ id: 'main-save', zoneIds: ['missing-zone'] }],
      zones: [
        ...validTopology.zones.slice(0, 1),
        {
          id: 'identity',
          role: 'primary-form',
          fieldGroups: [
            {
              id: 'identity-fields',
              fields: ['name'],
              saveScopeId: 'missing-save'
            }
          ]
        }
      ],
      actions: [
        {
          id: 'edit-row',
          role: 'row',
          region: 'row-actions',
          zoneId: 'missing-zone',
          groupId: 'row-default'
        }
      ]
    };

    const result = validateInteractionTopology(broken, { required: true });

    expect(result.valid).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        'SAVE_SCOPE_ZONE_UNKNOWN:main-save:missing-zone',
        'FIELD_GROUP_SAVE_SCOPE_UNKNOWN:identity-fields:missing-save',
        'ACTION_ZONE_UNKNOWN:edit-row:missing-zone'
      ])
    );
  });

  it('rejects duplicate semantic ids even when object shapes differ', () => {
    const duplicate: InteractionTopology = {
      ...validTopology,
      zones: [
        ...validTopology.zones,
        { id: 'summary', role: 'metadata', fieldGroups: [] }
      ]
    };

    expect(validateInteractionTopology(duplicate, { required: true }).violations).toContain(
      'DUPLICATE_ZONE_ID:summary'
    );
  });
});
