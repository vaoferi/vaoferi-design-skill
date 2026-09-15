import { describe, expect, it } from 'vitest';
import {
  createManagedBlock,
  updateManagedBlock,
  type DesignManifest
} from '../../src/lifecycle/manifest.js';

describe('managed lifecycle ownership', () => {
  it('creates deterministic managed block markers', () => {
    expect(createManagedBlock('agent-rules', 'importantPolicy=ENFORCED')).toBe(
      '<!-- vaoferi-design:start:agent-rules -->\n' +
        'importantPolicy=ENFORCED\n' +
        '<!-- vaoferi-design:end:agent-rules -->'
    );
  });

  it('updates only the managed block and preserves user text byte-for-byte', () => {
    const before = [
      '# Project rules',
      '',
      'Human-owned intro.  ',
      '<!-- vaoferi-design:start:agent-rules -->',
      'old generated text',
      '<!-- vaoferi-design:end:agent-rules -->',
      '',
      'Human-owned footer.'
    ].join('\n');

    const after = updateManagedBlock(before, {
      id: 'agent-rules',
      content: 'importantPolicy=ENFORCED\nchangedFilesPolicy=STRICT'
    });

    expect(after).toBe(
      [
        '# Project rules',
        '',
        'Human-owned intro.  ',
        '<!-- vaoferi-design:start:agent-rules -->',
        'importantPolicy=ENFORCED',
        'changedFilesPolicy=STRICT',
        '<!-- vaoferi-design:end:agent-rules -->',
        '',
        'Human-owned footer.'
      ].join('\n')
    );
  });

  it('blocks missing managed markers instead of rewriting the whole document', () => {
    expect(() =>
      updateManagedBlock('Human text only', {
        id: 'agent-rules',
        content: 'generated'
      })
    ).toThrow('MANAGED_BLOCK_MISSING:agent-rules');
  });

  it('blocks duplicate managed markers', () => {
    const duplicate = [
      '<!-- vaoferi-design:start:agent-rules -->',
      'one',
      '<!-- vaoferi-design:end:agent-rules -->',
      '<!-- vaoferi-design:start:agent-rules -->',
      'two',
      '<!-- vaoferi-design:end:agent-rules -->'
    ].join('\n');

    expect(() =>
      updateManagedBlock(duplicate, {
        id: 'agent-rules',
        content: 'generated'
      })
    ).toThrow('MANAGED_BLOCK_DUPLICATE:agent-rules');
  });

  it('models canonical managed-file and managed-block ownership explicitly', () => {
    const manifest: DesignManifest = {
      skillVersion: '1.1.0',
      schemaVersion: 1,
      installMode: 'augment',
      detectedStack: ['yii2', 'bootstrap'],
      enabledAdapters: ['playwright'],
      managedFiles: ['.design/contract.json'],
      managedBlocks: [{ path: 'AGENTS.md', blockId: 'vaoferi-design' }],
      baselineVersion: 0,
      contractVersion: '1.1'
    };

    expect(manifest.managedFiles).toEqual(['.design/contract.json']);
    expect(manifest.managedBlocks).toEqual([
      { path: 'AGENTS.md', blockId: 'vaoferi-design' }
    ]);
  });
});
