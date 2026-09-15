export type LifecycleCommand =
  | 'audit'
  | 'init'
  | 'migrate'
  | 'augment'
  | 'update'
  | 'doctor'
  | 'rollback';

export type VerifyScope = 'changed' | 'full';

export type DesignCommand =
  | { command: LifecycleCommand }
  | { command: 'verify'; scope: VerifyScope };

const LIFECYCLE_COMMANDS = new Set<LifecycleCommand>([
  'audit',
  'init',
  'migrate',
  'augment',
  'update',
  'doctor',
  'rollback'
]);

function isLifecycleCommand(value: string): value is LifecycleCommand {
  return LIFECYCLE_COMMANDS.has(value as LifecycleCommand);
}

export function parseDesignCommand(argv: string[]): DesignCommand {
  const [command, ...flags] = argv;

  if (command === undefined || command.trim() === '') {
    throw new Error('DESIGN_COMMAND_REQUIRED');
  }

  if (isLifecycleCommand(command)) {
    if (flags.length > 0) {
      throw new Error(`DESIGN_COMMAND_UNEXPECTED_ARGUMENT:${flags[0]}`);
    }

    return { command };
  }

  if (command === 'verify') {
    const changed = flags.includes('--changed');
    const full = flags.includes('--full');
    const unknown = flags.find(
      (flag) => flag !== '--changed' && flag !== '--full'
    );

    if (unknown !== undefined) {
      throw new Error(`DESIGN_COMMAND_UNEXPECTED_ARGUMENT:${unknown}`);
    }

    if (changed && full) {
      throw new Error('DESIGN_VERIFY_SCOPE_CONFLICT');
    }

    return {
      command: 'verify',
      scope: full ? 'full' : 'changed'
    };
  }

  throw new Error(`DESIGN_COMMAND_UNKNOWN:${command}`);
}
