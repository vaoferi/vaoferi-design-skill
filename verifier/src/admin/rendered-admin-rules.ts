import type {
  BrowserAdapter,
  ViewportState
} from '../browser/browser-adapter.js';
import { evaluateGeometry } from '../browser/geometry-rules.js';
import {
  generateViewportStates,
  type ResponsiveSweepConfig
} from '../browser/responsive-sweep.js';

export type AdminActionRegion =
  | 'page-actions'
  | 'section-actions'
  | 'row-actions'
  | 'bulk-actions'
  | 'danger-zone';

export type RenderedAdminRule =
  | 'horizontal-overflow'
  | 'admin-action-region-missing'
  | 'admin-form-chain-unstructured'
  | 'admin-critical-action-hidden'
  | 'admin-destructive-routine-mix';

export interface RenderedAdminViolation {
  rule: RenderedAdminRule;
  detail: string;
  selectors?: string[];
}

export interface RenderedAdminFinding {
  viewport: ViewportState;
  violations: RenderedAdminViolation[];
}

export interface RenderedAdminPolicy {
  requiredActionRegions: readonly AdminActionRegion[];
  criticalActionSelectors: readonly string[];
  maxUnstructuredFields: number;
  detectDestructiveMixing: boolean;
}

export interface RenderedAdminVerificationInput {
  adapter: BrowserAdapter;
  url: string;
  config: ResponsiveSweepConfig;
  policy: RenderedAdminPolicy;
}

export interface RenderedAdminVerificationResult {
  testedStates: number;
  findings: RenderedAdminFinding[];
}

function actionRegionSelector(region: AdminActionRegion): string {
  return `[data-action-region="${region}"]`;
}

function assertValidPolicy(policy: RenderedAdminPolicy): void {
  if (
    !Number.isInteger(policy.maxUnstructuredFields) ||
    policy.maxUnstructuredFields < 1
  ) {
    throw new Error('ADMIN_MAX_UNSTRUCTURED_FIELDS_INVALID');
  }
}

function collectSelectors(policy: RenderedAdminPolicy): {
  selectors: string[];
  regionSelectors: Map<AdminActionRegion, string>;
  chainSelector: string;
  mixSelectors: string[];
} {
  const regionSelectors = new Map<AdminActionRegion, string>();
  const selectors = new Set<string>();

  for (const region of policy.requiredActionRegions) {
    const selector = actionRegionSelector(region);
    regionSelectors.set(region, selector);
    selectors.add(selector);
  }

  for (const selector of policy.criticalActionSelectors) {
    selectors.add(selector);
  }

  const chainSelector =
    `[data-unstructured-form] > [data-admin-field]:nth-child(${policy.maxUnstructuredFields + 1})`;
  selectors.add(chainSelector);

  const mixSelectors = policy.detectDestructiveMixing
    ? [
        '[data-action-group]:has([data-action-kind="destructive"]):has([data-action-kind="routine"])',
        '[data-action-group]:has([data-action-kind="dangerous-destructive"]):has([data-action-kind="routine"])'
      ]
    : [];

  for (const selector of mixSelectors) {
    selectors.add(selector);
  }

  return {
    selectors: [...selectors].sort((a, b) => a.localeCompare(b)),
    regionSelectors,
    chainSelector,
    mixSelectors
  };
}

export async function runRenderedAdminVerification(
  input: RenderedAdminVerificationInput
): Promise<RenderedAdminVerificationResult> {
  assertValidPolicy(input.policy);

  const states = generateViewportStates(input.config);
  const { selectors, regionSelectors, chainSelector, mixSelectors } =
    collectSelectors(input.policy);
  const findings: RenderedAdminFinding[] = [];

  try {
    await input.adapter.open(input.url);

    for (const viewport of states) {
      await input.adapter.setViewport(viewport);
      const snapshot = await input.adapter.measure(selectors);
      const violations: RenderedAdminViolation[] = [];

      for (const geometryViolation of evaluateGeometry(snapshot, {
        horizontalOverflow: true
      })) {
        if (geometryViolation.rule === 'horizontal-overflow') {
          violations.push({
            rule: 'horizontal-overflow',
            detail: geometryViolation.detail,
            ...(geometryViolation.selectors === undefined
              ? {}
              : { selectors: geometryViolation.selectors })
          });
        }
      }

      for (const [region, selector] of regionSelectors) {
        if (snapshot.boxes[selector] === undefined) {
          violations.push({
            rule: 'admin-action-region-missing',
            detail: `Declared admin action region is missing or not measurable: ${region}`,
            selectors: [selector]
          });
        }
      }

      for (const selector of input.policy.criticalActionSelectors) {
        if (snapshot.boxes[selector] === undefined) {
          violations.push({
            rule: 'admin-critical-action-hidden',
            detail: `Critical admin action is missing or hidden: ${selector}`,
            selectors: [selector]
          });
        }
      }

      if (snapshot.boxes[chainSelector] !== undefined) {
        violations.push({
          rule: 'admin-form-chain-unstructured',
          detail:
            `Unstructured form exceeds ${input.policy.maxUnstructuredFields} direct fields`,
          selectors: [chainSelector]
        });
      }

      const mixedSelector = mixSelectors.find(
        (selector) => snapshot.boxes[selector] !== undefined
      );

      if (mixedSelector !== undefined) {
        violations.push({
          rule: 'admin-destructive-routine-mix',
          detail: 'Destructive and routine actions share the same measurable action group',
          selectors: [mixedSelector]
        });
      }

      if (violations.length > 0) {
        findings.push({ viewport, violations });
      }
    }
  } finally {
    await input.adapter.close();
  }

  return {
    testedStates: states.length,
    findings
  };
}
