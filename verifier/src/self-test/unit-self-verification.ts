import { evaluateImportantPolicy } from '../policy/important-policy.js';

export interface UnitSelfVerificationResult {
  name: 'important-policy';
  status: 'PASS' | 'FAIL';
  detectedFindings: number;
  classifications: string[];
}

export async function runUnitSelfVerification(): Promise<UnitSelfVerificationResult> {
  const findings = await evaluateImportantPolicy({
    file: 'self-test/intentional-important.css',
    code: '.self-test { color: red !important; }',
    ownership: 'authored',
    changedLines: [1],
    baseline: [],
    exceptions: []
  });

  const classifications = findings.map((finding) => finding.classification);
  const detectedExpectedViolation =
    findings.length === 1 && classifications[0] === 'new-violation';

  return {
    name: 'important-policy',
    status: detectedExpectedViolation ? 'PASS' : 'FAIL',
    detectedFindings: findings.length,
    classifications
  };
}
