import {SHOT_ROWS} from '../../painted/worldfog/space';
import type {Scene, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * WFOG-EP01-SHORT (script WFOG-SCRIPT-R2, brief VB-WFOG-EP01-SHORT-R3, scene sheets WFOG-EP01-SHORT-SS-R3.2, Full tier):
 * painted 2D plates (`src/painted/shots/worldfog.tsx`) on the SS-R3.1 global ranges, one scene per story scene S01-S04.
 * Boss placeholder timeline: picture only (no narration, captions, music or SFX; Editor owns them and re-times after
 * TTS, PD04). Each plate samples the story clocks at its own shot start, so moving a cue never changes its picture.
 * Ending: hard cut on G2609 (MK-WF-DEP-07): `C_seamless` with `loopBlendFrames: 0` has no hold, no fade and no blend.
 * Fiction marker `เรื่องสมมติ • EP1` on S01-SH01 only (ST-08). Render with `--gl=angle`.
 */
const FPS = 30;
const MARKER = 'เรื่องสมมติ • EP1';

export const worldFogTimeline: Timeline = ['S01', 'S02', 'S03', 'S04'].map((scene): Scene => {
  const rows = SHOT_ROWS.filter((r) => r.id.startsWith(`${scene}-`));
  const g0 = rows[0].g0, end = rows[rows.length - 1].g0 + rows[rows.length - 1].len;
  return {
    durationSec: (end - g0) / FPS, bg: 'none', actors: [], subtitle: '',
    painted: {shots: rows.map((r) => ({shot: `WFOG-${r.id}`, atSec: (r.g0 - g0) / FPS, ...(r.id === 'S01-SH01' ? {label: MARKER} : {})}))},
  };
});

const worldFog: EpisodeVideos = {
  episode: 'world-fog',
  videos: [{id: 'WFOG-EP01-SHORT', format: 'short', timeline: worldFogTimeline, ending: 'C_seamless', loopBlendFrames: 0}],
};
export default worldFog;
