import { describe, expect, it } from 'vitest';
import {
  evaluateBaselineRatchet,
  type BaselineEntry,
  type PolicyViolation
} from '../../src/policy/baseline.js';

const legacy: BaselineEntry = {
  rule: 'declaration-no-important',
  file: 'src/legacy.css',
  line: 1,
  column: 22
};

describe('evaluateBaselineRatchet', () => {
  it('keeps an existing debt item as legacy-baselined', () => {
    const current: PolicyViolation[] = [legacy];

    const result = evaluateBaselineRatchet({
      previousBaseline: [legacy],
      proposedBaseline: [legacy],
      currentViolations: current
    });

    expect(result.states).toContainEqual({
      ...legacy,
      state: 'legacy-baselined'
    });
    expect(result.hasRegression).toBe(false);
  });

  it('classifies a new authored violation as new-violation', () => {
    const fresh: PolicyViolation = {
      rule: 'declaration-no-important',
      file: 'src/card.css',
      line: 2,
      column: 18
    };

    const result = evaluateBaselineRatchet({
      previousBaseline: [legacy],
      proposedBaseline: [legacy],
      currentViolations: [legacy, fresh]
    });

    expect(result.states).toContainEqual({
      ...fresh,
      state: 'new-violation'
    });
    expect(result.hasRegression).toBe(false);
  });

  it('marks removed legacy debt as fixed-legacy', () => {
    const result = evaluateBaselineRatchet({
      previousBaseline: [legacy],
      proposedBaseline: [],
      currentViolations: []
    });

    expect(result.states).toContainEqual({
      ...legacy,
      state: 'fixed-legacy'
    });
    expect(result.hasRegression).toBe(false);
  });

  it('rejects silent baseline expansion as baseline-regression', () => {
    const fresh: BaselineEntry = {
      rule: 'declaration-no-important',
      file: 'src/card.css',
      line: 2,
      column: 18
    };

    const result = evaluateBaselineRatchet({
      previousBaseline: [legacy],
      proposedBaseline: [legacy, fresh],
      currentViolations: [legacy, fresh]
    });

    expect(result.states).toContainEqual({
      ...fresh,
      state: 'baseline-regression'
    });
    expect(result.hasRegression).toBe(true);
  });

  it('allows the baseline to stay equal or shrink but never grow', () => {
    const equal = evaluateBaselineRatchet({
      previousBaseline: [legacy],
      proposedBaseline: [legacy],
      currentViolations: [legacy]
    });
    const smaller = evaluateBaselineRatchet({
      previousBaseline: [legacy],
      proposedBaseline: [],
      currentViolations: []
    });

    expect(equal.hasRegression).toBe(false);
    expect(smaller.hasRegression).toBe(false);
    expect(equal.proposedCount).toBeLessThanOrEqual(equal.previousCount);
    expect(smaller.proposedCount).toBeLessThanOrEqual(smaller.previousCount);
  });
});
