// EDU-EP16 R1.4 Boss scene-asset comp cards: one still per asset state.
import type {CSSProperties} from 'react';
import {Painted, FONT} from '../../../../src/painted/survival/frame';
import {paintVillage} from '../../../../src/painted/survival/village';
import type {YCam} from '../../../../src/painted/kit/ycam';

const tag = (x: number, y: number, size = 34): CSSProperties => ({position: 'absolute', left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#fff', WebkitTextStroke: '5px rgba(20,20,20,0.7)', paintOrder: 'stroke fill'});
const cam = (x: number, y: number, z: number, yaw = 0, f = 900, hy = 960, pitch = 0): YCam => ({x, y, z, yaw, f, hy, pitch});
export const CARDS: Record<string, () => JSX.Element> = {};

const gran = (id: string, open: number, heap: boolean, c: YCam, label: string) => {
  CARDS[id] = () => (
    <Painted band={false} paper="#cfdcc4" paint={(p) => paintVillage(p, c, {mode: 'morning', t: 0.3, granary: {open, heap}})}>
      <div style={tag(30, 30)}>{label}</div>
    </Painted>
  );
};
gran('GRANARY-SHUT', 0, false, cam(7.75, 1.5, -1.5), 'N16-04 R2 granary, doors shut');
gran('GRANARY-HALF', 0.5, false, cam(7.75, 1.5, -1.5), 'doors half open (inward)');
gran('GRANARY-HEAP', 1, true, cam(7.75, 1.5, -1.5), 'doors open: paddy heap and spill');
gran('GRANARY-HEAP-CU', 1, true, cam(7.9, 1.3, -4.2, 0.0, 1300, 900), 'close: heap, spill, ladder');

// ---- N16-20 sky day/night cycle (shot 12 camera) and paddy growth stages
import {camMove, camOf} from '../../../../src/painted/kit/cam-moves';
import {paintSkyCycle, paddyStageItems, postShadowItem, skyColorsAt, PADDY_BY_DAY, PADDY_STAGES} from '../../../../src/painted/survival/sky-cycle';
const cam12 = () => camOf(camMove([16, 1.2, -1.0], [-88, -88], [17.6, 17.6], 1.6, {f: 820, hy: 900, ease: [0, 1]}), 0);
const fencePosts: [number, number][] = [[11, -12], [9.5, -12], [8, -12], [6.5, -12], [5, -12]];
const skyCard = (id: string, u: number, stage: number, label: string) => {
  CARDS[id] = () => {
    const c = cam12();
    return (
      <Painted band={false} paper="#cfdcc4" paint={(p) => {
        let L = {amb: '#d6e2c8', k: 0.1};
        paintVillage(p, c, {mode: 'morning', t: 0.3, sky: (q, cc) => { L = paintSkyCycle(q, cc, u, {t: 0.3}); }, light: skyColorsAt(u).light, extra: [...paddyStageItems(stage, skyColorsAt(u).light, {t: 0.3}), postShadowItem(fencePosts, u)]});
        void L;
      }}>
        <div style={tag(30, 30)}>{label}</div>
      </Painted>
    );
  };
};
[[0.2, 0, 'day (0.20)'], [0.57, 0, 'dusk start (0.57)'], [0.62, 0, 'dusk (0.62)'], [0.72, 0, 'night (0.72)'], [0.86, 0, 'late night (0.86)'], [0.93, 0, 'dawn (0.93)'], [0.98, 0, 'dawn end (0.98)']].forEach(([u, s, l], i) => skyCard(`SKY-${i}`, u as number, s as number, `N16-20 sky ${l}`));
PADDY_BY_DAY.forEach((id, d) => skyCard(`PADDY-${d + 1}`, 0.2, PADDY_STAGES.indexOf(id), `N16-20 day ${d + 1} paddy: ${id}`));
skyCard('PADDY-MID', 0.95, 1.5, 'paddy crossfade 1.5 at dawn (0.95)');

// ---- N16-03 R2 hen: two legs in every view and step state (old = the draft's hen + foot close-up, three legs)
import {paintHen, paintHenStep, type HenPose} from '../../../../src/painted/survival/hen';
import {LIGHT} from '../../../../src/painted/survival/village';
const henCard = (id: string, label: string, draw: (p: Parameters<Parameters<typeof Painted>[0]['paint']>[0], c: YCam) => void, c: YCam) => {
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => { p.flat('#cfdcc4', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); p.flat('#b39a72', [[0, 1100], [1080, 1100], [1080, 1920], [0, 1920]]); draw(p, c); }}><div style={tag(30, 30)}>{label}</div></Painted>;
};
const hc = cam(3.4, 0.3, -7.3, 0, 1500, 1000);
henCard('HEN-OLD', 'OLD (draft): hen with both legs + foot close-up = 3 legs', (p, c) => { paintHenStep(p, c, [3.4, 0, -8.4], {view: 'front', tilt: 12}, LIGHT.morning, {cu: null, lift: 0.08}); }, hc);
henCard('HEN-STEP', 'N16-03 R2 step toward the lens: foot lifted 0.08 m', (p, c) => paintHenStep(p, c, [3.4, 0, -8.4], {view: 'front', tilt: 12}, LIGHT.morning, {lift: 0.08}), hc);
henCard('HEN-PLANT', 'foot planted (contact)', (p, c) => paintHenStep(p, c, [3.4, 0, -8.4], {view: 'front', tilt: 0}, LIGHT.morning, {lift: 0}), hc);
henCard('HEN-SIDE', 'side view trot: two legs', (p, c) => paintHen(p, c, [3.4, 0, -8.4], {view: 'right', lift: 0.8}, LIGHT.morning), hc);
henCard('HEN-BACK', 'back view: two legs', (p, c) => paintHen(p, c, [3.4, 0, -8.4], {view: 'back'}, LIGHT.morning), hc);
void ({} as HenPose);

// ---- N16-21 laugh bounce: lean is radians (draft passed 5 * sin = up to 286 deg)
import {paintCast} from '../../../../src/painted/survival/cast';
import {paintHeldProp} from '../../../../src/painted/survival/props';
import {laughFig} from '../../../../src/painted/survival/poses';
const laughCard = (id: string, label: string, fig: object) => {
  const c = cam(3.0, 1.1, -4.8, 0, 1100, 960);
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => {
    paintVillage(p, c, {mode: 'morning', t: 0.3, extra: [{at: [3, 0, -9.3], draw: (q, cc) => { paintCast(q, cc, 'Y', {at: [3, 0, -9.3], facing: [0, 1], pose: 'P01', face: 'laugh', fig, t: 0.3, held: (qq: any, a: any, u: number) => paintHeldProp(qq, 'eggs-apron', [a.rHand[0], a.rHand[1]], u, {seed: 52800})} as any); }}]});
  }}><div style={tag(30, 30)}>{label}</div></Painted>;
};
laughCard('LAUGH-OLD', 'OLD: lean = 5 * sin (radians!) at its peak', {lean: 5 * Math.sin(1.4)});
laughCard('LAUGH-A', 'N16-21 laughFig peak +4 deg', laughFig(0.125));
laughCard('LAUGH-B', 'laughFig peak -4 deg', laughFig(0.375));
laughCard('LAUGH-0', 'laughFig rest', laughFig(0));

