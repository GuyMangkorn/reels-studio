import type {PaintedShot} from '../shot';
import {shot as shot_B01_SH04} from '../edu26/shots/B01-SH04';
import {shot as shot_B01_SH05} from '../edu26/shots/B01-SH05';
import {shot as shot_B01_SH06} from '../edu26/shots/B01-SH06';
import {shot as shot_B02_SH01} from '../edu26/shots/B02-SH01';
import {shot as shot_B02_SH02} from '../edu26/shots/B02-SH02';
import {shot as shot_B02_SH04} from '../edu26/shots/B02-SH04';
import {shot as shot_B02_SH03} from '../edu26/shots/B02-SH03';
import {shot as shot_B02_SH05} from '../edu26/shots/B02-SH05';
import {shot as shot_B03_SH04} from '../edu26/shots/B03-SH04';
import {shot as shot_B03_SH02} from '../edu26/shots/B03-SH02';
import {shot as shot_B03_SH06} from '../edu26/shots/B03-SH06';
import {shot as shot_B04_SH01} from '../edu26/shots/B04-SH01';
import {shot as shot_B04_SH03} from '../edu26/shots/B04-SH03';
import {shot as shot_B04_SH05} from '../edu26/shots/B04-SH05';
import {shot as shot_B05_SH01} from '../edu26/shots/B05-SH01';
import {shot as shot_B06_SH01} from '../edu26/shots/B06-SH01';
import {shot as shot_B06_SH02} from '../edu26/shots/B06-SH02';
import {shot as shot_B06_SH03} from '../edu26/shots/B06-SH03';
import {shot as shot_B06_SH04} from '../edu26/shots/B06-SH04';
import {shot as shot_B06_SH05} from '../edu26/shots/B06-SH05';
// new-shot: imports

// edu26 inventory. One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Add shots with scripts/new-shot.mjs.
export const edu26Shots: PaintedShot[] = [
  shot_B01_SH04,
  shot_B01_SH05,
  shot_B01_SH06,
  shot_B02_SH01,
  shot_B02_SH02,
  shot_B02_SH04,
  shot_B02_SH03,
  shot_B02_SH05,
  shot_B03_SH04,
  shot_B03_SH02,
  shot_B03_SH06,
  shot_B04_SH01,
  shot_B04_SH03,
  shot_B04_SH05,
  shot_B05_SH01,
  shot_B06_SH01,
  shot_B06_SH02,
  shot_B06_SH03,
  shot_B06_SH04,
  shot_B06_SH05,
  // new-shot: shots
];
