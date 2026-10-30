import type {ReactNode} from 'react';
import {CameraLayer, easeOver, pushCamera, type Camera} from '../camera';
import {GLOW_PEAK} from '../glow';
import {lerp, type Painter, type Pt} from '../painter';
import type {PaintedShot, ShotContext} from '../shot';
import {STILL_CAMERA} from '../camera';
import {asmPoseAt, assemblyParts, cartOnlyPose, paintAssembly, paintCartSide, paintHubs, type AsmPose} from '../worldfog/assembly';
import {doorPt, paintCarExterior, paintCarInterior, paintFarShape, paintSedanBody, paintSedanDoor, rimAt, SEDAN_DOOR} from '../worldfog/car';
import {drawFigure, shoulderHeight, type Arm, type FigAnchors, type FigPose, type Who} from '../worldfog/cast';
import type {FaceState} from '../worldfog/head';
import {Architecture, Beam, FogVeil, Glass, Grade, Grain, Halos, InteriorAir, LensGlow, Rim} from '../worldfog/layers';
import type {InteriorLight} from '../worldfog/draw';
import {paintOutside} from '../worldfog/outside';
import {PhoneOverlay, paintPhone} from '../worldfog/phone';
import {groundAt, paintShop, VD18_SET, type Drawable, type ShopDress} from '../worldfog/shop';
import {PROJ, SHOT_G0, asmAt, bump, doorAt, ease, mix3, ptLerp, riseAt, seg, torchOnAt, type Proj, type V3} from '../worldfog/space';

// WFOG-EP01-SHORT painted plates (brief VB-WFOG-EP01-SHORT-R3, scene sheets WFOG-EP01-SHORT-SS-R3.1). One plate per
// shot, ID `WFOG-<shot ID>`; each samples the story clocks of `src/painted/worldfog/space.ts` at G = shot start + its
// local frame, so a plate shows the same story state whatever cue time the timeline gives it. Cameras, staging and
// event frames follow the shot blocks of the sheets; shared art lives in `src/painted/worldfog/`.

const FPS = 30;
const frameOf = (tl: number) => Math.round(tl * FPS);
const Gat = (id: string, tl: number) => SHOT_G0[id] + frameOf(tl);

type PlateDef = {
  paper: string;
  camera: (tl: number) => Camera;
  paint: (p: Painter, ctx: ShotContext & {G: number; f: number}) => void;
  Overlay?: (props: ShotContext & {camera: Camera; G: number; f: number}) => ReactNode;
};

const plate = (id: string, d: PlateDef): PaintedShot => ({
  id: `WFOG-${id}`,
  serves: [id],
  paper: d.paper,
  camera: d.camera,
  paint: (p, ctx) => d.paint(p, {...ctx, G: Gat(id, ctx.tl), f: frameOf(ctx.tl)}),
  Overlay: d.Overlay ? ({camera, opacity, ...ctx}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>{d.Overlay!({...ctx, camera, G: Gat(id, ctx.tl), f: frameOf(ctx.tl)})}</div>
  ) : undefined,
});

/** Push over the whole shot (sine in-out, exact end value on the last frame). */
const push = (len: number, s0: number, s1: number, fx: number, fy: number) => (tl: number) => pushCamera(tl, (len - 1) / FPS, {s0, s1, fx, fy});
const fixedCam = (len: number, o: {s0: number; s1: number; fx: number; fy: number; dx: number; dy: number}) => (tl: number): Camera => {
  const e = easeOver(tl, (len - 1) / FPS);
  return {s: lerp(o.s0, o.s1, e), fx: o.fx, fy: o.fy, dx: o.dx, dy: o.dy};
};

// ------------------------------------------------------------------ CAM-GLASS-OUT window plates (VD07 SVG foreground)

const GLASS = PROJ['CAM-GLASS-OUT'];
/** S03-SH03 beam (sheet: glow centre (300, 1150) -> (590, 700) over f0-f30 at the match framing), in plate px. */
const BEAM_FROM: Pt = [6, 1058], BEAM_START: Pt = [360, 1035], BEAM_END: Pt = [583, 689];
const beamAt = (G: number) => (G < 1800 ? 0 : ease(seg(G, 1800, 1830)));

type WindowOpts = {assembly: boolean; veil: boolean; jam?: boolean; lowBank?: number; sheen?: number};
/** The window plate: fog outside, the assembly on its story pose, halos, rim, veil, beam, glass and architecture. */
const windowPlate = (id: string, camera: (tl: number) => Camera, o: WindowOpts): PaintedShot => {
  const poseOf = (G: number): AsmPose | null => (o.assembly ? asmPoseAt(G) : null);
  return plate(id, {
    paper: '#7c8380',
    camera,
    paint: (p, {G}) => {
      const pose = poseOf(G);
      paintOutside(p, GLASS, G, {asm: pose ? {pose, parts: assemblyParts(GLASS, pose)} : undefined, beam: beamAt(G), jam: o.jam, lowBank: o.lowBank});
    },
    Overlay: ({camera: cam, width, height, G}) => {
      const pose = poseOf(G);
      const parts = pose ? assemblyParts(GLASS, pose) : null;
      const beam = beamAt(G);
      return (
        <>
          <CameraLayer camera={cam} width={width} height={height}>
            <Halos proj={GLASS} G={G} />
          </CameraLayer>
          {parts && (
            <CameraLayer camera={cam} width={width} height={height} opacity={GLOW_PEAK}>
              <Rim parts={parts} />
            </CameraLayer>
          )}
          {parts && pose && o.veil && (
            <CameraLayer camera={cam} width={width} height={height} blend="normal">
              <FogVeil proj={GLASS} parts={parts} pose={pose} />
            </CameraLayer>
          )}
          {beam > 0 && (
            <CameraLayer camera={cam} width={width} height={height}>
              <Beam from={BEAM_FROM} to={[lerp(BEAM_START[0], BEAM_END[0], beam), lerp(BEAM_START[1], BEAM_END[1], beam)]} level={beam} />
            </CameraLayer>
          )}
          <CameraLayer camera={cam} width={width} height={height} blend="normal">
            <Glass proj={GLASS} sheen={o.sheen} />
          </CameraLayer>
          <CameraLayer camera={cam} width={width} height={height} blend="normal">
            <Architecture proj={GLASS} />
          </CameraLayer>
          <Grade />
          <Grain />
        </>
      );
    },
  });
};

