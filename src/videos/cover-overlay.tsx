import {useCurrentFrame} from 'remotion';
import type {Timeline} from '../scenes/types';
import type {VideoDefinition} from './types';

/**
 * Cover candidates (docs/cover-principles.md). A deliverable `<ID>` has `<ID>-COVERS` (registered in src/videos/covers/):
 * one 1 s scene per candidate holding an episode plate at a chosen shot-local frame, and the `covers` overlay, which draws
 * the cover text from `overlayProps` (data, so editing a cover changes only that composition's scene keys, never an
 * episode's pinned scenes). The cover is the still at scene frame COVER_STILL; `scripts/render.mjs` renders them with
 * every delivery render of `<ID>`.
 */
export const COVER_STILL = 15;
export const COVER_FPS = 30;

/**
 * `x` (default 540), `anchor` (default middle), `rotate` (degrees about x,y) and `look` (per-line override merged over
 * the cover look) are optional layout fields; a line using none of them renders exactly as before.
 */
export type CoverLine = {text: string; y: number; size: number; accent?: boolean; x?: number; anchor?: 'start' | 'middle' | 'end'; rotate?: number; look?: CoverLook};
/** `scrim: false` drops the episode scrim for one cover (text placed on a clear area instead). */
export type Cover = {id: string; plate: string; local: number; lines: CoverLine[]; scrim?: false; look?: CoverLook; layout?: CoverLayout};
/**
 * Optional per-cover layout (all fields optional; no `layout` = unchanged). `plateMove` pushes the plate through the
 * scene's `pictureMove` (the validator limits it: |x|,|y| <= 0.05 of the frame, scale 1-1.2). `grade` and `elements`
 * are SVG drawn over the plate in this order: grade, `under` elements, text lines, `over` elements (default).
 * Everything is overlay (CV07); coordinates are the 1080x1920 frame.
 */
export type CoverLayout = {plateMove?: {x: number; y: number; scale: number}; grade?: CoverGrade; elements?: CoverElement[]};
/** `desat` 0-1 (grey blended in `saturation` mode), `tint` (colour blended over the plate), `vignette` 0-1 edge darkness, `grain` 0-1, `scanlines` 0-1, `edge` a dark fade `size` px deep from one frame side. */
export type CoverGrade = {desat?: number; tint?: {color: string; opacity: number; blend?: 'multiply' | 'color' | 'soft-light' | 'normal'}; vignette?: number; grain?: number; scanlines?: number; edge?: {side: 'left' | 'right' | 'top' | 'bottom'; size: number; opacity: number}};
type ElementBase = {fill?: string; stroke?: string; sw?: number; opacity?: number; dash?: string; transform?: string; under?: boolean; linecap?: 'round' | 'butt'};
/** `path` with `evenodd` draws frames/windows (outer then inner subpath); `text` is a small label (timestamp, tag) in Noto Sans Thai. */
export type CoverElement = ElementBase & (
  {kind: 'rect'; x: number; y: number; w: number; h: number; rx?: number} |
  {kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number} |
  {kind: 'path'; d: string; evenodd?: boolean} |
  {kind: 'text'; text: string; x: number; y: number; size: number; anchor?: 'start' | 'middle' | 'end'; weight?: number; spacing?: number});
/**
 * Optional per-cover text look (all fields optional; no `look` = the episode default look, unchanged). One family only
 * (Noto Sans Thai, variable wght 100-900 and wdth 62.5-100): the look varies weight, width, stroke, shadow, glow, a
 * sticker label behind accent lines, a short accent rule and tracking. `stretch` is a CSS font-stretch percentage,
 * `strokeRatio` is stroke width / font size, `spacing` is letter-spacing in em.
 */
