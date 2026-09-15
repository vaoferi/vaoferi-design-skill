import { PlaywrightBrowserAdapter } from '../adapters/playwright-browser.js';
import { runResponsiveSweep } from '../browser/responsive-sweep.js';

export interface BrowserSelfVerificationResult {
  name: 'responsive-overflow';
  status: 'PASS' | 'FAIL';
  testedStates: number;
  detectedStates: number;
}

export async function runBrowserSelfVerification(): Promise<BrowserSelfVerificationResult> {
  const overflowUrl = new URL(
    '../../tests/fixtures/responsive/horizontal-overflow.html',
    import.meta.url
  ).href;

  const result = await runResponsiveSweep({
    adapter: new PlaywrightBrowserAdapter(),
    url: overflowUrl,
    config: {
      minWidth: 320,
      maxWidth: 322,
      profiles: [{ orientation: 'portrait', aspectRatio: 9 / 16 }]
    },
    geometry: { horizontalOverflow: true }
  });

  const detectedStates = result.findings.filter((finding) =>
    finding.violations.some(
      (violation) => violation.rule === 'horizontal-overflow'
    )
  ).length;

  return {
    name: 'responsive-overflow',
    status:
      result.testedStates === 3 && detectedStates === result.testedStates
        ? 'PASS'
        : 'FAIL',
    testedStates: result.testedStates,
    detectedStates
  };
}
