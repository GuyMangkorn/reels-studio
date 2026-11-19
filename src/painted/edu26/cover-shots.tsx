import {STILL_CAMERA} from '../kit/camera';
import {Hands3D} from '../kit/hand3d';
import {LANDMARKS} from '../kit/hand-place';
import type {FaceState} from '../kit/head';
import type {Painter, Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {LIQUID, paintFullonica, STALL_Z0, STALLS} from './fullonica';
import {act, layer, LF04_JAR, noseOf, type Layer3D} from './r4-looks';
import {MARCUS, MARCUS_BARE, paintJar, paintRibbons} from './r4-cast';
import {bodyFacing, facePoint, HANG, paintedArms, pick3D, rigHands} from './r4-hands';
import {PALACE_PAPER, SHOT_DEFS, STREET_PAPER, WORKSHOP_PAPER} from './shot';
import {shoulderRibbons, sourceRibbons, treadKick} from './acts26';
import {yc} from './stage26';

// EDU-EP26-SHORT-PIC-COVERS cover-only plates (Film, 2026-11-19; cover-design skill pick 1, docs/cover-principles.md CV07). User direction for
// this pick: thumbnail energy (tight zoom on a face or the key object, exaggerated reaction, bold contrast and saturation, one focal subject).
// The film's frames hold the reactions at medium size and with mild faces (B02-SH02 LF04 two-shot, B05-SH01 profile medium close, B06-SH02 two-
// shot, B06-SH05 the passer-by small at the far side of the street). These plates reuse the locked sets, cast, rigs and ribbons of the episode with
// a cover camera; two of them (CV1, CV2) also push the face. Every event is in the film:
//   EDU26-COVER-JAR   B02-SH02/SH04: the open jar's smell ribbons reach Marcus's nose, he pinches it (the jar-hand hangs, B02-SH04 l 0-27, so the jar reads). Face pushed from the
//                     film's `disgusted` YUCK (half eyes) to wide eyes and a dropped jaw (same event, louder reaction).
//   EDU26-COVER-TUB   B03-SH04/SH06: Marcus barefoot in the middle stall treading in the liquid, ribbons rising off it. Low wide lens from the
//                     stall's front rim; face pushed from `worried` to the wide-eyed disgust above, eyes down on the liquid.
//   EDU26-COVER-COIN  B05-SH01 l 110: the first coin at his nose (the sniff hold), the film's face; camera-only zoom.
//   EDU26-COVER-NOSE  B06-SH02 l 90 (LF06): Vespasian's coin at Titus's nose, the film's faces; camera-only zoom.
//   EDU26-COVER-PASS  B06-SH05 l 70: the passer-by pinches her nose at Marcus (the film's `disgusted`), his ribbons rising; camera-only zoom.
// Never shown (CV04): the white shirt at the pickup (L13 payoff), "สูตรลับ", Titus's answer and Vespasian's reply (L19).
// Camera-only plates paint the episode shot's own `paint` and `hands` through SHOT_DEFS at that frame (filled when the episode inventory loads;
// the registry lists it before this one), so no shot file is imported here (one-shot-one-file) and the episode's per-scene keys are unchanged.
// Grade: a saturation/contrast lift over the plate (backdrop filter) and the plate grain; the cover's vignette is the cover layout's.

/** Zoom a camera by `z` about picture point `at` (the frame as the camera paints it) and place that point at `to`. */
const zoom = (c: YCam, at: Pt, z: number, to: Pt): YCam => ({...c, f: c.f * z, cx: to[0] - 540 - z * (at[0] - 540 - (c.cx ?? 0)), hy: to[1] + z * (c.hy - at[1])});

const PUNCH = 'saturate(1.35) contrast(1.12)';
type CoverOpts = {id: string; serves: string; paper: string; paint: (p: Painter) => void; layers?: () => Layer3D[]};
const make = (o: CoverOpts): PaintedShot => ({
  id: o.id, serves: [o.serves], paper: o.paper, camera: () => STILL_CAMERA,
  paint: (p) => o.paint(p),
  Overlay: ({opacity}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      {(o.layers?.() ?? []).map((l, i) => <div key={i} style={{position: 'absolute', inset: 0}}><Hands3D cam={l.cam} arms={l.arms} props={l.props} occluders={l.occluders} /></div>)}
      <div style={{position: 'absolute', inset: 0, backdropFilter: PUNCH, WebkitBackdropFilter: PUNCH}} />
      <Grain opacity={0.06} />
    </div>
  ),
});
/** A camera-only cover: the episode shot `serves` at frame L through `camOf(shot camera)`. */
const fromShot = (id: string, serves: string, L: number, paper: string, camOf: (c: YCam) => YCam): PaintedShot => {
  const cam = () => camOf(SHOT_DEFS[serves].cam(L));
  return make({id, serves, paper,
    paint: (p) => SHOT_DEFS[serves].paint(p, L, cam()),
    layers: () => SHOT_DEFS[serves].hands?.(L, cam()) ?? []});
};

// ------------------------------------------------------------------------------------------------ CV1 jar: the smell hits, nose pinched
// B02-SH04 staging (Marcus at AT1 facing +z, five-finger 3D pinch on the nose, left mitten pointing at the jar) with the open jar at its LF04
// place (B02-SH02) and the jar-to-nose ribbons of B02-SH02 in one frame. Eye front-right of him so the jar sits low right of his face.
const AT1: V3 = [-0.42, 0, 0.12];
const CAM1 = yc(-0.62, 1.34, 0.98, 17, -6, 1200, 880, 60);
const rig1 = () => {
  const body = bodyFacing(MARCUS, AT1, [0, 1]), nose = facePoint(body, 0.12, -0.03);
  return rigHands(body, {right: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: nose}, f: [-0.3, 1, 0.2], b: [0.2, 0, 1]}, left: HANG}, 44500);
};
const SHOCK_YUCK: Partial<FaceState> = {brow: 'angry', eyes: 'wide', mouth: 'gape', open: 0.75, squint: 0, look: [0.55, 0.15]};
const jarCover = make({id: 'EDU26-COVER-JAR', serves: 'B02-SH04', paper: WORKSHOP_PAPER,
  paint: (p) => {
    const c = CAM1, t = 2, r = rig1();
    paintFullonica(p, c, {mood: 'morning'}, {
      noPoles: true,
      room: (q, cc) => {
        const j = paintJar(q, cc, LF04_JAR, 34000, {lid: 'off', h: 0.36, w: 0.32});
        const m = act(q, cc, {def: MARCUS, at: AT1, facing: [0, 1], face: 'disgusted', faceState: SHOCK_YUCK, seed: 2622, t,
          fig: {headCock: -6, lean: -0.06}, arms: () => paintedArms(cc, r, {noHand: ['right']})});
        if (!m) return;
        if (j) {
          const o = {spread: 30, bow: 0.2, waves: 1.8, t, grow: 1, strength: 1};
          paintRibbons(q, 34100, [j.mouth[0], j.mouth[1] - 8], noseOf(m, 0.3, 0.75), {...o, w: 56, op: 120, color: '#8a8443', edge: 0});
          paintRibbons(q, 34100, [j.mouth[0], j.mouth[1] - 8], noseOf(m, 0.3, 0.75), {...o, w: 40, op: 230, edge: 1.8});
        }
        shoulderRibbons(q, m, (m.chin - m.headTop) / 0.42, t, {n: 2, strength: 1, seed: 35100, side: 'l'});
      },
    });
  },
  layers: () => [layer(CAM1, pick3D(rig1(), ['right']))],
});

