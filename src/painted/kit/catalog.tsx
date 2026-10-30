// Kit catalog: one still that shows every src/painted/kit export with a small example and a one-line parameter note, so
// Film and Mark can pick pieces by looking at one image. Own entry (kept out of src/Root.tsx):
//   node scripts/painted-kit/catalog.mjs --out=out/kit-catalog   -> out/kit-catalog/KIT-CATALOG.png
import {createElement, Fragment, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas, type Brush} from '../BrushCanvas';
import {CameraLayer, STILL_CAMERA, pushCamera} from './camera';
import {INK, band, bbox, blob, capsule, clipHalf, ell, formDir, glaze, hardFill, inkLine, limb, planeBand, projectPoly, quadX, quadY, quadZ, rectPts, solid, washAt} from './draw';
import {Bubbles, Flash, Shafts, Spot, Vignette} from './glow';
import {drawFigure, type CastDef, type FigPose} from './cast';
import {paintHeadFront, paintHeadSide, type FaceState} from './head';
import {CAST, type Who} from '../worldfog/cast';
import {paintEdgeGrip, paintPovHand, thumbShape, type HandTone} from './hands';
import {hash} from './hash';
import {makePainter, mixColor, ramp, range, ring, rot, tintPainter, type Painter, type Pt} from './painter';
import {CaptionShade, Grade, Grain} from './screen';
import {bump, cardProjector, ease, hermite, pchip, smoothstep} from './space';

const W = 1600, COLS = 4, CW = 400, CH = 400, TOP = 120, ROWS = 4, H = 2470 + CH;
const TONE: HandTone = {skin: '#d9a77c', shade: '#c08a60', deep: '#b07c55', nail: '#efd2bd', crease: '#9c6f52', sleeve: '#4f6f8a', sleeveShade: '#3f5a72'};
const h = createElement;

type Cell = {title: string; note: string; paint?: (p: Painter, brush: Brush) => void; dom?: ReactNode};

const FACE: FaceState = {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'smile'};
const FRONT: FigPose = {view: 'front', face: FACE};
const narrator = CAST.narrator;
const withOutfit = (def: CastDef, outfit: Partial<CastDef['outfit']>): CastDef => ({...def, outfit: {...def.outfit, ...outfit}});

