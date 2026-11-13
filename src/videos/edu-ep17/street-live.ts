// EDU-EP17-SHORT crowd staging for the six `S` street shots. The per-person crouch/jump clock now lives in Boss's `paintStreetShot` (`drop: true`, src/painted/edu17/street.ts, fix pass E);
// this file is a thin wrapper that keeps Editor's import names.
import type {Painter} from '../../painted/kit/painter';
import type {YCam} from '../../painted/kit/ycam';
import {armsUp, bodyAt, crouchFor, dropAt, jumpDrop, JUMP, MAN_CLEARANCE, paintStreetShot, type DepthItem, type StreetShot} from '../../painted/edu17/street';

export {armsUp, bodyAt, crouchFor, dropAt, jumpDrop, JUMP, MAN_CLEARANCE};

export const paintStreetLive = (p: Painter, shot: StreetShot, f: number, o: {t?: number; extra?: (c: YCam) => DepthItem[]} = {}) => paintStreetShot(p, shot, f, {...o, drop: true});
