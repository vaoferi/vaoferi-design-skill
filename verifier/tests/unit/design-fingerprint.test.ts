import { describe, expect, it } from 'vitest';
import {
  extractDesignFingerprint,
  type DesignObservations
} from '../../src/audit/design-fingerprint.js';

const observations: DesignObservations = {
  containers: [1199, 1200, 1201, 960],
  gutters: [24, 24, 25, 40, 40],
  alignmentAnchors: ['content-left', 'content-left', 'visual-center'],
  spacing: [8, 8, 9, 16, 16, 24],
  colors: ['#111111', '#111111', '#ffffff', '#ffffff', '#ff0000'],
  typography: ['Inter/16/24', 'Inter/16/24', 'Inter/32/40'],
  componentPatterns: ['card/default', 'card/default', 'hero/full-bleed'],
  breakpoints: [767, 768, 769, 1024],
  exceptionCandidates: [
    'hero/full-bleed',
    'hero/full-bleed',
    'promo/asymmetric',
    'promo/asymmetric',
    'one-off/debug-banner'
  ]
};

describe('extractDesignFingerprint', () => {
  it('extracts dominant numeric values using deterministic tolerance clustering', () => {
    const fingerprint = extractDesignFingerprint(observations, {
      numericTolerance: 2,
      minimumOccurrences: 2
    });

    expect(fingerprint.containers).toEqual([1200]);
    expect(fingerprint.gutters).toEqual([24, 40]);
    expect(fingerprint.spacingScale).toEqual([8, 16]);
    expect(fingerprint.breakpoints).toEqual([768]);
  });

  it('keeps repeated string patterns and drops one-off noise', () => {
    const fingerprint = extractDesignFingerprint(observations, {
      numericTolerance: 2,
      minimumOccurrences: 2
    });

    expect(fingerprint.alignmentAnchors).toEqual(['content-left']);
    expect(fingerprint.colors).toEqual(['#111111', '#ffffff']);
    expect(fingerprint.typography).toEqual(['Inter/16/24']);
    expect(fingerprint.componentPatterns).toEqual(['card/default']);
  });

  it('preserves repeated exceptions instead of normalizing them away', () => {
    const fingerprint = extractDesignFingerprint(observations, {
      numericTolerance: 2,
      minimumOccurrences: 2
    });

    expect(fingerprint.deliberateExceptions).toEqual([
      'hero/full-bleed',
      'promo/asymmetric'
    ]);
    expect(fingerprint.deliberateExceptions).not.toContain('one-off/debug-banner');
  });

  it('does not emit redesign recommendations from fingerprint extraction', () => {
    const fingerprint = extractDesignFingerprint(observations, {
      numericTolerance: 2,
      minimumOccurrences: 2
    });

    expect('recommendations' in fingerprint).toBe(false);
    expect('suggestions' in fingerprint).toBe(false);
  });
});
