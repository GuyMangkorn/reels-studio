import {BRIDGE_N} from '../../painted/edu32/bridge';
import {SH02_N} from '../../painted/edu32/b03-sh02';
import {SH03_N} from '../../painted/edu32/b03-sh03';
import {SH04_N} from '../../painted/edu32/b03-sh04';
import {B04_N} from '../../painted/edu32/b04-sh01';
import {B02SH01_N} from '../../painted/edu32/b02-sh01';
import {B02SH02_N} from '../../painted/edu32/b02-sh02';
import {B02SH03_N} from '../../painted/edu32/b02-sh03';
import {B01_SH01_N} from '../../painted/edu32/b01-sh01';
import {B01_SH02_N} from '../../painted/edu32/b01-sh02';
import {B01_SH03_N} from '../../painted/edu32/b01-sh03';
import {B04SH02_N} from '../../painted/edu32/b04-sh02';
import {B04SH03_N} from '../../painted/edu32/b04-sh03';
import {B06SH02_N} from '../../painted/edu32/b06-sh02';
import {B06SH03_N} from '../../painted/edu32/b06-sh03';
import {B05SH01_N} from '../../painted/edu32/b05-sh01';
import {B05SH02_N} from '../../painted/edu32/b05-sh02';
import {B05SH03_N} from '../../painted/edu32/b05-sh03';
import {B06SH01_N} from '../../painted/edu32/b06-sh01';

/**
 * EDU-EP32-SHORT shot table = EDU-EP32-SHEET-R1 "Shot map" (scripts/edu-series/ep32/short/timed-sheet.md), 19 shots, G [start, end), 1689 f.
 * `N` is the plate's own frame count (src/painted/edu32/*); index.ts checks `N` against the sheet length so a plate that grows or shrinks fails loudly.
 */
export const FPS = 30;
export const DURATION = 1689;
export type Shot32 = {id: string; start: number; len: number; N: number};
const t: [string, number, number, number][] = [
  ['B01-SH01', 0, 81, B01_SH01_N], ['B01-SH02', 81, 148, B01_SH02_N], ['B01-SH03', 229, 99, B01_SH03_N],
  ['B02-SH01', 328, 108, B02SH01_N], ['B02-SH02', 436, 64, B02SH02_N], ['B02-SH03', 500, 74, B02SH03_N],
  ['B03-SH01', 574, 72, BRIDGE_N], ['B03-SH02', 646, 43, SH02_N], ['B03-SH03', 689, 97, SH03_N], ['B03-SH04', 786, 94, SH04_N],
  ['B04-SH01', 880, 113, B04_N], ['B04-SH02', 993, 79, B04SH02_N], ['B04-SH03', 1072, 59, B04SH03_N],
  ['B05-SH01', 1131, 79, B05SH01_N], ['B05-SH02', 1210, 117, B05SH02_N], ['B05-SH03', 1327, 84, B05SH03_N],
  ['B06-SH01', 1411, 172, B06SH01_N], ['B06-SH02', 1583, 68, B06SH02_N], ['B06-SH03', 1651, 38, B06SH03_N],
];
export const EDU32_SHOTS: readonly Shot32[] = t.map(([id, start, len, N]) => ({id, start, len, N}));

/**
 * Peak strength of the caption shade (production-requirements#caption-backdrop: the lowest value that reads, plate band y 1230-1344 limits mean 0.25 / p95 0.40, measured with
 * caption-zone.py on EDU32-SHORT-PLATES, see build-notes). `default` unless the shot has a value or a ramp of [G, strength] points (held outside the points).
 */
export const SHADE: {default: number; shots: {[shot: string]: number}; ramps: {[shot: string]: readonly (readonly [number, number])[]}} = {
  default: 0.2, shots: {}, ramps: {'B03-SH01': [[574, 0.38], [581, 0.38], [588, 0.2]]},
};
