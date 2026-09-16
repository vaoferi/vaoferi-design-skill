import { describe, expect, it } from 'vitest';
import {
  evaluateAntiBypass,
  type ChangedTextFile
} from '../../src/policy/anti-bypass.js';

function change(path: string, before: string, after: string): ChangedTextFile {
  return { path, before, after };
}

describe('evaluateAntiBypass', () => {
  it('blocks newly added stylelint suppression comments', () => {
    const findings = evaluateAntiBypass({
      changes: [
        change(
          'src/card.css',
          '.card { color: red; }\n',
          '/* stylelint-disable declaration-no-important */\n.card { color: red !important; }\n'
        )
      ],
      authoredRoots: ['src'],
      requiredScripts: ['vd']
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        code: 'SUPPRESSION_ADDED',
        file: 'src/card.css'
      })
    );
  });

  it('blocks required workflow weakening through continue-on-error', () => {
    const findings = evaluateAntiBypass({
      changes: [
        change(
          '.github/workflows/verifier.yml',
          '      - run: npm test\n',
          '      - run: npm test\n        continue-on-error: true\n'
        )
      ],
      authoredRoots: ['src'],
      requiredScripts: ['vd']
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        code: 'WORKFLOW_GATE_WEAKENED',
        file: '.github/workflows/verifier.yml'
      })
    );
  });

  it('blocks newly widened ignore patterns that cover authored source', () => {
    const findings = evaluateAntiBypass({
      changes: [
        change('.stylelintignore', 'vendor/**\n', 'vendor/**\nsrc/**\n')
      ],
      authoredRoots: ['src'],
      requiredScripts: ['vd']
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        code: 'AUTHORED_SOURCE_IGNORED',
        file: '.stylelintignore',
        detail: 'src/**'
      })
    );
  });

  it('blocks removal of a required verifier command', () => {
    const findings = evaluateAntiBypass({
      changes: [
        change(
          'package.json',
          JSON.stringify({ scripts: { vd: 'tsx verifier/src/cli.ts', test: 'vitest run' } }),
          JSON.stringify({ scripts: { test: 'vitest run' } })
        )
      ],
      authoredRoots: ['src'],
      requiredScripts: ['vd']
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        code: 'REQUIRED_COMMAND_REMOVED',
        file: 'package.json',
        detail: 'vd'
      })
    );
  });

  it('blocks replacing a required verifier command with a no-op', () => {
    const findings = evaluateAntiBypass({
      changes: [
        change(
          'package.json',
          JSON.stringify({ scripts: { vd: 'tsx verifier/src/cli.ts' } }),
          JSON.stringify({ scripts: { vd: 'echo disabled' } })
        )
      ],
      authoredRoots: ['src'],
      requiredScripts: ['vd']
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        code: 'REQUIRED_COMMAND_DISABLED',
        file: 'package.json',
        detail: 'vd'
      })
    );
  });

  it('does not flag pre-existing suppression debt that was not newly added', () => {
    const existing = '/* stylelint-disable declaration-no-important */\n.legacy { color: red !important; }\n';
    const findings = evaluateAntiBypass({
      changes: [change('src/legacy.css', existing, existing)],
      authoredRoots: ['src'],
      requiredScripts: ['vd']
    });

    expect(findings).toEqual([]);
  });
});
