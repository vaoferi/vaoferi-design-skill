import type { CapabilityStatus } from '../audit/capability-gate.js';

export type PreflightTrigger =
  | 'task-start'
  | 'context-compaction'
  | 'context-restart'
  | 'stage-transition';

export type ComplexityGateStatus = 'NOT_REQUIRED' | 'REQUIRED' | 'SATISFIED';

export interface PreflightInput {
  contractVersion: string;
  stage: string;
  browserGate: CapabilityStatus;
  relevantExceptions: string[];
  trigger: PreflightTrigger;
  scopeIds?: string[];
  profiles?: Record<string, string>;
  scopeContracts?: Record<string, string>;
  complexityGate?: ComplexityGateStatus;
}

export interface PreflightSnapshot {
  trigger: PreflightTrigger;
  contractVersion: string;
  stage: string;
  importantPolicy: 'ENFORCED';
  changedFilesPolicy: 'STRICT';
  browserGate: CapabilityStatus;
  relevantExceptions: string[];
  canProceed: boolean;
  scopeIds?: string[];
  profiles?: Record<string, string>;
  scopeContracts?: Record<string, string>;
  complexityGate?: ComplexityGateStatus;
  blockedReason?:
    | 'BROWSER_VERIFICATION_BLOCKED'
    | 'BROWSER_VERIFICATION_INSTALL_REQUIRED';
}

const BROWSER_REQUIRED_STAGES = new Set(['responsive', 'verify']);

function normalizeExceptions(ids: string[]): string[] {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

function normalizeIds(ids: string[] | undefined): string[] | undefined {
  if (ids === undefined) return undefined;
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

function normalizeRecord(
  value: Record<string, string> | undefined
): Record<string, string> | undefined {
  if (value === undefined) return undefined;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => key.trim().length > 0 && item.trim().length > 0)
      .sort(([left], [right]) => left.localeCompare(right))
  );
}

export function buildPreflight(input: PreflightInput): PreflightSnapshot {
  const requiresBrowser = BROWSER_REQUIRED_STAGES.has(input.stage);
  let canProceed = true;
  let blockedReason: PreflightSnapshot['blockedReason'];

  if (requiresBrowser && input.browserGate === 'BLOCKED') {
    canProceed = false;
    blockedReason = 'BROWSER_VERIFICATION_BLOCKED';
  } else if (requiresBrowser && input.browserGate === 'INSTALLABLE') {
    canProceed = false;
    blockedReason = 'BROWSER_VERIFICATION_INSTALL_REQUIRED';
  }

  const scopeIds = normalizeIds(input.scopeIds);
  const profiles = normalizeRecord(input.profiles);
  const scopeContracts = normalizeRecord(input.scopeContracts);

  return {
    trigger: input.trigger,
    contractVersion: input.contractVersion,
    stage: input.stage,
    importantPolicy: 'ENFORCED',
    changedFilesPolicy: 'STRICT',
    browserGate: input.browserGate,
    relevantExceptions: normalizeExceptions(input.relevantExceptions),
    canProceed,
    ...(scopeIds === undefined ? {} : { scopeIds }),
    ...(profiles === undefined ? {} : { profiles }),
    ...(scopeContracts === undefined ? {} : { scopeContracts }),
    ...(input.complexityGate === undefined
      ? {}
      : { complexityGate: input.complexityGate }),
    ...(blockedReason === undefined ? {} : { blockedReason })
  };
}

function formatRecord(value: Record<string, string>): string {
  return Object.entries(value)
    .map(([key, item]) => `${key}:${item}`)
    .join(',');
}

export function formatPreflight(snapshot: PreflightSnapshot): string {
  const lines = [
    `contractVersion=${snapshot.contractVersion}`,
    `stage=${snapshot.stage}`,
    `importantPolicy=${snapshot.importantPolicy}`,
    `changedFilesPolicy=${snapshot.changedFilesPolicy}`,
    `browserGate=${snapshot.browserGate}`
  ];

  if (snapshot.scopeIds !== undefined) {
    lines.push(`scopeIds=[${snapshot.scopeIds.join(',')}]`);
  }
  if (snapshot.profiles !== undefined) {
    lines.push(`profiles=[${formatRecord(snapshot.profiles)}]`);
  }
  if (snapshot.scopeContracts !== undefined) {
    lines.push(`scopeContracts=[${formatRecord(snapshot.scopeContracts)}]`);
  }
  if (snapshot.complexityGate !== undefined) {
    lines.push(`complexityGate=${snapshot.complexityGate}`);
  }

  lines.push(
    `relevantExceptions=[${snapshot.relevantExceptions.join(',')}]`,
    `canProceed=${String(snapshot.canProceed)}`
  );

  if (snapshot.blockedReason !== undefined) {
    lines.push(`blockedReason=${snapshot.blockedReason}`);
  }

  return lines.join('\n');
}
