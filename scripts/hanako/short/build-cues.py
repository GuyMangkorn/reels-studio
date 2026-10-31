#!/usr/bin/env python3
"""HANAKO-SHORT E2: subtitle cues and scene/plate timeline from voice lock v3.

Usage: python3 -I scripts/hanako/short/build-cues.py [--check]
Reads:  public/narration/HANAKO-SHORT.amplitude.json (track frames, 30 fps, 2461 values)
        scripts/hanako/short/voice-measure.json (beats = speech on/off per line, anchors = Whisper word estimates)
        the cue table UNITS below (Thai text from script.md, split points from scene-sheet R4 "VO + subtitles")
Writes: scripts/hanako/short/timeline.json   scenes in the Scene shape (read by src/videos/hanako/index.ts and
                                             scripts/caption-breaks.mjs), painted plates and subtitle cues
        scripts/hanako/short/cue-measure.json per-cue sheet / built / measured ranges, rule, anchor cross-check
Frames: composition-global; timeline frame = track frame + PREROLL (45). Half-open [start, end).

Cue rules (E2, editor-e2-report.md):
- Beat edges (first cue start, last cue end of a beat) use the voice-lock beat on/off (300-sample rule, +-1 f).
- Internal split points use the amplitude word onset: the first frame >= 4 % of peak after a low-energy gap
  (scene-sheet rule). An internal cue ends at its last speech frame before the next cue (the gap start).
- Knock captions (KN-1..3) event-timed from the scene sheet; removed then restored by the user, 31 Oct 2026.
- Exception: B09-02 holds through the 90-frame loop hold to F2596 (scene sheet: F2595 shows the line).
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
FPS = 30
PREROLL = 45
TOTAL = 2596
HOLD_END = 2596
THR = 0.04
TOL = 3

# Plate shot table: (shot, start, length), from src/painted/shots/hanako.tsx HANAKO_G1..G3.
SHOTS = [
    ('B01-SH01', 0, 117), ('B01-SH02', 117, 187), ('B02-SH01', 304, 139), ('B03-SH01', 443, 202),
    ('B04-SH01', 645, 255), ('B05-SH01', 900, 116), ('B05-SH02', 1016, 156), ('B06-SH01', 1172, 177),
    ('B06-SH02', 1349, 239), ('B07-SH01', 1588, 190), ('B07-SH02', 1778, 162), ('B07-SH03', 1940, 106),
    ('B08-SH01', 2046, 256), ('B09-SH01', 2302, 294),
]
# Runtime scenes = beats (scene sheet "runtime mapping" scene 1..9). Dissolves (painted dissolveSec 0.5) at shot starts.
SCENES = [
    ('B01', 0, 304, [('B01-SH01', False), ('B01-SH02', True)]),
    ('B02', 304, 443, [('B02-SH01', False)]),
    ('B03', 443, 645, [('B03-SH01', False)]),
    ('B04', 645, 900, [('B04-SH01', False)]),
    ('B05', 900, 1172, [('B05-SH01', False), ('B05-SH02', False)]),
    ('B06', 1172, 1588, [('B06-SH01', False), ('B06-SH02', True)]),
    ('B07', 1588, 2046, [('B07-SH01', False), ('B07-SH02', False), ('B07-SH03', False)]),
    ('B08', 2046, 2302, [('B08-SH01', True)]),
    ('B09', 2302, 2596, [('B09-SH01', False)]),
]

# Cue table. kind: 'speech' (voice-lock measured) or 'event' (knock captions). sheet = scene-sheet proposed [g0, g1).
# anchor = Whisper anchor id compared as a cross-check only (its onF is +-0.2 s).
UNITS = [
    ('KN-1', 'B01', 'ก๊อก', 'event', (4, 18), 'B01-SH01', None),
    ('KN-2', 'B01', 'ก๊อก ก๊อก', 'event', (18, 31), 'B01-SH01', None),
    ('KN-3', 'B01', 'ก๊อก ก๊อก ก๊อก', 'event', (31, 46), 'B01-SH01', None),
    ('B01-01', 'B01', 'ชั้นสาม… ห้องน้ำหญิง', 'speech', (46, 117), 'B01-SH01', None),
    ('B01-02', 'B01', 'ห้องที่สาม เคาะสามครั้ง แล้วถามว่า…', 'speech', (117, 251), 'B01-SH02', 'B01-a2'),
    ('B01-03', 'B01', '“ฮานาโกะซัง อยู่ไหมคะ?”', 'speech', (251, 304), 'B01-SH02', None),
    ('B02-01', 'B02', 'ตามที่เล่ากันบ่อย ๆ…', 'speech', (305, 349), 'B02-SH01', None),
    ('B02-02', 'B02', 'จะมีเสียงตอบกลับมาว่า…', 'speech', (349, 417), 'B02-SH01', 'B02-a2'),
    ('KA-01', 'KA', '“ค่ะ”', 'speech', (417, 443), 'B02-SH01', None),
    ('B03-01', 'B03', 'เธอคือฮานาโกะซัง', 'speech', (444, 513), 'B03-SH01', 'B03-a1'),
    ('B03-02', 'B03', 'ผีห้องน้ำโรงเรียน', 'speech', (513, 557), 'B03-SH01', None),
    ('B03-03', 'B03', 'ที่เด็กญี่ปุ่นเล่าต่อกันมาหลายรุ่น', 'speech', (557, 645), 'B03-SH01', None),
    ('B04-01', 'B04', 'แต่เธอเป็นใคร?', 'speech', (646, 707), 'B04-SH01', 'B04-a1'),
    ('B04-02', 'B04', 'บางคนเล่าว่า\nเธอตายตอนระเบิดลงสมัยสงคราม', 'speech', (707, 820), 'B04-SH01', 'B04-a2'),
    ('B04-03', 'B04', 'บ้างก็ว่า ถูกฆ่าในห้องน้ำ', 'speech', (820, 900), 'B04-SH01', 'B04-a3'),
    ('B05-01', 'B05', 'ถ้าเรื่องพวกนี้จริง\nก็น่าจะมีร่องรอยของเธอสักที่…', 'speech', (903, 1027), 'B05-SH01', 'B05-a1'),
    ('B05-02', 'B05', 'แต่ยังไม่พบหลักฐานเลย', 'speech', (1027, 1078), 'B05-SH02', 'B05-a2'),
    ('B05-03', 'B05', 'ว่ามีเด็กผู้หญิงจริง ๆ ที่เป็นต้นเรื่อง', 'speech', (1078, 1172), 'B05-SH02', None),
    ('B06-01', 'B06', 'เรื่องฮานาโกะที่เก่าที่สุดเท่าที่รู้กัน', 'speech', (1173, 1256), 'B06-SH01', 'B06-a0'),
    ('B06-02', 'B06', 'มาจากอิวาเตะ ราวปี 1948…', 'speech', (1256, 1372), 'B06-SH01', 'B06-a1'),
    ('B06-03', 'B06', 'บันทึกนั้นไม่ใช่ข่าว…', 'speech', (1372, 1430), 'B06-SH02', None),
    ('B06-04', 'B06', 'แต่เป็นเรื่องผีที่มีคนเล่าไว้', 'speech', (1430, 1502), 'B06-SH02', 'B06-a4'),
    ('B06-05', 'B06', 'แล้วถูกเก็บลงหนังสือ หลายสิบปีต่อมา', 'speech', (1502, 1588), 'B06-SH02', None),
    ('B07-01', 'B07', 'แล้วเธอดังได้ยังไง?', 'speech', (1589, 1653), 'B07-SH01', 'B07-a1'),
    ('B07-02', 'B07', 'ยุค 80 ครูคนหนึ่ง\nเก็บเรื่องผีที่นักเรียนเล่าให้ฟัง', 'speech', (1653, 1782), 'B07-SH01', 'B07-a2'),
    ('B07-03', 'B07', 'หนังสือของเขาปี 1990', 'speech', (1782, 1860), 'B07-SH02', None),
    ('B07-04', 'B07', 'ช่วยพาเรื่องพวกนี้ไปทั่วญี่ปุ่น', 'speech', (1860, 1941), 'B07-SH02', None),
    ('B07-05', 'B07', 'พอกลางยุค 90…', 'speech', (1941, 1994), 'B07-SH03', 'B07-a5'),
    ('B07-06', 'B07', 'ฮานาโกะซังก็มีหนังของตัวเอง', 'speech', (1994, 2066), 'B07-SH03', None),
    ('B08-01', 'B08', 'ฮานาโกะซังอาจไม่เคยมีตัวตนจริง…', 'speech', (2066, 2147), 'B08-SH01', 'B08-a1'),
    ('B08-02', 'B08', 'แต่เธอก็ไม่เคยหายไป', 'speech', (2147, 2217), 'B08-SH01', 'B08-a2'),
    ('B08-03', 'B08', 'เพราะเด็กรุ่นแล้วรุ่นเล่า', 'speech', (2217, 2273), 'B08-SH01', 'B08-a3'),
    ('B08-04', 'B08', 'เล่าเรื่องเธอต่อกันมา', 'speech', (2273, 2303), 'B08-SH01', None),
    ('B09-01', 'B09', 'และเธอจะกลับมาอีกครั้ง…', 'speech', (2303, 2416), 'B09-SH01', None),
    ('B09-02', 'B09', 'ทุกครั้งที่ใครสักคน ยกมือขึ้นเคาะ', 'speech', (2416, 2596), 'B09-SH01', 'B09-a2'),
]
# Scene-sheet "held through" cues are exceptions to the measured end (reason in the report).
HOLD_UNITS = {'B09-02': 'loop hold: scene sheet B09 "F2595 shows the line" (held to the composition end)'}


def load():
    amp = json.load(open(os.path.join(ROOT, 'public/narration/HANAKO-SHORT.amplitude.json')))
    vm = json.load(open(os.path.join(HERE, 'voice-measure.json')))
    beats = {k: (v['timelineOnF'], v['timelineOffF']) for k, v in vm['beats'].items()}
    anchors = {a['id']: a for a in vm['anchors']}
    return amp, beats, anchors


def build():
    amp, beats, anchors = load()
    n = len(amp)
    assert n == 2461 and TOTAL == PREROLL + n + 90, 'track length mismatch'

    def speech(f):  # timeline frame
        t = f - PREROLL
        return 0 <= t < n and amp[t] >= THR

    def gap_end_near(s):
        """First speech frame after a low-energy gap, closest to the sheet split s (+-TOL)."""
        best = None
        for f in range(s - TOL, s + TOL + 1):
            if speech(f) and not speech(f - 1) and (best is None or abs(f - s) < abs(best - s)):
                best = f
        return best

    def last_speech_before(nxt):
        f = nxt - 1
        while f > 0 and not speech(f):
            f -= 1
        return f + 1

    beat_units = {}
    for u in UNITS:
        beat_units.setdefault(u[1], []).append(u)

    # Pass 1: onsets.
    onset, rule = {}, {}
    for uid, beat, text, kind, (s0, s1), shot, anchor in UNITS:
        if kind == 'event':
            onset[uid] = s0
            rule[uid] = 'event: scene-sheet knock frame (no measured line; not compared)'
            continue
        if beat == 'KA':
            onset[uid] = beats['KA'][0]
            rule[uid] = 'beat on (voice lock, reply clip)'
            continue
        first = beat_units[beat][0][0] == uid
        if first:
            onset[uid] = beats[beat][0]
            rule[uid] = 'beat on (voice lock 300-sample rule)'
        else:
            g = gap_end_near(s0)
            if g is None:
                raise SystemExit(f'{uid}: no low-energy gap end within +-{TOL} f of sheet split {s0}')
            onset[uid] = g
            rule[uid] = f'word onset: gap end {g} (4 % envelope; sheet split {s0})'

    # Pass 2: ends.
    cues = []
    order = [u for u in UNITS]
    for i, (uid, beat, text, kind, (s0, s1), shot, anchor) in enumerate(order):
        if kind == 'event':
            end = s1
            built_rule = rule[uid]
        else:
            same_beat = [u for u in beat_units[beat] if u[3] == 'speech']
            last_in_beat = same_beat[-1][0] == uid
            if uid in HOLD_UNITS:
                end = HOLD_END
                built_rule = 'held to composition end: ' + HOLD_UNITS[uid]
            elif beat == 'KA':
                end = beats['KA'][1]
                built_rule = 'beat off (voice lock, reply clip)'
            elif last_in_beat:
                end = beats[beat][1]
                built_rule = 'beat off (voice lock 300-sample rule)'
            else:
                nxt = next(u[0] for u in order[i + 1:] if u[3] == 'speech' and u[1] == beat)
                end = last_speech_before(onset[nxt])
                built_rule = f'last speech frame before {nxt} onset (4 % envelope)'
        cues.append({'id': uid, 'beat': beat, 'text': text, 'kind': kind, 'g0': onset.get(uid, s0), 'g1': end,
                     'shot': shot, 'rule': rule.get(uid, built_rule) if kind != 'event' else rule[uid],
                     'endRule': built_rule, 'sheet': {'g0': s0, 'g1': s1}, 'anchor': anchor})

    # Measured reference: beat edges from the voice lock, internal edges from the 4 % envelope (same as built), exceptions noted.
    for c in cues:
        if c['kind'] == 'event':
            c.update({'measured': None, 'anchorOnF': None, 'diffMeasured': None, 'builtVsMeasured': None, 'anchorVsBuilt': None})
            continue
        if c['beat'] == 'KA':
            c['measured'] = {'g0': beats['KA'][0], 'g1': beats['KA'][1]}
        else:
            c['measured'] = {'g0': c['g0'], 'g1': c['g1'] if c['id'] not in HOLD_UNITS else beats[c['beat']][1]}
        c['anchorOnF'] = anchors[c['anchor']]['timelineOnF'] if c['anchor'] else None
        c['diffMeasured'] = None if c['measured'] is None else {
            'g0': c['sheet']['g0'] - c['measured']['g0'], 'g1': c['sheet']['g1'] - c['measured']['g1']}
        c['builtVsMeasured'] = None if c['measured'] is None else {
            'g0': c['g0'] - c['measured']['g0'], 'g1': c['g1'] - c['measured']['g1']}
        c['anchorVsBuilt'] = None if c['anchorOnF'] is None else c['anchorOnF'] - c['g0']

    # Sanity: no overlaps inside a beat, cues inside scenes and beats, monotonic.
    for a, b in zip(cues, cues[1:]):
        if a['kind'] == 'speech' and b['kind'] == 'speech' and a['beat'] == b['beat']:
            assert a['g1'] <= b['g0'], (a['id'], b['id'])
        assert a['g0'] < a['g1'], a['id']
    return cues, beats


def scenes_json(cues):
    scenes = []
    for beat, s0, s1, shots in SCENES:
        cs = [c for c in cues if s0 <= c['g0'] < s1]
        sub = []
        t = s0
        for c in sorted(cs, key=lambda c: c['g0']):
            if c['g0'] > t:
                sub.append({'atSec': (t - s0) / FPS, 'text': ''})
            sub.append({'atSec': (c['g0'] - s0) / FPS, 'text': c['text']})
            t = c['g1']
        if t < s1:
            sub.append({'atSec': (t - s0) / FPS, 'text': ''})
        if not sub or sub[0]['atSec'] != 0:
            sub.insert(0, {'atSec': 0.0, 'text': ''})
        painted = []
        for shot, dissolve in shots:
            start = next(st for sh, st, _ in SHOTS if sh == shot)
            cue = {'shot': f'HANAKO-{shot}', 'atSec': (start - s0) / FPS}
            if dissolve:
                cue['dissolveSec'] = 0.5
            painted.append(cue)
        scenes.append({'durationSec': (s1 - s0) / FPS, 'bg': 'none', 'actors': [], 'subtitle': '',
                       'subtitleCues': sub, 'painted': {'shots': painted}})
    return scenes


def check_frames(scenes):
    total = sum(round(s['durationSec'] * FPS) for s in scenes)
    assert total == TOTAL, total
    for shot, start, length in SHOTS:
        assert start + length <= TOTAL
    for beat, s0, s1, shots in SCENES:
        for shot, _ in shots:
            st, ln = next((st, ln) for sh, st, ln in SHOTS if sh == shot)
            assert s0 <= st and st + ln <= s1, shot


def main():
    cues, beats = build()
    scenes = scenes_json(cues)
    check_frames(scenes)
    if '--check' in sys.argv:
        print('check ok')
        return
    with open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8') as f:
        json.dump(scenes, f, ensure_ascii=False, indent=1)
        f.write('\n')
    out = {'deliverable': 'HANAKO-SHORT', 'scriptRevision': 'HANAKO-SHORT-SCRIPT-R2', 'voiceLock': 'v3',
           'scene_sheet': 'HANAKO-SHORT-SCENE-R4', 'fps': FPS, 'preroll': PREROLL, 'totalFrames': TOTAL,
           'threshold': THR, 'tolerance': TOL, 'cues': cues}
    with open(os.path.join(HERE, 'cue-measure.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    flagged = [c for c in cues if c['diffMeasured'] and (abs(c['diffMeasured']['g0']) > TOL or abs(c['diffMeasured']['g1']) > TOL)]
    built_flag = [c for c in cues if c['builtVsMeasured'] and (abs(c['builtVsMeasured']['g0']) > TOL or abs(c['builtVsMeasured']['g1']) > TOL)]
    print(f'cues {len(cues)} (speech {sum(c["kind"] == "speech" for c in cues)}, event {sum(c["kind"] == "event" for c in cues)})')
    print(f'sheet vs measured, >3 f: {len(flagged)}')
    print(f'built vs measured, >3 f: {len(built_flag)} ({", ".join(c["id"] for c in built_flag)})')


if __name__ == '__main__':
    main()
