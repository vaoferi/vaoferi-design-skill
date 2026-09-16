import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import contractSchema from '../../../schemas/contract.schema.json' with { type: 'json' };
import frameSchema from '../../../schemas/frame.schema.json' with { type: 'json' };
import statusSchema from '../../../schemas/status.schema.json' with { type: 'json' };
import { AjvSchemaValidator } from '../adapters/ajv-schema-validator.js';
import { DesignContractError } from './errors.js';
import type { SchemaValidator } from './schema-validator.js';

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

const defaultValidator = new AjvSchemaValidator();

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
  validator: SchemaValidator,
  schema: Record<string, unknown>,
  value: unknown,
  filePath: string
): void {
  const result = validator.validate(schema, value);
  if (result.valid) return;

  const first = result.violations[0];
  const instancePath = first?.instancePath ?? '';
  throw new DesignContractError(
    'CONTRACT_SCHEMA_INVALID',
    `Design contract schema validation failed: ${filePath}${instancePath}`,
    {
      path: `${filePath}${instancePath}`,
      details: result.violations
    }
  );
}

export async function loadContractState(
  projectRoot: string,
  validator: SchemaValidator = defaultValidator
): Promise<ContractState> {
  const stateDir = join(projectRoot, '.vaoferi-design');
  const manifestPath = join(stateDir, 'contract.json');
  const manifestValue = await readJson(manifestPath);
  assertSchema(
    validator,
    contractSchema as Record<string, unknown>,
    manifestValue,
    manifestPath
  );

  const manifest = manifestValue as ContractManifest;
  const framePath = join(stateDir, manifest.files.frame);
  const statusPath = join(stateDir, manifest.files.status);

  const [frame, status] = await Promise.all([
    readJson(framePath),
    readJson(statusPath)
  ]);

  assertSchema(
    validator,
    frameSchema as Record<string, unknown>,
    frame,
    framePath
  );
  assertSchema(
    validator,
    statusSchema as Record<string, unknown>,
    status,
    statusPath
  );

  return {
    manifest,
    frame: frame as Record<string, unknown>,
    status: status as Record<string, unknown>
  };
}
