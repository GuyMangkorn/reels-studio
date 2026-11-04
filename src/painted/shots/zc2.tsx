import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import type {Camera} from '../kit/camera';
import {CaptionShade, Grain} from '../kit/screen';
import {PAPER} from '../zc2kit/frames';
import {cur} from '../zc2kit/sb-lib';
import {SPECS} from '../zc2kit/draft-spec';
import type {PaintedShot} from '../shot';

// ZCONDO2-SHORT-TH plates: one `PaintedShot` per W5.2 draft shot (`ZC2D-<shot>`, the same frames, camera, labels and cue-gated caption shade as the
// standalone compositions in src/painted/zc2kit/draft.tsx). The timeline (src/videos/zombie-condo2/index.ts) selects them by ID; captions and sound
// are Editor's. Every frame is a pure function of the shot-local frame `f = round(tl * 30)`; the draft clock `cur.f` carries f into the shared painters.
const FPS = 30;
/** CSS twin of `applyCamera` for overlays that sit in the painted world (labels beside a plate object). */
const camCss = (c: Camera): CSSProperties['transform'] => `translate(${c.fx + c.dx}px, ${c.fy + c.dy}px) scale(${c.s}) translate(${-c.fx}px, ${-c.fy}px)`;

/** Plate ID of a sheet shot: `ZC2-B01-SH01` -> `ZC2D-B01-SH01`. */
export const zc2PlateId = (shot: string) => shot.replace(/^ZC2-/, 'ZC2D-');

const plateOf = (shot: string): PaintedShot => {
  const s = SPECS[shot];
  const fOf = (tl: number) => Math.round(tl * FPS);
  return {
    id: zc2PlateId(shot), serves: [shot], paper: PAPER,
    camera: (tl) => s.cam(fOf(tl)),
    paint: (p, {tl}) => { const f = fOf(tl); cur.f = f; try { s.paint(p, f); } finally { cur.f = 0; } },
    Overlay: ({tl, opacity}) => {
      const f = fOf(tl);
      return (
        <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
          {s.over ? <AbsoluteFill style={{transformOrigin: '0 0', transform: camCss(s.cam(f))}}>{s.over(f)}</AbsoluteFill> : null}
          {s.after?.(f)}
          <Grain opacity={0.1} />
          {s.peak > 0 ? <CaptionShade tl={f / FPS} cues={s.cues.map(([a, b]) => [a / FPS, b / FPS, s.lines ?? 2] as const)} mode="band" strength={s.peak} /> : null}
        </AbsoluteFill>
      );
    },
  };
};

export const zc2Shots: PaintedShot[] = Object.keys(SPECS).map(plateOf);
