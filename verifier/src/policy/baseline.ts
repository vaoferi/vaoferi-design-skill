export type DebtState =
  | 'legacy-baselined'
  | 'new-violation'
  | 'baseline-regression'
  | 'fixed-legacy';

export interface PolicyViolation {
  rule: string;
  file: string;
  line: number;
  column?: number;
}

export type BaselineEntry = PolicyViolation;

export interface DebtFinding extends PolicyViolation {
  state: DebtState;
}

export interface BaselineRatchetInput {
  previousBaseline: BaselineEntry[];
  proposedBaseline: BaselineEntry[];
  currentViolations: PolicyViolation[];
}

export interface BaselineRatchetResult {
  states: DebtFinding[];
  previousCount: number;
  proposedCount: number;
  hasRegression: boolean;
}

function key(entry: PolicyViolation): string {
  return [
    entry.rule,
    entry.file,
    String(entry.line),
    entry.column === undefined ? '' : String(entry.column)
  ].join('\u0000');
}

function uniqueByKey<T extends PolicyViolation>(entries: T[]): Map<string, T> {
  return new Map(entries.map((entry) => [key(entry), entry]));
}

export function evaluateBaselineRatchet(
  input: BaselineRatchetInput
): BaselineRatchetResult {
  const previous = uniqueByKey(input.previousBaseline);
  const proposed = uniqueByKey(input.proposedBaseline);
  const current = uniqueByKey(input.currentViolations);

  const allKeys = new Set([
    ...previous.keys(),
    ...proposed.keys(),
    ...current.keys()
  ]);

  const states: DebtFinding[] = [];

  for (const entryKey of allKeys) {
    const previousEntry = previous.get(entryKey);
    const proposedEntry = proposed.get(entryKey);
    const currentEntry = current.get(entryKey);

    if (proposedEntry && !previousEntry) {
      states.push({ ...proposedEntry, state: 'baseline-regression' });
      continue;
    }

    if (currentEntry) {
      if (previousEntry && proposedEntry) {
        states.push({ ...currentEntry, state: 'legacy-baselined' });
      } else {
        states.push({ ...currentEntry, state: 'new-violation' });
      }
      continue;
    }

    if (previousEntry) {
      states.push({ ...previousEntry, state: 'fixed-legacy' });
    }
  }

  return {
    states,
    previousCount: previous.size,
    proposedCount: proposed.size,
    hasRegression: states.some((finding) => finding.state === 'baseline-regression')
  };
}