export type CoverLook = {
  weight?: number; stretch?: number; spacing?: number; strokeRatio?: number; stroke?: string;
  fill?: string; accentFill?: string;
  shadow?: {dx: number; dy: number; color: string};
  glow?: {color: string; blur: number};
  /** Sticker behind accent lines: thick round-joined stroke in `color`, text drawn in `ink` with no outline. */
  label?: {color: string; ink: string; pad: number};
  /** Short bar centred at x 540, `dy` px above the first plain line's baseline-size, `w` x `h` px. */
  rule?: {color: string; w: number; h: number; y: number};
};
/** Text look per episode (CV05, CV08): accent colour, and an optional dark scrim from `scrimY` down for light pictures. */
export type CoverStyle = {accent: string; scrimY?: number};

export const coversTimeline = (covers: Cover[]): Timeline => covers.map(({plate, local, layout}) => ({
  durationSec: 1, bg: 'none', actors: [], subtitle: '',
  ...(layout?.plateMove && {pictureMove: [{atSec: 0, ...layout.plateMove}, {atSec: 1, ...layout.plateMove}]}),
  painted: {shots: [{shot: plate, atSec: 0, fromSec: (local - COVER_STILL) / COVER_FPS}]},
}));

const font = {fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 800, paintOrder: 'stroke fill', stroke: '#0b0d16', strokeLinejoin: 'round'} as const;

const LookLine = ({text, y, size, accent, color, look, x = 540, anchor = 'middle', rotate}: {text: string; y: number; size: number; accent: boolean; color: string; look: CoverLook; x?: number; anchor?: 'start' | 'middle' | 'end'; rotate?: number}) => {
  const labelled = accent && look.label;
  const base = {
    ...font, fontWeight: look.weight ?? font.fontWeight, stroke: look.stroke ?? font.stroke,
    ...(look.stretch !== undefined && {fontStretch: `${look.stretch}%`}), ...(look.spacing !== undefined && {letterSpacing: `${look.spacing}em`}),
  };
  const common = {x, y, textAnchor: anchor, fontSize: size, ...(rotate !== undefined && {transform: `rotate(${rotate} ${x} ${y})`})};
  return <>
    {labelled && look.label && <text {...common} fill={look.label.color} strokeWidth={size * look.label.pad} style={{...base, stroke: look.label.color}}>{text}</text>}
    {look.shadow && <text {...common} x={x + look.shadow.dx} y={y + look.shadow.dy} fill={look.shadow.color} strokeWidth={size * (look.strokeRatio ?? 0.09)} style={{...base, stroke: look.shadow.color}}>{text}</text>}
    <text {...common} fill={labelled && look.label ? look.label.ink : accent ? look.accentFill ?? color : look.fill ?? '#f4efe6'} strokeWidth={labelled ? 0 : size * (look.strokeRatio ?? 0.09)}
      style={look.glow ? {...base, filter: `drop-shadow(0 0 ${look.glow.blur}px ${look.glow.color})`} : base}>{text}</text>
  </>;
};

const Element = ({e}: {e: CoverElement}) => {
  const common = {fill: e.fill ?? 'none', stroke: e.stroke ?? 'none', strokeWidth: e.sw, opacity: e.opacity, strokeDasharray: e.dash, transform: e.transform, strokeLinecap: e.linecap, strokeLinejoin: 'round' as const};
  switch (e.kind) {
    case 'rect': return <rect x={e.x} y={e.y} width={e.w} height={e.h} rx={e.rx} {...common}/>;
    case 'ellipse': return <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} {...common}/>;
    case 'path': return <path d={e.d} fillRule={e.evenodd ? 'evenodd' : undefined} {...common}/>;
    case 'text': return <text x={e.x} y={e.y} fontSize={e.size} textAnchor={e.anchor ?? 'start'} {...common} style={{fontFamily: font.fontFamily, fontWeight: e.weight ?? 600, letterSpacing: e.spacing !== undefined ? `${e.spacing}em` : undefined}}>{e.text}</text>;
  }
};

