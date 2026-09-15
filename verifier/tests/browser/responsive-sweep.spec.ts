import { expect, test } from '@playwright/test';
import { PlaywrightBrowserAdapter } from '../../src/adapters/playwright-browser.js';
import { runResponsiveSweep } from '../../src/browser/responsive-sweep.js';

const passUrl = new URL('../fixtures/responsive/pass.html', import.meta.url).href;
const overflowUrl = new URL(
  '../fixtures/responsive/horizontal-overflow.html',
  import.meta.url
).href;

const config = {
  minWidth: 320,
  maxWidth: 322,
  profiles: [{ orientation: 'portrait' as const, aspectRatio: 9 / 16 }]
};

test('responsive fixture passes every tested viewport', async () => {
  const result = await runResponsiveSweep({
    adapter: new PlaywrightBrowserAdapter(),
    url: passUrl,
    config,
    geometry: { horizontalOverflow: true }
  });

  expect(result.testedStates).toBe(3);
  expect(result.findings).toEqual([]);
});

test('one-pixel horizontal overflow fails every tested viewport', async () => {
  const result = await runResponsiveSweep({
    adapter: new PlaywrightBrowserAdapter(),
    url: overflowUrl,
    config,
    geometry: { horizontalOverflow: true }
  });

  expect(result.testedStates).toBe(3);
  expect(result.findings).toHaveLength(3);
  expect(
    result.findings.every((finding) =>
      finding.violations.some(
        (violation) => violation.rule === 'horizontal-overflow'
      )
    )
  ).toBe(true);
});
