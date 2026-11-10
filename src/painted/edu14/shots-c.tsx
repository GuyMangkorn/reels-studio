// EDU-EP14 B02 shots 10-12 (storyboard EDU-EP14-ROWS-R4.1): the colour replay of the cloud macro, the fall down the condo facade and the road rider with the split dial.
import {hash} from '../kit/hash';
import {paintFall} from '../kit/fall';
import {ell, washAt, hardFill} from '../kit/draw';
import {type YCam} from '../kit/ycam';
import {camPoint} from '../kit/ycam';
import {Edge, CalmBand} from './look';
import {Arrow, Ring, RealDial} from './diagram';
import {SplitDial} from './gauge';
import {paintDrop14, REFRACT_REAL} from './drop';
import {C} from './palette';
import {paintBus} from './bus';
import {paintCloudMacro} from './cloudmacro';
import {fallCam, paintFallFacade} from './facade';
import {paintRider} from './rider';
import {defShot} from './frame';
import {downArrow, lin, realSH11, riderX, scrollOffset, scrollSpeed, sm, splitA, splitB, upArrow} from './clock';

// ---- 10. S01-B02-SH01 [686, 751): hard cut to colour on +0 (shot 4 replayed, hero shifted +7); lets go on "โลกจริง" (+24), gone +36.
defShot('S01-B02-SH01', (L) => ({
  paint: (p) => paintCloudMacro(p, {L, world: 'real', shift: 7}),
  children: <><Edge color="#10181b" level={0.3} id="b2sh01edge" /><CalmBand level={0.55} id="b2sh01calm" /></>,
}));

// ---- 11. S01-B02-SH02 [751, 929): fall follow down a condo facade (real). Scroll speeds up through C11, constant from +119; arrows; real dial holds 32 from +148; street +156.
export const camSH11 = (): YCam => fallCam(0.15);
export const SH11_DROP: [number, number] = [540, 700];
defShot('S01-B02-SH02', (L) => {
  const c = camSH11(), off = scrollOffset(L), pxOff = off * 195, up = upArrow(L), dn = downArrow(L), street = sm(156, 177, L);
  return {
    paint: (p) => {
      paintFallFacade(p, c, off);
      // speed streaks and rain round the drop (relative to the falling camera everything rises)
      p.inkStill(50050, 'pen', '#e9eef0', 1.3);
      const v = scrollSpeed(L);
      for (let i = 0; i < 46; i++) { const x = (i * 97 + Math.round(hash(50060 + i) * 90)) % 1080, len = (140 + hash(50300 + i) * 360) * (0.4 + 0.6 * v), y0 = ((hash(50200 + i) * 1900 - pxOff * 1.6) % 2300 + 2300) % 2300 - 200; p.brush.line(x, y0, x + 2, y0 - len); }
      paintFall(p, 'rain', {width: 1080, height: 1920, t: L / 30, captionBand: [1176, 1344], style: {count: 36, fall: [-900, -500], drift: [-10, 10], len: [120, 240], color: '#dfe9ee', weight: 1.4}});
      paintDrop14(p, SH11_DROP, 8, {kind: 'sphere', size: 5}, {refract: REFRACT_REAL, seed: 35000});
      if (street > 0) { // the street appears at the bottom: asphalt, kerb line, a roof or two
        const y = 1920 - 430 * street;
        hardFill(p, 35100, '#3f4448', [[-20, y], [1100, y], [1100, 1940], [-20, 1940]]);
        hardFill(p, 35101, '#b4473c', [[-20, y], [1100, y], [1100, y + 18], [-20, y + 18]]);
        for (let i = 0; i < 5; i++) washAt(p, 35110 + i, i % 2 ? '#c49a5a' : '#4f7f80', 255, [[40 + i * 210, y + 40], [200 + i * 210, y + 40], [200 + i * 210, y + 160], [40 + i * 210, y + 160]], 0, 0);
        washAt(p, 35120, '#e8b765', 90, ell(540, y + 260, 360, 40, 20), 0, 0);
      }
    },
    children: <><Edge color="#10181b" level={0.3} id="sh11edge" /><CalmBand level={0.7} id="sh11calm" /></>,
    overlay: <>
      {up > 0 && <Arrow x={SH11_DROP[0]} y0={SH11_DROP[1] + 215} len={up} dir="up" color={C.white} />}
      {dn > 0 && <Arrow x={SH11_DROP[0]} y0={SH11_DROP[1] - 215} len={dn} dir="down" color={C.amber} label="น้ำหนัก" />}
      <Ring x={SH11_DROP[0]} y={SH11_DROP[1]} d={100} />
      <RealDial a={realSH11(L)} />
    </>,
  };
});

// ---- 12. (the rider (z 3.2) paints in the set's road slot, behind the near poles, shelter posts and bin (z <= 1.22), not over them: user fix 10 Nov 2026)
// ---- (rider crosses left -> right: the sheet's yaw 205->155 pans the other way, so the camera tracks him with the sign that matches the staging; the girl sits at world x +0.35 = the left edge looking at the road)
// ---- S01-B02-SH03 [929, 1039): from inside the shelter, the rider tucks past (centre +54), G2 split dial: needle A 32 on "สามสิบ" (+54), needle B about 20 (+65..+98).
export const camSH12 = (L: number): YCam => {
  const bearing = Math.atan2(riderX(L), 3.8); // rad, + = rider on world +x (screen-left)
  return {x: 0, y: 1.1, z: -0.6, yaw: Math.PI - 0.75 * bearing, f: 1100, hy: 760};
};
defShot('S01-B02-SH03', (L) => {
  const c = camSH12(L), rx = riderX(L);
  return {
    paint: (p) => paintBus(p, c, {world: 'real', t: L / 30 + 0.7, pose: 'P01', view: 'back', face: 'neutral', at: [0.35, 0, -0.1], fig: undefined, rain: 200,
      road: (q, cc) => { if (L >= 19 && L <= 91) paintRider(q, cc, {at: [rx, 0, 3.2], t: L / 30}); }}),
    children: <><Edge color="#10181b" level={0.3} id="sh12edge" /><CalmBand level={0.45} id="sh12calm" /></>,
    overlay: <SplitDial a={splitA(L)} b={splitB(L)} showA={L >= 5} showB={L >= 65} />,
  };
});
void lin; void camPoint;
