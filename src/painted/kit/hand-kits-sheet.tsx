// Hand kit reference sheets, one 1080x1920 still per action:
//   KIT-POV-HANDS {action}: the first-person shot of pov-hands.ts (the viewer's arms, props), full frame.
//   KIT-MID-HANDS {action}: a figure at 1.3 m, thigh-up, with five-finger hands (mid-hands.ts): front on top, back below.
// Every visible thumb tip carries an orange ring, and each hand's line (side, face seen, thumb's screen side) is measured by `handFacing`.
// Render: node scripts/painted-kit/hand-kits.mjs --kit=pov|mid --out=DIR [--only=a,b]; tile with scripts/qa-sheet.sh.
// Own entry (kept out of src/Root.tsx), like hand-gestures-sheet.tsx.
import {createElement, Fragment, type ComponentType} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {hardFill} from './draw';
import {handFacing} from './hand-gestures';
import {inkLine, macroSkeleton, type HandMacro} from './hands';
import {MID_ACTIONS, MID_ACTION_IDS, MID_VIEWS, midCell, midHands3D, paintMidCell, type MidActionId} from './mid-hands';
import {makePainter, type Painter, type Pt} from './painter';
import {POV_ACTIONS, POV_ACTION_IDS, POV_SHOULDER, POV_TONE, paintPovRoom, paintPovScene, povCam, povElbow, povReach, type PovActionId} from './pov-hands';
import {Hands3D, type Hand3DArm} from './hand3d';
import {svgPainter, SvgMarks} from './svg-painter';
import {camPoint, camUnit, type YCam} from './ycam';

const ring = (p: Painter, cam: YCam, h: HandMacro, id: number) => {
  const tip = macroSkeleton(h).fingers.thumb.joints[3], at = camPoint(cam, tip);
  if (!at) return;
  const r = Math.max(9, camUnit(cam, tip) * 0.016);
  inkLine(p, id, Array.from({length: 24}, (_, i): Pt => [at[0] + r * Math.cos((i / 24) * 6.283), at[1] + r * Math.sin((i / 24) * 6.283)]), 3.5, 0.1, true, '#ff6a1a');
};
const line = (cam: YCam, h: HandMacro) => { const f = handFacing(cam, h); return `${h.side === 1 ? 'RIGHT' : 'LEFT'} hand · sees ${f.shows} · thumb screen ${f.thumbOnScreen.toUpperCase()}`; };
const font = {fontFamily: 'Helvetica, Arial, sans-serif', color: '#2b2622'};

