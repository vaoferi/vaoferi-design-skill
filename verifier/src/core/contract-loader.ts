import Ajv, { type ValidateFunction } from 'ajv';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import contractSchema from '../../../schemas/contract.schema.json' with { type: 'json' };
import frameSchema from '../../../schemas/frame.schema.json' with { type: 'json' };
import statusSchema from '../../../schemas/status.schema.json' with { type: 'json' };
import { DesignContractError } from './errors.js';

interface ContractManifest {
  schemaVersion: 1;
  files: {
    frame: string;
    status: string;
  };
}

export interface ContractState {
  manifest: ContractManifest;
  frame: Record<string, unknown>;
  status: Record<string, unknown>;
}

const ajv = new Ajv({ allErrors: true, strict: true });
const validateContract = ajv.compile(contractSchema);
const validateFrame = ajv.compile(frameSchema);
const validateStatus = ajv.compile(statusSchema);

async function readJson(path: string): Promise<unknown> {
  let source: string;
  try {
    source = await readFile(path, 'utf8');
  } catch (cause) {
    throw new DesignContractError(
      'CONTRACT_READ_FAILED',
      `Unable to read design contract file: ${path}`,
      { path, cause }
    );
  }

  try {
    return JSON.parse(source) as unknown;
  } catch (cause) {
    throw new DesignContractError(
      'CONTRACT_JSON_INVALID',
      `Invalid JSON in design contract file: ${path}`,
      { path, cause }
    );
  }
}

function assertSchema(
  validate: ValidateFunction,
  value: unknown,
  filePath: string
): void {
  if (validate(value)) return;

  const first = validate.errors?.[0];
  const instancePath = first?.instancePath ?? '';
  throw new DesignContractError(
    'CONTRACT_SCHEMA_INVALID',
    `Design contract schema validation failed: ${filePath}${instancePath}`,
    {
      path: `${filePath}${instancePath}`,
      details: validate.errors ?? []
    }
  );
}

export async function loadContractState(projectRoot: string): Promise<ContractState> {
  const stateDir = join(projectRoot, '.vaoferi-design');
  const manifestPath = join(stateDir, 'contract.json');
  const manifestValue = await readJson(manifestPath);
  assertSchema(validateContract, manifestValue, manifestPath);

  const manifest = manifestValue as ContractManifest;
  const framePath = join(stateDir, manifest.files.frame);
  const statusPath = join(stateDir, manifest.files.status);

  const [frame, status] = await Promise.all([
    readJson(framePath),
    readJson(statusPath)
  ]);

  assertSchema(validateFrame, frame, framePath);
  assertSchema(validateStatus, status, statusPath);

  return {
    manifest,
    frame: frame as Record<string, unknown>,
    status: status as Record<string, unknown>
  };
}