// ---- N16-11 R2 river waterline
import {paintRiver, RIVER_LIGHT} from '../../../../src/painted/survival/river';
import {kneeLevel, waterlineItem} from '../../../../src/painted/survival/water';
const riverCard = (id: string, label: string, lvl: number | null) => {
  const c = cam(5.5, 1.2, 1.2, 0, 1000, 930), L = RIVER_LIGHT.day, at: [number, number, number] = [5.8, 0, -2.4];
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => paintRiver(p, c, {t: 0.5, extra: [
    {at, draw: (q, cc) => { paintCast(q, cc, 'K', {at, facing: [0.4, 1], pose: 'P01', face: 'happy', t: 0.5} as any); }},
    ...(lvl === null ? [] : [waterlineItem(at, lvl, {L, t: 0.5})]),
  ]})}><div style={tag(30, 30)}>{label}</div></Painted>;
};
riverCard('RIVER-DRY', 'no waterline (before): legs stand on the river', null);
riverCard('RIVER-KNEE', 'N16-11 R2 knee-deep: legs hidden below the knee', kneeLevel('K'));
riverCard('RIVER-SHIN', 'ankle-deep 0.1 m', 0.1);

// ---- N16-17 seed cone
import {propAnchor} from '../../../../src/painted/survival/props';
CARDS['CONE'] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => {
  p.flat('#cfdcc4', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  paintHeldProp(p, 'seed-cone', [270, 700], 2200, {seed: 60000});
  paintHeldProp(p, 'seed-cone', [800, 700], 2200, {seed: 61000, ang: 0.7});
  paintHeldProp(p, 'seed-cone', [270, 1350], 700, {seed: 62000});   // at hand scale (kid 600 px/m)
  paintHeldProp(p, 'seed-cone', [520, 1350], 700, {seed: 62100, ang: -1.2, s: -1});
  for (const [h, u, o] of [[[270, 700], 2200, {}], [[800, 700], 2200, {ang: 0.7}]] as const) { const m = propAnchor('seed-cone', 'mouth', h as any, u, o as any); p.flat('#2a6ae0', Array.from({length: 10}, (_, i) => [m[0] + 9 * Math.cos(i * 0.628), m[1] + 9 * Math.sin(i * 0.628)] as [number, number])); }
}}><div style={tag(30, 30)}>N16-17 seed cone (blue dot = mouth anchor)</div></Painted>;

