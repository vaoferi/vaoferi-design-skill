import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function load(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

function loadSkill(): string {
  return load('SKILL.md');
}

describe('SKILL.md context router', () => {
  it('pins the public release at 0.4.1', () => {
    expect(loadSkill()).toContain('version: 0.4.1');
  });

  it('resolves scope before any staged UI decision', () => {
    const skill = loadSkill();
    const scopeIndex = skill.indexOf('## Scope Resolution');
    const stageIndex = skill.indexOf('## Stage Order');

    expect(scopeIndex).toBeGreaterThan(-1);
    expect(stageIndex).toBeGreaterThan(-1);
    expect(scopeIndex).toBeLessThan(stageIndex);
    expect(skill).toContain('scope=<scopeId|BLOCKED>');
    expect(skill).toContain('profile=<profile>');
  });

  it('keeps the canonical stage order visible after context compaction', () => {
    expect(loadSkill()).toContain(
      'context/content inventory -> /frame -> /rhythm -> /place -> /align -> /flow -> /reference -> /visual -> /responsive -> /verify'
    );
  });

  it('keeps the compact preflight invariants in the top-level router', () => {
    const skill = loadSkill();

    expect(skill).toContain('importantPolicy=ENFORCED');
    expect(skill).toContain('changedFilesPolicy=STRICT');
    expect(skill).toContain('browserGate=READY|INSTALLABLE|BLOCKED');
  });

  it('keeps mandatory browser verification fail-closed', () => {
    const skill = loadSkill();

    expect(skill).toContain('Missing required browser verification = BLOCKED');
    expect(skill).not.toMatch(/browser[^\n]{0,120}fallback/i);
  });

  it('keeps exhaustive responsive verification explicit', () => {
    expect(loadSkill()).toContain('every integer CSS-pixel width');
  });

  it('lazy-loads scope rules and admin workspace rules instead of embedding them', () => {
    const skill = loadSkill();

    expect(skill).toContain('references/scopes.md');
    expect(skill).toContain('references/lifecycle.md');
    expect(skill).toContain('references/stages.md');
    expect(skill).toContain('references/verification.md');
    expect(skill).toContain('references/admin-workspace.md');

    const adminLine = skill
      .split('\n')
      .find((line) => line.includes('references/admin-workspace.md'));

    expect(adminLine).toContain('admin-standard');
    expect(adminLine).toContain('admin-dense');
    expect(skill).not.toContain('maxUnstructuredFields');
    expect(skill).not.toContain('DANGEROUS_ACTION_OUTSIDE_DANGER_ZONE');
  });

  it('documents fail-closed multi-scope routing in the focused scope reference', () => {
    const scopes = load('references/scopes.md');

    expect(scopes).toContain('explicit scope > path mapping > route mapping');
    expect(scopes).toContain('explicit shared scope mapping');
    expect(scopes).not.toContain('shared fallback');
    expect(scopes).toContain('ambiguous');
    expect(scopes).toContain('BLOCKED');
    expect(scopes).toContain('multi-scope');
  });

  it('documents adoption as a tooling/contract operation rather than redesign', () => {
    const lifecycle = load('references/lifecycle.md');

    expect(lifecycle).toContain('Adoption is not redesign');
    expect(lifecycle).toContain('production UI');
    expect(lifecycle).toContain('read-only');
  });

  it('routes dense admin work to explicit interaction topology rules', () => {
    const admin = load('references/admin-workspace.md');

    expect(admin).toContain('Interaction Topology');
    expect(admin).toContain('admin-standard');
    expect(admin).toContain('admin-dense');
    expect(admin).toContain('page-actions');
    expect(admin).toContain('danger-zone');
  });

  it('stays compact enough to re-read after context restart', () => {
    const words = loadSkill().trim().split(/\s+/u);
    expect(words.length).toBeLessThanOrEqual(850);
  });
});
