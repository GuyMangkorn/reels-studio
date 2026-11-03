// Persistent per-run JSONL timing for render.mjs and storyboard-page/clips.mjs.
// Logs live in out/logs/render-<tool>-<time>-<uuid>.jsonl; each event is written immediately.
// `gl` records the requested backend, not the detected GPU. No finish event means the run was interrupted.
import {appendFileSync, mkdirSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import path from 'node:path';

export const createRenderLog = (metadata, directory = 'out/logs') => {
  mkdirSync(directory, {recursive: true});
  const started = performance.now();
  const stages = {};
  let finished = false, warnings = 0;
  const stamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
  const file = path.join(directory, `render-${metadata.tool}-${stamp}-${randomUUID().slice(0, 8)}.jsonl`);
  const event = (name, details = {}) => {
    if (name === 'warning') warnings++;
    appendFileSync(file, JSON.stringify({...details, event: name, at: new Date().toISOString()}) + '\n');
  };
  event('start', {...metadata, pid: process.pid});
  console.log(`Render log: ${file} (gl=${metadata.gl})`);
  const time = async (stage, work, details = {}) => {
    event('stage-start', {...details, stage});
    const start = performance.now();
    let failure, failed = false;
    try { return await work(); } catch (error) { failed = true; failure = error; throw error; } finally {
      const elapsedMs = +(performance.now() - start).toFixed(2);
      stages[stage] = +((stages[stage] ?? 0) + elapsedMs).toFixed(2);
      event('stage', {...details, stage, elapsedMs, status: failed ? 'error' : 'ok', ...(failed ? {error: String(failure?.message ?? failure)} : {})});
    }
  };
  const finish = (...errors) => {
    if (finished) return;
    finished = true;
    const failed = errors.length > 0, [error] = errors;
    const elapsedMs = +(performance.now() - started).toFixed(2);
    event('finish', {status: failed ? 'error' : warnings ? 'warning' : 'ok', elapsedMs, stages, warnings, ...(failed ? {error: String(error?.message ?? error)} : {})});
    console.log(`Render ${failed ? 'failed' : warnings ? 'done with warnings' : 'done'}: ${(elapsedMs / 1000).toFixed(2)} s; ${file}`);
  };
  return {file, event, time, finish};
};

export const withRenderLog = async (metadata, work) => {
  const log = createRenderLog(metadata);
  try {
    const result = await work(log);
    log.finish();
    return result;
  } catch (error) { log.finish(error); throw error; }
};
