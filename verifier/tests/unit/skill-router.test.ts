import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function loadSkill(): string {
  return readFileSync(new URL('../../../SKILL.md', import.meta.url), 'utf8');
}

describe('SKILL.md context router', () => {
  it('pins the v1.1 contract version', () => {
    expect(loadSkill()).toContain('version: 1.1.0');
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

  it('lazy-loads narrow references instead of embedding the whole manual', () => {
    const skill = loadSkill();

    expect(skill).toContain('references/lifecycle.md');
    expect(skill).toContain('references/stages.md');
    expect(skill).toContain('references/verification.md');
  });

  it('stays compact enough to re-read after context restart', () => {
    const words = loadSkill().trim().split(/\s+/u);
    expect(words.length).toBeLessThanOrEqual(850);
  });
});
