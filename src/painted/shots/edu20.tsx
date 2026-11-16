import type {PaintedShot} from '../shot';
import {shot as shot_B01_SH01} from '../edu20/shots/B01-SH01';
import {shot as shot_B01_SH02} from '../edu20/shots/B01-SH02';
import {shot as shot_B01_SH03} from '../edu20/shots/B01-SH03';
import {shot as shot_B02_SH01} from '../edu20/shots/B02-SH01';
import {shot as shot_B03_SH01} from '../edu20/shots/B03-SH01';
import {shot as shot_B03_SH02} from '../edu20/shots/B03-SH02';
import {shot as shot_B04_SH01, settled as shot_B04_SH01_SETTLED} from '../edu20/shots/B04-SH01';
import {shot as shot_B04_SH02} from '../edu20/shots/B04-SH02';
import {shot as shot_B05_SH01} from '../edu20/shots/B05-SH01';
import {shot as shot_B05_SH02} from '../edu20/shots/B05-SH02';
import {shot as shot_B05_SH03} from '../edu20/shots/B05-SH03';

// edu20 inventory (EDU-EP20-SHORT, Editor W5.3). One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Timing (start, length per shot) is src/painted/edu20/shots/index.ts.
export const edu20Shots: PaintedShot[] = [
  shot_B01_SH01,
  shot_B01_SH02,
  shot_B01_SH03,
  shot_B02_SH01,
  shot_B03_SH01,
  shot_B03_SH02,
  shot_B04_SH01,
  shot_B04_SH01_SETTLED,
  shot_B04_SH02,
  shot_B05_SH01,
  shot_B05_SH02,
  shot_B05_SH03,
];
