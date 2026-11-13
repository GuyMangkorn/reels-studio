import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {paintSh21, SH21_LEN} from '../edu17/instrument';
import {paintStadiumShot, STADIUM_SHOTS, type StadiumShot} from '../edu17/stadium';

// EDU-EP17 group 4 check stills (Boss, 2026-11-12): SET-STADIUM16 N8 (SH17-SH20) and instrument KB N9 (SH21). Spike entry only (edu17-group4-index.ts): no timeline, voice or captions.
// Guides (caption band) off with --props='{"guides":false}'.
const Painted = ({paint, paper}: {paint: (p: Painter) => void; paper: string}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / 30, frame, fade: paper})), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.05} />
      {(getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** id -> paint. `f` is the shot-local frame the still shows. */
export const G4: Record<string, {paint: (p: Painter) => void; paper: string; len: number}> = {};
const stadium = (shot: StadiumShot, f: number) => { G4[`${shot}-f${f}`] = {paint: (p) => void paintStadiumShot(p, shot, f), paper: STADIUM_SHOTS[shot].state === 'day' ? '#9aa3ab' : '#101828', len: STADIUM_SHOTS[shot].len}; };
stadium('SH17', 0); stadium('SH17', 5); stadium('SH17', 36); stadium('SH17', 46); stadium('SH18', 0); stadium('SH18', 25); stadium('SH18', 52); stadium('SH19', 0); stadium('SH19', 24); stadium('SH19', 45); stadium('SH20', 0); stadium('SH20', 27); stadium('SH20', 58);
for (const f of [2, 12, 22, 38, 52, 82]) G4[`SH21-f${f}`] = {paint: (p) => void paintSh21(p, f), paper: '#1a2236', len: SH21_LEN};

export const G4_COMPONENTS = Object.fromEntries(Object.entries(G4).map(([id, s]) => [id, () => <Painted paint={s.paint} paper={s.paper} />])) as Record<string, () => ReactNode>;
