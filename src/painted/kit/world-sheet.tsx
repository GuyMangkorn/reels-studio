// KIT-WORLD check sheet (standalone entry, not a deliverable): a small world-metre room drawn with `world.ts`, three cast members
// placed with `figure-at.ts` and the camera driven by a `cam-moves.ts` move (a 30 deg arc with a push-in over 60 frames).
// Render: printf 'KIT-WORLD 0 out/kit-world/f00.png\nKIT-WORLD 59 out/kit-world/f59.png\n' | node scripts/stills.mjs src/painted/kit/world-sheet.tsx
import {createElement, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {camMove, camOf} from './cam-moves';
import {figureItem} from './figure-at';
import {makePainter} from './painter';
import {PEOPLE} from './people';
import {flatCircle, paintBox, paintSorted, qy, qz, sphereAt, wFill, wInk, wWash, type Item} from './world';
import {washAt, ell} from './draw';

const PAPER = '#efe8dc';
const FRAMES = 60;
const MOVE = camMove([[0, 0.9, 0], [0, 0.9, -0.3]], [-15, 15], [4.6, 3.6], 1.5, {f: 1000, hy: 760, ease: [0, 1]});

const Sheet = () => {
  const f = useCurrentFrame();
  const paint = useCallback(({brush}: PaintContext) => {
    const c = camOf(MOVE, f / (FRAMES - 1)), t = f / 30;
    const p = makePainter(brush, {t, frame: f, fade: PAPER});
    // Room: floor, back wall, a side wall, a rug.
    wWash(p, c, 100, '#c9a77c', 220, qy(0, -3, 3, -3, 3), 0.1, 0.4);
    wFill(p, c, 101, '#d9cdb7', qz(-3, -3, 3, 0, 2.8));
    wWash(p, c, 103, '#b3c4c9', 160, qz(-2.98, -1.2, 1.2, 1.0, 2.0), 0.1, 0.3);
    wInk(p, c, 104, qz(-2.97, -1.2, 1.2, 1.0, 2.0), {weight: 0.8});
    const rug = flatCircle(c, [0, 0.005, 0], 1.3, 28);
    if (rug.length >= 3) washAt(p, 105, '#c46b4f', 150, rug, 0.1, 0.4);
    const items: Item[] = [
      // Table (box) with a ball on it (sphereAt).
      {at: [-1.6, 0, -1.2], draw: (q, cc) => {
        paintBox(q, cc, 200, {x0: -2.2, x1: -1.0, y0: 0, y1: 0.75, z0: -1.6, z1: -0.8}, '#8a5a3b', {}, {ink: true, grain: 60});
        const s = sphereAt(cc, [-1.4, 0.87, -1.1], 0.12);
        if (s) washAt(q, 210, '#e0b33a', 255, ell(s.x, s.y, s.r, s.r, 18), 0.05, 0.2);
      }},
      // Four-view figures squared to the lens, and one with a fixed world facing (six views, follows the camera).
      figureItem(PEOPLE['woman-curly'], {at: [-0.5, 0, 0.2], view: 'front', pose: 'P01', face: 'happy', t}),
      figureItem(PEOPLE['man-parted'], {at: [0.7, 0, -0.4], facing: [-1, 0.2], pose: 'P01', t}),
      figureItem(PEOPLE['girl-school'], {at: [0.2, 0, 1.0], view: 'back', t}),
      {at: [1.8, 0, -1.6], draw: (q, cc) => paintBox(q, cc, 300, {x0: 1.4, x1: 2.4, y0: 0, y1: 1.6, z0: -2.0, z1: -1.4}, '#5d7a8c', {}, {ink: true})},
    ];
    paintSorted(p, c, items);
  }, [f]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Composition, {id: 'KIT-WORLD', component: Sheet, width: 1080, height: 1920, fps: 30, durationInFrames: FRAMES}));
