// WFOG-EP01-SHORT acceptance numbers from the shared rig and the plate cameras (Boss QA, SS-R3.2 rows).
// Run: node --import tsx scripts/world-fog/lead-check.ts   (prints one line per check; no rendering)
// Figure heads and feet come from the cast rig (drawFigure anchors, no-op painter), projected with the plate camera.
// Lead rows without a rig pose use the sheet's design heights, as in the 30 Oct checkpoint (out/tmp/lead.ts).
import {cameraAt} from '../../src/painted/registry';
import {toScreen} from '../../src/painted/camera';
import type {Painter, Pt} from '../../src/painted/painter';
import {drawFigure, type FigPose} from '../../src/painted/worldfog/cast';
import {LIT, asmPoseAt, assemblyParts, casterHubs} from '../../src/painted/worldfog/assembly';
import {farShapeAt} from '../../src/painted/worldfog/car';
import {PROJ, SHOT_ROWS, asmAt, riseAt, type SetupId} from '../../src/painted/worldfog/space';
import {SH02_TORCH_HAND, SH07_TORCH, beamSH06A} from '../../src/painted/shots/worldfog';

// A painter that accepts every call and draws nothing: drawFigure then returns its anchors only.
const noop: unknown = new Proxy(() => undefined, {get: (_t, k) => (k === 'alpha' ? 1 : noop), apply: () => undefined});
const painter = noop as Painter;
const face = {brow: 'worry' as const, eyes: 'dot' as const, look: [0, 0] as Pt, mouth: 'flat' as const};

const camOf = (id: string, f: number) => cameraAt(`WFOG-${id}`, f / 30);
const rowOf = (id: string) => SHOT_ROWS.find((r) => r.id === id)!;

/** Rig anchors of one figure at a plate position: head top and feet (screen y, after the plate camera). */
const rigFigure = (id: string, setup: SetupId, who: 'narrator' | 'worker' | 'occupant' | 'shopworker', x: number, z: number, f: number, pose: Partial<FigPose>) => {
  const proj = PROJ[setup], cam = camOf(id, f);
  const g = proj.P([x, 0, z]), unit = proj.k([x, 0, z]);
  const a = drawFigure(painter, who, g, unit, {view: 'front', face, ...pose}, 0);
  const headTop = toScreen(cam, [a.head[0], a.headTop])[1], feet = toScreen(cam, [g[0], g[1]])[1];
  return {headTop: Math.round(headTop), feet: Math.round(feet), lead: Math.round(feet - headTop), headX: Math.round(toScreen(cam, a.head)[0])};
};

const out: string[] = [];
const log = (s: string) => out.push(s);

// 1. S01-SH01 far shape (ST-09 scale; SS-R3.2): height, scale constant and ground at f0, f108, f125.
for (const f of [0, 108, 125]) {
  const s = farShapeAt(f);
  log(`S01-SH01 f${f}: ground (${Math.round(s.g[0])}, ${Math.round(s.g[1])}), height ${s.h.toFixed(1)} px, k ${s.k.toFixed(1)} px/m`);
}

// 2. S02-SH01 counter-in narrator full length (SS-R3.2: 991 px at f0 by the sheet; lead from the design height).
log('S02-SH01 narrator lead f0 (design 1.70 m): ' + JSON.stringify(rigFigure('S02-SH01', 'CAM-COUNTER-IN', 'narrator', -0.3, -2.1, 0, {view: 'front', face: face as never})));

// 3. S03-SH04 helmet pivot: seated bbox centre (-0.10, 1.725, 0.62) must land at (540, 560) at s 2.2 and s 2.3.
const helmetC: [number, number, number] = [-0.1, 1.725, 0.62];
for (const f of [0, 20, 41]) {
  const [x, y] = toScreen(camOf('S03-SH04', f), PROJ['CAM-GLASS-OUT'].P(helmetC));
  log(`S03-SH04 f${f} helmet centre (${Math.round(x)}, ${Math.round(y)}) target (540, 560) +-10`);
}

// 4. S03-SH06 jammed caster per frame (static camera; sheet f0 (540, 720), f16 (539, 700), f30 (535, 669); +-12 px at G2050).
for (const f of [0, 16, 30]) {
  const G = rowOf('S03-SH06').g0 + f;
  const hub = casterHubs(PROJ['CAM-GLASS-OUT'], asmPoseAt(G))[3].c;
  const [x, y] = toScreen(camOf('S03-SH06', f), hub);
  log(`S03-SH06 f${f} (G${G}) jammed hub (${Math.round(x)}, ${Math.round(y)})`);
}

