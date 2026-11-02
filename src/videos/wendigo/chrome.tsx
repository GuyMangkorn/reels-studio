import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loopBlendOpacity} from '../../scenes/endings';

/**
 * WDG-EP01-SHORT chrome (D15, Editor): SVG text layers above every scene, on the composition clock (frame = G).
 * Positions and frames from scene-S02.md / scene-S03.md: marker y 90-150, title (540, 330), name card y 720-800
 * (centre 760, width <= 768), `1879` (540, 330). Outline Thai text matches the caption look (stroke #3d3c53).
 */
export const FICTION = 'เรื่องแต่ง';
export const FACT = 'ข้อมูลจริงจากตำนานและประวัติศาสตร์';
export const LOOP_BLEND = 15;

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Opacity of each chrome item at composition frame `f` (pure; tested). */
export const chromeAt = (f: number, total = 2861) => {
  const blend = loopBlendOpacity(f, total, LOOP_BLEND); // the loop fades the fact marker out over the last frames, as C_seamless restores frame 0
  // Round 3 (user): the marker is brief: fade in G0-6, hold G6-30, fade out G30-38 (about 1.3 s in all). It is hidden at G0 and at G2860, so the seam needs no restore.
  const fiction = ramp(f, 0, 6) * (1 - ramp(f, 30, 38));
  const fact = ramp(f, 1262, 1280) * (1 - blend);
  return {
    fiction,
    fact,
    title: ramp(f, 1362, 1370) * (1 - ramp(f, 1382, 1390)),
    card: ramp(f, 1502, 1510) * (f < 1642 ? 1 : 0),
    year: ramp(f, 2123, 2133) * (f < 2365 ? 1 : 0),
  };
};

const outline = {fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 700, paintOrder: 'stroke fill', stroke: '#3d3c53', strokeLinejoin: 'round'} as const;

export const WendigoChrome = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const o = chromeAt(f);
  return <svg width={width} height={height} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} lang="th">
    {o.fiction > 0 && <g opacity={o.fiction}><rect x="400" y="94" width="280" height="56" rx="28" fill="#10121c" fillOpacity="0.55"/><text x="540" y="134" textAnchor="middle" fontSize="38" fill="#f1ece4" strokeWidth="6" style={outline}>{FICTION}</text></g>}
    {o.fact > 0 && <g opacity={o.fact}><rect x="120" y="94" width="840" height="56" rx="28" fill="#10121c" fillOpacity="0.55"/><text x="540" y="134" textAnchor="middle" fontSize="34" fill="#f1ece4" strokeWidth="6" style={outline}>{FACT}</text></g>}
    {o.title > 0 && <g opacity={o.title}><text x="540" y="395" textAnchor="middle" fontSize="170" fill="#f1ece4" strokeWidth="12" style={{...outline, fontWeight: 800}}>WENDIGO</text><text x="540" y="510" textAnchor="middle" fontSize="96" fill="#f1ece4" strokeWidth="10" style={{...outline, fontWeight: 800}}>เวนดิโก</text></g>}
    {o.card > 0 && <g opacity={o.card}><rect x="156" y="720" width="768" height="80" rx="40" fill="#10121c" fillOpacity="0.78"/><text x="540" y="772" textAnchor="middle" fontSize="38" fill="#f1ece4" strokeWidth="0" style={{...outline, stroke: 'none'}}>Ojibwe: wiindigoo · Cree: wīhtikōw</text></g>}
    {o.year > 0 && <g opacity={o.year}><text x="540" y="405" textAnchor="middle" fontSize="210" fill="#efe6d4" strokeWidth="12" style={{...outline, fontWeight: 800}}>1879</text></g>}
  </svg>;
};
