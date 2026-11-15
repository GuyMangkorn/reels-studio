import type {ReactNode} from 'react';
import type {Painter} from '../kit/painter';
import {Card, Lbl, Still} from './frame';
import {lookAtCam, sheetCam} from './palette';
import {paintBubble, paintHeli} from './analogy';
import {paintCutaway} from './cutaway';
import {paintGlobe} from './globe';
import {paintFlashSeabed, paintRedSea} from './redsea';
import {bedY, cableAt, paintSea} from './sea';
import {paintYard} from './yard';

// EDU-EP17-SHORT W3 thumbnails (Film, 2026-11-15; docs/sequence-workflow.md#look-thumbnails): two or three draft paintings per new location,
// each a different framing or light balance, from that location's first storyboard shot (rows EDU-EP17-ROWS-R1.1). The user picks one per
// location; the finished look frame LFnn is painted from the pick. Cameras are the sheet lines (sheetCam: sheet look-yaw) unless marked "alt".

export type Thumb = {paint: (p: Painter) => void; paper?: string; recon?: boolean; overlay?: ReactNode; shot: string; note: string};
export const MEASURE: Record<string, Record<string, number | string>> = {};
const lead = (id: string, a: {top: number; bottom: number; head: [number, number]} | null) => { if (a) MEASURE[id] = {leadTop: Math.round(a.top), leadBottom: Math.round(a.bottom), leadPx: Math.round(Math.min(1920, a.bottom) - Math.max(0, a.top)), headY: Math.round(a.head[1])}; };

// ---- LF01 SET-YARD17 (B01-SH01 end framing)
const cT1A = sheetCam([-0.30, 1.10, -0.55], 3, 1.95, 1.68, {f: 1000, hy: 640});
// alt: a true over-the-shoulder, camera 0.75 m behind-left of his head, so he is cropped at the waist at frame right and the phone reads bigger
const cT1B = lookAtCam([-0.85, 1.6, 1.0], [0, 1.1, -1.5], 950, 700);

// ---- LF02 SET-SEA17 (B01-SH03). The sheet end camera (at y -45, eye -43 at z -190) sits under the brief's floor (y_bed(-190) = -38.9);
// the thumbnails settle 1.5 m over the cable as the key state says ("the camera settles 1 m above the cable"); recorded for the W4 pass.
const cT2A = lookAtCam([cableAt(-184)[0] + 0.6, bedY(-184) + 1.2, -184], cableAt(-197), 950, 640, -18, 0.2);
const cT2B = lookAtCam([1.6, -6.0, -96], cableAt(-140), 900, 560, -30, 0.2);

// ---- LF04 bubble analogy (B02-SH03, L05 key state: the helicopter with one crate)
// sheet r 3.6 puts the lens 0.6 m behind his head (a black blob filling the corner); W3 pulls it to r 4.1 (recorded)
const cT4A = sheetCam([-0.3, 1.6, -3], 2, 4.1, 1.9, {f: 1000, hy: 980});
const bubbleShot = (p: Painter, c: typeof cT4A, at: [number, number], rx: number, ry: number, id: string) => {
  const a = paintYard(p, c, {spray: 0}); // B02: the spray is off (he stopped watering in B01-SH05)
  lead(id, a);
  const tail: [number, number] = a ? [a.head[0] - 40, a.headTop - 20] : [800, 1000];
  paintBubble(p, at, rx, ry, tail);
  paintHeli(p, [at[0] + rx * 0.08, at[1] - ry * 0.5], Math.min(rx, ry) * 0.3, 0.3);
};
// alt: camera lower and further back so his whole head and shoulders sit lower right and the yard reads under a bigger bubble
const cT4B = sheetCam([-0.3, 1.5, -3], 6, 4.4, 1.75, {f: 900, hy: 1100});

// ---- LF05 Red Sea surface (B05-SH01 start), LF06 flashback seabed (B05-SH02)
const cT5A = sheetCam([0, 4, 0], 70, 260, 4, {f: 1400, hy: 980});
const cT5B = sheetCam([0, 6, 0], 28, 210, 3, {f: 1300, hy: 940});
const cT6A = sheetCam([0, 0.2, 0], 25, 6, 1.4, {f: 1000, hy: 820});
const cT6B = lookAtCam([-1.5, 4.2, 4.2], [0.4, 0, -1.0], 950, 700, -38, 0.2);

// ---- LF07 cutaway block (B04-SH05 end camera; sheet look-yaw: negative = camera on the deep +x side)
const cT7A = sheetCam([0.3, -2.4, 0], -14, 13.8, 3.4, {f: 1150, hy: 380});
const cT7B = lookAtCam([4.6, 7.5, 11.5], [0.2, -2.6, 0], 1150, 760, -28);

