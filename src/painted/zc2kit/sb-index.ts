// Standalone entry for the ZC2-SB-R3 storyboard stills (W3.3). Not part of src/Root.tsx or the episode registry.
// Render: printf 'SB-ZC2-B01-SH01 0 out/zc2sb/B01-SH01.png\n' | node scripts/stills.mjs src/painted/zc2kit/sb-index.ts
import {registerRoot} from 'remotion';
import {SbRoot} from './sb';

registerRoot(SbRoot);
