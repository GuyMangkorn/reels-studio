import {AbsoluteFill, interpolate} from 'remotion';
import type {PaintedShot} from '../shot';
import {CaptionShade} from '../kit/screen';
import {EDU1_CAPTION_CENTRE_Y, EDU1_SHADE_STRENGTH, eduShadeCues} from '../edu01/captions';
import {EDU1_SHOTS, FPS, PlateLayers, plateOf} from '../edu01/plates';

// EDU-EP01-SHORT (EDU-SHEETS-R1.1) timeline adapter, Boss W5.2 (4 Nov 2026). One registry plate per shot, ID `EDU1-<shot id>`,
// wrapping the pure `plateOf(id, f)` of src/painted/edu01/plates.tsx. The timeline needs the one shared BrushCanvas of
// PaintedStage, so the plate's screen layers (grade, clock glow, flash, dim, grain) come back through `Overlay`.
// W5.3 (Editor, 4 Nov 2026): the CaptionShade band (gated to the shot's caption cues, src/painted/edu01/captions.ts) and the B04-SH02 name card
// (VD06) are screen layers of the plate Overlay; captions, the "ภาพจำลอง" label and sound come from the timeline (src/videos/edu-ep01/index.ts).

const frameOf = (tl: number) => Math.round(tl * FPS);
export const edu1PlateId = (id: string) => `EDU1-${id}`;

/** B03-SH04 holds the last frame of B03-SH03 (the story clock: no boil, no streak jitter). */
const FREEZE: Record<string, number> = {'S01-B03-SH04': 44 / FPS};

/** VD06 name card on the upper wall (y 200-420, clear of the channel mark and the caption band): Latin title, Thai gloss below, fades in at L24 (f637, "ฮิปนิก"). */
const NameCard = ({tl}: {tl: number}) => {
  const f = Math.round(tl * FPS);
  const o = interpolate(f, [24, 32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const stroke = {WebkitTextStroke: '8px #1d2129', paintOrder: 'stroke fill', textShadow: '0 4px 0 #1d2129'} as const;
  return (
    <div style={{position: 'absolute', left: 0, top: 215, width: 1080, textAlign: 'center', color: '#fffaf0', opacity: o, transform: `translateY(${(1 - o) * 10}px)`, fontFamily: 'Noto Sans Thai', fontWeight: 800}}>
      <div style={{fontSize: 118, lineHeight: 1.1, letterSpacing: 2, ...stroke}}>hypnic jerk</div>
      <div lang="th" style={{fontSize: 48, lineHeight: 1.5, marginTop: 14, ...stroke, WebkitTextStroke: '7px #1d2129'}}>อาการกระตุกตอนเคลิ้มหลับ</div>
    </div>
  );
};

/** Seam shots: layers on/off by Overlay opacity (B01 incoming appears on the last frame, B08 outgoing leaves on it). */
const SEAM_LAYERS: Record<string, ((opacity: number) => boolean) | undefined> = {'S01-B01-SH01': (o) => o >= 1, 'S01-B08-SH01': (o) => o > 0};

export const edu01Shots: PaintedShot[] = EDU1_SHOTS.map(([id]): PaintedShot => ({
  id: edu1PlateId(id),
  serves: [id],
  paper: plateOf(id, 0).paper,
  camera: (tl) => plateOf(id, frameOf(tl)).cam,
  loopExact: id === 'S01-B01-SH01',
  clock: FREEZE[id] === undefined ? undefined : () => FREEZE[id],
  paint: (p) => plateOf(id, p.frame).paint(p),
  Overlay: ({tl, camera, width, height, opacity}) => (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: SEAM_LAYERS[id] === undefined ? opacity : 1}}>
      {/* Loop seam (W5.3): B08's last frame and B01 f0 share the same grade, glow and dim, so those layers hand over whole on the last frame
          instead of two stacked partial-opacity copies (a stacked crossfade darkens and double-glows mid-blend); the shade fades with `opacity`. */}
      {SEAM_LAYERS[id] === undefined || SEAM_LAYERS[id](opacity) ? <PlateLayers plate={plateOf(id, frameOf(tl))} camera={camera} width={width} height={height} /> : null}
      <AbsoluteFill style={{opacity}}>
        <CaptionShade tl={tl} cues={eduShadeCues(id)} mode="band" strength={EDU1_SHADE_STRENGTH} bottomEdgeY={EDU1_CAPTION_CENTRE_Y + 84} />
      </AbsoluteFill>
      {id === 'S01-B04-SH02' ? <NameCard tl={tl} /> : null}
    </AbsoluteFill>
  ),
}));
