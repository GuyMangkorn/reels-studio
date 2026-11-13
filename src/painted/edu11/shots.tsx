import {AbsoluteFill, Img, staticFile} from 'remotion';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import {Stamp} from '../kit/screen';
import {stampState} from '../kit/stamp';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {camAt} from './cams';
import {fallY, hudStateAt, insetAt, INSET, INSET_STILL, lerp, lightAt, lin, REWIND, rewindU, seg, shotAt, ghostAt, shotRange, type ShotId} from './clock';
import {paintTower, paintShaft} from './shaft';
import {carCorners} from './shaft';
import {Cap, FallBracket, GhostChip, Lbl, RewindStreaks, ShaftStreaks, SpeedArrows} from './diagram';
import {HudFrom} from './hud';
import {paintCatchAt, paintJawsAt} from './brakes';
import {paintHallAt} from './hall';
import {paintStore, paintCageFront, paintPassengers, paintStoreFront, paintStoreGrade, cageY} from './store';
import {paintInterior, paintProps, paintWoman, planAt, afterAt} from './story';
import {woman} from './car';
import {Painted} from './stage';

// EDU-EP11 shot assembly for the draft (Boss W5.2): `paintShot` is the brush layer of any composition frame G, `ShotOverlay` its DOM layers (HUD, arrows, chip,
// bracket, streaks, labels, captions, stamp, inset), `Shot` both. Pure in G, so the Editor's scene for shot X renders `<Shot g={start + local}/>` and a
// random seek draws the same frame. Captions of the voice (subtitles) are the Editor's; the slot labels CAP and LBL are the sheet's staging.

const PAPER_DARK = '#20262c', PAPER_SHAFT = '#1b1c1e', PAPER_SEPIA = '#efe2c4';
export const paperOf = (id: ShotId): string => (id.startsWith('S01-B04-SH0') && id !== 'S01-B04-SH01' ? PAPER_SEPIA : id.includes('B02-SH0') && (id.endsWith('SH01') || id.endsWith('SH02') || id.endsWith('SH03')) || id === 'S01-B01-SH02' || id === 'S01-B03-SH04' || id === 'S01-B05-SH02' ? PAPER_SHAFT : PAPER_DARK);

/** Section figure: the WOMAN of the plan at `s` (the same pure story), at the car floor `yCar`, with the ghost of B02-SH02. */
const sectionFigure = (g: number) => (p: Painter, cam: YCam, yCar: number) => {
  const s = Math.min(g, 893), pl = planAt(s);
  const a = paintWoman(p, cam, pl, {t: s / 30, origin: [0, yCar, 0], shadow: false});
  paintProps(p, cam, pl, [0, yCar, 0]);
  const gh = ghostAt(g);
  if (gh.lift > 0 && g < 540) { // 60 % tint copy standing at the jump's apex (a demonstration, not a second woman)
    const crouchFeet = planAt(Math.min(g, 893)).feet;
    paintFigureAt(p, cam, woman(1, true), {...VIEW_CUES_OFF, at: [crouchFeet[0], yCar + gh.lift, -0.32], pose: 'P01', face: 'neutral', t: s / 30, shadow: false, tint: {to: '#dfe9f2', u: 0.6}});
  }
  return a;
};

