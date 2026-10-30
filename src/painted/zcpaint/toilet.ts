import type {Pt} from '../painter';
import {ell} from './ctx';
import {cel} from './light';
import type {Flat} from './sets';

// ZCPAINT toilet (Boss pass 19, user: B05 "ดูไม่ออกเลยว่าเป็นชักโครก"): ONE front, slightly raised view of a close-coupled toilet, shared by
// B05-SH01 (background fixture), B05-SH02 (the pour), B05-SH03 (the cistern lid lifted off) and its bowl close. Recognition cues: the wide oval
// seat ring with the bowl opening and water, the raised seat lid with its hinges, the tank behind with its lid slab, a chrome flush button on
// the lid top and a side lever on the tank front. Local units: 1 = 1 px at scale 1, origin at the floor under the bowl centre, up is negative.
// Total height 646 (the button top), width 336 (the seat ring).

const WHITE = '#e6e3da', WHITE_TOP = '#f2efe6', CHROME = '#b4bec4', SHADE = '#cfcac0';

export type ToiletOpts = {
  /** Plate px of the floor point under the bowl centre, and the scale. */
  x: number; floorY: number; s: number;
  /** A colour transform (a dimmed room); identity by default. */
  tone?: (c: string) => string;
  /** The tank lid and the water window: `lid` is the lid's offset in plate px (lifted off when set); `open` shows the tank water (B05-SH03). */
  lid?: Pt; open?: boolean;
};

/** Where the bowl water is centred (plate px) and its half-axes: the pour target (B05-SH02) and the cross centre (B05-SH03 bowl). */
export const toiletWater = (o: Pick<ToiletOpts, 'x' | 'floorY' | 's'>) => ({c: [o.x, o.floorY - 243 * o.s] as Pt, rx: 96 * o.s, ry: 36 * o.s});

export const paintToilet = (f: Flat, o: ToiletOpts) => {
  const {x, floorY, s} = o, tone = o.tone ?? ((c: string) => c);
  const P = (u: number, v: number): Pt => [x + u * s, floorY + v * s];
  const poly = (pts: [number, number][]) => pts.map(([u, v]) => P(u, v));
  const E = (u: number, v: number, rx: number, ry: number) => ell(x + u * s, floorY + v * s, rx * s, ry * s, 28);
  const solid = (col: string, pts: Pt[], celCol?: string, celPts?: Pt[]) => {
    f.fill(tone(col), pts);
    if (celPts) f.fill(tone(celCol ?? cel(col)), celPts);
  };
  const ink = (pts: Pt[], w = 1.0, closed = true) => f.line(pts, w, undefined, closed);

  // Tank behind (front face, cel on the right), then its lid slab and top face with the button. `lid` lifts the slab off.
  const TANK = poly([[-120, -600], [120, -600], [120, -345], [-120, -345]]);
  solid(WHITE, TANK, undefined, poly([[70, -600], [120, -600], [120, -345], [70, -345]]));
  ink(TANK);
  if (o.open) {
    // The lid is off: the clear water seen through a window in the tank front (a cutaway), a float line at the surface.
    solid('#cfe9ec', poly([[-100, -555], [100, -555], [100, -380], [-100, -380]]), '#b9dbe0', poly([[60, -555], [100, -555], [100, -380], [60, -380]]));
    f.fill(tone('#e4f5f6'), poly([[-100, -555], [100, -555], [100, -540], [-100, -540]]));
    ink(poly([[-100, -555], [100, -555], [100, -380], [-100, -380]]), 0.8);
    // Rim of the open tank: the inner back wall as a strip above the front edge.
    solid(SHADE, poly([[-112, -616], [112, -616], [120, -600], [-120, -600]]));
    ink(poly([[-112, -616], [112, -616], [120, -600], [-120, -600]]), 0.9);
  }
  const L = o.lid ?? [0, 0];
  const lidPts = (pts: [number, number][]) => poly(pts).map((p): Pt => [p[0] + L[0], p[1] + L[1]]);
  solid(WHITE_TOP, lidPts([[-132, -630], [132, -630], [132, -600], [-132, -600]]), cel(WHITE_TOP), lidPts([[-132, -612], [132, -612], [132, -600], [-132, -600]]));
  ink(lidPts([[-132, -630], [132, -630], [132, -600], [-132, -600]]));
  solid(WHITE_TOP, lidPts([[-120, -646], [120, -646], [132, -630], [-132, -630]]));
  ink(lidPts([[-120, -646], [120, -646], [132, -630], [-132, -630]]), 0.9);
  // Chrome flush button on the lid top: a rim ring and a lit cap.
  const bc = lidPts([[0, -638]])[0];
  f.fill(tone(CHROME), ell(bc[0], bc[1], 26 * s, 8 * s, 18));
  f.fill(tone('#e9eef0'), ell(bc[0] - 4 * s, bc[1] - 1 * s, 15 * s, 4.5 * s, 14));
  f.line(ell(bc[0], bc[1], 26 * s, 8 * s, 18), 0.9);
  // Side flush lever on the tank front (left): a chrome plate and the handle arm.
  f.fill(tone(CHROME), E(-92, -565, 13, 13));
  f.line(E(-92, -565, 13, 13), 0.9);
  f.fill(tone(CHROME), poly([[-92, -571], [-52, -574], [-50, -562], [-92, -559]]));
  f.line(poly([[-92, -571], [-52, -574], [-50, -562], [-92, -559]]), 0.8);

  // The raised seat lid in front of the tank (rounded top, right edge in cel), and its two hinges at the seat.
  const SEATLID = poly([[-106, -262], [-106, -424], [-88, -452], [88, -452], [106, -424], [106, -262]]);
  solid(WHITE_TOP, SEATLID, cel(WHITE_TOP), poly([[62, -262], [62, -452], [88, -452], [106, -424], [106, -262]]));
  ink(SEATLID);
  for (const hx of [-62, 38]) {
    f.fill(tone('#9aa3a8'), poly([[hx, -276], [hx + 26, -276], [hx + 26, -262], [hx, -262]]));
  }

  // The bowl body below the seat: curves in to the pedestal, flat foot on the floor, cel on the right.
  const BODY = poly([[-168, -255], [-156, -182], [-112, -130], [-72, -102], [-66, -44], [-82, -14], [82, -14], [66, -44], [72, -102], [112, -130], [156, -182], [168, -255]]);
  solid(WHITE, BODY, undefined, poly([[84, -255], [168, -255], [156, -182], [112, -130], [72, -102], [66, -44], [82, -14], [50, -14], [56, -110]]));
  ink(BODY);
  // The seat ring (wide oval), the bowl opening (rim shade), the water in it.
  f.fill(tone(WHITE_TOP), E(0, -255, 168, 78));
  f.line(E(0, -255, 168, 78), 1.0);
  f.fill(tone(SHADE), E(0, -252, 122, 54));
  f.line(E(0, -252, 122, 54), 0.9);
  f.fill(tone('#cfe9ec'), E(0, -243, 96, 36));
  f.fill(tone('#e4f5f6'), E(-20, -248, 50, 14));
};
