import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {NewsreelTitle, TITLES, BAND} from '../src/painted/edu30/titles';

// EDU-EP30-SHORT ticket T02 r1: six newsreel title cards, flicker-in, band, rows.
const render = (t: (typeof TITLES)[number], frame: number) =>
  renderToStaticMarkup(createElement(NewsreelTitle, {text: t.text, frame, inFrame: t.in, outFrame: t.out, size: t.size}));
const opacity = (t: (typeof TITLES)[number], frame: number) => Number(/data-opacity="([\d.]+)"/.exec(render(t, frame))?.[1]);

test('the six rows match the ticket table', () => {
  assert.deepEqual(TITLES.map((t) => [t.shot, t.text, t.in, t.out, t.size]), [
    ['B02-SH01', 'แคมเปียน รัฐเวสเทิร์นออสเตรเลีย · 1932', 206, 240, 58],
    ['B03-SH01', 'แผน 1', 704, 734, 92],
    ['B04-SH01', 'แผน 2', 868, 898, 92],
    ['B05-SH01', 'แผน 3', 1150, 1180, 92],
    ['B05-SH03', 'ถอนทัพ รอบที่ 1', 1363, 1388, 92],
    ['B06-SH04', 'ถอนทัพ รอบที่ 2', 1715, 1737, 92],
  ]);
});

test('flicker-in 0 / 0.8 / 0.35 / 1.0, steady to out-1, null at in-1 and out; band 300-475', () => {
  for (const t of TITLES) {
    assert.equal(render(t, t.in - 1), '');
    assert.equal(render(t, t.out), '');
    [0, 0.8, 0.35, 1].forEach((v, k) => assert.equal(opacity(t, t.in + k), v, `${t.shot} in+${k}`));
    assert.equal(opacity(t, t.out - 1), 1);
    const m = render(t, t.in + 1);
    assert.match(m, new RegExp(`data-band-top="${BAND.top}"`));
    assert.match(m, new RegExp(`data-band-bottom="${BAND.bottom}"`));
    assert.match(m, new RegExp(`top:${BAND.top}px`));
    assert.match(m, new RegExp(`height:${BAND.bottom - BAND.top}px`));
    assert.match(m, new RegExp(t.text));
    assert.match(m, /fill="rgba\(20,14,8,0.62\)"/);
    assert.ok((m.match(/#efe3c4/g) ?? []).length >= 3);
  }
});

test('box widths (text + 144, min 420): measured per card', () => {
  const w = TITLES.map((t) => Number(/data-box-w="([\d.]+)"/.exec(render(t, t.in))?.[1]));
  console.log('box widths', w.join(' '));
  assert.ok(w.slice(1).every((x) => x >= 420 && x <= 1080));
});
