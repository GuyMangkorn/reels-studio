import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {drawMosquito, minAnchorHeight, MOSQ_BEAT_HZ, MOSQ_BL_SM, mosqReachBelow, wingAngle, type MosqOpts} from '../src/painted/edu18/mosquito';

// EDU-EP18 `new: mosquito` card (brief EDU-EP18-BRIEF-R1.2 N1, SP2; storyboard R04).
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {painter: (t = 0) => makePainter(brush, {t, frame: 0}), log};
};
const G: Pt = [540, 900];
const draw = (o: MosqOpts, len = 400, t = 0) => { const r = recorder(); const m = drawMosquito(r.painter(t), G, len, {...o, t}); return {m, log: r.log.join('\n')}; };

test('mosquito card: every state and view draws, deterministically', () => {
  for (const view of ['left', 'right', 'below'] as const) for (const state of ['hover', 'pressed', 'tip', 'clear'] as const) {
    const a = draw({view, state}), b = draw({view, state});
    assert.ok(a.log.length > 0, `${view} ${state}`);
    assert.equal(a.log, b.log, `${view} ${state} repeatable`);
    assert.equal(a.m.toes.length, 6, `${view} ${state}: six legs`);
  }
});

test('mosquito card: the anchor is the body midpoint and len is the head-to-tail length', () => {
  for (const len of [50, 843]) {
    const {m} = draw({view: 'left', state: 'pressed'}, len);
    assert.ok(Math.abs(Math.hypot(m.head[0] - m.tail[0], m.head[1] - m.tail[1]) - len) < 0.01 * len, `span at ${len}`);
    assert.ok(Math.abs((m.head[0] + m.tail[0]) / 2 - G[0]) < 0.01 * len, `midpoint at ${len}`);
    assert.ok(m.head[0] < m.tail[0], 'left view: head toward screen left');
  }
});

test('mosquito wingbeat runs on the 1.3 Hz ambient clock; a folded wing does not beat', () => {
  const at = (t: number, state: 'hover' | 'pressed') => draw({view: 'right', state, blur: false}, 400, t).log;
  assert.ok(Math.abs(wingAngle(0) - wingAngle(1 / MOSQ_BEAT_HZ)) < 1e-9, 'one period = 1 / 1.3 s');
  assert.notEqual(at(0, 'hover'), at(0.2, 'hover'));
  assert.equal(at(0, 'pressed'), at(0.2, 'pressed'));
});

test('R04: the hover card clears the water by 1.0 sm when its anchor is at minAnchorHeight', () => {
  const below = mosqReachBelow('hover');
  assert.ok(below > 1 && below < 2, `hover legs hang ${below} bl`);
  const {m} = draw({view: 'right', state: 'hover'}, 100);
  assert.ok(Math.abs((m.bottom - G[1]) / 100 - below) < 0.03, 'drawn reach matches the guard');
  assert.ok(minAnchorHeight('hover', MOSQ_BL_SM, 1.0) >= 1.0 + below * MOSQ_BL_SM - 1e-9);
  // B05-SH04/SH05: hovering 15 cm (60.75 sm) above the puddle is far clear
  assert.ok(60.75 > minAnchorHeight('hover', MOSQ_BL_SM, 1.0));
});
