export type CapabilityStatus = 'READY' | 'INSTALLABLE' | 'BLOCKED';

export type SupportedPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface BrowserHarnessCapability {
  name: string;
  installed: boolean;
  browserRuntimeAvailable: boolean;
  supportsRenderedGeometry: boolean;
}

export interface BrowserCapabilityInput {
  isWebUi: boolean;
  browserHarnesses: BrowserHarnessCapability[];
  packageManager: SupportedPackageManager | null;
  canInstallDependencies: boolean;
}

export interface BrowserCapabilityDecision {
  status: CapabilityStatus;
  selectedAdapter?: string;
  missing: string[];
  install?: {
    packageManager: SupportedPackageManager;
    packages: string[];
    commands: string[];
  };
  blockedStages: string[];
}

const BLOCKED_STAGES = ['responsive', 'verify'] as const;

function playwrightInstall(
  packageManager: SupportedPackageManager
): NonNullable<BrowserCapabilityDecision['install']> {
  switch (packageManager) {
    case 'npm':
      return {
        packageManager,
        packages: ['@playwright/test'],
        commands: [
          'npm install --save-dev @playwright/test',
          'npx playwright install chromium'
        ]
      };
    case 'pnpm':
      return {
        packageManager,
        packages: ['@playwright/test'],
        commands: [
          'pnpm add -D @playwright/test',
          'pnpm exec playwright install chromium'
        ]
      };
    case 'yarn':
      return {
        packageManager,
        packages: ['@playwright/test'],
        commands: [
          'yarn add -D @playwright/test',
          'yarn playwright install chromium'
        ]
      };
    case 'bun':
      return {
        packageManager,
        packages: ['@playwright/test'],
        commands: [
          'bun add -d @playwright/test',
          'bunx playwright install chromium'
        ]
      };
  }
}

export function decideBrowserCapability(
  input: BrowserCapabilityInput
): BrowserCapabilityDecision {
  if (!input.isWebUi) {
    return {
      status: 'READY',
      selectedAdapter: undefined,
      missing: [],
      blockedStages: []
    };
  }

  const usable = input.browserHarnesses.find(
    (harness) =>
      harness.installed &&
      harness.browserRuntimeAvailable &&
      harness.supportsRenderedGeometry
  );

  if (usable !== undefined) {
    return {
      status: 'READY',
      selectedAdapter: usable.name,
      missing: [],
      blockedStages: []
    };
  }

  const missing = ['rendered-browser-verifier'];
  const blockedStages = [...BLOCKED_STAGES];

  if (input.canInstallDependencies && input.packageManager !== null) {
    return {
      status: 'INSTALLABLE',
      missing,
      install: playwrightInstall(input.packageManager),
      blockedStages
    };
  }

  return {
    status: 'BLOCKED',
    missing,
    blockedStages
  };
}
