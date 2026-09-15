import {
  DESIGN_STAGES,
  STAGE_STATE_OWNERS,
  type DesignStage,
  type DesignStageStatus
} from './stages.js';

function basename(path: string): string {
  const normalized = path.replace(/\\/gu, '/');
  return normalized.slice(normalized.lastIndexOf('/') + 1);
}

export function assertStageCanRun(
  stage: DesignStage,
  status: DesignStageStatus
): void {
  const stageIndex = DESIGN_STAGES.indexOf(stage);

  for (const predecessor of DESIGN_STAGES.slice(0, stageIndex)) {
    if (status[predecessor] !== 'complete') {
      throw new Error(`STAGE_PREDECESSOR_INCOMPLETE:${predecessor}`);
    }
  }
}

export function assertStageWriteAllowed(
  stage: DesignStage,
  targetStateFile: string
): void {
  const owner = STAGE_STATE_OWNERS[basename(targetStateFile)];

  if (owner !== undefined && owner !== stage) {
    throw new Error(`STAGE_WRITE_FORBIDDEN:${stage}:${owner}:${targetStateFile}`);
  }
}
