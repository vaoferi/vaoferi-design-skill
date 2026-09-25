import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../../..');

function read(path: string): string {
  return readFileSync(resolve(root, path), 'utf8');
}

describe('Design Skill 0.4.3 policy contract', () => {
  it('declares the 0.4.3 release in both skill metadata and package metadata', () => {
    expect(read('SKILL.md')).toContain('version: 0.4.3');
    const pkg = JSON.parse(read('package.json')) as { version: string };
    expect(pkg.version).toBe('0.4.3');
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

describe('Design Skill 0.4.3 inherits the universal Definition of Done (NLM-154)', () => {
  const verification = () => read('references/verification.md');

  it('routes universal completion to the Start Here Definition of Done', () => {
    expect(verification()).toContain('DEFINITION_OF_DONE.md');
  });

  it('requires commit + push + remote sync + WORKTREE CLEAN: PASS before a design handoff', () => {
    const text = verification();
    expect(text).toContain('WORKTREE CLEAN: PASS');
    expect(text).toMatch(/push/);
    expect(text).toMatch(/remote/i);
  });

  it('treats a pre-existing dirty worktree as a hard preflight before new design work', () => {
    const text = verification();
    expect(text).toMatch(/pre-existing/i);
    expect(text).toMatch(/hard preflight/i);
  });

  it('forbids silently shrinking the 10 canonical viewport states', () => {
    const text = verification();
    expect(text).toMatch(/10 canonical viewport/i);
    expect(text).toMatch(/may add .* never replace|never replace/i);
  });

  it('routes to the DoD instead of copying its matrix', () => {
    expect(verification()).not.toContain('2560×1080');
    const skill = read('SKILL.md');
    expect(skill).toContain('DEFINITION_OF_DONE.md');
    expect(skill).not.toContain('2560×1080');
  });

  it('keeps the preferred 48x48 CSS px touch target in the action contract', () => {
    expect(read('references/action-contract.md')).toContain('48x48 CSS px');
  });

  it('declares the peer-row policy classification the structure gate requires', () => {
    expect(read('references/action-contract.md')).toContain('STRONG_HEURISTIC_WITH_EXCEPTIONS');
  });

  it('holds a pressure scenario about uncommitted UI work', () => {
    const items = JSON.parse(read('.skillopt/data/test/items.json')) as Array<Record<string, unknown>>;
    const ids = items.map((i) => String(i.id));
    expect(ids).toContain('design-test-002');
    const text = JSON.stringify(items);
    expect(text).toContain('WORKTREE CLEAN');
    expect(text).toContain('DEFINITION_OF_DONE');
  });
});
