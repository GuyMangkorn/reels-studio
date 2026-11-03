// Environment layer sheet (KIT-ENV): every ENV layer (sky.ts, fall.ts, fog.ts, sea.ts) on a 1080x1920 plate shown at
// one third, plus the episode code each replaces, side by side. Animated (3 s) so motion can be checked. Own entry (kept
// out of src/Root.tsx):
//   printf 'KIT-ENV 0 out/kit-env/KIT-ENV-0.png\nKIT-ENV 45 out/kit-env/KIT-ENV-45.png\n' | node scripts/stills.mjs src/painted/kit/env-sheet.tsx
import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {paintSnow as bloopSnow} from '../bloop/sets';
import {hardFill, rectPts} from './draw';
import {paintFall} from './fall';
import {paintFogBank, paintFogCone, paintHalo} from './fog';
import {makePainter, type Painter} from './painter';
import {paintRain as seaRain, paintStormSky, paintWater} from './sea';
import {paintSkyBands, paintSkyDisc} from './sky';

const PW = 1080, PH = 1920, K = 1 / 3, COLS = 4, CELL = 430, TW = PW * K, TH = PH * K, TOP = 130, ROW = TH + 110;
const W = COLS * CELL, H = TOP + 3 * ROW, PAPER = '#efe6d2';
const h = createElement;
const frame = {width: PW, height: PH};

type Tile = {title: string; note: string; paint: (p: Painter, t: number) => void};

const night = (p: Painter) => paintSkyBands(p, {from: '#0b0f13', via: '#1a1f26', to: '#33262a', horizon: PH + 160, width: PW});
const ground = (p: Painter, y: number, c: string) => p.flat(c, rectPts(-160, y, PW + 160, PH + 160));

const TILES: Tile[] = [
  {title: 'ENV-SKY wash + disc', note: 'paintSkyBands({from,via,to,horizon}) · paintSkyDisc sun, glow 0.6', paint: (p, t) => {
    paintSkyBands(p, {from: '#2c3550', via: '#c4806a', viaAt: 0.6, to: '#e8c39a', horizon: 1150, width: PW});
    paintSkyDisc(p, {x: 700, y: 1060, r: 70, color: '#f6e2b8', glow: 0.6, t});
    ground(p, 1150, '#3a3330');
  }},
  {title: 'ENV-SKY flat + moon', note: "style 'flat': hard steps (alvarenga / zcpaint look) · moon, glow 0.4", paint: (p, t) => {
    paintSkyBands(p, {from: '#0b0f13', to: '#3a3040', horizon: 1300, width: PW, style: 'flat', bands: 7});
    paintSkyDisc(p, {x: 300, y: 380, r: 55, color: '#e9e4d2', glow: 0.4, t});
    ground(p, 1300, '#15171a');
  }},
  {title: 'ENV-FALL snow', note: "paintFall(p,'snow',{t}) · caption band 860–1248 thinned to 1/3", paint: (p, t) => {
    night(p); ground(p, 1500, '#c9d2d8');
    paintFall(p, 'snow', {...frame, t});
  }},
  {title: 'ENV-FALL rain', note: "paintFall(p,'rain',{t,wind}) over kit/sea paintStormSky", paint: (p, t) => {
    paintStormSky(p, PW); ground(p, 760, '#2f3a44');
    paintFall(p, 'rain', {...frame, t});
  }},
  {title: 'ENV-FALL dust + halo', note: "dust in a lamp-lit room · paintHalo({x,y,r,color})", paint: (p, t) => {
    p.flat('#2a211c', rectPts(-160, -160, PW + 160, PH + 160));
    paintHalo(p, {x: 540, y: 520, r: 520, color: '#c9b08a', t});
    paintFall(p, 'dust', {...frame, t});
  }},
  {title: 'ENV-FALL ash', note: "paintFall(p,'ash') over a red dusk", paint: (p, t) => {
    paintSkyBands(p, {from: '#2a1a1a', via: '#7a3a28', to: '#c0703a', horizon: 1400, width: PW});
    ground(p, 1400, '#1d1513');
    paintFall(p, 'ash', {...frame, t});
  }},
  {title: 'ENV-FALL bubbles', note: "paintFall(p,'bubbles') over kit/sea paintWater", paint: (p, t) => {
    paintWater(p, PW, PH + 160);
    paintFall(p, 'bubbles', {...frame, t});
  }},
  {title: 'ENV-FOG bank', note: 'paintFogBank({y,height,color,drift,t}) ×2 depths', paint: (p, t) => {
    night(p); ground(p, 1250, '#1b1f22');
    paintFogBank(p, {y: 1180, height: 300, width: PW, color: '#8d969a', drift: 14, t, density: 0.8});
    paintFogBank(p, {y: 1420, height: 380, width: PW, color: '#a2abae', drift: 26, t, seed: 7350});
  }},
  {title: 'ENV-FOG cone + halo', note: 'paintFogCone({x,y,angle,spread,level}) torch in fog', paint: (p, t) => {
    night(p); ground(p, 1350, '#191c1f');
    paintFogBank(p, {y: 1300, height: 320, width: PW, color: '#6f777b', t, density: 0.7});
    paintFogCone(p, {x: 220, y: 900, angle: 0.35, length: 1000, spread: 0.2, color: '#d8c9a0', level: 0.8 + 0.2 * Math.sin(t * 9)});
    paintHalo(p, {x: 220, y: 900, r: 140, color: '#e8d6a8', t});
  }},
  {title: 'OLD bloop paintSnow', note: 'bloop/sets.ts (replaced by ENV-FALL snow for new episodes)', paint: (p, t) => {
    night(p); ground(p, 1500, '#c9d2d8');
    bloopSnow(p, t);
  }},
  {title: 'OLD sea.ts paintRain', note: 'sea.ts paintRain (compare ENV-FALL rain)', paint: (p, t) => {
    paintStormSky(p, PW); ground(p, 760, '#2f3a44');
    seaRain(p, PW, PH, t);
  }},
  {title: 'paintHalo levels', note: 'level 0.3 · 0.6 · 1', paint: (p, t) => {
    p.flat('#1d1a18', rectPts(-160, -160, PW + 160, PH + 160));
    [0.3, 0.6, 1].forEach((level, i) => paintHalo(p, {x: 540, y: 350 + i * 600, r: 260, color: '#c9b08a', level, t, seed: 7400 + i * 10}));
  }},
];

