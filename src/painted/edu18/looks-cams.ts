import type {V3} from '../kit/space';
import {orbitYCam, type YCam} from '../kit/ycam';

// EDU-EP18-SHORT W3 look-frame cameras and marks (Film, 16 Nov 2026). Each is the brief shot's END camera (EDU-EP18-BRIEF-R1 untimed shot
// list) with the W3 changes listed per camera; every change is recorded in the brief change log. Shared by looks.tsx and the measure probe.

const DEG = Math.PI / 180;
/** Brief camera line `at (x, y, z), yaw a, r r, eye e, f f` as a kit yaw camera (orbit azimuth a about the target, level). */
export const cam = (at: V3, az: number, r: number, eye: number, f: number, hy: number, o: {pitch?: number; cx?: number; near?: number} = {}): YCam =>
  ({...orbitYCam(at, r, az * DEG, eye, f, hy), pitch: (o.pitch ?? 0) * DEG, cx: o.cx ?? 0, ...(o.near ? {near: o.near} : {})});

// LF01 B01-SH01 at the yawn peak. Brief: at (-0.5, 0.75, -1.0), yaw 12, r 3.4, eye 0.8, f 1250; canoe heading 135; H1 (-1.2, 0, -2.4) facing
// 150. W3 changes (recorded in the brief change log):
// (1) Canoe heading 170 (bow almost at the lens, she squared to it; brief 135). At 135 and this lens the 5.5 m hull ran side-on across the
//     whole frame and its gunwale hid the hippo's jaw.
// (2) H1 moved to (1.6, 0, -2.6), facing 240. The brief calls H1 "behind her LEFT shoulder"; she faces the bow (+z), so her left is +x,
//     screen right; the brief's H1 at x -1.2 sat on her right, 0.87 m from the stern at heading 135 (against "never touches the canoe").
//     Now 2.7 m from her, 2.1 m from the stern; facing 240 is a front three-quarter whose open mouth points toward her (screen left).
// (3) Camera azimuth -12, r 6.0, f 2100 (a longer lens from further back) to compress the 3 m between them, so the yawn reads near her size
//     (yawn 400 px vs her 410 px; at f 1250 r 3.4 it was about 360 vs 470), eye 1.0 (brief 0.8) so the hippo's waterline clears the hull.
export const cLF01 = cam([0.6, 0.7, -1.3], -12, 6.0, 1.0, 2100, 700);
export const LF01_CANOE = {at: [0, 0, 0] as V3, heading: 170};
/** H1 head centre; the hippo body origin sits 1.2 m behind it along the heading (hippo3d rig: head centre about 1.2 m ahead of the origin). */
export const LF01_H1: V3 = [1.6, 0, -2.6];
export const LF01_HIPPO_HEADING = 240;
export const hippoOrigin = (head: V3, heading: number, back = 1.2): V3 => [head[0] - back * Math.sin(heading * DEG), head[1], head[2] + back * Math.cos(heading * DEG)];

// LF02 B03-SH01 end (she stops at G0 and waves to the house). Brief: at (0.3, 1.0, 0), yaw 200 -> 192, r 7.0 -> 6.2, eye 1.4, f 1000, lead
// est about 520 px. W3 changes: (1) f 1900, r 6.0 (end): at f 1000 r 6.2 the 1.64 m girl measures about 256 px (the brief's 520 px estimate
// was wrong); the longer lens lifts her to about 487 px, frames her between the gate posts and compresses the lane, paddy and palms behind
// her. (2) hy 690 so her feet land at about y 1106 (above the caption band) and the band falls on the yard earth. (3) Hens moved from
// (-1.4, 0, -3.5) / (-0.9, 0, -4.1) (off frame right at this lens) to (-0.85, 0, -3.6) / (0.1, 0, -3.5), large in the near yard.
//
// (4) Sun direction x negated (village.ts SUN_V). (5) The stilt house's eave shadow crosses the near yard at z about -3.1 (from the brief's
// house position and the 15:30 sun): the hens peck in the shade, darker foreground (UT12).
export const cLF02 = cam([0.3, 1.0, 0], 192, 6.0, 1.4, 1900, 690);
export const LF02_G0: V3 = [0.3, 0, 0.4];
export const LF02_HENS: {at: V3; id: 'hen-brown' | 'hen-buff'; view: 'left' | 'right' | 'front'; state: 'stand' | 'peck'}[] = [
  {at: [-0.85, 0, -3.6], id: 'hen-brown', view: 'right', state: 'peck'},
  {at: [0.1, 0, -3.5], id: 'hen-buff', view: 'left', state: 'stand'},
];

