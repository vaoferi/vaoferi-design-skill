import { describe, expect, it } from 'vitest';
import {
  evaluateAdminComplexity,
  type AdminComplexityInput
} from '../../src/admin/complexity.js';

function baseInput(overrides: Partial<AdminComplexityInput> = {}): AdminComplexityInput {
  return {
    forms: 1,
    editableControls: 6,
    actions: 2,
    destructiveActions: 0,
    independentRegions: 1,
    repeatedCollections: 0,
    saveScopes: 1,
    longVerticalControlChain: 6,
    ...overrides
  };
}

describe('evaluateAdminComplexity', () => {
  it('does not require interaction topology for a simple admin form', () => {
    const result = evaluateAdminComplexity(baseInput());

    expect(result.requiresTopology).toBe(false);
    expect(result.hardTriggers).toEqual([]);
    expect(result.score).toBeLessThan(result.threshold);
  });

  it('requires topology for a genuinely dense operational page', () => {
    const result = evaluateAdminComplexity(
      baseInput({
        forms: 10,
        editableControls: 100,
        actions: 34,
        destructiveActions: 3,
        independentRegions: 9,
        repeatedCollections: 5,
        saveScopes: 5,
        longVerticalControlChain: 28
      })
    );

    expect(result.requiresTopology).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(result.threshold);
  });

  it('uses multiple save scopes plus destructive actions as a hard trigger even below score threshold', () => {
    const result = evaluateAdminComplexity(
      baseInput({
        forms: 1,
        editableControls: 3,
        actions: 3,
        destructiveActions: 1,
        independentRegions: 1,
        repeatedCollections: 0,
        saveScopes: 2,
        longVerticalControlChain: 3
      })
    );

    expect(result.score).toBeLessThan(result.threshold);
    expect(result.hardTriggers).toContain('MULTIPLE_SAVE_SCOPES_WITH_DESTRUCTIVE_ACTIONS');
    expect(result.requiresTopology).toBe(true);
  });

  it('does not classify a coherent page as complex just because it has many lightweight row actions', () => {
    const result = evaluateAdminComplexity(
      baseInput({
        forms: 1,
        editableControls: 4,
        actions: 20,
        destructiveActions: 0,
        independentRegions: 1,
        repeatedCollections: 1,
        saveScopes: 1,
        longVerticalControlChain: 4
      })
    );

    expect(result.requiresTopology).toBe(false);
    expect(result.hardTriggers).toEqual([]);
    expect(result.score).toBeLessThan(result.threshold);
  });

  it('forces topology for an extreme unstructured vertical control chain', () => {
    const result = evaluateAdminComplexity(
      baseInput({
        forms: 1,
        editableControls: 30,
        actions: 2,
        independentRegions: 1,
        longVerticalControlChain: 30
      })
    );

    expect(result.hardTriggers).toContain('EXTREME_VERTICAL_CONTROL_CHAIN');
    expect(result.requiresTopology).toBe(true);
  });
});
