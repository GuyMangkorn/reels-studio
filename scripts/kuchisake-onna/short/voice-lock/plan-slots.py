"""Slot plan for the KSO voice lock v2 (KSO-SCRIPT-R2, NARR Erinome, WOMAN Despina takes reused): per-clip audible span,
planned lead (written pauses) in whole 30 fps frames.
Writes the assembler slot plan (committed input) and a clip/slot record for the measure file (out/)."""
import array, json, math, shutil, subprocess
from pathlib import Path
RATE, FPS, TH, HEAD = 48000, 30, 300, 0.02
SPF = RATE // FPS  # 1600 samples per frame
OUT = Path('out/kso-ep01-short/voice-lock-r2')
TK = OUT / 'takes'
SEG = OUT / 'segments'
VL = Path('scripts/kuchisake-onna/short/voice-lock')
AL = OUT / 'align'
# (slot name, source take, lead frames before the clip, planned gap reason)
PLAN = [
    ('W01_hook', TK / 'WOMAN-B-Despina_HOOK_take1.wav', 0, 'frame 0: hook opens the Short (S01-B01)'),
    ('B01', SEG / 'B01.wav', 15, 'WOMAN hook -> NARR: <short pause> (script S01-B01), 0.50 s'),
    ('W02_jp', TK / 'WOMAN-B-Despina_JP_take1.wav', 14, 'NARR -> WOMAN JP: sample gap NARR->JP 0.45 s, rounded to 14 f'),
    ('B02', SEG / 'B02.wav', 14, 'WOMAN JP -> NARR ฉันไม่ตอบ: 14 f (0.47 s, same as the sample gap)'),
    ('W03_th', TK / 'WOMAN-B-Despina_TH_take1.wav', 14, 'NARR ฉันไม่ตอบ -> WOMAN TH: 14 f'),
    ('SLIP', TK / 'NARR-Erinome_slip_take1.wav', 23, 'WOMAN TH -> panic slip: silence after her Thai question (script Sound handoff, R2), 0.75 s, Editor choice (v1 pre-line silence kept)'),
    ('B04', SEG / 'B04.wav', 11, 'slip -> NARR mask lines: 0.35 s'),
    ('W04_mask', TK / 'WOMAN-B-Despina_MASK_take1.wav', 18, 'NARR ไปถึงหู -> WOMAN ยังสวยอยู่ไหม: 0.60 s'),
    ('B05', SEG / 'B05.wav', 15, 'WOMAN -> NARR ก็ ธรรมดา: <short pause> (script), 0.50 s'),
    ('B06', SEG / 'B06.wav', 30, 'silence after ธรรมดา (script scare rule), 1.00 s'),
    ('W05_final', TK / 'WOMAN-B-Despina_FINAL_take1.wav', 18, 'NARR ที่เล่าให้ฟัง -> WOMAN ถึงตาเธอแล้ว: 0.60 s'),
]
TAIL_FRAMES = 15  # 0.5 s speech-free before the seam (C_seamless rule)


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    a = array.array('h'); a.frombytes(raw); return a


def main():
    slots, record, start = [], [], 0
    SEG.mkdir(parents=True, exist_ok=True); AL.mkdir(parents=True, exist_ok=True)
    for name, src, lead, why in PLAN:
        dst = SEG / f'{name}.wav'
        if not name.startswith('B'):
            shutil.copyfile(src, dst)
        a = decode(dst)
        s0 = next(i for i, v in enumerate(a) if abs(v) >= TH)
        s1 = max(i for i, v in enumerate(a) if abs(v) >= TH) + 1
        head = round(HEAD * RATE)
        drop = max(0, s0 - head)
        speech_len = s1 - drop
        frames_speech = math.ceil(speech_len / SPF)
        dur = lead + frames_speech
        onset_in_slot = lead * SPF + (s0 - drop)  # samples from slot start to first audible sample
        on_f = start + onset_in_slot / SPF
        off_f = start + (lead * SPF + speech_len) / SPF
        slots.append({'beat': name, 'leadSec': round(lead / FPS, 6), 'trimHeadSec': HEAD, 'durationSec': round(dur / FPS, 6)})
        record.append({'slot': name, 'source': str(src), 'leadFrames': lead, 'slotStartF': start, 'slotFrames': dur,
                       'clipAudibleStartS': round(s0 / RATE, 4), 'clipAudibleEndS': round(s1 / RATE, 4),
                       'speechOnF': round(on_f, 2), 'speechOffF': round(off_f, 2), 'gap': why})
        start += dur
    # tail: silent clip, no speech
    tail = SEG / 'TAIL.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'anullsrc=r={RATE}:cl=mono', '-t', f'{TAIL_FRAMES / FPS:.4f}',
                    '-c:a', 'pcm_s16le', str(tail)], check=True)
    slots.append({'beat': 'TAIL', 'leadSec': 0, 'trimHeadSec': 0, 'durationSec': round(TAIL_FRAMES / FPS, 6)})
    record.append({'slot': 'TAIL', 'slotStartF': start, 'slotFrames': TAIL_FRAMES, 'gap': 'silence to the seam (0.5 s, C_seamless)'})
    start += TAIL_FRAMES
    (VL / 'narration-slots.json').write_text(json.dumps(slots, indent=1) + '\n', encoding='utf-8')
    (AL / 'plan-slots.json').write_text(json.dumps({'fps': FPS, 'trackFrames': start, 'slots': record}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    for r in record:
        on = f"{r['speechOnF']:.1f}" if 'speechOnF' in r else '-'
        off = f"{r['speechOffF']:.1f}" if 'speechOffF' in r else '-'
        print(f"{r['slot']:<10} start {r['slotStartF']:>5} frames {r['slotFrames']:>4}  speech {on:>7}-{off:<7} {r['gap'][:60]}")
    print('track frames', start, '=', round(start / FPS, 3), 's; speech end frame', round(max(r.get('speechOffF', 0) for r in record), 2))


if __name__ == '__main__':
    main()
