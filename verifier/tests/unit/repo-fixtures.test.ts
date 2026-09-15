import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  extractDesignFingerprint,
  type DesignObservations
} from '../../src/audit/design-fingerprint.js';
import {
  decideBrowserCapability,
  type BrowserCapabilityInput
} from '../../src/audit/capability-gate.js';
import { evaluateBaselineRatchet, type BaselineEntry } from '../../src/policy/baseline.js';
import {
  evaluateImportantPolicy,
  type ImportantBaselineEntry
} from '../../src/policy/important-policy.js';
import { createEvidenceReport } from '../../src/report/evidence.js';

const fixtureRoot = new URL('../fixtures/repos/', import.meta.url);

async function readText(relativePath: string): Promise<string> {
  return readFile(new URL(relativePath, fixtureRoot), 'utf8');
}

async function readJson<T>(relativePath: string): Promise<T> {
  return JSON.parse(await readText(relativePath)) as T;
}

describe('controlled repository adoption fixtures', () => {
  it('greenfield uses zero-baseline strict mode and cannot absorb new !important debt', async () => {
    const baseline = await readJson<ImportantBaselineEntry[]>('greenfield/baseline.json');
    const cleanCode = await readText('greenfield/clean.css');
    const violatingCode = await readText('greenfield/new-violation.css');

    expect(baseline).toEqual([]);

    const clean = await evaluateImportantPolicy({
      file: 'src/card.css',
      code: cleanCode,
      ownership: 'authored',
      changedLines: [1],
      baseline,
      exceptions: []
    });
    expect(clean).toEqual([]);

    const violating = await evaluateImportantPolicy({
      file: 'src/card.css',
      code: violatingCode,
      ownership: 'authored',
      changedLines: [1],
      baseline,
      exceptions: []
    });
    expect(violating).toHaveLength(1);
    expect(violating[0]?.classification).toBe('new-violation');

    const proposedGrowth: BaselineEntry[] = violating.map((finding) => ({
      rule: 'declaration-no-important',
      file: finding.file,
      line: finding.line,
      column: finding.column
    }));
    const ratchet = evaluateBaselineRatchet({
      previousBaseline: [],
      proposedBaseline: proposedGrowth,
      currentViolations: proposedGrowth
    });

    expect(ratchet.hasRegression).toBe(true);
    expect(ratchet.states.map((finding) => finding.state)).toContain('baseline-regression');
  });

  it('legacy tolerates untouched baselined debt but rejects new touched debt', async () => {
    const baseline = await readJson<BaselineEntry[]>('legacy/baseline.json');
    const code = await readText('legacy/app.css');
    const importantBaseline: ImportantBaselineEntry[] = baseline.map(({ file, line, column }) => ({
      file,
      line,
      column: column ?? 1
    }));

    const findings = await evaluateImportantPolicy({
      file: 'src/legacy.css',
      code,
      ownership: 'authored',
      changedLines: [2],
      baseline: importantBaseline,
      exceptions: []
    });

    expect(findings.map((finding) => finding.classification)).toEqual([
      'legacy-baselined',
      'new-violation'
    ]);

    const currentViolations: BaselineEntry[] = findings.map((finding) => ({
      rule: 'declaration-no-important',
      file: finding.file,
      line: finding.line,
      column: finding.column
    }));
    const ratchet = evaluateBaselineRatchet({
      previousBaseline: baseline,
      proposedBaseline: baseline,
      currentViolations
    });

    expect(ratchet.hasRegression).toBe(false);
    expect(ratchet.states.map((finding) => finding.state)).toEqual([
      'legacy-baselined',
      'new-violation'
    ]);
  });

  it('existing-site augment preserves the established geometry fingerprint', async () => {
    const before = await readJson<DesignObservations>('existing-site/before.json');
    const after = await readJson<DesignObservations>('existing-site/after-augment.json');

    const beforeFingerprint = extractDesignFingerprint(before);
    const afterFingerprint = extractDesignFingerprint(after);

    expect({
      containers: afterFingerprint.containers,
      gutters: afterFingerprint.gutters,
      alignmentAnchors: afterFingerprint.alignmentAnchors,
      spacingScale: afterFingerprint.spacingScale,
      breakpoints: afterFingerprint.breakpoints
    }).toEqual({
      containers: beforeFingerprint.containers,
      gutters: beforeFingerprint.gutters,
      alignmentAnchors: beforeFingerprint.alignmentAnchors,
      spacingScale: beforeFingerprint.spacingScale,
      breakpoints: beforeFingerprint.breakpoints
    });
  });

  it('blocked browser capability keeps a web UI task BLOCKED and therefore not Done', async () => {
    const capabilityInput = await readJson<BrowserCapabilityInput>(
      'blocked-capability/capability.json'
    );

    const decision = decideBrowserCapability(capabilityInput);
    expect(decision.status).toBe('BLOCKED');
    expect(decision.blockedStages).toEqual(['responsive', 'verify']);

    const evidence = createEvidenceReport({
      contractVersion: '1.1',
      stage: 'verify',
      scope: 'changed',
      generatedAt: '2026-09-15T18:00:00.000Z',
      gates: [
        {
          name: 'browser-capability',
          status: decision.status === 'BLOCKED' ? 'BLOCKED' : 'PASS',
          required: true
        }
      ]
    });

    expect(evidence.finalStatus).toBe('BLOCKED');
    expect(evidence.finalStatus === 'PASS').toBe(false);
  });
});
