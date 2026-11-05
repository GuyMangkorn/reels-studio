// Six-view model sheet (Boss, 4 Nov 2026; r5 after the user dropped the back three-quarter views): one person in front, front-right,
// right (top row) and back, left, front-left (bottom row), standing P01, neutral (`kit/views.ts` VIEW_NAMES). Not a deliverable.
// `printf 'VIEWSHEET-YOU 0 out/viewsheet/you.png\n' | node scripts/stills.mjs src/painted/spike/parallax-index.ts`
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from '../kit/cast';
import {EXPRESSIONS} from '../kit/expressions';
import {makePainter} from '../kit/painter';
import {PEOPLE, PERSON_IDS} from '../kit/people';
import {poseArms} from '../kit/poses';
import {dress} from '../kit/wardrobe';
import {VIEW_NAMES, viewFields, type ViewName} from '../kit/views';
import {YOU2} from '../everyone-gone/ep02/places';

const PAPER = '#e9e6e0';
const ROWS = 2;
export const MAN_POLICE: CastDef = dress(PEOPLE['man-parted'], 'police');

/** One standing figure in the given view. Back views take the pose library's front arms, which the back figure mirrors. */
export const standing = (def: CastDef, name: ViewName, g: [number, number], unit: number, deg = 45): FigPose => {
  const vf = viewFields(name, deg);
  const armView = vf.view === 'left' || vf.view === 'right' ? vf.view : 'front';
  return {...vf, face: EXPRESSIONS.neutral, ...poseArms('P01', def, g, unit, armView), ...(armView === 'front' ? {} : {farArmUnder: true})} as FigPose;
};

/** The six views, or (`cells`) any list of view + angle cells in two rows (three per row up to six cells, else four). `hoodUp` raises the hood of every cell. */
type Cell = {name: ViewName; deg: number};
const SIX: Cell[] = VIEW_NAMES.map((name) => ({name, deg: 45}));
const ViewSheet = ({def, label, cells = SIX, hoodUp = false}: {def: CastDef; label: string; cells?: Cell[]; hoodUp?: boolean}) => {
  const paint = ({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame: 0, fade: PAPER});
    const unit = 440, rowH = 1920 / ROWS, cols = cells.length <= 6 ? 3 : 4, cellW = 1080 / cols;
    cells.forEach(({name, deg}, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const g: [number, number] = [cellW * (col + 0.5), rowH * row + rowH - 110];
      drawFigure(p, def, g, unit, {...standing(def, name, g, unit, deg), hoodUp}, 0, def.seed + i * 7);
      void label;
    });
  };
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
    </AbsoluteFill>
  );
};
export const ViewSheetYou = () => <ViewSheet def={YOU2} label="YOU2" />;
export const ViewSheetMan = () => <ViewSheet def={MAN_POLICE} label="man-parted + police" />;
export const ViewSheetYouHood = () => <ViewSheet def={YOU2} label="YOU2 hood up" hoodUp />;
export const ViewSheetLong = () => <ViewSheet def={PEOPLE['woman-long']} label="woman-long" />;
export const ViewSheetPony = () => <ViewSheet def={PEOPLE['woman-ponytail']} label="woman-ponytail" />;
/** One body at the whole range: front-left at 15, 30, 45, 60 degrees (top) and front-right at 15, 30, 45, 60 (bottom). */
const RANGE: Cell[] = [15, 30, 45, 60].map((deg) => ({name: 'front-left' as ViewName, deg})).concat([15, 30, 45, 60].map((deg) => ({name: 'front-right' as ViewName, deg})));
export const ViewSheetRange = () => <ViewSheet def={MAN_POLICE} label="range" cells={RANGE} />;
export const ViewSheetRangeYou = () => <ViewSheet def={YOU2} label="range" cells={RANGE} />;

/**
 * Hair-style lineup (pass 4, 4 Nov 2026): every PEOPLE cut plus YOU2 hood up and man-parted + police, eight per sheet, in one view and
 * angle, head tops on one line (row top + 60 px) so the heads crop as one band. `LINEUP-<view>-<deg>-<A|B>` in parallax-index.ts.
 */
type LineupEntry = {def: CastDef; hoodUp?: boolean};
const LINEUP: LineupEntry[] = [...PERSON_IDS.map((id) => ({def: PEOPLE[id]})), {def: YOU2, hoodUp: true}, {def: MAN_POLICE}];
export const LineupSheet = ({half, name, deg}: {half: 0 | 1; name: ViewName; deg: number}) => {
  const paint = ({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame: 0, fade: PAPER});
    const unit = 440, rowH = 1920 / ROWS, cols = 4, cellW = 1080 / cols;
    LINEUP.slice(half * 8, half * 8 + 8).forEach(({def, hoodUp}, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const g: [number, number] = [cellW * (col + 0.5), rowH * row + 60 + def.height * unit];
      drawFigure(p, def, g, unit, {...standing(def, name, g, unit, deg), hoodUp}, 0, def.seed + i * 7);
    });
  };
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
    </AbsoluteFill>
  );
};
/** Every lineup sheet as a prop-less component: the two front three-quarter views x 30/45/60 degrees x A/B (no back diagonals since r5). */
export const LINEUP_SHEETS = (['front-right', 'front-left'] as const).flatMap((name) => [30, 45, 60].flatMap((deg) => ([0, 1] as const).map((half) => ({
  id: `LINEUP-${name.toUpperCase()}-${deg}-${half ? 'B' : 'A'}`,
  component: () => <LineupSheet half={half} name={name} deg={deg} />,
}))));