// ------------------------------------------------------------------ cast helpers

/** Mouth opening on spoken windows (shot-local frames): syllable-like flutter; Editor may swap in TTS amplitude. */
const talk = (f: number, windows: [number, number][], scale = 1) => {
  const w = windows.find(([a, b]) => f >= a && f < b);
  if (!w) return 0;
  const u = (f - w[0]) / (w[1] - w[0]);
  const env = Math.min(1, u * 8, (1 - u) * 8);
  return scale * env * (0.25 + 0.75 * Math.abs(Math.sin(f * 0.62 + 0.9 * Math.sin(f * 0.23))));
};
const face = (o: Partial<FaceState> & {open?: number}): FaceState => ({brow: 'flat', eyes: 'dot', look: [0, 0], mouth: o.open && o.open > 0 ? 'talk' : 'flat', ...o});

/** A cast figure as a depth-sorted drawable at WORLD-SHOP (x, z). `after` receives its anchors. */
const actor = (p: Painter, proj: Proj, who: Who, x: number, z: number, pose: FigPose, tl: number, after?: (a: FigAnchors) => void): Drawable => {
  const {g, unit, depth} = groundAt(proj, x, z);
  return {depth, draw: () => {
    const a = drawFigure(p, who, g, unit, pose, tl);
    after?.(a);
  }};
};
const P3 = (proj: Proj, v: V3): Pt => proj.P(v);
const arm = (proj: Proj, v: V3, out?: number): Arm => ({to: proj.P(v), out});
/** An authored elbow (SS-R3.4 rows): hand and elbow in world metres; `behind: 'upper'` puts the upper arm under the torso. */
const armVia = (proj: Proj, hand: V3, elbow: V3, behind?: 'upper'): Arm => ({to: proj.P(hand), via: proj.P(elbow), behind});

// ------------------------------------------------------------------ S01

const carPlate = plate('S01-SH01', {
  paper: '#2a3134',
  camera: push(126, 1.0, 1.04, 540, 700),
  paint: (p, {f, tl}) => {
    paintCarExterior(p, f);
    if (f < 108) paintFarShape(p, f);
    paintCarInterior(p, f, 'back');
    // L4: the narrator in profile facing screen-left, seated; head turns 5 deg toward the windshield f0-f12.
    const g: Pt = [692, 2035];
    const lean = -0.05 * ease(seg(f, 0, 12));
    drawFigure(p, 'narrator', g, 1000, {
      view: 'left', seated: true, lean, face: face({look: [0.2, 0.1], brow: 'worry'}), warm: 0.45,
      rArm: {to: rimAt(-Math.PI * (1 / 3), f), out: -1}, lArm: {to: rimAt(Math.PI * (1 / 3), f), out: 1},
    }, tl);
    paintCarInterior(p, f, 'front');
  },
  Overlay: () => <><Grade strength={0.42} /><Grain /></>,
});

const forecourtPlate = plate('S01-SH02', {
  paper: '#565d5a',
  camera: push(114, 1.0, 1.05, 600, 760),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-FORECOURT'];
    paintOutside(p, proj, G, {noCarGhost: true, lowBank: 0.6});
    const roll = 1 - (1 - seg(f, 0, 30)) ** 2;
    const dx = -3.0 * (1 - roll);
    // Driver door (SS-R3.3): opens f42-f54 to 55 deg, shuts f72-f80 (contact f80). Dome light on while it is open (f44-f80).
    const door = ease(seg(f, 42, 54)) * (1 - ease(seg(f, 72, 80)));
    const courtesy = ease(seg(f, 44, 48)) * (1 - ease(seg(f, 78, 80)));
    // Narrator marks (SS-R3.3): she is out of the car from f48, standing in the door's V and moving from (-1.35, 4.15) to
    // (-1.35, 3.80) by f62 (the sheet's step-out mark), two steps to (-1.55, 3.20) by f74, then she walks toward (0.3, 2.0)
    // at 1.33 m/s (about 2.2 m) and leaves frame right about f110. Phone f84-f96.
    const outU = ease(seg(f, 48, 62)), stepU = ease(seg(f, 62, 74)), walkU = Math.min(1, Math.max(0, (f - 74) * (1.33 / 30) / 2.21));
    const x = f < 62 ? -1.35 : f < 74 ? lerp(-1.35, -1.55, stepU) : lerp(-1.55, 0.3, walkU);
    const z = f < 48 ? 4.15 : f < 62 ? lerp(4.15, 3.80, outU) : f < 74 ? lerp(3.80, 3.20, stepU) : lerp(3.20, 2.0, walkU);
    const her = groundAt(proj, x, z);
    const phone = ease(seg(f, 84, 96));
    // Hand on the free edge at 0.9 m while she shuts the door (f72-f80); the rig clamps the reach.
    const edge = doorPt(0, door * SEDAN_DOOR.open, 1, 0.9);
    const pose: FigPose = {
      view: 'front', light: VD18_LIGHT['CAM-FORECOURT'], walk: f >= 74 ? (f - 74) / 18 : undefined,
      face: face({look: [0.6, 0], brow: 'worry'}),
      // SS-R3.4 AB1: the phone hand as before; the elbow goes back into depth (upper arm behind the torso), fixed on her.
      lArm: phone > 0 ? armVia(proj, [x + 0.12, lerp(0.9, 1.15, phone), z - 0.12], [x + 0.15, 0.93, z + 0.04], 'upper') : undefined, lHold: phone > 0.5 ? {kind: 'phone'} : undefined,
      rArm: f >= 72 && f < 81 ? arm(proj, edge, -1) : undefined,
    };
    const narrator = () => drawFigure(p, 'narrator', her.g, her.unit, pose, tl);
    paintSedanBody(p, proj, dx, door, 3.0 * roll, courtesy);
    if (f >= 48 && f < 70) {
      // SS-R3.3 draw order: the car body and opening, then the narrator, then the open door (she is behind the door).
      narrator();
      paintSedanDoor(p, proj, dx, door);
    } else {
      // From f70 she is in front of the door (depth 2.4 m against the free edge's 2.58 m): the whole car, then the narrator.
      paintSedanDoor(p, proj, dx, door);
      if (f >= 48) narrator();
    }
  },
  Overlay: ({camera: cam, width, height, G}) => (
    <>
      <CameraLayer camera={cam} width={width} height={height}><Halos proj={PROJ['CAM-FORECOURT']} G={G} /></CameraLayer>
      <Grade strength={0.3} />
      <Grain />
    </>
  ),
});

