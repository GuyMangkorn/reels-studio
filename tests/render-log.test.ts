import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRenderLog} from '../scripts/render-log.mjs';

test('render logs persist stages immediately and summarize a successful run once', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'render-log-'));
  try {
    const log = createRenderLog({tool: 'test', ids: ['EG-EP01-SHORT'], gl: 'angle'}, dir);
    const events = () => readFileSync(log.file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.equal(events()[0].event, 'start');
    assert.equal(events()[0].gl, 'angle');
    assert.equal(await log.time('scene', async () => 42, {scene: 2}), 42);
    assert.equal(events()[1].event, 'stage-start');
    const stage = events().find(e => e.event === 'stage');
    assert.equal(stage.stage, 'scene');
    assert.equal(stage.scene, 2);
    assert.ok(stage.elapsedMs >= 0);
    log.event('cache', {rendered: 1, reused: 2});
    log.finish();
    log.finish();
    const end = events().at(-1);
    assert.equal(end.event, 'finish');
    assert.equal(end.status, 'ok');
    assert.ok(end.elapsedMs >= end.stages.scene);
    assert.equal(events().filter(e => e.event === 'finish').length, 1);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('a failed stage retains the original error and writes a failed run summary', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'render-log-'));
  try {
    const log = createRenderLog({tool: 'test', ids: ['EG-EP01-SHORT'], gl: 'swangle'}, dir);
    const error = new Error('render failed');
    await assert.rejects(log.time('scene', async () => { throw error; }), e => e === error);
    log.finish(error);
    const rows = readFileSync(log.file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.equal(rows[2].status, 'error');
    assert.equal(rows[2].error, 'render failed');
    assert.equal(rows.at(-1).status, 'error');
    assert.equal(rows.at(-1).error, 'render failed');
    const other = createRenderLog({tool: 'test', ids: ['EG-EP01-SHORT'], gl: 'angle'}, dir);
    assert.notEqual(log.file, other.file);
    other.finish();
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('non-Error thrown values are still recorded as failures', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'render-log-'));
  try {
    const log = createRenderLog({tool: 'test', ids: ['EG'], gl: 'angle'}, dir);
    try { await log.time('scene', () => { throw null; }); } catch (error) { log.finish(error); }
    const rows = readFileSync(log.file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.equal(rows.find(e => e.event === 'stage').status, 'error');
    assert.equal(rows.at(-1).status, 'error');
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('a recovered best-effort failure is visible in the final summary', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'render-log-'));
  try {
    const log = createRenderLog({tool: 'test', ids: ['EG'], gl: 'angle'}, dir);
    log.event('warning', {stage: 'archive', exitCode: 1, error: 'store unavailable'});
    log.finish();
    const rows = readFileSync(log.file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.equal(rows.at(-1).status, 'warning');
    assert.equal(rows.at(-1).warnings, 1);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});
