import { describe, expect, it } from 'vitest';
import { createCiEvidenceReport } from '../../src/report/ci-evidence.js';

describe('CI evidence adapter', () => {
  it('maps successful required jobs to PASS', () => {
    const report = createCiEvidenceReport({
      unitResult: 'success',
      browserResult: 'success',
      generatedAt: '2026-09-15T17:30:00.000Z'
    });

    expect(report.finalStatus).toBe('PASS');
    expect(report.gates).toEqual([
      { name: 'unit+self-test', status: 'PASS', required: true },
      { name: 'browser+self-test', status: 'PASS', required: true }
    ]);
  });

  it('maps a failed required job to FAIL', () => {
    const report = createCiEvidenceReport({
      unitResult: 'failure',
      browserResult: 'success',
      generatedAt: '2026-09-15T17:30:00.000Z'
    });

    expect(report.finalStatus).toBe('FAIL');
  });

  it('maps cancelled or skipped required jobs to BLOCKED, never PASS', () => {
    const report = createCiEvidenceReport({
      unitResult: 'cancelled',
      browserResult: 'skipped',
      generatedAt: '2026-09-15T17:30:00.000Z'
    });

    expect(report.finalStatus).toBe('BLOCKED');
    expect(report.gates.map((gate) => gate.status)).toEqual([
      'BLOCKED',
      'BLOCKED'
    ]);
  });
});
