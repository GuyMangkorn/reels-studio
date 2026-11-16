import {B01_SH04, dimFrame, IrisOverlay, irisIn, paintSoiAt} from '../b01-iris';
import {makeShot} from '../shot';
import {paintFieldShot, type FieldShotDef} from '../stage';
import {VIG} from '../soi';

// B01-SH04 · G 252-332 (80 f) · the earlier print is fainter (L03; EDU-EP19-SHEETS-R3). The field shot (camera, the dog's head lift, turn and first
// step, the S1-S5 ladder with the l 44 swell) is `B01_SH04` in ../b01-iris.tsx, shared with B01-SH05's held background. Iris-in l 71-80 (9 f, N8):
// the soi vignette opens from the centre (540, 760) to 410 px over the SH04 picture, which dims to 55 % behind it, so SH05 l 0 continues the same
// picture; the glow outside the circle is masked. Fallback (brief): a hard cut at G 330 with the vignette already open.
export {B01_SH04};
const def: FieldShotDef = {
  ...B01_SH04,
  paint: (p, L) => {
    paintFieldShot(p, B01_SH04.cam(L), B01_SH04.state(L));
    const r = irisIn(L);
    if (r <= 0) return;
    dimFrame(p, VIG.dim * (r / VIG.r));
    paintSoiAt(p, 0, r);
  },
  glow: undefined,
  overlay: (L) => <IrisOverlay id="b01sh04" r={irisIn(L)} outside={{cam: B01_SH04.cam(L), spots: B01_SH04.glow!(L)}} outOp={1 - VIG.dim * (irisIn(L) / VIG.r)} />,
};
export const shot = makeShot(def);
