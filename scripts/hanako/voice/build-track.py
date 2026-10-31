"""HANAKO-SHORT voice lock: slot plan for the assembled track and the frame-integer measure (Editor, 31 Oct 2026).

Inputs: out/hanako-voice/final/segments/B01..B09.wav (cut-gaps.py segments of the x1.05 read, HANAKO-NARR-x105.wav), the measure-take1.json
(align-full + cut-gaps), and the reply clip KA-T1.wav (chosen take, see the measure .md).
Rules (the assembler, scripts/narration/assemble-narration.py, places each clip at its slot start):
  - each clip keeps HEAD = 1 frame (1600 samples) before its first audible sample (>= 300 of 32767); shorter lead is kept as is;
  - the slot length = audible length + ~8 frames of written pause (9 gaps: B01|B02, B02|KA, KA|B03, B03|B04 ... B08|B09);
    B09 has no tail (the B_loop hold is room tone in the timeline, not narration);
  - the timeline starts the track after the 1.5 s knock pre-roll (45 frames) and ends the hold 3 s (90 frames) after B09.
Outputs: track/<beat>.wav (copies for the assembler), track/slots.json, and the measure JSON to scripts/hanako/short/voice-measure.json
(written by the caller after review). Run: python3 -I out/hanako-voice/final/build-track.py
"""
import array, hashlib, json, math, shutil, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FINAL = ROOT / 'out/hanako-voice/final'
TRACK = FINAL / 'track'
SEG = FINAL / 'segments'
KA_WAV = ROOT / 'out/hanako-voice/KA-T1.wav'
RATE, FPS = 48000, 30
FRAME = RATE // FPS          # 1600 samples
THRESH = 300
HEAD_FRAMES = 1
GAP_FRAMES = 8
PREROLL_FRAMES, HOLD_FRAMES = 45, 90
ORDER = ['B01', 'B02', 'KA', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09']
ANCHOR_DATA = FINAL / 'measure-take1.json'


def samples(path):
    with wave.open(str(path)) as w:
        assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (RATE, 1, 2), path
        a = array.array('h')
        a.frombytes(w.readframes(w.getnframes()))
    return a


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()[:16]


measure = json.loads(ANCHOR_DATA.read_text(encoding='utf-8'))
TRACK.mkdir(parents=True, exist_ok=True)
slots, rows, cursor = [], {}, 0  # cursor in samples
for beat in ORDER:
    src = KA_WAV if beat == 'KA' else SEG / f'{beat}.wav'
    dst = TRACK / f'{beat}.wav'
    shutil.copyfile(src, dst)
    a = samples(src)
    first = next(i for i, v in enumerate(a) if abs(v) >= THRESH)
    last_excl = max(i for i, v in enumerate(a) if abs(v) >= THRESH) + 1
    head = min(first, HEAD_FRAMES * FRAME)
    audible = (last_excl - first) + head
    if beat == 'B09':
        frames = math.ceil(audible / FRAME)
    else:
        frames = round((audible + GAP_FRAMES * FRAME - HEAD_FRAMES * FRAME) / FRAME)
    assert frames * FRAME >= audible, beat
    slots.append({'beat': beat, 'durationSec': round(frames / FPS, 6), 'trimHeadSec': round(head / RATE, 6)})
    onset = cursor + head
    end = cursor + audible
    rows[beat] = {'slotStart': cursor, 'onset': onset, 'end': end, 'frames': frames, 'head': head, 'audible': audible,
                  'first': first, 'last': last_excl}
    cursor += frames * FRAME

(TRACK / 'slots.json').write_text(json.dumps(slots, indent=1) + '\n', encoding='utf-8')

# integer frames at 30 fps (track time; add PREROLL_FRAMES for timeline time)
def f(sample_pos):
    return round(sample_pos / FRAME)

out = {'track_frames': sum(r['frames'] for r in rows.values()), 'beats': {}}
gaps = []
prev_end = None
for beat in ORDER:
    r = rows[beat]
    if prev_end is not None:
        gaps.append((beat, round((r['onset'] - prev_end) / FRAME, 2)))
    prev_end = r['end']
    out['beats'][beat] = {'slotStartF': f(r['slotStart']), 'speechOnF': f(r['onset']), 'speechOffF': f(r['end']),
                          'speechFrames': f(r['end']) - f(r['onset'])}
out['gaps_frames'] = gaps
out['gap_total_frames'] = round(sum(g for _, g in gaps), 2)
out['track_total_frames'] = out['track_frames']
out['timeline_total_frames'] = PREROLL_FRAMES + out['track_frames'] + HOLD_FRAMES
out['inputs'] = {'read_x105': sha(FINAL / 'HANAKO-NARR-x105.wav'), 'KA': sha(KA_WAV)}

# anchors: Whisper estimates; relative to each beat's speech onset in the segment (cut-gaps measure)
anchors = []
for a_ in measure['anchors']:
    beat = a_['beat']
    binfo = measure['beats'][beat]
    speech_on_abs = binfo['segStart'] + binfo['speechOnRaw']
    anchors.append((a_['id'], beat, a_['onRaw'], a_['endRaw'], binfo['segStart'], speech_on_abs))
rows_anchor = []
for aid, beat, on_raw, end_raw, seg_start, speech_on_abs in anchors:
    r = rows[beat]
    on_sec_track = r['onset'] / RATE + ((seg_start + on_raw) - speech_on_abs)
    end_sec_track = r['onset'] / RATE + ((seg_start + end_raw) - speech_on_abs)
    rows_anchor.append({'id': aid, 'onF': round(on_sec_track * FPS), 'endF': round(end_sec_track * FPS)})
out['anchors'] = rows_anchor
out['slots'] = slots

(FINAL / 'track-measure.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(json.dumps({'track_frames': out['track_frames'], 'track_s': round(out['track_frames'] / FPS, 3),
                  'gap_total_frames': out['gap_total_frames'], 'gaps': gaps,
                  'timeline_total_s': round(out['timeline_total_frames'] / FPS, 3)}, ensure_ascii=False))
for beat in ORDER:
    print(beat, out['beats'][beat])
