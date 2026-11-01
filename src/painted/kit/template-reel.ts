import {parseCasting} from './casting';
import {twoShot, threeShot, talkingCloseUp, sideWalk, povShot, type CastMember, type ShotTemplate, type ShotTemplateId} from './shot-templates';

// KIT-SHOT-TEMPLATES reel: one shot template per scene, two seconds each, labelled with its shot ID and its casting lines. Plain
// data (no React) so the video (`src/videos/kit-shot-templates/index.ts`) and the plates (`src/painted/shots/kit-templates.tsx`)
// read the same scene list. Render: `node scripts/render.mjs KIT-SHOT-TEMPLATES --gl=angle --timeout=180000` (scene cache).
// Every cast line is a `parseCasting` string, so the demo also proves the casting format.

/** Seconds per scene (each template's push or walk fits inside it). */
export const TEMPLATE_SCENE_SEC = 2;

export type TemplateScene = {
  /** Painted shot ID (`kit-template-<name>`), also the label. */
  shot: string;
  template: ShotTemplateId;
  /** What the scene shows, one line. */
  title: string;
  /** Floor line of the setting, plate px (y). */
  ground: number;
  /** Backdrop: a room (wall and floor washes) or a street (posts that slide past during a follow). */
  setting: 'room' | 'street';
  /** Speaker's mouth from the narration envelope (`mouthAt`, src/amplitude.json) instead of the syllable envelope. */
  narration?: boolean;
  /** Cast of the scene, parsed from casting lines. */
  cast: CastMember[];
  /** The template at shot-local time `t`; `amp` is the speaker's mouth when `narration` is set. */
  build: (t: number, amp?: (t: number) => number) => ShotTemplate;
};

const GROUND = 1560;
const line = (s: string): CastMember => parseCasting(s);

const FACE_OFF = [line('man-parted + office, P02, neutral'), line('woman-ponytail + nurse, P03, worried')];
const SIDE_BY_SIDE = [line('woman-curly + vendor, P11, happy'), line('man-spiky + rider, P29, happy')];
const THREE = [line('woman-ponytail + nurse, P07, happy'), line('man-parted + office, P15, angry'), line('boy-school + student-th-trousers, P06, worried')];
const CLOSE_UP = [line('woman-ponytail + office, P01, happy')];
const WALKER = [line('man-spiky + hoodie, P01, neutral')];
const OTHER = [line('man-buzz + police, P16, angry')];

export const TEMPLATE_REEL: TemplateScene[] = [
  {
    shot: 'kit-template-two-shot-face-off', template: 'two-shot', title: 'Face-off: the speaker on the left talks, the listener on the right answers',
    ground: GROUND, setting: 'room', cast: FACE_OFF,
    build: (t, amp) => twoShot({cast: FACE_OFF, t, g: [540, GROUND], unit: 540, layout: 'face-off', speaker: 0, amp}),
  },
  {
    shot: 'kit-template-two-shot-side-by-side', template: 'two-shot', title: 'Side by side: both stand front on; the right one talks',
    ground: GROUND, setting: 'room', cast: SIDE_BY_SIDE,
    build: (t, amp) => twoShot({cast: SIDE_BY_SIDE, t, g: [540, GROUND], unit: 540, layout: 'side-by-side', speaker: 1, amp}),
  },
  {
    shot: 'kit-template-three-shot', template: 'three-shot', title: 'Three-shot: the middle person stands front on and talks; the outer two face in',
    ground: GROUND, setting: 'room', cast: THREE,
    build: (t, amp) => threeShot({cast: THREE, t, g: [540, GROUND], unit: 420, speaker: 1, amp}),
  },
  {
    shot: 'kit-template-talking-close-up', template: 'talking-close-up', title: 'Talking close-up: head and shoulders, mouth from the narration envelope',
    ground: GROUND, setting: 'room', narration: true, cast: CLOSE_UP,
    build: (t, amp) => talkingCloseUp({cast: CLOSE_UP, t, g: [540, GROUND], unit: 540, amp}),
  },
  {
    shot: 'kit-template-side-walk', template: 'side-walk', title: 'Side walk: the walker enters from the left and stops; the camera follows and the street slides',
    ground: GROUND, setting: 'street', cast: WALKER,
    build: (t) => sideWalk({cast: WALKER, t, g: [540, GROUND], unit: 540, dir: 'right', distance: 2, follow: 1}),
  },
  {
    shot: 'kit-template-pov', template: 'pov', title: 'POV: the other person reaches toward the viewer, drawn nearer the lens',
    ground: 1840, setting: 'room', cast: OTHER,
    build: (t) => povShot({cast: OTHER, t, g: [540, 1840], unit: 540, closeness: 1.35}),
  },
];