const PovStill = ({action, engine = 'three', look = 'classic'}: {action: PovActionId; engine?: 'painted' | 'svg' | 'three'; look?: 'classic' | 'pianist'}) => {
  const a = POV_ACTIONS[action], scene = a.build(), cam = povCam(scene), svg = engine !== 'painted', three = engine === 'three';
  // 'three': the room stays SVG behind; arms and every prop are 3D meshes (hand3d.tsx, hand-props3d.ts); the thumb rings go on top.
  const paint = (p: Painter) => {
    paintPovRoom(p, cam, scene);
    if (!three) paintPovScene(p, cam, scene, undefined, svg, look);
    if (!three) scene.hands.forEach((h, k) => ring(p, cam, h, 95000 + k * 2));
  };
  const rec = svg ? svgPainter() : null;
  if (rec) paint(rec.painter);
  const top = three ? svgPainter() : null;
  if (top) scene.hands.forEach((h, k) => ring(top.painter, cam, h, 95000 + k * 2));
  const arms: Hand3DArm[] = scene.hands.map((h) => ({hand: h, elbow: povElbow(h), shoulder: POV_SHOULDER[h.side === 1 ? 'right' : 'left'], sleeve: POV_TONE.sleeve}));
  return (
    <AbsoluteFill style={{background: '#e9dfcb', ...font}}>
      {rec ? <SvgMarks marks={rec.marks} /> : <BrushCanvas paint={({brush}) => paint(makePainter(brush, {t: 0, frame: 0}))} />}
      {three ? <Hands3D cam={cam} arms={arms} props={scene.props} /> : null}
      {top ? <SvgMarks marks={top.marks} /> : null}
      <div style={{position: 'absolute', left: 40, top: 30, width: 1000}}>
        <div style={{fontSize: 52, fontWeight: 700}}>POV · {action}{three ? ' · 3D' : svg ? ' · SVG' : ''}</div>
        <div style={{fontSize: 30, marginTop: 6}}>{a.verb} · {a.th}</div>
      </div>
      <div style={{position: 'absolute', left: 40, bottom: 30, width: 1000, fontSize: 26, lineHeight: 1.35, background: 'rgba(239,230,210,.85)', padding: '8px 12px'}}>
        {scene.hands.map((h) => <div key={h.base}>{line(cam, h)} · reach {povReach(h).toFixed(2)} m</div>)}
        {scene.props.length ? <div>props: {scene.props.map((q) => q.id).join(', ')}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const MidStill = ({action, engine = 'three', debug = false}: {action: MidActionId; engine?: 'painted' | 'three'; debug?: boolean}) => {
  const a = MID_ACTIONS[action], cells = MID_VIEWS.map((v, k) => midCell(action, v, k)), three = engine === 'three';
  // 'three' (user, 18 Nov 2026): the figures are painted without hands; each cell lays its 3D hands and props over them, clipped to the cell.
  const rings = svgPainter();
  cells.forEach((c, k) => c.hands.forEach((h, j) => ring(rings.painter, c.cam, h, 95000 + k * 8 + j * 2)));
  return (
    <AbsoluteFill style={{background: '#e9dfcb', ...font}}>
      <BrushCanvas paint={({brush}) => {
        const p = makePainter(brush, {t: 0, frame: 0});
        // Each cell covers the cell above's legs before it paints (the figure below the waist runs on down the page).
        cells.forEach((c, k) => { if (k) hardFill(p, 2 + k, '#e9dfcb', [[0, c.box[1]], [1080, c.box[1]], [1080, 1920], [0, 1920]]); paintMidCell(p, c, {hands: !three}); hardFill(p, 6 + k, '#e9dfcb', [[0, c.box[1] + c.box[3]], [1080, c.box[1] + c.box[3]], [1080, c.box[1] + c.box[3] + 50], [0, c.box[1] + c.box[3] + 50]]); });
      }} />
      {three ? cells.map((c) => (
        <div key={c.view} style={{position: 'absolute', left: 0, top: c.box[1], width: 1080, height: c.box[3], overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: -c.box[1], width: 1080, height: 1920}}>{(() => { const m = midHands3D(c); return <><Hands3D cam={c.cam} {...m.behind} debugOccluders={debug} /><Hands3D cam={c.cam} {...m.front} /></>; })()}</div>
        </div>
      )) : null}
      <SvgMarks marks={rings.marks} />
      <div style={{position: 'absolute', left: 40, top: 24, width: 1000}}>
        <div style={{fontSize: 48, fontWeight: 700}}>CLOSE 1.3 m · {action}{three ? ' · 3D' : ''}</div>
        <div style={{fontSize: 28, marginTop: 4}}>{a.verb} · {a.th}</div>
      </div>
      {cells.map((c) => (
        <div key={c.view} style={{position: 'absolute', left: 12, top: c.box[1] + c.box[3] + 2, width: 1056, height: 46, fontSize: 18, lineHeight: 1.25, display: 'flex', gap: 18}}>
          <b style={{width: 64}}>{c.view.toUpperCase()}</b>
          {c.hands.map((h) => <div key={h.base}>{line(c.cam, h)}</div>)}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const comp = (id: string, component: ComponentType<never>, defaultProps: Record<string, unknown>) =>
  createElement(Composition as unknown as ComponentType<Record<string, unknown>>, {id, component, defaultProps, width: 1080, height: 1920, fps: 30, durationInFrames: 1});
registerRoot(() => createElement(Fragment, null,
  comp('KIT-POV-HANDS', PovStill as ComponentType<never>, {action: POV_ACTION_IDS[0]}),
  comp('KIT-MID-HANDS', MidStill as ComponentType<never>, {action: MID_ACTION_IDS[0]}),
));
