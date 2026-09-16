import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadContractState } from '../../src/core/contract-loader.js';

const roots: string[] = [];

async function makeProject(frame: unknown): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'vd-contract-'));
  roots.push(root);
  const state = join(root, '.vaoferi-design');
  await mkdir(state, { recursive: true });
  await writeFile(join(state, 'contract.json'), JSON.stringify({
    schemaVersion: 1,
    files: {
      frame: 'frame.json',
      status: 'status.json'
    }
  }, null, 2));
  await writeFile(join(state, 'status.json'), JSON.stringify({
    schemaVersion: 1,
    stages: {
      frame: 'approved',
      rhythm: 'missing',
      place: 'missing',
      align: 'missing',
      flow: 'missing',
      reference: 'missing',
      visual: 'missing',
      responsive: 'missing'
    }
  }, null, 2));
  await writeFile(join(state, 'frame.json'), JSON.stringify(frame, null, 2));
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('loadContractState', () => {
  it('rejects a frame with an unknown property', async () => {
    const root = await makeProject({
      schemaVersion: 1,
      sectionModes: {},
      sections: {},
      unexpected: true
    });

    await expect(loadContractState(root)).rejects.toMatchObject({
      code: 'CONTRACT_SCHEMA_INVALID'
    });
  });
});
