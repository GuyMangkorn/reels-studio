import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {FPS, SHOTS} from '../edu11/clock';
import {paperOf, Shot} from '../edu11/shots';
import {CAPTION_OUTLINE} from '../../scenes/media';

// EDU-EP11 inventory (Editor W5.3 Draft): one plate per shot, ID `EDU11-<shot id>`. The brush layer, HUD, diagram layers, inset and stamp are Boss's pure `Shot` (src/painted/edu11/shots.tsx),
// drawn at the composition frame G = shot start + local frame; the plate's own canvas stays paper. Hard cuts only; captions and the channel mark come from the timeline.
// Channel mark @TamMaiLa (chrome default position: top 128, left 120, 22 px) drawn here with the edu stroke so it reads on the sepia 1854/1857 shots; the timeline sets chrome.channelLabel false.
const ChannelMark = () => <span lang="th" style={{position: 'absolute', top: 128, left: 120, fontSize: 24, fontWeight: 600, color: '#fff1da', fontFamily: 'Noto Sans Thai, sans-serif', WebkitTextStroke: '6px #2b1a12', paintOrder: 'stroke fill', textShadow: CAPTION_OUTLINE.textShadow}}>@TamMaiLa</span>;
export const edu11PlateId = (id: string) => `EDU11-${id}`;
export const edu11Shots: PaintedShot[] = SHOTS.map(([id, start]) => ({
  id: edu11PlateId(id), serves: [id], paper: paperOf(id), camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Shot g={start + Math.round(tl * FPS)} /><ChannelMark /></div>,
}));
