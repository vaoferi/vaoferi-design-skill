import stylelint from 'stylelint';
import { isProjectAuthored, type SourceOwnership } from './ownership.js';

export type ImportantClassification =
  | 'new-violation'
  | 'legacy-baselined'
  | 'approved-exception';

export interface ImportantFinding {
  file: string;
  line: number;
  column: number;
  classification: ImportantClassification;
}

export interface ImportantBaselineEntry {
  file: string;
  line: number;
  column: number;
}

export interface ImportantException {
  file: string;
  line: number;
  column?: number;
  reason: string;
  approvalRef: string;
}

export interface ImportantPolicyInput {
  file: string;
  code: string;
  ownership: SourceOwnership;
  changedLines: number[];
  baseline: ImportantBaselineEntry[];
  exceptions: ImportantException[];
}

function assertNarrowExceptions(exceptions: ImportantException[]): void {
  for (const exception of exceptions) {
    const hasWildcard = /[*?[\]{}]/u.test(exception.file);
    const invalidLine = !Number.isInteger(exception.line) || exception.line < 1;
    const invalidColumn =
      exception.column !== undefined &&
      (!Number.isInteger(exception.column) || exception.column < 1);
    const missingReason = exception.reason.trim().length === 0;
    const missingApproval = exception.approvalRef.trim().length === 0;

    if (
      hasWildcard ||
      invalidLine ||
      invalidColumn ||
      missingReason ||
      missingApproval
    ) {
      throw new Error('IMPORTANT_EXCEPTION_SCOPE_INVALID');
    }
  }
}

function matchesException(
  finding: { file: string; line: number; column: number },
  exception: ImportantException
): boolean {
  return (
    exception.file === finding.file &&
    exception.line === finding.line &&
    (exception.column === undefined || exception.column === finding.column)
  );
}

function matchesBaseline(
  finding: { file: string; line: number; column: number },
  baseline: ImportantBaselineEntry
): boolean {
  return (
    baseline.file === finding.file &&
    baseline.line === finding.line &&
    baseline.column === finding.column
  );
}

export async function evaluateImportantPolicy(
  input: ImportantPolicyInput
): Promise<ImportantFinding[]> {
  assertNarrowExceptions(input.exceptions);

  if (!isProjectAuthored(input.ownership)) {
    return [];
  }

  const result = await stylelint.lint({
    code: input.code,
    codeFilename: input.file,
    config: {
      rules: {
        'declaration-no-important': [true, { reportDisables: true }]
      }
    }
  });

  const warnings = (result.results[0]?.warnings ?? []).filter(
    (warning) => warning.rule === 'declaration-no-important'
  );
  const changedLines = new Set(input.changedLines);

  return warnings.map((warning) => {
    const line = warning.line;
    const column = warning.column;
    const position = { file: input.file, line, column };

    const approved = input.exceptions.some((exception) =>
      matchesException(position, exception)
    );

    if (approved) {
      return {
        ...position,
        classification: 'approved-exception' as const
      };
    }

    const baselined = input.baseline.some((entry) =>
      matchesBaseline(position, entry)
    );

    return {
      ...position,
      classification:
        baselined && !changedLines.has(line)
          ? ('legacy-baselined' as const)
          : ('new-violation' as const)
    };
  });
}
