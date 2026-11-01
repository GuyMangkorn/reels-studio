"""KSO voice lock v2 measure writer (KSO-SCRIPT-R2, NARR Erinome, WOMAN Despina takes reused).
Writes scripts/kuchisake-onna/short/voice-measure.json from the decoded assembled track, the read's align/cut measure,
the slot plan, the clip edits, loudness and the per-line ASR proxy. Editor proxy QA only: no human listening by the agent.
Track times: frame 0 = start of the assembled MP3; anchor times come from the Whisper read measure (estimates, +-0.1-0.2 s)
converted through the slot plan and the clip edits (crop of B01 and B05 lead-ins).
Run (worktree root, after plan-slots, assemble, loudness and asr-check): python3 -I scripts/kuchisake-onna/short/voice-lock/write-measure-r2.py
"""
import array, hashlib, json, subprocess
from pathlib import Path

RATE, FPS, TH, HEAD = 48000, 30, 300, 0.02
OUT = Path('out/kso-ep01-short/voice-lock-r2')
VL = Path('scripts/kuchisake-onna/short/voice-lock')
MEASURE = Path('scripts/kuchisake-onna/short/voice-measure.json')
MP3 = OUT / 'final/KSO-EP01-SHORT_narration_voicelock-v2.mp3'
STORE_V2 = 'projects/KSO/audio/voice-lock-r2'  # where `store.py archive --path out/kso-ep01-short/voice-lock-r2 --kind audio/voice-lock-r2` files the folder
PLAN = json.loads((OUT / 'align/plan-slots.json').read_text(encoding='utf-8'))
ALIGN = json.loads((OUT / 'align/measure-read-take1.json').read_text(encoding='utf-8'))
EDITS = {e['clip']: e for e in json.loads((OUT / 'align/clip-edits.json').read_text(encoding='utf-8'))}
ASR = json.loads((OUT / 'qa/asr-r2.json').read_text(encoding='utf-8'))
LOUD = {x['file']: x for x in (json.loads(l) for l in (OUT / 'qa/loudness.jsonl').read_text(encoding='utf-8').splitlines() if l.strip())}
SLOTS = {s['slot']: s for s in PLAN['slots'] if 'speechOnF' in s}


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    a = array.array('h'); a.frombytes(raw); return a


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def loud(name):
    x = LOUD[name]
    return {'file': name, 'lufs': x['i'], 'tpDb': x['tp'], 'lra': x['lra']}


