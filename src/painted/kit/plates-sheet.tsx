// Plate gallery sheet (KIT-PLATES): every PLATES still with its id, episode, kind, time and mood, from the cache
// public/kit-plates/<id>.png. Render it with `npx tsx scripts/painted-kit/plates.ts --sheet-only` (fills the cache
// from the asset store first). Agents narrow the choice with the PLATES index before looking at this sheet.
import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, Img, registerRoot, staticFile} from 'remotion';
import {PLATES} from './plates';

const COLS = 6, CELL = 250, TW = 216, TH = 384, TOP = 120, ROW = TH + 104;
const W = COLS * CELL, H = TOP + Math.ceil(PLATES.length / COLS) * ROW + 20;
const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};

const Sheet = () => (
  <AbsoluteFill style={{background: '#efe6d2'}}>
    <div style={{...label, left: 24, top: 18, fontSize: 36, fontWeight: 700}}>src/painted/kit — plate gallery</div>
    <div style={{...label, left: 24, top: 68, fontSize: 17, color: '#4a3f38'}}>Finished sets from delivered episodes, for reference only (never a default). Index: src/painted/kit/plates.ts · stills: store projects/shared/KIT/plates/</div>
    {PLATES.map((p, i) => {
      const x = (i % COLS) * CELL + (CELL - TW) / 2, y = TOP + Math.floor(i / COLS) * ROW;
      return (
        <Fragment key={p.id}>
          <Img src={staticFile(`kit-plates/${p.id}.png`)} style={{position: 'absolute', left: x, top: y, width: TW, height: TH, outline: '1px solid rgba(43,33,28,0.4)'}} />
          <div style={{...label, left: x - 8, top: y + TH + 6, width: TW + 16}}>
            <div style={{fontSize: 15, fontWeight: 700, lineHeight: 1.2}}>{p.id}</div>
            <div style={{fontSize: 12.5, lineHeight: 1.25, marginTop: 2, color: '#4a3f38'}}>{p.kind} · {p.time} · {p.mood.join(', ')}</div>
            <div style={{display: 'flex', gap: 3, marginTop: 4}}>{p.palette.map((c) => <div key={c} style={{width: 18, height: 10, background: c}} />)}</div>
          </div>
        </Fragment>
      );
    })}
  </AbsoluteFill>
);

registerRoot(() => createElement(Fragment, null, createElement(Composition, {id: 'KIT-PLATES', component: Sheet, width: W, height: H, fps: 30, durationInFrames: 1})));
