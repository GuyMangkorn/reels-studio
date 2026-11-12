// Standalone entry for the LF01 set-detail study (detail-study.ts); kept out of src/Root.tsx and the episode registry. Same wrapper as the look
// stills (look.tsx): `printf 'EDU15D-LF01D 0 out/edu15/detail-study/LF01D.png\n' | node scripts/stills.mjs src/painted/edu15/detail-study-index.tsx`.
import {Composition, registerRoot} from 'remotion';
import {paintLF01Detail} from './detail-study';
import {CALM, CalmBand, Painted, Vignette} from './look';

const LF01D = () => (
  <Painted paint={paintLF01Detail}>
    <Vignette level={0.3} id="v-LF01D" />
    <CalmBand level={CALM.LF01} id="calm-LF01D" />
  </Painted>
);

registerRoot(() => <Composition id="EDU15D-LF01D" component={LF01D} width={1080} height={1920} fps={30} durationInFrames={1} />);