const CELLS: Cell[] = [
  {title: 'painter · makePainter', note: 'wash(color,op,pts,bleed,texture) · flat(color,pts) · ink / inkStill(id,name,color,w) · group(base) · layer(alpha,seedBase)', paint: (p) => {
    p.flat('#e8dcc0', rectPts(40, 40, 360, 250));
    p.wash('#6d8fa8', 210, ell(150, 150, 70, 52), 0.3, 0.6);
    p.ink(1, 'rotring', INK, 1.1);
    p.brush.spline([...ell(150, 150, 70, 52), ell(150, 150, 70, 52)[0]], 0.15);
    p.inkStill(2, 'rotring', '#a2402f', 1.2);
    p.brush.spline([[250, 90], [335, 120], [310, 215], [245, 195], [250, 90]], 0.2);
  }},
  {title: 'painter · tintPainter', note: 'tintPainter(p, toward, u): same marks, colours mixed u toward a colour (left plain, right tinted 0.6 to grey)', paint: (p) => {
    const q = tintPainter(p, '#9fb0b6', 0.6);
    p.wash('#a2402f', 220, ell(115, 150, 62, 56), 0.2, 0.5);
    q.wash('#a2402f', 220, ell(285, 150, 62, 56), 0.2, 0.5);
  }},
  {title: 'draw · solid / hardFill / glaze', note: 'solid(p,seed,color,pts,passes,texture,border) · hardFill(p,seed,color,pts) · glaze(p,seed,color,op,pts,{bleed,texture,border}) over a base', paint: (p) => {
    solid(p, 5, '#3f6f6a', ell(85, 150, 52, 58, 18), 6);
    hardFill(p, 6, '#b8603f', ell(200, 150, 52, 58, 18));
    solid(p, 7, '#e8dcc0', ell(315, 150, 52, 58, 18), 4);
    glaze(p, 8, '#2f4f78', 150, ell(315, 150, 52, 58, 18), {bleed: 0.03, texture: 0.5, border: 0.5});
  }},
  {title: 'draw · washAt / blob / band', note: 'washAt(p,seed,color,op,pts,bleed,texture) · blob(id,cx,cy,rx,ry,t) breathing edge · band(id,y0,y1,amp) wavy bank (x scaled here)', paint: (p) => {
    washAt(p, 31, '#7f9c8c', 190, blob(3, 110, 130, 62, 48, 0), 0.3, 0.5);
    washAt(p, 32, '#b98c5c', 190, blob(4, 270, 130, 62, 48, 4), 0.3, 0.5);
    washAt(p, 33, '#6d8fa8', 170, band(9, 200, 260, 22).map(([x, y]): Pt => [30 + ((x + 200) / 1500) * 340, y]), 0.3, 0.4);
  }},
  {title: 'draw · inkLine / ell / capsule / limb', note: 'inkLine(p,id,pts,{color,weight,curve,closed,still}) · ell(cx,cy,rx,ry,n,a) · capsule(a,b,w0,w1) · limb(a,b,w0,w1) · rectPts(x0,y0,x1,y1)', paint: (p) => {
    inkLine(p, 41, ell(90, 110, 52, 36, 18, 0.5), {weight: 1.2});
    inkLine(p, 42, capsule([170, 80], [260, 150], 36, 22), {color: '#a2402f'});
    inkLine(p, 43, limb([60, 220], [180, 250], 40, 20), {color: '#2f4f78', curve: 0});
    inkLine(p, 44, rectPts(240, 195, 350, 255), {color: '#3f6f6a', curve: 0.05});
    inkLine(p, 45, [[290, 90], [320, 110], [340, 80], [355, 130]], {closed: false, weight: 1.6});
  }},
  {title: 'draw · projectPoly / quadX,Y,Z / bbox', note: 'projectPoly(proj,V3[]) near-clip+project (clipScreen) · quadX/Y/Z world quads · bbox(pts) · proj = cardProjector(g,k,x0)', paint: (p) => {
    const pr = cardProjector([150, 255], 90, 0);
    const front = projectPoly(pr, quadZ(0, -1, 1, 0, 1.6));
    washAt(p, 51, '#b98c5c', 210, front, 0.1, 0.4);
    washAt(p, 52, '#8a6a46', 210, projectPoly(pr, quadX(1, 0, 1.6, 0, 1)).map(([x, y]): Pt => [x + 60, y - 30]), 0.1, 0.4);
    washAt(p, 53, '#d8b88a', 210, projectPoly(pr, quadY(1.6, -1, 1, 0, 1)).map(([x, y]): Pt => [x, y - 30]), 0.1, 0.4);
    const b = bbox(front);
    inkLine(p, 54, rectPts(b.x0 - 6, b.y0 - 6, b.x1 + 6, b.y1 + 6), {color: '#a2402f', curve: 0, weight: 0.8, still: true});
  }},
  {title: 'draw · clipHalf / planeBand / formDir', note: 'clipHalf(pts,n,c) keep dot(q,n)>=c · planeBand(pts,dir,u0,u1) slice along dir · formDir(pts,key) shading direction (arrow)', paint: (p) => {
    const body = limb([100, 70], [140, 250], 70, 56);
    washAt(p, 61, '#d8b88a', 230, body, 0.1, 0.3);
    const shade = planeBand(body, [1, 0.2], 0.55);
    if (shade.length) washAt(p, 62, '#2c3843', 200, shade, 0.1, 0.3);
    inkLine(p, 63, body, {curve: 0.05});
    const sq = rectPts(230, 80, 360, 240);
    const cut = clipHalf(sq, [1, 0], 295);
    inkLine(p, 64, sq, {color: '#9a9a9a', curve: 0, weight: 0.8, still: true});
    if (cut.length) washAt(p, 65, '#6d8fa8', 210, cut, 0.1, 0.3);
    const d = formDir(body, [0.3, 1]);
    inkLine(p, 66, [[120, 160], [120 + d[0] * 60, 160 + d[1] * 60]], {color: '#a2402f', closed: false, weight: 1.6});
  }},
  {title: 'hands · paintPovHand', note: 'paintPovHand(p,{side,base,wrist,dir,size,curl,spread,thumb,pinch,tone,…}) curl 0 flat..1 fist; shown 0, .5, 1; tone passed in', paint: (p) => {
    [[75, 0], [200, 0.5], [325, 1]].forEach(([x, curl], i) => paintPovHand(p, {side: i === 1 ? -1 : 1, base: 100 + i * 70, wrist: [x, 275], dir: -Math.PI / 2, size: 0.3, curl, tone: TONE}));
  }},
  {title: 'hands · paintEdgeGrip / thumbShape', note: 'paintEdgeGrip(p,{base,tone,wrist,knuckles,lip,tips,thumb,width,scale}) · thumbShape(B,T,bones,widths,tipR) · twoBone', paint: (p) => {
    solid(p, 71, '#8a6a46', rectPts(50, 120, 350, 250), 5);
    paintEdgeGrip(p, {base: 200, tone: TONE, wrist: [200, 40], knuckles: [[130, 95], [170, 90], [210, 90], [250, 95]], lip: [[130, 130], [170, 128], [210, 128], [250, 130]], tips: [[132, 195], [172, 200], [212, 200], [252, 195]], thumb: {base: [112, 100], tip: [100, 170]}, width: 40, scale: 0.55});
    const t = thumbShape([320, 60], [350, 150], [50, 45], [22, 18, 18, 14], 9);
    [t.prox, t.dist, t.tip].forEach((s, i) => solid(p, 75 + i, TONE.skin, s, 4));
  }},
  {title: 'painter · mixColor / ramp / hash', note: 'mixColor(a,b,u) · ramp(t,a,b) smoothstep · clamp01 · lerp(a,b,u) · hash(n) 0..1 repeatable noise (dots)', paint: (p) => {
    for (let i = 0; i < 9; i++) p.flat(mixColor('#a2402f', '#3f6f6a', i / 8), rectPts(40 + i * 35, 40, 40 + i * 35 + 33, 80));
    inkLine(p, 81, range(24, (u): Pt => [40 + u * 310, 190 - ramp(u, 0.2, 0.8) * 70]), {closed: false, still: true, weight: 1.4});
    for (let i = 0; i < 18; i++) solid(p, 82 + i, INK, ring(40 + i * 18, 215 + hash(i) * 40, 3.5), 2);
  }},
  {title: 'painter · rot / range / ring', note: 'rot(cx,cy,s,a)(pt) rotate+scale · range(n,f(u,i)) n+1 samples over u in [0,1] · ring(cx,cy,rx,ry,n) circle polygon', paint: (p) => {
    const spiral = range(48, (u): Pt => rot(200, 150, 1, u * 9)([30 + u * 90, 0]));
    inkLine(p, 101, spiral, {closed: false, weight: 1.2});
    washAt(p, 102, '#6d8fa8', 180, ring(200, 150, 26, 26), 0.2, 0.4);
  }},
  {title: 'cast · CastDef / drawFigure', note: 'CastDef {height, head, outfit, seed}; drawFigure(p,def,g,unit,pose,t) flat card at depth. Shown: the four WFOG CAST entries', paint: (p) => {
    (['narrator', 'worker', 'shopworker', 'occupant'] as Who[]).forEach((w, i) => drawFigure(p, CAST[w], [55 + i * 97, 285], 135, FRONT, 0));
  }},
  {title: 'cast · outfit swap, same character', note: 'Same head, height, seed; only `outfit` changes (original · red jacket · apron). Changing head/body = look change, needs user approval', paint: (p) => {
    const outfits: CastDef[] = [narrator, withOutfit(narrator, {jacket: '#a2402f', sleeve: '#a2402f', pants: '#2c3034'}), withOutfit(narrator, {jacket: undefined, sleeve: '#e9e6dc', longSleeves: false, apron: '#e8dcc2'})];
    outfits.forEach((d, i) => drawFigure(p, d, [75 + i * 125, 285], 150, FRONT, 0));
  }},
  {title: 'cast · FigPose, Arm via / behind', note: 'FigPose {view,crouch,bend,walk,lean,face,rArm,lArm} · Arm {to,out,via,behind}: via = authored elbow, behind = arm behind torso · flat card: no turning round', paint: (p) => {
    drawFigure(p, narrator, [120, 285], 150, {...FRONT, rArm: {to: [45, 120], via: [60, 175]}, lArm: {to: [175, 150], behind: 'upper'}}, 0);
    drawFigure(p, CAST.worker, [300, 285], 150, {view: 'left', face: FACE, bend: 0.5, walk: 0.25, rArm: {to: [270, 215]}}, 0);
  }},
  {title: 'head · paintHeadFront / paintHeadSide', note: 'paintHeadFront(p,seed,cx,cy,K,face,style,t) · paintHeadSide(…,dir) · HeadStyle {skin,hair,cut,lines} · FaceState {brow,eyes,mouth,look}', paint: (p) => {
    (['narrator', 'worker', 'shopworker', 'occupant'] as Who[]).forEach((w, i) => paintHeadFront(p, 500 + i * 10, 55 + i * 97, 100, 38, {...FACE, brow: (['flat', 'up', 'worry', 'angry'] as const)[i], mouth: (['smile', 'o', 'frown', 'flat'] as const)[i]}, CAST[w].head, 0));
    paintHeadSide(p, 600, 110, 215, 38, FACE, CAST.occupant.head, 1, 0);
    paintHeadSide(p, 610, 290, 215, 38, {...FACE, eyes: 'wide', mouth: 'gasp'}, CAST.worker.head, -1, 0);
  }},
  {title: 'space · ease / pchip / hermite / bump', note: 'ease · smoothstep(a,b,x) · seg · bump(f,a,b) · pchip(keys,x) · hermite(keys,f) V3 path · add3/sub3/scale3/len3/mix2/mix3', dom: (() => {
    const pts = (f: (u: number) => number, c: string) => <polyline fill="none" stroke={c} strokeWidth={2.4} points={Array.from({length: 41}, (_, i) => `${20 + (i / 40) * 330},${230 - f(i / 40) * 170}`).join(' ')} />;
    return <svg width={400} height={280} viewBox="0 0 400 280"><rect x={20} y={60} width={330} height={170} fill="none" stroke="#999" />
      {pts(ease, '#a2402f')}{pts((u) => smoothstep(0.2, 0.6, u), '#2f4f78')}{pts((u) => bump(u, 0.3, 0.9), '#3f6f6a')}
      {pts((u) => pchip([[0, 0], [0.3, 0.8], [0.6, 0.85], [1, 1]], u), '#b98c5c')}{pts((u) => hermite([[0, [0, 0, 0]], [0.5, [0.8, 0, 0]], [1, [1, 0, 0]]], u)[0], '#7a4f9a')}</svg>;
  })()},
];