const carBox = (cam: YCam, g: number): [number, number, number, number] => { const cc = carCorners(cam, fallY(g)), xs = cc.map((c) => c[0]), ys = cc.map((c) => c[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

/** The brush layer for composition frame `g` (the shot is found from the shot map). */
export const paintShot = (p: Painter, g: number): void => {
  const id = shotAt(g), cam = camAt(id, g);
  if (!cam) return;
  switch (id) {
    case 'S01-B01-SH02': case 'S01-B02-SH01': case 'S01-B02-SH02': case 'S01-B03-SH04': {
      const s = Math.min(g, 893), yc = fallY(g);
      paintShaft(p, cam, yc, {light: id === 'S01-B03-SH04' && g === 888 ? 0.4 : lightAt(s), figure: sectionFigure(g)});
      return;
    }
    case 'S01-B02-SH03': paintTower(p, cam, fallY(g)); return;
    case 'S01-B04-SH03': paintHallAt(p, cam, g, -0.7, -1, true); return; // SD15: hero rope, SH03 marks
    case 'S01-B04-SH02': case 'S01-B04-SH05': paintHallAt(p, cam, g); return;
    case 'S01-B04-SH04': paintHallAt(p, cam, g); paintCatchAt(p, cam, g); return;
    case 'S01-B04-SH06': { const y = cageY(g); paintStore(p, cam, y); paintPassengers(p, cam, y); paintCageFront(p, cam, y); paintStoreFront(p, cam); paintStoreGrade(p); return; }
    case 'S01-B05-SH02': paintShaft(p, cam, 57, {span: [4, 9], top: topCables(g), figure: (q, c, yc) => { const pl = afterAt(1385); paintWoman(q, c, pl, {t: 0, origin: [0, yc, 0], shadow: false}); }}); return;
    case 'S01-B05-SH03': paintJawsAt(p, cam, g); return;
    default: paintInterior(p, cam, g, id === 'S01-B03-SH01' ? {front: true, indicator: true, figure: false} : {});
  }
};
// B05-SH02: six cables light in turn G1393, 1398, 1403, 1409, 1414, 1419 (5-6 f each); G1425 one stays lit, five fade to 25 % over 6 f; G1460-1464 all full; G1467 all part.
const CABLE_G = [1393, 1398, 1403, 1409, 1414, 1419];
export const topCables = (g: number): {lit: number[]; parted: number} => ({
  lit: CABLE_G.map((a, i) => { const on = seg(g, a, a + 5); if (g < 1425) return on; const keep = i === 5 ? 1 : lerp(1, 0.25, seg(g, 1425, 1431)); return g < 1460 ? Math.min(on, keep) : lerp(Math.min(on, keep), 1, seg(g, 1460, 1464)); }),
  parted: lin(g, 1467, 1480),
});

const Grade = ({k}: {k: number}) => (k > 0 ? <AbsoluteFill style={{background: '#bcd3e6', opacity: 0.25 * k, mixBlendMode: 'multiply', pointerEvents: 'none'}} /> : null);
const frozenGrade = (g: number): number => (g >= 905 && g < REWIND.start ? 1 : g >= REWIND.start && g < REWIND.end ? 1 - rewindU(g) : 0);

/** The raster inset: still of the B04-SH01 canvas at G977 (SD14) as a DOM `<Img>` in the slot box, 6 px white border. */
export const InsetBox = ({box, scale = 1}: {box: {x: number; y: number; w: number; h: number; b: number}; scale?: number}) => {
  const iw = box.w - 2 * box.b, ih = box.h - 2 * box.b;
  return (
    <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, boxSizing: 'border-box', border: `${box.b}px solid #fff`, boxShadow: '0 6px 22px rgba(0,0,0,0.35)', overflow: 'hidden', background: '#000', transform: `scale(${scale})`, transformOrigin: `${INSET.w / 2}px ${INSET.h / 2}px`}}>
      <Img src={staticFile('edu11/inset-g977.png')} style={{width: iw, height: ih}} />
    </div>
  );
};

/** DOM layers of the shot at G (everything that is not the brush canvas and not the inset-shrunk live frame). */
export const ShotOverlay = ({g}: {g: number}) => {
  const id = shotAt(g), cam = camAt(id, g), h = hudStateAt(g), ins = insetAt(g);
  const [a] = shotRange(id);
  const shaft = id === 'S01-B01-SH02' || id === 'S01-B02-SH01' || id === 'S01-B02-SH02' || id === 'S01-B03-SH04';
  const r = id === 'S01-B01-SH02' || id === 'S01-B03-SH04' ? 8.5 : 5.0;
  return (
    <>
      {shaft && cam && <ShaftStreaks g={g} r={r} car={carBox(cam, g)} />}
      {(id === 'S01-B02-SH01' || id === 'S01-B02-SH02') && <SpeedArrows g={g} />}
      {id === 'S01-B02-SH02' && <GhostChip g={g} />}
      {id === 'S01-B02-SH03' && cam && <FallBracket cam={cam} g={g} />}
      {id === 'S01-B05-SH01' && <RewindStreaks g={g} />}
      {id === 'S01-B05-SH01' && g >= 1341 && (() => { const st = stampState(g - 1341, {land: 0, fadeAt: 37, fade: 6}); return st.visible ? <Stamp text="แทบ" at={[905, 720]} size={[240, 200]} scale={st.scale} opacity={st.opacity} /> : null; })()}
      {(id === 'S01-B04-SH04' || id === 'S01-B05-SH03') && <Lbl />}
      {id === 'S01-B04-SH02' && g >= 981 && <Cap>นิวยอร์ก 1854</Cap>}
      {id === 'S01-B04-SH06' && g >= 1214 && <Cap>1857</Cap>}
      {ins.kind === 'raster' && id !== 'S01-B04-SH01' && <InsetBox box={ins.box} scale={ins.pulse} />}
      {ins.kind === 'grow' && <AbsoluteFill style={{background: PAPER_DARK, opacity: 0.85 * lin(g, 1316, 1322)}} />}
      {ins.kind === 'grow' && <InsetBox box={ins.box} />}
      {!(ins.kind === 'live-shrink') && <HudFrom h={h} />}
      {id === 'S01-B04-SH01' && g < 913 && <AbsoluteFill style={{background: '#000', opacity: 1 - lin(g, a, 913)}} />}
    </>
  );
};

/** One composition frame: canvas + overlays. The B04-SH01 live frame shrinks into the inset slot over sepia paper (G966-978). */
export const Shot = ({g}: {g: number}) => {
  const id = shotAt(g), ins = insetAt(g), grade = frozenGrade(g);
  if (id === 'S01-B03-SH05') return <AbsoluteFill style={{background: '#000'}} />;
  const paper = paperOf(id), h = hudStateAt(g);
  const live = (
    <div style={{width: 1080, height: 1920, position: 'relative', filter: grade > 0 ? `saturate(${1 - 0.5 * grade})` : undefined}}>
      <Painted band={false} frame0={g} paint={(p) => paintShot(p, g)} paper={paper}>
        <Grade k={grade} />
        <HudFrom h={ins.kind === 'live-shrink' ? {...h, opacity: 1 - ins.k} : {...h, on: false}} />
      </Painted>
    </div>
  );
  if (ins.kind === 'live-shrink') {
    const b = ins.box, iw = b.w - 2 * b.b, ih = b.h - 2 * b.b;
    return (
      <AbsoluteFill style={{background: PAPER_DARK}}>
        <AbsoluteFill style={{background: PAPER_SEPIA, opacity: ins.k}} />
        <div style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, boxSizing: 'border-box', border: `${b.b}px solid #fff`, boxShadow: b.b > 0 ? '0 6px 22px rgba(0,0,0,0.35)' : 'none', overflow: 'hidden', background: '#000'}}>
          <div style={{width: 1080, height: 1920, transformOrigin: '0 0', transform: `scale(${iw / 1080}, ${ih / 1920})`}}>{live}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: paper}}>
      {live}
      <ShotOverlay g={g} />
    </AbsoluteFill>
  );
};

/** The raster source: the B04-SH01 canvas at G977 exactly as the live shrink ends (frozen grade, no HUD, no band). Render once to `public/edu11/inset-g977.png`. */
export const InsetSource = () => (
  <div style={{width: 1080, height: 1920, position: 'relative', filter: 'saturate(0.5)'}}>
    <Painted band={false} frame0={INSET_STILL.g} paint={(p) => paintShot(p, INSET_STILL.g)} paper={PAPER_DARK}><Grade k={1} /></Painted>
  </div>
);

