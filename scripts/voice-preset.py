"""One Thai line from Edge TTS in a character register (child, elderly, alternate adult), for the voice-tuning skill.
Usage: python3 -I scripts/voice-preset.py --preset child-girl-a --text "..." OUT.wav [--rate +5%]
       python3 -I scripts/voice-preset.py --list
Recipes and measurements: docs/dev-findings/DF-20261029-edge-tts-voice-tuning.md. Output is 48 kHz mono WAV, loudness-normalized.
"""
import argparse, asyncio, subprocess, sys, tempfile
from pathlib import Path

P, N = 'th-TH-PremwadeeNeural', 'th-TH-NiwatNeural'
NORM = 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000'
ELDER_A = 'vibrato=f=5.5:d=0.08,tremolo=f=5:d=0.15'
ELDER_B = 'vibrato=f=6:d=0.15,tremolo=f=6:d=0.25'

def shift(k):
    return f'aresample=48000,asetrate={round(48000 * k)},aresample=48000,atempo={1 / k:.5f}'

# name: (voice, edge pitch, edge rate or None for --rate, ffmpeg chain before NORM)
PRESETS = {
    'child-girl-a': (P, '+15Hz', None, f'{shift(1.18)},highpass=f=180'),
    'child-girl-b': (P, '+30Hz', None, f'{shift(1.25)},highpass=f=180'),
    'child-boy-a': (N, '+50Hz', None, f'{shift(1.25)},highpass=f=180'),
    'child-boy-b': (N, '+100Hz', None, f'{shift(1.3)},highpass=f=180'),
    'elder-woman-a': (P, '-8Hz', '-15%', f'{shift(0.97)},{ELDER_A},highpass=f=140,lowpass=f=6500'),
    'elder-woman-b': (P, '-8Hz', '-15%', f'{shift(0.95)},{ELDER_B},highpass=f=160,lowpass=f=5500,equalizer=f=2500:t=q:w=1:g=-3'),
    'elder-man-a': (N, '-8Hz', '-15%', f'{shift(0.97)},{ELDER_A},highpass=f=120,lowpass=f=6500'),
    'elder-man-b': (N, '-8Hz', '-15%', f'{shift(0.95)},{ELDER_B},highpass=f=140,lowpass=f=5500,equalizer=f=2500:t=q:w=1:g=-3'),
    'woman-younger': (P, '+15Hz', None, shift(1.06)),
    'woman-lower': (P, '-20Hz', None, shift(0.93)),
    'man-bigger': (N, '-10Hz', None, f'{shift(0.9)},equalizer=f=150:t=q:w=1:g=2'),
    'man-younger': (N, '+15Hz', None, shift(1.06)),
    'woman-base': (P, '+0Hz', None, 'anull'),
    'man-base': (N, '+0Hz', None, 'anull'),
}

async def synthesize(text, voice, rate, pitch, path, attempts=15):
    import edge_tts
    for i in range(attempts):
        try:
            return await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(str(path))
        except edge_tts.exceptions.NoAudioReceived:
            if i == attempts - 1: raise
            await asyncio.sleep(1 + i)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out', nargs='?'); ap.add_argument('--preset'); ap.add_argument('--text')
    ap.add_argument('--rate', default='+5%', help='edge rate when the preset does not fix one (default +5%%)')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()
    if a.list:
        for k, (v, p, r, chain) in PRESETS.items(): print(f'{k:14} {v.split("-")[2]:16} pitch {p:6} rate {r or "--rate"}')
        return
    if not (a.out and a.preset in PRESETS and a.text): ap.error('need OUT, --text and a --preset from --list')
    voice, pitch, rate, chain = PRESETS[a.preset]
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / 'raw.mp3'
        asyncio.run(synthesize(a.text, voice, rate or a.rate, pitch, raw))
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-af', f'{chain},{NORM}', '-ac', '1', a.out], check=True)
    print(f'{a.out}: {a.preset} ({voice}, pitch {pitch}, rate {rate or a.rate})')

if __name__ == '__main__':
    sys.exit(main())
