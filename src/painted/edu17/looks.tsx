import type {Painter} from '../kit/painter';
import {Card, Lbl, Still} from './frame';
import {paintBubble, paintHeli} from './analogy';
import {paintCutaway} from './cutaway';
import {paintGlobe} from './globe';
import {paintFlashSeabed, paintRedSea} from './redsea';
import {paintSea} from './sea';
import {cLF01, cLF01R, cLF02, cLF04, cLF05, cLF06, cutCam} from './looks-cams';
import {paintYard} from './yard';
import type {YCam} from '../kit/ycam';
import type {ReactNode} from 'react';

// EDU-EP17-SHORT W3 FINISHED look frames LF01-LF07 (Film, 2026-11-15; docs/sequence-workflow.md W3), painted from the user's thumbnail picks
// (structured questions 2026-11-15): LF01 = T1A, LF02 = T2B, LF03 = T3B, LF04 = T4B, LF05 = T5B, LF06 = T6A, LF07 = T7B; plus the B01-SH05
// reverse still (LF01R) and the N12 three-still strip of the cutaway camera move (LF07S1-S3). Cameras are the picks' cameras with the Q8
// changes the user accepted; each change is recorded in the brief change log.

type Look = {paint: (p: Painter) => void; paper?: string; recon?: boolean; overlay?: ReactNode; shot: string; note: string};
export const MEASURE: Record<string, Record<string, number>> = {};
const lead = (id: string, a: {top: number; bottom: number; head: [number, number]; headTop: number; chin: number} | null) => {
  if (a) MEASURE[id] = {leadTop: Math.round(a.top), leadBottom: Math.round(a.bottom), leadPx: Math.round(Math.min(1920, a.bottom) - Math.max(0, a.top)), headTop: Math.round(a.headTop), chin: Math.round(a.chin)};
};

const bubbleShot = (p: Painter, c: YCam, at: [number, number], rx: number, ry: number, id: string) => {
  const a = paintYard(p, c, {spray: 0, man: {face: 'neutral', arms: 'drop'}});
  lead(id, a);
  const tail: [number, number] = a ? [a.head[0] - 60, a.headTop - 10] : [800, 1000];
  paintBubble(p, at, rx, ry, tail);
  paintHeli(p, [at[0] + rx * 0.08, at[1] - ry * 0.5], Math.min(rx, ry) * 0.3, 0.3);
};

export const LOOKS: Record<string, Look> = {
  LF01: {shot: 'B01-SH01 end', note: 'T1A finished: OTS behind him watering the chilli pot, phone on the plank, bay with boats side-on', paint: (p) => lead('LF01', paintYard(p, cLF01))},
  LF01R: {shot: 'B01-SH05', note: 'reverse: his front-left three-quarter, surprised, hose end dropped; house and terrace behind', paint: (p) => lead('LF01R', paintYard(p, cLF01R, {spray: 0, man: {facing: [0, -1], face: 'surprised', arms: 'drop'}}))},
  LF02: {shot: 'B01-SH03 mid', note: 'T2B finished: shelf edge, sunlit sand above, slope into the deep, the cable running down it', paper: '#08192a', paint: (p) => paintSea(p, cLF02, {fish: [-3, -5.5, -112]})},
  LF03: {shot: 'B01-SH04 end', note: 'T3B finished: globe filling the width, lines and pulses, bottom above the caption band', paper: '#0e1830', paint: (p) => paintGlobe(p, {cx: 540, cy: 640, r: 490, lon: 112, lat: 10})},
  LF04: {shot: 'B02-SH03 L05', note: 'T4B finished: big bubble with the toy helicopter, his head and shoulders lower right, bay under it', paint: (p) => bubbleShot(p, cLF04, [520, 540], 450, 340, 'LF04')},
  LF05: {shot: 'B05-SH01', note: 'T5B finished: broadside, listing ship with a readable superstructure, thin smoke; grade, label, card', paper: '#a9adad', recon: true, overlay: <><Lbl /><Card /></>, paint: (p) => paintRedSea(p, cLF05)},
  LF06: {shot: 'B05-SH02', note: 'T6A finished: low over grey sand, three cables lit; grade, label, card', paper: '#4a5e6a', recon: true, overlay: <><Lbl /><Card /></>, paint: (p) => paintFlashSeabed(p, cLF06)},
  LF07: {shot: 'B04-SH05 end', note: 'T7B finished: higher three-quarter on the cutaway block, boats left, deep cable right', paper: '#e9f2f6', paint: (p) => paintCutaway(p, cutCam(1))},
  LF07S1: {shot: 'B04-SH05 start', note: 'N12 strip 1/3: start of the yaw arc (8 deg back, 15 % closer)', paper: '#e9f2f6', paint: (p) => paintCutaway(p, cutCam(0))},
  LF07S2: {shot: 'B04-SH05 mid', note: 'N12 strip 2/3: mid arc', paper: '#e9f2f6', paint: (p) => paintCutaway(p, cutCam(0.5))},
  LF07S3: {shot: 'B04-SH05 end', note: 'N12 strip 3/3: end of the arc (= LF07)', paper: '#e9f2f6', paint: (p) => paintCutaway(p, cutCam(1))},
};
export const LOOK_IDS = Object.keys(LOOKS);
export const LOOK_STILLS = Object.fromEntries(LOOK_IDS.map((id) => [id, () => {
  const t = LOOKS[id];
  return <Still paint={t.paint} paper={t.paper} recon={t.recon} overlay={t.overlay} />;
}]));
