// EDU-EP14 B01 shots 1-5 (storyboard EDU-EP14-ROWS-R4.1): the lip pull-back (SP3), the dial snap, the crane to the cloud base (SP3), the cloud macro and the cloud column.
import {camMove, camOf} from '../kit/cam-moves';
import type {YCam} from '../kit/ycam';
import {camPoint} from '../kit/ycam';
import {Edge, CalmBand, Pool} from './look';
import {Lbl, ColumnDiagram} from './diagram';
import {NoAirDial} from './gauge';
import {GIRL_AT} from './palette';
import {LEAD_X, paintBus} from './bus';
import {columnCam, columnMeasure, paintColumn} from './column';
import {paintCloudMacro} from './cloudmacro';
import {paintCloudDeck} from './sky';
import {defShot} from './frame';
import {lin, noairSH02, sh05Draw, sm} from './clock';

const near = (c: YCam, n: number): YCam => ({...c, near: n});
const lightPool = (c: YCam, id: string) => <Pool cam={c} at={[-0.7, 1.4, -1.6]} r={520} color="#cfe6ee" level={0.5} id={id} />;

// ---- 1. S01-B01-SH01 [0, 68): lip close -> pull-back to the girl; the hit on "อากาศ" at +55 (rain and colour die, grade drains +55-+63, LBL from +56).
export const moveSH01 = camMove([[LEAD_X, 2.38, 0.1], [0.25, 1.2, 0.05]], [14, 12], [0.1, 3.0], [2.36, 1.2], {f: 1200, hy: 700, ease: [16 / 67, 50 / 67]});
// hy 700 -> 670 follows the same ease
export const camSH01 = (L: number): YCam => { const c = near(camOf(moveSH01, L / 67), 0.02); return {...c, hy: 700 - 30 * sm(16, 50, L)}; };
export const HIT = 55;
defShot('S01-B01-SH01', (L) => {
  const real = L < HIT, c = camSH01(L);
  return {
    paint: (p) => paintBus(p, c, {world: real ? 'real' : 'noair', t: real ? L / 30 + 0.4 : 0.4, face: real ? 'tired' : 'neutral', rain: real ? 260 : 0, lead: {swell: 0.7 + 0.3 * sm(0, 14, L)}}),
    grade: sm(HIT, HIT + 8, L),
    children: <>{lightPool(c, 'sh01pool')}<Edge color="#10181b" level={0.4} id="sh01edge" /><CalmBand level={0.4} id="sh01calm" /></>,
    overlay: L >= HIT + 1 ? <Lbl /> : undefined,
  };
});

// ---- 2. S01-B01-SH02 [63, 180): low close, grey, G1 dial pops in at +10 (0), snaps to 700 on "เจ็ดร้อย" +76..+80, rewinds +90..+103.
export const camSH02 = (L: number): YCam => camOf(camMove([0.25, 1.05, 0.05], [8, 4], [1.2, 1.05], 0.75, {pitch: [22, 22], f: 1000, hy: 980}), L / 128);
defShot('S01-B01-SH02', (L) => {
  const c = camSH02(L);
  return {
    paint: (p) => paintBus(p, c, {world: 'noair', t: 0.4, face: 'neutral', faceState: {look: [0.0, 0.8]}}),
    grade: 1,
    children: <>{lightPool(c, 'sh02pool')}<Edge color="#10181b" level={0.4} id="sh02edge" /><CalmBand level={0.36} id="sh02calm" /></>,
    overlay: <><Lbl /><NoAirDial v={noairSH02(L)} pop={lin(10, 14, L)} /></>,
  };
});

// ---- 3. S01-B01-SH03 [180, 260): crane up past the lip and the roof to the cloud base (SP3). G1 fades out +0..+5.
export const moveSH03 = camMove([[0.25, 1.2, 0.05], [0.25, 7.0, 0.05]], [12, 10], [3.0, 3.4], [1.2, 3.6], {pitch: [0, 62], f: 1200, hy: 670, ease: [0, 82 / 87]});
export const camSH03 = (L: number): YCam => { const c = camOf(moveSH03, L / 87), u = sm(0, 82, L); return {...c, hy: 670 + 90 * u}; };
defShot('S01-B01-SH03', (L) => {
  const c = camSH03(L), up = sm(33, 77, L);
  return {
    paint: (p) => paintBus(p, c, {world: 'noair', t: 0.4, face: 'neutral', sky: (q, cc) => paintCloudDeck(q, cc, up)}),
    grade: 1,
    children: <>{lightPool(c, 'sh03pool')}<Edge color="#10181b" level={0.4} id="sh03edge" /><CalmBand level={0.36} id="sh03calm" /></>,
    overlay: <><Lbl />{L < 5 && <NoAirDial v={0} pop={1 - lin(0, 5, L)} />}</>,
  };
});

// ---- 4. S01-B01-SH04 [260, 303): cloud macro, the hero drop swells and lets go on "หลุด" (+17).
defShot('S01-B01-SH04', (L) => ({
  paint: (p) => paintCloudMacro(p, {L, world: 'noair'}),
  grade: 1,
  children: <><Edge color="#10181b" level={0.3} id="sh04edge" /><CalmBand level={0.4} id="sh04calm" /></>,
  overlay: <Lbl />,
}));

// ---- 5. S01-B01-SH05 [303, 358): long-lens elevation, bracket + dotted line + pin, label "~2 กม." from +29.
export const camSH05 = (L: number): YCam => columnCam(8370 + (7900 - 8370) * lin(0, 60, L), 1000);
defShot('S01-B01-SH05', (L) => {
  const c = camSH05(L), m = columnMeasure(c), d = sh05Draw(L);
  return {
    paint: (p) => paintColumn(p, c),
    grade: 1,
    children: <><Edge color="#10181b" level={0.25} id="sh05edge" /><CalmBand level={0.6} id="sh05calm" /></>,
    overlay: <><ColumnDiagram baseY={m.baseY} groundY={m.groundY} label={d.label} ringAt={d.ring} bracket={d.bracket} dotted={d.dotted} pin={d.pin} /><Lbl /></>,
  };
});
void GIRL_AT; void camPoint;
