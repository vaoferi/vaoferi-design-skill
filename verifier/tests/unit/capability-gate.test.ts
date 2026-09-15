import { describe, expect, it } from 'vitest';
import { decideBrowserCapability } from '../../src/audit/capability-gate.js';

describe('decideBrowserCapability', () => {
  it('returns READY when a supported browser verifier is already usable', () => {
    const result = decideBrowserCapability({
      isWebUi: true,
      browserHarnesses: [
        {
          name: 'playwright',
          installed: true,
          browserRuntimeAvailable: true,
          supportsRenderedGeometry: true
        }
      ],
      packageManager: 'npm',
      canInstallDependencies: true
    });

    expect(result).toEqual({
      status: 'READY',
      selectedAdapter: 'playwright',
      missing: [],
      blockedStages: []
    });
  });

  it('returns INSTALLABLE with concrete Playwright setup when web UI has no usable harness', () => {
    const result = decideBrowserCapability({
      isWebUi: true,
      browserHarnesses: [],
      packageManager: 'npm',
      canInstallDependencies: true
    });

    expect(result.status).toBe('INSTALLABLE');
    expect(result.missing).toContain('rendered-browser-verifier');
    expect(result.blockedStages).toEqual(['responsive', 'verify']);
    expect(result.install).toEqual({
      packageManager: 'npm',
      packages: ['@playwright/test'],
      commands: [
        'npm install --save-dev @playwright/test',
        'npx playwright install chromium'
      ]
    });
  });

  it('returns BLOCKED when required browser verification cannot be used or installed', () => {
    const result = decideBrowserCapability({
      isWebUi: true,
      browserHarnesses: [],
      packageManager: null,
      canInstallDependencies: false
    });

    expect(result).toEqual({
      status: 'BLOCKED',
      missing: ['rendered-browser-verifier'],
      blockedStages: ['responsive', 'verify']
    });
  });

  it('does not require browser verification for a non-web task', () => {
    const result = decideBrowserCapability({
      isWebUi: false,
      browserHarnesses: [],
      packageManager: null,
      canInstallDependencies: false
    });

    expect(result).toEqual({
      status: 'READY',
      selectedAdapter: undefined,
      missing: [],
      blockedStages: []
    });
  });
});
