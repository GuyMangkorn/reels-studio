import type {PaintedShot} from '../shot';
import {shot as shot_B01_SH01} from '../edu31/shots/B01-SH01';
import {shot as shot_B01_SH02} from '../edu31/shots/B01-SH02';
import {shot as shot_B01_SH03} from '../edu31/shots/B01-SH03';
import {shot as shot_B01_SH04} from '../edu31/shots/B01-SH04';
import {shot as shot_B02_SH01} from '../edu31/shots/B02-SH01';
import {shot as shot_B02_SH02} from '../edu31/shots/B02-SH02';
import {shot as shot_B02_SH03} from '../edu31/shots/B02-SH03';
import {shot as shot_B03_SH01} from '../edu31/shots/B03-SH01';
import {shot as shot_B03_SH02} from '../edu31/shots/B03-SH02';
import {shot as shot_B03_SH03} from '../edu31/shots/B03-SH03';
import {shot as shot_B03_SH04} from '../edu31/shots/B03-SH04';
import {shot as shot_B03_SH05} from '../edu31/shots/B03-SH05';
import {shot as shot_B04_SH01} from '../edu31/shots/B04-SH01';
import {shot as shot_B04_SH02} from '../edu31/shots/B04-SH02';
import {shot as shot_B04_SH03} from '../edu31/shots/B04-SH03';
import {shot as shot_B05_SH01} from '../edu31/shots/B05-SH01';
import {shot as shot_B05_SH02} from '../edu31/shots/B05-SH02';
import {shot as shot_B05_SH03} from '../edu31/shots/B05-SH03';
import {shot as shot_B05_SH04} from '../edu31/shots/B05-SH04';
import {shot as shot_B06_SH01} from '../edu31/shots/B06-SH01';
import {shot as shot_B06_SH02} from '../edu31/shots/B06-SH02';
import {shot as shot_B07_SH01} from '../edu31/shots/B07-SH01';
import {shot as shot_B07_SH02} from '../edu31/shots/B07-SH02';
import {shot as shot_B07_SH03} from '../edu31/shots/B07-SH03';

// edu31 inventory (EDU-EP31-SHORT, play order, registry IDs `EDU31-<shot id>`). One shot, one file: list each shot file here and do nothing
// else with it, so a fix to one shot repaints only that shot. Written by scripts/edu-series/ep31/short/inventory.sh (W5.2 batch 1: B01-B03).
export const edu31Shots: PaintedShot[] = [
  shot_B01_SH01,
  shot_B01_SH02,
  shot_B01_SH03,
  shot_B01_SH04,
  shot_B02_SH01,
  shot_B02_SH02,
  shot_B02_SH03,
  shot_B03_SH01,
  shot_B03_SH02,
  shot_B03_SH03,
  shot_B03_SH04,
  shot_B03_SH05,
  shot_B04_SH01,
  shot_B04_SH02,
  shot_B04_SH03,
  shot_B05_SH01,
  shot_B05_SH02,
  shot_B05_SH03,
  shot_B05_SH04,
  shot_B06_SH01,
  shot_B06_SH02,
  shot_B07_SH01,
  shot_B07_SH02,
  shot_B07_SH03,
];
