import type {PaintedShot} from '../shot';
import {shot as shot_S01_B01_SH01} from '../edu07/shots/S01-B01-SH01';
import {shot as shot_S01_B01_SH02} from '../edu07/shots/S01-B01-SH02';
import {shot as shot_S01_B02_SH01} from '../edu07/shots/S01-B02-SH01';
import {shot as shot_S01_B02_SH02} from '../edu07/shots/S01-B02-SH02';
import {shot as shot_S01_B02_SH03} from '../edu07/shots/S01-B02-SH03';
import {shot as shot_S01_B03_SH01} from '../edu07/shots/S01-B03-SH01';
import {shot as shot_S01_B03_SH05} from '../edu07/shots/S01-B03-SH05';
import {shot as shot_S01_B03_SH04} from '../edu07/shots/S01-B03-SH04';
import {shot as shot_S01_B04_SH01} from '../edu07/shots/S01-B04-SH01';
import {shot as shot_S01_B04_SH02} from '../edu07/shots/S01-B04-SH02';
import {shot as shot_S01_B04_SH03} from '../edu07/shots/S01-B04-SH03';
import {shot as shot_S01_B04_SH04} from '../edu07/shots/S01-B04-SH04';
import {shot as shot_S01_B04_SH05} from '../edu07/shots/S01-B04-SH05';
import {shot as shot_S01_B04_SH06} from '../edu07/shots/S01-B04-SH06';
import {shot as shot_S01_B05_SH01} from '../edu07/shots/S01-B05-SH01';
import {shot as shot_S01_B05_SH02} from '../edu07/shots/S01-B05-SH02';
import {shot as shot_S01_B05_SH03} from '../edu07/shots/S01-B05-SH03';
// new-shot: imports

// edu07 inventory. One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Add shots with scripts/new-shot.mjs.
export const edu07Shots: PaintedShot[] = [
  shot_S01_B01_SH01,
  shot_S01_B01_SH02,
  shot_S01_B02_SH01,
  shot_S01_B02_SH02,
  shot_S01_B02_SH03,
  shot_S01_B03_SH01,
  shot_S01_B03_SH05,
  shot_S01_B03_SH04,
  shot_S01_B04_SH01,
  shot_S01_B04_SH02,
  shot_S01_B04_SH03,
  shot_S01_B04_SH04,
  shot_S01_B04_SH05,
  shot_S01_B04_SH06,
  shot_S01_B05_SH01,
  shot_S01_B05_SH02,
  shot_S01_B05_SH03,
  // new-shot: shots
];
