// Standalone entry for the ZCPAINT pass 5 review compositions (production plates, with and without a mock caption).
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry (integration is Boss's, Editor's).
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
    comp('ZCPAINT-P5-B02-SH01-TH', 45, 'ZCP-B02-SH01-TH'),
    comp('ZCPAINT-P5-B02-SH01-TH-CAP', 45, 'ZCP-B02-SH01-TH', 'ปิด! ล็อก!'),
    comp('ZCPAINT-P5-B02-SH01-EN', 57, 'ZCP-B02-SH01-EN'),
    comp('ZCPAINT-P5-B02-SH01-EN-CAP', 57, 'ZCP-B02-SH01-EN', 'Shut it. Lock it.'),
    comp('ZCPAINT-P5-B02-SH02-TH', 96, 'ZCP-B02-SH02-TH'),
    comp('ZCPAINT-P5-B02-SH02-TH-CAP', 96, 'ZCP-B02-SH02-TH', 'ลากตู้มาดัน'),
    comp('ZCPAINT-P5-B02-SH02-EN', 120, 'ZCP-B02-SH02-EN'),
    comp('ZCPAINT-P5-B02-SH02-EN-CAP', 120, 'ZCP-B02-SH02-EN', 'Barricade it.'),
    comp('ZCPAINT-P5-B03-SH01-TH', 60, 'ZCP-B03-SH01-TH'),
    comp('ZCPAINT-P5-B03-SH01-TH-CAP', 60, 'ZCP-B03-SH01-TH', 'แล้วไฟก็ดับทั้งตึก'),
    comp('ZCPAINT-P5-B03-SH01-EN', 63, 'ZCP-B03-SH01-EN'),
    comp('ZCPAINT-P5-B03-SH01-EN-CAP', 63, 'ZCP-B03-SH01-EN', 'Then the power dies.'),
    comp('ZCPAINT-P5-B04-SH01', 60, 'ZCP-B04-SH01'),
    comp('ZCPAINT-P5-B04-SH01-CAP', 60, 'ZCP-B04-SH01', 'แต่ก๊อกน้ำยังไหล'),
    comp('ZCPAINT-P5-B06-SH01', 90, 'ZCP-B06-SH01'),
    comp('ZCPAINT-P5-B07-SH02', 90, 'ZCP-B07-SH02'),
    comp('ZCPAINT-P5-B09-SH01-TH', 156, 'ZCP-B09-SH01-TH'),
    comp('ZCPAINT-P5-B09-SH01-EN', 102, 'ZCP-B09-SH01-EN'),
    comp('ZCPAINT-P5-B09-SH02B', 39, 'ZCP-B09-SH02B'),
    comp('ZCPAINT-P5-B09-SH03', 84, 'ZCP-B09-SH03'),
    comp('ZCPAINT-P5-B10-SH01', 186, 'ZCP-B10-SH01'),
  ),
);
