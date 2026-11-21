import {STILL_CAMERA} from '../kit/camera';
import {Grade, Grain} from '../kit/screen';
import type {PaintedShot} from '../shot';
import {BRIDGE_N, paintBridgePA, paintBridgePB} from '../edu32/bridge';
import {SH02_N, paintB03SH02} from '../edu32/b03-sh02';
import {SH03_N, paintB03SH03} from '../edu32/b03-sh03';
import {SH04_N, paintB03SH04} from '../edu32/b03-sh04';
import {B04_N, paintB04SH01} from '../edu32/b04-sh01';
import {B02SH01_N, paintB02SH01} from '../edu32/b02-sh01';
import {B02SH02_N, paintB02SH02} from '../edu32/b02-sh02';
import {B02SH03_N, paintB02SH03} from '../edu32/b02-sh03';
import {B01_SH01_N, paintB01SH01} from '../edu32/b01-sh01';
import {B01_SH02_N, paintB01SH02} from '../edu32/b01-sh02';
import {B01_SH03_N, paintB01SH03} from '../edu32/b01-sh03';
import {B01Callouts} from '../edu32/b01-callouts';
import {B04SH02_N, b04sh02Cam, b04sh02Door, paintB04SH02} from '../edu32/b04-sh02';
import {B04SH03_N, b04sh03Cam, paintB04SH03} from '../edu32/b04-sh03';
import {SignText} from '../edu32/corridor-text';
import {B06SH02_N, b06sh02Cam, paintB06SH02} from '../edu32/b06-sh02';
import {B06SH03_N, b06sh03Cam, paintB06SH03} from '../edu32/b06-sh03';
import {B06Memo} from '../edu32/b06-text';
import {B05SH01_N, b05sh01Cam, b05sh01Memo, paintB05SH01} from '../edu32/b05-sh01';
import {B05SH02_N, b05sh02Cam, b05sh02Memo, paintB05SH02} from '../edu32/b05-sh02';
import {B05SH03_N, b05sh03Cam, b05sh03Memo, paintB05SH03} from '../edu32/b05-sh03';
import {B06SH01_N, b06sh01Cam, b06sh01Highlights, b06sh01Memo, paintB06SH01, printoutPose} from '../edu32/b06-sh01';
import {BandShade, MemoTyped} from '../edu32/memo-type';
import {G6_SHADE, b05sh01Shade} from '../edu32/b05-memo';
import {PrintoutPage, PrintoutShadow} from '../edu32/printout-text';

// EDU-EP32-SHORT registered plates (Boss W3 gate LF-BR, 2026-11-21). B03-SH01 (the bridge, VD32-18) is one shot of two plates on one camera
// function of the shot frame (src/painted/edu32/bridge.ts): EDU32-B03-SH01-PA (paper, Space D) and EDU32-B03-SH01-PB (real, Space F,
// `crossfade`). A timeline puts PA's cue at the shot start and PB's at F 24 with `fromSec` 0.8 and `dissolveSec` 16/30, so both plate clocks
// read the shot frame. Plate frame = round(tl * 30) clamped to the shot. Each plate owns its Grade + Grain, so the grade crossfades with it.
const frameOf = (tl: number) => Math.max(0, Math.min(BRIDGE_N - 1, Math.round(tl * 30)));
// G4 (Boss W5.2, 2026-11-21): one plate per shot on the shot clock (plate frame L = round(tl * 30), clamped to the shot), each in its own shot
// file (src/painted/edu32/b03-sh02.ts ... b04-sh01.ts). B03-SH03 is two plates: O (overcast) at the shot start and S (sun) at L18 with `fromSec`
// 18/30 and a 16 f `crossfade`, so the cloud passing is a light change on the same cast frame.
const local = (n: number) => (tl: number) => Math.max(0, Math.min(n - 1, Math.round(tl * 30)));
export const SH03_SUN = {from: 18, frames: 16} as const;
const Screen = ({opacity}: {opacity: number}) => (
  <div style={{position: 'absolute', inset: 0, opacity}}>
    <Grade />
    <Grain opacity={0.08} />
  </div>
);