export const THUMBS: Record<string, Thumb> = {
  T1A: {shot: 'B01-SH01 end', note: 'sheet camera: OTS behind him, phone left, bay and boats, 16:30 sun', paint: (p) => lead('T1A', paintYard(p, cT1A))},
  T1B: {shot: 'B01-SH01 end (alt)', note: 'close over-the-shoulder: his back and right arm cropped at frame right, phone and spray bigger, bay behind', paint: (p) => lead('T1B', paintYard(p, cT1B))},
  T1C: {shot: 'B01-SH01 end (alt)', note: 'close over-the-shoulder, golden late light (warmer sky and sea)', paint: (p) => lead('T1C', paintYard(p, cT1B, {light: {warm: 1}}))},
  T2A: {shot: 'B01-SH03 end', note: 'deep floor, 1.2 m over the glowing cable, looking down along it, pulses running away into the dark', paper: '#08192a', paint: (p) => paintSea(p, cT2A)},
  T2B: {shot: 'B01-SH03 mid (alt)', note: 'mid-descent at the shelf edge: sunlit sand above, the slope falling into the dark, the cable running down it', paper: '#08192a', paint: (p) => paintSea(p, cT2B)},
  T2C: {shot: 'B01-SH03 end', note: 'deep floor, lighter blue ambient (more of the floor reads, less black)', paper: '#08192a', paint: (p) => paintSea(p, cT2A, {light: {amb: 1}})},
  T3A: {shot: 'B01-SH04 end', note: 'sheet framing: whole globe r 340 px at (540, 900), Asia facing, lines and pulses lit, dark sky', paper: '#0e1830', paint: (p) => paintGlobe(p, {cx: 540, cy: 900, r: 340, lon: 108, lat: 12})},
  T3B: {shot: 'B01-SH04 end (alt)', note: 'closer: globe r 520 px fills the width, Indian Ocean to the Pacific, more line detail, bottom edge above the captions', paper: '#0e1830', paint: (p) => paintGlobe(p, {cx: 540, cy: 690, r: 520, lon: 112, lat: 10})},
  T4A: {shot: 'B02-SH03 L05', note: 'sheet framing: his head lower right, bubble in the top slot, toy helicopter lifting one crate', paint: (p) => bubbleShot(p, cT4A, [540, 520], 420, 300, 'T4A')},
  T4B: {shot: 'B02-SH03 L05 (alt)', note: 'bigger bubble (fills the width), his head and shoulders lower right, the bay under it', paint: (p) => bubbleShot(p, cT4B, [540, 560], 470, 380, 'T4B')},
  T5A: {shot: 'B05-SH01 start', note: 'sheet lens, pushed in (r 380 -> 260 m): from the stern quarter, grey sea, ship listing, thin smoke; label + card', paper: '#a9adad', recon: true, overlay: <><Lbl /><Card /></>, paint: (p) => paintRedSea(p, cT5A)},
  T5B: {shot: 'B05-SH01 (alt)', note: 'broadside, lower: the whole hull and the list read, chain from the bow ahead; label + card', paper: '#a9adad', recon: true, overlay: <><Lbl /><Card /></>, paint: (p) => paintRedSea(p, cT5B)},
  T6A: {shot: 'B05-SH02', note: 'sheet camera: low over the grey sand, three cables at 25 deg, still lit; label + card', paper: '#4a5e6a', recon: true, overlay: <><Lbl /><Card /></>, paint: (p) => paintFlashSeabed(p, cT6A)},
  T6B: {shot: 'B05-SH02 (alt)', note: 'higher, looking down: the three cables read as a set of parallel lines, one gone dark', paper: '#4a5e6a', recon: true, overlay: <><Lbl /><Card /></>, paint: (p) => paintFlashSeabed(p, cT6B, {dark: 1})},
  T7A: {shot: 'B04-SH05 end', note: 'sheet end camera: block from the front and deep end, boats left, deep cable right', paper: '#e9f2f6', paint: (p) => paintCutaway(p, cT7A)},
  T7B: {shot: 'B04-SH05 end (alt)', note: 'higher three-quarter: more of the water top and the inside, block larger', paper: '#e9f2f6', paint: (p) => paintCutaway(p, cT7B)},
};
export const THUMB_IDS = Object.keys(THUMBS);
export const THUMB_STILLS = Object.fromEntries(THUMB_IDS.map((id) => [id, () => {
  const t = THUMBS[id];
  return <Still paint={t.paint} paper={t.paper} recon={t.recon} overlay={t.overlay} />;
}]));
export {Card, Lbl};
