// Standalone entry for the ZCONDO2-SHORT-TH W5.2 draft shots (ZC2D-<shot>), 30 compositions, one per timeline scene. Not part of src/Root.tsx or the
// episode registry (Editor registers them in src/videos/zombie-condo2/). Render: printf 'ZC2D-B01-SH01 0 out/zc2d/B01-SH01-0.png\n' | node scripts/stills.mjs src/painted/zc2kit/draft-index.ts
import {registerRoot} from 'remotion';
import {DraftRoot} from './draft';

registerRoot(DraftRoot);
