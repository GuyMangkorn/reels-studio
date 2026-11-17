import type {PaintedShot} from '../shot';
import {edu22CoverShots as shots} from '../edu22/cover-shots';

// EDU-EP22-SHORT cover-only plates (Film, 2026-11-17; cover-design skill pick 1). Not imported by the episode's inventory
// (src/painted/shots/edu22.tsx), so its per-scene keys keep hashing only the episode's own shots.
export const edu22CoverShots: PaintedShot[] = shots;
