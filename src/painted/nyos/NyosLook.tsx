import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {hash} from '../kit/hash';
import {makePainter, range, ring, type Painter, type Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';

// Film look-check stills for NYOS-EP01-SHORT (brief NYOS-BRIEF-R3, VD01). Throwaway spike, not the production plate
// module (Boss ports what the user approves): LF-A real-event night village (CAM-VILLAGE-like) and LF-S charcoal
// imagination frame (B05 lake-shape). Not approved by the user.
const W = 1080;

const SKY = ['#0b1a26', '#0e2230', '#122b38', '#173642', '#1d4148'];
const LAMP = '#f0b45a';

const band = (y0: number, y1: number): Pt[] => [[-40, y0], [W + 40, y0], [W + 40, y1], [-40, y1]];
const ridge = (y: number, amp: number, seed: number, n = 18): Pt[] =>
  range(n, (u) => [-40 + u * (W + 80), y - amp * (0.5 + 0.5 * Math.sin(u * 7 + seed)) * (0.6 + 0.4 * hash(seed * 31 + Math.round(u * n)))] as Pt);
const closed = (top: Pt[], bottom: number): Pt[] => [...top, [W + 40, bottom], [-40, bottom]];

const house = (p: Painter, x: number, y: number, w: number, h: number, id: number, lit: boolean) => {
  const roofH = h * 0.45;
  p.wash('#12272c', 250, [[x, y], [x + w, y], [x + w, y - h], [x, y - h]], 0.03, 0.2);
  p.wash('#16303a', 230, [[x - 8, y - h], [x + w + 8, y - h], [x + w - 10, y - h - roofH], [x + 10, y - h - roofH]], 0.04, 0.3);
  p.wash('#294a52', 140, [[x - 8, y - h], [x + w * 0.5, y - h], [x + w * 0.5 - 6, y - h - roofH], [x + 10, y - h - roofH]], 0.04, 0.3);
  if (lit) {
    const ww = w * 0.3, wh = h * 0.36, wx = x + w * (0.2 + 0.4 * hash(id)), wy = y - h * 0.7;
    p.wash(LAMP, 255, [[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh]], 0.02, 0.1);
    p.wash(LAMP, 60, [[wx - ww * 0.6, wy - wh * 0.4], [wx + ww * 1.6, wy - wh * 0.4], [wx + ww * 1.6, wy + wh * 1.4], [wx - ww * 0.6, wy + wh * 1.4]], 0.4, 0.5);
  }
  p.ink(40 + id, 'HB', '#050b0e', 1.6);
  p.brush.line(x, y, x, y - h); p.brush.line(x + w, y, x + w, y - h);
};

/** LF-A: moonlit blue-green night, crater lake behind a village, warm lamp windows only. */
export const paintLfA = (p: Painter) => {
  const {brush} = p;
  SKY.forEach((c, i) => p.wash(c, 255, band(i * 160 - 20, i * 160 + 200), 0.15, 0.35));
  // moon glow, cool, upper right
  p.wash('#bfe3da', 40, ring(800, 230, 170, 150), 0.5, 0.5);
  p.wash('#e8f6ef', 150, ring(800, 230, 46, 46), 0.2, 0.3);
  // far crater rim, steep green hills (value ~20-30 %), then near rim
  p.wash('#1c4a44', 255, closed(ridge(760, 150, 1.3), 1000), 0.05, 0.45);
  p.wash('#2a6258', 90, closed(ridge(790, 120, 2.1), 1000), 0.05, 0.45);
  p.wash('#133a37', 255, closed(ridge(880, 120, 4.2), 1100), 0.05, 0.45);
  // lake: pale moon-lit band with moon streak
  p.wash('#2f5f66', 255, [[-40, 960], [W + 40, 940], [W + 40, 1130], [-40, 1150]], 0.08, 0.3);
  p.wash('#8cc3c0', 55, [[690, 950], [930, 950], [880, 1130], [740, 1130]], 0.3, 0.4);
  p.wash('#0f2a30', 120, [[-40, 1060], [W + 40, 1050], [W + 40, 1130], [-40, 1150]], 0.1, 0.3);
  // shore + village slope
  p.wash('#0d2623', 255, closed(ridge(1140, 40, 6.6, 12), 1500), 0.05, 0.4);
  p.wash('#081a1a', 255, closed(ridge(1330, 50, 7.7, 12), 1560), 0.05, 0.4);
  // houses, back to front
  house(p, 90, 1250, 120, 70, 1, false);
  house(p, 330, 1245, 110, 66, 2, true);
  house(p, 560, 1255, 130, 74, 3, false);
  house(p, 800, 1245, 120, 70, 4, true);
  house(p, 190, 1400, 170, 96, 5, true);
  house(p, 640, 1410, 180, 100, 6, true);
  // trees (banana/maize shapes as dark clumps)
  [[40, 1330], [470, 1340], [960, 1335], [1010, 1450]].forEach(([x, y], i) => {
    p.wash('#06151a', 255, ring(x, y - 55, 46, 62, 10), 0.1, 0.4);
    p.ink(70 + i, '2B', '#02080a', 1.4);
    brush.line(x, y, x, y - 60);
  });
  // dirt path, dim
  p.wash('#1b3636', 200, [[330, 1560], [420, 1560], [560, 1260], [520, 1260]], 0.1, 0.4);
  // foreground dark ground (caption band area stays quiet)
  p.wash('#04100f', 255, band(1540, 1960), 0.08, 0.3);
};

const inPoly = (x: number, y: number, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

/**
 * LF-S v2: charcoal on dark paper, B05 imagination frame. A looming horned mass rises out of the lake, many eyes, a wide
 * toothed maw, claws on the shore, drawn as a dark negative shape against dense radial scribble (viewer's guess, no gore).
 * Everything stays above y 860 (caption band stays dark paper).
 */
const paintLfS = (p: Painter) => {
  const {brush} = p;
  const CH = '#e6dfd0', DIM = '#8d877c', FAINT = '#4d4943', EYE = '#f6f0df';
  // jagged horned silhouette, clockwise from the lower left; head centre ~ (540, 380)
  const sil: Pt[] = [[-30, 900], [-30, 470], [50, 440], [30, 360], [140, 390], [150, 280], [240, 320], [215, 190], [315, 250], [280, 60], [385, 190], [410, 90], [470, 200], [540, 130], [610, 200], [670, 90], [695, 190], [800, 60], [765, 250], [865, 190], [840, 320], [930, 280], [940, 390], [1050, 360], [1030, 440], [1110, 470], [1110, 900]];
  const HC: Pt = [540, 380];
  // 1. radial scribble field: pale near the silhouette (glare behind the head), fading outward; none inside the mass
  for (let i = 0; i < 1500; i++) {
    const x = -20 + 1120 * hash(i + 200), y = 850 * hash(i + 300);
    if (inPoly(x, y, sil)) continue;
    const d = Math.hypot((x - HC[0]) / 1.25, y - HC[1]);
    const ang = i % 2 ? Math.atan2(y - HC[1], x - HC[0]) + 0.35 * (hash(i + 500) - 0.5) : 0.9 + 0.5 * (hash(i + 600) - 0.5);
    const l = 38 + 55 * hash(i + 400), x2 = x + l * Math.cos(ang), y2 = y + l * Math.sin(ang);
    if (inPoly(x2, y2, sil) || inPoly((x + x2) / 2, (y + y2) / 2, sil) || y2 > 850) continue;
    const near = Math.max(0, 1 - d / 700);
    const col = near > 0.55 ? CH : near > 0.3 ? DIM : FAINT;
    p.ink(10 + (i % 9), 'charcoal', col, 1.2 + 1.6 * near);
    brush.line(x, y, x2, y2);
  }
  // 2. heavy double outline + ragged fur ticks along the silhouette
  p.ink(20, 'charcoal', CH, 2.8); brush.spline([...sil.slice(0, 26), sil[0]].slice(1, 26), 0.1);
  p.ink(21, 'charcoal', DIM, 2.4); brush.spline(sil.slice(1, 26).map(([x, y]) => [x + 9, y + 7] as Pt), 0.1);
  for (let i = 1; i < 25; i++) {
    const [x0, y0] = sil[i], [x1, y1] = sil[i + 1];
    for (let k = 0; k < 5; k++) {
      const u = (k + hash(i * 9 + k)) / 5, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u;
      const nx = y1 - y0, ny = -(x1 - x0), nl = Math.hypot(nx, ny) || 1;
      p.ink(30 + ((i + k) % 5), 'charcoal', CH, 1.6);
      brush.line(x, y, x - (nx / nl) * 30 * (0.5 + hash(i * 3 + k)), y - (ny / nl) * 30 * (0.5 + hash(i * 3 + k)));
    }
  }
  // 3. fur/hide hatching inside the mass (sparse, dim) so the dark reads as heavy, not empty
  for (let i = 0; i < 260; i++) {
    const x = -20 + 1120 * hash(i + 700), y = 120 + 730 * hash(i + 800);
    if (!inPoly(x, y, sil) || inPoly(x, y, [[250, 280], [830, 280], [830, 720], [250, 720]])) continue;
    p.ink(40 + (i % 6), 'charcoal', FAINT, 1.4);
    brush.line(x, y, x + 6 * (hash(i + 900) - 0.5), y + 40 + 40 * hash(i + 950));
  }
  // 4. maw: wide jagged mouth with upper and lower teeth, interior hatched dim
  const upLip = (u: number) => 575 - 40 * Math.sin(u * Math.PI) + 8 * Math.sin(u * 23);
  const loLip = (u: number) => 700 + 55 * Math.sin(u * Math.PI) + 6 * Math.sin(u * 19);
  const mx = (u: number) => 270 + 540 * u;
  p.ink(50, 'charcoal', DIM, 1.4);
  for (let i = 0; i < 70; i++) {
    const u = 0.04 + 0.92 * hash(i + 1000), y = upLip(u) + 30 + (loLip(u) - upLip(u) - 60) * hash(i + 1100);
    brush.line(mx(u) - 24, y, mx(u) + 24, y + 4);
  }
  p.ink(51, 'charcoal', CH, 4); brush.spline(range(14, (u) => [mx(u), upLip(u)] as Pt), 0.5);
  p.ink(52, 'charcoal', CH, 4); brush.spline(range(14, (u) => [mx(u), loLip(u)] as Pt), 0.5);
  for (let i = 0; i < 13; i++) {
    const u = 0.03 + (0.94 * i) / 12, w = 26 + 12 * hash(i + 1200), uh = 55 + 70 * hash(i + 1300) * (0.5 + Math.sin(u * Math.PI));
    const lh = 45 + 65 * hash(i + 1400) * (0.5 + Math.sin(u * Math.PI));
    p.wash(EYE, 250, [[mx(u) - w / 2, upLip(u) - 2], [mx(u) + w / 2, upLip(u) - 2], [mx(u) + (hash(i + 1500) - 0.5) * 10, upLip(u) + uh]], 0.02, 0.15);
    const u2 = Math.min(0.97, u + 0.03);
    p.wash(EYE, 235, [[mx(u2) - w / 2, loLip(u2) + 2], [mx(u2) + w / 2, loLip(u2) + 2], [mx(u2) + (hash(i + 1600) - 0.5) * 10, loLip(u2) - lh]], 0.02, 0.15);
  }
  // 5. eyes: six, uneven sizes; pale glare halo, dark slit pupil, angry brow slashes
  const eyes: [number, number, number, number][] = [[415, 400, 46, 28], [665, 400, 46, 28], [330, 290, 24, 16], [750, 290, 24, 16], [540, 290, 18, 13], [500, 480, 14, 10]];
  eyes.forEach(([x, y, rx, ry], i) => {
    p.wash(CH, 35, ring(x, y, rx * 2.2, ry * 2.6, 12), 0.4, 0.3);
    p.wash(EYE, 255, ring(x, y, rx, ry, 10), 0.04, 0.15);
    p.ink(60 + i, 'charcoal', '#0b0a08', 1.6); brush.line(x + 1, y - ry * 1.1, x - 1, y + ry * 1.1);
    const s = x < 540 ? 1 : -1;
    if (rx > 20) { p.ink(70 + i, 'charcoal', CH, 3); brush.line(x - s * rx * 1.5, y - ry * 2.4, x + s * rx * 1.2, y - ry * 1.1); }
  });
  // 6. lake edge in front, ripples, and clawed hands braced on the shore
  const lakeArc = (dy: number, w: number, col: string, id: number) => { p.ink(id, 'charcoal', col, w); brush.spline(range(16, (u) => [-20 + 1120 * u, 835 + dy - 38 * Math.sin(u * Math.PI) * 0 + 10 * Math.sin(u * 14 + id)] as Pt), 0.5); };
  lakeArc(0, 3, CH, 80); lakeArc(-18, 1.8, DIM, 81);
  ([[150, 1], [930, -1]] as [number, number][]).forEach(([hx, s], hi) => {
    const kn: Pt = [hx, 735];
    p.ink(90 + hi, 'charcoal', CH, 3.6); brush.spline([[hx - s * 150, 520], [hx - s * 70, 640], kn, [hx + s * 20, 790]], 0.6);
    for (let f = 0; f < 4; f++) {
      const bx = hx - s * (40 - f * 36), tx = bx + s * (f - 1.5) * 34 + s * 20, ty = 828 + 6 * f;
      p.ink(100 + hi * 5 + f, 'charcoal', CH, 3);
      brush.spline([[bx, 745], [bx + s * 8, 785], [tx - s * 6, 810], [tx, ty]], 0.6);
      p.wash(EYE, 250, [[tx - 7, ty - 22], [tx + 7, ty - 22], [tx + s * 10, ty + 18]], 0.02, 0.1);
    }
  });
};

export type Look = {id: string; paper: string; paint: (p: Painter) => void; grade: boolean};
export const LOOKS: Record<string, Look> = {
  'LF-A': {id: 'LF-A', paper: '#0b1a26', paint: paintLfA, grade: true},
  'LF-S': {id: 'LF-S', paper: '#15130f', paint: paintLfS, grade: false},
};

export const LookStill = ({look}: {look: Look}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const paint = useCallback(({brush}: PaintContext) => {
    look.paint(makePainter(brush, {t: frame / fps, frame, fade: look.paper}));
  }, [look, frame, fps]);
  return (
    <AbsoluteFill style={{backgroundColor: look.paper}}>
      <BrushCanvas paint={paint} paper={look.paper} />
      {look.grade && <Grade />}
      <Grain />
    </AbsoluteFill>
  );
};
