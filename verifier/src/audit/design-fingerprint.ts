export interface DesignObservations {
  containers: number[];
  gutters: number[];
  alignmentAnchors: string[];
  spacing: number[];
  colors: string[];
  typography: string[];
  componentPatterns: string[];
  breakpoints: number[];
  exceptionCandidates: string[];
}

export interface DesignFingerprint {
  containers: number[];
  gutters: number[];
  alignmentAnchors: string[];
  spacingScale: number[];
  colors: string[];
  typography: string[];
  componentPatterns: string[];
  breakpoints: number[];
  deliberateExceptions: string[];
}

export interface DesignFingerprintOptions {
  numericTolerance?: number;
  minimumOccurrences?: number;
}

interface NumericCluster {
  values: number[];
}

function validateOptions(options: Required<DesignFingerprintOptions>): void {
  if (!Number.isFinite(options.numericTolerance) || options.numericTolerance < 0) {
    throw new Error('DESIGN_FINGERPRINT_TOLERANCE_INVALID');
  }

  if (
    !Number.isInteger(options.minimumOccurrences) ||
    options.minimumOccurrences < 1
  ) {
    throw new Error('DESIGN_FINGERPRINT_MIN_OCCURRENCES_INVALID');
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle]!;
  }

  return (sorted[middle - 1]! + sorted[middle]!) / 2;
}

function clusterNumericValues(
  values: number[],
  tolerance: number
): NumericCluster[] {
  const sorted = values
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  const clusters: NumericCluster[] = [];

  for (const value of sorted) {
    const current = clusters.at(-1);

    if (current === undefined) {
      clusters.push({ values: [value] });
      continue;
    }

    const lastValue = current.values[current.values.length - 1]!;
    if (value - lastValue <= tolerance) {
      current.values.push(value);
    } else {
      clusters.push({ values: [value] });
    }
  }

  return clusters;
}

function dominantNumbers(
  values: number[],
  tolerance: number,
  minimumOccurrences: number
): number[] {
  return clusterNumericValues(values, tolerance)
    .filter((cluster) => cluster.values.length >= minimumOccurrences)
    .map((cluster) => median(cluster.values))
    .sort((a, b) => a - b);
}

function dominantStrings(
  values: string[],
  minimumOccurrences: number
): string[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    const normalized = value.trim();
    if (normalized.length === 0) continue;
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= minimumOccurrences)
    .map(([value]) => value)
    .sort((a, b) => a.localeCompare(b));
}

export function extractDesignFingerprint(
  observations: DesignObservations,
  options: DesignFingerprintOptions = {}
): DesignFingerprint {
  const resolved = {
    numericTolerance: options.numericTolerance ?? 2,
    minimumOccurrences: options.minimumOccurrences ?? 2
  };

  validateOptions(resolved);

  return {
    containers: dominantNumbers(
      observations.containers,
      resolved.numericTolerance,
      resolved.minimumOccurrences
    ),
    gutters: dominantNumbers(
      observations.gutters,
      resolved.numericTolerance,
      resolved.minimumOccurrences
    ),
    alignmentAnchors: dominantStrings(
      observations.alignmentAnchors,
      resolved.minimumOccurrences
    ),
    spacingScale: dominantNumbers(
      observations.spacing,
      resolved.numericTolerance,
      resolved.minimumOccurrences
    ),
    colors: dominantStrings(observations.colors, resolved.minimumOccurrences),
    typography: dominantStrings(
      observations.typography,
      resolved.minimumOccurrences
    ),
    componentPatterns: dominantStrings(
      observations.componentPatterns,
      resolved.minimumOccurrences
    ),
    breakpoints: dominantNumbers(
      observations.breakpoints,
      resolved.numericTolerance,
      resolved.minimumOccurrences
    ),
    deliberateExceptions: dominantStrings(
      observations.exceptionCandidates,
      resolved.minimumOccurrences
    )
  };
}
