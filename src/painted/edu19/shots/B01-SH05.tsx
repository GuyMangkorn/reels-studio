import {B01_SH04, B01_SH06, BACK_L, Curl, dimFrame, FULL_R, IrisOverlay, irisOut, paintFieldInCircle, paintSoiAt} from '../b01-iris';
import {makeShot} from '../shot';
import {VIG} from '../soi';
import {paintFieldShot, type FieldShotDef, type LookFrame} from '../stage';

// B01-SH05 · G 332-399 (67 f) · the fried-rice comparison (L03b; EDU-EP19-SHEETS-R3). Vignette V (centre (540, 760), 820 px, cream ring 10 px) over
// the SH04 end frame (l 79) held and dimmed to 55 %; inside, the soi at dusk (space S), the camera trucking behind YOU toward the stall; the smell
// curl rises from the wok and drifts to YOU, doubled in width from l 55 (G 387, measured), when YOU's head lifts. LF04 = l 56. Iris-out l 58-67
// (N8): inside the circle the picture becomes B01-SH06's first frame and the circle grows to the full frame (ease-in), the hard cut to SH06 at l 67
// landing on the same picture. Fallback (brief): a hard cut at l 67 with the vignette open.
const N = 67;
const OUT = 58;
const back = (L: number) => ({cam: B01_SH04.cam(BACK_L), spots: B01_SH04.glow!(BACK_L), L});
const def: FieldShotDef = {
  id: 'B01-SH05', N, cam: B01_SH04.cam, state: B01_SH04.state,
  paint: (p, L) => {
    paintFieldShot(p, B01_SH04.cam(BACK_L), B01_SH04.state(BACK_L));
    dimFrame(p, VIG.dim);
    if (L < OUT) paintSoiAt(p, L, VIG.r);
    else paintFieldInCircle(p, B01_SH06, 0, irisOut(L));
  },
  overlay: (L) => {
    const r = L < OUT ? VIG.r : irisOut(L);
    return <IrisOverlay id="b01sh05" r={r} outside={r < FULL_R ? back(L) : undefined} outOp={1 - VIG.dim} inside={L < OUT ? <Curl L={L} /> : undefined} insideGlow={L >= OUT ? {cam: B01_SH06.cam(0), spots: B01_SH06.glow!(0)} : undefined} />;
  },
};
export const shot = makeShot(def);

/** LF04 look still (look.tsx): this plate's picture at frame L. */
export const soiLook = (L: number): LookFrame => ({shot: 'B01-SH05', G: 332 + L, L, paint: (p) => def.paint!(p, L), overlay: def.overlay!(L)});
