import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {hash} from '../kit/hash';
import type {YCam} from '../kit/ycam';
import {cardText, clamp01, ease, FPS, G_ZERO} from './clock';
import {ClockCard, SpaceGlow} from './look';

// EDU-EP07-SHORT screen-space layers shared by the shot files (scene sheets EDU-EP07-SHEETS-R1.1): the clock card (VD07), the space glow, dust motes.
// All are pure functions of the composition frame G; the card is screen space (it never follows a camera).

export const Frame = ({children}: {children: ReactNode}) => <AbsoluteFill style={{pointerEvents: 'none'}}>{children}</AbsoluteFill>;

/** The story-clock card at composition frame G. `popFrom` = G of the 6 f scale-in; `text` overrides the clock (the "+1 ชม." card); `flip` 0..1 turns the card about its horizontal axis. */
export const Card = ({G, text, popFrom, flip}: {G: number; text?: string; popFrom?: number; flip?: number}) => {
  const shown = text ?? cardText(G), ff = G < G_ZERO && text === undefined;
  const pop = popFrom === undefined ? 1 : ease(G, popFrom, popFrom + 6);
  const sy = flip === undefined ? 1 : Math.max(0.04, Math.abs(Math.cos(Math.PI * clamp01(flip))));
  return (
    <Frame>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '860px 220px', transform: `scale(${0.7 + 0.3 * pop}, ${(0.7 + 0.3 * pop) * sy})`, opacity: popFrom === undefined ? 1 : pop}}>
        <ClockCard text={shown} ff={ff} />
      </div>
    </Frame>
  );
};

/** Space-panel glow: nebula washes plus the Sun halo at brightness `sun`. */
export const Glow = ({cam, y1 = 1920, sun = 0}: {cam: YCam; y1?: number; sun?: number}) => <Frame><SpaceGlow cam={cam} y0={0} y1={y1} sun={sun} /></Frame>;

/** Dust motes in the sun (B05-SH02): cream specks drifting up, opacity <= 0.3 (glow cap), deterministic from L. */
export const Motes = ({L, count = 22}: {L: number; count?: number}) => (
  <Frame>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
      {Array.from({length: count}, (_, i) => {
        const t = L / FPS, per = 3 + hash(i * 3) * 2.5, u = (((t / per) + hash(i * 3 + 1)) % 1 + 1) % 1;
        const x = 140 + hash(i * 7 + 2) * 800 + 26 * Math.sin(u * 6 + i), y = 1100 - u * 700 + (hash(i * 5) - 0.5) * 300;
        return <circle key={i} cx={x} cy={y} r={2.2 + 3.4 * hash(i * 11)} fill="#fff1c8" opacity={0.3 * Math.sin(u * Math.PI) * (0.5 + 0.5 * hash(i * 13))} />;
      })}
    </svg>
  </Frame>
);
