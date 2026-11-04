import {AbsoluteFill} from 'remotion';
import {Grain, CaptionShade} from '../kit/screen';
import {toScreen, type Camera} from '../kit/camera';
import type {PaintedShot} from '../shot';
import {StateGrade} from '../everyone-gone/ep02/look';
import {EG2_SHOTS, SOI_NOTICE_C, SOI_NOTICE_K, plateOf, type Eg2ShotId} from '../everyone-gone/ep02/shots';
import {POSTER} from '../everyone-gone/ep02/places';

// EG-EP02-SHORT (EG2-SC-R2.0, rows SS-R2.1, voice T-v4) timeline adapter, Editor W5.3 (3 Nov 2026). One registry plate per shot, ID `EG2-<shot id>`,
// wrapping Boss's pure `plateOf(id, f)` (src/painted/everyone-gone/ep02/shots.tsx). The timeline needs the one shared BrushCanvas of PaintedStage, so
// Boss's standalone `ShotPlate` is not mounted; this file reproduces its layers over the plate: state grade(s), grain, the poster header `ตามหา`
// (VD07), the S05 end black, and (Editor) the `CaptionShade` band gated to the shot's caption cues (delivery.md EP02 decision).
const FPS = 30;
const PAPER = '#e9e6e0';
const frameOf = (tl: number) => Math.round(tl * FPS);

/** Caption block centre and shade centre of EP02 (user 3 Nov 2026, S01-B02-SH03 note: captions 50 px lower than the 1248 bottom-edge layout, centre 1164 -> 1214; 3 lines still end at y 1340 <= 1344). */
export const EG2_CAPTION_CENTRE_Y = 1214;

export const eg2PlateId = (id: string) => `EG2-${id}`;

/**
 * Spoken lines on the composition clock (voice T-v4, store EG/narration/EG-EP02-SHORT-narration-B-x108-tight-v4-meta.json: [start, end) frames, round(sec x 30)).
 * Text is the verbatim script wording (ep02-script.md R1.2); `\n` only replaces the space after `…` for the two-line caption.
 */
export const EG2_LINES: [number, number, string][] = [
  [0, 123, 'กรุงเทพฯ เช้านี้ ไม่มีใครเหลือเลย…\nยกเว้นคุณ'],
  [133, 202, 'คุณดึงฮู้ดเสื้อตัวโปรด… ขึ้นคลุมหัว'],
  [210, 284, 'ทั้งเยาวราช… คุณไม่เห็นใครสักคน'],
  [292, 382, 'คุณไม่รีบ…\nเช้านี้ไม่มีที่ไหนต้องไป'],
  [402, 571, 'ที่ท่าเรือ คุณได้ยินแค่เสียงน้ำ…\nกับอะไรไกลๆ เหมือนคนคุยกัน'],
  [582, 659, 'แต่พวงมาลัยบนศาลเจ้า… ยังสดอยู่'],
  [667, 696, 'ธูปยังมีควัน'],
  [703, 798, 'กระดาษขาวแผ่นหนึ่ง…\nติดอยู่ทุกที่ที่คุณผ่าน'],
  [815, 906, 'เหมือนใครบางคน…\nเพิ่งเดินเส้นทางนี้ไปก่อนคุณ'],
  [919, 1056, 'ที่เสาไฟปากซอยบ้านคุณ…\nกระดาษแบบเดียวกัน ติดซ้อนกันหลายแผ่น'],
  [1063, 1108, 'แผ่นบนสุด… คว่ำหน้าอยู่'],
  [1157, 1210, 'แล้วลมก็พลิกมันกลับมา'],
  [1226, 1293, 'บนนั้นเขียนว่า… ตามหา'],
  [1300, 1394, 'คนในรูปหันหลังอยู่…\nแต่คุณจำเสื้อตัวนั้นได้'],
  [1423, 1501, 'แล้วทุกที่… ก็ค่อยๆ เต็มไปด้วยผู้คน'],
  [1508, 1636, 'พวกเขาเดินผ่านกระดาษแผ่นนั้น…\nเดินผ่านข้างคุณ เหมือนทุกเช้า'],
  [1644, 1731, 'คนที่เดินเส้นทางนี้ก่อนคุณทุกเช้า…\nคือแม่'],
  [1741, 1789, 'เมืองนี้ไม่เคยเงียบเลย…'],
  [1802, 1849, 'มันแค่ไม่ได้ยินคุณอีกแล้ว'],
];

const starts = EG2_SHOTS.reduce<number[]>((a, [, n], i) => [...a, i ? a[i - 1] + EG2_SHOTS[i - 1][1] : 0], []);
/** Caption cues clipped to one shot, in shot-local seconds, for the shade band. */
const shadeCues = (shotIndex: number): [number, number][] => {
  const a = starts[shotIndex], b = a + EG2_SHOTS[shotIndex][1];
  return EG2_LINES.filter(([s, e]) => s < b && e + 6 > a).map(([s, e]) => [(Math.max(s, a) - a) / FPS, (Math.min(e + 6, b) - a) / FPS]);
};

const Header = ({camera, sx, mini}: {camera: Camera; sx: number; mini?: boolean}) => {
  if (sx <= 0.02) return null;
  const k = mini ? SOI_NOTICE_K : 1, [x, y] = toScreen(camera, mini ? [(POSTER.x - 540) * k + SOI_NOTICE_C[0], (POSTER.y + 28 - 594) * k + SOI_NOTICE_C[1]] : [POSTER.x, POSTER.y + 28]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: POSTER.w, transformOrigin: '0 0', transform: `scale(${camera.s * k})`, pointerEvents: 'none'}}>
      <div style={{transformOrigin: 'left center', transform: `scaleX(${sx})`, textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 118, lineHeight: 1.1, color: '#1d1a17', mixBlendMode: 'multiply'}}>ตามหา</div>
    </div>
  );
};

const shotOf = (id: Eg2ShotId, index: number): PaintedShot => {
  const cues = shadeCues(index);
  return {
    id: eg2PlateId(id),
    serves: [id],
    paper: PAPER,
    camera: (tl) => plateOf(id, frameOf(tl)).cam,
    // `plate.clock` (S02-B01-SH02: the smoke is 20 f old at the cut) only ages the painter's ambient clock; `shot.clock` would also shift the camera and the plate frame.
    paint: (p, {tl}) => {
      const plate = plateOf(id, frameOf(tl));
      plate.paint(plate.clock ? {...p, t: p.t + plate.clock / FPS} : p);
    },
    Overlay: ({tl, camera}) => {
      const f = frameOf(tl);
      const plate = plateOf(id, f);
      return (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          {plate.header && <Header camera={camera} sx={plate.header.sx} mini={plate.header.mini} />}
          {(Object.entries(plate.grade) as [Parameters<typeof StateGrade>[0]['state'], number][]).map(([s, v]) => v > 0 && <AbsoluteFill key={s} style={{opacity: v}}><StateGrade state={s} /></AbsoluteFill>)}
          <Grain opacity={0.1} />
          <CaptionShade tl={tl} cues={cues} mode="band" centerY={EG2_CAPTION_CENTRE_Y} />
          {plate.black ? <AbsoluteFill style={{background: '#000', opacity: plate.black}} /> : null}
        </AbsoluteFill>
      );
    },
  };
};

export const everyoneGoneEp02Shots: PaintedShot[] = EG2_SHOTS.map(([id], i) => shotOf(id, i));
