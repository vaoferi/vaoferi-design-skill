import { describe, expect, it } from 'vitest';
import {
  createEvidenceReport,
  serializeEvidenceReport
} from '../../src/report/evidence.js';

describe('machine-readable verifier evidence', () => {
  it('derives PASS only when every required gate passes', () => {
    const report = createEvidenceReport({
      contractVersion: '1.1',
      stage: 'verify',
      scope: 'changed',
      generatedAt: '2026-09-15T16:00:00.000Z',
      gates: [
        { name: 'unit', status: 'PASS', required: true },
        { name: 'browser', status: 'PASS', required: true }
      ]
    });

    expect(report.finalStatus).toBe('PASS');
  });

  it('derives FAIL when a required gate fails', () => {
    const report = createEvidenceReport({
      contractVersion: '1.1',
      stage: 'verify',
      scope: 'changed',
      generatedAt: '2026-09-15T16:00:00.000Z',
      gates: [
        { name: 'unit', status: 'PASS', required: true },
        { name: 'browser', status: 'FAIL', required: true }
      ]
    });

    expect(report.finalStatus).toBe('FAIL');
  });

  it('gives BLOCKED precedence over FAIL for required gates', () => {
    const report = createEvidenceReport({
      contractVersion: '1.1',
      stage: 'verify',
      scope: 'full',
      generatedAt: '2026-09-15T16:00:00.000Z',
      gates: [
        { name: 'unit', status: 'FAIL', required: true },
        { name: 'browser', status: 'BLOCKED', required: true }
      ]
    });

    expect(report.finalStatus).toBe('BLOCKED');
  });

  it('does not let optional gate failures poison the required final status', () => {
    const report = createEvidenceReport({
      contractVersion: '1.1',
      stage: 'verify',
      scope: 'changed',
      generatedAt: '2026-09-15T16:00:00.000Z',
      gates: [
        { name: 'unit', status: 'PASS', required: true },
        { name: 'advisory', status: 'FAIL', required: false }
      ]
    });

    expect(report.finalStatus).toBe('PASS');
  });

  it('serializes deterministically as JSON with findings and exceptions preserved', () => {
    const report = createEvidenceReport({
      contractVersion: '1.1',
      stage: 'verify',
      scope: 'changed',
      generatedAt: '2026-09-15T16:00:00.000Z',
      gates: [
        {
          name: 'policy',
          status: 'PASS',
          required: true,
          findings: [],
          exceptions: ['integration-css-1']
        }
      ]
    });

    expect(serializeEvidenceReport(report)).toBe(
      JSON.stringify(report, null, 2) + '\n'
    );
  });
});
