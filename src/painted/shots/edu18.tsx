import type {PaintedShot} from '../shot';
import {B01_SH01, B01_SH02, B01_SH03, B01_SH04, B01_SH05, B02_SH01, B02_SH03} from '../edu18/shots/river';
import {B02_SH02, B06_SH02, B06_SH03} from '../edu18/shots/phone';
import {B03_SH01, B03_SH02, B03_SH03, B04_SH01} from '../edu18/shots/village';
import {B03_SH04} from '../edu18/shots/stadium';
import {B04_SH02, B04_SH03, B04_SH04} from '../edu18/shots/path';
import {B05_SH01, B05_SH02, B05_SH03, B06_SH01, B06_SH04, B06_SH05} from '../edu18/shots/bedroom';

// edu18 inventory (EDU-EP18-SHORT W5 draft). Shots are grouped per set in src/painted/edu18/shots/<set>.tsx (deviation from one-shot-one-file, recorded in build-notes).
export const edu18Shots: PaintedShot[] = [
  B01_SH01, B01_SH02, B01_SH03, B01_SH04, B01_SH05, B02_SH01, B02_SH02, B02_SH03, B03_SH01, B03_SH02, B03_SH03, B03_SH04,
  B04_SH01, B04_SH02, B04_SH03, B04_SH04, B05_SH01, B05_SH02, B05_SH03, B06_SH01, B06_SH02, B06_SH03, B06_SH04, B06_SH05,
];