const Grade = ({g}: {g: CoverGrade}) => <>
  <defs>
    <radialGradient id="cover-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.45" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity="1"/></radialGradient>
    <filter id="cover-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/></filter>
    <pattern id="cover-lines" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000"/></pattern>
  </defs>
  {g.edge && (() => {
    const {side, size, opacity} = g.edge; const h = side === 'left' || side === 'right';
    const [x, y, w, ht] = side === 'left' ? [0, 0, size, 1920] : side === 'right' ? [1080 - size, 0, size, 1920] : side === 'top' ? [0, 0, 1080, size] : [0, 1920 - size, 1080, size];
    const flip = side === 'right' || side === 'bottom';
    return <><defs><linearGradient id="cover-edge" x1="0" y1="0" x2={h ? 1 : 0} y2={h ? 0 : 1}><stop offset="0" stopColor="#0b0d16" stopOpacity={flip ? 0 : opacity}/><stop offset="1" stopColor="#0b0d16" stopOpacity={flip ? opacity : 0}/></linearGradient></defs><rect x={x} y={y} width={w} height={ht} fill="url(#cover-edge)"/></>;
  })()}
  {g.desat !== undefined && <rect width="1080" height="1920" fill="#808080" opacity={g.desat} style={{mixBlendMode: 'saturation'}}/>}
  {g.tint && <rect width="1080" height="1920" fill={g.tint.color} opacity={g.tint.opacity} style={{mixBlendMode: g.tint.blend ?? 'normal'}}/>}
  {g.vignette !== undefined && <rect width="1080" height="1920" fill="url(#cover-vig)" opacity={g.vignette}/>}
  {g.grain !== undefined && <rect width="1080" height="1920" filter="url(#cover-grain)" opacity={g.grain} style={{mixBlendMode: 'overlay'}}/>}
  {g.scanlines !== undefined && <rect width="1080" height="1920" fill="url(#cover-lines)" opacity={g.scanlines}/>}
</>;

export const CoverOverlay = ({covers, style: {accent, scrimY}}: {covers: Cover[]; style: CoverStyle}) => {
  const cover = covers[Math.min(covers.length - 1, Math.floor(useCurrentFrame() / COVER_FPS))];
  return <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} lang="th">
    {scrimY !== undefined && cover.scrim !== false && <>
      <defs><linearGradient id="cover-scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0d16" stopOpacity="0"/><stop offset="0.35" stopColor="#0b0d16" stopOpacity="0.72"/><stop offset="1" stopColor="#0b0d16" stopOpacity="0.85"/></linearGradient></defs>
      <rect x="0" y={scrimY} width="1080" height={1920 - scrimY} fill="url(#cover-scrim)"/>
    </>}
    {cover.layout?.grade && <Grade g={cover.layout.grade}/>}
    {cover.layout?.elements?.filter(e => e.under).map((e, i) => <Element key={`u${i}`} e={e}/>)}
    {cover.lines.map(({text, y, size, accent: a, x, anchor, rotate, look}) => cover.look || look || x !== undefined || anchor || rotate !== undefined ? <LookLine key={text} text={text} y={y} size={size} accent={!!a} color={accent} look={{...cover.look, ...look}} x={x} anchor={anchor} rotate={rotate}/> : <text key={text} x="540" y={y} textAnchor="middle" fontSize={size} fill={a ? accent : '#f4efe6'} strokeWidth={size * 0.09} style={font}>{text}</text>)}
    {cover.look?.rule && <rect x={540 - cover.look.rule.w / 2} y={cover.look.rule.y} width={cover.look.rule.w} height={cover.look.rule.h} rx={cover.look.rule.h / 2} fill={cover.look.rule.color}/>}
    {cover.layout?.elements?.filter(e => !e.under).map((e, i) => <Element key={`o${i}`} e={e}/>)}
  </svg>;
};

/** `<ID>-COVERS` video definition for a deliverable `<ID>` (Short format). */
export const coversVideo = (id: string, covers: Cover[], style: CoverStyle): VideoDefinition => ({
  id: `${id}-COVERS`, format: 'short', timeline: coversTimeline(covers), ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
  chrome: {channelLabel: '@TamMaiLa', progressBar: false}, overlay: 'covers', overlayProps: {covers, style},
});