// ------------------------------------------------------------------ S02-B01 interiors and the phone

const counterInPlate = plate('S02-SH01', {
  paper: '#8d918a',
  camera: push(114, 1.0, 1.05, 620, 700),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-COUNTER-IN'];
    const L = VD18_LIGHT['CAM-COUNTER-IN'];
    const step = ease(seg(f, 78, 86));
    const x = lerp(-0.3, -0.45, step), z = lerp(-2.1, -2.3, step);
    const head = f >= 54 && f < 72 ? 'right' : 'front';
    const look: Pt = f < 54 ? [0.3, 0.9] : f < 80 ? [0, 0] : f < 96 ? [-0.9, 0.3] : [-0.3, 0.2];
    // Torch: off the hook (reach f86-f96), then lowered f96-f104 to the rig's default hang on her right side (x-0.17, 0.64, z),
    // lens down (SS-R3.4 AB0 hang: a straight arm; the r4 point (-0.65, 0.95, -2.25) bent it and splayed the elbow).
    const reach = ease(seg(f, 86, 96)), hip = ease(seg(f, 96, 104));
    const rArm: Arm | undefined = f < 86 ? undefined : f < 96 ? {to: ptLerp(P3(proj, [x - 0.2, 0.9, z]), P3(proj, [-0.73, 1.33, -2.7]), reach), out: -1} : {to: ptLerp(P3(proj, [-0.73, 1.33, -2.7]), P3(proj, [x - 0.17, 0.64, z]), hip), out: -1};
    paintShop(p, proj, G, {torchOnHook: G < 336, light: L, actors: [
      actor(p, proj, 'occupant', -1.6, -1.0, {view: 'right', light: L, lean: 0.03 * bump(f, 40, 60), face: face({look: [1, -0.1]})}, tl),
      actor(p, proj, 'narrator', x, z, {
        view: 'front', light: L, head, face: face({look, brow: f >= 54 ? 'worry' : 'flat'}),
        lArm: armVia(proj, [x + 0.06, 1.12, z - 0.2], [x + 0.15, 0.95, z + 0.04], 'upper'), lHold: {kind: 'phone'},
        rArm, rHold: f >= 96 ? {kind: 'torch', angle: Math.PI / 2, on: 0} : undefined,
      }, tl),
    ]});
  },
  Overlay: () => interiorOverlay('S02-SH01'),
});

const phonePlate = plate('S02-SH02', {
  paper: '#4e5856',
  camera: () => STILL_CAMERA,
  paint: (p, {f}) => paintPhone(p, f),
  Overlay: ({f}) => <><PhoneOverlay f={f} /><Grain opacity={0.06} /></>,
});

/** S02-SH03 set dressing (SS-R3.3; index open item 17 c): register at the counter's -x end, dark counter front and top (top lift x0.15), hard nosing, lit back-shelf tops on the top row. */
const COUNTER_OUT_DRESS: ShopDress = {register: [-2.78, -2.42], counterFront: '#2e3335', counterTop: '#4a5150', counterTopLift: 0.15, nosing: '#8f9794', backShelfTopLitOnly: true,
  backShelf: {color: VD18_SET.shelf, front: VD18_SET.shelfSide}};
const counterOutPlate = plate('S02-SH03', {
  paper: '#8d918a',
  camera: push(96, 1.0, 1.06, 540, 530),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-COUNTER-OUT'];
    const L = VD18_LIGHT['CAM-COUNTER-OUT'];
    const shift = ease(seg(f, 18, 30));
    const look = ptLerp([-0.8, 0.1], [-0.25, -0.05], shift);
    paintShop(p, proj, G, {light: L, dress: COUNTER_OUT_DRESS, actors: [
      actor(p, proj, 'shopworker', -2.0, -3.5, {
        view: 'front', light: L, face: face({look, brow: f >= 30 ? 'worry' : 'flat', open: talk(f, [[24, 66]], 0.6)}),
        // SS-R3.4 AB1: hands on the far counter edge (±0.08 m, inside her shoulders), elbows back into depth.
        rArm: armVia(proj, [-1.92, 0.93, -3.22], [-1.85, 0.94, -3.56], 'upper'), lArm: armVia(proj, [-2.08, 0.93, -3.22], [-2.15, 0.94, -3.56], 'upper'),
      }, tl),
    ]});
  },
  Overlay: () => interiorOverlay('S02-SH03'),
});

// ------------------------------------------------------------------ S02-B02-B04 interiors (painted, VD07)

/**
 * VD18 interior light per setup (brief VD18 table; Boss r3 applies it to every interior/character plate): key from the
 * tube lights, rim from the fog glass. The glass-behind-camera setups halve the rim (`rimScale`). CAM-FORECOURT is not a
 * row of the brief: its narrator takes the glass-behind-camera row (proposal for Film to confirm, S01-SH02 cast only).
 */
