import type {Timeline} from '../../scenes/types';

// Runtime proof for the painted scene type (Boss, 29 Oct 2026): four SHIPWRECK plates through SceneRenderer, with
// a labelled B03 pair, a cross-scene in-canvas dissolve (SH03b drained -> SH04a) and SH06's in-shot match dissolve.
// Caption text is verbatim from VB-SHIPWRECK-SHORT-R1; timing is compressed for the proof, not the deliverable's.
const LABEL = 'ภาพจำลอง';
export const paintedProofTimeline: Timeline = [
  {durationSec: 2, bg: 'none', actors: [], subtitle: '', subtitleCues: [{atSec: 0, text: 'ซากเรือที่ไม่เหลือตัวเรือ…'}],
    painted: {shots: [{shot: 'SHIPWRECK-SH01', atSec: 0}]}},
  {durationSec: 4.4, bg: 'none', actors: [], subtitle: '', subtitleCues: [{atSec: 0, text: 'เรือลำนี้จมเพราะอะไร ยังไม่มีใครรู้แน่'}, {atSec: 1.8, text: 'อาจเป็นแบบนี้… หรืออาจไม่ใช่เลย'}],
    painted: {shots: [{shot: 'SHIPWRECK-SH03a', atSec: 0, label: LABEL}, {shot: 'SHIPWRECK-SH03b', atSec: 1.8, label: LABEL}]}},
  {durationSec: 3, bg: 'none', actors: [], subtitle: '', subtitleCues: [{atSec: 0, text: 'ที่รู้คือ ไม้ผุสลายไปหมด…'}],
    painted: {shots: [{shot: 'SHIPWRECK-SH04a', atSec: 0, dissolveSec: 1}]}},
  {durationSec: 5.5, bg: 'none', actors: [], subtitle: '', subtitleCues: [{atSec: 0, text: 'จนเขาไปเห็นไหรูปทรงเดียวกัน'}],
    painted: {shots: [{shot: 'SHIPWRECK-SH06', atSec: 0}]}},
];
