import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../../..');

function read(path: string): string {
  return readFileSync(resolve(root, path), 'utf8');
}

describe('Design Skill 0.4.1 policy contract', () => {
  it('declares the 0.4.1 release in both skill metadata and package metadata', () => {
    expect(read('SKILL.md')).toContain('version: 0.4.1');
    const pkg = JSON.parse(read('package.json')) as { version: string };
    expect(pkg.version).toBe('0.4.1');
  });

  it('requires finding the existing style owner before CSS changes', () => {
    const stages = read('references/stages.md');
    expect(stages).toContain('style owner');
    expect(stages).toContain('override layer');
  });

  it('rejects a heavyweight dependency for one trivial visual need', () => {
    const stages = read('references/stages.md');
    expect(stages).toContain('whole dependency/library');
    expect(stages).toContain('trivial visual');
  });
});
