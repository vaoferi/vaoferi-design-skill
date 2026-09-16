export const DESIGN_STAGES = [
  'frame',
  'rhythm',
  'place',
  'align',
  'flow',
  'reference',
  'visual',
  'responsive',
  'verify'
] as const;

export type DesignStage = (typeof DESIGN_STAGES)[number];
export type DesignStageState = 'pending' | 'complete' | 'blocked';
export type DesignStageStatus = Partial<Record<DesignStage, DesignStageState>>;

export const STAGE_STATE_OWNERS: Readonly<Record<string, DesignStage>> = {
  'frame.json': 'frame',
  'rhythm.json': 'rhythm',
  'place.json': 'place',
  'align.json': 'align',
  'flow.json': 'flow',
  'reference.json': 'reference',
  'visual.json': 'visual',
  'responsive.json': 'responsive',
  'verify.json': 'verify'
};
