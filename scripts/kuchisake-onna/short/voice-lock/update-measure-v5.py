"""KSO voice lock v5: write scripts/kuchisake-onna/short/voice-measure.json (revision v5) from the v4 measure plus the v5 QA files.

v5 = v4 with the same one-word edit (โทษ in NARR ขอโทษนะ, S03-B02, KSO-A16, B06 clip) shifted +3.0 semitones from v3
instead of +1.5. Length, anchors, beats, slots and budget are carried from v4 unchanged, and this script asserts that.
Everything v5-specific is read from the QA files (pitch-fix-v5.py, v5-check.py, measure-loudness.mjs). v4 stays in the
store (projects/KSO/audio/voice-lock-v4) as the A/B baseline; its measure file is kept in the v5 store folder.

Run (worktree root): python3 -I scripts/kuchisake-onna/short/voice-lock/update-measure-v5.py \
    --base "$HOME/ReelsStore/projects/KSO/audio/voice-lock-v5/measure/voice-measure-v4.json" \
    --pitch-qa out/kso-ep01-short/voice-lock-v5/qa/pitch-fix-v5.json \
    --check-qa out/kso-ep01-short/voice-lock-v5/qa/v5-check.json \
    --loudness out/kso-ep01-short/voice-lock-v5/qa/loudness-v5.jsonl
"""
import argparse, copy, hashlib, json
from pathlib import Path

OUT = Path('scripts/kuchisake-onna/short/voice-measure.json')
V5_TRACK = Path('out/kso-ep01-short/voice-lock-v5/final/KSO-EP01-SHORT_narration_voicelock-v5.mp3')
V5_CLIP = Path('out/kso-ep01-short/voice-lock-v5/segments-v5/B06.wav')
STORE = 'projects/KSO/audio/voice-lock-v5'
# measure-loudness.mjs order (run by hand, see reproduce): v5 track, v4 track, v3 track, v5 B06, v4 B06, v3 B06
LOUD_ORDER = [('KSO-EP01-SHORT_narration_voicelock-v5.mp3', 'track'), ('KSO-EP01-SHORT_narration_voicelock-v4.mp3', 'track'),
              ('KSO-EP01-SHORT_narration_voicelock-v3.mp3', 'track'), ('B06.wav', 'clip'), ('B06.wav', 'clip'), ('B06.wav', 'clip')]
