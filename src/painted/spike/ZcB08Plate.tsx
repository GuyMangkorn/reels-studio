import {SceneRenderer} from '../../scenes/SceneRenderer';
import type {Timeline} from '../../scenes/types';
import {paintedShots} from '../registry';
import {PlatePreview} from './PlatePreview';

// Boss pass 6 review compositions for the production plate `ZCP-B08-SH01` (spike entry only, zcpaint-b08-index.ts).
// The plate itself is `paintedShots['ZCP-B08-SH01']` (src/painted/zcpaint/balcony.ts + overlays.tsx `b08Overlay`). The
// composition frame is the plate frame (pf). `B08Scene` runs the same plate through the production path (SceneRenderer ->
// PaintedStage) with the TH or EN `fromSec`, so TH f 81 and EN f 57 can be compared with plate frame 96.

const plate = paintedShots['ZCP-B08-SH01'];
if (!plate) throw new Error('ZCP-B08-SH01 is not registered in src/painted/registry.ts');

/** The plate with its Overlay (canvas, bloom, embers, Grade, Grain), no burned-in label. */
export const B08Plate = () => <PlatePreview shot={plate} G0={0} label={false} note="" />;
/** The plate canvas alone (no Overlay): the port-fidelity compare with the key-art spike's bare probe. */
export const B08PlateBare = () => <PlatePreview shot={{...plate, Overlay: undefined}} G0={0} label={false} note="" />;

/**
 * The shot as the Editor will place it: one painted cue at `fromSec` (TH 0.5 = pf 15, EN 1.3 = pf 39). The trailing plain
 * scene keeps the B_loop hold (last 3 s of the final scene) off the B08 cue.
 */
const b08Timeline = (fromSec: number, durationSec: number): Timeline => [
  {durationSec, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'ZCP-B08-SH01', atSec: 0, fromSec}]}},
  {durationSec: 1, bg: 'none', actors: [], subtitle: ''},
];
// The ZC record hides the channel label and the progress bar (`chrome`); the shared default draws both.
const CHROME = {channelLabel: false, progressBar: false} as const;
export const B08SceneTH = () => <SceneRenderer timeline={b08Timeline(0.5, 5)} ending="B_loop" chrome={CHROME} />;
export const B08SceneEN = () => <SceneRenderer timeline={b08Timeline(1.3, 4.5)} ending="B_loop" chrome={CHROME} />;