type Tile = {title: string; note: string; layers: ReactNode; backdrop?: boolean};
const grid: ReactNode = (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    {Array.from({length: 13}, (_, i) => <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={1920} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={4} />)}
    {Array.from({length: 22}, (_, i) => <line key={`h${i}`} x1={0} y1={i * 90} x2={1080} y2={i * 90} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={4} />)}
    <circle cx={540} cy={960} r={120} fill="#a2402f" />
  </svg>
);
const cue: readonly [number, number][] = [[0, 2]];
const TILES: Tile[] = [
  {title: 'camera · STILL_CAMERA', note: 'Camera {s,fx,fy,dx,dy} · toScreen(c,pt) · applyCamera(brush,c) · cameraTransform(c) · easeOver(tl,len)', layers: <CameraLayer camera={STILL_CAMERA} width={1080} height={1920} blend="normal">{grid}</CameraLayer>},
  {title: 'camera · pushCamera / CameraLayer', note: 'pushCamera(tl,len,{s0,s1,fx,fy,dx,dy}) shown mid-push · CameraLayer(camera,width,height,blend)', layers: <CameraLayer camera={pushCamera(1, 2, {s0: 1, s1: 1.6, fx: 540, fy: 960})} width={1080} height={1920} blend="normal">{grid}</CameraLayer>},
  {title: 'glow · Shafts', note: 'Shafts({tl,xs[],fadeY,peak,slant,shift}) slanted light, ≤0.3', layers: <CameraLayer camera={STILL_CAMERA} width={1080} height={1920}><Shafts tl={1} xs={[200, 520, 840]} /></CameraLayer>},
  {title: 'glow · Flash', note: 'Flash({level,fadeY,width}) lightning, top-heavy', layers: <CameraLayer camera={STILL_CAMERA} width={1080} height={1920}><Flash level={0.7} /></CameraLayer>},
  {title: 'glow · Spot / GLOW_PEAK', note: 'Spot({x,y,r,level,color}) soft lamp pool; GLOW_PEAK = 0.3', layers: <CameraLayer camera={STILL_CAMERA} width={1080} height={1920}><Spot x={540} y={700} r={420} level={0.3} /></CameraLayer>},
  {title: 'glow · Bubbles', note: 'Bubbles({tl,x,y,seed,count,rise,level}) deterministic rising bubbles', layers: <CameraLayer camera={STILL_CAMERA} width={1080} height={1920}><Bubbles tl={1.5} x={540} y={1600} count={40} rise={1100} level={0.9} /></CameraLayer>},
  {title: 'glow · Vignette', note: 'Vignette({x,y,r,strength}) darken into a point; blend="normal"', layers: <CameraLayer camera={STILL_CAMERA} width={1080} height={1920} blend="normal"><Vignette x={540} y={800} r={520} strength={0.8} /></CameraLayer>},
  {title: 'screen · Grade', note: 'Grade() cool vignette over the whole picture (no props)', layers: <Grade />},
  {title: 'screen · Grain', note: 'Grain({opacity=0.09}) paper noise; shown at 0.5', layers: <Grain opacity={0.5} />},
  {title: 'screen · CaptionShade band', note: 'CaptionShade({tl,cues,mode,strength,fps}) · shadeGate(tl,cues,fps)', layers: <CaptionShade tl={1} cues={cue} mode="band" />},
  {title: 'screen · CaptionShade soft', note: 'mode "soft": ellipse at (540,1170) for full-frame POV', layers: <CaptionShade tl={1} cues={cue} mode="soft" />},
];

