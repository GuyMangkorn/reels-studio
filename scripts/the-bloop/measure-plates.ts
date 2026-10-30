// Computed plate numbers for BLOOP-EP01-SHORT (Boss, DEP01 pass 2 under BLOOP-BRIEF-R3 FR01-FR11 and BLOOP-SHEETS-R4):
// hydrophone heights, ring timing and spacing, creature and ice anchors, map spacing and window edges, all from the same
// functions the plates draw with. Prints one JSON object.
// Usage: node --import tsx scripts/the-bloop/measure-plates.ts > out/qa/the-bloop/measure-plates.json
// Pixel measurements (mask coverage, PSNR) come from scripts/the-bloop/frame-metrics.py on rendered frames.
import {toScreen, type Camera} from '../../src/painted/camera';
import {envAt} from '../../src/painted/bloop/envelope';
import {crRealAnchors, crRealPlace, dreamPoint} from '../../src/painted/bloop/creatures';
import {DOTS, FPS, HYD, hydParts, mapXY, WF0} from '../../src/painted/bloop/geometry';
import {DREAM_AT_SH06_END, DREAM_PLACE, ICE_SH11, sh01Rings, sh03Rings, sh05Scale, sh09Camera, sh13Camera, SH13_LIP_FRAME, CLIP_IN_SH03} from '../../src/painted/shots/bloop';
import {paintedShots} from '../../src/painted/registry';

