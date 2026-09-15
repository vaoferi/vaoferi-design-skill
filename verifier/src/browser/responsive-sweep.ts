import type {
  BrowserAdapter,
  ViewportOrientation,
  ViewportState
} from './browser-adapter.js';
import {
  collectGeometrySelectors,
  evaluateGeometry,
  type GeometryRules,
  type GeometryViolation
} from './geometry-rules.js';

export interface ViewportProfile {
  orientation: ViewportOrientation;
  aspectRatio: number;
}

export interface ResponsiveSweepConfig {
  minWidth: number;
  maxWidth: number;
  breakpoints?: number[];
  profiles: ViewportProfile[];
}

export interface ResponsiveSweepFinding {
  viewport: ViewportState;
  violations: GeometryViolation[];
}

export interface ResponsiveSweepResult {
  testedStates: number;
  findings: ResponsiveSweepFinding[];
}

export interface ResponsiveSweepInput {
  adapter: BrowserAdapter;
  url: string;
  config: ResponsiveSweepConfig;
  geometry: GeometryRules;
}

function assertValidWidth(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`RESPONSIVE_SWEEP_${label}_INVALID`);
  }
}

export function generateWidths(
  minWidth: number,
  maxWidth: number,
  breakpoints: number[] = []
): number[] {
  assertValidWidth(minWidth, 'MIN_WIDTH');
  assertValidWidth(maxWidth, 'MAX_WIDTH');

  if (minWidth > maxWidth) {
    throw new Error('RESPONSIVE_SWEEP_RANGE_INVALID');
  }

  const widths = new Set<number>();

  for (let width = minWidth; width <= maxWidth; width += 1) {
    widths.add(width);
  }

  for (const breakpoint of breakpoints) {
    if (!Number.isInteger(breakpoint)) {
      throw new Error('RESPONSIVE_SWEEP_BREAKPOINT_INVALID');
    }

    for (const delta of [-2, -1, 0, 1, 2]) {
      const candidate = breakpoint + delta;
      if (candidate >= minWidth && candidate <= maxWidth) {
        widths.add(candidate);
      }
    }
  }

  return [...widths].sort((a, b) => a - b);
}

function validateProfile(profile: ViewportProfile): void {
  if (!Number.isFinite(profile.aspectRatio) || profile.aspectRatio <= 0) {
    throw new Error('RESPONSIVE_SWEEP_ASPECT_RATIO_INVALID');
  }
}

export function generateViewportStates(
  config: ResponsiveSweepConfig
): ViewportState[] {
  if (config.profiles.length === 0) {
    throw new Error('RESPONSIVE_SWEEP_PROFILES_REQUIRED');
  }

  for (const profile of config.profiles) {
    validateProfile(profile);
  }

  const widths = generateWidths(
    config.minWidth,
    config.maxWidth,
    config.breakpoints
  );

  return widths.flatMap((width) =>
    config.profiles.map((profile) => ({
      width,
      height: Math.max(1, Math.round(width / profile.aspectRatio)),
      orientation: profile.orientation
    }))
  );
}

export async function runResponsiveSweep(
  input: ResponsiveSweepInput
): Promise<ResponsiveSweepResult> {
  const states = generateViewportStates(input.config);
  const selectors = collectGeometrySelectors(input.geometry);
  const findings: ResponsiveSweepFinding[] = [];

  try {
    await input.adapter.open(input.url);

    for (const viewport of states) {
      await input.adapter.setViewport(viewport);
      const snapshot = await input.adapter.measure(selectors);
      const violations = evaluateGeometry(snapshot, input.geometry);

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
