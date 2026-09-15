export type DesignContractErrorCode =
  | 'CONTRACT_READ_FAILED'
  | 'CONTRACT_JSON_INVALID'
  | 'CONTRACT_SCHEMA_INVALID';

export class DesignContractError extends Error {
  readonly code: DesignContractErrorCode;
  readonly path?: string;
  readonly details?: unknown;

  constructor(
    code: DesignContractErrorCode,
    message: string,
    options: { path?: string; details?: unknown; cause?: unknown } = {}
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'DesignContractError';
    this.code = code;
    this.path = options.path;
    this.details = options.details;
  }
}