export const edu32Shots: PaintedShot[] = [
  {id: 'EDU32-B03-SH01-PA', serves: ['B03-SH01'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintBridgePA(p, frameOf(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B03-SH01-PB', serves: ['B03-SH01'], paper: '#c9cfc4', camera: () => STILL_CAMERA, crossfade: true,
    paint: (p, ctx) => paintBridgePB(p, frameOf(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B03-SH02', serves: ['B03-SH02'], paper: '#c9cfc4', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB03SH02(p, local(SH02_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B03-SH03-O', serves: ['B03-SH03'], paper: '#c9cfc4', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB03SH03(p, local(SH03_N)(ctx.tl), 'overcast'), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B03-SH03-S', serves: ['B03-SH03'], paper: '#c9cfc4', camera: () => STILL_CAMERA, crossfade: true,
    paint: (p, ctx) => paintB03SH03(p, local(SH03_N)(ctx.tl), 'sun'), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B03-SH04', serves: ['B03-SH04'], paper: '#3e5a36', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB03SH04(p, local(SH04_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B04-SH01', serves: ['B04-SH01'], paper: '#c9cfc4', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB04SH01(p, local(B04_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  // G2 (Boss W5.2, 2026-11-21): B02-SH01..SH03, paper Space D, one plate per shot on the shot clock (src/painted/edu32/b02-sh0*.ts).
  {id: 'EDU32-B02-SH01', serves: ['B02-SH01'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB02SH01(p, local(B02SH01_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B02-SH02', serves: ['B02-SH02'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB02SH02(p, local(B02SH02_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B02-SH03', serves: ['B02-SH03'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB02SH03(p, local(B02SH03_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  // G1 (Boss W5.2, 2026-11-21): B01-SH01..SH03, paper Space D page BP, one plate per shot on the shot clock (src/painted/edu32/b01-sh0*.ts);
  // B01-SH02's screen callouts (b01-callouts.tsx) sit under its Grade + Grain.
  {id: 'EDU32-B01-SH01', serves: ['B01-SH01'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB01SH01(p, local(B01_SH01_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  {id: 'EDU32-B01-SH02', serves: ['B01-SH02'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB01SH02(p, local(B01_SH02_N)(ctx.tl)),
    Overlay: ({opacity, tl}) => <div style={{position: 'absolute', inset: 0, opacity}}><B01Callouts L={local(B01_SH02_N)(tl)} /><Screen opacity={1} /></div>},
  {id: 'EDU32-B01-SH03', serves: ['B01-SH03'], paper: '#2c2630', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB01SH03(p, local(B01_SH03_N)(ctx.tl)), Overlay: ({opacity}) => <Screen opacity={opacity} />},
  // G5 (Boss W5.2, 2026-11-21): B04-SH02, B04-SH03, Space C corridor at the R3 keys, one plate per shot on the shot clock (src/painted/edu32/b04-sh0{2,3}.ts);
  // the "ห้ามรบกวน" sign text is camera-mapped DOM on the plate's camera (corridor-text.tsx), under the Grade + Grain.
  {id: 'EDU32-B04-SH02', serves: ['B04-SH02'], paper: '#a7b59e', camera: () => STILL_CAMERA,
    paint: (p, ctx) => paintB04SH02(p, local(B04SH02_N)(ctx.tl)),
    Overlay: ({opacity, tl}) => { const L = local(B04SH02_N)(tl); return <div style={{position: 'absolute', inset: 0, opacity}}><SignText c={b04sh02Cam(L)} {...b04sh02Door(L)} /><Screen opacity={1} /></div>; }},
  {id: 'EDU32-B04-SH03', serves: ['B04-SH03'], paper: '#323a35', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB04SH03(p, local(B04SH03_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => <div style={{position: 'absolute', inset: 0, opacity}}><SignText c={b04sh03Cam(local(B04SH03_N)(tl))} ajar={0} /><Screen opacity={1} /></div>},
  // G7 (Boss W5.2, 2026-11-21): B06-SH02 (real cat x16 asleep, ear flick) and B06-SH03 (stamp insert, the last shot) on the LF04 set, one plate per
  // shot on the shot clock (src/painted/edu32/b06-sh0{2,3}.ts); the finished memo page (G6 MemoTyped at MEMO_FINAL) and the mock stamp are
  // camera-mapped DOM behind the cat cut-out (b06-text.tsx) on the plate's camera, under the Grade + Grain.
  {id: 'EDU32-B06-SH02', serves: ['B06-SH02'], paper: '#1e2838', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB06SH02(p, local(B06SH02_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => <div style={{position: 'absolute', inset: 0, opacity}}><B06Memo c={b06sh02Cam(local(B06SH02_N)(tl))} /><Screen opacity={1} /></div>},
  {id: 'EDU32-B06-SH03', serves: ['B06-SH03'], paper: '#1e2838', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB06SH03(p, local(B06SH03_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => <div style={{position: 'absolute', inset: 0, opacity}}><B06Memo c={b06sh03Cam(local(B06SH03_N)(tl))} /><Screen opacity={1} /></div>},
  // G6 (Boss W5.2, 2026-11-21): B05-SH01..SH03 and B06-SH01, Space D real (the office, b05-set.ts), one plate per shot on the shot clock
  // (src/painted/edu32/b05-sh0{1,2,3}.ts, b06-sh01.ts); the memo (type-on, underline, stamp slam; memo-type.tsx) and the printout (printout-text.tsx)
  // are camera-mapped DOM on the plate's camera, under the Grade + Grain.
  {id: 'EDU32-B05-SH01', serves: ['B05-SH01'], paper: '#1e2838', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB05SH01(p, local(B05SH01_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => { const L = local(B05SH01_N)(tl); return <div style={{position: 'absolute', inset: 0, opacity}}><MemoTyped c={b05sh01Cam(L)} state={b05sh01Memo(L)} /><BandShade {...b05sh01Shade(L)} /><Screen opacity={1} /></div>; }},
  {id: 'EDU32-B05-SH02', serves: ['B05-SH02'], paper: '#1e2838', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB05SH02(p, local(B05SH02_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => { const L = local(B05SH02_N)(tl); return <div style={{position: 'absolute', inset: 0, opacity}}><MemoTyped c={b05sh02Cam(L)} state={b05sh02Memo(L)} /><BandShade {...G6_SHADE.page} /><Screen opacity={1} /></div>; }},
  {id: 'EDU32-B05-SH03', serves: ['B05-SH03'], paper: '#1e2838', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB05SH03(p, local(B05SH03_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => { const L = local(B05SH03_N)(tl); return <div style={{position: 'absolute', inset: 0, opacity}}><MemoTyped c={b05sh03Cam(L)} state={b05sh03Memo(L)} /><BandShade {...G6_SHADE.page} /><Screen opacity={1} /></div>; }},
  {id: 'EDU32-B06-SH01', serves: ['B06-SH01'], paper: '#1e2838', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { paintB06SH01(p, local(B06SH01_N)(ctx.tl)); },
    Overlay: ({opacity, tl}) => {
      const L = local(B06SH01_N)(tl), c = b06sh01Cam(L), pose = printoutPose(L), h = b06sh01Highlights(L);
      return <div style={{position: 'absolute', inset: 0, opacity}}><MemoTyped c={c} state={b06sh01Memo(L)} /><PrintoutShadow c={c} pose={pose} /><PrintoutPage c={c} pose={pose} {...h} /><BandShade {...G6_SHADE.printout} /><Screen opacity={1} /></div>;
    }},
];
