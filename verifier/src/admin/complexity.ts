export interface AdminComplexityInput {
  forms: number;
  editableControls: number;
  actions: number;
  destructiveActions: number;
  independentRegions: number;
  repeatedCollections: number;
  saveScopes: number;
  longVerticalControlChain: number;
}

export type AdminComplexityHardTrigger =
  | 'MULTIPLE_SAVE_SCOPES_WITH_DESTRUCTIVE_ACTIONS'
  | 'EXTREME_VERTICAL_CONTROL_CHAIN';

export interface AdminComplexityResult {
  score: number;
  threshold: number;
  hardTriggers: AdminComplexityHardTrigger[];
  requiresTopology: boolean;
}

const TOPOLOGY_THRESHOLD = 40;
const EXTREME_VERTICAL_CHAIN_THRESHOLD = 24;

const WEIGHTS = {
  forms: 3,
  editableControls: 0.5,
  actions: 0.4,
  destructiveActions: 2.5,
  independentRegions: 2,
  repeatedCollections: 2,
  additionalSaveScopes: 3,
  verticalChainBeyondBaseline: 0.5
} as const;

function assertNonNegativeInteger(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`ADMIN_COMPLEXITY_INPUT_INVALID:${name}`);
  }
}

export function evaluateAdminComplexity(
  input: AdminComplexityInput
): AdminComplexityResult {
  for (const [name, value] of Object.entries(input)) {
    assertNonNegativeInteger(name, value);
  }

  const hardTriggers: AdminComplexityHardTrigger[] = [];

  if (input.saveScopes > 1 && input.destructiveActions > 0) {
    hardTriggers.push('MULTIPLE_SAVE_SCOPES_WITH_DESTRUCTIVE_ACTIONS');
  }

  if (input.longVerticalControlChain >= EXTREME_VERTICAL_CHAIN_THRESHOLD) {
    hardTriggers.push('EXTREME_VERTICAL_CONTROL_CHAIN');
  }

  const score =
    input.forms * WEIGHTS.forms +
    input.editableControls * WEIGHTS.editableControls +
    input.actions * WEIGHTS.actions +
    input.destructiveActions * WEIGHTS.destructiveActions +
    input.independentRegions * WEIGHTS.independentRegions +
    input.repeatedCollections * WEIGHTS.repeatedCollections +
    Math.max(input.saveScopes - 1, 0) * WEIGHTS.additionalSaveScopes +
    Math.max(input.longVerticalControlChain - 12, 0) *
      WEIGHTS.verticalChainBeyondBaseline;

  return {
    score,
    threshold: TOPOLOGY_THRESHOLD,
    hardTriggers,
    requiresTopology: score >= TOPOLOGY_THRESHOLD || hardTriggers.length > 0
  };
}
