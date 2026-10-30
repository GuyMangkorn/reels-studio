// Standalone entry for the ZCPAINT pass 9 review compositions (Boss, 30 Oct 2026): (1) the caption readability check, the repo's outline
// caption (`Subtitles`, preset outline, as `src/scenes/Subtitles.tsx` draws it) over the production plates with no caption shade; (2) the
// same plates without a caption (`BG`, for the caption-zone numbers on bare background); (3) one review composition per production plate
// (`PLATE`, the registry list, plate frame = composition frame). Kept out of src/Root.tsx and the episode registry, like the p5, p8 and bare
// entries. Durations are generous: a still renders any frame inside them.
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

registerRoot(() =>
  createElement(
    Fragment,
    null,
    comp('ZCPAINT-P9-CAP-B02-SH01-TH', 45, 'ZCP-B02-SH01-TH', 'ปิด\nล็อก'),
    comp('ZCPAINT-P9-CAP-B02-SH02-TH', 96, 'ZCP-B02-SH02-TH', 'ลากตู้มาดัน\nแต่ต้องรื้อออกได้เร็ว เผื่อไฟไหม้'),
    comp('ZCPAINT-P9-CAP-B03-SH01-TH', 60, 'ZCP-B03-SH01-TH', 'แล้วไฟก็ดับทั้งตึก'),
    comp('ZCPAINT-P9-CAP-B04-SH01', 60, 'ZCP-B04-SH01', 'แต่ก๊อกน้ำยังไหล'),
    comp('ZCPAINT-P9-CAP-B06-SH01', 90, 'ZCP-B06-SH01', 'ตู้เย็นถ้าไม่เปิด จะเย็นได้ราวสี่ชั่วโมง'),
    comp('ZCPAINT-P9-CAP-B07-SH02', 90, 'ZCP-B07-SH02', 'กินของที่ไม่ต้องปรุงแทน'),
    comp('ZCPAINT-P9-CAP-B10-SH01', 186, 'ZCP-B10-SH01', 'คุณจะเปิดประตู ส่งเสียงตอบ\nหรือเงียบไว้'),
    comp('ZCPAINT-P9-BG-B02-SH01-TH', 45, 'ZCP-B02-SH01-TH'),
    comp('ZCPAINT-P9-BG-B02-SH02-TH', 96, 'ZCP-B02-SH02-TH'),
    comp('ZCPAINT-P9-BG-B03-SH01-TH', 60, 'ZCP-B03-SH01-TH'),
    comp('ZCPAINT-P9-BG-B04-SH01', 60, 'ZCP-B04-SH01'),
    comp('ZCPAINT-P9-BG-B06-SH01', 90, 'ZCP-B06-SH01'),
    comp('ZCPAINT-P9-BG-B07-SH02', 90, 'ZCP-B07-SH02'),
    comp('ZCPAINT-P9-BG-B10-SH01', 186, 'ZCP-B10-SH01'),
    ...zcpaintShots.map((shot) => comp(`ZCPAINT-P9-PLATE-${shot.id}`, 240, shot.id)),
  ),
);