const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
const hydBodyTall = (s: number) => round(2 * hydParts(HYD.cx, HYD.cy).h * s);
const median = (xs: number[]) => {
  const v = [...xs].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
const gaps = (radii: number[]) => {
  const r = [...radii].sort((a, b) => b - a);
  return r.slice(1).map((v, i) => round(r[i] - v));
};
const dotPairs = DOTS.flatMap((a, i) => DOTS.slice(i + 1).map((b) => round(Math.hypot(a[0] - b[0], a[1] - b[1]))));
const screenOf = (cam: Camera, p: [number, number]) => toScreen(cam, p).map((v) => round(v));

// ---- SH13 at L249 (static camera, mouth on RISE_TO): the four eyes against R4 (screen, +/-20 px)
const sh13Eyes = (() => {
  // BLOOP-SHEETS-R5: the four eyes at the P4 end (mouth world (560, 610), k 1.0 = CP3 scale 0.86)
  const a = crRealAnchors(crRealPlace(560, 610, 0.86));
  const cam = sh13Camera(0);
  const r4 = [[764, 253], [660, 107], [77, 253], [137, 115]];
  const near = [a.eyeNear[0], a.eyeNear[1], a.eyeFar[0], a.eyeFar[1]].map((p) => screenOf(cam, p));
  const rings = a.eyeRings.map((e) => {
    const [cx, cy] = screenOf(cam, e.c);
    return {cx, cy, rx: round(e.rx), ry: round(e.ry), top: round(cy - e.ry), bottom: round(cy + e.ry), inFrame: cy - e.ry >= 80 && cx - e.rx >= 0 && cx + e.rx <= 1080, slot1Overlap: cx + e.rx >= 120 && cx - e.rx <= 330 && cy + e.ry >= 300 && cy - e.ry <= 350};
  });
  return {
    eyesScreen: near,
    r4Anchors: r4,
    deltaPx: near.map((p, i) => round(Math.hypot(p[0] - r4[i][0], p[1] - r4[i][1]))),
    rings,
    irisRings: a.irisRings.map((e) => ({cx: round(toScreen(cam, e.c)[0]), cy: round(toScreen(cam, e.c)[1]), rx: round(e.rx), ry: round(e.ry), top: round(toScreen(cam, e.c)[1] - e.ry)})),
    lipFrameShotLocal: SH13_LIP_FRAME,
    mouthScreen: screenOf(cam, a.mouth),
    headWidthWorld: round(a.head[2] - a.head[0]),
    headTopScreen: round(toScreen(cam, [a.head[0], a.head[1]])[1]),
  };
})();

// ---- SH06 head-left (R4): drift 0 anchors, L63 with drift and the MK-O6 camera
const sh06 = (() => {
  const cam = paintedShots['bloop-sh06'].camera(63 / FPS);
  const drift0 = DREAM_PLACE();
  const drift63 = DREAM_PLACE(93.6 - 40);
  const box = (p: {s: number; tx: number; ty: number}) => [dreamPoint(p, [-40, 250]), dreamPoint(p, [640, 860])];
  const [tl0, br0] = box(drift0);
  const [tl63, br63] = box(drift63);
  return {
    camera: cam,
    eyeDrift0World: dreamPoint(drift0, [160, 470]).map((v) => round(v)),
    secondEyeDrift0World: dreamPoint(drift0, [250, 380]).map((v) => round(v)),
    jawTipDrift0World: dreamPoint(drift0, [21, 609]).map((v) => round(v)),
    headBoxDrift0World: [tl0, br0].flat().map((v) => round(v)),
    headTallWorld: round(br0[1] - tl0[1]),
    eyeL63Screen: screenOf(cam, dreamPoint(drift63, [160, 470])),
    headBoxL63Screen: [screenOf(cam, tl63), screenOf(cam, br63)],
    headTallL63Screen: round(toScreen(cam, br63)[1] - toScreen(cam, tl63)[1]),
  };
})();

// ---- SH07 ghost (R4): head box screen y at L0 and L75 (camera dy -60)
const sh07 = (() => {
  const box = (p: {s: number; tx: number; ty: number}) => [dreamPoint(p, [-40, 250]), dreamPoint(p, [640, 860])];
  const cam0 = paintedShots['bloop-sh07'].camera(0);
  const cam75 = paintedShots['bloop-sh07'].camera(75 / FPS);
  const [a, b] = box(DREAM_AT_SH06_END);
  return {
    headYAtL0: [round(toScreen(cam0, a)[1]), round(toScreen(cam0, b)[1])],
    headYAtL75: [round(toScreen(cam75, a)[1]), round(toScreen(cam75, b)[1])],
    headXAtL75: [round(toScreen(cam75, a)[0]), round(toScreen(cam75, b)[0])],
  };
})();

// ---- SH11 creature and ice (R4): ice keel box covers the creature's head box
const sh11 = (() => {
  const head = [355, 335, 895, 815];
  const keelBox = [360, 335, 1040, 790];
  const ix = Math.max(0, Math.min(head[2], keelBox[2]) - Math.max(head[0], keelBox[0]));
  const iy = Math.max(0, Math.min(head[3], keelBox[3]) - Math.max(head[1], keelBox[1]));
  const keel = ICE_SH11;
  const xs = keel.map((p) => p[0]), ys = keel.map((p) => p[1]);
  return {
    creatureHeadBox: head,
    iceKeelBox: keelBox,
    coverageOfHeadBoxPct: round((100 * ix * iy) / ((head[2] - head[0]) * (head[3] - head[1]))),
    keelPointBBox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map((v) => round(v)),
    keelAspect: round((Math.max(...xs) - Math.min(...xs)) / (Math.max(...ys) - Math.min(...ys)), 2),
    creaturePlaceL0: DREAM_PLACE(386.6, 0.79, 137.5),
  };
})();

// ---- SH13 jaw and far ice keys
const sh13Keys = {
  jawOpenNote: 'jawOpen 0.25 at L225-L237; 0.25 -> 1 ease-out L237-L249; then 1 (see shots/bloop.tsx jawOpenAt)',
  farIceAlphaAt: [0, 162, 186, 211, 218, 224, 225].map((f) => {
    const a = (1 - 0.7 * Math.min(1, Math.max(0, (f - 162) / 49))) * (1 - Math.min(1, Math.max(0, (f - 211) / 14)));
    return [f, round(a, 3)];
  }),
  rushCamera: [249, 270, 291].map((f) => {
    const c = sh13Camera(f / FPS);
    return {L: f, s: round(c.s, 3), dy: round(c.dy, 1)};
  }),
};

const out = {
  sh01: {
    bodyTallStart: hydBodyTall(1), bodyTallEnd: hydBodyTall(1.06),
    ringsAtG93: sh01Rings(93).map((r) => round(r.r)), ringsAtG97: sh01Rings(97).length, ringsAtG101: sh01Rings(101).length,
    ringsAtG110: sh01Rings(110).map((r) => r.arrive), ringArrivals: sh01Rings(120).map((r) => r.arrive),
    envAt93to101: [93, 97, 101].map((c) => round(envAt(c), 3)),
  },
  sh03: (() => {
    const g410 = sh03Rings(38).filter((r) => r.key.startsWith('w')).map((r) => r.r);
    const clipG440 = sh03Rings(68).filter((r) => r.key.startsWith('c')).map((r) => r.r);
    const wideGap = round(gaps(g410)[0] ?? 0);
    const medianClipGap = round(median(gaps(clipG440)));
    return {
      clipInSec: CLIP_IN_SH03 / FPS,
      wideRadiiG410: g410.map((r) => round(r)), wideGapG410: wideGap,
      clipRadiiG440: clipG440.map((r) => round(r)), clipGapsG440: gaps(clipG440), medianClipGapG440: medianClipGap,
      ratioWideOverMedianClip: round(wideGap / medianClipGap, 2),
      bodyTallStart: hydBodyTall(1.5), bodyTallEnd: hydBodyTall(1.56),
    };
  })(),
  map: {dotPairsMax: Math.max(...dotPairs), dotD1D6: round(Math.hypot(DOTS[5][0] - DOTS[0][0], DOTS[5][1] - DOTS[0][1])), equatorY: round(mapXY(0, 0)[1]), wf0: WF0},
  sh09: {
    tipScreenAt: [0, 38, 62].map((f) => toScreen(sh09Camera(f / FPS), mapXY(303, -63)).map((v) => round(v))),
    windowBottomLatAt: [0, 38].map((f) => round(36 - ((840 - sh09Camera(f / FPS).dy) - 300) / 9.4, 1)),
  },
  sh05Scale: [0, 46, 68, 90, 92, 165].map((f) => round(sh05Scale(f), 4)),
  sh06,
  sh07,
  sh11,
  sh13: {eyes: sh13Eyes, keys: sh13Keys},
};
console.log(JSON.stringify(out, null, 1));