// ---- N16-18 point-up: the finger on the line to a target (green dot)
const pointCard = (id: string, label: string, view: 'front' | 'left' | 'right', target: [number, number, number], facing: [number, number]) => {
  const c = cam(0, 1.0, 3.0, 0, 1000, 1000), at: [number, number, number] = [0, 0, 0];
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => {
    p.flat('#cfdcc4', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); p.flat('#b39a72', [[0, 1000], [1080, 1000], [1080, 1920], [0, 1920]]);
    paintCast(p, c, 'K', {at, view, facing, pose: 'P01', face: 'surprised', spose: 'point-up', sk: 1, aimAt: target, t: 0.3} as any);
    const tp = camPoint(c, target); if (tp) p.flat('#20c040', Array.from({length: 12}, (_, i) => [tp[0] + 10 * Math.cos(i * 0.5236), tp[1] + 10 * Math.sin(i * 0.5236)] as [number, number]));
  }}><div style={tag(30, 30)}>{label}</div></Painted>;
};
import {camPoint} from '../../../../src/painted/kit/ycam';
pointCard('POINT-R', 'N16-18 point-up front, target up-right', 'front', [1.2, 1.9, 0], [0, 1]);
pointCard('POINT-L', 'front, target up-left', 'front', [-1.0, 2.2, 0], [0, 1]);
pointCard('POINT-SIDE', 'profile facing right, target ahead-up', 'right', [1.3, 1.9, 0], [1, 0.35]);

