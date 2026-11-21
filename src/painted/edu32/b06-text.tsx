import type {YCam} from '../kit/ycam';
import {MEMO_FINAL} from './b05-memo';
import {MemoTyped} from './memo-type';
import {catHole} from './office';
import {CutOut} from './office-text';

// EDU-EP32-SHORT B06-SH02/SH03 memo overlay (Boss G7, 2026-11-21): the finished page as B05-SH03 leaves it (G6 `MemoTyped` at `MEMO_FINAL`: typed
// lines, red pencil underline, stamp; `fit` layout so the stamp's letters stay clear of the body text) behind the sleeping cat's cut-out.
export const B06Memo = ({c}: {c: YCam}) => <CutOut hole={catHole(c)}><MemoTyped c={c} state={MEMO_FINAL} /></CutOut>;
