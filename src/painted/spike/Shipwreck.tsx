import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {pushCamera, toScreen} from '../camera';
import {hash} from '../hash';
import {range, ring, type Painter, type Pt} from '../painter';
import {drawPlate} from '../plate';
import {paintedShots} from '../registry';
import {bands, paintParticles, span, waveY} from '../sea';
import {drawShip} from '../ship';
import type {PaintedShot} from '../shot';
import {paintSite} from '../shots/shipwreck';

// Film style test for SHIPWRECK-SHORT, redrawn from the shared modules in src/painted/ (Boss, 29 Oct 2026):
// S1 calm crossing (golden hour; rejected by the brief, kept as a test), S2 storm = plate SHIPWRECK-SH03a,
// S3 the site today = the SH01 plate plus the two divers. User-approved fixes (Q1): S1/S2 lower halves filled,
// S2 ink blotches removed, S3 caption band darkened, diver fins inside the caption-safe box.

const SHOT_LEN = 3;
const shotAt = (t: number) => (t < SHOT_LEN ? 1 : t < 2 * SHOT_LEN ? 2 : 3);
const SUN: Pt = [170, 655];

const paintCalm = (p: Painter, W: number, H: number) => {
  const {brush, t} = p;
  p.flat('#3e3b5e', span(W, -200, 740));
  p.wash('#3e3b5e', 230, [[-80, -80], [W + 80, -80], [W + 80, 560], [-80, 600]], 0.06, 0.55);
  p.wash('#b8664a', 200, [[-80, 330], [W + 80, 380], [W + 80, 740], [-80, 740]], 0.08, 0.45);
  p.wash('#f2b25c', 190, [[-80, 540], [W + 80, 590], [W + 80, 735], [-80, 735]], 0.1, 0.35);
  p.wash('#ffe2a0', 220, ring(SUN[0], SUN[1], 56, 56, 16), 0.25, 0.2);
  p.wash('#7d4a63', 160, [[-80, 430], [520, 410], [760, 440], [380, 462], [-80, 470]], 0.3, 0.6);
  p.wash('#8e5568', 140, [[560, 520], [W + 80, 495], [W + 80, 528], [700, 545]], 0.3, 0.6);
  // Sea below the horizon at y 728, darker toward the viewer; long swell ridges fill the lower half.
  bands(p, W, '#2e2a44', ['#4a4060', '#3d3656', '#332e4c', '#2b2742', '#25223a', '#211e34', '#1c1a2e'], 724, H + 200, {opacity: 200, bleed: 0.03, texture: 0.4});
  [980, 1220, 1480, 1740].forEach((ry, k) => {
    const pts = range(20, (u) => [-160 + u * (W + 320), waveY(-160 + u * (W + 320), ry, 14 + 6 * k, t, 1.2 - 0.2 * k)] as Pt);
    p.wash(['#3a3352', '#332d4a', '#2b2640', '#252137'][k], 220, [...pts, [W + 160, ry + 200], [-160, ry + 200]], 0.04, 0.45);
    p.wash('#4c4266', 150, [...pts, ...pts.slice().reverse().map(([x, y]) => [x, y + 18] as Pt)], 0.04, 0.5);
  });
  p.wash('#b8784c', 60, [[SUN[0] - 30, 730], [SUN[0] + 30, 730], [SUN[0] + 120, 1500], [SUN[0] - 90, 1500]], 0.2, 0.7);
  p.inkStill(10, 'HB', '#f6c77a', 1.4);
  for (let i = 0; i < 70; i++) {
    const y = 735 + Math.pow(hash(i), 1.4) * 1000;
    const spread = 60 + (y - 730) * 0.22;
    const x = SUN[0] + (hash(i + 31) * 2 - 1) * spread + 10 * Math.sin(t * 2 + i);
    const len = 12 + (y - 730) * 0.06;
    brush.line(x, y, x + len, y + 1);
  }
  p.inkStill(11, 'HB', '#6b5f86', 1.2);
  for (let i = 0; i < 40; i++) {
    const y = 760 + hash(i + 70) * 1150;
    const len = 80 + (y - 700) * 0.2;
    const x = ((hash(i + 90) * (W + 400) + t * (10 + hash(i + 5) * 14)) % (W + 400)) - 200;
    brush.line(x, y, x + len, y + 3);
  }
  const bob = 4 * Math.sin(t * 1.6);
  p.group(500);
  drawShip(p, 100, 600, 805 + bob, 330, 0.02 * Math.sin(t * 1.3), {hull: '#2c1f24', sail: '#9a5a3c', sailShade: '#6a3a30', ink: '#1a1216', rim: '#ffc46e'});
  p.group(800);
  p.wash('#463d5e', 240, [...range(16, (u) => [120 + u * 940, waveY(120 + u * 940, 808 + bob, 5, t, 2)] as Pt), [1060, 870], [120, 870]], 0.06, 0.4);
  p.inkStill(12, 'HB', '#e8a868', 1.2);
  for (let k = 0; k < 5; k++) brush.line(250 + k * 150, 812 + bob, 330 + k * 150, 813 + bob);
};

const CALM: PaintedShot = {
  id: 'SPIKE-S1-calm', serves: [], paper: '#b89a86',
  camera: (tl) => pushCamera(tl, SHOT_LEN, {s0: 1, s1: 1.05, fx: 600, fy: 640, dx: -14}),
  paint: (p, {width, height}) => paintCalm(p, width, height),
};
const SITE_DIVERS: PaintedShot = {
  ...paintedShots['SHIPWRECK-SH01'],
  id: 'SPIKE-S3-site-divers',
  paint: (p, ctx) => paintSite(p, ctx, {divers: true}),
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl),
};
const SHOTS = [CALM, paintedShots['SHIPWRECK-SH03a'], SITE_DIVERS];

export const Shipwreck = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const shot = SHOTS[shotAt(t) - 1];
  const tl = t - (shotAt(t) - 1) * SHOT_LEN;
  const paint = ({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps, width, height});
  const camera = shot.camera(tl);
  const [sx, sy] = toScreen(camera, SUN);
  return (
    <AbsoluteFill>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {shot === CALM && (
        <AbsoluteFill style={{mixBlendMode: 'screen'}}>
          <svg width="100%" height="100%" viewBox="0 0 1080 1920">
            <defs>
              <radialGradient id="sun" cx={sx} cy={sy} r={420} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffe6b0" stopOpacity={0.3} />
                <stop offset="0.12" stopColor="#ffb860" stopOpacity={0.2} />
                <stop offset="1" stopColor="#ff8a40" stopOpacity={0} />
              </radialGradient>
            </defs>
            <rect width="1080" height="1920" fill="url(#sun)" />
          </svg>
        </AbsoluteFill>
      )}
      {shot.Overlay && <shot.Overlay tl={tl} width={width} height={height} camera={camera} opacity={1} />}
    </AbsoluteFill>
  );
};
