export interface ChangedTextFile {
  path: string;
  before: string;
  after: string;
}

export type AntiBypassCode =
  | 'SUPPRESSION_ADDED'
  | 'WORKFLOW_GATE_WEAKENED'
  | 'AUTHORED_SOURCE_IGNORED'
  | 'REQUIRED_COMMAND_REMOVED'
  | 'REQUIRED_COMMAND_DISABLED';

export interface AntiBypassFinding {
  code: AntiBypassCode;
  file: string;
  line?: number;
  detail?: string;
}

export interface AntiBypassInput {
  changes: ChangedTextFile[];
  authoredRoots: string[];
  requiredScripts: string[];
}

const SUPPRESSION_PATTERN = /(?:stylelint-disable(?:-line|-next-line)?|eslint-disable(?:-line|-next-line)?|biome-ignore|oxlint-disable|@ts-ignore|@ts-nocheck|@phpstan-ignore(?:-next-line)?|phpstan-ignore-next-line)/iu;
const WORKFLOW_PATH_PATTERN = /^\.github\/workflows\/.*\.ya?ml$/u;
const IGNORE_FILE_PATTERN = /(?:^|\/)(?:\.stylelintignore|\.eslintignore|\.prettierignore|\.gitignore)$/u;

function splitLines(text: string): string[] {
  return text.replace(/\r\n/gu, '\n').split('\n');
}

function newlyAddedMatchingLines(
  before: string,
  after: string,
  predicate: (line: string) => boolean
): Array<{ line: number; text: string }> {
  const beforeCounts = new Map<string, number>();

  for (const line of splitLines(before)) {
    if (!predicate(line)) continue;
    beforeCounts.set(line, (beforeCounts.get(line) ?? 0) + 1);
  }

  const added: Array<{ line: number; text: string }> = [];
  const afterLines = splitLines(after);

  afterLines.forEach((line, index) => {
    if (!predicate(line)) return;

    const available = beforeCounts.get(line) ?? 0;
    if (available > 0) {
      beforeCounts.set(line, available - 1);
      return;
    }

    added.push({ line: index + 1, text: line });
  });

  return added;
}

function normalizeRoot(root: string): string {
  return root.replace(/^\.\//u, '').replace(/^\/+|\/+$/gu, '');
}

function normalizeIgnorePattern(pattern: string): string {
  return pattern.trim().replace(/^\.\//u, '').replace(/^\/+|\/+$/gu, '');
}

function ignorePatternCoversAuthoredSource(
  pattern: string,
  authoredRoots: string[]
): boolean {
  const normalized = normalizeIgnorePattern(pattern);
  if (normalized.length === 0 || normalized.startsWith('#') || normalized.startsWith('!')) {
    return false;
  }

  if (
    normalized === '*' ||
    normalized === '**' ||
    normalized === '**/*' ||
    normalized.startsWith('**/*.') ||
    normalized.startsWith('*.')
  ) {
    return true;
  }

  return authoredRoots.some((root) => {
    const authoredRoot = normalizeRoot(root);
    return (
      normalized === authoredRoot ||
      normalized === `${authoredRoot}/**` ||
      normalized === `${authoredRoot}/**/*` ||
      normalized === `${authoredRoot}/*` ||
      normalized.startsWith(`${authoredRoot}/`)
    );
  });
}

function parseScripts(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text) as { scripts?: Record<string, unknown> };
    return parsed.scripts ?? {};
  } catch {
    return null;
  }
}

function isNoOpCommand(command: unknown): boolean {
  if (typeof command !== 'string') return true;

  const normalized = command.trim().toLowerCase();
  if (normalized.length === 0) return true;

  return (
    /^(?:true|:|exit\s+0)$/u.test(normalized) ||
    /^echo\s+(?:disabled|skip|skipped|noop|no-op)(?:\s|$)/u.test(normalized)
  );
}

export function evaluateAntiBypass(input: AntiBypassInput): AntiBypassFinding[] {
  const findings: AntiBypassFinding[] = [];

  for (const change of input.changes) {
    for (const added of newlyAddedMatchingLines(
      change.before,
      change.after,
      (line) => SUPPRESSION_PATTERN.test(line)
    )) {
      findings.push({
        code: 'SUPPRESSION_ADDED',
        file: change.path,
        line: added.line,
        detail: added.text.trim()
      });
    }

    if (WORKFLOW_PATH_PATTERN.test(change.path)) {
      for (const added of newlyAddedMatchingLines(
        change.before,
        change.after,
        (line) => /continue-on-error\s*:\s*true\b/iu.test(line)
      )) {
        findings.push({
          code: 'WORKFLOW_GATE_WEAKENED',
          file: change.path,
          line: added.line,
          detail: added.text.trim()
        });
      }
    }

    if (IGNORE_FILE_PATTERN.test(change.path)) {
      for (const added of newlyAddedMatchingLines(
        change.before,
        change.after,
        (line) => ignorePatternCoversAuthoredSource(line, input.authoredRoots)
      )) {
        findings.push({
          code: 'AUTHORED_SOURCE_IGNORED',
          file: change.path,
          line: added.line,
          detail: added.text.trim()
        });
      }
    }

    if (change.path === 'package.json') {
      const beforeScripts = parseScripts(change.before);
      const afterScripts = parseScripts(change.after);

      if (beforeScripts !== null && afterScripts !== null) {
        for (const script of input.requiredScripts) {
          const beforeCommand = beforeScripts[script];
          const afterCommand = afterScripts[script];

          if (beforeCommand !== undefined && afterCommand === undefined) {
            findings.push({
              code: 'REQUIRED_COMMAND_REMOVED',
              file: change.path,
              detail: script
            });
            continue;
          }

          if (
            beforeCommand !== undefined &&
            afterCommand !== beforeCommand &&
            isNoOpCommand(afterCommand)
          ) {
            findings.push({
              code: 'REQUIRED_COMMAND_DISABLED',
              file: change.path,
              detail: script
            });
          }
        }
      }
    }
  }

  return findings;
}
