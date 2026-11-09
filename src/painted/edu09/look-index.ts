// Standalone entry for the EDU-EP09-SHORT look stills (W3). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry): render with `printf 'EDU9-LF01 0 out/edu09/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu09/look-index.ts`.
// `EDU9-<id>-tag` is the same still with its id printed bottom-left, for the labelled contact sheet (qa-sheet.sh tiles have no labels).
import {createElement, Fragment, type ComponentType} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {LF01, LF01b, LF01m, LF02, LF03, LF04, LF_FRAMES, QAGRIN, QAPIANO, QASTOP, QADANGLE, QALIFTS, QADIAG3, QADIAG4} from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {LF01, LF01m, LF01b, LF02, LF03, LF04, QAPIANO, QAGRIN, QASTOP, QADANGLE, QALIFTS, QADIAG3, QADIAG4} as const;
const Tagged = ({id}: {id: keyof typeof comps}) =>
  createElement(AbsoluteFill, null, createElement(comps[id]), createElement('div', {style: {position: 'absolute', left: 0, bottom: 0, width: 1080, height: 130, background: 'rgba(0,0,0,0.72)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 800, fontSize: 96, lineHeight: '130px', paddingLeft: 36}}, id));
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(comps).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU9-${k}`, component, ...size, durationInFrames: LF_FRAMES[k as keyof typeof LF_FRAMES]})),
    ...Object.keys(comps).map((k) =>
      createElement(Composition as unknown as ComponentType<Record<string, unknown>>, {key: `${k}-tag`, id: `EDU9-${k}-tag`, component: Tagged, defaultProps: {id: k}, ...size, durationInFrames: 1})),
  ),
);
