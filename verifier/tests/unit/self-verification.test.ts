import { describe, expect, it } from 'vitest';
import { runUnitSelfVerification } from '../../src/self-test/unit-self-verification.js';

describe('unit gate self-verification', () => {
  it('proves the !important policy catches an intentional new violation', async () => {
    const result = await runUnitSelfVerification();

    expect(result).toMatchObject({
      name: 'important-policy',
      status: 'PASS',
      detectedFindings: 1
    });
    expect(result.classifications).toEqual(['new-violation']);
  });
});
