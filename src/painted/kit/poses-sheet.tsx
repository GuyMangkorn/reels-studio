// Pose library sheets: every pose of `poses.ts` (P01-P45) on one adult and one child, front and profile, labelled with its ID.
// Own entry (kept out of src/Root.tsx), like people-sheet.tsx:
//   node scripts/painted-kit/poses.mjs --out=out/kit-poses [--only=KIT-POSES,KIT-POSES-A]
//   KIT-POSES (all 45 poses, one sheet), KIT-POSES-A (P01-P15), KIT-POSES-B (P16-P30), KIT-POSES-C (P31-P45): the A-C pages are the same
//   cells at twice the size, for judging arms and bodies.
// Each cell: adult front, adult right profile, child front, child left profile (the left view proves the mirror). A view the pose
// lacks shows "no front" / "no profile". Poses with a chair draw `drawChair`; P43 draws its wall.
import {createElement, Fragment, type ComponentType, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from './cast';
import {rectPts, solid, inkLine} from './draw';
import {EXPRESSIONS} from './expressions';
import {blinking, type FaceState} from './head';
import {makePainter, type Painter, type Pt} from './painter';
import {PEOPLE} from './people';
import {ALL_POSE_IDS, POSE_INFO, hasView, poseFor, type AnyPoseId, type View} from './poses';
import {drawChair} from './props';

const h = createElement;
const ADULT = PEOPLE['man-parted'], CHILD = PEOPLE['boy-school'];
const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed)) ?? 0.4;

const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};
const Text = ({x, y, w, size, weight = 400, color, align = 'left', children}: {x: number; y: number; w: number; size: number; weight?: number; color?: string; align?: 'left' | 'center'; children: string}) => (
  <div style={{...label, left: x, top: y, width: w, fontSize: size, fontWeight: weight, lineHeight: 1.2, color: color ?? '#2b211c', textAlign: align}}>{children}</div>
);

type Layout = {ids: readonly AnyPoseId[]; cols: number; unit: number; title: string; desc: boolean};
const FIG_W = 1.1; // figure slot width in metres of the sheet's unit
const layoutOf = (l: Layout) => {
  const slot = FIG_W * l.unit, cellW = slot * 4 + 20, rowH = 1.95 * l.unit + (l.desc ? 120 : 80);
  const rows = Math.ceil(l.ids.length / l.cols);
  return {slot, cellW, rowH, W: cellW * l.cols, H: 90 + rowH * rows + 20, rows};
};

const cellOf = (l: Layout, i: number) => {
  const {cellW, rowH} = layoutOf(l);
  return {x: (i % l.cols) * cellW, y: 90 + Math.floor(i / l.cols) * rowH};
};
const FIGS: {def: CastDef; view: View; slot: number; who: string}[] = [
  {def: ADULT, view: 'front', slot: 0, who: 'adult front'}, {def: ADULT, view: 'right', slot: 1, who: 'adult right'},
  {def: CHILD, view: 'front', slot: 2, who: 'child front'}, {def: CHILD, view: 'left', slot: 3, who: 'child left'},
];

const paintSheet = (l: Layout) => ({brush}: {brush: Parameters<typeof makePainter>[0]}) => {
  const p: Painter = makePainter(brush, {t: 0, frame: 0});
  const {slot, cellW} = layoutOf(l);
  l.ids.forEach((id, i) => {
    const {x, y} = cellOf(l, i), info = POSE_INFO[id];
    const ground = y + 40 + 1.95 * l.unit;
    inkLine(p, 9000 + i, [[x + 8, ground + 8], [x + cellW - 12, ground + 8]], {closed: false, weight: 0.6, curve: 0, color: '#b9ad9d', still: true});
    FIGS.forEach(({def, view, slot: s}, f) => {
      if (!hasView(id, view)) return;
      let g: Pt = [x + slot * (s + 0.5) + 10, ground];
      const seed = def.seed + i * 7 + f;
      const face: FaceState = EXPRESSIONS[info.face];
      let pose: FigPose = {face, ...poseFor(id, def, g, l.unit, view)};
      if (pose.lie) {
        // A lying figure is as long as it is tall: centre it on its pair of slots (the feet are the ground point; the head points the way `lie` says).
        g = [x + slot * (s < 2 ? 1 : 3) + 10 + Math.sign(pose.lie) * 0.42 * def.height * l.unit, ground];
        pose = {face, ...poseFor(id, def, g, l.unit, view)};
      }
      if (info.prop === 'chair') drawChair(p, 7000 + i * 4 + f, g, l.unit, def, view);
      drawFigure(p, def, g, l.unit, pose, openT(seed), seed);
      if (info.occluder) {
        // Wall: covers everything left of the edge, in the paper tone with a darker face (the scene paints its own wall).
        const ex = g[0] + info.occluder.edgeU * l.unit * (def === CHILD ? 0.8 : 1);
        const pts = rectPts(ex - 0.5 * l.unit, ground - 2.0 * l.unit, ex, ground + 6);
        solid(p, 8000 + i * 4 + f, '#8c8372', pts, 6, 0.04, 0.1);
        inkLine(p, 8100 + i * 4 + f, [[ex, ground - 2.0 * l.unit], [ex, ground + 6]], {closed: false, weight: 1.2, curve: 0});
      }
    });
  });
};

