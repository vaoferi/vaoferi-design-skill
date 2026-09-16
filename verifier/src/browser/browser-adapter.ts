export type ViewportOrientation = 'portrait' | 'landscape';

export interface ViewportState {
  width: number;
  height: number;
  orientation: ViewportOrientation;
}

export interface GeometryBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GeometrySnapshot {
  viewport: ViewportState;
  scrollWidth: number;
  boxes: Record<string, GeometryBox>;
}

export interface BrowserAdapter {
  open(url: string): Promise<void>;
  setViewport(state: ViewportState): Promise<void>;
  measure(selectors: string[]): Promise<GeometrySnapshot>;
  close(): Promise<void>;
}
