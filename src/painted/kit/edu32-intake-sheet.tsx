import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {ANIMALS} from './animals-catalog';
import {drawAnimal} from './animals';
import {hardFill, inkLine} from './draw';
import {paintEarMic} from './ear-mic';
import {catLoafGetUp, pictureGaitClock} from './motions-edu32';
import {paperCard} from './paper-card';
import {makePainter} from './painter';
import type {V3} from './space';
import {paintSparrow} from './sparrow';
import {camPoint, camUnit, type YCam} from './ycam';

const def = ANIMALS['cat-gray-tabby-longhair'];
const camera: YCam = {x: 0, y: 0.5, z: 1.5, yaw: 0, pitch: -0.16, f: 980, hy: 190};
const foot: V3 = [-0.39, 0, 0];
const light: V3 = [-0.8, 0.8, 0.8];
const perch: V3 = [0, 0, 0];
const birdCamera: YCam = {...camera, cx: 335, hy: 335, f: 1600, y: 0.25};
const W = 1080, H = 950;
const labels = [
  ['Paper card with separate whiskers', 280, 425], ['Ear-mic capsule', 625, 425],
  ['Sparrow', 875, 425], ['Loaf → rise → stand', 320, 790], ['Profile walk', 865, 790],
] as const;

const Sheet = () => (
  <AbsoluteFill style={{backgroundColor: '#dfceb1'}}>
    <BrushCanvas paint={({brush, frame, t}) => {
      const p = makePainter(brush, {t, frame});
      const g = camPoint(camera, foot);
      if (!g) return;

      const anchors: Parameters<typeof drawAnimal>[7] = {};
      hardFill(p, 32000, '#84624c', [[65, 97], [565, 97], [565, 408], [65, 408]]);
      paperCard(p, camera, {foot, light, seed: 32001}, (q) =>
        drawAnimal(q, def.seed, def, g, camUnit(camera, foot), {view: 'front', state: 'sit', catLook: -0.65, whiskerOut: true}, t, anchors),
      );
      for (const stroke of anchors.whiskers ?? []) {
        inkLine(p, stroke.seed, stroke.pts, {color: stroke.color, weight: stroke.weight, curve: stroke.curve, closed: false, still: true});
      }

      paintEarMic(p, 32020, [597, 237], [645, 285], 23);
      const birdFoot = camPoint(birdCamera, perch);
      if (birdFoot) {
        const [x, y] = birdFoot;
        hardFill(p, 32029, '#84624c', [[x - 69, y], [x + 84, y], [x + 82, y + 11], [x - 68, y + 14]]);
        paintSparrow(p, birdCamera, perch, 32030, 1);
      }
      hardFill(p, 32060, '#84624c', [[65, 733], [1015, 733], [1015, 738], [65, 738]]);
      [0, 0.5, 1].forEach((progress, i) => drawAnimal(p, def.seed, def, [185 + i * 155, 733], 410, catLoafGetUp(progress), t));
      const walk = pictureGaitClock(def, (f) => [f * 0.02, 0, 0], () => camera, 0, 10);
      drawAnimal(p, def.seed, def, [865, 733], 410, {view: 'right', state: 'stand', walk}, t);
    }} />
    {labels.map(([name, left, top]) => (
      <div key={name} style={{position: 'absolute', left, top, transform: 'translateX(-50%)', font: '22px sans-serif', color: '#2b211c'}}>{name}</div>
    ))}
  </AbsoluteFill>
);

registerRoot(() => <Composition id="KIT-EDU32-INTAKE" component={Sheet} width={W} height={H} fps={30} durationInFrames={1} />);
