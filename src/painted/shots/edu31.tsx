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
];