// 5. S02-SH05 cart and wheel at G760 (f22): lowest assembly point and caster hubs, all above y 950.
{
  const pose = asmPoseAt(760), cam = camOf('S02-SH05', 22);
  const parts = assemblyParts(PROJ['CAM-LOW-SHELF'], pose).filter((p) => !p.inner);
  const ys = parts.flatMap((p) => p.pts.map((q) => toScreen(cam, q)[1]));
  const hubs = casterHubs(PROJ['CAM-LOW-SHELF'], pose).map(({c, jammed}) => `${jammed ? 'jammed' : 'free'} (${Math.round(toScreen(cam, c)[0])}, ${Math.round(toScreen(cam, c)[1])})`);
  log(`S02-SH05 G760 cart lowest part y ${Math.round(Math.max(...ys))}; caster hubs ${hubs.join(', ')}`);
}

// 6. S04-SH01 G2380 (f40, SS-R4; was G2200): both faces inside y 300-950 and both leads >= 480 px.
{
  const worker = rigFigure('S04-SH01', 'CAM-INT-2S', 'worker', 0.2497, -1.093, 40, {view: 'front'});
  const narrator = rigFigure('S04-SH01', 'CAM-INT-2S', 'narrator', 0.85, -1.1, 40, {view: 'front'});
  log(`S04-SH01 G2380 worker ${JSON.stringify(worker)}; narrator ${JSON.stringify(narrator)}`);
}

// 6b. S04-SH01 slumped worker (SS-R3.3, frames unchanged by SS-R4): crouch 0.30 with the head bowed (nod 0.04 head units,
// calibrated to head top ~573); f56 (G2396), f100 (G2440) hold the slump, f130 (G2470) still bent. Sheet: head top ~573, feet 1378, visible ~805 px.
for (const f of [56, 100, 130]) {
  const r = rigFigure('S04-SH01', 'CAM-INT-2S', 'worker', 0.25, -1.1, f, {view: 'front', crouch: 0.3, nod: [0, 0.04]});
  log(`S04-SH01 G${rowOf('S04-SH01').g0 + f} (f${f}) slumped worker ${JSON.stringify(r)} (sheet head top ~573, lead ~805)`);
}

// 6c. S01-SH02 narrator step-out (SS-R3.3 marks): standing lead at f48 (G174, z 4.15 in the door's V) and at f62 (z 3.80).
for (const [f, z] of [[48, 4.15], [62, 3.80]] as const) {
  log(`S01-SH02 G${126 + f} (f${f}) narrator at (-1.35, ${z}) ${JSON.stringify(rigFigure('S01-SH02', 'CAM-FORECOURT', 'narrator', -1.35, z, f, {view: 'front'}))} (sheet design lead 759 at 3.80, face y 764)`);
}

// 6d. S02-SH03 counter-out (SS-R3.3 eye 1.10, y_h 780): worker head top and the counter far/near top edges at G474 (f30) and G500 (f56).
for (const f of [30, 56]) {
  const cam = camOf('S02-SH03', f), proj = PROJ['CAM-COUNTER-OUT'];
  const w = rigFigure('S02-SH03', 'CAM-COUNTER-OUT', 'shopworker', -2.0, -3.5, f, {view: 'front'});
  const far = toScreen(cam, proj.P([-2.0, 0.9, -3.2]))[1], near = toScreen(cam, proj.P([-2.0, 0.9, -2.6]))[1];
  const face = toScreen(cam, [w.headX, 0] as never)[0];
  log(`S02-SH03 G${444 + f} counter far top ${Math.round(far)}, near top ${Math.round(near)} (sheet 929 / 1003); worker head top ${w.headTop}, lead to far top ${Math.round(far - w.headTop)} (sheet 397 / 532 px); head x ${w.headX} (sheet 540)`);
}

// 6e. S03-SH02 torch hand and lens at G1790 (f134, s 1.06): hand (342, 1209) and lens (169, 1290) +-15 px (sheet); hand >= 0.45 m from the face centre.
{
  const cam = camOf('S03-SH02', 134), proj = PROJ['CAM-INT-REV'];
  const hand = toScreen(cam, proj.P(SH02_TORCH_HAND)), lens = toScreen(cam, proj.P([-0.749, 1.163, -0.771]));
  const face = [-0.95, 1.49, -1.3], d = Math.hypot(SH02_TORCH_HAND[0] - face[0], SH02_TORCH_HAND[1] - face[1], SH02_TORCH_HAND[2] - face[2]);
  log(`S03-SH02 G1790 hand (${Math.round(hand[0])}, ${Math.round(hand[1])}) lens (${Math.round(lens[0])}, ${Math.round(lens[1])}) (sheet 342,1209 / 169,1290); hand to face centre ${d.toFixed(3)} m (>= 0.45)`);
}

