import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeCiEvidenceFile } from '../../src/report/write-ci-evidence.js';

describe('CI evidence writer', () => {
  it('creates the output directory and writes deterministic evidence JSON', async () => {
    const root = await mkdtemp(join(tmpdir(), 'vd-evidence-'));
    const outputPath = join(root, 'nested', 'evidence.json');

    try {
      const report = await writeCiEvidenceFile(outputPath, {
        unitResult: 'success',
        browserResult: 'success',
        generatedAt: '2026-09-15T17:35:00.000Z'
      });

      const raw = await readFile(outputPath, 'utf8');

      expect(report.finalStatus).toBe('PASS');
      expect(raw).toBe(JSON.stringify(report, null, 2) + '\n');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
