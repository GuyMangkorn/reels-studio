"""KSO voice lock v4: write scripts/kuchisake-onna/short/voice-measure.json from the v3 measure plus the v4 QA files.

v4 changes only the audio of one word (โทษ in NARR ขอโทษนะ, S03-B02, KSO-A16) at the same length, so anchors, beats,
slots and budget are carried from v3 unchanged, and this script asserts that. Everything v4-specific is read from the
QA files written by pitch-fix-v4.py, v4-check.py and measure-loudness.mjs (see the reproduce list in the file).

Run (worktree root): python3 -I scripts/kuchisake-onna/short/voice-lock/update-measure-v4.py \
    --base "$REELS_STORE/projects/KSO/audio/voice-lock-r3/voice-measure-v3.json" \
    --pitch-qa out/kso-ep01-short/voice-lock-v4/qa/pitch-fix-v4.json \
    --check-qa out/kso-ep01-short/voice-lock-v4/qa/v4-check.json \
    --loudness out/kso-ep01-short/voice-lock-v4/qa/loudness-v4.jsonl
"""
import argparse, copy, hashlib, json
from pathlib import Path

OUT = Path('scripts/kuchisake-onna/short/voice-measure.json')
V4_TRACK = Path('out/kso-ep01-short/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3')
V4_CLIP = Path('out/kso-ep01-short/voice-lock-v4/segments-v4/B06.wav')
STORE = 'projects/KSO/audio/voice-lock-v4'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True)
    ap.add_argument('--pitch-qa', required=True)
    ap.add_argument('--check-qa', required=True)
    ap.add_argument('--loudness', required=True)
    a = ap.parse_args()
    base = json.loads(Path(a.base).read_text(encoding='utf-8'))
    pitch = json.loads(Path(a.pitch_qa).read_text(encoding='utf-8'))
    check = json.loads(Path(a.check_qa).read_text(encoding='utf-8'))
    loud = [json.loads(line) for line in Path(a.loudness).read_text(encoding='utf-8').splitlines() if line.strip()]
    v4_track, v3_track, v4_clip, v3_clip = loud  # measure-loudness.mjs order: v4 track, v3 track, v4 B06, v3 B06
    d = copy.deepcopy(base)

    # the v4 change must not move any frame of the lock
    assert check['track_frame_count_equal'] and check['tracks']['v4']['frames'] == base['track']['lengthFrames'] == 2461
    assert [s['slot'] for s in d['slots']] == [s['slot'] for s in base['slots']]

    track_sha, clip_sha = sha(V4_TRACK), sha(V4_CLIP)
    d['revision'] = 'v4'
    d['supersedes'] = 'v3 (KSO-SCRIPT-R3): projects/KSO/audio/voice-lock-r3/voice-measure-v3.json'
    d['voice_lock'] = ('v4: NARR Erinome read (B01-B05, v2) and the B06 read (v3 chunk) unchanged except one pitch fix on '
                       'โทษ in the NARR apology ขอโทษนะ (B06, S03-B02, KSO-A16); WOMAN Despina takes and the panic slip '
                       'unchanged. Script text unchanged (KSO-SCRIPT-R3).')
    d['lock_basis'] = ('v3 basis (see the v3 record) + user verdict on S03-B02-SH01 (1 Nov 2026): the word โทษ in ขอโทษ '
                       'should be higher, it reads too low. Fix: +1.5 semitones on that word only, length-preserving, '
                       'anchors, slots and frames unchanged (track 2461 frames, 82.033 s). Editor proxy QA only: nobody '
                       'listened; the user listens (see open_items).')
    d['measure_by'] = 'Editor (voice lock v4, KSO-SCRIPT-R3 text), 2026-11-01'
    d['track'] = {
        'file': str(V4_TRACK), 'store': f'{STORE}/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3',
        'amplitude': f'{STORE}/final/KSO-EP01-SHORT_narration_voicelock-v4.amplitude.json',
        'repo_amplitude': 'scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json',
        'sha256': track_sha, 'lengthFrames': 2461, 'lengthS': 82.033,
        'v3_sha256': base['track']['sha256'],
    }
    d['takes'] = [t for t in base['takes'] if t['id'] != 'TAKE-NARR-B06-V4'] + [
        {'id': 'TAKE-NARR-B06-V4', 'what': ('NARR B06 clip v4 = the v3 B06 clip (take2) with the pitch fix on โทษ '
                                            '(pitch-fix-v4.py); all other samples equal v3 except MP3 re-encode noise'),
         'file': str(V4_CLIP), 'store': f'{STORE}/segments-v4/B06.wav', 'new': True, 'sha256': clip_sha},
    ] + [
        {'id': f'TAKE-NARR-B06-TAIL-ALT{n}', 'what': ('ALTERNATIVE, not in the lock: Erinome tail-only take, style as the '
                                                     'B06 read, text <whispering> ขอโทษนะ, ที่เล่าให้ฟัง; measured '
                                                     'ขอโทษนะ 0.9 s vs 1.3 s in v3 (Whisper), tail speech 1.8-2.0 s vs 2.5 s (about 25 % faster)'),
         'file': f'out/kso-ep01-short/voice-lock-v4/takes/B06-tail_take{n}.wav',
         'store': f'{STORE}/takes/B06-tail_take{n}.wav', 'new': True, 'sha256': sha(f'out/kso-ep01-short/voice-lock-v4/takes/B06-tail_take{n}.wav')}
        for n in (1, 2, 3)
    ]
    for edit in d['clip_edits']:
        if edit['clip'] == 'B06':
            edit['v4_pitch_fix'] = {k: pitch[k] for k in ['pitch_st', 'ratio', 'context_s', 'span_s', 'ramp_in_s', 'ramp_out_s',
                                                          'lag_samples', 'span_gain_db', 'changed_window_s', 'changed_samples']}
            edit['v4_pitch_fix']['method'] = pitch['method']
            edit['v4_pitch_fix']['f0_vowel_1458_1472_before'] = pitch['f0_vowel_1458_1472_before']
            edit['v4_pitch_fix']['f0_vowel_1458_1472_after'] = pitch['f0_vowel_1458_1472_after']
    d['loudness']['track'] = {'file': V4_TRACK.name, 'lufs': v4_track['i'], 'tpDb': v4_track['tp'], 'lra': v4_track['lra'],
                              'v3_lufs': v3_track['i'], 'v3_lra': v3_track['lra']}
    d['loudness']['b06_v4'] = {'file': 'segments-v4/B06.wav', 'lufs': v4_clip['i'], 'tpDb': v4_clip['tp'], 'lra': v4_clip['lra'],
                               'v3_lufs': v3_clip['i'], 'v3_lra': v3_clip['lra']}
    d['loudness']['v4_note'] = ('v4 loudness equals v3 to 0.01 LU on the track and the B06 clip (span RMS gain-matched, '
                                f"span gain {pitch['span_gain_db']} dB before the match).")
    line = check['asr_b06_clip']
    d['asr_check']['v4'] = {
        'source': f'{STORE}/qa/v4-check.json', 'proxy_only': True,
        'b06_letters_ratio': {'v3': line['v3']['ratio'], 'v4': line['v4']['ratio']},
        'b06_asr_v4': line['v4']['asr'],
        'apology_words_s_v4': line['v4']['apology_words_s'],
        'note': ('Same words in v3 and v4 (ขอโทษนะ at 14.14-14.92 s of the clip); the proxy does not test pitch. '
                 'The Whisper reading ที่เราให้ฟัง for ที่เล่าให้ฟัง is in both.'),
    }
    d['reproduce'] = [
        'out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Erinome --style "hushed, tense late-night storytelling, close to the mic" --text "<whispering> ขอโทษนะ, ที่เล่าให้ฟัง" out/kso-ep01-short/voice-lock-v4/takes/B06-tail_take{1,2}.wav (take3: same style + ", same narrator as the opening, do not speed up"); ALTERNATIVE only, not in the lock',
        'python3 -I scripts/kuchisake-onna/short/voice-lock/pitch-fix-v4.py --src out/kso-ep01-short/voice-lock-r3/segments/B06.wav --out out/kso-ep01-short/voice-lock-v4/segments-v4/B06.wav --qa out/kso-ep01-short/voice-lock-v4/qa/pitch-fix-v4.json',
        'copy every v3 clip (out/kso-ep01-short/voice-lock-r3/segments/*.wav) into out/kso-ep01-short/voice-lock-v4/segments-v4/ except B06.wav (already v4)',
        'python3 -I scripts/narration/assemble-narration.py --clips out/kso-ep01-short/voice-lock-v4/segments-v4 --timeline scripts/kuchisake-onna/short/voice-lock/narration-slots.json --out out/kso-ep01-short/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3 (reproduces v3 bit-exact from the v3 clips: sha 9e6e7f5f...)',
        'node scripts/kuchisake-onna/short/voice-lock/measure-loudness.mjs <v4 track> <v3 track> <v4 B06.wav> <v3 B06.wav> > out/kso-ep01-short/voice-lock-v4/qa/loudness-v4.jsonl',
        'HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I scripts/kuchisake-onna/short/voice-lock/v4-check.py --qa out/kso-ep01-short/voice-lock-v4/qa/v4-check.json',
        'python3 -I scripts/kuchisake-onna/short/voice-lock/update-measure-v4.py --base <store voice-measure-v3.json> --pitch-qa ... --check-qa ... --loudness ...',
    ] + base['reproduce']
    d['v4'] = {
        'change': 'pitch fix +1.5 semitones on โทษ (NARR ขอโทษนะ, S03-B02, KSO-A16) in the B06 clip; no other clip, slot or anchor changed',
        'changed_window_track_s': [round(1887 / 30 + 14.36, 2), round(1887 / 30 + 14.79, 2)],
        'changed_track_frames_designed': [2317, 2330],
        'amplitude_differs_frames': check['amplitude']['differs_at_frames'],
        'amplitude_max_abs_diff_peak_normalized': check['amplitude']['max_abs_diff_peak_normalized'],
        'pcm_changed_frames_gt_1e-4': check['pcm_changed_frames_range'],
        'f0_vowel_14_58_14_72_before_hz': pitch['f0_vowel_1458_1472_before']['median'],
        'f0_vowel_14_58_14_72_after_hz': pitch['f0_vowel_1458_1472_after']['median'],
        'f0_span_14_42_14_74_before_hz': pitch['f0_span_before']['median'],
        'f0_span_14_42_14_74_after_hz': pitch['f0_span_after']['median'],
        'proxy_only': True,
    }
    d['open_items'] = [
        ('V4 EAR CHECK (user): S03-B02-SH01, track 77.26-77.69 s (frames 2318-2330): โทษ in ขอโทษนะ, v4 vs v3. '
         'Measured +1.5 st (vowel median 178 -> 196 Hz, span 180 -> 198 Hz). If it still sounds odd, the alternative tail take '
         f'(store {STORE}/takes/) is about 25 % faster and needs a time-fit before use.'),
        ('V4 KNOWN COST of +1.5 st: formants move about +9 % with the pitch. The vowel rising end (14.72 s clip, 258 Hz in v3) '
         'moves to about 281 Hz (estimate, x1.09; not measured). Listen for a squeak at the end of โทษ.'),
        ('V4 FINDING (Boss/Editor): the narration amplitude is a picture input (mouthAt, duck) and is in the scene cache key '
         '(scripts/segments.mjs excludes only narration.src), so any change to the amplitude JSON re-keys every scene. '
         'The v4 change differs in 22 frames only; the picture is unchanged where the amplitude is unchanged.'),
    ] + base['open_items']
    OUT.write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {OUT}: revision v4, track sha {track_sha[:12]}, clip sha {clip_sha[:12]}, frames {d["track"]["lengthFrames"]}')


if __name__ == '__main__':
    main()
