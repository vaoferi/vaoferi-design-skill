import { describe, expect, it } from 'vitest';
import {
  assertStageCanRun,
  assertStageWriteAllowed
} from '../../src/core/stage-guard.js';
import { DESIGN_STAGES, type DesignStageStatus } from '../../src/core/stages.js';

describe('stage guard', () => {
  it('forbids /align from writing frame-owned state', () => {
    expect(() =>
      assertStageWriteAllowed('align', '.design/frame.json')
    ).toThrow('STAGE_WRITE_FORBIDDEN');
  });

  it('allows /frame to write frame-owned state', () => {
    expect(() =>
      assertStageWriteAllowed('frame', '.design/frame.json')
    ).not.toThrow();
  });

  it('blocks a later stage while any required predecessor is unresolved', () => {
    const status: DesignStageStatus = {
      frame: 'complete',
      rhythm: 'complete',
      place: 'pending'
    };

    expect(() => assertStageCanRun('align', status)).toThrow(
      'STAGE_PREDECESSOR_INCOMPLETE:place'
    );
  });

  it('allows a stage when every predecessor is complete', () => {
    const status: DesignStageStatus = {};
    const target = 'responsive';
    const targetIndex = DESIGN_STAGES.indexOf(target);

    for (const predecessor of DESIGN_STAGES.slice(0, targetIndex)) {
      status[predecessor] = 'complete';
    }

    expect(() => assertStageCanRun(target, status)).not.toThrow();
  });

  it('lets /frame start without predecessor state', () => {
    expect(() => assertStageCanRun('frame', {})).not.toThrow();
  });
});