export const VD18_LIGHT: Record<'CAM-COUNTER-IN' | 'CAM-COUNTER-OUT' | 'CAM-LOW-SHELF' | 'CAM-LOW-CU' | 'CAM-INT-REV' | 'CAM-INT-SIDE' | 'CAM-INT-2S' | 'CAM-INT-DOOR-REV' | 'CAM-FORECOURT', InteriorLight> = {
  'CAM-COUNTER-IN': {key: [0.2, 1], rim: [0, 1]},
  'CAM-COUNTER-OUT': {key: [0.2, 1], rim: [0.8, 0.6], rimScale: 0.5},
  'CAM-LOW-SHELF': {key: [0.3, 1], rim: [-0.6, 1]},
  'CAM-LOW-CU': {key: [0.3, 1], rim: [-0.6, 1]},
  'CAM-INT-REV': {key: [0.2, 1], rim: [0.8, 0.6], rimScale: 0.5},
  'CAM-INT-SIDE': {key: [0.2, 1], rim: [-1, 0.4]},
  'CAM-INT-2S': {key: [-0.25, 1], rim: [0, 1]},
  'CAM-INT-DOOR-REV': {key: [0.2, 1], rim: [0.8, 0.6], rimScale: 0.5},
  'CAM-FORECOURT': {key: [0.2, 1], rim: [0.8, 0.6], rimScale: 0.5},
};

/** VD18 screen-space air per plate (brief VD18 "What Boss applies" step 2): floor falloff from `floorFrom`, tube pool on the upper bodies. */
type Air = {floorFrom: number; floor: number; pool: {x: number; y: number; rx: number; ry: number; a: number}};
const AIR: Record<string, Air> = {
  'S02-SH01': {floorFrom: 0.5, floor: 0.55, pool: {x: 430, y: 820, rx: 560, ry: 380, a: 0.14}},
  'S02-SH03': {floorFrom: 0.52, floor: 0.6, pool: {x: 540, y: 560, rx: 460, ry: 300, a: 0.14}},
  'S02-SH05': {floorFrom: 0.5, floor: 0.55, pool: {x: 400, y: 760, rx: 520, ry: 380, a: 0.14}},
  'S02-SH06': {floorFrom: 0.5, floor: 0.55, pool: {x: 730, y: 880, rx: 520, ry: 360, a: 0.14}},
  'S02-SH08': {floorFrom: 0.5, floor: 0.55, pool: {x: 400, y: 760, rx: 520, ry: 380, a: 0.14}},
  'S02-SH10': {floorFrom: 0.5, floor: 0.55, pool: {x: 400, y: 760, rx: 520, ry: 380, a: 0.14}},
  'S03-SH01': {floorFrom: 0.5, floor: 0.55, pool: {x: 400, y: 760, rx: 520, ry: 380, a: 0.14}},
  'S03-SH02': {floorFrom: 0.5, floor: 0.55, pool: {x: 595, y: 800, rx: 520, ry: 340, a: 0.14}},
  'S03-SH07': {floorFrom: 0.5, floor: 0.55, pool: {x: 600, y: 800, rx: 560, ry: 360, a: 0.14}},
  'S04-SH01': {floorFrom: 0.5, floor: 0.5, pool: {x: 674, y: 800, rx: 560, ry: 260, a: 0.12}},
  'S04-SH02': {floorFrom: 0.5, floor: 0.55, pool: {x: 540, y: 880, rx: 520, ry: 340, a: 0.14}},
};
/** The VD18 plate overlay: InteriorAir, Grade and Grain 0.11 (replaces the blockout grade of the plate). */
const interiorOverlay = (id: string) => {
  const air = AIR[id];
  return <><InteriorAir floorFrom={air.floorFrom} floor={air.floor} pool={air.pool} /><Grade strength={0.34} /><Grain opacity={0.11} /></>;
};

const lowShelfPlate = (id: string, len: number, camera: (tl: number) => Camera, cast: (p: Painter, proj: Proj, f: number, tl: number, light?: InteriorLight) => Drawable[], lowBank?: (f: number) => number, light?: InteriorLight) =>
  plate(id, {
    paper: '#58605d',
    camera,
    paint: (p, {G, f, tl}) => {
      const proj = PROJ['CAM-LOW-SHELF'];
      const pose = asmPoseAt(G);
      paintShop(p, proj, G, {outside: {asm: {pose, parts: assemblyParts(proj, pose)}, lowBank: lowBank?.(f)}, actors: cast(p, proj, f, tl, light), light});
      void len;
    },
    Overlay: () => (light ? interiorOverlay(id) : <><Grade strength={0.3} /><Grain /></>),
  });

// ------------------------------------------------------------------ crouched narrator arms (SS-R3.2 Arms and Torch rows)

/** A hand and its elbow in WORLD-SHOP metres (sheet S02-SH08, S02-SH10, S03-SH01). */
type ArmKey = {hand: V3; elbow: V3};
const KEY: Record<'hipR' | 'kneeR' | 'kneeL' | 'floorL' | 'hangR', ArmKey> = {
  hipR: {hand: [-1.06, 0.62, -1.36], elbow: [-1.18, 0.5, -1.33]},
  kneeR: {hand: [-1.07, 0.42, -1.5], elbow: [-1.15, 0.48, -1.36]},
  kneeL: {hand: [-0.83, 0.42, -1.5], elbow: [-0.75, 0.48, -1.36]},
  floorL: {hand: [-0.8, 0, -1.25], elbow: [-0.785, 0.34, -1.275]},
  hangR: {hand: [-1.23, 0.55, -1.25], elbow: [-1.22, 0.7, -1.25]},
};
/** Torch lens across the right knee: 30 deg below horizontal, toward her centre line (S02-SH08 Torch row). */
const TORCH_KNEE_LENS: V3 = [-0.97, 0.36, -1.5];
/** Arm between two keys at `u`, lerped in world space and projected; `lift` raises the elbow (held breath). */
const armBetween = (proj: Proj, a: ArmKey, b: ArmKey, u: number, lift = 0): Arm => {
  const e = mix3(a.elbow, b.elbow, u);
  return {to: proj.P(mix3(a.hand, b.hand, u)), via: proj.P([e[0], e[1] + lift, e[2]])};
};
/** Plate angle of a torch from its grip to its lens (both WORLD-SHOP), the angle drawTorch expects. */
const torchAngle = (proj: Proj, grip: V3, lens: V3) => {
  const a = proj.P(grip), b = proj.P(lens);
  return Math.atan2(b[1] - a[1], b[0] - a[0]);
};
type NarratorArms = {r?: Arm; l?: Arm; torch: number};

