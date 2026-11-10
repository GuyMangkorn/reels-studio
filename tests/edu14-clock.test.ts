import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dropEyeAltitude, noairSH02, noairSH06, noairSH07, realSH11, shotAt, splitA, splitB, SHOT_TABLE, TOTAL_FRAMES, upArrow, downArrow} from '../src/painted/edu14/clock';

// EDU-EP14 clocks against the storyboard EDU-EP14-ROWS-R4.1 acceptance table.
const near = (v: number, want: number, tol: number, msg: string) => assert.ok(Math.abs(v - want) <= tol, `${msg}: ${v} vs ${want}`);

test('shot table is contiguous and ends at 1815 f', () => {
  let at = 0;
  for (const [, s, n] of SHOT_TABLE) { assert.equal(s, at); at += n; }
  assert.equal(at, TOTAL_FRAMES);
  assert.equal(shotAt(553)!.id, 'S01-B01-SH07');
  assert.equal(shotAt(553)!.L, 95);
  assert.equal(shotAt(686)!.id, 'S01-B02-SH01');
});

test('SP2 drop-eye altitude: 1150 m, 1000 m at +26, ~30 m at +76, 2.40 m at +95, strictly decreasing', () => {
  near(dropEyeAltitude(0), 1150, 0.5, 'h0'); near(dropEyeAltitude(26), 1000, 0.5, 'h26'); near(dropEyeAltitude(76), 30, 0.5, 'h76'); near(dropEyeAltitude(95), 2.4, 0.01, 'h95');
  for (let L = 1; L <= 95; L++) assert.ok(dropEyeAltitude(L) < dropEyeAltitude(L - 1), `monotonic at ${L}`);
});

test('no-air dial: snap on "เจ็ดร้อย", rewind, 175 at SH06 +32.5, 500 at SH07 +43, 700 at +95', () => {
  assert.equal(noairSH02(75), 0); assert.equal(noairSH02(80), 700); assert.equal(noairSH02(90), 700); assert.equal(noairSH02(103), 0);
  near(noairSH06(32.5), 175, 1, 'SH06 +32.5'); near(noairSH06(65), 350, 0.01, 'SH06 +65');
  near(noairSH07(0), noairSH06(65) + 7, 8, 'SH07 starts where SH06 ends'); near(noairSH07(43), 500, 0.01, '500'); near(noairSH07(95), 700, 0.01, '700'); assert.equal(noairSH07(106), 700);
});

test('real dial holds 32 from +148; split needles A 32 at +54, B ~20 at +98; arrows equal at +119', () => {
  near(realSH11(148), 32, 1e-9, 'hold'); assert.equal(realSH11(170), 32); assert.ok(realSH11(30) > 32 * 0.4, 'fast start');
  near(splitA(54), 32, 1e-9, 'A'); near(splitB(98), 20, 1e-9, 'B'); assert.equal(splitB(64), 0);
  near(upArrow(119), 140, 1e-9, 'up'); near(downArrow(119), 140, 1e-9, 'down'); assert.equal(downArrow(100), 0);
});
