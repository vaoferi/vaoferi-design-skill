import { describe, expect, it } from 'vitest';
import { parseDesignCommand } from '../../src/cli.js';

const lifecycleCommands = [
  'audit',
  'init',
  'migrate',
  'augment',
  'update',
  'doctor',
  'rollback'
] as const;

describe('design lifecycle CLI router', () => {
  it.each(lifecycleCommands)('routes design %s', (command) => {
    expect(parseDesignCommand([command])).toEqual({ command });
  });

  it('routes verify --changed as the fast changed-surface verifier', () => {
    expect(parseDesignCommand(['verify', '--changed'])).toEqual({
      command: 'verify',
      scope: 'changed'
    });
  });

  it('routes verify --full as the broad verifier', () => {
    expect(parseDesignCommand(['verify', '--full'])).toEqual({
      command: 'verify',
      scope: 'full'
    });
  });

  it('defaults verify to changed scope so a missing flag never means skip verification', () => {
    expect(parseDesignCommand(['verify'])).toEqual({
      command: 'verify',
      scope: 'changed'
    });
  });

  it('rejects mutually exclusive verify scopes', () => {
    expect(() =>
      parseDesignCommand(['verify', '--changed', '--full'])
    ).toThrow('DESIGN_VERIFY_SCOPE_CONFLICT');
  });

  it('rejects unknown commands instead of silently falling back', () => {
    expect(() => parseDesignCommand(['ship'])).toThrow(
      'DESIGN_COMMAND_UNKNOWN:ship'
    );
  });

  it('requires an explicit lifecycle command', () => {
    expect(() => parseDesignCommand([])).toThrow('DESIGN_COMMAND_REQUIRED');
  });
});