/** The crouched pair behind the window shelf (S02-SH08, S02-SH10, S03-SH01): shared staging on CAM-LOW-SHELF. */
const crouchedPair = (p: Painter, proj: Proj, tl: number, n: {crouch: number; head: FigPose['head']; look: Pt; brow: FaceState['brow']; open: number; arms: NarratorArms; nod?: Pt; rise?: number},
  o: {crouch: number; look: Pt; open: number; hold: boolean; nod?: Pt}, light?: InteriorLight): Drawable[] => {
  return [
    actor(p, proj, 'occupant', -1.5, -1.1, {
      view: 'front', light, crouch: o.crouch, nod: o.nod, face: face({look: o.look, brow: 'worry', open: o.open}),
      lArm: o.hold ? arm(proj, [-1.1, lerp(1.1, 0.42, n.crouch), -1.32], 1) : arm(proj, [-1.45, 0.25, -1.25], 1),
      rArm: arm(proj, [-1.62, lerp(0.95, 0.3, o.crouch), -1.2], -1),
    }, tl),
    actor(p, proj, 'narrator', -0.95, -1.3, {
      view: 'front', light, head: n.head, crouch: n.crouch, rise: n.rise, nod: n.nod, face: face({look: n.look, brow: n.brow, open: n.open}),
      lArm: n.arms.l, rArm: n.arms.r, rHold: {kind: 'torch', angle: n.arms.torch, on: 0},
    }, tl),
  ];
};

const sh05 = lowShelfPlate('S02-SH05', 54, push(54, 1.12, 1.18, 760, 640), () => [], (f) => 1 - ease(seg(f, 10, 20)) + ease(seg(f, 42, 53)), VD18_LIGHT['CAM-LOW-SHELF']);
const sh08 = lowShelfPlate('S02-SH08', 201, push(201, 1.0, 1.04, 500, 700), (p, proj, f, tl, light) => {
  const head: FigPose['head'] = f >= 18 && f < 40 ? 'right' : f >= 60 && f < 160 ? 'left' : 'front';
  // Right hand from her hip onto the right knee (f0-f12) with the torch across it; left hand to the floor by f12.
  const settle = ease(seg(f, 0, 12));
  return crouchedPair(p, proj, tl,
    {crouch: lerp(0.81, 1, settle), head, look: f < 18 ? [0.4, -0.3] : [0.2, 0], brow: 'worry', open: talk(f, [[66, 96], [102, 156]], 0.5),
      arms: {r: armBetween(proj, KEY.hipR, KEY.kneeR, settle), l: armBetween(proj, KEY.kneeL, KEY.floorL, settle), torch: torchAngle(proj, KEY.kneeR.hand, TORCH_KNEE_LENS)}},
    {crouch: lerp(0.8, 1, ease(seg(f, 0, 18))), look: f < 50 ? [0.8, -0.2] : [0.8, 0], open: talk(f, [[18, 48]], 0.5), hold: f >= 50}, light);
}, undefined, VD18_LIGHT['CAM-LOW-SHELF']);
/** S03-SH01 camera: the picture push plus the tilt-follow `dy` 0 -> +130 px over f110-f125, so her head stays in frame. */
const s3sh01Camera = (tl: number): Camera => ({...push(126, 1.0, 1.04, 500, 700)(tl), dy: 130 * ease(seg(frameOf(tl), 110, 125))});
const s3sh01 = lowShelfPlate('S03-SH01', 126, s3sh01Camera, (p, proj, f, tl, light) => {
  // Rise on the story clock G1640-G1668 (= f110-f138; this shot ends at f125 mid-rise, S03-SH02 finishes it). Torch on
  // the right knee until f110, then to her right side with the lens down; the left hand pushes off the floor at f110.
  const pushOff = ease(seg(f, 110, 125));
  return crouchedPair(p, proj, tl,
    {crouch: 1 - riseAt(SHOT_G0['S03-SH01'] + f), head: f >= 60 && f < 84 ? 'left' : 'front', look: f < 60 ? [0.6, -0.4] : [0, 0], brow: f >= 45 ? 'quirk' : 'worry', open: 0,
      arms: {r: armBetween(proj, KEY.kneeR, KEY.hangR, pushOff), l: armBetween(proj, KEY.floorL, KEY.kneeL, pushOff), torch: lerp(torchAngle(proj, KEY.kneeR.hand, TORCH_KNEE_LENS), Math.PI / 2, pushOff)}},
    {crouch: 1, look: [0.8, 0], open: 0, hold: f < 112, nod: [0.12 * Math.sin((f - 72) * 0.7) * bump(f, 72, 90), 0]}, light);
}, undefined, VD18_LIGHT['CAM-LOW-SHELF']);
const sh10 = plate('S02-SH10', {
  paper: '#58605d',
  camera: push(120, 1.0, 1.06, 540, 650),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-LOW-CU'];
    const L = VD18_LIGHT['CAM-LOW-CU'];
    const pose = asmPoseAt(G);
    const rise = 0.025 * ease(seg(f, 96, 104));
    paintShop(p, proj, G, {outside: {asm: {pose, parts: assemblyParts(proj, pose)}}, light: L, actors: [
      actor(p, proj, 'occupant', -1.5, -1.1, {view: 'front', light: L, crouch: 1, face: face({look: [0.8, 0], brow: 'worry'}), lArm: arm(proj, [-1.1, 0.42, -1.32], 1)}, tl),
      actor(p, proj, 'narrator', -0.95, -1.3, {
        view: 'front', light: L, crouch: 1, rise, face: face({look: ptLerp([0, 0], [0.7, -0.8], ease(seg(f, 0, 30))), brow: 'worry', eyes: f >= 96 ? 'wide' : 'dot', open: talk(f, [[36, 90]], 0.45)}),
        // Arms tucked, hands on the knees, torch across the right knee (SS-R3.2); the held breath lifts elbows 2 cm.
        rArm: armBetween(proj, KEY.kneeR, KEY.kneeR, 0, 0.02 * ease(seg(f, 96, 104))), rHold: {kind: 'torch', angle: torchAngle(proj, KEY.kneeR.hand, TORCH_KNEE_LENS), on: 0},
        lArm: armBetween(proj, KEY.kneeL, KEY.kneeL, 0, 0.02 * ease(seg(f, 96, 104))),
      }, tl),
    ]});
  },
  Overlay: () => interiorOverlay('S02-SH10'),
});

