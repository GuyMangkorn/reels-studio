import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {FALL, fallMarks, paintFall, type FallKind} from '../src/painted/kit/fall';
import {fogPuffs, paintFogBank, paintFogCone, paintHalo} from '../src/painted/kit/fog';
import {makePainter} from '../src/painted/kit/painter';
import {paintSkyBands, paintSkyDisc, skyBandColors} from '../src/painted/kit/sky';
import * as kitSea from '../src/painted/kit/sea';
import * as sea from '../src/painted/sea';

const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {log, p: makePainter(brush, {t: 0, frame: 0})};
};
const KINDS = Object.keys(FALL) as FallKind[];
const frame = {width: 1080, height: 1920};

test('sky bands run from the top colour to the horizon colour, through `via`', () => {
  assert.deepEqual(skyBandColors({from: '#000000', to: '#ffffff', bands: 3}), ['#000000', '#808080', '#ffffff']);
  const three = skyBandColors({from: '#000000', via: '#ff0000', viaAt: 0.5, to: '#ffffff', bands: 3});
  assert.equal(three[1], '#ff0000');
});

test('sky, disc, fog and halo paint deterministically', () => {
  const run = () => {
    const {log, p} = recorder();
    paintSkyBands(p, {from: '#1a1f26', to: '#33262a', horizon: 900, width: 1080});
    paintSkyBands(p, {from: '#1a1f26', to: '#33262a', horizon: 900, width: 1080, style: 'flat'});
    paintSkyDisc(p, {x: 700, y: 400, r: 60, color: '#efe6cf', t: 1.5});
    paintFogBank(p, {y: 1100, height: 260, width: 1080, color: '#9aa3a6', t: 2});
    paintFogCone(p, {x: 300, y: 700, angle: 0.6, length: 900, spread: 0.25, color: '#d8c9a0', level: 1});
    paintHalo(p, {x: 540, y: 600, r: 220, color: '#c9b08a', t: 2});
    return log;
  };
  const a = run();
  assert.ok(a.length > 20);
  assert.deepEqual(run(), a);
  assert.ok(a.every((l) => !l.includes('NaN') && !l.includes('null')), 'no NaN or missing coordinates');
});

test('a dark fog cone or halo paints nothing', () => {
  const {log, p} = recorder();
  paintFogCone(p, {x: 0, y: 0, angle: 0, length: 100, spread: 0.2, color: '#ffffff', level: 0});
  paintHalo(p, {x: 0, y: 0, r: 100, color: '#ffffff', level: 0});
  assert.equal(log.length, 0);
});

test('fog puffs drift and wrap inside the padded width', () => {
  const at = (t: number) => fogPuffs({y: 1000, height: 200, width: 1080, t});
  assert.notDeepEqual(at(0), at(3));
  for (const t of [0, 7, 400]) assert.ok(at(t).every(([x]) => x >= -300 && x <= 1080 + 300));
});

test('every fall kind stays near the frame, moves with t, and is pure', () => {
  for (const kind of KINDS) {
    for (const t of [0, 1.7, 33.3, 600]) {
      const m = fallMarks(kind, {...frame, t});
      assert.deepEqual(fallMarks(kind, {...frame, t}), m, `${kind} pure`);
      assert.ok(m.every((k) => k.x > -400 && k.x < 1500 && k.y >= -120 && k.y <= 1920 + 120), `${kind} in frame at ${t}`);
    }
    assert.notDeepEqual(fallMarks(kind, {...frame, t: 0}), fallMarks(kind, {...frame, t: 0.5}), `${kind} moves`);
  }
});

test('the caption band keeps about a third of its marks', () => {
  const inBand = (on: boolean) => {
    let n = 0;
    for (let t = 0; t < 20; t += 0.5) n += fallMarks('snow', {...frame, t, captionBand: on ? undefined : null}).filter((m) => m.y > 860 && m.y < 1248).length;
    return n;
  };
  const ratio = inBand(true) / inBand(false);
  assert.ok(ratio > 0.2 && ratio < 0.5, `kept ${ratio.toFixed(2)}`);
});

test('rain falls fast and slants with the wind; bubbles rise', () => {
  const rain = fallMarks('rain', {...frame, t: 1, captionBand: null});
  assert.ok(rain.every((m) => m.y2 > m.y && m.x2 < m.x), 'rain streaks point down and left');
  const b0 = fallMarks('bubbles', {...frame, t: 0, captionBand: null}), b1 = fallMarks('bubbles', {...frame, t: 0.1, captionBand: null});
  assert.ok(b1.filter((m, i) => m.y < b0[i].y).length > b1.length * 0.8, 'bubbles rise');
});

test('seeds separate two layers of the same kind; paintFall draws one line per mark', () => {
  assert.notDeepEqual(fallMarks('snow', {...frame, t: 2}), fallMarks('snow', {...frame, t: 2, seed: 1}));
  const {log, p} = recorder();
  paintFall(p, 'dust', {...frame, t: 3});
  assert.equal(log.filter((l) => l.startsWith('line')).length, fallMarks('dust', {...frame, t: 3}).length);
});

test('kit/sea re-exports the sea module unchanged', () => {
  assert.equal(kitSea.paintRain, sea.paintRain);
  assert.equal(kitSea.paintWater, sea.paintWater);
});
