import type {PaintedShot} from '../shot';
import {edu21CoverShots as shots} from '../edu21/cover-shots';

// EDU-EP21-SHORT cover-only plates (Film, 2026-11-17; cover-design skill pick 1). Not imported by the episode's inventory
// (src/painted/shots/edu21.tsx), so its per-scene keys keep hashing only the episode's own shots.
export const edu21CoverShots: PaintedShot[] = shots;