const intRevPlate = (id: string, len: number, camera: (tl: number) => Camera, cast: (p: Painter, proj: Proj, G: number, f: number, tl: number, light: InteriorLight) => Drawable[], overlay?: (proj: Proj, G: number, f: number) => ReactNode) => {
  const proj = PROJ['CAM-INT-REV'];
  const light = VD18_LIGHT['CAM-INT-REV'];
  return plate(id, {
    paper: '#8d918a',
    camera,
    paint: (p, {G, f, tl}) => paintShop(p, proj, G, {light, actors: cast(p, proj, G, f, tl, light)}),
    Overlay: ({camera: cam, width, height, G, f}) => <>{overlay && <CameraLayer camera={cam} width={width} height={height}>{overlay(proj, G, f)}</CameraLayer>}{interiorOverlay(id)}</>,
  });
};

/** S02-SH06 occupant clutching her cardigan (SS-R3.4 AB0-F rows): the hands as before, the elbows move forward with the hands' ease f30-f50; no behind. */
const clutch = (proj: Proj, f: number): {rArm?: Arm; lArm?: Arm} => {
  if (f < 30) return {};
  const u = ease(seg(f, 30, 50));
  return {
    rArm: armVia(proj, [-1.24, lerp(0.9, 1.2, u), -1.75], mix3([-1.16, 0.86, -1.97], [-1.18, 0.90, -1.72], u)),
    lArm: armVia(proj, [-1.36, lerp(0.9, 1.15, u), -1.75], mix3([-1.44, 0.86, -1.97], [-1.42, 0.90, -1.72], u)),
  };
};
const sh06 = intRevPlate('S02-SH06', 108, push(108, 1.0, 1.05, 620, 660), (p, proj, G, f, tl, light) => [
  actor(p, proj, 'occupant', -1.3, -1.9, {
    view: 'front', light, face: face({look: [-0.35, -0.1], brow: 'worry'}),
    ...clutch(proj, f),
  }, tl),
  actor(p, proj, 'narrator', -1.0, -1.3, {
    view: 'front', light, face: face({look: [-0.35, -0.15], brow: 'worry', open: talk(f, [[18, 78]], 0.45)}),
    // SS-R3.4 AB1: the torch hand as before; the upper arm goes behind the torso (elbow z -1.36, plane z -1.22).
    rArm: armVia(proj, [-0.8, 0.98, -1.2], [-0.85, 0.93, -1.36], 'upper'), rHold: {kind: 'torch', angle: Math.PI / 2 + 0.25 - 0.1 * ease(seg(f, 60, 72)), on: 0},
  }, tl),
]);

/**
 * S03-SH02 torch (SS-R3.2, ST-07): the right hand swings forward from the hip (f36-f96) to (−0.80, 1.16, −0.88): 0.42 m
 * from the rig shoulder anchor (−0.814, 1.18, −1.30; SS-R3.4 corrected the r3 reference, which was (−0.77, 1.40, −1.3)),
 * below the chin line (1.275 m) and 0.50 m from the mouth. The sheet's former hand (1.30 m) sat at the chin and read as a
 * microphone beside the jaw (Boss r3). The torch points toward the lower left of the frame, the assembly side (screen
 * angle 2.92 rad).
 */
/** The S03-SH02 hand at the end of the raise (WORLD-SHOP m), exported for the ST-07 geometry test. */
export const SH02_TORCH_HAND: V3 = [-0.80, 1.16, -0.88];
const torchSH02 = (proj: Proj, f: number) => {
  const u = ease(seg(f, 36, 96));
  const hand = ptLerp(proj.P([-0.75, 0.95, -1.25]), proj.P(SH02_TORCH_HAND), u);
  return {hand, angle: lerp(Math.PI / 2, 2.92, u)};
};
/** The narrator's torso front plane (actor z -1.30 + 0.08; the camera looks -z, so nearer is the larger z). */
const SH02_TORSO_FRONT = -1.22;
/**
 * S03-SH02 arms (SS-R3.4 rows). The elbows sit 0.25 m below the rig shoulder anchors (y 0.93 m at the upright 1.18 m
 * shoulder; x −0.80 right, −1.10 left; z −1.36) and follow the crouched shoulder through the rise (f0–f12). The right
 * elbow then travels with the hand to (−0.80, 1.00, −1.10) (f36–f96). The upper arm is behind the torso while its elbow
 * is behind the torso front plane (about f68 on the right); the left upper arm stays behind.
 */
