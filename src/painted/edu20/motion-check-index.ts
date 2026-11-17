import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CabinDriveCheck, CabinEnd20Check, CabinExtremesCheck, CabinRoadCheck, DRIVE_FRAMES, END20_TO, EXTREMES, ROAD_FRAMES} from './motion-check';

// Standalone EDU-EP20 W5.2 Boss capability-check entry, outside src/Root.tsx and the episode timeline (like edu05/check-index.ts).
const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() => createElement(Fragment, null,
  createElement(Composition, {id: 'EDU20-CABIN-DRIVE', component: CabinDriveCheck, ...size, durationInFrames: DRIVE_FRAMES}),
  createElement(Composition, {id: 'EDU20-CABIN-EXTREMES', component: CabinExtremesCheck, ...size, durationInFrames: EXTREMES.length}),
  // W5.3 (SS-R2): the same extremes on the D-R, D and CLOSE cameras.
  ...(['D-R', 'D', 'CLOSE'] as const).map((camera) => createElement(Composition, {key: camera, id: `EDU20-CABIN-EXTREMES-${camera}`, component: CabinExtremesCheck, ...size, durationInFrames: EXTREMES.length, defaultProps: {camera}})),
  createElement(Composition, {id: 'EDU20-CABIN-ROAD', component: CabinRoadCheck, ...size, durationInFrames: ROAD_FRAMES}),
  // SS-R5 (SS-R4 FD20-R4-02 +29 f): END20 settle on the G clock (frames before G1443 hold G1443).
  createElement(Composition, {id: 'EDU20-CABIN-END20', component: CabinEnd20Check, ...size, durationInFrames: END20_TO}),
  createElement(Composition, {id: 'EDU20-CABIN-END20-KIT', component: CabinEnd20Check, ...size, durationInFrames: END20_TO, defaultProps: {variant: 'kit' as const}}),
));
