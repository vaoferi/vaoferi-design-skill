import { describe, expect, it } from 'vitest';
import {
  evaluateImportantPolicy,
  type ImportantException
} from '../../src/policy/important-policy.js';

describe('evaluateImportantPolicy', () => {
  it('flags new !important in project-authored changed CSS', async () => {
    const findings = await evaluateImportantPolicy({
      file: 'src/card.css',
      code: '.card { color: red !important; }',
      ownership: 'authored',
      changedLines: [1],
      baseline: [],
      exceptions: []
    });

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      file: 'src/card.css',
      line: 1,
      classification: 'new-violation'
    });
  });

  it('ignores vendor/generated code by explicit ownership classification', async () => {
    const vendor = await evaluateImportantPolicy({
      file: 'vendor/theme.css',
      code: '.x { color: red !important; }',
      ownership: 'vendor',
      changedLines: [1],
      baseline: [],
      exceptions: []
    });

    const generated = await evaluateImportantPolicy({
      file: 'dist/app.css',
      code: '.x { color: red !important; }',
      ownership: 'generated',
      changedLines: [1],
      baseline: [],
      exceptions: []
    });

    expect(vendor).toEqual([]);
    expect(generated).toEqual([]);
  });

  it('keeps an exact unchanged legacy occurrence baselined', async () => {
    const findings = await evaluateImportantPolicy({
      file: 'legacy.css',
      code: '.legacy { color: red !important; }',
      ownership: 'authored',
      changedLines: [],
      baseline: [{ file: 'legacy.css', line: 1, column: 22 }],
      exceptions: []
    });

    expect(findings).toHaveLength(1);
    expect(findings[0]?.classification).toBe('legacy-baselined');
  });

  it('does not let a touched baseline occurrence hide behind legacy status', async () => {
    const findings = await evaluateImportantPolicy({
      file: 'legacy.css',
      code: '.legacy { color: red !important; }',
      ownership: 'authored',
      changedLines: [1],
      baseline: [{ file: 'legacy.css', line: 1, column: 22 }],
      exceptions: []
    });

    expect(findings[0]?.classification).toBe('new-violation');
  });

  it('honors only a narrow explicit approved exception', async () => {
    const exception: ImportantException = {
      file: 'src/integration.css',
      line: 1,
      reason: 'Required to override third-party inline style at integration boundary',
      approvalRef: 'owner-approved:2026-09-15'
    };

    const findings = await evaluateImportantPolicy({
      file: 'src/integration.css',
      code: '.integration { color: red !important; }',
      ownership: 'authored',
      changedLines: [1],
      baseline: [],
      exceptions: [exception]
    });

    expect(findings[0]?.classification).toBe('approved-exception');
  });

  it('rejects broad wildcard exceptions', async () => {
    await expect(
      evaluateImportantPolicy({
        file: 'src/card.css',
        code: '.card { color: red !important; }',
        ownership: 'authored',
        changedLines: [1],
        baseline: [],
        exceptions: [
          {
            file: '**/*.css',
            line: 1,
            reason: 'Too broad',
            approvalRef: 'owner-approved:test'
          }
        ]
      })
    ).rejects.toThrow('IMPORTANT_EXCEPTION_SCOPE_INVALID');
  });
});