def main():
    a = decode(MP3)
    track_frames = round(len(a) / RATE * FPS)
    assert track_frames == PLAN['trackFrames'], (track_frames, PLAN['trackFrames'])
    dec = {}
    for s in PLAN['slots']:
        if 'speechOnF' not in s:
            continue
        lo, hi = round(s['slotStartF'] * RATE / FPS), round((s['slotStartF'] + s['slotFrames']) * RATE / FPS)
        idx = [i for i in range(lo, hi) if abs(a[i]) >= TH]
        dec[s['slot']] = {'onF': round(idx[0] / 1600), 'offF': round((idx[-1] + 1) / 1600), 'onS': idx[0] / RATE, 'offS': (idx[-1] + 1) / RATE}
    speech_on = min(d['onS'] for d in dec.values()); speech_off = max(d['offS'] for d in dec.values())
    speech_off_f = round(speech_off * FPS)

    KSO = {'B01-a1': 'KSO-A01', 'B01-a2': 'KSO-A02', 'B01-a3': 'KSO-A03', 'B01-a4': 'KSO-A04', 'B01-a5': 'KSO-A05',
           'B01-a6': 'KSO-A06', 'B01-a7': 'KSO-A07', 'B02-a1': 'KSO-A08', 'B04-a1': 'KSO-A10', 'B04-a2': 'KSO-A11',
           'B04-a3': 'KSO-A12', 'B05-a1': 'KSO-A13', 'B06-a1': 'KSO-A14', 'B06-a2': 'KSO-A15', 'B06-a3': 'KSO-A16',
           'B06-a4': 'KSO-A17'}
    ANCHOR_SCRIPT = {
        'KSO-A01': ('S01-B01', 'NARR hook start: อย่าเพิ่งตอบ'), 'KSO-A02': ('S01-B01', 'NARR hook end: ฟังให้จบก่อน'),
        'KSO-A03': ('S01-B02', 'NARR line 1 start: คืนนั้นก่อนเลิกงาน'), 'KSO-A04': ('S01-B02', 'NARR line 2 end: เหมือนคนที่เพิ่งโล่งใจ'),
        'KSO-A05': ('S02-B01', 'NARR line 1 start: ฉันเดินกลับห้องคนเดียว'), 'KSO-A06': ('S02-B01', 'steps stop: ฉันหยุด มันก็หยุด'),
        'KSO-A07': ('S02-B01', 'NARR line 2 end: ยืนรอฉันอยู่'), 'KSO-A08': ('S02-B02', 'NARR: ฉันไม่ตอบ'),
        'KSO-A10': ('S02-B03', 'NARR mask start: เธอดึงหน้ากากลง'),
        'KSO-A11': ('S02-B03', 'NARR: ปากของเธอ (stinger reference, Film places the visual)'), 'KSO-A12': ('S02-B03', 'NARR mask end: ไปถึงหู'),
        'KSO-A13': ('S02-B03', 'NARR answer: ก็… ธรรมดา'), 'KSO-A14': ('S03-B01', 'NARR start: เธอนิ่งไป'),
        'KSO-A15': ('S03-B01', 'NARR end: ว่าทำไมเพื่อนถึงโล่งใจ'), 'KSO-A16': ('S03-B02', 'NARR start: ขอโทษนะ'),
        'KSO-A17': ('S03-B02', 'NARR end: ที่เล่าให้ฟัง')}
    anchors = []
    for x in ALIGN['anchors']:
        kso = KSO[x['id']]
        g = x['beat']
        plan_clip = SLOTS[g]
        crop = EDITS.get(g, {}).get('cropStartS', 0.0)  # clip edits shift the read's anchor times
        s0 = plan_clip['clipAudibleStartS']
        drop = max(0.0, s0 - HEAD)
        base = plan_clip['slotStartF'] / FPS + plan_clip['leadFrames'] / FPS - drop
        on_s = base + (x['onRaw'] - crop); off_s = base + (x['endRaw'] - crop)
        anchors.append({'id': kso, 'beat': ANCHOR_SCRIPT[kso][0], 'text': x['text'], 'what': ANCHOR_SCRIPT[kso][1],
                        'slot': g, 'source': 'whisper (read, aligned)', 'onF': round(on_s * FPS), 'endF': round(off_s * FPS),
                        'onS': round(on_s, 3), 'endS': round(off_s, 3)})
    line_map = {'W01_hook': ('KSO-A18', 'S01-B01', 'WOMAN hook: ฉัน… สวยไหม?'),
                'W02_jp': ('KSO-A19', 'S02-B02', 'WOMAN JP: わたし… きれい? (caption วาตาชิ… คิเร?)'),
                'W03_th': ('KSO-A20', 'S02-B02', 'WOMAN TH: ฉัน… สวยไหม?'), 'SLIP': ('KSO-A21', 'S02-B03', 'NARR panic slip: ส… สวย—'),
                'W04_mask': ('KSO-A22', 'S02-B03', 'WOMAN: แล้วตอนนี้ล่ะ… ยังสวยอยู่ไหม?'),
                'W05_final': ('KSO-A23', 'S03-B02', 'WOMAN final: ถึงตาเธอแล้ว…')}
    for slot, (kso, beat, what) in line_map.items():
        d = dec[slot]
        anchors.append({'id': kso, 'beat': beat, 'text': what.split(': ', 1)[1], 'what': what, 'slot': slot,
                        'source': 'energy (line bounds, decoded track)', 'onF': d['onF'], 'endF': d['offF'],
                        'onS': round(d['onS'], 3), 'endS': round(d['offS'], 3)})
    anchors.append({'id': 'KSO-A24', 'beat': 'S02-B03', 'text': '', 'what': 'stinger: first readable smile frame (visual, not an audio anchor)',
                    'slot': None, 'source': 'N/A audio', 'onF': None, 'endF': None, 'onS': None, 'endS': None})
    anchors.append({'id': 'KSO-A09', 'beat': 'S02-B02', 'text': 'เธอพูดภาษาไทย', 'what': 'REMOVED in KSO-SCRIPT-R2 (user cut); not generated, not measured',
                    'slot': None, 'source': 'removed', 'onF': None, 'endF': None, 'onS': None, 'endS': None})
    anchors.sort(key=lambda r: r['id'])
    A = {r['id']: r for r in anchors}

    beats = {
        'S01-B01': ('KSO-A18', 'KSO-A02'), 'S01-B02': ('KSO-A03', 'KSO-A04'), 'S02-B01': ('KSO-A05', 'KSO-A07'),
        'S02-B02': ('KSO-A19', 'KSO-A20'), 'S02-B03': ('KSO-A21', 'KSO-A13'), 'S03-B01': ('KSO-A14', 'KSO-A15'),
        'S03-B02': ('KSO-A16', 'KSO-A23')}
    beat_out = {}
    for b, (first, last) in beats.items():
        on_s, off_s = A[first]['onS'], A[last]['endS']
        beat_out[b] = {'speechOnS': on_s, 'speechOffS': off_s, 'speechOnF': round(on_s * FPS), 'speechOffF': round(off_s * FPS),
                       'lenS': round(off_s - on_s, 2), 'startAnchor': first, 'endAnchor': last}
    spoken = sum(d['offS'] - d['onS'] for d in dec.values())
    budget = {
        'C_seamless': {'frames': 1500, 'speechEndMaxFrame': 1485, 'speechEndFrame': speech_off_f,
                       'overrunFrames': speech_off_f - 1485, 'overrunS': round((speech_off_f - 1485) / FPS, 2)},
        'B_loop': {'frames': 1590, 'speechEndMaxFrame': 1500, 'speechEndFrame': speech_off_f,
                   'overrunFrames': speech_off_f - 1500, 'overrunS': round((speech_off_f - 1500) / FPS, 2)}}

    takes = [
        {'id': 'TAKE-NARR-READ', 'what': 'NARR one read, groups B01 B02 B04 B05 B06 (Erinome, R2; B03 absent)',
         'file': f'{OUT}/takes/NARR-Erinome_read_take1.wav', 'store': f'{STORE_V2}/takes/NARR-Erinome_read_take1.wav',
         'new': True, 'sha256': sha(OUT / 'takes/NARR-Erinome_read_take1.wav')},
        {'id': 'TAKE-NARR-SLIP', 'what': 'NARR panic slip (separate take, Erinome, S02-B03)',
         'file': f'{OUT}/takes/NARR-Erinome_slip_take1.wav', 'store': f'{STORE_V2}/takes/NARR-Erinome_slip_take1.wav',
         'new': True, 'sha256': sha(OUT / 'takes/NARR-Erinome_slip_take1.wav')},
        {'id': 'TAKE-W-HOOK', 'what': 'WOMAN hook (Despina, reused: v1 take, line unchanged)', 'file': f'{OUT}/takes/WOMAN-B-Despina_HOOK_take1.wav',
         'store': 'projects/KSO/audio/WOMAN-B-Despina_HOOK_take1.wav', 'new': False, 'sha256': sha(OUT / 'takes/WOMAN-B-Despina_HOOK_take1.wav')},
        {'id': 'TAKE-W-JP', 'what': 'WOMAN JP question (Despina, reused)', 'file': f'{OUT}/takes/WOMAN-B-Despina_JP_take1.wav',
         'store': 'projects/KSO/audio/lines/WOMAN-B-Despina_JP_take1.wav', 'new': False, 'sha256': sha(OUT / 'takes/WOMAN-B-Despina_JP_take1.wav')},
        {'id': 'TAKE-W-TH', 'what': 'WOMAN TH question (Despina, reused)', 'file': f'{OUT}/takes/WOMAN-B-Despina_TH_take1.wav',
         'store': 'projects/KSO/audio/lines/WOMAN-B-Despina_TH_take1.wav', 'new': False, 'sha256': sha(OUT / 'takes/WOMAN-B-Despina_TH_take1.wav')},
        {'id': 'TAKE-W-MASK', 'what': 'WOMAN mask line (Despina, reused)', 'file': f'{OUT}/takes/WOMAN-B-Despina_MASK_take1.wav',
         'store': 'projects/KSO/audio/WOMAN-B-Despina_MASK_take1.wav', 'new': False, 'sha256': sha(OUT / 'takes/WOMAN-B-Despina_MASK_take1.wav')},
        {'id': 'TAKE-W-FINAL', 'what': 'WOMAN final line (Despina, reused)', 'file': f'{OUT}/takes/WOMAN-B-Despina_FINAL_take1.wav',
         'store': 'projects/KSO/audio/WOMAN-B-Despina_FINAL_take1.wav', 'new': False, 'sha256': sha(OUT / 'takes/WOMAN-B-Despina_FINAL_take1.wav')},
    ]
    asr_lines = []
    for r in ASR['lines']:
        row = {'line': r['line'], 'asr': r['asr'], 'scored': r['scored']}
        if 'ratio' in r: row['ratio'] = r['ratio']
        if 'anchors' in r: row['anchorWindows'] = {x['id']: x['window'] for x in r['anchors']}
        asr_lines.append(row)
    slots_out = [{k: v for k, v in s.items() if k != 'source'} for s in PLAN['slots']]
    written = {s['slot']: s['leadFrames'] for s in PLAN['slots'] if 'leadFrames' in s}
    measure = {
        'deliverable': 'KSO-EP01-SHORT',
        'revision': 'v2',
        'supersedes': 'v1 (KSO-SCRIPT-R1, NARR Sulafat): projects/KSO/audio/voice-lock-r1/voice-measure-v1.json',
        'script_revision': 'KSO-SCRIPT-R2',
        'film_brief_at_lock': 'KSO-BRIEF-FILM-R1.1',
        'voice_lock': 'v2: NARR Erinome (replaces Sulafat), WOMAN Despina (five v1 takes reused, byte-identical, lines unchanged), user decisions 2026-11-01',
        'timing_status': 'audio-measured',
        'lock_basis': ('user decisions 2026-11-01: NARR Erinome (lineup r2), WOMAN Despina unchanged, NARR style as v1, no +5% narrator atempo, '
                       'normal gemini-tts say chain (no extra limiting). Editor proxy QA only: no human listening by the agent. '
                       'Length: v2 track 76.6 s vs v1 76.3 s; the user accepted about 76 s, to be confirmed (see open_items).'),
        'measure_by': 'Editor (voice lock v2), 2026-11-01',
        'fps': FPS,
        'measure_basis': ('decoded assembled MP3 (48 kHz mono): first and last sample >= 300 of 32767 inside each slot; frame = round(sample / 1600); '
                          'end exclusive. Anchors: Whisper large-v3-turbo word timestamps of the full read (estimates, +-0.1-0.2 s), mapped through the '
                          'slot plan and the clip edits (B01 and B05 crop). WOMAN and slip line bounds: decoded energy.'),
        'frame_origin': 'track frame 0 = KSO-EP01-SHORT_narration_voicelock-v2.mp3 start; timeline frame = track frame + preroll (preroll_frames 0, not yet decided)',
        'preroll_frames': 0,
        'track': {'file': str(MP3), 'store': f'{STORE_V2}/final/KSO-EP01-SHORT_narration_voicelock-v2.mp3',
                  'amplitude': f'{STORE_V2}/final/KSO-EP01-SHORT_narration_voicelock-v2.amplitude.json',
                  'sha256': sha(MP3), 'lengthFrames': track_frames, 'lengthS': round(len(a) / RATE, 3)},
        'speech_frames_span': [round(speech_on * FPS), speech_off_f],
        'speech_total_span_s': round(speech_off - speech_on, 2),
        'speech_total_span_v1_s': 75.79,
        'audible_clip_seconds_sum': round(spoken, 2),
        'audible_clip_seconds_sum_v1': 69.19,
        'budget': budget,
        'budget_result': (f'speech runs to {speech_off:.2f} s (frame {speech_off_f}); C_seamless needs speech to end by 49.50 s (frame 1485), '
                          f'B_loop by 50.00 s (frame 1500): over by {budget["C_seamless"]["overrunS"]} s (C) / {budget["B_loop"]["overrunS"]} s (B).'),
        'budget_decision': 'not met by v1 or v2 (both about 76 s, budget 49.5-50 s). The request of 1 Nov 2026 says the user accepted about 76 s; the user confirms the length before the timed scene sheets (see open_items).',
        'beats': beat_out,
        'anchors': anchors,
        'slots': slots_out,
        'takes': takes,
        'clip_edits': [{k: v for k, v in e.items() if k != 'original'} for e in EDITS.values()],
        'loudness': {
            'method': 'scripts/loudness.mjs measureLoudness (ffmpeg loudnorm measure; integrated LUFS, true peak, LRA of the file as it is)',
            'track': loud('KSO-EP01-SHORT_narration_voicelock-v2.mp3'),
            'takes': [loud(n) for n in ('NARR-Erinome_read_take1.wav', 'NARR-Erinome_slip_take1.wav', 'WOMAN-B-Despina_HOOK_take1.wav',
                                        'WOMAN-B-Despina_JP_take1.wav', 'WOMAN-B-Despina_TH_take1.wav', 'WOMAN-B-Despina_MASK_take1.wav',
                                        'WOMAN-B-Despina_FINAL_take1.wav')],
            'v1_reference': {'track_lufs': -16.77, 'track_tpDb': -1.52, 'NARR_read_sulafat_lufs': -16.42, 'NARR_slip_sulafat_lufs': -19.38},
            'chain': 'gemini-tts.py say: two-pass loudnorm I=-16 TP=-1.5 LRA=11 (linear, 48 kHz mono); no extra limiting or gain in the lock',
            'note': 'Erinome read measures at the target (-16.18 LUFS). The lineup hook take (-22.4 LUFS raw) was short and was limited for level matching only; it is not the lock.'},
        'written_pause_frames': written,
        'written_pause_basis': ('Script: <short pause> before NARR lines (B01, B05) = 0.5 s written lead; 0.75 s silence after her Thai question '
                                '(SLIP lead 23, Editor choice carried from v1 pre-line silence; script Sound handoff: silence after the Thai question is part of the scare); '
                                'silence after ธรรมดา 1.0 s (B06 lead 30); 0.5 s speech-free before the seam (TAIL 15). Other gaps are Editor choices '
                                '(sample gaps 0.45-0.6 s). The Erinome read adds a quiet murmur before B01, B02, B04 and B05 and after the phrases; those are cropped or trimmed (clip_edits), so the written leads carry the pauses.'),
        'ellipsis_rule': 'NARR text and the panic slip: ellipses became commas in TTS text only (user rule). WOMAN lines keep the script ellipses and the reused takes.',
        'narrator_pace': 'No atempo. The +5% narrator speed-up (memory narrator-pace-plus5) does not apply: NARR is the first-person character (user decision, 1 Nov 2026).',
        'read_alignment': {'matchRatio': ALIGN.get('matchRatio'), 'anchorsInside': len(ALIGN['anchors']), 'anchorsFallback': 0,
                           'cutRule': ALIGN.get('cutRule'), 'note': 'cut-gaps verify: edge margins of 11-18 ms at the B04 and B05 cuts (the 40 ms gaps between phrases) and at the read edges (B01 start, B06 end); the sample checks are in qa/ and the open_items.'},
        'asr_check': {'source': f'{OUT}/qa/asr-r2.json', 'model': 'Whisper large-v3-turbo, CPU int8, temperature 0, language th (ja for the JP line), 0.5 s silence padding on clips',
                      'proxy_only': True, 'lines': asr_lines,
                      'caveat': 'Thai ASR is rough and not stable on short whispered clips: the question particle ไหม reads as ไม่/มั้ย/มาย across takes; B05 reads ขอบคุณ at clip level but the full-read pass hears ก็ธรรมดา (46.76 s); the full-track pass (no padding) dropped most of the NARR and is not evidence (0.13).'},
        'reproduce': [
            'out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Erinome --style "hushed, tense late-night storytelling, close to the mic" --text-file scripts/kuchisake-onna/short/voice-lock/tts-read.txt out/kso-ep01-short/voice-lock-r2/takes/NARR-Erinome_read_take1.wav  (tts-read.txt = tts-beats.json B01 B02 B04 B05 B06 joined by spaces)',
            'out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Erinome --style "hushed, tense late-night storytelling, close to the mic, panicked, involuntary, cut off" --text "<gasp> ส, สวย—" out/kso-ep01-short/voice-lock-r2/takes/NARR-Erinome_slip_take1.wav',
            'WOMAN takes: reused, copied from ~/ReelsStore (sha256 as in the takes list; byte-identical to v1)',
            'HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I scripts/narration/align-full.py --full out/kso-ep01-short/voice-lock-r2/takes/NARR-Erinome_read_take1.wav --tts-beats scripts/kuchisake-onna/short/voice-lock/tts-beats.json --timeline scripts/kuchisake-onna/short/voice-lock/align-timeline.json --index scripts/kuchisake-onna/short/voice-lock/anchors.md --segments out/kso-ep01-short/voice-lock-r2/segments --out out/kso-ep01-short/voice-lock-r2/align/measure-read-take1.json',
            'python3 -I scripts/narration/cut-gaps.py --full <read.wav> --measure out/kso-ep01-short/voice-lock-r2/align/measure-read-take1.json --segments out/kso-ep01-short/voice-lock-r2/segments --prev out/kso-ep01-short/voice-lock-r2/align/measure-read-take1-uncut.json',
            'python3 -I scripts/kuchisake-onna/short/voice-lock/edit-clips.py  (B01 and B05 lead-in crop, B06 tail cut; originals in align/clips-cut/)',
            'python3 -I scripts/kuchisake-onna/short/voice-lock/plan-slots.py  (narration-slots.json, align/plan-slots.json)',
            'python3 -I scripts/narration/assemble-narration.py --clips out/kso-ep01-short/voice-lock-r2/segments --timeline scripts/kuchisake-onna/short/voice-lock/narration-slots.json --out out/kso-ep01-short/voice-lock-r2/final/KSO-EP01-SHORT_narration_voicelock-v2.mp3',
            'node scripts/kuchisake-onna/short/voice-lock/measure-loudness.mjs <track.mp3 and takes/*.wav> > out/kso-ep01-short/voice-lock-r2/qa/loudness.jsonl',
            'HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I scripts/kuchisake-onna/short/voice-lock/asr-check.py',
            'python3 -I scripts/kuchisake-onna/short/voice-lock/write-measure-r2.py',
        ],
        'open_items': [
            'LENGTH (user confirmation): v2 track 76.6 s (speech span 76.1 s) vs v1 track 76.3 s (speech span 75.8 s): +0.3 s, within the about 76 s the user accepted. Confirm. If shorter is wanted: (b) brisker read (style change, user approval; NARR beats differ from Sulafat by -2.5 to +5 %: S01-B01 +0.28 s, S01-B02 +0.62 s, S02-B01 +0.35 s, S03-B01 -0.20 s); (c) text trims (Preaw, script change: the lock re-opens for the changed beats).',
            'EAR CHECK NARR Erinome: the read voices the <short pause> tags and the phrase ends as a quiet murmur (rms about 100-300, about -40 dBFS, 0.45-0.98 s after phrases B01, B02, B04, B05). The lead-ins of B01, B02, B04 and B05 are cropped and the tails trimmed to the last word + 0.2 s with a fade-out (clip_edits), so the written pauses carry the timing. If the murmur is wanted as breath, restore the EDITS in edit-clips.py and re-run the chain.',
            'EAR CHECK B01 opening: clip-level ASR garbled part of อย่าเพิ่งตอบ in an earlier pass; the padded pass reads อย่าพื้นตอบ ฟังให้จบก่อน (ratio 0.93). Listen to the first 4 s of the NARR clip.',
            'EAR CHECK B05 ก็… ธรรมดา: clip-level ASR reads ขอบคุณ (two passes, hallucination pattern for a short whispered clip). The full-read pass hears ก็ธรรมดา at 46.76 s. This is the key scare line: listen.',
            'EAR CHECK WOMAN HOOK (reused take, v1): ASR hears ฉันสวยไม่ / ฉันสวยมาย. Confirm the rising question on the ear; if it reads as a statement, regenerate this one take (one call, the same style) and re-run the chain.',
            'EAR CHECK WOMAN TH (reused): ASR hears ฉันสวยมั้ย / ชันสวัยมัย: same question, check the ear.',
            'SLIP gap: W03_th to SLIP is 0.75 s (Editor choice, the scare silence). Check on the picture with the Thai question and the slip frame.',
            'Level: NARR Erinome -16.2 LUFS, track -16.65 LUFS (v1 -16.77). WOMAN JP -20.7, FINAL -19.3, slip Erinome -21.4 LUFS: 3-5 LU below the read, the same spread as v1 (the takes already peak at -1.5 dBTP; a plain gain would clip). Fix at the mix stage or by regenerating.',
            'Read edges and cut margins: cut-gaps verify reports 11-18 ms edge margins at B04 and B05 (40 ms gaps) and at the read edges (B01 start, B06 end, cropped to a 10 ms fade-in / 30 ms fade-out). Measured sample edges are in qa/.',
            'Stinger anchor KSO-A24 is visual: Film places it from KSO-A11 (unchanged).',
            'Commercial-use terms and SynthID for Gemini TTS output: unchecked (gemini-tts skill).',
            'Track is not committed and not in public/ (the committed narration MP3 belongs to the timeline step).',
            'Tooling note: scripts/narration/assemble-narration.py prints speech-start offsets in samples while labelled seconds (log only; the track is correct). Shared tool, not edited here.',
        ],
    }
    MEASURE.write_text(json.dumps(measure, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print('track frames', track_frames, '| speech span', round(speech_off - speech_on, 2), 's | audible sum', round(spoken, 2), 's')
    for b, v in beat_out.items():
        print(b, v['speechOnF'], v['speechOffF'], v['lenS'])
    print('anchors', len(anchors), '| wrote', MEASURE)


if __name__ == '__main__':
    main()
