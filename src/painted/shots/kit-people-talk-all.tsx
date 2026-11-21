import {EXPRESSIONS} from '../kit/expressions';
import {paintHeadFront, paintHeadSide} from '../kit/head';
import {PEOPLE, PERSON_IDS} from '../kit/people';
import type {Painter} from '../kit/painter';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-PEOPLE-TALK-ALL plate (kit check, not an episode; user 21 Nov 2026): every PEOPLE head exactly as the library lists it (sideDetail
// on since 21 Nov 2026) talks in a 3 x 6 grid, heads only so no body crosses into the next cell: right profile, front, then left
// profile, so the profile nose, eye, brow and the 5% talk jaw can be seen on the whole cast. Video: src/videos/kit-people/index.ts.
// Render: `node scripts/render.mjs KIT-PEOPLE-TALK-ALL --draft`.

export const PEOPLE_TALK_ALL_SEC = 10;
const COLS = 3, ROWS = Math.ceil(PERSON_IDS.length / COLS);
const CW = 1080 / COLS, CH = 1920 / ROWS, K = 86;
/** View by time: right profile, front, left profile (held, no turn). */
const viewAt = (tl: number): 'right' | 'front' | 'left' => (tl < 10 / 3 ? 'right' : tl < 20 / 3 ? 'front' : 'left');
/** Synthetic speech as in KIT-HEAD-TALK-TURN: about 4.5 syllables per second with a pause every 1.7 s, offset per person. */
const talkOpen = (tl: number, i: number) => {
  const t = tl + i * 0.29, pause = (t % 1.7) > 1.35 ? 0 : 1;
  return pause * Math.max(0, Math.sin(2 * Math.PI * 4.5 * t)) * (0.55 + 0.45 * Math.abs(Math.sin(1.3 * t + i)));
};
const paint = (p: Painter, {tl}: ShotContext) => {
  const view = viewAt(tl);
  PERSON_IDS.forEach((id, i) => {
    const cx = (i % COLS + 0.5) * CW, cy = (Math.floor(i / COLS) + 0.57) * CH, seed = 600 + i * 3;
    const face = {...EXPRESSIONS.neutral, mouth: 'talk' as const, open: talkOpen(tl, i)}, style = PEOPLE[id].head;
    if (view === 'front') paintHeadFront(p, seed, cx, cy, K, face, style, tl);
    else paintHeadSide(p, seed, cx, cy, K, face, style, view === 'left' ? -1 : 1, tl);
  });
};

const Labels = () => (
  <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#3b3226'}}>
    {PERSON_IDS.map((id, i) => (
      <div key={id} style={{position: 'absolute', left: (i % COLS) * CW, top: Math.floor(i / COLS) * CH, width: CW, height: CH, boxSizing: 'border-box',
        borderRight: '1px solid #cbbfa9', borderBottom: '1px solid #cbbfa9', padding: '8px 12px', fontSize: 24}}>{id}</div>
    ))}
  </div>
);

export const peopleTalkAllShots: PaintedShot[] = [{
  id: 'kit-people-talk-all',
  serves: ['KIT-PEOPLE-TALK-ALL'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint,
  Overlay: () => <Labels />,
}];
