// EDU-EP16 SHEET-R1.5b look frames (Film, W3): the redesigned river suspense 16C/16D on the real RIV geometry and Boss's kit
// (beast-trex stalk/sniff/turn, river-r3 B1/RD/FC/shade, trex-fx vapour). Stills only:
//   sh scripts/edu-series/ep16/looks-r15/render.sh  -> out/ep16/r15/looks/<ID>.png
import type {CSSProperties} from 'react';
import {Painted, FONT} from '../../../../src/painted/survival/frame';
import {paintRiver} from '../../../../src/painted/survival/river';
import {boulderItem, fernRowItems, reedBedItems, riverLightAt, shadeAt} from '../../../../src/painted/survival/river-r3';
import {beastSlabs} from '../../../../src/painted/survival/beast-sort';
import {paintBeast} from '../../../../src/painted/survival/beast';
import {vapourItem} from '../../../../src/painted/survival/trex-fx';
import {paintCast} from '../../../../src/painted/survival/cast';
import {kneeLevel, waterlineItem} from '../../../../src/painted/survival/water';
import type {Painter} from '../../../../src/painted/kit/painter';
import type {YCam} from '../../../../src/painted/kit/ycam';
import {G1, RIVER_X0, LOOKS, stateOf, type Look} from './shots';

const tag: CSSProperties = {position: 'absolute', left: 30, top: 150, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#fff', WebkitTextStroke: '5px rgba(20,20,20,0.7)', paintOrder: 'stroke fill'};
export const FRAMES: Record<string, () => JSX.Element> = {};

/** Vapour age 0..1 at shot-local frame `t` for sniffs at 16C +28/+40 (12 f puffs), or -1. */
const vapAt = (l: Look) => { if (l.shot !== '16C') return -1; for (const s of [28, 40]) { const a = l.t - s; if (a >= 0 && a < 12) return Math.max(0.3, a / 12); } return -1; };

const make = (l: Look, label = true, noRex = false) => () => {
  const st0 = stateOf(l), st = noRex ? {...st0, rex: undefined} : st0, L = riverLightAt(shadeAt(st.f));
  return <Painted band={false} paper="#cfdcc4" paint={(p) => {
    const items = [];
    if (st.rex) {
      items.push(...beastSlabs(st.c, st.rex.B, st.rex.place, 4));
      const v = vapAt(l);
      if (v >= 0) {
        const a = paintBeast(null, st.c, st.rex.B, st.rex.place), n = a.toWorld(st.rex.B.joints['nostril.L.pivot']);
        const dx = G1[0] - n[0], dz = G1[2] - n[2], d = Math.hypot(dx, dz);
        items.push(vapourItem(n, [dx / d, dz / d], v, {scale: 1.4}));
      }
    }
    if (st.K) {
      const K = st.K;
      items.push({at: K.at, draw: (q: Painter, cc: YCam) => { paintCast(q, cc, 'K', {at: K.at, facing: K.facing, pose: K.pose, face: K.face, t: st.f / 30, shadow: false, ...(K.mouth ? {activity: K.mouth} : {})} as any); }}, waterlineItem(K.at, K.level ?? kneeLevel('K'), {L, t: st.f / 30}));
    }
    paintRiver(p, st.c, {t: st.f / 30, light: L, x0: RIVER_X0, extra: [boulderItem(L), ...reedBedItems(L, {t: st.f / 30}), ...fernRowItems(L, {t: st.f / 30, shake: st.shake, part: st.part, centre: st.partCentre}), ...items]});
  }}>{label && <div style={tag}>{l.label}</div>}</Painted>;
};
for (const l of LOOKS) { FRAMES[l.id] = make(l); FRAMES[`${l.id}-CLEAN`] = make(l, false); FRAMES[`${l.id}-NOREX`] = make(l, false, true); }