// 7. S03-SH01 rise (G1640-G1668 clock): narrator head top in frame (>= 150 px), lead >= 480 px at G1600 (crouched).
for (const f of [0, 70, 110, 118, 125]) {
  const G = rowOf('S03-SH01').g0 + f;
  const r = rigFigure('S03-SH01', 'CAM-LOW-SHELF', 'narrator', -0.95, -1.3, f, {crouch: 1 - riseAt(G), view: 'front'});
  log(`S03-SH01 f${f} (G${G}) crouch ${(1 - riseAt(G)).toFixed(3)} head top ${r.headTop}, feet ${r.feet}, rig lead ${r.lead}`);
}

// 8. S02-SH08 / S02-SH10 crouched narrator leads at start/mid/end (design head top 1.02 m is the sheet value).
for (const [id, setup, f] of [['S02-SH08', 'CAM-LOW-SHELF', 11], ['S02-SH08', 'CAM-LOW-SHELF', 100], ['S02-SH08', 'CAM-LOW-SHELF', 199], ['S02-SH10', 'CAM-LOW-CU', 60]] as const) {
  const G = rowOf(id).g0 + f;
  const r = rigFigure(id, setup, 'narrator', -0.95, -1.3, f, {crouch: 1, view: 'front'});
  log(`${id} f${f} (G${G}) crouched narrator rig: head top ${r.headTop}, feet ${r.feet}, lead ${r.lead}`);
}

// 9. S03-SH07 bar width and face (SS-R4 RT-2): door jamb (x 0.46-0.54, z -0.06..0, the only frame bar in view) at G2320 (f186, SS-R5.1)
// and the worker's face centre (rig head at (0.20, 1.49, 0.00), G2339 = f205), against the jamb's left edge.
{
  const proj = PROJ['CAM-INT-SIDE'];
  const cam320 = camOf('S03-SH07', 186), cam339 = camOf('S03-SH07', 205);
  const jambL = toScreen(cam320, proj.P([0.46, 1.0, -0.06]))[0], jambR = toScreen(cam320, proj.P([0.54, 1.0, 0]))[0];
  const faceX = toScreen(cam339, proj.P([0.2, 1.49, 0]))[0];
  const jambL339 = toScreen(cam339, proj.P([0.46, 1.0, -0.06]))[0];
  // SS-R4.1 R8-3: purpose rule (the jamb is the only frame bar; it covers no eye, nose or mouth at G2320-G2339). No px limit.
  log(`S03-SH07 G2320 jamb bar ${Math.round(jambR - jambL)} px wide (x ${Math.round(jambL)}..${Math.round(jambR)}; purpose rule R8-3, no px limit); G2339 worker rig head centre (hood) x ${Math.round(faceX)}, jamb left edge ${Math.round(jambL339)}: clear by ${Math.round(jambL339 - faceX)} px (eye at x ~810 and nose at x ~775 by the native crop of r8 G2339; the jamb covers the back of the hood only)`);
  log(`S03-SH07 mullion at x 1.75 projects at x ${Math.round(toScreen(cam320, proj.P([1.75, 1.0, -0.03]))[0])} (off frame if >= 1080)`);
  // Worker lead at G2339 (profile, left; rig at the cart's stop-side offset (0.3, 0.45) from S = (-0.10, -0.45)): sheet lead >= 480 px.
  const w339 = rigFigure('S03-SH07', 'CAM-INT-SIDE', 'worker', -0.1 + 0.3, -0.45 + 0.45, 205, {view: 'left'});
  log(`S03-SH07 G2339 worker (profile, rig) ${JSON.stringify(w339)} (sheet: lead >= 480 px)`);
}