export const sh02Arms = (proj: Proj, f: number) => {
  const crouch = 1 - riseAt(SHOT_G0['S03-SH02'] + f);
  const rise = shoulderHeight('narrator', crouch) - shoulderHeight('narrator');
  const u = ease(seg(f, 36, 96));
  const elbowR = mix3([-0.80, 0.93 + rise, -1.36], [-0.80, 1.00, -1.10], u);
  const elbowL: V3 = [-1.10, 0.93 + rise, -1.36];
  const r: Arm = {to: torchSH02(proj, f).hand, via: proj.P(elbowR), behind: elbowR[2] < SH02_TORSO_FRONT ? 'upper' : undefined};
  const l: Arm = {to: proj.P([-1.05, 1.05, -1.2]), via: proj.P(elbowL), behind: 'upper'};
  return {crouch, elbowR, elbowL, r, l};
};
const s3sh02 = intRevPlate('S03-SH02', 144, push(144, 1.0, 1.06, 480, 700), (p, proj, G, f, tl, light) => {
  const {angle} = torchSH02(proj, f);
  const {crouch, r, l} = sh02Arms(proj, f);
  return [actor(p, proj, 'narrator', -0.95, -1.3, {
    view: 'front', light, crouch, warm: torchOnAt(G), face: face({look: [-0.35, 0], brow: 'worry', eyes: 'wide'}),
    rArm: r, rHold: {kind: 'torch', angle, on: torchOnAt(G)},
    lArm: l,
  }, tl)];
}, (proj, G, f) => {
  const on = torchOnAt(G);
  if (!on) return null;
  const {hand, angle} = torchSH02(proj, f);
  // Lens = hand + 0.16 m along the torch (drawFigure's grip offset + lens), at the narrator's depth (1100 px/m).
  const k = proj.k([-0.95, 0, -1.3]);
  const lens: Pt = [hand[0] + Math.cos(angle) * 0.16 * k, hand[1] + Math.sin(angle) * 0.16 * k];
  return (
    <>
      <Beam from={lens} to={[lens[0] + Math.cos(angle) * 700, lens[1] + Math.sin(angle) * 700]} level={on} r={160} w0={18} w1={220} reach={1.6} />
      <LensGlow at={lens} r={70} level={on} />
    </>
  );
});

// ------------------------------------------------------------------ S03-SH07, S04 interiors

const s3sh07 = plate('S03-SH07', {
  paper: '#8d918a',
  camera: push(90, 1.0, 1.05, 540, 700),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-INT-SIDE'];
    const L = VD18_LIGHT['CAM-INT-SIDE'];
    const door = doorAt(G);
    const a = asmAt(G);
    const ox = lerp(-0.9, -1.4, ease(seg(f, 12, 42)));
    const handle: V3 = [-0.45 - door, 1.0, -0.12];
    const walking = a.moving ? a.travel / 0.7 : undefined;
    const cart: Drawable = {depth: proj.depth([a.xs, 0, a.zs]), draw: () => paintCartSide(p, proj, a, a.travel)};
    paintShop(p, proj, G, {light: L, actors: [
      cart,
      actor(p, proj, 'worker', a.xs + 0.3, a.zs + 0.45, {
        view: 'left', light: L, walk: walking, wet: true, face: face({look: [-1, 0.1], brow: 'worry', eyes: 'half', mouth: 'o'}),
        rArm: arm(proj, [a.xs + 0.1, 0.97, a.zs + 0.38], 1),
        lHold: {kind: 'umbrella', tip: proj.P([a.xs + 0.35, 0.02, a.zs + 0.3])},
      }, tl),
      actor(p, proj, 'occupant', ox, -0.25, {
        view: 'front', light: L, nod: [0, 0.06 * bump(f, 12, 24)], face: face({look: f >= 6 && f < 24 ? [-0.8, 0] : [0.6, 0], brow: 'worry'}),
        lArm: f < 44 ? arm(proj, handle, 1) : undefined,
      }, tl),
      actor(p, proj, 'narrator', 0.95, -0.75, {
        view: 'right', light: L, head: f >= 6 && f < 21 ? 'left' : 'right', warm: 1, face: face({look: [1, 0.2], brow: f >= 6 && f < 21 ? 'up' : 'worry'}),
        rArm: arm(proj, [0.9, 1.05, -0.45], 1), rHold: {kind: 'torch', angle: 0.95, on: 1},
      }, tl),
    ]});
  },
  Overlay: ({camera: cam, width, height}) => {
    const proj = PROJ['CAM-INT-SIDE'];
    const lens = proj.P([0.9, 1.05, -0.3]);
    return (
      <>
        <CameraLayer camera={cam} width={width} height={height}>
          <Beam from={lens} to={proj.P([0.6, 0, 0.05])} level={1} r={170} w0={16} w1={160} reach={1.2} />
          <LensGlow at={lens} r={60} level={1} />
        </CameraLayer>
        {interiorOverlay('S03-SH07')}
      </>
    );
  },
});

/**
 * S04-SH01 slump (SS-R3.3): the worker stands at (0.25, -1.10), slumps toward the lens f48-f56 (crouch 0.30, head bowed, hands on
 * the thighs with elbows out), holds to f130, straightens f130-f138, turns his head to the narrator from f132 and his body to
 * profile right at f140. The hands and elbows are world metres; they blend from the standing hang by `slump`.
 */
