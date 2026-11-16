import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CabinLook} from './cabin-look';

// Standalone W3 thumbnail entry, deliberately outside Root and episode timelines.
registerRoot(() => createElement(Fragment, null, createElement(Composition, {id:'EDU20-CABIN-LOOK-B', component:CabinLook, width:1080,height:1920,fps:30,durationInFrames:2,defaultProps:{variant:'B',finished:true}}), ...['A', 'B', 'C'].map((variant) => createElement(Composition, {
  key: variant, id: `EDU20-CABIN-${variant}`, component: CabinLook,
  width: 1080, height: 1920, fps: 30, durationInFrames: 2, defaultProps: {variant},
}))));
