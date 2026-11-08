// Standalone entry for the ZEROG-* QA stills (zerog-sheet.tsx): kept out of src/Root.tsx and the registry. Render with
// `printf 'ZEROG-DRIFT 0 out/zerog/drift.png\n' | node scripts/stills.mjs src/painted/kit/zerog-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {ZEROG_SHEETS, ZerogSheet} from './zerog-sheet';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...ZEROG_SHEETS.map((id) =>
      createElement(Composition, {key: id, id, component: () => createElement(ZerogSheet, {id}), width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
