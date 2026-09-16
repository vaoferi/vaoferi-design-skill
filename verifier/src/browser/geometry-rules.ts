import type {
  GeometryBox,
  GeometrySnapshot
} from './browser-adapter.js';

export type AlignmentAxis =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'center-x'
  | 'center-y';

export interface AlignmentRule {
  a: string;
  b: string;
  axis: AlignmentAxis;
  tolerance?: number;
}

export interface FrameContainmentRule {
  child: string;
  frame: string;
  tolerance?: number;
}

export interface GeometryRules {
  horizontalOverflow?: boolean;
  collisions?: Array<[string, string]>;
  withinFrame?: FrameContainmentRule[];
  alignments?: AlignmentRule[];
  requiredSelectors?: string[];
}

export type GeometryViolationRule =
  | 'horizontal-overflow'
  | 'collision'
  | 'outside-frame'
  | 'misalignment'
  | 'orphan';

export interface GeometryViolation {
  rule: GeometryViolationRule;
  selectors?: string[];
  detail: string;
}

function right(box: GeometryBox): number {
  return box.x + box.width;
}

function bottom(box: GeometryBox): number {
  return box.y + box.height;
}

function intersects(a: GeometryBox, b: GeometryBox): boolean {
  return (
    Math.min(right(a), right(b)) > Math.max(a.x, b.x) &&
    Math.min(bottom(a), bottom(b)) > Math.max(a.y, b.y)
  );
}

function alignmentValue(box: GeometryBox, axis: AlignmentAxis): number {
  switch (axis) {
    case 'left':
      return box.x;
    case 'right':
      return right(box);
    case 'top':
      return box.y;
    case 'bottom':
      return bottom(box);
    case 'center-x':
      return box.x + box.width / 2;
    case 'center-y':
      return box.y + box.height / 2;
  }
}

export function collectGeometrySelectors(rules: GeometryRules): string[] {
  const selectors = new Set<string>();

  for (const selector of rules.requiredSelectors ?? []) {
    selectors.add(selector);
  }

  for (const [a, b] of rules.collisions ?? []) {
    selectors.add(a);
    selectors.add(b);
  }

  for (const rule of rules.withinFrame ?? []) {
    selectors.add(rule.child);
    selectors.add(rule.frame);
  }

  for (const rule of rules.alignments ?? []) {
    selectors.add(rule.a);
    selectors.add(rule.b);
  }

  return [...selectors].sort((a, b) => a.localeCompare(b));
}

export function evaluateGeometry(
  snapshot: GeometrySnapshot,
  rules: GeometryRules
): GeometryViolation[] {
  const violations: GeometryViolation[] = [];

  if (
    rules.horizontalOverflow === true &&
    snapshot.scrollWidth > snapshot.viewport.width
  ) {
    violations.push({
      rule: 'horizontal-overflow',
      detail: `scrollWidth ${snapshot.scrollWidth}px exceeds viewport ${snapshot.viewport.width}px`
    });
  }

  for (const selector of rules.requiredSelectors ?? []) {
    if (snapshot.boxes[selector] === undefined) {
      violations.push({
        rule: 'orphan',
        selectors: [selector],
        detail: `Required selector is missing or has no measurable box: ${selector}`
      });
    }
  }

  for (const [aSelector, bSelector] of rules.collisions ?? []) {
    const a = snapshot.boxes[aSelector];
    const b = snapshot.boxes[bSelector];
    if (a !== undefined && b !== undefined && intersects(a, b)) {
      violations.push({
        rule: 'collision',
        selectors: [aSelector, bSelector],
        detail: `${aSelector} overlaps ${bSelector}`
      });
    }
  }

  for (const rule of rules.withinFrame ?? []) {
    const child = snapshot.boxes[rule.child];
    const frame = snapshot.boxes[rule.frame];
    if (child === undefined || frame === undefined) continue;

    const tolerance = rule.tolerance ?? 0;
    const outside =
      child.x < frame.x - tolerance ||
      child.y < frame.y - tolerance ||
      right(child) > right(frame) + tolerance ||
      bottom(child) > bottom(frame) + tolerance;

    if (outside) {
      violations.push({
        rule: 'outside-frame',
        selectors: [rule.child, rule.frame],
        detail: `${rule.child} escapes ${rule.frame}`
      });
    }
  }

  for (const rule of rules.alignments ?? []) {
    const a = snapshot.boxes[rule.a];
    const b = snapshot.boxes[rule.b];
    if (a === undefined || b === undefined) continue;

    const tolerance = rule.tolerance ?? 0;
    const delta = Math.abs(
      alignmentValue(a, rule.axis) - alignmentValue(b, rule.axis)
    );

    if (delta > tolerance) {
      violations.push({
        rule: 'misalignment',
        selectors: [rule.a, rule.b],
        detail: `${rule.axis} delta ${delta}px exceeds tolerance ${tolerance}px`
      });
    }
  }

  return violations;
}
