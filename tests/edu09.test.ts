import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {macroSkeleton, paintHandMacro} from '../src/painted/kit/hands';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {boyHand, POV, povCam} from '../src/painted/edu09/handclose';
import {BOY_TONE, ELDER_TONE} from '../src/painted/edu09/palette';
import {pianistHand, DROP} from '../src/painted/edu09/piano';

// EDU-EP09-SHORT W3.1 look frames (brief EDU-EP09-BRIEF-R1.2): numeric checks behind the viewed stills out/edu09/look-frames/v1/.
const recorder = () => { const pts: Pt[] = []; const brush = new Proxy({}, {get: (_t, n) => (...a: unknown[]) => { if ((n === 'polygon' || n === 'spline') && Array.isArray(a[0])) for (const q of a[0] as Pt[]) pts.push(q); }}) as Brush; return {p: makePainter(brush, {t: 0, frame: 0}), pts}; };

test('VD26: macro hand skins equal their rig skins (user, 8 Nov 2026)', () => {
  assert.equal(BOY_TONE.skin, PEOPLE['boy-school'].head.skin);
  assert.equal(ELDER_TONE.skin, PEOPLE['man-elder'].head.skin);
});

test('VD07 CAM-POV R1.2: eye 36-40, r 26-30 at both ends; LF01 flat hand silhouette is at least 560 px wide', () => {
  for (const r of POV.r) assert.ok(r >= 26 && r <= 30, `r ${r}`);
  for (const e of POV.eye) assert.ok(e >= 36 && e <= 40, `eye ${e}`);
  const {p, pts} = recorder();
  paintHandMacro(p, povCam(0), {...boyHand('flat'), plane: undefined});
  const xs = pts.map((q) => q[0]);
  assert.ok(Math.max(...xs) - Math.min(...xs) >= 560, `width ${Math.round(Math.max(...xs) - Math.min(...xs))}`);
});

test('LF04 placeholder: the resting fingertips touch the key tops and the playing tip sits on its dropped key', () => {
  const sk = macroSkeleton(pianistHand('middle'));
  const pad = (f: 'index' | 'middle' | 'ring') => sk.fingers[f].joints[3][1] - sk.fingers[f].radii[3];
  assert.ok(Math.abs(Math.min(pad('index'), pad('ring'))) < 1e-6);
  assert.ok(pad('middle') <= 0 && pad('middle') >= -DROP - 0.5, `middle pad ${pad('middle').toFixed(2)}`);
});