const Sheet = ({layout}: {layout: Layout}) => {
  const {slot, cellW} = layoutOf(layout);
  const fs = Math.max(14, Math.round(layout.unit * 0.1));
  return (
    <AbsoluteFill>
      <BrushCanvas paint={({brush}) => paintSheet(layout)({brush})} />
      <Text x={20} y={14} w={2400} size={34} weight={700}>{layout.title}</Text>
      <Text x={20} y={56} w={2800} size={17} color="#4a3f38">{`adult man-parted + child boy-school; per cell: adult front, adult right, child front, child left. src/painted/kit/poses.ts: poseFor(id, def, g, unit, view); IDs P01-P30 sheet, P31+ new.`}</Text>
      {layout.ids.map((id, i) => {
        const {x, y} = cellOf(layout, i), info = POSE_INFO[id];
        const ground = y + 40 + 1.95 * layout.unit;
        return (
          <Fragment key={id}>
            <Text x={x + 10} y={y + 4} w={cellW - 20} size={Math.max(20, fs * 1.5)} weight={700}>{`${id} ${info.name}${info.missing ? ` (${info.missing} missing)` : ''}`}</Text>
            {layout.desc && <Text x={x + 10} y={ground + 16} w={cellW - 20} size={Math.max(13, fs)} color="#4a3f38">{info.description}</Text>}
            {FIGS.map(({view, slot: s, who}) => !hasView(id, view) && <Text key={who} x={x + slot * s + 10} y={ground - 1.0 * layout.unit} w={slot} size={fs} color="#9a8f84" align="center">{view === 'front' ? 'no front' : 'no profile'}</Text>)}
          </Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const A = ALL_POSE_IDS.slice(0, 15), B = ALL_POSE_IDS.slice(15, 30), C = ALL_POSE_IDS.slice(30);
const LAYOUTS: Record<string, Layout> = {
  'KIT-POSES': {ids: ALL_POSE_IDS, cols: 5, unit: 150, title: `KIT-POSES: all ${ALL_POSE_IDS.length} poses`, desc: false},
  'KIT-POSES-A': {ids: A, cols: 3, unit: 250, title: 'KIT-POSES-A: P01-P15', desc: true},
  'KIT-POSES-B': {ids: B, cols: 3, unit: 250, title: 'KIT-POSES-B: P16-P30', desc: true},
  'KIT-POSES-C': {ids: C, cols: 3, unit: 250, title: `KIT-POSES-C: ${C[0]}-${C[C.length - 1]} (new body poses)`, desc: true},
};

// KIT-POSES-CLOSE: the chosen poses at a larger scale, for before/after checks of one pose (`--close=P13,P14 [--unit=500] [--cols=1]` in poses.mjs).
type CloseProps = {ids: string[]; unit: number; cols: number};
const closeLayout = ({ids, unit, cols}: CloseProps): Layout => {
  const known = ids.filter((id): id is AnyPoseId => (ALL_POSE_IDS as readonly string[]).includes(id));
  return {ids: known, cols: Math.max(1, Math.min(cols, known.length)), unit, title: `KIT-POSES-CLOSE: ${known.join(' ')}`, desc: false};
};
const closeDefaults: CloseProps = {ids: ['P01'], unit: 500, cols: 1};

registerRoot(() => h(Fragment, null, ...Object.entries(LAYOUTS).map(([id, layout]) => {
  const {W, H} = layoutOf(layout);
  return h(Composition, {key: id, id, component: () => <Sheet layout={layout} />, width: Math.round(W), height: Math.round(H), fps: 30, durationInFrames: 30});
}), h(Composition as unknown as ComponentType<Record<string, unknown>>, {
  key: 'KIT-POSES-CLOSE', id: 'KIT-POSES-CLOSE', component: (props: Record<string, unknown>) => <Sheet layout={closeLayout(props as CloseProps)} />, defaultProps: {...closeDefaults},
  width: 1000, height: 1000, fps: 30, durationInFrames: 30,
  calculateMetadata: ({props}: {props: Record<string, unknown>}) => {
    const {W, H} = layoutOf(closeLayout(props as CloseProps));
    return {width: Math.round(W), height: Math.round(H)};
  },
})));
