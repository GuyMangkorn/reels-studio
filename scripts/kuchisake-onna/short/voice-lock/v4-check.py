"""KSO voice lock v4 check: what changed between v3 and v4, and the proxy ASR of the B06 clip.

Writes one JSON with: sample-level diff of the decoded tracks per 30 fps frame (where the audio differs), the
amplitude JSON diff (frames, max change), the B06 clip proxy ASR (Whisper large-v3-turbo word timestamps and the
letters ratio used by asr-check.py) for v3 and v4, and the frame count of both tracks.
Proxy only: nobody listened. Thai ASR is rough; a matching transcript does not prove the pitch is right.

Run (worktree root, Whisper venv): HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I \
    scripts/kuchisake-onna/short/voice-lock/v4-check.py --qa out/kso-ep01-short/voice-lock-v4/qa/v4-check.json
"""
import argparse, difflib, importlib.util, json, re, unicodedata
from pathlib import Path
import numpy as np

V3_TRACK = Path('out/kso-ep01-short/voice-lock-r3/final/KSO-EP01-SHORT_narration_voicelock-v3.mp3')
V4_TRACK = Path('out/kso-ep01-short/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3')
V3_AMP = Path('out/kso-ep01-short/voice-lock-r3/final/KSO-EP01-SHORT_narration_voicelock-v3.amplitude.json')
V4_AMP = Path('out/kso-ep01-short/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.amplitude.json')
V3_CLIP = Path('out/kso-ep01-short/voice-lock-r3/segments/B06.wav')
V4_CLIP = Path('out/kso-ep01-short/voice-lock-v4/segments-v4/B06.wav')
VM = Path('scripts/narration/voice-match.py')
TAG = re.compile(r'<[^>]+>')
FPS, RATE = 30, 48000


def letters(text):
    text = TAG.sub('', text)
    keep = []
    for ch in text:
        c = unicodedata.category(ch)[0]
        if c in 'LN' or '฀' <= ch <= '๿':
            keep.append(ch.lower())
    return ''.join(keep)


def load_vm():
    spec = importlib.util.spec_from_file_location('vm', VM)
    vm = importlib.util.module_from_spec(spec); spec.loader.exec_module(vm)
    return vm


def asr_clip(model, path, target):
    """Whisper words of one clip, the letters ratio against the B06 read text, and the words of the apology (13.5-15.5 s)."""
    segs, _ = model.transcribe(str(path), language='th', word_timestamps=True, temperature=0.0, vad_filter=False)
    words = [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in segs for w in (s.words or [])]
    text = ''.join(w['w'] for w in words)
    ratio = difflib.SequenceMatcher(None, letters(target), letters(text)).ratio()
    apology = [w for w in words if 13.5 <= w['s'] <= 15.5]
    return {'asr': text, 'ratio': round(ratio, 3), 'apology_words_s': apology, 'words_from_12_5_s': [w for w in words if w['s'] >= 12.5]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--qa', required=True)
    a = ap.parse_args()
    vm = load_vm()
    target = json.loads(Path('scripts/kuchisake-onna/short/voice-lock/tts-beats.json').read_text(encoding='utf-8'))['B06']
    t3, t4 = vm.decode(V3_TRACK), vm.decode(V4_TRACK)
    n = min(len(t3), len(t4))
    per = int(RATE / FPS)
    diff = np.abs(t3[:n] - t4[:n])
    frames = np.arange(n) // per
    changed = np.unique(frames[diff > 1e-4])
    amp3, amp4 = json.loads(V3_AMP.read_text()), json.loads(V4_AMP.read_text())
    amp_idx = [i for i, (x, y) in enumerate(zip(amp3, amp4)) if x != y]
    import faster_whisper
    model = faster_whisper.WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
    qa = {
        'tracks': {'v3': {'file': V3_TRACK.name, 'samples': len(t3), 'frames': round(len(t3) / per, 3)},
                   'v4': {'file': V4_TRACK.name, 'samples': len(t4), 'frames': round(len(t4) / per, 3)}},
        'track_frame_count_equal': len(t3) == len(t4),
        'pcm_changed_frames_gt_1e-4': [int(c) for c in changed],
        'pcm_changed_frames_range': [int(changed[0]), int(changed[-1])] if len(changed) else None,
        'pcm_max_abs_diff': round(float(diff.max()), 5),
        'amplitude': {'len_v3': len(amp3), 'len_v4': len(amp4), 'differs_at_frames': amp_idx,
                      'range': [amp_idx[0], amp_idx[-1]] if amp_idx else None,
                      'max_abs_diff_peak_normalized': round(max((abs(amp3[i] - amp4[i]) for i in amp_idx), default=0), 4),
                      'differs_more_than_0.001': [i for i in amp_idx if abs(amp3[i] - amp4[i]) > 0.001]},
        'asr_b06_clip': {'v3': asr_clip(model, V3_CLIP, target), 'v4': asr_clip(model, V4_CLIP, target)},
        'proxy_only': True, 'note': 'Proxy only: the Whisper words and letters ratio do not prove the pitch. Nobody listened.',
    }
    Path(a.qa).write_text(json.dumps(qa, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({k: qa[k] for k in ['track_frame_count_equal', 'pcm_changed_frames_range', 'pcm_max_abs_diff', 'amplitude']}, ensure_ascii=False)[:900])
    print('asr ratio v3', qa['asr_b06_clip']['v3']['ratio'], 'v4', qa['asr_b06_clip']['v4']['ratio'])


if __name__ == '__main__':
    main()