SUPERSEDED = ('V4 EAR CHECK', 'V4 KNOWN COST')   # answered or replaced by the v5 items below


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
    assert len(loud) == len(LOUD_ORDER), 'loudness file must hold the six lines in measure-loudness order'
    for row, (name, _) in zip(loud, LOUD_ORDER):
        assert row['file'] == name, (row['file'], name)
    v5_track, v4_track, v3_track, v5_clip, v4_clip, v3_clip = loud
    d = copy.deepcopy(base)
    tbl, hf, lag = check['toshi_f0_hz'], check['toshi_hf_db'], check['toshi_timing_lag_vs_v3']
    amp = check['amplitude_v3_vs_v5']

    # the v5 change must not move any frame of the lock
    assert check['track_frames_v5_equal_v3'] and check['tracks']['v5']['frames'] == base['track']['lengthFrames'] == 2461
    assert pitch['length_s'] == 16.28 and pitch['samples_out'] == pitch['samples_src'] == 781440
    assert pitch['changed_window_s'] == [14.36, 14.79] and pitch['pitch_st'] == 3.0

    track_sha, clip_sha = sha(V5_TRACK), sha(V5_CLIP)
    d['revision'] = 'v5'
    d['supersedes'] = ('v4 (+1.5 st on โทษ; store projects/KSO/audio/voice-lock-v4, measure kept in '
                       f'{STORE}/measure/voice-measure-v4.json), itself v3 (projects/KSO/audio/voice-lock-r3/voice-measure-v3.json)')
    d['voice_lock'] = ('v5: NARR Erinome read (B01-B05, v2) and the B06 read (v3 chunk) unchanged except one pitch fix on '
                       'โทษ in the NARR apology ขอโทษนะ (B06, S03-B02, KSO-A16), +3.0 st from v3; WOMAN Despina takes and the '
                       'panic slip unchanged. Script text unchanged (KSO-SCRIPT-R3).')
    d['lock_basis'] = ('v3 basis (see the v3 record) + the user verdict on S03-B02-SH01 (1 Nov 2026): v4 (+1.5 st) "not sharp at '
                       'all", wants more pitch on โทษ. Fix: +3.0 st on that word only, from v3, length-preserving; anchors, '
                       'slots and frames unchanged (track 2461 frames, 82.033 s). Editor proxy QA only: nobody listened; the user '
                       'listens (see open_items).')
    d['measure_by'] = 'Editor (voice lock v5, KSO-SCRIPT-R3 text), 2026-11-01'
    d['track'] = {
        'file': str(V5_TRACK), 'store': f'{STORE}/final/KSO-EP01-SHORT_narration_voicelock-v5.mp3',
        'amplitude': f'{STORE}/final/KSO-EP01-SHORT_narration_voicelock-v5.amplitude.json',
        'repo_amplitude': 'scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json',
        'sha256': track_sha, 'lengthFrames': 2461, 'lengthS': 82.033,
        'v4_sha256': base['track']['sha256'], 'v3_sha256': base['track'].get('v3_sha256'),
        'v4_store': 'projects/KSO/audio/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3',
    }
    d['takes'] = [t for t in base['takes'] if t['id'] != 'TAKE-NARR-B06-V5'] + [
        {'id': 'TAKE-NARR-B06-V5', 'what': ('NARR B06 clip v5 = the v3 B06 clip (take2) with the pitch fix on โทษ at +3.0 st '
                                            '(pitch-fix-v5.py); all other samples equal v3 except MP3 re-encode noise'),
         'file': str(V5_CLIP), 'store': f'{STORE}/segments-v5/B06.wav', 'new': True, 'sha256': clip_sha},
    ]
    for edit in d['clip_edits']:
        if edit['clip'] == 'B06':
            edit['v5_pitch_fix'] = {k: pitch[k] for k in ['pitch_st', 'ratio', 'context_s', 'span_s', 'ramp_in_s', 'ramp_out_s',
                                                          'lag_samples', 'shifter_out_samples', 'context_samples', 'span_gain_db',
                                                          'changed_window_s', 'changed_samples']}
            edit['v5_pitch_fix']['method'] = pitch['method']
            edit['v5_pitch_fix']['f0_vowel_1458_1472_before'] = pitch['f0_vowel_1458_1472_before']
            edit['v5_pitch_fix']['f0_vowel_1458_1472_after'] = pitch['f0_vowel_1458_1472_after']
    d['loudness']['track_v4'] = base['loudness']['track']
    d['loudness']['track'] = {'file': V5_TRACK.name, 'lufs': v5_track['i'], 'tpDb': v5_track['tp'], 'lra': v5_track['lra'],
                              'v4_lufs': v4_track['i'], 'v3_lufs': v3_track['i'], 'v3_lra': v3_track['lra']}
    d['loudness']['b06_v5'] = {'file': 'segments-v5/B06.wav', 'lufs': v5_clip['i'], 'tpDb': v5_clip['tp'], 'lra': v5_clip['lra'],
                               'v4_lufs': v4_clip['i'], 'v3_lufs': v3_clip['i'], 'v3_lra': v3_clip['lra']}
    d['loudness']['v5_note'] = (f"v5 loudness equals v3 and v4 to 0.01 LU on the track; the B06 clip differs by 0.01 LU "
                                f"(span RMS gain-matched, span gain {pitch['span_gain_db']} dB before the match).")

    d['asr_check']['v5'] = {
        'source': f'{STORE}/qa/v5-check.json', 'proxy_only': True,
        'b06_letters_ratio': {'v3': check['asr_b06_clip']['v3']['ratio'], 'v4': check['asr_b06_clip']['v4']['ratio'],
                              'v5': check['asr_b06_clip']['v5']['ratio']},
        'b06_asr_v5': check['asr_b06_clip']['v5']['asr'],
        'apology_words_s_v5': check['asr_b06_clip']['v5']['apology_words_s'],
        'note': ('v5 0.961 is the same ratio the v3 read already scores in out/kso-ep01-short/voice-lock-r3/qa/asr-r3.json '
                 '(0.5 s silence padding; หยุด reads อยู่ there too). The v5-check run (no padding) scores v3 0.982. The flip is a word '
                 'before 14.2 s of the clip, where the PCM equals v3; the apology words keep their text. Not a pitch test.'),
    }
    d['reproduce'] = [
        ('out/whisper-venv/bin/python -I scripts/kuchisake-onna/short/voice-lock/pitch-fix-v5.py --src out/kso-ep01-short/voice-lock-r3/segments/B06.wav '
         '--out out/kso-ep01-short/voice-lock-v5/segments-v5/B06.wav --qa out/kso-ep01-short/voice-lock-v5/qa/pitch-fix-v5.json '
         '(default --st 3.0; a back-off run uses --st 2.5 and a different --out/--qa)'),
        'copy every v3 clip (out/kso-ep01-short/voice-lock-r3/segments/*.wav) into out/kso-ep01-short/voice-lock-v5/segments-v5/ except B06.wav (already v5)',
        'python3 -I scripts/narration/assemble-narration.py --clips out/kso-ep01-short/voice-lock-v5/segments-v5 --timeline scripts/kuchisake-onna/short/voice-lock/narration-slots.json --out out/kso-ep01-short/voice-lock-v5/final/KSO-EP01-SHORT_narration_voicelock-v5.mp3',
        'node scripts/kuchisake-onna/short/voice-lock/measure-loudness.mjs <v5 track> <v4 track> <v3 track> <v5 B06.wav> <v4 B06.wav> <v3 B06.wav> > out/kso-ep01-short/voice-lock-v5/qa/loudness-v5.jsonl',
        'HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I scripts/kuchisake-onna/short/voice-lock/v5-check.py --qa out/kso-ep01-short/voice-lock-v5/qa/v5-check.json',
        'python3 -I scripts/kuchisake-onna/short/voice-lock/update-measure-v5.py --base <store voice-lock-v5/measure/voice-measure-v4.json> --pitch-qa ... --check-qa ... --loudness ...',
    ] + base['reproduce']
    d['v5'] = {
        'change': 'pitch fix +3.0 semitones (total from v3) on โทษ (NARR ขอโทษนะ, S03-B02, KSO-A16) in the B06 clip; no other clip, slot or anchor changed',
        'changed_samples_track_s': 'strong change 77.24-77.64 s; first changed sample 77.21 s; MP3 spill to 79.16 s (about -45 dBFS after 77.72 s, same in v4)',
        'changed_track_frames_strong': [2317, 2329],
        'amplitude_differs_frames': amp['differs_at_frames'],
        'amplitude_max_abs_diff_peak_normalized': amp['max_abs_diff_peak_normalized'],
        'pcm_max_abs_outside_77.20_77.70_s': check['pcm_v3_vs_v5']['max_abs_outside_designed_window'],
        'f0_vowel_14_58_14_72_hz': {'v3': tbl['v3']['vowel']['median'], 'v4': tbl['v4']['vowel']['median'], 'v5': tbl['v5']['vowel']['median']},
        'f0_vowel_end_max_14_58_14_74_hz': {'v3': tbl['v3']['vowel_end_to_closure']['max'], 'v4': tbl['v4']['vowel_end_to_closure']['max'],
                                            'v5': tbl['v5']['vowel_end_to_closure']['max']},
        'f0_vowel_end_last4_hz_v5': tbl['v5']['vowel_end_to_closure']['last4_hz'],
        'f0_word_median_hz': {'v3': tbl['v3']['word']['median'], 'v4': tbl['v4']['word']['median'], 'v5': tbl['v5']['word']['median']},
        'f0_max_step_st_word': {'v3': tbl['v3']['max_step_st_word'], 'v4': tbl['v4']['max_step_st_word'], 'v5': tbl['v5']['max_step_st_word']},
        'hf_db_word_4_8k_8_16k': hf,
        'timing_lag_ms_word_14_42_14_74': {'v4': lag['v4']['word_14.42-14.74'], 'v5': lag['v5']['word_14.42-14.74']},
        'timing_lag_ms_vowel_end': {'v4': lag['v4']['vowel_end_14.60-14.74'], 'v5': lag['v5']['vowel_end_14.60-14.74']},
        'splice_v5_vs_v3': check['splice_v5_vs_v3'],
        'loudness_track_lufs': v5_track['i'],
        'proxy_only': True,
    }
    d['open_items'] = [
        ('V5 EAR CHECK (user): S03-B02-SH01, track 77.21-77.66 s: โทษ in ขอโทษนะ, v5 (+3.0 st) against v4 (+1.5 st, store '
         f'{STORE.rsplit("/", 1)[0]}/voice-lock-v4) and v3. Proxy F0 vowel median 178.1 (v3) -> 195.5 (v4) -> 211.0 Hz (v5). '
         'Listen for: sharp enough without a squeak at the end of โทษ, and the same narrator.'),
        ('V5 KNOWN COST of +3.0 st: formants move about +19 % (ratio 1.189). Rising end of the vowel: max 270 Hz in 14.58-14.74 s '
         '(below the 330 Hz limit; v4 242 Hz). Spectrum: the source band edge near 13.5 kHz moves up to about 16 kHz inside the word '
         '(14-16 kHz band: v3 -26.5 dB, v4 -4.0 dB, v5 +9.6 dB, word window); no narrow tone (8-16 kHz peak-to-median v3 29.3, v5 19.5 dB). '
         'Listen for brightness or sizzle on the word against the rest of the track. Fix if heard: a low-pass near 13.5 kHz on the '
         'shifted span (a method change; needs the user to ask for it).'),
        ('V5 PROXY LIMIT: Whisper letters ratio 0.961 (v3 0.982 in the v5 run; v4 0.982). The v3 read in asr-r3.json already scores '
         '0.961 with the same flip (หยุด reads อยู่), so the drop is not from v5. Not a pitch test.'),
        ('V4 ANSWERED (user, 1 Nov 2026): v4 is "not sharp at all"; the user asked for more pitch on โทษ, so v5 (+3.0 st). '
         'v4 stays in the store as the A/B baseline (projects/KSO/audio/voice-lock-v4).'),
    ] + [o for o in base['open_items'] if not o.startswith(SUPERSEDED)]
    OUT.write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {OUT}: revision v5, track sha {track_sha[:12]}, clip sha {clip_sha[:12]}, frames {d["track"]["lengthFrames"]}')


if __name__ == '__main__':
    main()
