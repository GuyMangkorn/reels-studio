import type {PaintedShot} from '../shot';
import {shot as shot_B01_SH01} from '../edu22/shots/B01-SH01';
import {shot as shot_B01_SH02} from '../edu22/shots/B01-SH02';
import {shot as shot_B01_SH03} from '../edu22/shots/B01-SH03';
import {shot as shot_B02_SH04} from '../edu22/shots/B02-SH04';
import {shot as shot_B02_SH05} from '../edu22/shots/B02-SH05';
import {shot as shot_B02_SH06} from '../edu22/shots/B02-SH06';
import {shot as shot_B03_SH07} from '../edu22/shots/B03-SH07';
import {shot as shot_B03_SH08} from '../edu22/shots/B03-SH08';
import {shot as shot_B03_SH09} from '../edu22/shots/B03-SH09';
import {shot as shot_B03_SH10} from '../edu22/shots/B03-SH10';
import {shot as shot_B03_SH11} from '../edu22/shots/B03-SH11';
import {shot as shot_B03_SH12} from '../edu22/shots/B03-SH12';
import {shot as shot_B04_SH13} from '../edu22/shots/B04-SH13';
import {shot as shot_B04_SH14} from '../edu22/shots/B04-SH14';
import {shot as shot_B04_SH15} from '../edu22/shots/B04-SH15';
import {shot as shot_B04_SH16} from '../edu22/shots/B04-SH16';
import {shot as shot_B04_SH17} from '../edu22/shots/B04-SH17';
import {shot as shot_B05_SH18} from '../edu22/shots/B05-SH18';
import {shot as shot_B05_SH19} from '../edu22/shots/B05-SH19';
import {shot as shot_B05_SH20} from '../edu22/shots/B05-SH20';
// new-shot: imports

// edu22 inventory (EDU-EP22-SHORT, Boss W5.1). One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Timing (start, length per shot) is src/painted/edu22/shots/index.ts.
export const edu22Shots: PaintedShot[] = [
  shot_B01_SH01,
  shot_B01_SH02,
  shot_B01_SH03,
  shot_B02_SH04,
  shot_B02_SH05,
  shot_B02_SH06,
  shot_B03_SH07,
  shot_B03_SH08,
  shot_B03_SH09,
  shot_B03_SH10,
  shot_B03_SH11,
  shot_B03_SH12,
  shot_B04_SH13,
  shot_B04_SH14,
  shot_B04_SH15,
  shot_B04_SH16,
  shot_B04_SH17,
  shot_B05_SH18,
  shot_B05_SH19,
  shot_B05_SH20,
  // new-shot: shots
];
