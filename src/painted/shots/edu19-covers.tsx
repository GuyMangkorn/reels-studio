import type {PaintedShot} from '../shot';
import {shotCV1, shotCV2} from '../edu19/cover-shots';

// edu19 cover inventory (EDU-EP19-SHORT cover redo V2, Boss 2026-11-16): the cover-only paintings EDU19-CV1, EDU19-CV2 (cover-design skill
// section 2 "Source"). Kept apart from the episode inventory ./edu19.tsx, so EDU-EP19-SHORT never selects this module and its scene keys stay
// as they were; only the cover compositions (src/videos/covers) name these IDs.
export const edu19CoverShots: PaintedShot[] = [shotCV1, shotCV2];