const cellX = (i: number) => (i % COLS) * CELL + (CELL - TW) / 2, cellY = (i: number) => TOP + Math.floor(i / COLS) * ROW;
const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};

const Sheet = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paper={PAPER} paint={({brush, t, frame: f}) => {
      TILES.forEach((tile, i) => {
        const p = makePainter(brush, {t, frame: f, seedBase: i * 1000});
        brush.push();
        brush.translate(cellX(i), cellY(i));
        brush.scale(K);
        tile.paint(p, t);
        brush.pop();
      });
      // Paper gutters last, so marks painted past a tile's edge (the PAD margins) do not spill into its neighbours.
      const p = makePainter(brush, {t, frame: f});
      const xs = [0, ...Array.from({length: COLS}, (_, c) => [cellX(c), cellX(c) + TW]).flat(), W];
      const ys = [0, ...Array.from({length: 3}, (_, r) => [cellY(r * COLS), cellY(r * COLS) + TH]).flat(), H];
      for (let i = 0; i < xs.length; i += 2) hardFill(p, 1 + i, PAPER, rectPts(xs[i], 0, xs[i + 1], H));
      for (let i = 0; i < ys.length; i += 2) hardFill(p, 21 + i, PAPER, rectPts(0, ys[i], W, ys[i + 1]));
    }} />
    <div style={{...label, left: 24, top: 18, fontSize: 38, fontWeight: 700}}>src/painted/kit — environment layers</div>
    <div style={{...label, left: 24, top: 72, fontSize: 18, color: '#4a3f38'}}>1080×1920 plates at 1/3. Colours are arguments; the episode owns its palette. OLD tiles: the episode code each layer replaces.</div>
    {TILES.map((tile, i) => (
      <Fragment key={tile.title}>
        <div style={{position: 'absolute', left: cellX(i), top: cellY(i), width: TW, height: TH, outline: '1px solid rgba(43,33,28,0.35)'}} />
        <div style={{...label, left: cellX(i) - 10, top: cellY(i) + TH + 8, width: TW + 20}}>
          <div style={{fontSize: 19, fontWeight: 700, lineHeight: 1.2}}>{tile.title}</div>
          <div style={{fontSize: 14, lineHeight: 1.25, marginTop: 3, color: '#4a3f38'}}>{tile.note}</div>
        </div>
      </Fragment>
    ))}
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null, h(Composition, {id: 'KIT-ENV', component: Sheet, width: W, height: H, fps: 30, durationInFrames: 90})));
