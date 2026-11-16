import {staticFile} from 'remotion';
import {FpovPost, fpovPushTo500, fpovScreenQuad, paintFpovPhone, type Quad} from '../fpov';
import {SHARE_STEPS_B02, SHARE_STEPS_B06, shareAt} from '../Post';
import {k01, makeShot, outCubic, type Frame} from '../shotkit';
import type {Pass} from '../stack';

// EDU-EP18-SHORT FPOV post shots (Editor W5 draft): B02-SH02, B06-SH02, B06-SH03 (the cards of w5-cards.tsx as timeline shots).
const photo = staticFile('edu18/post-photo-B02-SH01-L29.png');
type Spec = {quad: (L: number) => Quad; shares: (L: number) => number; rise?: (L: number) => number; paper: string};
const fpov = (id: string, s: Spec) => makeShot(id, (L): Frame => {
  const q = s.quad(L);
  const back: Pass = (p) => { paintFpovPhone(p, q); };
  return {paper: s.paper, back, overlay: <FpovPost quad={q} shares={s.shares(L)} photo={photo} rise={s.rise?.(L)} />};
});
export const B02_SH02 = fpov('B02-SH02', {quad: (L) => fpovScreenQuad(k01(L, 0, 56)), shares: (L) => (L < 14 ? 0 : shareAt(SHARE_STEPS_B02, (L - 14) / 30, 40 / 30)), rise: (L) => k01(L, 4, 10, outCubic), paper: '#cdb894'});
export const B06_SH02 = fpov('B06-SH02', {quad: (L) => fpovScreenQuad(k01(L, 0, 69)), shares: (L) => (L < 14 ? SHARE_STEPS_B06[0] : shareAt(SHARE_STEPS_B06, (L - 14) / 30, 55 / 30)), paper: '#3a2c26'});
export const B06_SH03 = fpov('B06-SH03', {quad: (L) => fpovPushTo500(k01(L, 0, 16, outCubic), 1 + 0.03 * k01(L, 16, 86, (x) => x)), shares: () => SHARE_STEPS_B06[SHARE_STEPS_B06.length - 1], paper: '#3a2c26'});
