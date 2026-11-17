// EDU-EP22-SHORT W5.1 plate measures (Boss): runs each shot's painter headless (no-op brush) at its first, middle, last and key frames and prints
// the CHILD lead (cap top to the visible bottom: the child-table back edge or the figure bottom, as boss-asset-workflow's lead rule), his head
// centre, the N7 glint centres (px) and, in SH12 / SH17, taster T's head x beside them (T must not cover a glint).
//   node --import tsx scripts/edu-series/ep22/short/measure-shots.ts [B01-SH01 ...] > out/edu22/shot-measure.json
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {TASTER} from '../../../../src/painted/edu22/cast';
import {T_SH12} from '../../../../src/painted/edu22/crew';
import {glintGeom} from '../../../../src/painted/edu22/glints';
import {personAnchors} from '../../../../src/painted/edu22/motion22';
import {SHOT_DEFS} from '../../../../src/painted/edu22/shot';
import {EDU22_SHOTS} from '../../../../src/painted/edu22/shots/index';
import type {Probe} from '../../../../src/painted/edu22/stage';
import '../../../../src/painted/shots/edu22';

const NOOP = makePainter(new Proxy({}, {get: () => () => undefined}) as unknown as Brush, {t: 0, frame: 0});
const want = process.argv.slice(2);
const out: Record<string, Record<string, unknown>> = {};
for (const row of EDU22_SHOTS) {
  if (want.length && !want.includes(row.id)) continue;
  const def = SHOT_DEFS[row.id];
  const frames = [...new Set([0, Math.floor((row.len - 1) / 2), row.len - 1, ...row.keys])].sort((a, b) => a - b);
  const res: Record<string, unknown> = {};
  for (const L of frames) {
    const c = def.cam(L), pr: Probe = {};
    def.paint(NOOP, L, c, pr);
    const m: Record<string, unknown> = {};
    if (pr.child && pr.childCapTop !== undefined && pr.childVisibleBottom !== undefined) {
      m.capTop = Math.round(pr.childCapTop); m.visibleBottom = Math.round(pr.childVisibleBottom);
      m.leadPx = Math.round(Math.min(1920, pr.childVisibleBottom) - Math.max(0, pr.childCapTop));
      m.head = pr.child.head.map(Math.round); m.chin = Math.round(pr.child.chin);
    }
    const g = def.glints?.(L);
    if (g) m.glints = Object.fromEntries(g.map((q) => { const k = glintGeom(c, {...q, k: Math.max(q.k, 1e-3)}); return [q.id, k ? [Math.round(k.x), Math.round(k.y)] : null]; }));
    if (row.id === 'B03-SH12' || row.id === 'B04-SH17') { const a = personAnchors(c, TASTER, {at: T_SH12, t: 0, view: 'left'}); if (a) m.tasterHeadX = Math.round(a.head[0]); }
    res[`l${L}`] = m;
  }
  out[row.id] = res;
}
console.log(JSON.stringify(out, null, 1));
