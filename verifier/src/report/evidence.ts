export type EvidenceStatus = 'PASS' | 'FAIL' | 'BLOCKED';
export type EvidenceScope = 'changed' | 'full';

export interface EvidenceGate {
  name: string;
  status: EvidenceStatus;
  required: boolean;
  findings?: unknown[];
  exceptions?: string[];
}

export interface EvidenceInput {
  contractVersion: string;
  stage: string;
  scope: EvidenceScope;
  generatedAt: string;
  gates: EvidenceGate[];
}

export interface EvidenceReport extends EvidenceInput {
  schemaVersion: 1;
  finalStatus: EvidenceStatus;
}

function deriveFinalStatus(gates: EvidenceGate[]): EvidenceStatus {
  const required = gates.filter((gate) => gate.required);

  if (required.length === 0) {
    return 'BLOCKED';
  }

  if (required.some((gate) => gate.status === 'BLOCKED')) {
    return 'BLOCKED';
  }

  if (required.some((gate) => gate.status === 'FAIL')) {
    return 'FAIL';
  }

  return 'PASS';
}

export function createEvidenceReport(input: EvidenceInput): EvidenceReport {
  return {
    schemaVersion: 1,
    contractVersion: input.contractVersion,
    stage: input.stage,
    scope: input.scope,
    generatedAt: input.generatedAt,
    gates: input.gates.map((gate) => ({
      ...gate,
      ...(gate.findings === undefined ? {} : { findings: [...gate.findings] }),
      ...(gate.exceptions === undefined
        ? {}
        : { exceptions: [...gate.exceptions] })
    })),
    finalStatus: deriveFinalStatus(input.gates)
  };
}

export function serializeEvidenceReport(report: EvidenceReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}
