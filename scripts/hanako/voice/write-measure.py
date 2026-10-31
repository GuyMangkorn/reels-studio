"""Writes a HANAKO-SHORT voice-measure JSON from the installed track (Editor). Path-parametrised: no lock path is hard-coded.

Speech edges are measured on the delivered MP3 (the file the composition plays). Inside each beat's slot: the first and last
decoded 48 kHz mono sample with |x| >= 300 of 32767 (the builder's threshold). frame = round(sample / 1600); the end is the
last sample + 1 (exclusive), as in build-track.py. Slot starts and lengths come from the slot plan (slots.json).

Anchors come from the build's track-measure (word estimates on the clips). Each beat's anchors move by that beat's clip-head
shift: a gain applied after measuring (finish-tail.py) can move the first >= 300 sample of a clip, and the assembler trims
(first - head) samples, so the content moves by the difference of the trims / 1600 frames. Only B05 has a material shift in
the S3 tail sample (+1.20 dB); KA's head trim is not reached and moves nothing.

Proxies, not listening: align-full matchRatio, clip-asr JSON (isolated-clip Whisper ratio, name checks), drift JSON (voice-match
F0 medians), ffmpeg ebur128 on the MP3. Typed input: the fallback anchor ids (align-full stdout has no key for them).

Usage (worktree root), voice lock v3 (S3 tail re-read):
  python3 -I out/hanako-voice/final/write-measure.py \\
    --track-measure out/hanako-voice/final/s3-tail-reread/build-tail/track-measure.json \\
    --slots out/hanako-voice/final/s3-tail-reread/build-tail/track/slots.json \\
    --pcm-clips out/hanako-voice/final/s3-tail-reread/build-tail/track \\
    --installed-clips out/hanako-voice/final/s3-tail-reread/sample/HANAKO-SHORT-tail-track \\
    --mp3 public/narration/HANAKO-SHORT.mp3 --amplitude public/narration/HANAKO-SHORT.amplitude.json \\
    --anchors out/hanako-voice/final/anchors.md \\
    --align-take1 out/hanako-voice/final/measure-take1.json \\
    --align-tail out/hanako-voice/final/s3-tail-reread/measure-tail-align.json \\
    --asr-take1 out/hanako-voice/final/clip-asr-s3.json \\
    --asr-tail out/hanako-voice/final/s3-tail-reread/clip-asr-tail.json \\
    --drift-take1 out/hanako-voice/final/drift-s3.json \\
    --drift-tail out/hanako-voice/final/s3-tail-reread/drift-tail.json \\
    --tail-beats B05,B06,B07,B08,B09 --fallbacks B06-a2,B07-a3 \\
    --source narrator_read_raw_take1=out/hanako-voice/final/HANAKO-NARR-raw.wav \\
    --source narrator_tail_raw=out/hanako-voice/final/s3-tail-reread/tail-raw.wav \\
    --out scripts/hanako/short/voice-measure.json
"""
import argparse, array, hashlib, json, math, re, subprocess, unicodedata, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
RATE, FPS, FRAME, THRESH, PRE, HOLD = 48000, 30, 1600, 300, 45, 90
ORDER = ['B01', 'B02', 'KA', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09']
NAMES = {'ฮานาโกะซัง': ['B01', 'B03', 'B08'], 'อิวาเตะ': ['B06']}


def rel(p):
    p = Path(p).resolve()
    try:
        return str(p.relative_to(ROOT))
    except ValueError:
        return str(p)


def jload(p):
    return json.loads(Path(p).read_text(encoding='utf-8'))


def sha16(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()[:16]


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    a = array.array('h')
    a.frombytes(raw)
    return a


def read_wav(path):
    with wave.open(str(path)) as w:
        a = array.array('h')
        a.frombytes(w.readframes(w.getnframes()))
        return a


def clip_first(a):
    return next(i for i, v in enumerate(a) if abs(v) >= THRESH)


def span_edges(x, lo, hi):
    """First and last-exclusive sample index with |x| >= THRESH in [lo, hi), or None."""
    first = next((i for i in range(lo, hi) if abs(x[i]) >= THRESH), None)
    if first is None:
        return None
    last = next(i for i in range(hi - 1, lo - 1, -1) if abs(x[i]) >= THRESH)
    return first, last + 1


def fr(sample):
    return math.floor(sample / FRAME + 0.5)


def lufs(path):
    err = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    summary = err[err.rindex('Summary:'):]
    return (float(re.search(r'I:\s+(-?[\d.]+) LUFS', summary).group(1)),
            float(re.search(r'LRA:\s+([\d.]+) LU', summary).group(1)),
            float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summary).group(1)))


