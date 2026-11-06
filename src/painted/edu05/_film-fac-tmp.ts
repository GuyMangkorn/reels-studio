import {createElement} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CHK_FAC} from './check';
registerRoot(() => createElement(Composition, {id: 'EDU5-CHK-FAC', component: CHK_FAC, width: 1080, height: 1920, fps: 30, durationInFrames: 97}));