// ---- N16-19 creature depth split: a long-neck behind near tree ferns, head browsing in front of them
import {paintSorted} from '../../../../src/painted/kit/world';
import {paintTreeFern, paintFernClump} from '../../../../src/painted/survival/forest';
import {beastItems, beastSlabs} from '../../../../src/painted/survival/beast-sort';
import {BEAST_KIT} from '../../../../src/painted/survival/beast-kit';
import {paintSkyBands} from '../../../../src/painted/kit/sky';
const depthCard = (id: string, label: string, split: boolean | 'slabs') => {
  const c = cam(2, 1.6, 0, 0, 520, 1100), B = BEAST_KIT.LONGNECK.anims.CHEW.build(0.15), place = {at: [0, -16] as [number, number], heading: 1.25};
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => {
    paintSkyBands(p, {from: '#a9c4c8', via: '#cfdcc4', to: '#e8e6c8', horizon: 940, width: 1080, viaAt: 0.55, bands: 10, style: 'flat'});
    p.flat('#6f8a48', [[0, 940], [1080, 940], [1080, 1920], [0, 1920]]);
    const L = LIGHT.morning;
    paintSorted(p, c, [
      ...(split === 'slabs' ? beastSlabs(c, B, place, 5) : beastItems(B, place, split ? [{root: 'neck'}] : [])),
      {at: [-2.5, 0, -12], draw: (q, cc) => paintTreeFern(q, cc, [-2.5, 0, -12], 6.5, L, 9101)},
      {at: [4.5, 0, -11], draw: (q, cc) => paintTreeFern(q, cc, [4.5, 0, -11], 7, L, 9102)},
      {at: [1, 0, -9], draw: (q, cc) => paintFernClump(q, cc, [1, 0, -9], 1.4, L, 9103)},
    ]);
  }}><div style={tag(30, 30)}>{label}</div></Painted>;
};
depthCard('DEPTH-OLD', 'one item: the head sits behind the ferns', false);
depthCard('DEPTH-SLABS', 'N16-19 depth slabs (5): neck passes behind the near fern, head in front', 'slabs');
depthCard('DEPTH-NEW', 'N16-19 split body | neck+head: head in front, body behind', true);

// ---- N16-09 R2 painted fruit and flower tiles
import {paintFlowerPopCard} from '../../../../src/painted/survival/cards';
import {paintFlowerPopCardR2} from '../../../../src/painted/survival/cards-r2';
for (const f of [10, 30, 48, 70]) {
  CARDS[`FLOWERS-OLD-F${f}`] = () => <Painted band={false} paper="#2a3a24" paint={(p) => paintFlowerPopCard(p, f)}><div style={tag(30, 30)}>old f{f}</div></Painted>;
  CARDS[`FLOWERS-R2-F${f}`] = () => <Painted band={false} paper="#2a3a24" paint={(p) => paintFlowerPopCardR2(p, f)}><div style={tag(30, 30)}>N16-09 R2 f{f}</div></Painted>;
}

