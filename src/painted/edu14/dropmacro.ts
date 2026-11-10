// SET-DROPMACRO (N8; B03-SH01/SH03, B04-SH02/SH03): the bus stop out of focus behind a mm-scale drop: dark wet street, green posts, white blouse, lightbox glow, warm shop
// light and rain streaks at other depths, plus the far pavement plane the burst pieces fall toward. Screen space; `t` seconds, `yaw` degrees (parallax).
import {ell, inkLine, rectPts, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';

const W = 1080, H = 1920;
export const PAVEMENT_Y = 1560;
export const paintDropMacro = (p: Painter, o: {t: number; yaw?: number; pavement?: boolean}) => {
  const px = (o.yaw ?? 0) * 6;
  washAt(p, 28001, '#59646a', 255, rectPts(0, 0, W, H), 0, 0);
  washAt(p, 28002, '#3f4448', 255, rectPts(0, 1300, W, H), 0, 0);
  washAt(p, 28003, mixColor('#4d6b5a', '#59646a', 0.3), 255, rectPts(80 - px * 1.4, 0, 230 - px * 1.4, H), 0, 0);
  washAt(p, 28004, mixColor('#4d6b5a', '#59646a', 0.4), 255, rectPts(860 - px * 1.4, 0, 960 - px * 1.4, H), 0, 0);
  washAt(p, 28005, '#dfe8ea', 110, ell(760 - px, 360, 260, 170, 20), 0, 0);
  washAt(p, 28006, '#f4f1ea', 150, ell(330 - px, 1120, 200, 280, 20), 0, 0);
  washAt(p, 28007, '#232b3e', 140, ell(330 - px, 1480, 170, 160, 18), 0, 0);
  [[140, 260, 70], [980, 640, 90], [640, 1560, 80], [200, 1700, 60], [930, 1380, 55]].forEach(([x, y, r], i) => washAt(p, 28008 + i, '#e8b765', 120, ell(x - px * 1.6, y, r, r, 18), 0, 0));
  if (o.pavement) { // the far wet pavement plane: a lighter strip with reflections where the pieces land
    washAt(p, 28020, '#6b7479', 255, rectPts(0, PAVEMENT_Y, W, H), 0, 0);
    washAt(p, 28021, '#8a9498', 150, ell(540, PAVEMENT_Y + 10, 520, 14, 22), 0, 0);
    [[240, '#e8b765'], [760, '#dfe8ea']].forEach(([x, c], i) => washAt(p, 28022 + i, c as string, 70, ell(x as number, PAVEMENT_Y + 60, 40, 130, 14), 0, 0));
  }
  // rain streaks at other depths, falling with the plate clock
  p.inkStill(28100, 'pen', '#b4c2cc', 1);
  for (let i = 0; i < 40; i++) {
    const sp = 700 + 700 * hash(28110 + i), x = hash(28120 + i) * (W + 200) - 100 - px * 2, len = 120 + hash(28130 + i) * 180, y = ((hash(28140 + i) * (H + 600) + o.t * sp) % (H + 600)) - 300;
    inkLine(p, 28200 + i, [[x, y], [x - len * 0.08, y + len]], {weight: 1, color: '#b4c2cc', closed: false, still: true});
  }
};