def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '\u0e00' <= ch <= '\u0e7f')


def name_score(heard, name):
    """Best difflib ratio of the name against any window of the heard text (proxy for a garbled name)."""
    import difflib
    h, n = norm(heard), norm(name)
    best, window = 0.0, ''
    for size in range(len(n) - 2, len(n) + 3):
        for i in range(0, max(1, len(h) - size + 1)):
            cand = h[i:i + size]
            r = difflib.SequenceMatcher(None, n, cand, autojunk=False).ratio()
            if r > best:
                best, window = r, cand
    return round(best, 2), window


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--track-measure', required=True, help='build track-measure.json (anchors, build edges)')
    ap.add_argument('--slots', required=True)
    ap.add_argument('--pcm-clips', required=True, help='build clips dir (<BEAT>.wav, before any gain)')
    ap.add_argument('--installed-clips', required=True, help='clips dir the delivered MP3 was assembled from')
    ap.add_argument('--mp3', required=True)
    ap.add_argument('--amplitude', default=None)
    ap.add_argument('--anchors', required=True)
    ap.add_argument('--align-take1', required=True)
    ap.add_argument('--align-tail', required=True)
    ap.add_argument('--asr-take1', required=True)
    ap.add_argument('--asr-tail', required=True)
    ap.add_argument('--drift-take1', required=True)
    ap.add_argument('--drift-tail', required=True)
    ap.add_argument('--tail-beats', required=True, help='comma list of beats read from the tail-read files')
    ap.add_argument('--fallbacks', required=True, help='comma list of fallback anchor ids (typed from align-full stdout)')
    ap.add_argument('--source', action='append', default=[], help='LABEL=PATH, recorded with sha256 prefix')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()

    tm = jload(a.track_measure)
    slots = jload(a.slots)
    tail = set(a.tail_beats.split(','))
    fallbacks = a.fallbacks.split(',')
    align = {'take1': jload(a.align_take1), 'tail': jload(a.align_tail)}
    asr = {'take1': jload(a.asr_take1), 'tail': jload(a.asr_tail)}
    drift = {'take1': jload(a.drift_take1), 'tail': jload(a.drift_tail)}
    src_of = lambda b: 'tail' if b in tail else 'take1'

    # slot plan (integer frames, cumulative starts) and the installed track
    slot_frames = {s['beat']: round(s['durationSec'] * FPS) for s in slots}
    slot_start, cursor = {}, 0
    for s in slots:
        slot_start[s['beat']] = cursor
        cursor += slot_frames[s['beat']]
    for b in ORDER:
        if b in tm['beats']:  # the build's track-measure has no KA entry
            assert slot_start[b] == tm['beats'][b]['slotStartF'], f'slot start mismatch {b}'
    track = decode(a.mp3)
    assert len(track) == cursor * FRAME, f'track {len(track) / FRAME} frames != slot plan {cursor}'

    # installed edges per beat, inside its own slot
    installed = {}
    for b in ORDER:
        lo, hi = slot_start[b] * FRAME, (slot_start[b] + slot_frames[b]) * FRAME
        e = span_edges(track, lo, hi)
        assert e is not None, f'no audible sample in {b}'
        installed[b] = (fr(e[0] - lo) + slot_start[b], fr(e[1] - lo) + slot_start[b])

    # clip-head shift per beat (content moved by a gain applied after measuring)
    shift = {}
    head = {s['beat']: round(s['trimHeadSec'] * RATE) for s in slots}
    for b in ORDER:
        pcm = read_wav(Path(a.pcm_clips) / f'{b}.wav')
        inst = read_wav(Path(a.installed_clips) / f'{b}.wav')
        # the assembler drops (first - head) samples only when that is positive; the content moves by the difference
        shift[b] = (max(clip_first(pcm) - head[b], 0) - max(clip_first(inst) - head[b], 0)) / FRAME

    build = {b: (tm['beats'][b]['speechOnF'], tm['beats'][b]['speechOffF']) for b in ORDER if b in tm['beats']}
    beats, gaps, prev = {}, {}, None
    for b in ORDER:
        on, off = installed[b]
        beats[b] = {'slotStartF': slot_start[b], 'slotFrames': slot_frames[b], 'speechOnF': on, 'speechOffF': off,
                    'speechFrames': off - on, 'timelineOnF': on + PRE, 'timelineOffF': off + PRE}
        if prev:
            gaps[f'{prev}|{b}'] = on - beats[prev]['speechOffF']
        prev = b
    measure_vs_build = [{'beat': b, 'build_on_off': list(build[b]), 'installed_on_off': list(installed[b])}
                        for b in build if build[b] != installed[b]]

    anchors_pcm = tm['anchors']
    phrases = {}
    for line in Path(a.anchors).read_text(encoding='utf-8').splitlines():
        m = re.match(r'^\| `(B\d\d-a\d)` \| ([^|]+?) \| ', line)
        if m:
            phrases[m.group(1)] = m.group(2).strip()
    anchors = []
    for an in anchors_pcm:
        s = shift[an['beat']]
        on_f = math.floor(an['onF'] + s + 0.5)
        end_f = math.floor(an['endF'] + s + 0.5)
        anchors.append({'id': an['id'], 'phrase': phrases[an['id']], 'onF': on_f, 'endF': end_f, 'timelineOnF': on_f + PRE})
    missing = [an['id'] for an in anchors_pcm if an['id'] not in phrases]
    assert not missing, f'anchor phrases missing in anchors.md: {missing}'

    def asr_beat(b):
        return asr[src_of(b)]['beats'][b]

    f0 = {b: drift[src_of(b)]['beats'][b]['f0_median_hz'] for b in ORDER if b != 'KA' and b in drift[src_of(b)]['beats']}
    opening = sum(f0[b] for b in ['B01', 'B02', 'B03', 'B04']) / 4
    late = sum(f0[b] for b in ['B07', 'B08', 'B09']) / 3
    late5 = sum(f0[b] for b in ['B05', 'B06', 'B07', 'B08', 'B09']) / 5
    lufs_i, lra, peak = lufs(a.mp3)
    name_checks = {name: {b: {'best_ratio': name_score(asr_beat(b)['heard'], name)[0],
                              'best_window': name_score(asr_beat(b)['heard'], name)[1]} for b in beat_list}
                   for name, beat_list in NAMES.items()}

    speech_narr = sum(beats[b]['speechFrames'] for b in ORDER if b != 'KA')
    total = PRE + cursor + HOLD
    sources = {'files': {label: rel(path) for label, path in (x.split('=', 1) for x in a.source)},
               'sha256_16': {label: sha16(path) for label, path in (x.split('=', 1) for x in a.source)}}
    doc = {
        'deliverable': 'HANAKO-SHORT', 'script_revision': 'HANAKO-SHORT-SCRIPT-R2', 'voice_lock': 'v3 (S3, B05-B09 tail re-read)',
        'timing_status': 'audio-measured',
        'lock_basis': "user instruction 31 Oct 2026 ('use it as the new lock') on the S3 tail re-read sample; Editor proxy QA only, not heard",
        'measure_by': 'Editor (voice lock v3), 31 Oct 2026', 'fps': FPS,
        'measure_basis': 'installed MP3: first and last decoded 48 kHz sample with |x| >= 300 of 32767 inside each slot; frame = round(sample / 1600); end exclusive',
        'frame_origin': 'track frame 0 = public/narration/HANAKO-SHORT.mp3 start; timeline frame = track frame + preroll_frames',
        'preroll_frames': PRE, 'hold_frames': HOLD,
        'track_frames': cursor, 'track_s': round(cursor / FPS, 3),
        'timeline_total_frames': total, 'timeline_total_s': round(total / FPS, 3),
        'speech_frames_narrator': speech_narr, 'speech_frames_reply': beats['KA']['speechFrames'],
        'written_pause_gaps_frames': gaps, 'written_pause_total_frames': sum(gaps.values()),
        'beats': beats, 'anchors': anchors,
        'anchor_precision': 'Whisper (large-v3-turbo) word estimates, about +-0.2 s; beat onsets and ends are energy measures (+-1 frame; a soft onset can cross the 300 threshold up to ~2 frames late)',
        'anchor_fallbacks': fallbacks,
        'anchor_shift_frames': {b: round(shift[b], 3) for b in ORDER if abs(shift[b]) >= 0.01},
        'measure_vs_build': measure_vs_build,
        'sources': dict(sources, **{
            'narrator_voice': 'Charon', 'narrator_model': 'gemini-3.8-flash-tts',
            'narrator_read_style': 'calm documentary mystery narrator, crisp clear articulation of every word, brisk steady pace, low resonant voice, not whispered',
            'narrator_read_take': 'B01-B04 and KA: take 1 (unchanged clips). B05-B09: tail re-read, one Gemini request (Charon, B05-B09 of the same tts-beats, joined with one space).',
            'track': 'public/narration/HANAKO-SHORT.mp3 (gitignored), public/narration/HANAKO-SHORT.amplitude.json (2461 frames, per-frame RMS of the delivered MP3, peak = 1.0)',
            'track_sha256_16': sha16(a.mp3),
            'slot_plan': 'out/hanako-voice/final/s3-tail-reread/build-tail/track/slots.json (sample build, slots recomputed from the audible edges)',
            'builder': 'out/hanako-voice/final/s3-tail-reread/build-tail-track.py; gain: finish-tail.py (+1.20 dB, clipping refused)',
            'superseded_lock': 'out/hanako-voice/final/lock-v2-s3take1/ (manifest.sha256; restore by copying its HANAKO-SHORT.mp3, HANAKO-SHORT.amplitude.json, voice-measure.json, voice-measure.md, delivery.md, build-notes.md); older lock-v1-hushed/ stays',
        }),
        'qa': {
            'align_match_ratio': {'B01-B04 and KA (take 1, full read)': align['take1']['matchRatio'],
                                  'B05-B09 (tail read, 21 anchors)': align['tail']['matchRatio']},
            'align_anchor_inside_phrase': 'tail read B05-B09: 19 of 21 (fallback B06-a2, B07-a3); take 1 B01-B04 and KA: no fallback (the take-1 fallback B07-a3 is superseded)',
            'per_beat_isolated_clip_asr_ratio': {b: asr_beat(b)['ratio'] for b in ORDER if b != 'KA'},
            'per_beat_isolated_clip_asr_mean': round(sum(asr_beat(b)['ratio'] for b in ORDER if b != 'KA') / 9, 3),
            'name_checks_fuzzy': name_checks,
            'reply_clip_asr': {k: v['heard'] for k, v in asr['tail']['reply'].items()},
            'f0_median_hz_per_beat': f0,
            'f0_opening_B01_B04_mean_hz': round(opening, 1), 'f0_late_B07_B09_mean_hz': round(late, 1),
            'f0_late_vs_opening_pct': round(100 * (late / opening - 1), 1),
            'f0_late_B05_B09_mean_hz': round(late5, 1), 'f0_late_B05_B09_vs_opening_pct': round(100 * (late5 / opening - 1), 1),
            'f0_windows_10s': 'not carried: the tail windows are on the read time base, not the track',
            'track_loudness_lufs_integrated': lufs_i, 'track_lra_lu': lra, 'track_sample_peak_dbfs': peak,
            'method': 'proxies: align-full (difflib on Whisper words), clip-asr.py (Whisper isolated clips), beat-drift.py (voice-match metrics), ffmpeg ebur128',
        },
        'open_for_ear': [
            'B05 is measured on the installed audio: the +1.20 dB gain moved its clip head by %.2f frames (anchors shifted, edges re-measured); the B05|B06 written pause is %d frames (8 designed on the un-gained clips)' % (shift['B05'], gaps['B05|B06']),
            'late pitch: F0 medians B07-B09 %+.1f %% over B01-B04 (superseded lock +24.2 %%); B05 and B07 sit above the opening; the user decides by ear' % (100 * (late / opening - 1)),
            'B09: 0.5 s pause before the final clause «ยกมือขึ้นเคาะ», the speech ends at the track end (frame %d)' % beats['B09']['speechOffF'],
            'name «ฮานาโกะซัง» in B01, B03, B08 and «อิวาเตะ» in B06 (see qa.name_checks_fuzzy)',
            'reply «ค่ะ» (KA-T1, unchanged): no take passes the ASR proxy',
        ],
        'not_verified_by_ear': True,
    }
    out = Path(a.out)
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({'written': rel(out), 'track_frames': cursor, 'timeline_total_frames': total,
                      'timeline_total_s': doc['timeline_total_s'], 'written_pause_gaps_frames': gaps,
                      'written_pause_total_frames': doc['written_pause_total_frames'], 'speech_narrator': speech_narr,
                      'measure_vs_build': measure_vs_build, 'anchor_shift_frames': doc['anchor_shift_frames'],
                      'loudness': [lufs_i, lra, peak], 'anchors': len(anchors)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