// ---- R1.5 R3 river: boulder B1, reed bed RD, fern row FC (parts), impulse rings, shade light, T. rex stalk / sniff, crouching figures at the waterline
import {camMove, camOf} from '../../../../src/painted/kit/cam-moves';
import {B1, boulderItem, fernRowItems, impulseRingsItem, reedBedItems, riverLightAt, shadeAt, shimmerJit} from '../../../../src/painted/survival/river-r3';
import {TREX_POSES, TREX_STALK} from '../../../../src/painted/survival/beast-trex';
import {buildTRex} from '../../../../src/painted/survival/beast-trex';
import {vapourAge, vapourItem} from '../../../../src/painted/survival/trex-fx';
import {SNIFF_AT} from '../../../../src/painted/survival/beast-trex';
type R3 = {id: string; label: string; c: YCam; f: number; K?: {at: [number, number, number]; pose: string; facing: [number, number]; face: string; level?: number}; shade?: number; rex?: {at: [number, number]; heading: number; pose: object; haze?: number}; part?: number; rings?: [number, number, number][]; imps?: {f: number; amp: number}[]; vap?: number; ferns?: boolean};
const r3 = (o: R3) => {
  CARDS[o.id] = () => {
    const sh = o.shade ?? shadeAt(o.f), L = riverLightAt(sh);
    return <Painted band={false} paper="#cfdcc4" paint={(p) => {
      const rex = o.rex ? buildTRex(o.rex.pose as any) : null;
      const rexItems = rex ? beastSlabs(o.c, rex, {at: o.rex!.at, heading: o.rex!.heading, amb: L.amb, ambK: L.k, haze: o.rex!.haze ?? 0, hazeCol: '#dfe8d4', seed: 71000}, 4) : [];
      const vap = rex && o.vap !== undefined && o.vap >= 0 ? [vapourItem([o.rex!.at[0] + Math.cos(o.rex!.heading) * 5.1, 3.5, o.rex!.at[1] + Math.sin(o.rex!.heading) * 5.1], [Math.cos(o.rex!.heading), Math.sin(o.rex!.heading)], o.vap)] : [];
      paintRiver(p, o.c, {t: o.f / 30, light: L, jit: shimmerJit(o.f, o.imps ?? []), extra: [
        boulderItem(L), ...reedBedItems(L, {t: o.f / 30}), ...(o.ferns === false ? [] : fernRowItems(L, {t: o.f / 30, shake: o.part ? 0.8 : 0, part: o.part ?? 0})), ...rexItems, ...vap,
        ...(o.K ? [{at: o.K.at, draw: (q: Painter, cc: YCam) => { paintCast(q, cc, 'K', {at: o.K!.at, facing: o.K!.facing, pose: o.K!.pose, face: o.K!.face, t: 0.4, shadow: false} as any); }}, waterlineItem(o.K.at, o.K.level ?? 0, {L, t: 0.4})] : []),
        ...(o.rings ? [impulseRingsItem(o.rings, o.f, o.imps ?? [], L)] : []),
      ]});
    }}><div style={tag(30, 30)}>{o.label}</div></Painted>;
  };
};
const KA: [number, number, number] = [0.6, -0.1, -0.5];
const c16A = camOf(camMove([0, 0, -3], [-6, -12], [5.5, 5.0], 1.5, {f: 850, hy: 860, pitch: [4, 4]}), 0);
const c16B = camOf(camMove([0.62, 0, -0.95], [10, 10], 0.75, 0.42, {f: 1000, hy: 700, pitch: [-30, -30]}), 0);
const c16C = camOf(camMove([0.6, 0, -0.5], [14, 8], [1.5, 1.3], [1.15, 0.95], {f: 820, hy: 900, pitch: [3, 5], cx: -170}), 0.6);
const c16D = camOf(camMove([0.7, 0, -0.75], [18, 12], [1.25, 1.1], 0.55, {f: 900, hy: 900, pitch: [8, 8]}), 0.1);
r3({id: 'R3-16A-DAY', label: 'R3 16A start: B1, RD, FC, K knee-deep, day', c: c16A, f: 1350, K: {at: KA, pose: 'P07', facing: [0.3, 1], face: 'happy'}});
r3({id: 'R3-16A-SHADE', label: 'R3 16A end: shade light', c: c16A, f: 1390, K: {at: KA, pose: 'P07', facing: [0.3, 1], face: 'worried'}});
r3({id: 'R3-16B-RINGS', label: 'R3 16B: rings round shins, net rim, stones (thud 2, age 0.5)', c: c16B, f: 1390 + 18 + 6, imps: [{f: 1390 + 4, amp: 1}, {f: 1390 + 18, amp: 1.4}], rings: [[0.5, 0, -0.98], [0.78, 0, -0.98], [1.0, 0, -0.8], [0.35, 0, -1.2], [0.75, 0, -1.15]], ferns: false});
r3({id: 'R3-16B-REST', label: 'R3 16B: before the first thud (no rings)', c: c16B, f: 1390, ferns: false});
const XR = {at: [-1.5, -13] as [number, number], heading: 0.77};
r3({id: 'R3-16C-FERNS', label: 'R3 16C +4: fern row shakes, K crouch_hide back, T. rex hidden', c: c16C, f: 1416 + 8, part: 0.2, K: {at: KA, pose: 'P35', facing: [0, -1], face: 'scared', level: 0}, rex: {...XR, pose: TREX_POSES.sniff(0)}});
r3({id: 'R3-16C-PART', label: 'R3 16C +28: first sniff, ferns parted, vapour', c: c16C, f: 1416 + 28, part: 1, K: {at: KA, pose: 'P35', facing: [0, -1], face: 'scared'}, rex: {...XR, pose: TREX_POSES.sniff(SNIFF_AT[0])}, vap: vapourAge(SNIFF_AT[0], 48) + 0.3});
r3({id: 'R3-16C-SNIFF', label: 'R3 16C +40: second sniff, flared nostril', c: c16C, f: 1416 + 40, part: 1, K: {at: KA, pose: 'P35', facing: [0, -1], face: 'scared'}, rex: {...XR, pose: TREX_POSES.sniff(SNIFF_AT[1])}, vap: 0.3});
r3({id: 'R3-16D-TURN', label: 'R3 16D +14: head over the boulder turning upstream; K P35 front', c: c16D, f: 1464 + 14, part: 1, K: {at: [0.7, -0.1, -0.75], pose: 'P35', facing: [0, 1], face: 'scared'}, rex: {at: [-1.5, -13], heading: 1.0, pose: TREX_POSES.turn(0.6), haze: 0.2}});
r3({id: 'R3-16D-STALK', label: 'R3 16D +30: stalk walk off upstream', c: c16D, f: 1464 + 30, part: 0.6, K: {at: [0.7, -0.1, -0.75], pose: 'P35', facing: [0, 1], face: 'scared'}, rex: {at: [-3.0, -13.2], heading: Math.PI + 0.15, pose: TREX_POSES.stalk(0.3), haze: 0.2}});
r3({id: 'R3-HANDSUP', label: 'R3 P45 hands up at the waterline', c: c16C, f: 1500, K: {at: KA, pose: 'P45', facing: [0, 1], face: 'scared'}, shade: 1});
void B1; void TREX_STALK; void SNIFF_AT;

