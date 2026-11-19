import type {PaintedShot} from '../shot';
import {edu26CoverShots as shots} from '../edu26/cover-shots';

// EDU-EP26-SHORT cover-only plates (Film, 2026-11-19; cover-design skill pick 1). Not imported by the episode's inventory
// (src/painted/shots/edu26.tsx), so its per-scene keys keep hashing only the episode's own shots.
export const edu26CoverShots: PaintedShot[] = shots;
