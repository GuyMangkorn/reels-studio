import {test} from 'node:test';
import assert from 'node:assert/strict';
import {G_ANCHORS, G_SHOTS, gLerp, gProject, gProjectPath, gShotCam, gUnproject, limbRadius, lodAlpha, pxPerKm, sphereWeight, type GCam} from '../src/painted/edu17/geo';
import {MAP_L0, MAP_L1, MAP_L2, province} from '../src/painted/edu17/map';

const near = (a: number, b: number, tol: number, msg: string) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tol ${tol})`);
const MC = G_ANCHORS.MC;
const cam = (h: number, o: Partial<GCam> = {}): GCam => ({lat: MC.lat, lon: MC.lon, h, pp: [540, 660], ...o});

test('nadir lands on the principal point and ground scale is f / h', () => {
  for (const h of [0.58, 6, 80, 1100, 1500, 2000, 2400, 7860]) {
    const c = cam(h), p = gProject(c, MC.lat, MC.lon);
    near(p.x, 540, 1e-6, `x h ${h}`); near(p.y, 660, 1e-6, `y h ${h}`);
    // one km north, small step: local scale
    const q = gProject(c, MC.lat + 1 / 111.195, MC.lon);
    near(660 - q.y, pxPerKm(c), pxPerKm(c) * 0.002, `px/km h ${h}`);
  }
});

test('brief scale checks: h 80 Bangkok + Nonthaburi, h 0.58 K02 roof, h 1100 Thailand, h 7860 globe radius', () => {
  const c80 = cam(80), x: number[] = [], y: number[] = [];
  for (const id of ['bangkok', 'nonthaburi'] as const) {
    const r = province(id).ring;
    for (let i = 0; i < r.length; i += 2) { const q = gProject(c80, r[i + 1], r[i]); x.push(q.x); y.push(q.y); }
  }
  // the brief estimates x 81-999, y 211-1109 from rounded extents; the baked rings include the tidal Gulf part of Bangkok (down to lat 13.22)
  near(Math.min(...x), 81, 25, 'h80 x0'); near(Math.max(...x), 999, 25, 'h80 x1'); near(Math.min(...y), 211, 25, 'h80 y0');
  const th = MAP_L1.thailandExtent, c1100 = cam(1100, {lat: 13.75, lon: 100.5, pp: [540, 820]});
  near(gProject(c1100, th.lat[1], 100.5).y, 145, 12, 'Thailand north y'); near(gProject(c1100, th.lat[0], 100.5).y, 1638, 12, 'Thailand south y');
  near(limbRadius(7860), 500.7, 0.2, 'limb radius'); // the brief: 500 +- 5 px
  const g = cam(7860, {pp: [540, 960]});
  assert.equal(gProject(g, MC.lat, MC.lon + 70).visible, false, '70 deg of lon east is past the horizon (63.4 deg) at h 7860');
  assert.equal(gProject(g, MC.lat, MC.lon + 60).visible, true);
  const top = gProject(g, MC.lat + 40, MC.lon);
  assert.ok(Math.hypot(top.x - 540, top.y - 960) < 500.7, 'inside the disc');
  // K02 roof: 0.30 x 0.25 km at 1,724 px/km
  const c058 = {lat: G_ANCHORS.K02.lat, lon: G_ANCHORS.K02.lon, h: 0.58, pp: [540, 640] as [number, number]};
  near(0.3 * pxPerKm(c058), 517, 1, 'roof width'); near(0.25 * pxPerKm(c058), 431, 1, 'roof height');
});

const rhoMax = (h: number) => (h >= 2400 ? limbRadius(h) : 1e9);
test('project / unproject round trip in flat, blend and sphere regimes, with yaw', () => {
  for (const h of [3, 80, 1100, 1500, 1900, 2400, 5000, 7860]) {
    for (const yaw of [0, 3, -37]) {
      const c = cam(h, {yaw, pp: [540, 900]});
      for (const [dx, dy] of [[0, 0], [300, -400], [-420, 700], [10, 10], [200, 250]]) {
        if (Math.hypot(dx, dy) > 0.9 * Math.min(rhoMax(h), 2000)) continue;
        const ll = gUnproject(c, 540 + dx, 900 + dy);
        assert.ok(ll, `unproject h ${h}`);
        const p = gProject(c, ll[0], ll[1]);
        near(p.x, 540 + dx, 0.01, `rt x h ${h} yaw ${yaw}`); near(p.y, 900 + dy, 0.01, `rt y h ${h} yaw ${yaw}`);
      }
    }
  }
});

test('yaw turns the map clockwise: north moves toward the right', () => {
  const a = gProject(cam(80, {yaw: 0}), MC.lat + 0.2, MC.lon), b = gProject(cam(80, {yaw: 10}), MC.lat + 0.2, MC.lon);
  assert.ok(a.y < 660 && Math.abs(a.x - 540) < 1e-6, 'north is up at yaw 0');
  assert.ok(b.x > 540, 'north tilts right at yaw +10');
  near(Math.hypot(b.x - 540, b.y - 660), Math.hypot(a.x - 540, a.y - 660), 1e-6, 'rotation keeps distance');
});

test('the blend is continuous across H_FLAT .. H_SPHERE and rho is monotone in theta', () => {
  let prev = gProject(cam(1400), MC.lat + 8, MC.lon + 5);
  for (let h = 1400; h <= 2600; h *= 1.002) {
    const q = gProject(cam(h), MC.lat + 8, MC.lon + 5);
    assert.ok(Math.hypot(q.x - prev.x, q.y - prev.y) < 3, `no jump at h ${h.toFixed(0)}`);
    prev = q;
  }
  assert.equal(sphereWeight(1500), 0); assert.equal(sphereWeight(2400), 1);
  for (const h of [80, 1500, 1900, 2400, 7860]) {
    let last = -1;
    for (let t = 0; t < 3; t += 0.01) { const q = gProject(cam(h), MC.lat + t * 10, MC.lon); const r = Math.hypot(q.x - 540, q.y - 660); assert.ok(r >= last - 1e-9); last = r; }
  }
});

test('beyond the horizon points are clamped to the limb circle (no chord)', () => {
  const c = cam(7860, {pp: [540, 960]});
  const lim = limbRadius(7860);
  const hid = gProject(c, 13.8, 100.6 + 100);
  assert.equal(hid.visible, false);
  near(Math.hypot(hid.x - 540, hid.y - 960), lim, 1e-6, 'clamped to the limb');
  // a densified ring crossing the horizon: every clamped vertex lies on the limb
  const ring = [100, 13, 180, 13, 180, 40, 100, 40];
  const {pts, hidden} = gProjectPath(c, ring, {close: true, maxDeg: 2});
  assert.ok(hidden > 0);
  for (const [x, y] of pts) assert.ok(Math.hypot(x - 540, y - 960) <= lim + 1e-6);
});

test('G shot cameras match the storyboard keys', () => {
  const s1 = gShotCam('S01-B01-SH01', 0), s1e = gShotCam('S01-B01-SH01', 68);
  near(pxPerKm(s1), 1724, 1, 'shot 1 start px/km'); near(s1e.h, 80, 1e-9, 'shot 1 end h'); near(pxPerKm(s1e), 12.5, 1e-9, 'shot 1 end px/km');
  near(gShotCam('S01-B05-SH01', 90).h, 7860, 1e-6, 'shot 22 h at +90');
  assert.ok(gShotCam('S01-B05-SH01', 218).h > 7860, 'drift continues');
  near(gShotCam('S01-B05-SH01', 218).h / gShotCam('S01-B05-SH01', 90).h, Math.pow(1.005, 128 / 30), 1e-9, 'drift rate');
  near(gShotCam('S01-B02-SH03', 81).h, 1100, 1e-9, 'shot 8 end'); near(gShotCam('S01-B03-SH01', 54).h, 6, 1e-9, 'shot 9 end');
  for (const m of G_SHOTS) { // log-h move: constant apparent zoom speed (d ln h / du constant), monotone in time
    let last = gShotCam(m.shot, 0).h;
    const dir = Math.sign(m.to.h - m.from.h);
    for (let f = 1; f < m.len; f++) { const h = gShotCam(m.shot, f).h; assert.ok((h - last) * dir >= -1e-9, `${m.shot} monotone at +${f}`); last = h; }
  }
  const mid = gLerp({lat: 0, lon: 0, h: 1}, {lat: 0, lon: 0, h: 100}, 0.5);
  near(mid.h, 10, 1e-9, 'log-linear altitude');
});

test('LOD alphas: L3 -> L2 over 2-6 km, L2 out over one decade from 100 km, L1 out 1,500-2,000, never a gap in land', () => {
  assert.deepEqual([lodAlpha(2).l3, lodAlpha(5).l3], [1, 0]);
  assert.equal(lodAlpha(80).l2, 1); assert.equal(lodAlpha(1100).l2, 0); assert.ok(lodAlpha(300).l2 > 0 && lodAlpha(300).l2 < 1);
  assert.equal(lodAlpha(1500).l1, 1); assert.equal(lodAlpha(2000).l1, 0); assert.equal(lodAlpha(1000).l0, 0); assert.equal(lodAlpha(1500).l0, 1);
  for (let h = 1000; h < 3000; h *= 1.01) assert.ok(lodAlpha(h).l1 + lodAlpha(h).l0 >= 1 || h < 1500, `land coverage at h ${h.toFixed(0)}`);
});

test('baked data: 50 khet and 6 amphoe, rings closed, anchors inside, areas near the official figures', () => {
  assert.equal(MAP_L2.districts.filter((d) => d.province === 'bangkok').length, 50);
  assert.equal(MAP_L2.districts.filter((d) => d.province === 'nonthaburi').length, 6);
  assert.ok(province('bangkok').closed && province('nonthaburi').closed);
  near(MAP_L2.areasKm2.bangkokKhetSum, 1568.7, 5, 'khet sum vs official 1,568.7 km2');
  near(MAP_L2.areasKm2.nonthaburiAmphoeSum, MAP_L2.areasKm2.nonthaburi, 1, 'amphoe tile the province ring');
  for (const k of ['MC', 'K02', 'M0']) assert.ok(MAP_L2.anchors[k].inBangkok, `${k} inside Bangkok`);
  assert.ok(MAP_L2.anchors.NonCentre.inNonthaburi);
  near(MAP_L1.thailandExtent.lat[0], 5.61, 0.05, 'TH south'); near(MAP_L1.thailandExtent.lat[1], 20.46, 0.05, 'TH north');
  assert.ok(MAP_L0.rings.length > 100);
});

// DF-20261030-map-land-clip-closure: closure edges of clipped land lie on the window boundary; they must stay off-screen wherever the layer is visible.
test('clip closure edges of the L1 land window and the L2 coast window are never on screen while the layer is visible', () => {
  const edges = (rings: number[][], win: number[]) => {
    const out: [number, number][] = [];
    for (const r of rings) {
      const n = r.length / 2;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, ax = r[2 * i], ay = r[2 * i + 1], bx = r[2 * j], by = r[2 * j + 1];
        const on = (ax === win[0] && bx === win[0]) || (ax === win[2] && bx === win[2]) || (ay === win[1] && by === win[1]) || (ay === win[3] && by === win[3]);
        if (on && Math.hypot(bx - ax, by - ay) >= 0.05) {
          const k = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 0.25)); // sample along the edge: a long edge can cross the frame between its ends
          for (let s = 0; s <= k; s++) out.push([ax + ((bx - ax) * s) / k, ay + ((by - ay) * s) / k]);
        }
      }
    }
    return out;
  };
  const l1 = edges(MAP_L1.land, MAP_L1.window);
  assert.ok(l1.length > 0, 'there are closure edges to check');
  // L1 alpha > 0 for h < 2,000: sample the G camera paths of every shot plus a dense altitude chain with the shot pp values; edges sampled every 0.25 deg, strictly outside the 1080 x 1920 frame
  const cams: GCam[] = [];
  for (const m of G_SHOTS) for (let f = 0; f < m.len; f += 1) cams.push(gShotCam(m.shot, f));
  for (let h = 100; h < 2400; h *= 1.05) for (const pp of [[540, 660], [540, 820], [540, 960]] as [number, number][]) for (const yaw of [0, 3]) cams.push({lat: 13.75, lon: 100.55, h, pp, yaw});
  for (const c of cams) {
    if (lodAlpha(c.h).l1 <= 0) continue;
    for (const [lon, lat] of l1) { const p = gProject(c, lat, lon); assert.ok(p.x < 0 || p.x > 1080 || p.y < 0 || p.y > 1920, `L1 closure edge on screen at h ${c.h.toFixed(0)}: ${p.x.toFixed(0)},${p.y.toFixed(0)}`); }
  }
  // L2 coast: its closure edges lie under the same-colour L1 land only, never outlined (coastLines carry none of them)
  const w = MAP_L2.coastWindow;
  for (const ln of MAP_L2.coastLines) for (let i = 0; i < ln.length - 2; i += 2) {
    const onEdge = (ln[i] === w[0] && ln[i + 2] === w[0]) || (ln[i] === w[2] && ln[i + 2] === w[2]) || (ln[i + 1] === w[1] && ln[i + 3] === w[1]) || (ln[i + 1] === w[3] && ln[i + 3] === w[3]);
    assert.ok(!onEdge, 'coastLines carry no window edge');
  }
});

// N14 label layout (pure part of src/painted/edu17/labels.tsx)
import {KEEP_OUT, layoutLabel, SLOTS} from '../src/painted/edu17/labels';
const overlaps = (a: {x: number; y: number; w: number; h: number}, b: {x: number; y: number; w: number; h: number}) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
test('label slots match the brief and world-anchored labels stay out of the caption band, the channel mark and the slots', () => {
  assert.deepEqual(SLOTS.LBL, {x: 816, y: 148, w: 204, h: 56});
  assert.equal(SLOTS['LBL-W'].x, 600); assert.equal(SLOTS['LBL-W'].y + SLOTS['LBL-W'].h, 236);
  assert.deepEqual([SLOTS.LBL2.x, SLOTS.LBL2.y, SLOTS.LBL2.x + SLOTS.LBL2.w, SLOTS.LBL2.y + SLOTS.LBL2.h], [60, 160, 520, 228]);
  const text = ['กรุงเทพฯ', 'นนทบุรี', '50 × 50 ซม.', 'คนทั้งโลก'];
  for (const t of text) for (const ax of [60, 300, 540, 800, 1000]) for (const ay of [120, 400, 700, 1000, 1150, 1300, 1700]) {
    const L = layoutLabel([ax, ay], t);
    for (const k of [KEEP_OUT.caption, KEEP_OUT.mark, ...KEEP_OUT.slots]) assert.ok(!overlaps(L.box, k), `${t} at ${ax},${ay} overlaps a keep-out zone`);
    assert.ok(L.box.x >= 24 && L.box.x + L.box.w <= 1056 && L.box.y + L.box.h <= 1160 + 4);
  }
  const L = layoutLabel([540, 960], 'คนทั้งโลก', {to: [760, 820]});
  assert.deepEqual(L.leader[1], [760, 820]); assert.equal(L.clamped, false, 'OT06: the leader ends at (760, 820), unclamped');
  assert.equal(layoutLabel([2000, 400], 'x').visible, false);
});

// SP3 fill clock on the baked rings (brief: Nonthaburi 77 +- 2 % at SH07 end; river covered; front never along the border)
import {FILL_TOTAL_KM2, fillKey, fillModel, fillShare, khetFill, nonCount, nonFrontKm, phiAt, inRing} from '../src/painted/edu17/fill';
test('SP3: fill clock keys on the baked rings', () => {
  const m = fillModel();
  near(m.bangkokKm2, 1568.7, 5, 'Bangkok khet union vs the official area');
  assert.equal(m.khet.length, 50);
  // order: nearest the old centre first, running area increasing
  for (let i = 1; i < m.khet.length; i++) assert.ok(m.khet[i].cumKm2 > m.khet[i - 1].cumKm2);
  assert.equal(phiAt('S01-B02-SH02', 48), 1); assert.equal(phiAt('S01-B02-SH02', 79), 1);
  const end = fillShare(phiAt('S01-B02-SH02', 48));
  assert.equal(end.bangkok, 1);
  assert.ok(end.nonthaburi >= 0.75 && end.nonthaburi <= 0.79, `Nonthaburi share at SH07 stop ${(end.nonthaburi * 100).toFixed(1)} % (want 77 +- 2)`);
  // grid check: cells filled at the stop front cover the same share of the ring cells
  const a = FILL_TOTAL_KM2 - m.bangkokKm2, nFilled = Math.floor(a / m.cellKm2);
  near(nFilled / m.cells.length, end.nonthaburi, 0.01, 'grid share agrees');
  // Bangkok is full by phiBangkok, partial before
  near(m.phiBangkok, 0.765, 0.005, 'phi at Bangkok full vs the brief 0.765');
  assert.ok(khetFill(0.3).some((v) => v > 0 && v < 1) && khetFill(0.3)[49] === 0 && khetFill(0.3)[0] === 1);
  assert.ok(khetFill(m.phiBangkok + 1e-6).every((v) => v === 1));
  // N4: the cells are ordered by fillKey (the fingers along the Chao Phraya and the highways lead), the count is still the area clock
  for (let i = 1; i < m.cells.length; i++) assert.ok(m.cells[i].key >= m.cells[i - 1].key);
  assert.ok(m.cells.every((c) => c.key === fillKey(c.m, c.finger)));
  assert.equal(nonCount(1), nFilled);
  assert.ok(m.cells.slice(0, nFilled).some((c) => c.finger < 0.45 && c.m > 2 && c.key < c.m - 1), 'a finger cell leads its distance order');
  // the front is an iso-line of the key: not along the Nonthaburi border (cells within 0.3 km of the border among the front band)
  const front = nonFrontKm(1), band = m.cells.filter((c) => Math.abs(c.key - front) < 0.8), onBorder = band.filter((c) => c.border < 0.3).length;
  assert.ok(band.length > 20 && onBorder / band.length < 0.2, `front band ${band.length} cells, ${onBorder} within 0.3 km of the border`);
  // the unfilled quarter is the north-west: its centroid is west and north of the filled centroid
  const un = m.cells.slice(nFilled), fl = m.cells.slice(0, nFilled), cen = (cs: typeof un, k: 'x' | 'y') => cs.reduce((s, c) => s + c[k], 0) / cs.length;
  assert.ok(cen(un, 'x') < cen(fl, 'x') && cen(un, 'y') > cen(fl, 'y'), 'the green quarter lies north-west of the filled part');
  // river covered: Chao Phraya samples inside the Nonthaburi ring are all inside the filled cells (distance <= front)
  const river = MAP_L2.rivers.filter((r) => r.name === 'Chao Phraya River');
  assert.ok(river.length > 0);
  let inside = 0, covered = 0;
  const nonRing = MAP_L2.provinces.find((p) => p.id === 'nonthaburi')!.ring, bkRing = MAP_L2.provinces.find((p) => p.id === 'bangkok')!.ring;
  for (const r of river) for (let i = 0; i < r.xy.length; i += 2) if (inRing(r.xy[i], r.xy[i + 1], nonRing)) {
    inside++;
    // the filled test: the key of a cell on the river (finger 0) below the front
    let d = Infinity; for (let j = 0; j < bkRing.length; j += 2) d = Math.min(d, Math.hypot((r.xy[i] - bkRing[j]) * 107.9, (r.xy[i + 1] - bkRing[j + 1]) * 111.2));
    if (fillKey(d, 0) <= front + 0.5) covered++;
  }
  assert.ok(inside > 10 && covered / inside > 0.9, `river samples in Nonthaburi covered ${covered}/${inside}`);
});
