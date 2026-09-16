import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { rm } from 'node:fs/promises';
import { loadScopeContract } from '../../src/scopes/scope-contract.js';

const tempRoots: string[] = [];

async function makeProject(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'vaoferi-scope-contract-'));
  tempRoots.push(root);
  return root;
}

async function writeScopeContract(
  root: string,
  scopeId: string,
  value: Record<string, unknown>
): Promise<void> {
  const dir = join(root, '.design', 'scopes', scopeId);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'contract.json'), JSON.stringify(value), 'utf8');
}

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('loadScopeContract', () => {
  it('loads frontend and admin contracts independently without visual inheritance', async () => {
    const root = await makeProject();

    await writeScopeContract(root, 'frontend', {
      scopeId: 'frontend',
      contractVersion: '1.2',
      profile: 'public-content',
      density: 'comfortable',
      tokens: { accent: '#ff5500', gutter: 32 }
    });
    await writeScopeContract(root, 'admin', {
      scopeId: 'admin',
      contractVersion: '1.2',
      profile: 'admin-dense',
      density: 'dense',
      tokens: { accent: '#2457d6', gutter: 12 }
    });

    const frontend = await loadScopeContract(root, 'frontend');
    const admin = await loadScopeContract(root, 'admin');

    expect(frontend).toMatchObject({
      scopeId: 'frontend',
      profile: 'public-content',
      density: 'comfortable',
      tokens: { accent: '#ff5500', gutter: 32 }
    });
    expect(admin).toMatchObject({
      scopeId: 'admin',
      profile: 'admin-dense',
      density: 'dense',
      tokens: { accent: '#2457d6', gutter: 12 }
    });
    expect(frontend.tokens).not.toEqual(admin.tokens);
  });

  it('rejects a contract whose declared scope id does not match its directory', async () => {
    const root = await makeProject();
    await writeScopeContract(root, 'admin', {
      scopeId: 'frontend',
      contractVersion: '1.2',
      profile: 'admin-dense',
      density: 'dense'
    });

    await expect(loadScopeContract(root, 'admin')).rejects.toThrow(
      'SCOPE_CONTRACT_ID_MISMATCH'
    );
  });
});
