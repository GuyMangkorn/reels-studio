// EDU-EP16-SHORT palette (brief EDU-EP16-BRIEF-R2, colour and value key; Film W3 look stills, 2026-11-14). Episode-local; Boss hardens.

/** Thought-space `TH` (IM1-IM4, W-STRIKE). `rimLevel` is the rim's normal value as a mix of `void` toward `rim` (a pale wash over the void). */
export const TH = {
  void: '#04060c',
  voidLift: '#0a0f1c',
  nebula: '#16233a',
  nebula2: '#1d2c45',
  dust: '#5a6780',
  rim: '#8a96b0',
  rimLevel: 0.6,
  bubbleIn: '#0d1322',
  bubbleEdge: '#5d6a86',
  amber: '#ffb35a',
  amberDeep: '#c46a1e',
  core: '#fff1d6',
  cold: '#bfeaff',
  coldMid: '#5f8fb0',
  coldDeep: '#1c3550',
  body: '#05060a',
} as const;

/** Forest `F` (IM4, SET-FOREST16): no warm anywhere. */
export const FOREST = {
  sky: '#0a1120',
  canopy: '#05080d',
  trunk: '#06090f',
  trunkRim: '#3c4c62',
  mistLow: '#2b3a4e',
  mistHigh: '#55657a',
  light: '#9fb0c8',
  ground: '#0b0f15',
  litter: '#1a212b',
} as const;
