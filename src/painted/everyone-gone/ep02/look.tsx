import {loadFont} from '@remotion/fonts';
import {useCallback} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../../BrushCanvas';
import {applyCamera, pushCamera, type Camera} from '../../kit/camera';
import {makePainter, type Painter} from '../../kit/painter';
import {Grain} from '../../kit/screen';
import {paintPier, paintSoiPost, paintYaowarat, POSTER, type State} from './places';

// EG-EP02-SHORT look frames (brief EG2-BRIEF-FILM-R1 look lock, workflow W3.1, review rows SS-R1). Look stills only: no
// timeline, no voice, no caption text. LF01 Yaowarat empty (S01-B02-SH01 framing), LF02 pier empty (S01-B02-SH03) and LF03
// the same pier crowded (S04-B01-SH06, same camera and props), LF04 the soi lamp post with the poster face-out
// (S04-B01-SH02), LF05 the mother at the pier (S05-B01-SH01, no "คุณ" in frame, VD10).

loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const FPS = 30;
const PAPER = '#e9e6e0';

/** Grade per state: cool blue-hour vignette (empty) or a warm morning lift (crowd/mother). Same for every pixel (VD03). */
export const StateGrade = ({state}: {state: State}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        state === 'empty'
          ? 'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(30,44,66,0) 55%, rgba(30,44,66,0.26) 100%)'
          : 'radial-gradient(ellipse 85% 70% at 50% 40%, rgba(255,214,150,0.07) 0%, rgba(90,62,40,0) 60%, rgba(90,62,40,0.16) 100%)',
    }}
  />
);

export const Painted = ({state, cam, paint, children}: {state: State; cam: (tl: number) => Camera; paint: (p: Painter) => void; children?: React.ReactNode}) => {
  const fn = useCallback(
    ({brush, frame}: PaintContext) => {
      const tl = frame / FPS;
      const p = makePainter(brush, {t: tl, frame, fade: PAPER});
      brush.push();
      applyCamera(brush, cam(tl));
      paint(p);
      brush.pop();
    },
    [cam, paint],
  );
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      {children}
      <StateGrade state={state} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

/** Locked-off drift < 1% (brief camera language; identical in both states of a matched pair). */
const drift = (fy: number) => (tl: number): Camera => pushCamera(tl, 4, {s0: 1, s1: 1.008, fx: 540, fy});

const camYW = drift(900);
const paintYW = (p: Painter) => paintYaowarat(p, 'empty');
export const LF01 = () => <Painted state="empty" cam={camYW} paint={paintYW} />;

const camPier = drift(900);
const paintPierEmpty = (p: Painter) => paintPier(p, 'empty');
const paintPierCrowd = (p: Painter) => paintPier(p, 'crowd');
const paintPierMother = (p: Painter) => paintPier(p, 'mother');
export const LF02 = () => <Painted state="empty" cam={camPier} paint={paintPierEmpty} />;
export const LF03 = () => <Painted state="crowd" cam={camPier} paint={paintPierCrowd} />;
export const LF05 = () => <Painted state="mother" cam={camPier} paint={paintPierMother} />;

/** The poster header `ตามหา` (VD01/VD07): crisp type printed on the painted sheet, multiplied into the paper; the only word. */
const PosterHeader = () => (
  <div
    style={{
      position: 'absolute', left: POSTER.x, top: POSTER.y + 28, width: POSTER.w, textAlign: 'center',
      fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 118, lineHeight: 1.1, color: '#1d1a17', mixBlendMode: 'multiply', opacity: 0.92,
    }}
  >
    ตามหา
  </div>
);
const camSoi = drift(700);
const paintSoi = (p: Painter) => paintSoiPost(p, 'empty', {poster: 'front'});
export const LF04 = () => (
  <Painted state="empty" cam={camSoi} paint={paintSoi}>
    <PosterHeader />
  </Painted>
);