const SLUMP = {
  handR: [0.12, 0.50, -1.22] as V3, handL: [0.38, 0.50, -1.22] as V3,
  elbowR: [-0.02, 0.80, -1.16] as V3, elbowL: [0.52, 0.80, -1.16] as V3,
  hangHandR: [0.04, 0.70, -1.10] as V3, hangHandL: [0.46, 0.70, -1.10] as V3,
  hangElbowR: [0.03, 0.95, -1.10] as V3, hangElbowL: [0.47, 0.95, -1.10] as V3,
};
const s4sh01 = plate('S04-SH01', {
  paper: '#8d918a',
  camera: push(240, 1.0, 1.04, 660, 600),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-INT-2S'];
    const light = VD18_LIGHT['CAM-INT-2S'];
    const walkU = ease(seg(f, 12, 42));
    const wx = lerp(0.2, 0.25, walkU), wz = lerp(0.0, -1.1, walkU);
    const slump = ease(seg(f, 48, 56)) * (1 - ease(seg(f, 130, 138)));
    const turn = seg(f, 132, 140);
    const armsOn = slump > 0;
    const via = (hand: V3, elbow: V3): Arm => ({to: proj.P(hand), via: proj.P(elbow)});
    const cw = mix3(SLUMP.hangHandR, SLUMP.handR, slump), ce = mix3(SLUMP.hangElbowR, SLUMP.elbowR, slump);
    const cl = mix3(SLUMP.hangHandL, SLUMP.handL, slump), cle = mix3(SLUMP.hangElbowL, SLUMP.elbowL, slump);
    const nStep = ease(seg(f, 0, 18));
    const nx = lerp(0.95, 0.85, nStep), nz = lerp(-0.75, -1.1, nStep);
    const cartPose = cartOnlyPose(G, f >= 18);
    const cart: Drawable = {depth: proj.depth([cartPose.S.xs, 0, cartPose.S.zs]), draw: () => {
      const parts = assemblyParts(proj, cartPose);
      paintAssembly(p, parts, 1, 24000);
      paintHubs(p, proj, cartPose);
    }};
    // Both aisle gondolas are drawn: SS-R3.2 ST-01 moved their front ends to z -2.8, clear of the two-shot.
    paintShop(p, proj, G, {light, actors: [
      cart,
      actor(p, proj, 'worker', wx, wz, {
        view: f >= 140 ? 'right' : 'front', head: f >= 132 ? 'right' : undefined, light, walk: f >= 12 && f < 42 ? (f - 12) / 16 : undefined,
        crouch: 0.30 * slump, nod: [0, 0.04 * slump], rise: 0.012 * slump * Math.sin(f * 0.45), wet: true,
        face: face({look: ptLerp([0, -0.6], [1, 0], turn), brow: 'worry', eyes: f < 138 ? 'half' : 'dot', mouth: f >= 48 && f < 138 ? 'o' : 'flat', open: talk(f, [[138, 186], [192, 240]], 0.8)}),
        rArm: armsOn ? via(cw, ce) : undefined,
        lArm: armsOn ? via(cl, cle) : f < 18 ? arm(proj, [wx + 0.15, 0.9, wz - 0.1], 1) : undefined,
        lHold: f < 12 ? {kind: 'umbrella', tip: proj.P([wx + 0.25, 0.02, wz - 0.15])} : undefined,
      }, tl),
      actor(p, proj, 'narrator', nx, nz, {
        view: 'left', light, warm: 0.6, face: face({look: [1, 0], brow: 'worry', open: talk(f, [[18, 66], [72, 114]], 0.8)}),
        rArm: arm(proj, [nx - 0.05, 0.78, nz - 0.1], 1), rHold: {kind: 'torch', angle: Math.PI / 2 - 0.4, on: 1},
      }, tl),
    ]});
  },
  Overlay: ({camera: cam, width, height, f}) => {
    const proj = PROJ['CAM-INT-2S'];
    const nStep = ease(seg(f, 0, 18));
    const nx = lerp(0.95, 0.85, nStep), nz = lerp(-0.75, -1.1, nStep);
    const pool = proj.P([nx + 0.05, 0, nz - 0.35]);
    return (
      <>
        <CameraLayer camera={cam} width={width} height={height}>
          <LensGlow at={proj.P([nx - 0.02, 0.7, nz - 0.15])} r={40} level={1} pool={{c: pool, rx: 120, ry: 34}} />
        </CameraLayer>
        {interiorOverlay('S04-SH01')}
      </>
    );
  },
});

const s4sh02 = plate('S04-SH02', {
  paper: '#8d918a',
  camera: push(120, 1.0, 1.08, 540, 700),
  paint: (p, {G, f, tl}) => {
    const proj = PROJ['CAM-INT-DOOR-REV'];
    const L = VD18_LIGHT['CAM-INT-DOOR-REV'];
    const on = torchOnAt(G);
    const front = f >= 36;
    // SS-R3.4 AB0 hang: profile f24-f36 the hand lowers to her side with the torch lens going down; front from f36 the rig's
    // straight hang on her right side (screen-left). The r4 point crossed her body to her left hip.
    const lower = ease(seg(f, 24, 36));
    paintShop(p, proj, G, {light: L, actors: [
      actor(p, proj, 'narrator', 0.85, -1.1, {
        view: front ? 'front' : 'right', light: L, head: f >= 30 ? 'front' : 'right', warm: on,
        face: face({look: f >= 48 ? [0.25, 0] : f >= 30 ? [0.1, 0] : [1, 0], brow: f >= 48 ? 'worry' : 'flat', eyes: f >= 60 ? 'wide' : 'dot'}),
        rArm: front ? arm(proj, [1.02, 0.66, -1.10], -1) : arm(proj, mix3([0.60, 1.00, -1.00], [0.86, 0.66, -1.10], lower), 1),
        rHold: {kind: 'torch', angle: front ? Math.PI / 2 + 0.2 : lerp(0.6, Math.PI / 2 + 0.2, lower), on},
      }, tl),
    ]});
  },
  Overlay: () => interiorOverlay('S04-SH02'),
});

export const worldfogShots: PaintedShot[] = [
  carPlate,
  forecourtPlate,
  counterInPlate,
  phonePlate,
  counterOutPlate,
  windowPlate('S02-SH04', push(198, 1.0, 1.1, 540, 700), {assembly: true, veil: true}),
  sh05,
  sh06,
  windowPlate('S02-SH07', push(129, 1.1, 1.13, 560, 650), {assembly: true, veil: true}),
  sh08,
  windowPlate('S02-SH09', (tl) => pushCamera(tl, 179 / FPS, {s0: 1.22, s1: 1.3, fx: 560, fy: 650}), {assembly: true, veil: true}),
  sh10,
  s3sh01,
  s3sh02,
  windowPlate('S03-SH03', (tl) => pushCamera(tl, 119 / FPS, {s0: 1.3, s1: 1.34, fx: 560, fy: 650}), {assembly: true, veil: true}),
  windowPlate('S03-SH04', fixedCam(42, {s0: 2.2, s1: 2.3, fx: 503, fy: 598, dx: 37, dy: -38}), {assembly: true, veil: false}),
  windowPlate('S03-SH05', fixedCam(72, {s0: 1.8, s1: 1.9, fx: 695, fy: 872, dx: -135, dy: -232}), {assembly: true, veil: false}),
  windowPlate('S03-SH06', () => ({s: 3.0, fx: 577, fy: 1219, dx: -37, dy: -499}), {assembly: true, veil: false, jam: true, lowBank: 0.2, sheen: 0}),
  s3sh07,
  s4sh01,
  s4sh02,
  windowPlate('S04-SH03', push(90, 1.0, 1.06, 540, 700), {assembly: false, veil: false}),
];

export type {Proj};
