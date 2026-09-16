import { expect, test } from '@playwright/test';
import { PlaywrightBrowserAdapter } from '../../src/adapters/playwright-browser.js';
import {
  runRenderedAdminVerification,
  type RenderedAdminFinding,
  type RenderedAdminViolation
} from '../../src/admin/rendered-admin-rules.js';

const simpleUrl = new URL('../fixtures/admin/simple.html', import.meta.url).href;
const denseGoodUrl = new URL('../fixtures/admin/dense-good.html', import.meta.url).href;
const denseBadUrl = new URL('../fixtures/admin/dense-bad.html', import.meta.url).href;

const config = {
  minWidth: 320,
  maxWidth: 330,
  profiles: [{ orientation: 'portrait' as const, aspectRatio: 9 / 16 }]
};

const densePolicy = {
  requiredActionRegions: [
    'page-actions',
    'section-actions',
    'row-actions',
    'bulk-actions',
    'danger-zone'
  ] as const,
  criticalActionSelectors: ['[data-critical-action="save"]'],
  maxUnstructuredFields: 12,
  detectDestructiveMixing: true
};

test('simple admin fixture passes rendered verification', async () => {
  const result = await runRenderedAdminVerification({
    adapter: new PlaywrightBrowserAdapter(),
    url: simpleUrl,
    config,
    policy: {
      requiredActionRegions: ['page-actions'],
      criticalActionSelectors: ['[data-critical-action="save"]'],
      maxUnstructuredFields: 12,
      detectDestructiveMixing: true
    }
  });

  expect(result.testedStates).toBe(11);
  expect(result.findings).toEqual([]);
});

test('well-structured dense admin fixture passes every tested width', async () => {
  const result = await runRenderedAdminVerification({
    adapter: new PlaywrightBrowserAdapter(),
    url: denseGoodUrl,
    config,
    policy: densePolicy
  });

  expect(result.testedStates).toBe(11);
  expect(result.findings).toEqual([]);
});

test('bad dense admin fixture reports the machine-detectable workspace failures', async () => {
  const result = await runRenderedAdminVerification({
    adapter: new PlaywrightBrowserAdapter(),
    url: denseBadUrl,
    config,
    policy: densePolicy
  });

  expect(result.testedStates).toBe(11);
  expect(result.findings).toHaveLength(11);

  const rules = new Set(
    result.findings.flatMap((finding: RenderedAdminFinding) =>
      finding.violations.map((violation: RenderedAdminViolation) => violation.rule)
    )
  );

  expect(rules).toEqual(
    new Set([
      'horizontal-overflow',
      'admin-action-region-missing',
      'admin-form-chain-unstructured',
      'admin-critical-action-hidden',
      'admin-destructive-routine-mix'
    ])
  );
});
