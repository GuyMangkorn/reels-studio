import type {ReactNode} from 'react';
import type {CamMove} from '../../painted/kit/cam-moves';
import type {Painter} from '../../painted/kit/painter';
import type {YCam} from '../../painted/kit/ycam';

// EDU-EP16 shot plate types (Editor, R1.5b draft): `Env` is the clock of a shot-local frame, `Shot` one plate (camera, paper, painter, optional screen layers).
// `L` shot-local frame, `g` composition frame, `t` composition seconds (ambient clocks), `len` shot length in frames.
export type Env = {L: number; g: number; t: number; len: number};
export type Shot = {cam: CamMove | ((e: Env) => YCam); paper: string; vig?: number; draw: (p: Painter, c: YCam, e: Env) => void; over?: (e: Env) => ReactNode; wrap?: (e: Env, inner: ReactNode) => ReactNode};
