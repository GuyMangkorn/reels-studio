import amplitude from '../../amplitude.json';
import {mouthAt} from '../../rig/drivers';
import {formatCasting} from '../kit/casting';
import {rectPts, washAt} from '../kit/draw';
import type {Painter} from '../kit/painter';
import {REEL_FPS} from '../kit/motion-reel';
import {drawShotTemplate, SHOT_TEMPLATE_INFO} from '../kit/shot-templates';
import {TEMPLATE_REEL, TEMPLATE_SCENE_SEC, type TemplateScene} from '../kit/template-reel';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-SHOT-TEMPLATES plates: one painted shot per template scene (`kit/template-reel.ts`), each a proof of one shot template from
// `kit/shot-templates.ts` on its casting lines. Backdrops are world-space washes; a street has posts that slide past during a follow.
// Video: src/videos/kit-shot-templates/index.ts. Library proof, not a scene of an episode.

/** The narration envelope's first burst (src/amplitude.json frames 126-186), as kit-motions uses it. */
const A_OFFSET = 126;

const backdrop = (p: Painter, e: TemplateScene) => {
  if (e.setting === 'room') {
    washAt(p, 1, '#d8cbb0', 200, rectPts(-300, -300, 1380, e.ground - 6), 0.3, 0.4);
    washAt(p, 2, '#b3a384', 215, rectPts(-300, e.ground - 6, 1380, 2300), 0.3, 0.4);
    return;
  }
  // Street: the wall and kerb span the walk's travel (2 m at 540 px/m) and half a frame either side.
  washAt(p, 1, '#d8cbb0', 200, rectPts(-1600, -300, 2700, e.ground - 6), 0.3, 0.4);
  washAt(p, 2, '#b3a384', 215, rectPts(-1600, e.ground - 6, 2700, 2300), 0.3, 0.4);
  for (let i = 0; i < 11; i++) {
    const x = -1500 + i * 420;
    washAt(p, 10 + i, '#7d7260', 230, rectPts(x, 620, x + 22, e.ground - 6), 0.1, 0.3);
  }
};

const Label = ({e, tl, width, height, opacity}: {e: TemplateScene} & ShotContext & {opacity: number}) => {
  const info = SHOT_TEMPLATE_INFO[e.template];
  const font = 'Noto Sans Thai, Helvetica, Arial, sans-serif';
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width, height, opacity, fontFamily: font, color: '#2b211c'}}>
      <div style={{position: 'absolute', left: 60, top: 150, width: width - 120, fontSize: 54, fontWeight: 700, lineHeight: 1.1}}>{e.shot}</div>
      <div style={{position: 'absolute', left: 60, top: 240, width: width - 120, fontSize: 32, lineHeight: 1.3}}>{e.title}</div>
      <div style={{position: 'absolute', left: 60, top: 340, width: width - 120, fontSize: 26, lineHeight: 1.3, color: '#4a3f38'}}>{info.description}</div>
      {/* Footer on a paper band below the floor line, so the casting text reads over the painted figures' feet and bodies. */}
      <div style={{position: 'absolute', left: 0, top: height - 250, width, height: 120, background: 'rgba(239,230,210,0.9)'}} />
      <div style={{position: 'absolute', left: 60, top: height - 222, width: width - 120, fontSize: 28, color: '#2b211c'}}>
        {`t = ${Math.min(tl, TEMPLATE_SCENE_SEC).toFixed(2)} s of ${TEMPLATE_SCENE_SEC.toFixed(2)} s  |  ${e.cast.map(formatCasting).join('  +  ')}`}
      </div>
    </div>
  );
};

export const templateShots: PaintedShot[] = TEMPLATE_REEL.map((e) => {
  const amp = e.narration ? (t: number) => mouthAt(amplitude, t * REEL_FPS, -A_OFFSET) : undefined;
  return {
    id: e.shot,
    serves: ['KIT-SHOT-TEMPLATES'],
    paper: '#efe6d2',
    camera: (tl) => e.build(tl, amp).camera,
    paint: (p, {tl}) => {
      backdrop(p, e);
      drawShotTemplate(p, e.build(tl, amp), tl);
    },
    Overlay: (props) => <Label e={e} {...props} />,
  };
});
