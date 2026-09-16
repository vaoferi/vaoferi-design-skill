import type { InteractionAction, InteractionTopology } from './interaction-topology.js';

function isDestructive(action: InteractionAction): boolean {
  return action.role === 'destructive' || action.role === 'dangerous-destructive';
}

function requiresLocalZone(action: InteractionAction): boolean {
  return (
    action.region === 'section-actions' ||
    action.region === 'row-actions' ||
    action.region === 'bulk-actions'
  );
}

export function evaluateActionPolicy(topology: InteractionTopology): string[] {
  const violations: string[] = [];

  const pagePrimaries = topology.actions.filter(
    (action) => action.role === 'primary' && action.region === 'page-actions'
  );

  if (pagePrimaries.length > 1) {
    violations.push('MULTIPLE_PAGE_PRIMARY_ACTIONS');
  }

  const actionsByGroup = new Map<string, InteractionAction[]>();
  for (const action of topology.actions) {
    const group = actionsByGroup.get(action.groupId) ?? [];
    group.push(action);
    actionsByGroup.set(action.groupId, group);

    if (requiresLocalZone(action) && !action.zoneId) {
      violations.push(`ACTION_REGION_ORPHANED:${action.id}`);
    }

    if (
      action.role === 'dangerous-destructive' &&
      action.region !== 'danger-zone'
    ) {
      violations.push(`DANGEROUS_ACTION_OUTSIDE_DANGER_ZONE:${action.id}`);
    }

    if (action.role === 'bulk' && action.region !== 'bulk-actions') {
      violations.push(`BULK_ACTION_REGION_INVALID:${action.id}`);
    }
  }

  for (const [groupId, actions] of actionsByGroup) {
    const hasDestructive = actions.some(isDestructive);
    const hasRoutine = actions.some((action) => !isDestructive(action));

    if (hasDestructive && hasRoutine) {
      violations.push(`DESTRUCTIVE_ROUTINE_ACTION_MIX:${groupId}`);
    }
  }

  return violations;
}
