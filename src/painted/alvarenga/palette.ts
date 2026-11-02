import {mixColor} from '../kit/painter';

// ALV-EP01-SHORT time-of-day tint table (brief ALV-BRIEF-R1.1 VD04; owner: this module). Hex values are the proposals of the
// storyboard index, fixed here by the look frames L1-L3 (W3.1) and frozen at the look lock (W3.2). No red anywhere (brief VD06),
// except where the user's 2 Nov 2026 review (S04-SH03) allows red/yellow props: that is an S04 prop colour, not a tint.

export type Tint = {
  sky: [string, string]; sun: string; farSea: string; sea: string[]; seaFront: string; hull: string; hullIn: string; stripe: string;
  hat: string; paperShadow: string;
};

export const T1_DAWN: Tint = {
  sky: ['#BFD6E6', '#F6D3B8'], sun: '#FBE6CF', farSea: '#B5C9D6', sea: ['#A9C4D4', '#8FB2C8', '#7DA2BC'], seaFront: '#7096B2',
  hull: '#F3E6CF', hullIn: '#D9C7A6', stripe: '#9DBAA0', hat: '#E0A93B', paperShadow: '#5d6b80',
};
export const T2_STORM: Tint = {
  sky: ['#8B8AA3', '#B7B3C6'], sun: '#C9C5D6', farSea: '#9FA8B8', sea: ['#8FA3B5', '#7D93A8', '#7089A0'], seaFront: '#657F98',
  hull: '#E6DCCB', hullIn: '#C5B9A6', stripe: '#93AD9A', hat: '#D79E36', paperShadow: '#45485c',
};
export const T5_REEF: Tint = {
  sky: ['#BFE6E0', '#F8F1DC'], sun: '#FFF6DC', farSea: '#A9DAD4', sea: ['#A4DAD4', '#8CCDC8', '#79C0BE'], seaFront: '#68B3B2',
  hull: '#F6EBD5', hullIn: '#DCCCAA', stripe: '#9DBAA0', hat: '#E0A93B', paperShadow: '#4f7476',
};

export const SAND = '#EBDDBB', SAND_SHADE = '#D8C79F', PALM = '#9DBAA0', PALM_DARK = '#7FA088', TRUNK = '#B8987A';
export const edge = (t: Tint, color: string) => mixColor(color, t.paperShadow, 0.38);
