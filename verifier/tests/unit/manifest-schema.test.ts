import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AjvSchemaValidator } from '../../src/adapters/ajv-schema-validator.js';

function loadManifestSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(
      new URL('../../../schemas/manifest.schema.json', import.meta.url),
      'utf8'
    )
  ) as Record<string, unknown>;
}

function validManifest() {
  return {
    skillVersion: '1.1.0',
    schemaVersion: 1,
    installMode: 'augment',
    detectedStack: ['yii2', 'bootstrap'],
    enabledAdapters: ['playwright'],
    managedFiles: ['.design/contract.json'],
    managedBlocks: [{ path: 'AGENTS.md', blockId: 'vaoferi-design' }],
    baselineVersion: 0,
    contractVersion: '1.1'
  };
}

describe('manifest schema', () => {
  it('accepts the complete canonical manifest', () => {
    const result = new AjvSchemaValidator().validate(
      loadManifestSchema(),
      validManifest()
    );

    expect(result.valid).toBe(true);
  });

  it('rejects a managed block without an explicit block id', () => {
    const manifest = validManifest();
    manifest.managedBlocks = [{ path: 'AGENTS.md' }] as never;

    const result = new AjvSchemaValidator().validate(
      loadManifestSchema(),
      manifest
    );

    expect(result.valid).toBe(false);
  });

  it('rejects a manifest missing required lifecycle metadata', () => {
    const { contractVersion: _removed, ...manifest } = validManifest();

    const result = new AjvSchemaValidator().validate(
      loadManifestSchema(),
      manifest
    );

    expect(result.valid).toBe(false);
  });

  it('rejects unknown top-level fields so ownership cannot drift silently', () => {
    const result = new AjvSchemaValidator().validate(loadManifestSchema(), {
      ...validManifest(),
      hiddenOwnershipOverride: true
    });

    expect(result.valid).toBe(false);
  });
});
