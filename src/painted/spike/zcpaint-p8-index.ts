// Standalone entry for the ZCPAINT pass 8 review compositions (Boss, 30 Oct 2026): the production plates rebuilt for S-P11 (light kit),
// S-P13 (6-head figures, room relight) and the R2.5 POV staging. Kept out of src/Root.tsx and the episode registry, like the p5 entry.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {Pass5Plate} from './ZcPass5';

const {width, height, fps} = FORMATS.short;
const comp = (id: string, frames: number, plate: string, caption?: string) =>
  createElement(Composition, {
    id, width, height, fps, durationInFrames: frames,
    component: () => createElement(Pass5Plate, {id: plate, caption}),
  });

registerRoot(() =>
  createElement(
    Fragment,
    null,
    comp('ZCPAINT-P8-B02-SH01-TH', 45, 'ZCP-B02-SH01-TH'),
    comp('ZCPAINT-P8-B02-SH01-EN', 57, 'ZCP-B02-SH01-EN'),
    comp('ZCPAINT-P8-B02-SH02-TH', 96, 'ZCP-B02-SH02-TH'),
    comp('ZCPAINT-P8-B02-SH02-EN', 120, 'ZCP-B02-SH02-EN'),
    comp('ZCPAINT-P8-B03-SH01-TH', 60, 'ZCP-B03-SH01-TH'),
    comp('ZCPAINT-P8-B03-SH01-EN', 63, 'ZCP-B03-SH01-EN'),
    comp('ZCPAINT-P8-B04-SH01', 60, 'ZCP-B04-SH01'),
    comp('ZCPAINT-P8-B06-SH01', 90, 'ZCP-B06-SH01'),
    comp('ZCPAINT-P8-B07-SH02', 90, 'ZCP-B07-SH02'),
    comp('ZCPAINT-P8-B08-SH01', 160, 'ZCP-B08-SH01'),
    comp('ZCPAINT-P8-B09-SH01-TH', 156, 'ZCP-B09-SH01-TH'),
    comp('ZCPAINT-P8-B09-SH01-EN', 102, 'ZCP-B09-SH01-EN'),
    comp('ZCPAINT-P8-B09-SH02B', 39, 'ZCP-B09-SH02B'),
    comp('ZCPAINT-P8-B09-SH03', 84, 'ZCP-B09-SH03'),
    comp('ZCPAINT-P8-B10-SH01', 186, 'ZCP-B10-SH01'),
  ),
);
