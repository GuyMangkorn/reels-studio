"""KSO voice lock v2: Editor edits to two read clips after cut-gaps.py (Erinome read, KSO-SCRIPT-R2).

B01 (S01-B01 .. S02-B01 lines): the read starts with a quiet voiced murmur (rms about 60-430, peaks up to 1317, about
-28 dBFS) for 0.0-0.7 s before the hook phrase (Whisper first word at 0.72 s, loud speech from 0.88 s). The script's
`<short pause>` before the hook is the 0.5 s written lead of the slot plan (as in v1), so the murmur is cropped:
keep from 0.56 s (quietest 20 ms of the lead-in), 10 ms fade-in.
B05 (S02-B03 `ก็ ธรรมดา`): the same effect before the line: 46.24-46.74 s of the read is a quiet voiced murmur (rms about
100-250, voicing 0.6-0.9) after `ไปถึงหู` and before the loud onset at 46.78 s (Whisper word `ก็` at 46.76 s). The
`<short pause>` tag is the 0.5 s written lead (as in v1); the clip keeps from 46.74 s (10 ms fade-in). The murmur
also made the clip-level ASR read `ขอบคุณครับ`.
B02 and B04 lead-ins: the same murmur before the first word (B02 0-0.85 s, B04 0-0.75 s); cropped to keep 0.05-0.13 s before the Whisper onset.
B01, B02, B04, B05 tails: each clip ends 0.2 s after its last phrase word, with a 60 ms fade-out (see EDITS).
B06 (S03-B01 .. S03-B02 lines): after the final word (Whisper end 59.44 s of the read) the read keeps a -40 dBFS
residual to 59.76 s and ends on a non-zero sample. Cut at 59.50 s of the read with a 30 ms fade-out.

Originals are kept in align/clips-cut/ (copied on the first run), so a rerun starts from them, not from the edited files.
Edits are recorded in align/clip-edits.json for write-measure.py (the crop shifts the anchors).
Run (worktree root): python3 -I scripts/kuchisake-onna/short/voice-lock/edit-clips.py
"""
import array, json, shutil, subprocess, wave
from pathlib import Path

RATE = 48000
OUT = Path('out/kso-ep01-short/voice-lock-r2')
SEG = OUT / 'segments'
KEEP = OUT / 'align' / 'clips-cut'
# B06 segment starts at 48.625 s of the read (cut-gaps.py); 59.50 s of the read = 10.875 s into the clip.
#  Clip times are in the cut-gaps.py segment (before the crop). Phrase ends are the Whisper word ends of the read
#  (align measure, endRaw) + 0.2 s. After each phrase the read keeps a quiet voiced murmur of 0.45-0.98 s
#  (rms 200-300, about -40 dBFS): not speech, and it doubled the written pauses (v2 measured +5 s over v1).
EDITS = {
    'B01': {'startS': 0.56, 'endS': 37.46, 'fadeInS': 0.01, 'fadeOutS': 0.06},  # phrase end 37.26 s (ยืนรอฉันอยู่)
    'B02': {'startS': 0.70, 'endS': 1.725, 'fadeInS': 0.01, 'fadeOutS': 0.06},  # lead murmur 0-0.85 s + a pop at 0.28 s; onset 0.83 s (ฉันไม่ตอบ); phrase end 1.525 s
    'B04': {'startS': 0.66, 'endS': 5.545, 'fadeInS': 0.01, 'fadeOutS': 0.06},  # lead murmur 0-0.75 s; onset 0.71 s (เธอดึงหน้ากากลง); phrase end 5.345 s (ไปถึงหู)
    'B05': {'startS': 0.505, 'endS': 2.045, 'fadeInS': 0.01, 'fadeOutS': 0.06}, # B05 starts at 46.235 s of the read; phrase end 1.845 s (ธรรมดา)
    'B06': {'startS': 0.0, 'endS': 10.875, 'fadeInS': 0.0, 'fadeOutS': 0.03},
}


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    a = array.array('h'); a.frombytes(raw); return a


def main():
    KEEP.mkdir(parents=True, exist_ok=True)
    record = []
    for name, e in EDITS.items():
        orig = KEEP / f'{name}.wav'
        if not orig.exists():
            shutil.copyfile(SEG / f'{name}.wav', orig)
        a = decode(orig)
        s0 = int(round(e['startS'] * RATE))
        s1 = len(a) if e['endS'] is None else int(round(e['endS'] * RATE))
        seg = a[s0:s1]
        n_in, n_out = int(round(e['fadeInS'] * RATE)), int(round(e['fadeOutS'] * RATE))
        for i in range(min(n_in, len(seg))):
            seg[i] = int(seg[i] * i / n_in)
        for i in range(min(n_out, len(seg))):
            j = len(seg) - 1 - i
            seg[j] = int(seg[j] * i / n_out)
        with wave.open(str(SEG / f'{name}.wav'), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(seg.tobytes())
        record.append({'clip': name, 'original': str(orig), 'cropStartS': e['startS'],
                       'cutEndS': e['endS'], 'fadeInS': e['fadeInS'], 'fadeOutS': e['fadeOutS'],
                       'lengthS': round(len(seg) / RATE, 4)})
        print(name, 'kept', round(len(seg) / RATE, 3), 's from', e['startS'], 's')
    (OUT / 'align' / 'clip-edits.json').write_text(json.dumps(record, indent=1) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
