import {useCurrentFrame} from 'remotion';
import type {Timeline} from '../../scenes/types';
import {WDG_FPS} from '../../painted/wendigo/timed';

/**
 * WDG-COVERS: five 9:16 cover candidates for WDG-EP01-SHORT (docs/cover-principles.md), one 1 s scene each. Each scene
 * holds one episode plate at a chosen shot-local frame (`fromSec` so the still at scene frame 15 is that frame); the
 * `wendigo-covers` overlay draws the cover text. Stills: `node scripts/render.mjs WDG-COVERS --stills --frames=15,45,75,105,135`.
 */
export const COVER_STILL = 15;

type Cover = {id: string; shot: string; local: number; lines: {text: string; y: number; size: number; accent?: boolean}[]};

/** Angle per cover (CV09): A question, B creature, C face, D mystery, E true case. Thai copy is a draft for the user's pick. */
export const COVERS: Cover[] = [
  {id: 'A-question', shot: 'S01-B03-SH04', local: 67, lines: [{text: 'หิวไหม…?', y: 1300, size: 230, accent: true}, {text: 'เสียงที่ถามผมทุกคืน', y: 1440, size: 76}]},
  {id: 'B-creature', shot: 'S01-B03-SH05', local: 90, lines: [{text: 'WENDIGO', y: 1270, size: 190, accent: true}, {text: 'ปีศาจแห่งความหิว', y: 1410, size: 96}]},
  {id: 'C-face', shot: 'S01-B03-SH03', local: 115, lines: [{text: 'อย่าตอบมัน', y: 1290, size: 170, accent: true}, {text: 'ถ้ามันถามว่า "หิวไหม"', y: 1420, size: 76}]},
  {id: 'D-mystery', shot: 'S01-B02-SH04', local: 92, lines: [{text: 'ใครเดินวน', y: 1250, size: 160}, {text: 'รอบเต็นท์?', y: 1420, size: 160, accent: true}]},
  {id: 'E-true-case', shot: 'S03-B01-SH03', local: 44, lines: [{text: '1879', y: 1300, size: 260, accent: true}, {text: 'คดีจริงของเวนดิโก', y: 1440, size: 84}]},
];

export const coversTimeline = (): Timeline => COVERS.map(({shot, local}) => ({
  durationSec: 1, bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot: `WDG-${shot}`, atSec: 0, fromSec: (local - COVER_STILL) / WDG_FPS}]},
}));

const text = {fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 800, paintOrder: 'stroke fill', stroke: '#0b0d16', strokeLinejoin: 'round'} as const;

export const WendigoCovers = () => {
  const cover = COVERS[Math.min(COVERS.length - 1, Math.floor(useCurrentFrame() / WDG_FPS))];
  return <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} lang="th">
    {cover.lines.map(({text: t, y, size, accent}) => <text key={t} x="540" y={y} textAnchor="middle" fontSize={size} fill={accent ? '#ff8a3d' : '#f4efe6'} strokeWidth={size * 0.09} style={text}>{t}</text>)}
  </svg>;
};
