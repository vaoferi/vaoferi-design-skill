import interactionTopologySchema from '../../../schemas/interaction-topology.schema.json' with { type: 'json' };
import { AjvSchemaValidator } from '../adapters/ajv-schema-validator.js';

export type AdminProfile = 'admin-standard' | 'admin-dense';

export type AdminZoneRole =
  | 'summary'
  | 'status'
  | 'identity'
  | 'primary-form'
  | 'secondary-form'
  | 'related-data'
  | 'table'
  | 'history'
  | 'metadata'
  | 'actions'
  | 'danger-zone'
  | 'custom';

export type AdminActionRole =
  | 'primary'
  | 'secondary'
  | 'contextual'
  | 'row'
  | 'bulk'
  | 'navigation'
  | 'destructive'
  | 'dangerous-destructive';

export type AdminActionRegion =
  | 'page-actions'
  | 'section-actions'
  | 'row-actions'
  | 'bulk-actions'
  | 'danger-zone';

export interface InteractionFieldGroup {
  id: string;
  fields: string[];
  saveScopeId?: string;
}

export interface InteractionZone {
  id: string;
  role: AdminZoneRole;
  fieldGroups: InteractionFieldGroup[];
}

export interface InteractionSaveScope {
  id: string;
  zoneIds: string[];
}

export interface InteractionAction {
  id: string;
  role: AdminActionRole;
  region: AdminActionRegion;
  zoneId?: string;
  groupId: string;
}

export interface InteractionTopology {
  scopeId: string;
  profile: AdminProfile;
  zones: InteractionZone[];
  saveScopes: InteractionSaveScope[];
  actions: InteractionAction[];
}

export interface InteractionTopologyValidationOptions {
  required: boolean;
}

export interface InteractionTopologyValidationResult {
  valid: boolean;
  violations: string[];
}

const validator = new AjvSchemaValidator();

function duplicateIds(items: Array<{ id: string }>, prefix: string): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }

  return [...duplicates].map((id) => `${prefix}:${id}`);
}

export function validateInteractionTopology(
  topology: InteractionTopology | null,
  options: InteractionTopologyValidationOptions
): InteractionTopologyValidationResult {
  if (topology === null) {
    return options.required
      ? { valid: false, violations: ['INTERACTION_TOPOLOGY_REQUIRED'] }
      : { valid: true, violations: [] };
  }

  const schemaResult = validator.validate(
    interactionTopologySchema as Record<string, unknown>,
    topology
  );

  const violations: string[] = [];

  if (!schemaResult.valid) {
    for (const violation of schemaResult.violations) {
      violations.push(
        `INTERACTION_TOPOLOGY_SCHEMA_INVALID:${violation.instancePath || '/'}:${violation.keyword}`
      );
    }
  }

  violations.push(...duplicateIds(topology.zones, 'DUPLICATE_ZONE_ID'));
  violations.push(...duplicateIds(topology.saveScopes, 'DUPLICATE_SAVE_SCOPE_ID'));
  violations.push(...duplicateIds(topology.actions, 'DUPLICATE_ACTION_ID'));

  const fieldGroups = topology.zones.flatMap((zone) => zone.fieldGroups);
  violations.push(...duplicateIds(fieldGroups, 'DUPLICATE_FIELD_GROUP_ID'));

  const zoneIds = new Set(topology.zones.map((zone) => zone.id));
  const saveScopeIds = new Set(topology.saveScopes.map((saveScope) => saveScope.id));

  for (const saveScope of topology.saveScopes) {
    for (const zoneId of saveScope.zoneIds) {
      if (!zoneIds.has(zoneId)) {
        violations.push(`SAVE_SCOPE_ZONE_UNKNOWN:${saveScope.id}:${zoneId}`);
      }
    }
  }

  for (const fieldGroup of fieldGroups) {
    if (fieldGroup.saveScopeId && !saveScopeIds.has(fieldGroup.saveScopeId)) {
      violations.push(
        `FIELD_GROUP_SAVE_SCOPE_UNKNOWN:${fieldGroup.id}:${fieldGroup.saveScopeId}`
      );
    }
  }

  for (const action of topology.actions) {
    if (action.zoneId && !zoneIds.has(action.zoneId)) {
      violations.push(`ACTION_ZONE_UNKNOWN:${action.id}:${action.zoneId}`);
    }
  }

  return {
    valid: violations.length === 0,
    violations
  };
}
