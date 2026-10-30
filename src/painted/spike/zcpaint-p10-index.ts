// Standalone entry for the ZCPAINT pass 10 review (Boss, 30 Oct 2026): (1) one review composition per registered production plate
// (`PLATE`, the registry list, plate frame = composition frame); (2) the caption check: the repo's outline caption (`Subtitles`, preset
// outline) over the new shots at the worst frames, with the Thai line the sheet gives for that frame (`CAP`). Kept out of src/Root.tsx and
// the episode registry, like the pass 9 entry. Durations are generous: a still renders any frame inside them.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {zcpaintShots} from '../shots/zcpaint';
import {Pass5Plate} from './ZcPass5';

const {width, height, fps} = FORMATS.short;
const comp = (id: string, frames: number, plate: string, caption?: string) =>
  createElement(Composition, {
    id, width, height, fps, durationInFrames: frames,
    component: () => createElement(Pass5Plate, {id: plate, caption}),
  });

/** Caption check: plate, the sheet's Thai line for that frame (TH text from the sheets' VO tables, pass 10). */
const CAP: [string, string, number, string][] = [
  ['B01-SH01', 'ZCP-B01-SH01', 60, 'ปลายทางเดิน มีคนยืนนิ่งอยู่'],
  ['B01-SH02', 'ZCP-B01-SH02', 20, 'แล้วมันก็หันมา'],
  ['B02-SH03', 'ZCP-B02-SH03', 10, 'ในโลกนี้... พวกมันตามเสียง'],
  ['B04-SH03', 'ZCP-B04-SH03a', 20, 'รองใส่ทุกอย่าง ถัง หม้อ ขวด แล้วปิดฝา'],
  ['B04-SH04', 'ZCP-B04-SH04-TH', 6, 'แล้วปิดฝา'],
  ['B05-SH01', 'ZCP-B05-SH01-TH', 25, 'ขวดไว้ดื่ม ถังไว้ราดชักโครก'],
  ['B05-SH02', 'ZCP-B05-SH02', 50, 'เทแรงทีเดียว ถ้าท่อยังดี มันลงเอง'],
  ['B05-SH03', 'ZCP-B05-SH03', 40, 'ส่วนน้ำสะอาดสำรอง อยู่ในถังพักน้ำหลังชักโครก'],
  ['B05-SH03', 'ZCP-B05-SH03-TH', 30, 'ถ้าน้ำใส และไม่ได้ใส่น้ำยา'],
  ['B06-SH02', 'ZCP-B06-SH02', 30, 'ของในตู้เย็นที่กินได้เลย กินก่อน'],
  ['B06-SH03', 'ZCP-B06-SH03', 5, 'กระป๋องไว้ท้ายสุด'],
  ['B07-SH01', 'ZCP-B07-SH01', 75, 'คาร์บอนมอนอกไซด์ ฆ่าคุณได้ก่อนซอมบี้'],
  ['B09-SH02', 'ZCP-B09-SH02', 30, 'แล้วก็มีเสียงเคาะประตู'],
];

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...zcpaintShots.map((shot) => comp(`ZCPAINT-P10-PLATE-${shot.id}`, 240, shot.id)),
    ...CAP.map(([shot, plate, frame, line], i) => comp(`ZCPAINT-P10-CAP-${i}-${shot}-f${frame}`, frame + 2, plate, line)),
  ),
);
