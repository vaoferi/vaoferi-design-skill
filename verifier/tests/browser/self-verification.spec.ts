import { expect, test } from '@playwright/test';
import { runBrowserSelfVerification } from '../../src/self-test/browser-self-verification.js';

test('proves the responsive gate catches intentional one-pixel overflow', async () => {
  const result = await runBrowserSelfVerification();

  expect(result).toMatchObject({
    name: 'responsive-overflow',
    status: 'PASS',
    testedStates: 3,
    detectedStates: 3
  });
});
