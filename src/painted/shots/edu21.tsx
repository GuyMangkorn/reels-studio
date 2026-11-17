import type {PaintedShot} from '../shot';
import {shot as shot_B01_SH01} from '../edu21/shots/B01-SH01';
import {shot as shot_B01_SH02} from '../edu21/shots/B01-SH02';
import {shot as shot_B01_SH03} from '../edu21/shots/B01-SH03';
import {shot as shot_B01_SH04} from '../edu21/shots/B01-SH04';
import {shot as shot_B02_SH05} from '../edu21/shots/B02-SH05';
import {shot as shot_B04_SH09} from '../edu21/shots/B04-SH09';
import {shot as shot_B05_SH12} from '../edu21/shots/B05-SH12';
import {shot as shot_B02_SH06} from '../edu21/shots/B02-SH06';
import {shot as shot_B04_SH10} from '../edu21/shots/B04-SH10';
import {shot as shot_B05_SH13} from '../edu21/shots/B05-SH13';
import {shot as shot_B03_SH07} from '../edu21/shots/B03-SH07';
import {shot as shot_B03_SH08} from '../edu21/shots/B03-SH08';
import {shot as shot_B05_SH11} from '../edu21/shots/B05-SH11';
// new-shot: imports

// edu21 inventory. One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Add shots with scripts/new-shot.mjs.
export const edu21Shots: PaintedShot[] = [
  shot_B01_SH01,
  shot_B01_SH02,
  shot_B01_SH03,
  shot_B01_SH04,
  shot_B02_SH05,
  shot_B04_SH09,
  shot_B05_SH12,
  shot_B02_SH06,
  shot_B04_SH10,
  shot_B05_SH13,
  shot_B03_SH07,
  shot_B03_SH08,
  shot_B05_SH11,
  // new-shot: shots
];