// ------------------------------------------------------------------------------------------------ CV2 tub: standing in it
// B03-SH06 staging (Marcus barefoot in the middle stall at AT2, treading) from a low wide lens just over the stall's front rim, so the liquid and
// its ribbons fill the bottom and he looms over it, eyes down on the liquid.
const AT2: V3 = [-0.15, 0, -2.75];
const CAM2 = yc(-0.12, 1.2, -2.05, -2, -12, 900, 820);
const TUB_YUCK: Partial<FaceState> = {brow: 'worry', eyes: 'wide', mouth: 'shout', open: 1, squint: 0, sweat: true, look: [0, 0.9]};
const tubCover = make({id: 'EDU26-COVER-TUB', serves: 'B03-SH06', paper: WORKSHOP_PAPER,
  paint: (p) => {
    const c = CAM2, t = 1.3;
    paintFullonica(p, c, {mood: 'setback'}, {
      noPoles: true,
      stallLiquidFrom: [STALL_Z0, AT2[2] - 0.03, STALL_Z0],
      room: (q, cc) => {
        for (const [i, dx] of [[0, -0.2], [1, 0.2]] as const) {
          const to = camPoint(cc, [AT2[0] + dx * 2.6, 1.7, AT2[2] + 0.1]);
          if (to) sourceRibbons(q, cc, [AT2[0] + dx, LIQUID + 0.02, AT2[2] + 0.22], to, t + i, {n: 1, strength: 1, seed: 35740 + i * 17, w: 0.035 * camUnit(cc, [0, 1, AT2[2]]), under: true});
        }
      },
      inStalls: (q, cc) => {
        const m = act(q, cc, {def: MARCUS_BARE, at: AT2, facing: [0, 1], face: 'disgusted', faceState: TUB_YUCK, seed: 2631, t,
          fig: {legKick: treadKick(20, 0, 15), headCock: -4, nod: [0, 0.12]}, tint: {to: '#7d8f7c', u: 0.06}});
        if (m) shoulderRibbons(q, m, camUnit(cc, [AT2[0], 1.3, AT2[2]]), t, {n: 2, strength: 1, seed: 35700, under: true});
      },
    });
  },
});
void STALLS;

export const edu26CoverShots: PaintedShot[] = [
  jarCover,
  tubCover,
  // CV3 coin: B05-SH01 l 110 (coin at the nose (436, 767), the CL03 contract), face and coin pushed to fill the upper frame
  fromShot('EDU26-COVER-COIN', 'B05-SH01', 110, WORKSHOP_PAPER, (c) => zoom(c, [436, 767], 2.6, [580, 820])),
  // CV4 nose: B06-SH02 l 90, the LF06 end frame (the coin at Titus's nose about (492, 790), heads about (352, 760) and (712, 720))
  fromShot('EDU26-COVER-NOSE', 'B06-SH02', 90, PALACE_PAPER, (c) => zoom(c, [492, 790], 1.75, [540, 820])),
  // CV5 passer-by: B06-SH05 l 70 (her head about (704, 924))
  fromShot('EDU26-COVER-PASS', 'B06-SH05', 70, STREET_PAPER, (c) => zoom(c, [704, 930], 4.2, [600, 800])),
];
