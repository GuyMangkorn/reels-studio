// Standalone entry for the EDU-EP16-SHORT plate QA stills (Boss W5.2). Kept out of src/Root.tsx and the episode registry. One composition per shot,
// `EDU16-<shot id>`, as long as the shot plus 14 f of dissolve tail; the frame is the shot-local L. Input props: `guides` (default true: the dashed
// caption band 1176-1344), `tag` (default true: burned-in preview label, shot ID, deliverable, TH time, f/L), `label` (default true: "ภาพจำลอง" on
// the frames the sheet's label rule puts it, as the timeline cue will), `measure` (default false: the woman as a flat #ff00ff silhouette for the lead
// bbox). Clean frames for caption-zone: --props='{"guides":false,"tag":false}'.
//   printf 'EDU16-S01-B01-SH01 0 out/edu16/w52/g1/SH01_L0.png\n' | node scripts/stills.mjs src/painted/edu16/build-index.tsx
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, getInputProps, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {edu16Shots} from '../shots/edu16';
import {labelOn, lenOf, SHOT_RANGES, shortId, startOf, type ShotId} from './clock';
import {Lbl} from './look';
import {MEASURE_MODE} from './scenes-roof';

const Plate = ({id}: {id: ShotId}) => {
  const L = useCurrentFrame(), G = startOf(id) + L, shot = edu16Shots.find((s) => s.serves[0] === id)!, tl = L / 30;
  const props = getInputProps() as {guides?: boolean; tag?: boolean; label?: boolean; measure?: boolean};
  MEASURE_MODE.on = props.measure === true; // lead measure: the woman paints as a flat #ff00ff silhouette (scripts: magenta bbox)
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps: 30, width: 1080, height: 1920}), [shot, tl]);
  const Overlay = shot.Overlay, s = G / 30;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={1080} height={1920} camera={shot.camera(tl)} opacity={1} />}
      {props.label !== false && labelOn(G) && <Lbl />}
      {props.guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
      {props.tag !== false && <div style={{position: 'absolute', left: 24, top: 1850, font: '600 30px sans-serif', color: '#fff', textShadow: '0 0 4px #000'}}>{`${shortId(id)} · EDU-EP16-SHORT · TH ${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')} · F${G} f+${L}${L >= lenOf(id) ? ' (dissolve tail)' : ''}`}</div>}
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Fragment, null, ...SHOT_RANGES.map(([id, , ]) =>
  createElement(Composition, {key: id, id: `EDU16-${id}`, component: () => createElement(Plate, {id}), width: 1080, height: 1920, fps: 30, durationInFrames: lenOf(id) + 14}))));
