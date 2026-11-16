import type {PaintedShot} from '../shot';
import {shot as shot_B01_SH01} from '../edu19/shots/B01-SH01';
import {shot as shot_B01_SH02} from '../edu19/shots/B01-SH02';
import {shot as shot_B01_SH03} from '../edu19/shots/B01-SH03';
import {shot as shot_B01_SH04} from '../edu19/shots/B01-SH04';
import {shot as shot_B01_SH05} from '../edu19/shots/B01-SH05';
import {shot as shot_B01_SH06} from '../edu19/shots/B01-SH06';
import {shot as shot_B01_SH07} from '../edu19/shots/B01-SH07';
import {shot as shot_B02_SH01} from '../edu19/shots/B02-SH01';
import {shot as shot_B02_SH02} from '../edu19/shots/B02-SH02';
import {shot as shot_B02_SH03} from '../edu19/shots/B02-SH03';
import {shot as shot_B02_SH04} from '../edu19/shots/B02-SH04';
import {shot as shot_B02_SH05} from '../edu19/shots/B02-SH05';
import {shot as shot_B02_SH06} from '../edu19/shots/B02-SH06';
import {shot as shot_B02_SH07} from '../edu19/shots/B02-SH07';
import {shot as shot_B03_SH01} from '../edu19/shots/B03-SH01';
import {shot as shot_B03_SH02} from '../edu19/shots/B03-SH02';
import {shot as shot_B03_SH03} from '../edu19/shots/B03-SH03';
import {shot as shot_B03_SH04} from '../edu19/shots/B03-SH04';
import {shot as shot_B03_SH05} from '../edu19/shots/B03-SH05';
import {shot as shot_B03_SH06} from '../edu19/shots/B03-SH06';
import {shot as shot_B03_SH07} from '../edu19/shots/B03-SH07';
import {shot as shot_B04_SH01} from '../edu19/shots/B04-SH01';
import {shot as shot_B04_SH02} from '../edu19/shots/B04-SH02';
// new-shot: imports

// edu19 inventory (EDU-EP19-SHORT, Boss W5.3). One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Timing (start, length per shot) is src/painted/edu19/shots/index.ts.
export const edu19Shots: PaintedShot[] = [
  shot_B01_SH01,
  shot_B01_SH02,
  shot_B01_SH03,
  shot_B01_SH04,
  shot_B01_SH05,
  shot_B01_SH06,
  shot_B01_SH07,
  shot_B02_SH01,
  shot_B02_SH02,
  shot_B02_SH03,
  shot_B02_SH04,
  shot_B02_SH05,
  shot_B02_SH06,
  shot_B02_SH07,
  shot_B03_SH01,
  shot_B03_SH02,
  shot_B03_SH03,
  shot_B03_SH04,
  shot_B03_SH05,
  shot_B03_SH06,
  shot_B03_SH07,
  shot_B04_SH01,
  shot_B04_SH02,
  // new-shot: shots
];
