import {ANIMALS, drawAnimal} from '../kit/animals';
import {ANIMAL_MOTION_INFO, ANIMAL_REEL, animalMotion, animalMotionDuration, ANIMAL_REEL_UNIT, animalReelShotId, type AnimalReelEntry} from '../kit/animal-motions';
import {rectPts, washAt} from '../kit/draw';
import type {Painter} from '../kit/painter';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-ANIMAL-MOTIONS plates: one per animal motion preset (`kit/animal-motions.ts`), a labelled proof on a dog and a cat. Scene
// lengths and cast: ANIMAL_REEL in the same module. Video: src/videos/kit-animal-motions/index.ts.

const paintReel = (e: AnimalReelEntry) => (p: Painter, {tl}: ShotContext) => {
  washAt(p, 1, '#d8cbb0', 200, rectPts(-200, -200, 1280, 1180 - 6), 0.3, 0.4);
  washAt(p, 2, '#b3a384', 215, rectPts(-200, 1180 - 6, 1280, 2200), 0.3, 0.4);
  e.cast.forEach((c, i) => {
    const def = ANIMALS[c.animal], m = animalMotion(e.motion, tl, {animal: c.animal, view: c.view});
    drawAnimal(p, def.seed * 10 + i, def, [c.x + m.offset[0] * ANIMAL_REEL_UNIT, c.ground - m.offset[1] * ANIMAL_REEL_UNIT], ANIMAL_REEL_UNIT, m.pose, tl);
  });
};

const Label = ({e, tl, width, height}: {e: AnimalReelEntry} & ShotContext) => {
  const info = ANIMAL_MOTION_INFO[e.motion], dur = Math.max(...e.cast.map((c) => animalMotionDuration(e.motion, {animal: c.animal})));
  const font = 'Noto Sans Thai, Helvetica, Arial, sans-serif';
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width, height, fontFamily: font, color: '#2b211c'}}>
      <div style={{position: 'absolute', left: 60, top: 150, width: width - 120, fontSize: 56, fontWeight: 700, lineHeight: 1.1}}>{e.motion}</div>
      <div style={{position: 'absolute', left: 60, top: 230, width: width - 120, fontSize: 30, lineHeight: 1.3, color: '#4a3f38'}}>{info.description}</div>
      <div style={{position: 'absolute', left: 60, top: height - 250, width: width - 120, fontSize: 28, color: '#4a3f38'}}>
        {`t = ${Math.min(tl, dur).toFixed(2)} s of ${dur.toFixed(2)} s${info.loop ? ' (loop)' : ''}  |  ${e.cast.map((c) => `${c.animal} ${c.view ?? ''}`).join('  +  ')}`}
      </div>
    </div>
  );
};

export const animalMotionShots: PaintedShot[] = ANIMAL_REEL.map((e) => ({
  id: animalReelShotId(e.motion),
  serves: ['KIT-ANIMAL-MOTIONS'],
  paper: '#efe6d2',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint: paintReel(e),
  Overlay: (props) => <Label e={e} {...props} />,
}));
