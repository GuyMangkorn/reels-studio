import assert from 'node:assert/strict';
import test from 'node:test';
import {breakLines, firstBaseline, labelHeight} from '../src/assets/visuals/textLayout';

const graphemes = new Intl.Segmenter('th', {granularity: 'grapheme'});
const words = new Intl.Segmenter('th', {granularity: 'word'});
const measure = (text: string, size: number) => Array.from(graphemes.segment(text)).length * size;

test('breaks Thai text only at word boundaries', () => {
  const text = 'เลือกอย่างน้อยหนึ่งแบบ 9 ตัว';
  const lines = breakLines(text, 12 * 10, 10, measure);
  assert.ok(lines.length > 1);
  const known = new Set(Array.from(words.segment(text), part => part.segment));
  for (const line of lines) for (const part of words.segment(line)) assert.ok(known.has(part.segment), `${part.segment} split mid-word`);
  assert.equal(lines.join('').replace(/\s+/g, ''), text.replace(/\s+/g, ''));
});

test('keeps short text on one line and honours explicit newlines', () => {
  assert.deepEqual(breakLines('มีที่ซ่อน', 1000, 10, measure), ['มีที่ซ่อน']);
  assert.equal(breakLines('ก\nข', 1000, 10, measure).length, 2);
});

test('never starts a line with punctuation', () => {
  const lines = breakLines('กรอบสี่เหลี่ยม vs แบบเทียบ: ไม่พบความต่าง', 22 * 10, 10, measure);
  for (const line of lines) assert.doesNotMatch(line, /^[:•≠]/u);
});

test('splits an over-wide single word by grapheme as a last resort', () => {
  const lines = breakLines('abcdefghij', 50, 10, measure);
  assert.ok(lines.length > 1);
  assert.ok(lines.every(line => measure(line, 10) <= 50));
});

test('box height grows with lines and the text block is centred', () => {
  assert.ok(labelHeight(2, 36, 18) > labelHeight(1, 36, 18));
  assert.ok(firstBaseline(100, 100, 2, 36) < firstBaseline(100, 100, 1, 36));
});
