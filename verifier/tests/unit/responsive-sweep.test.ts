import { describe, expect, it } from 'vitest';
import type {
  BrowserAdapter,
  GeometrySnapshot,
  ViewportState
} from '../../src/browser/browser-adapter.js';
import {
  generateViewportStates,
  generateWidths,
  runResponsiveSweep
} from '../../src/browser/responsive-sweep.js';
import { evaluateGeometry } from '../../src/browser/geometry-rules.js';

class FakeBrowserAdapter implements BrowserAdapter {
  opened = false;
  closed = false;
  visited: ViewportState[] = [];
  current: ViewportState | null = null;

  async open(_url: string): Promise<void> {
    this.opened = true;
  }

  async setViewport(state: ViewportState): Promise<void> {
    this.current = state;
    this.visited.push(state);
  }

  async measure(_selectors: string[]): Promise<GeometrySnapshot> {
    if (this.current === null) throw new Error('NO_VIEWPORT');
    return {
      viewport: this.current,
      scrollWidth: this.current.width,
      boxes: {}
    };
  }

  async close(): Promise<void> {
    this.closed = true;
  }
}

describe('responsive sweep', () => {
  it('generates every integer CSS-pixel width without sampling', () => {
    expect(generateWidths(320, 323)).toEqual([320, 321, 322, 323]);
  });

  it('expands every width across contract-defined orientation/aspect profiles', () => {
    const states = generateViewportStates({
      minWidth: 320,
      maxWidth: 321,
      breakpoints: [320],
      profiles: [
        { orientation: 'portrait', aspectRatio: 9 / 16 },
        { orientation: 'landscape', aspectRatio: 16 / 9 }
      ]
    });

    expect(states).toEqual([
      { width: 320, height: 569, orientation: 'portrait' },
      { width: 320, height: 180, orientation: 'landscape' },
      { width: 321, height: 571, orientation: 'portrait' },
      { width: 321, height: 181, orientation: 'landscape' }
    ]);
  });

  it('actually visits every generated viewport state', async () => {
    const adapter = new FakeBrowserAdapter();
    const result = await runResponsiveSweep({
      adapter,
      url: 'https://example.test',
      config: {
        minWidth: 320,
        maxWidth: 322,
        profiles: [{ orientation: 'landscape', aspectRatio: 16 / 9 }]
      },
      geometry: { horizontalOverflow: true }
    });

    expect(adapter.visited.map((state) => state.width)).toEqual([320, 321, 322]);
    expect(result.testedStates).toBe(3);
    expect(result.findings).toEqual([]);
    expect(adapter.opened).toBe(true);
    expect(adapter.closed).toBe(true);
  });

  it('detects horizontal overflow from measured geometry', () => {
    const violations = evaluateGeometry(
      {
        viewport: { width: 320, height: 640, orientation: 'portrait' },
        scrollWidth: 321,
        boxes: {}
      },
      { horizontalOverflow: true }
    );

    expect(violations).toContainEqual(
      expect.objectContaining({ rule: 'horizontal-overflow' })
    );
  });
});
