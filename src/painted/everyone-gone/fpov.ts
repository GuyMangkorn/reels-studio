import {paintPovHand, type HandTone} from '../kit/hands';
import {PEOPLE} from '../kit/people';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {VD18} from '../kit/draw';
import {proj, STATION_G, TOUCH, type Cam} from './space';

// "คุณ" in first person (brief R1.3 VD03, user 2026-11-03: "เป็น FPOV เลยดีกว่า"). The camera is your eyes; the only part
// of you ever drawn is the right hand and forearm, and only in two actions: the wave (P07, S02-B01-SH02) and the reach to the
// glass (P16 seen from your own eyes, S04-B01-SH03). No body, no ground shadow, no reflection (CL04, CL07): the set never
// draws you into the glass and nothing here paints a shadow. Look-defining first version by Film (W3.1 SS-R2); Boss hardens.
// Built on the kit POV hand (`paintPovHand`, back-of-hand view): the palm faces the door, so you see the back of your hand.
// Hands are drawn at their projected size from the eye (hand about 0.4 m away at B, f 587; about 0.75 m at G, f 950).

const DEF = PEOPLE['man-crop'];
const skin = DEF.head.skin;
/** man-crop skin (#d4a073) and the grey-blue short sleeve; shades follow the kit hand-tone recipe. */
export const YOU_HAND: HandTone = {
  skin,
  shade: mixColor(skin, VD18.shadow, 0.22),
  deep: mixColor(skin, VD18.shadow, 0.38),
  nail: mixColor(skin, '#ffffff', 0.45),
  crease: mixColor(skin, '#5a3a28', 0.45),
  sleeve: DEF.outfit.sleeve,
  sleeveShade: mixColor(DEF.outfit.sleeve, '#000000', 0.18),
};

const BASE = 9_300_000;
/** FPOV hands drawn 1.2x their projected size (viewmodel convention) so a hand at arm's length still reads at 270 px. */
const VIEWMODEL = 1.2;

/**
 * Wave (P07 from your eyes) at station B: the right forearm raised in front of you, palm toward the door, fingers up and
 * open. `sway` -1..1 swings the hand about the wrist (about 0.25 rad each way); the elbow stays off-frame bottom right.
 * Picture numbers (px, plate): wrist (812, 930), knuckles about (800, 825), fingertips about y 700; hand about 0.42 m from
 * the eye, size 0.7 (palm about 133 px wide).
 */
export const paintWaveHand = (p: Painter, sway = 0.4) => {
  const dir = -Math.PI / 2 + 0.25 * sway;
  const wrist: Pt = [812, 930];
  paintPovHand(p, {
    side: 1, base: BASE, wrist, dir, size: 0.7, curl: 0.05, spread: 0.55, thumb: [70, 150],
    elbow: [1150, 1560], forearmElbowScale: 2.6, sleeveCuffFraction: 0.95, tone: YOU_HAND,
  });
};

/**
 * Reach to the glass (P16 seen from your eyes) at station G: the right hand goes forward and its fingertips meet the glass
 * at TOUCH; the forearm enters from the bottom edge. `t` 0..1 is the reach (0 = hand just entering, 1 = touching).
 * The size is the projection of a hand 0.77 m (touch) to 0.52 m (entering) from the eye, times VIEWMODEL.
 */
export const paintReachHand = (p: Painter, t = 1, c: Cam = STATION_G) => {
  const k = Math.min(1, Math.max(0, t));
  const tip = proj(c, [TOUCH[0], TOUCH[1] - 0.25 * (1 - k), TOUCH[2] + 0.25 * (1 - k)]);
  const d = c.z - (TOUCH[2] + 0.25 * (1 - k));
  // Palm + middle finger is about 0.18 m; the kit hand at size 1 is 300 px long, so size = f * 0.18 / d / 300.
  const size = (VIEWMODEL * c.f * 0.18) / d / 300;
  const dir = -Math.PI / 2 + 0.12;
  const len = 300 * size;
  const wrist: Pt = [tip[0] - Math.cos(dir) * len, tip[1] - Math.sin(dir) * len];
  paintPovHand(p, {
    side: 1, base: BASE + 100, wrist, dir, size, curl: 0.02, spread: 0.3, press: 0.4 * k, thumb: [75, 150],
    elbow: [wrist[0] + 330, wrist[1] + 980], forearmElbowScale: 2.4, sleeveCuffFraction: 0.95, tone: YOU_HAND,
  });
};
