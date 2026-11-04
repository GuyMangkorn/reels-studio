import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {applyCamera, pushCamera, type Camera} from '../kit/camera';
import {makePainter, type Painter} from '../kit/painter';
import {Spot} from '../kit/glow';
import {Grain} from '../kit/screen';
import {ROOM, paintBedroom, paintDoctor, paintDreamCliff, paintIdeaSpace, paintTriggerIcons} from './set';

// EDU-EP01-SHORT look frames (brief EDU-BRIEF-R1, workflow W3.1, review rows SS-R1). Look stills only: no timeline, no voice,
// no caption or eyebrow text. LF01 bedroom (S01-B01-SH01 seam frame), LF02 dream cliff (S01-B03-SH02), LF03 idea space
// (S01-B05-SH01), LF04 trigger icons (S01-B06-SH01 + SH02 end state), LF05 doctor vignette (S01-B07-SH03).

const FPS = 30;

type Kind = 'night' | 'dream' | 'paper';
const PAPER: Record<Kind, string> = {night: '#22345a', dream: '#f3e9f0', paper: '#efe6d6'};
/** Screen grade per location: a soft cool vignette at night (never black, UT03), a pale lift in the dream, warm paper edges. */
const GRADE: Record<Kind, string> = {
  night: 'radial-gradient(ellipse 90% 70% at 55% 42%, rgba(16,24,48,0) 58%, rgba(16,24,48,0.28) 100%)',
  dream: 'radial-gradient(ellipse 90% 75% at 50% 40%, rgba(255,240,246,0.06) 0%, rgba(80,60,130,0) 60%, rgba(80,60,130,0.16) 100%)',
  paper: 'radial-gradient(ellipse 90% 75% at 50% 42%, rgba(255,250,240,0) 60%, rgba(120,96,64,0.14) 100%)',
};

const Painted = ({kind, cam, paint}: {kind: Kind; cam: (tl: number) => Camera; paint: (p: Painter, tl: number) => void}) => {
  const fn = useCallback(
    ({brush, frame}: PaintContext) => {
      const tl = frame / FPS;
      const p = makePainter(brush, {t: tl, frame, fade: PAPER[kind]});
      brush.push();
      applyCamera(brush, cam(tl));
      paint(p, tl);
      brush.pop();
    },
    [cam, paint, kind],
  );
  return (
    <AbsoluteFill style={{background: PAPER[kind]}}>
      <BrushCanvas paint={fn} paper={PAPER[kind]} />
      {kind === 'night' ? (
        <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
          <svg width="100%" height="100%" viewBox="0 0 1080 1920">
            <Spot x={ROOM.clock.x + 10} y={ROOM.clock.y - 10} r={230} level={0.26} color="#e8a35c" />
          </svg>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{pointerEvents: 'none', background: GRADE[kind]}} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

/** Slow push <= 3 % (brief camera language); the look still is frame 0. */
const push = (fy: number, s1 = 1.02) => (tl: number): Camera => pushCamera(tl, 4, {s0: 1, s1, fx: 540, fy});

const camRoom = push(820);
const paintRoom = (p: Painter, tl: number) => void paintBedroom(p, tl, {wallSoft: 0.25, moon: 1, clock: 1, face: 'sleepy'});
export const LF01 = () => <Painted kind="night" cam={camRoom} paint={paintRoom} />;

const camCliff = push(800, 1.015);
const paintCliff = (p: Painter, tl: number) => void paintDreamCliff(p, tl);
export const LF02 = () => <Painted kind="dream" cam={camCliff} paint={paintCliff} />;

const camIdea = push(900);
const paintIdea = (p: Painter, tl: number) => void paintIdeaSpace(p, tl);
export const LF03 = () => <Painted kind="paper" cam={camIdea} paint={paintIdea} />;

const camIcons = push(600, 1.02);
const paintIcons = (p: Painter) => paintTriggerIcons(p);
export const LF04 = () => <Painted kind="paper" cam={camIcons} paint={paintIcons} />;

const camDoc = push(700);
const paintDoc = (p: Painter, tl: number) => void paintDoctor(p, tl);
export const LF05 = () => <Painted kind="paper" cam={camDoc} paint={paintDoc} />;
