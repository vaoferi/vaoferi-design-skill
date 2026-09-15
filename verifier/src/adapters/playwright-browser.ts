import {
  chromium,
  type Browser,
  type Page
} from '@playwright/test';
import type {
  BrowserAdapter,
  GeometryBox,
  GeometrySnapshot,
  ViewportState
} from '../browser/browser-adapter.js';

export class PlaywrightBrowserAdapter implements BrowserAdapter {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private viewport: ViewportState | null = null;

  async open(url: string): Promise<void> {
    if (this.browser !== null || this.page !== null) {
      throw new Error('BROWSER_ADAPTER_ALREADY_OPEN');
    }

    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async setViewport(state: ViewportState): Promise<void> {
    if (this.page === null) {
      throw new Error('BROWSER_ADAPTER_NOT_OPEN');
    }

    await this.page.setViewportSize({
      width: state.width,
      height: state.height
    });
    this.viewport = state;
  }

  async measure(selectors: string[]): Promise<GeometrySnapshot> {
    if (this.page === null || this.viewport === null) {
      throw new Error('BROWSER_ADAPTER_VIEWPORT_NOT_READY');
    }

    const scrollWidth = await this.page.evaluate(() =>
      Math.max(
        document.documentElement.scrollWidth,
        document.body?.scrollWidth ?? 0
      )
    );

    const boxes: Record<string, GeometryBox> = {};

    for (const selector of selectors) {
      const box = await this.page.locator(selector).first().boundingBox();
      if (box !== null) {
        boxes[selector] = {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height
        };
      }
    }

    return {
      viewport: this.viewport,
      scrollWidth,
      boxes
    };
  }

  async close(): Promise<void> {
    try {
      await this.browser?.close();
    } finally {
      this.browser = null;
      this.page = null;
      this.viewport = null;
    }
  }
}
