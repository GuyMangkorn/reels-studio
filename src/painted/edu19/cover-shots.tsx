import {camMove, camOf} from '../kit/cam-moves';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import type {PaintedShot} from '../shot';
import {GlowLayer} from './glow';
import {paintFieldShot, type FieldShotDef} from './stage';
import {trailPrints, type Print} from './trail';

// EDU-EP19-SHORT cover-only paintings (Boss, 2026-11-16; Film's one-shot sheets EDU19-CV1, EDU19-CV2 in src/videos/covers/edu-ep19.ts, V2 header;
// cover-design skill section 2 "Source", docs/cover-principles.md CV07). Stills, registry IDs `EDU19-CV1`, `EDU19-CV2`, listed only by the cover
// inventory src/painted/shots/edu19-covers.tsx: the episode (src/painted/shots/edu19.tsx, EDU19_SHOTS) never imports this file, so no
// EDU-EP19-SHORT shot or scene key reads it. Everything is the film's own set, cast and light (SET-FIELD19 via `paintFieldShot`, GIRL, DOG +
// HARNESS, sun keys B01/B02); only the camera, the scale and the light balance are pushed. No mats, no glow ladder (one faint print), no text.

/** The film's plate adapter (`makeShot` in ./shot.tsx) without the episode's shot-length index: one still, the frame clock ignored. */
const makeCoverShot = (def: FieldShotDef): PaintedShot => ({
  id: `EDU19-${def.id}`, serves: [def.id], paper: '#cfe0e2', camera: () => STILL_CAMERA,
  paint: (p) => paintFieldShot(p, def.cam(0), def.state(0)),
  Overlay: ({opacity}) => {
    const spots = def.glow?.(0);
    return (
      <div style={{position: 'absolute', inset: 0, opacity}}>
        {spots && spots.length > 0 && <GlowLayer cam={def.cam(0)} spots={spots} />}
        {def.overlay?.(0)}
        <Grain opacity={0.04} />
      </div>
    );
  },
});

// EDU19-CV1 · danger moment, "it is right behind the tree" (B02-SH07 pushed: the dog reaching her tree, her shock). Low camera on the trail side
// of the trunk; the trunk on screen left, GIRL hidden on its far (+x) side leaning out past its right edge (P43 peek_around, shock, eyes down-left at
// the dog); the DOG in right profile, head low on her trail, its head big in the near lower frame, nose one print short of the trunk. Sun B03 (the film's
// deep-gold key, B03-B04) for a richer cover than the B02 cool of the moment it pushes: light is the one thing CV07 lets a cover push.
const CV1_CAM = camMove([6.303, 0, -0.225], [-30, -30], 1.5, 0.45, {f: 1200, hy: 1000, pitch: [6, 6]});
const CV1_DOG: V3 = [5.481, 0, -0.041];
const CV1_GIRL: V3 = [6.38, 0, -0.47];
/** Her last steps round the trunk (the trail of trailPrints() ends at x 5.4, the tree's near side): two more prints, the first under the nose. */
const CV1_PRINTS: Print[] = [...trailPrints(), {i: 19, at: [6.1, 0, 0.17]}, {i: 20, at: [6.55, 0, -0.08]}];
export const CV1: FieldShotDef = {
  id: 'CV1', N: 1,
  cam: () => camOf(CV1_CAM, 0),
  state: () => ({sun: 'B03', t: 0.4, prints: CV1_PRINTS, stack: false,
    girl: {at: CV1_GIRL, view: 'front', pose: 'P43', face: 'shock', faceState: {look: [-0.7, 0.4]}, bias: 0.2, fig: {head: 'front'}},
    dog: {at: CV1_DOG, pose: {view: 'right', state: 'stand', sniff: 1, earLift: 0.2}}}),
  glow: () => [{at: [6.1, 0, 0.17], level: 0.12, k: 1, seed: 1}],
};

// EDU19-CV2 · scale shock, "the nose vs the hider" (B01-SH03 + B04-SH02 pushed: the nose on her print, her peek at the tree). Worm's-eye on the
// trail: the DOG's muzzle huge in the lower foreground (right profile, sniffing) over one print with one faint glow curl, her plain prints running
// to the far trunk, GIRL tiny at the peek point (P43, smug), the only warm colour in the top half. Sun B03 (as CV1).
const CV2_CAM = camMove([6.0, 0, -0.2], [-85.27, -85.27], 4.2445, 0.3, {f: 1300, hy: 1000, pitch: [6, 6], cx: 160});
const CV2_PRINT: V3 = [2.4, 0, 0.07];
export const CV2: FieldShotDef = {
  id: 'CV2', N: 1,
  cam: () => camOf(CV2_CAM, 0),
  state: () => ({sun: 'B03', t: 0.2, prints: trailPrints(), stack: false,
    girl: {at: [6.45, 0, -0.05], view: 'front', pose: 'P43', face: 'smug', faceState: {mouth: 'grin'}, bias: 0.2, fig: {head: 'front'}},
    dog: {at: [2.096, 0, -0.516], pose: {view: 'right', state: 'stand', sniff: 0.9}}}),
  glow: () => [{at: CV2_PRINT, level: 0.12, k: 1, seed: 2}],
};

export const shotCV1 = makeCoverShot(CV1);
export const shotCV2 = makeCoverShot(CV2);
