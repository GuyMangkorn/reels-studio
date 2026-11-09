import type {ComponentType} from 'react';
import {Hud} from './hud';
import {Painted} from './stage';
import {paintF0, paintSP1} from './sp1';
import {paintSP2, paintSP2Close} from './sp2';
import {JAWS_CAM, paintCatch, paintJaws, CATCH_CAM} from './brakes';
import {FreezeRaster, Sp3Comp, StoryZeroHud} from './sp3';

// Spike compositions (id -> component, frame count). Registered by spike-index.ts only.
const Pill = ({children, left = 816, top = 148}: {children: string; left?: number; top?: number}) => <div lang="th" style={{position: 'absolute', left, top, width: 204, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.85)', color: '#2b211c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 30}}>{children}</div>;

export const SPIKES: Record<string, {component: ComponentType; frames: number}> = {
  'SP1-F0': {component: () => <Painted paint={paintF0} />, frames: 1},
  'SP1-R0': {component: () => <Painted paint={paintSP1(0, 'R0')} />, frames: 1},
  'SP1-R05': {component: () => <Painted paint={paintSP1(0.5, 'R05')} />, frames: 1},
  'SP1-R1': {component: () => <Painted paint={paintSP1(1, 'R1')} />, frames: 1},
  'SP2-F286': {component: () => <Painted paint={paintSP2(286, 'crouch')} paper="#1b1c1e" />, frames: 1},
  'SP2-F600': {component: () => <Painted paint={paintSP2(600, 'crouch')} paper="#1b1c1e" />, frames: 1},
  'SP2-F790': {component: () => <Painted paint={paintSP2(790, 'float')} paper="#1b1c1e" />, frames: 1},
  'SP2-F600-YAW': {component: () => <Painted paint={paintSP2(600, 'crouch', 3)} paper="#1b1c1e" />, frames: 1},
  'SP2-F600-CLOSE': {component: () => <Painted paint={paintSP2Close(600)} paper="#1b1c1e" />, frames: 1},
  'SP3': {component: Sp3Comp, frames: 1700},
  'SP3-FREEZE': {component: FreezeRaster, frames: 1},
  'SP3-F0': {component: StoryZeroHud, frames: 1},
  'SP4-CATCH': {component: () => <Painted paint={(p) => paintCatch(p, CATCH_CAM, 1)} paper="#efe2c4"><Pill>ภาพประกอบ</Pill></Painted>, frames: 1},
  'SP4-JAWS': {component: () => <Painted paint={(p) => paintJaws(p, JAWS_CAM, 0.1, 0)} paper="#20262c"><Pill>ภาพประกอบ</Pill><Hud counter={20} needle={0.085} pill={false} /></Painted>, frames: 1},
};
