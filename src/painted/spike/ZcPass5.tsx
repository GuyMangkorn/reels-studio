import {AbsoluteFill} from 'remotion';
import {Subtitles} from '../../scenes/Subtitles';
import {zcpaintShots} from '../shots/zcpaint';
import {PlatePreview} from './PlatePreview';

// ZCPAINT pass 5 review compositions (Boss, 30 Oct 2026): each production plate through `PlatePreview` (drawPlate plus the
// plate's own Overlay, the same path the registry and PaintedStage use), with an optional mock caption line for the
// caption-zone check. The composition frame is the plate frame. Spike entry only (zcpaint-p5-index.ts).

const plateOf = (id: string) => {
  const shot = zcpaintShots.find((s) => s.id === id);
  if (!shot) throw new Error(`no ZCPAINT plate ${id}`);
  return shot;
};

/** A production plate with an optional mock caption line at the bottom of the caption block (review only). */
export const Pass5Plate = ({id, caption}: {id: string; caption?: string}) => (
  <AbsoluteFill>
    <PlatePreview shot={plateOf(id)} G0={0} label={false} note="" />
    {caption && (
      <AbsoluteFill style={{transform: 'translateY(-538px)'}}>
        <Subtitles text={caption} style={{preset: 'outline', position: 'bottom'}} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
