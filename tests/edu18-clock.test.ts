import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clockOf, FALL_REPLAY, SH04, SH14, SH16, SHOT_TABLE, sh14TickFrame, sh16Clock, sh17Fall, SH17, SH17_V1, TOTAL_FRAMES, shotAt} from '../src/painted/edu18/clock';
import {balanceAngle} from '../src/painted/edu18/balance';
import {tickY} from '../src/painted/edu18/ruler';
import {BUN_SM, SM_PER_MM, K_SM} from '../src/painted/edu18/macro';
import {contactGap, dimpleDepth, FACE, passengerY} from '../src/painted/edu18/dropcontact';
import {otVisible, visibleAt} from '../src/painted/edu18/labels';
import {d0Y, D0_C17, mosq04} from '../src/painted/edu18/shots';
import {BUN_SM as B2} from '../src/painted/edu18/macro';

test('EDU-EP18 shot table is contiguous and sums to 1468 f (ROWS-R2.0)', () => {
  let at = 0;
  for (const [, a, n] of SHOT_TABLE) { assert.equal(a, at); at += n; }
  assert.equal(at, TOTAL_FRAMES);
  assert.equal(TOTAL_FRAMES, 1468);
  assert.equal(shotAt(1467)?.id, 'S01-B05-SH06');
});

test('SH14 freeze: both clocks hold over +65..+107, ticks arrive on the 5.4 f cadence', () => {
  const at = clockOf('S01-B04-SH01', SH14.freezeAt);
  for (let L = SH14.freezeAt; L <= 107; L++) {
    const k = clockOf('S01-B04-SH01', L);
    assert.equal(k.ev, at.ev); assert.equal(k.amb, at.amb); assert.equal(k.frozen, true);
  }
  assert.equal(clockOf('S01-B04-SH01', 64).frozen, false);
  assert.ok(clockOf('S01-B04-SH01', 40).ev > clockOf('S01-B04-SH01', 20).ev);
  assert.equal(sh14TickFrame(20), 65);
  assert.ok(Math.abs(tickY(20, SH14.freezeAt, 0)) < 0.1, 'tick 20 sits at the drop face at the freeze');
});

test('SH16 rewind: frozen on SH04 +31, reverse to +17, replay from +25', () => {
  assert.equal(sh16Clock(0).ev, SH04.gone);
  assert.equal(sh16Clock(SH16.frozenTo).ev, SH04.gone);
  assert.equal(sh16Clock(12).ev, 31);
  assert.equal(Math.round(sh16Clock(24).ev), 17);
  for (let L = 13; L <= 24; L++) assert.ok(sh16Clock(L).ev < sh16Clock(L - 1).ev, 'strictly reverse');
  assert.equal(sh16Clock(25).src, 'S01-B05-SH01');
});

test('SH17 lands on the puddle at +72 (f1167) at 6.33 sm/f and never goes backwards (D4-17)', () => {
  assert.deepEqual([...SH17.ramp], [52, 72]);
  assert.ok(Math.abs(SH17_V1 - 6.33) < 0.01);
  assert.ok(Math.abs(sh17Fall(87) - SH17.landS) < 1e-6);
  assert.ok(Math.abs(sh17Fall(SH17.ramp[1]) - SH17.landS) < 1e-6);
  assert.ok(Math.abs(sh17Fall(0) - FALL_REPLAY * 90) < 1e-9);
  for (let L = 1; L < 88; L++) assert.ok(sh17Fall(L) >= sh17Fall(L - 1));
});

test('N8 balance: level before +4, settled by +45', () => {
  assert.equal(balanceAngle(0), 0);
  assert.ok(Math.abs(balanceAngle(45)) < 0.6);
});

test('N2 drop contact: R04 gap inside 0.02 sm, dimple eases to 0.08 sm, bun size in M', () => {
  assert.ok(contactGap(passengerY(3), 3) <= FACE.tol);
  assert.equal(dimpleDepth(0, 5), 0);
  assert.ok(Math.abs(dimpleDepth(20, 5) - FACE.dimple) < 1e-9);
  assert.ok(Math.abs(BUN_SM.w - 6.2 * SM_PER_MM) < 0.6 && K_SM === 405);
  assert.ok(Math.abs(B2.bottom + 0.88) < 0.02);
});

test('SH04: the mosquito is carried under the face from +17 within R04 and flies free after +40', () => {
  assert.ok(mosq04(16).state === 'hover' && mosq04(20).state === 'pressed' && mosq04(50).state === 'clear');
  assert.ok(Math.abs(d0Y(SH04.contact) - D0_C17) < 1e-9);
  assert.ok(Math.abs(d0Y(SH04.contact + 1) - D0_C17 + 0.3) < 1e-9);
});

test('N13 labels: windows are global frames', () => {
  assert.ok(!otVisible('OT01', 37) && otVisible('OT01', 38) && !otVisible('OT01', 1183));
  assert.deepEqual(visibleAt(100).sort(), ['OT01', 'OT02']);
});
