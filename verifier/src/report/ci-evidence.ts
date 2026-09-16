import {
  createEvidenceReport,
  type EvidenceReport,
  type EvidenceStatus
} from './evidence.js';

export interface CiEvidenceInput {
  unitResult: string;
  browserResult: string;
  generatedAt: string;
}

function mapCiJobResult(result: string): EvidenceStatus {
  if (result === 'success') {
    return 'PASS';
  }

  if (result === 'failure' || result === 'timed_out') {
    return 'FAIL';
  }

  return 'BLOCKED';
}

export function createCiEvidenceReport(
  input: CiEvidenceInput
): EvidenceReport {
  return createEvidenceReport({
    contractVersion: '1.2',
    stage: 'ci',
    scope: 'full',
    generatedAt: input.generatedAt,
    gates: [
      {
        name: 'unit+self-test',
        status: mapCiJobResult(input.unitResult),
        required: true
      },
      {
        name: 'browser+self-test',
        status: mapCiJobResult(input.browserResult),
        required: true
      }
    ]
  });
}