// ---- N16-03 R3 hen print, 16A flock at 0.9 m span, sniff/stalk strips are in the creature-kit sheet
import {henPrintItem, henPrintPx, henPrintScaleFor} from '../../../../src/painted/survival/hen-print';
import {flockItems} from '../../../../src/painted/survival/flock';
import {paintHenStep} from '../../../../src/painted/survival/hen';
const cHen = camOf(camMove([3.0, 0, -8.6], [0, 0], 0.9, 0.22, {f: 1000, hy: 780, pitch: [-8, -8]}), 0);
const printCard = (id: string, label: string, press: number) => {
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => paintVillage(p, cHen, {mode: 'morning', t: 0.3, extra: [
    henPrintItem([3.0, 0, -9.0], press, LIGHT.morning, {heading: 0.1, minPx: 90}),
  ]})}><div style={tag(30, 30)}>{label} print {Math.round(henPrintPx(cHen, [3.0, 0, -9.0], {heading: 0.1, scale: henPrintScaleFor(cHen, [3.0, 0, -9.0], 90, 0.1)}))} px</div></Painted>;
};
printCard('PRINT-0', 'N16-03 R3 before the foot lands (press 0)', 0);
printCard('PRINT-1', 'N16-03 R3 pressed in (press 1)', 1);
const flockCard = (id: string, u: number, f: number) => {
  CARDS[id] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => paintRiver(p, c16A, {t: f / 30, light: riverLightAt(shadeAt(1370)), extra: flockItems(u, f)})}><div style={tag(30, 30)}>10-bird flock 0.9 m span u={u}</div></Painted>;
};
flockCard('FLOCK-0', 0, 1368); flockCard('FLOCK-4', 0.4, 1374); flockCard('FLOCK-8', 0.8, 1380);

const cFl = {x: 2, y: 24, z: -9, yaw: 0, f: 1700, hy: 960, pitch: 0} as YCam;
CARDS['FLOCK-CU'] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => paintRiver(p, cFl, {t: 1, light: riverLightAt(1), extra: flockItems(0.45, 1377)})}><div style={tag(30, 30)}>flock 0.9 m span, close lens (f 2400, 14 m)</div></Painted>;

const cHi = camOf(camMove([3.0, 0, -8.6], [0, 0], 0.9, 0.5, {f: 1000, hy: 800, pitch: [-32, -32]}), 0);
CARDS['PRINT-HI'] = () => <Painted band={false} paper="#cfdcc4" paint={(p) => paintVillage(p, cHi, {mode: 'morning', t: 0.3, extra: [henPrintItem([3.0, 0, -8.5], 1, LIGHT.morning, {heading: 0.1, minPx: 90})]})}><div style={tag(30, 30)}>print, lens pitched -32 deg</div></Painted>;
