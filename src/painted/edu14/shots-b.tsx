// EDU-EP14 B01 shots 6-9 (storyboard EDU-EP14-ROWS-R4.1): the no-air fall, the drop-eye descent (SP2), the bullet-time BB comparison and the hit.
import {camMove, camOf} from '../kit/cam-moves';
import {ell, washAt} from '../kit/draw';
import {poseArms} from '../kit/poses';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {Edge, CalmBand, Pool} from './look';
import {BBBall, Lbl, StingGlyph} from './diagram';
import {NoAirDial} from './gauge';
import {paintDrop14, REFRACT_NOAIR} from './drop';
import {GIRL, GIRL_AT} from './palette';
import {motionFig, paintBus, p30Fix} from './bus';
import {armYaw, bbAt, paintArmMacro, AM} from './armmacro';
import {paintFallVoid, FALL_DROP_AT} from './fallvoid';
import {eyeCam, kmRing, paintDropEye} from './lod';
import {defShot} from './frame';
import {FLINCH_ARM_HIT, flinchClutchForearm} from './girl-motions';
import {hump, lin, noairSH06, noairSH07, slamScale, sm} from './clock';
import {C} from './palette';

// ---- 6. S01-B01-SH06 [392, 458): fall follow, no-air sphere at 30 px/mm, G1 back in at 0 climbing to 350 at +65.
defShot('S01-B01-SH06', (L) => ({
  paint: (p) => { paintFallVoid(p, {L}); paintDrop14(p, FALL_DROP_AT, 30, {kind: 'sphere', size: 5}, {refract: REFRACT_NOAIR, seed: 30000}); },
  grade: 1,
  children: <><Edge color="#10181b" level={0.3} id="sh06edge" /><CalmBand level={0.45} id="sh06calm" /></>,
  overlay: <><Lbl /><NoAirDial v={noairSH06(L)} pop={lin(0, 4, L)} /></>,
}));

/** SH07 +94/+95: the dial steps up and right (46 px, 20 px) so its rim clears her raised hand, eased in over +92..+94 and out over +95..+97 (into the slam). */
const dialNudge = (L: number) => Math.min(lin(92, 94, L), 1 - lin(95, 97, L));
// ---- 7. S01-B01-SH07 [458, 565): the drop-eye descent. "1 กม." ring flicks past at +26, needle passes 500 at +43, slam 700 at +95 (R1 stops), hold, white frame at +106.
defShot('S01-B01-SH07', (L) => {
  const ring = kmRing(L), c = eyeCam(L);
  void c;
  return {
    paint: (p) => paintDropEye(p, L),
    grade: 1,
    children: <><Edge color="#10181b" level={0.3} id="sh07edge" /><CalmBand level={0.4} id="sh07calm" /></>,
    overlay: <>
      <Lbl />
      {ring && ring.r < 2400 && <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={960} r={ring.r} fill="none" stroke={C.ink} strokeWidth={16} strokeDasharray="46 30" />
        <circle cx={540} cy={960} r={ring.r} fill="none" stroke="#ffffff" strokeWidth={9} strokeDasharray="46 30" />
      </svg>}
      {ring && ring.r < 700 && <div lang="th" style={{position: 'absolute', left: 0, right: 0, top: Math.max(300, 960 - ring.r - 80), textAlign: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 800, fontSize: 64, color: '#fff', WebkitTextStroke: `9px ${C.ink}`, paintOrder: 'stroke fill'}}>1 กม.</div>}
      <NoAirDial v={noairSH07(L)} pop={1} slam={slamScale(L)} cx={790 + 46 * dialNudge(L)} cy={860 - 20 * dialNudge(L)} />
      {L >= 106 && <div style={{position: 'absolute', inset: 0, background: '#ffffff'}} />}
    </>,
  };
});

// ---- 8. S01-B01-SH08 [565, 644): bullet-time arc round the hero drop (5 mm) and the BB (6 mm) over her forearm; sting glyphs flash on "แสบ" (+24) and "ยิง" (+56).
defShot('S01-B01-SH08', (L) => {
  const g1 = hump(L, 24, 30), g2 = hump(L, 56, 62), bb = bbAt(L), s = (v: number) => Math.min(1, Math.sin(Math.PI * v) * 1.4);
  void armYaw;
  return {
    paint: (p) => paintArmMacro(p, {L}),
    grade: 1,
    children: <><Edge color="#10181b" level={0.3} id="sh08edge" /><CalmBand level={0.4} id="sh08calm" /></>,
    overlay: <>
      <Lbl />
      <BBBall x={bb[0]} y={bb[1]} r={(6 / 2) * AM.u} />
      <StingGlyph x={AM.drop[0] + 140} y={AM.drop[1] - 140} r={62} pop={s(lin(24, 30, L))} rot={12} /><StingGlyph x={bb[0] + 140} y={bb[1] - 140} r={62} pop={s(lin(24, 30, L))} rot={-8} />
      <StingGlyph x={AM.drop[0] + 140} y={AM.drop[1] - 140} r={62} pop={s(lin(56, 62, L))} rot={-10} /><StingGlyph x={bb[0] + 140} y={bb[1] - 140} r={62} pop={s(lin(56, 62, L))} rot={14} />
      {void g1}{void g2}
    </>,
  };
});

// ---- 9. S01-B01-SH09 [644, 686): time resumes: the drop hits her stung arm at +6 and she flinches (`flinch-clutch-forearm`); "โอ๊ย!" +9..+22; rub from +30.
export const camSH09 = (L: number): YCam => camOf(camMove([0.25, 0.95, 0.05], [6, 6], [1.4, 1.3], 1.0, {f: 1200, hy: 640, ease: [6 / 41, 9 / 41]}), L / 41);
defShot('S01-B01-SH09', (L) => {
  const c = camSH09(L), t = L / 30, hit = FLINCH_ARM_HIT;
  return {
    paint: (p) => {
      const mf = motionFig(c, flinchClutchForearm, t);
      paintBus(p, c, {world: 'noair', t: 0.4, face: 'neutral', ...mf, fig: mf.fig ?? p30Fix(c)});
      // the drop streaks down onto the forearm (+3..+6), one white flash at the contact (+6..+8), no mark
      const g = camPoint(c, GIRL_AT), u = camUnit(c, GIRL_AT), arm = g ? poseArms('P30', GIRL, g, u, 'front').lArm : undefined;
      if (g && arm && L >= hit - 3 && L <= hit + 2) {
        const mx = (arm.via![0] + arm.to[0]) / 2, my = (arm.via![1] + arm.to[1]) / 2;
        if (L < hit) { const k = lin(hit - 3, hit, L); washAt(p, 33000, '#ffffff', 230, ell(mx, my - 230 * (1 - k), 3, 40, 8), 0, 0); } else washAt(p, 33001, '#ffffff', 235 - 60 * (L - hit), ell(mx, my, 16 + 6 * (L - hit), 16 + 6 * (L - hit), 12), 0, 0);
      }
    },
    grade: 1,
    children: <><Pool cam={c} at={[-0.7, 1.4, -1.6]} r={520} color="#cfe6ee" level={0.5} id="sh09pool" /><Edge color="#10181b" level={0.4} id="sh09edge" /><CalmBand level={0.36} id="sh09calm" /></>,
    overlay: <Lbl />,
  };
});
void sm;
