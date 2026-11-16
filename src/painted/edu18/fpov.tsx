import type {CSSProperties, ReactNode} from 'react';
import type {Painter, Pt} from '../kit/painter';
import {paintPhoneBody, POST_500_BOX, PostScreen, SCREEN_H, SCREEN_W} from './Post';

// EDU-EP18-SHORT FPOV phone (Boss W5, 16 Nov 2026; sheet EDU-EP18-SHEETS-R1.0 items B5, B3; SD05, SD12). The painted phone body
// (`paintPhoneBody`) is painted on the quad that frames the post screen, and the crisp PostScreen SVG is laid over its screen quad as a DOM
// layer (the WORLD FOG VD09 method: painted body, SVG screen, one quad shared by both so they never drift). The FPOV phone faces the eye, so
// every quad is an axis-aligned rectangle in picture px.
//   B02-SH02 / B06-SH02: `fpovScreenQuad(s)`, s 0..1 over the shot: 1700 -> 1780 px tall, centred x 540, bottom edge 1176 -> 1150 (on the
//                        caption line), top cropped by the frame.
//   B06-SH03:            `fpovPushTo500(k)`, k 0..1 the push (sheet: L0-16 easeOutCubic, creep +3 % L16-86 via `creep`): from the s = 1
//                        framing to the "500 คน/ปี" line spanning x 60-1020 centred at y 860; the phone edge and the counter leave the frame.
// The zoom STATE (PostScreen `zoom`, a view-box crop) is the B06-SH05 small screen; the push here is a picture-stage zoom of quad + body.

export type Quad = [Pt, Pt, Pt, Pt];
export const FPOV = {h0: 1700, h1: 1780, bottom0: 1176, bottom1: 1150, cx: 540} as const;
const rect = (x0: number, y0: number, w: number, h: number): Quad => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
/** Screen quad of the FPOV phone at progress s (0..1) of B02-SH02 / B06-SH02. */
export const fpovScreenQuad = (s: number): Quad => {
  const u = Math.min(1, Math.max(0, s)), h = FPOV.h0 + (FPOV.h1 - FPOV.h0) * u, w = (h * SCREEN_W) / SCREEN_H, b = FPOV.bottom0 + (FPOV.bottom1 - FPOV.bottom0) * u;
  return rect(FPOV.cx - w / 2, b - h, w, h);
};
/** Target of the B06-SH03 push: the 500 line from x 60 to 1020, its centre at y 860. */
export const PUSH500 = {x0: 60, x1: 1020, y: 860} as const;
/** Screen quad during the B06-SH03 push, k 0..1 (scale eased geometrically, the 500 line's centre moved linearly); `creep` multiplies the end scale (sheet: +3 % L16-86). */
export const fpovPushTo500 = (k: number, creep = 1): Quad => {
  const u = Math.min(1, Math.max(0, k)), q0 = fpovScreenQuad(1), s0 = (q0[1][0] - q0[0][0]) / SCREEN_W;
  const b = POST_500_BOX, lx = b.x + b.w / 2, ly = b.y + b.h / 2;
  const s1 = ((PUSH500.x1 - PUSH500.x0) / b.w) * creep, s = s0 * Math.pow(s1 / s0, u);
  const c0: Pt = [q0[0][0] + lx * s0, q0[0][1] + ly * s0], c1: Pt = [(PUSH500.x0 + PUSH500.x1) / 2, PUSH500.y];
  const c: Pt = [c0[0] + (c1[0] - c0[0]) * u, c0[1] + (c1[1] - c0[1]) * u];
  return rect(c[0] - lx * s, c[1] - ly * s, SCREEN_W * s, SCREEN_H * s);
};
/** Logical-unit scale (px per screen unit) of a screen quad. */
export const quadScale = (q: Quad) => (q[1][0] - q[0][0]) / SCREEN_W;
/** Picture box of the 500 line on a screen quad (px). */
export const line500Box = (q: Quad) => { const s = quadScale(q), b = POST_500_BOX; return {x0: q[0][0] + b.x * s, x1: q[0][0] + (b.x + b.w) * s, y0: q[0][1] + b.y * s, y1: q[0][1] + (b.y + b.h) * s}; };

/** The phone body quad whose screen inset (paintPhoneBody: 5 % of the width, 2.4 % of the height) is `screen`. */
export const bodyFromScreen = (screen: Quad): Quad => {
  const [x0, y0] = screen[0], w = screen[1][0] - x0, h = screen[3][1] - y0, bw = w / 0.9, bh = h / 0.952;
  return rect(x0 - 0.05 * bw, y0 - 0.024 * bh, bw, bh);
};
/** Paints the phone body around `screen` (in a PaintedStack pass); returns the painted screen quad (equal to `screen`). */
export const paintFpovPhone = (p: Painter, screen: Quad, seed = 8800) => paintPhoneBody(p, bodyFromScreen(screen), seed);

/** A DOM layer filling an axis-aligned screen quad (clips its child to the screen). */
export const OnQuad = ({quad, children, style}: {quad: Quad; children: ReactNode; style?: CSSProperties}) => (
  <div style={{position: 'absolute', left: quad[0][0], top: quad[0][1], width: quad[1][0] - quad[0][0], height: quad[3][1] - quad[0][1], overflow: 'hidden', ...style}}>{children}</div>
);
/** The post on an FPOV screen quad. */
export const FpovPost = ({quad, shares, photo, zoom, rise}: {quad: Quad; shares: number; photo?: string; zoom?: number; rise?: number}) => (
  <OnQuad quad={quad}><PostScreen shares={shares} photo={photo} zoom={zoom} rise={rise} width={quad[1][0] - quad[0][0]} height={quad[3][1] - quad[0][1]} /></OnQuad>
);
