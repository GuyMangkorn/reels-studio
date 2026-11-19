import {paintPalace} from '../palace';
import {layer} from '../r4-looks';
import {pick3D} from '../r4-hands';
import {makeShot, PALACE_PAPER, type Shot26} from '../shot';
import {COIN_CHEST, vespRig} from '../palace26';
import {ease, lerp, yc} from '../stage26';
import {camPoint} from '../../kit/ycam';

// B06-SH04 · G [1753, 1800) · "เงินน่ะไม่มีกลิ่นหรอก…" coin insert (SHEET-R1 part B). Close on the coin in Vespasian's fingers catching the lamp,
// slow push from 0.35 m to 0.30 m by L46; a lamp glint sweeps the coin face L4-L20. Nothing else in frame: the room behind (lamp light) and the
// five-finger 3D pinch with the 3D coin, its forearm drawn in the toga colour (UT14 exception). No ribbons, no caption.
// W5.2: the coin is held at the sheet's estimate (0.00, 1.36, 0.42), in front of his chest after the tap (not at Titus's nose): at 0.35 m from
// the nose mark Titus's face would fill the insert.
const N = 47;
const COIN = COIN_CHEST;
const camAt = (L: number) => yc(COIN[0] + 0.05, COIN[1] + 0.02, COIN[2] + lerp(0.35, 0.3, ease(L, 0, 46)), -2, -3, 1200);
const rig = () => {
  const r = vespRig(COIN);
  return {...r, arms3D: r.arms3D.map((a) => ({...a, handOnly: false, sleeve: '#efe9db'}))};
};
export const def: Shot26 = {
  id: 'B06-SH04', N, paper: PALACE_PAPER,
  cam: (L) => ({...camAt(L), near: 0.05}),
  paint: (p, L, c) => paintPalace(p, {...c, near: 0.3}, {mood: 'lamp'}),
  hands: (L, c) => [layer(c, pick3D(rig(), ['left'], 'left'))],
  fx: (L, c) => {
    // W5.3 polish: the white cuff band at the bottom edge, so the forearm matches the sleeve end seen in B06-SH03 (the 3D sleeve starts below frame)
    const e = ease(L, 0, 46), cuff = <div style={{position: 'absolute', left: lerp(372, 352, e), width: lerp(340, 340, e), bottom: 0, height: 90, background: 'linear-gradient(#e4dccb, #efe9db 35%)',
      borderTop: '3px solid #b9ae96', transform: 'skewX(-10deg)'}} />;
    if (L < 4 || L > 20) return cuff;
    const k = camPoint(c, COIN), s = ease(L, 4, 20);
    if (!k) return cuff;
    return <><div style={{position: 'absolute', left: lerp(372, 352, e), width: lerp(340, 340, e), bottom: 0, height: 90, background: 'linear-gradient(#e4dccb, #efe9db 35%)', borderTop: '3px solid #b9ae96', transform: 'skewX(-10deg)'}} /><div style={{position: 'absolute', left: k[0] - 160 + 220 * s, top: k[1] - 160 - 60 * s, width: 160, height: 160, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,246,214,0.95) 0%, rgba(255,226,150,0.5) 30%, rgba(255,220,140,0) 70%)', opacity: Math.sin(Math.PI * s), mixBlendMode: 'screen'}} /></>;
  },
};
export const shot = makeShot(def);