const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};
const Labels = ({x, y, w, title, note}: {x: number; y: number; w: number; title: string; note: string}) => (
  <div style={{...label, left: x, top: y, width: w}}>
    <div style={{fontSize: 21, fontWeight: 700, lineHeight: 1.2}}>{title}</div>
    <div style={{fontSize: 14.5, lineHeight: 1.25, marginTop: 4, color: '#4a3f38'}}>{note}</div>
  </div>
);

const TILE_W = 200, TILE_H = 356, TILE_COLS = 6, TILE_CELL = W / TILE_COLS;
const TILES_TOP = TOP + ROWS * CH + 70;

const Catalog = () => (
  <AbsoluteFill>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      CELLS.forEach((c, i) => {
        if (!c.paint) return;
        brush.push();
        brush.translate((i % COLS) * CW, TOP + Math.floor(i / COLS) * CH);
        c.paint(p, brush);
        brush.pop();
      });
    }} />
    <div style={{...label, left: 24, top: 18, fontSize: 38, fontWeight: 700}}>src/painted/kit — catalog</div>
    <div style={{...label, left: 24, top: 70, fontSize: 18, color: '#4a3f38'}}>Painted-2D building blocks (episode-neutral). Top: p5.brush drawing helpers (plate px). Bottom: Remotion/SVG overlay layers shown on a grey plate at 9:16. Import from src/painted/kit/&lt;module&gt;.</div>
    {CELLS.map((c, i) => {
      const x = (i % COLS) * CW, y = TOP + Math.floor(i / COLS) * CH;
      return (
        <Fragment key={c.title}>
          {c.dom && <div style={{position: 'absolute', left: x, top: y}}>{c.dom}</div>}
          <div style={{position: 'absolute', left: x + 8, top: y + 4, width: CW - 16, height: CH - 8, border: '1px solid rgba(43,33,28,0.25)'}} />
          <Labels x={x + 16} y={y + 296} w={CW - 32} title={c.title} note={c.note} />
        </Fragment>
      );
    })}
    <div style={{...label, left: 24, top: TILES_TOP - 44, fontSize: 24, fontWeight: 700}}>Overlay layers (camera.tsx · glow.tsx · screen.tsx)</div>
    {TILES.map((t, i) => {
      const x = (i % TILE_COLS) * TILE_CELL + (TILE_CELL - TILE_W) / 2, y = TILES_TOP + Math.floor(i / TILE_COLS) * (TILE_H + 150);
      return (
        <Fragment key={t.title}>
          <div style={{position: 'absolute', left: x, top: y, width: TILE_W, height: TILE_H, overflow: 'hidden', background: '#6f7c78', outline: '1px solid #2b211c'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${TILE_W / 1080})`, transformOrigin: '0 0'}}>
              <AbsoluteFill>{t.layers}</AbsoluteFill>
            </div>
          </div>
          <Labels x={x - 22} y={y + TILE_H + 8} w={TILE_CELL - 40} title={t.title} note={t.note} />
        </Fragment>
      );
    })}
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null, h(Composition, {id: 'KIT-CATALOG', component: Catalog, width: W, height: H, fps: 30, durationInFrames: 30})));