// LF02B B04-SH02 (her stopped step, the snake across the path in front of her). Brief: at (0, 0.5, -0.6), yaw 0 -> 6, r 1.6 -> 1.4, eye 0.45,
// f 1100, snake held above y 1160 via hy. W3 changes: (1) eye 0.7, r 2.0 (end framing 2.0 here; the move pushes 2.2 -> 2.0): at eye 0.45 the
// snake on the bund top (0.36) sits 0.1 m under the lens and draws as a 50 px line across her feet (they overlap in the picture); at 0.7 the
// snake reads as a body on the ground about 100 px below her feet and the field shows over the rice tops. (2) hy 850: the snake spans y about
// 1071-1126 (above the caption band), her head at about y 190. (3) Snake centre at x -0.08 (head at picture x about 955, not at the edge).
export const cLF02B = cam([0, 0.7, -0.6], 0, 2.0, 0.7, 1100, 850);
export const LF02B_P0: V3 = [0, 0.35, -0.75];
export const LF02B_SNAKE = {at: [-0.08, 0] as [number, number], heading: 0, ground: 0.35};

// LF03 B05-SH01 (she lies down; fan, moonlight). Brief: at (0, 0.55, -0.9), yaw 0 -> 6, r 2.4 -> 2.0, eye 1.45, f 1000. W3 changes: (1) target
// (-0.15, 0.55, -1.0), r 2.1, f 880 (end framing): at f 1000 r 2.0 the bedside lamp and the floor fan both fall outside the frame, and B05
// needs the fan (A6, oscillation) and B06 needs the lamp in the same room; (2) bedside table moved (-1.45, 0, -1.4) -> (-1.35, 0, -1.5) and the
// fan (1.65, 0, -0.7) -> (1.2, 0, -1.5) so both stand inside this frame (bedroom.ts TABLE, FAN); (3) hy 700: her head at about y 1032, the
// caption band on the bed's front face and blanket.
export const cLF03 = cam([-0.15, 0.55, -1.0], 0, 2.1, 1.45, 880, 700);
/** P37 ground point on the bed top (the lying figure's g); her head lands near the brief's (-0.75, 0.6, -1.15). */
export const LF03_LIE: V3 = [0.46, 0.45, -1.15];
// LF03L B06-SH01 end (lamp on, she sits up with the phone). Brief: at (-0.6, 0.8, -1.0), yaw -20 -> -12, r 2.0 -> 1.75, eye 1.2, f 1000.
// W3 change: f 1150, hy 640 so the seated lead reaches about 480 px (est at f 1000: about 430 px) with the lamp in frame at left.
export const cLF03L = cam([-0.6, 0.8, -1.0], -12, 1.75, 1.2, 1150, 640);
export const LF03L_HIPS: V3 = [-0.55, 0.45, -1.35];

// LF03B B05-SH03 (L13: the mosquito alone, trucking with it). Brief: space M mm, at (0, 0, 0), yaw 70 -> 110, r 30 -> 45 mm, eye 0, f 1100.
// W3: the target and eye are the mosquito's body centre height (MOSQ_Y0 = 8 mm in its build, so "eye 0" is read as level with the body);
// side view (the kit build's heading 0 faces +x; the brief's yaw 70 -> 110 arc is centred on this side view, so the look takes the arc's
// middle as azimuth 0 here), r 22 mm (closer than the brief's 30 so the 6 mm body reads at about 300 px); hy 700 so the dangling legs end
// above the caption band.
export const cLF03B = {...cam([0, 8, 0], 0, 22, 8, 1100, 700), near: 2};

// LF04 B03-SH04 end (L08 size picture; the user chose to paint the stadium, trim T1 dropped, and asked for a HIGH-ANGLE view: aerial /
// crane-up from the rim to the full bowl so the full bowl and the dot crowd read from above; 16 Nov 2026). Brief: at (0, 10, 0), yaw 30 -> 40,
// r 160 -> 190, eye 70 -> 95, f 900 (a level camera: pitch-down about 24 deg). W3 changes: (1) pitch-down 52 deg, eye 189.2, r 141.6 (camera
// 230 m from the target): at 24 deg the near stand's upper tier (rake 36.7 deg, stadium.ts BOWL) faces away from the lens and only the far
// stands read; the pitch-down must exceed the steepest rake for every stand's seats to show. (2) Azimuth 65 (brief 40): the pitch's long axis
// runs more up the frame, so the bowl fills more of the 9:16 height (outer rim y about 470-1320, x 107-1056). (3) f 1000, hy 840: the whole
// bowl in frame with about 25 px side margin; the caption band (y 1176-1344) lies on the near upper tier, rim and outer wall; the far roof at
// y about 470; the top-left mark corner is city haze. (4) Target (0, 8, 0). Proposed crane START for the W4 sheet (not painted): az 55, r 110,
// eye 52, pitch -22, f 1000 (low over the near rim looking across at the far stands), easing up and back to this end camera.
export const LF04_AZ = 65;
export const cLF04 = cam([0, 8, 0], LF04_AZ, 141.6, 189.2, 1000, 840, {pitch: -52});