// 9a. S03-SH07 torch (SS-R4.1 R8-1): hand, lens and pool at G2230 (f40) and G2320 (f186, SS-R5.1), s from the plate camera.
// Sheet: hand (540, 1107)-(540, 1127) +-15, lens (584, 1164)-(586, 1187) +-15, pool (790, 1425)-(802, 1461) +-25.
// Shot-local frame of a story key in S03-SH07 (SS-R5.1): e = G − 2190 up to the hold at e71, then f = G − 2134.
for (const G of [2230, 2320]) {
  const f = G <= 2261 ? G - 2190 : G - 2134;
  const cam = camOf('S03-SH07', f), proj = PROJ['CAM-INT-SIDE'];
  const at = (p: typeof SH07_TORCH.hand) => toScreen(cam, proj.P(p)).map((v) => Math.round(v));
  log(`S03-SH07 G${G} (f${f}, s ${cam.s.toFixed(3)}) torch hand ${at(SH07_TORCH.hand)} lens ${at(SH07_TORCH.lens)} pool ${at(SH07_TORCH.target)}`);
}

// 9b'. S03-SH07 "pole" (SS-R4.1 R8-8): the glass-front top rail (shop.ts box 27, y 2.16) and sill (box 28, y 0.05) run along the view
// axis; their image lines meet at the principal point (540, 700), so they read as one dark diagonal. Omitted in S03-SH07 (paintShop omit).
{
  const cam = camOf('S03-SH07', 186), proj = PROJ['CAM-INT-SIDE'];
  const s = (p: [number, number, number]): Pt => toScreen(cam, proj.P(p));
  const meet = (p1: Pt, p2: Pt, p3: Pt, p4: Pt): Pt => {
    const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
    const a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
    return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
  };
  const rail = [s([-3, 2.16, 0]), s([0, 2.16, 0])] as const, sill = [s([-3, 0.05, 0]), s([0, 0.05, 0])] as const;
  const x = meet(rail[0], rail[1], sill[0], sill[1]);
  log(`S03-SH07 G2320 glass-front rail (box 27) and sill (box 28) image lines meet at (${Math.round(x[0])}, ${Math.round(x[1])}) (principal point 540, 700): the pole of R8-8; both omitted in S03-SH07`);
}

// 9b. S03-SH06A beam hold (SS-R4.1 R8-2): BEAM_END (583, 689) at f0-f30 (G2070-G2100), eased to (588, 820) at f66 (G2136).
{
  const b100 = toScreen(camOf('S03-SH06A', 30), beamSH06A(2100));
  log(`S03-SH06A G2100 beam centre (plate px at s 1: 583, 689) screen (${b100[0].toFixed(0)}, ${b100[1].toFixed(0)}); G2136 screen unchanged (sheet 595, 861)`);
}

// 9b. S03-SH06A held look (SS-R4 RT-1): worker height and face at G2100 (f30), beam centre at G2136 (f66); sheet 674 +-15, (615, 705) +-15, (595, 861) +-20.
{
  const pose = asmPoseAt(2100), cam = camOf('S03-SH06A', 30);
  const parts = assemblyParts(PROJ['CAM-GLASS-OUT'], pose, 1);
  const hood = Math.min(...parts.filter((q) => q.lit === LIT.coat).flatMap((q) => q.pts.map((pt) => pt[1])));
  const skin = parts.filter((q) => q.lit === LIT.skin).flatMap((q) => q.pts);
  const face = toScreen(cam, [skin.reduce((s, q) => s + q[0], 0) / skin.length, skin.reduce((s, q) => s + q[1], 0) / skin.length]);
  const feet = toScreen(cam, PROJ['CAM-GLASS-OUT'].P([pose.S.xs + 0.3, 0, pose.S.zs + 0.45]));
  const height = feet[1] - toScreen(cam, [0, hood])[1];
  const beam = toScreen(camOf('S03-SH06A', 66), beamSH06A(2136));
  log(`S03-SH06A G2100 worker ${height.toFixed(0)} px (sheet 674), face (${face[0].toFixed(0)}, ${face[1].toFixed(0)}) (sheet 615, 705); G2136 beam centre (${beam[0].toFixed(0)}, ${beam[1].toFixed(0)}) (sheet 595, 861)`);
}

// 10. Assembly position check for the S04-SH01 gondola edge (front end z -2.8): front-left edge x at the two-shot.
{
  const cam = camOf('S04-SH01', 0);
  log(`S04-SH01 gondola A front-left edge x ${Math.round(toScreen(cam, PROJ['CAM-INT-2S'].P([0.6, 1.6, -2.8]))[0])} (sheet 1043 at s 1.0)`);
  log(`S04-SH01 stop reference: stack centre z ${asmAt(2340).zs.toFixed(2)} (SS-R4 push ends G2339)`);
}

console.log(out.join('\n'));
