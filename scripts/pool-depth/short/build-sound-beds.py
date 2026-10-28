#!/usr/bin/env python3
"""Build the two 52.000 s wrap-aligned beds for POOLDEPTH-SHORT-BOTNOI from shared-library masters.

Usage: python3 scripts/pool-depth/short/build-sound-beds.py [--lib DIR]
Needs ffmpeg on PATH. Output (WAV is not Git-ignored; commit only if the episode needs it):
  public/audio/water/water_pool-hall-bed-52s_01.wav   (tiled library ambience loop)
  public/audio/bed/bed_pool-curious-sparse-52s_01.wav (library music, intro swell rotated away)
Wrap rule: out = X[C:N] + equal-power crossfade(X[N-C:N] fading out, X[0:C] fading in). The last output sample is then the
neighbour of X[C-1] and the first output sample is X[C], so playing the file back to back (video loop) is sample-continuous.
Length stays exactly N = 52 s = 1620 frames at 30 fps, so file time equals composition time (G = 30 * t).
"""
import array, math, os, subprocess, sys

SR, CH, N_SEC, C_SEC = 48000, 2, 52.0, 2.0
LIB = '/Users/mangkornkatawong/Documents/ChatGPT/sound-library'
if '--lib' in sys.argv: LIB = sys.argv[sys.argv.index('--lib') + 1]

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(CH), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    a = array.array('f'); a.frombytes(raw); return a

def save(a, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', str(CH), '-i', '-', '-c:a', 'pcm_s24le', path], input=a.tobytes(), check=True)

def rotate_wrap(x, frames, c):
    n = frames * CH; cn = c * CH
    out = array.array('f', x[cn:n])
    for i in range(c):
        t = (i + 0.5) / c
        g_out, g_in = math.cos(t * math.pi / 2), math.sin(t * math.pi / 2)
        for k in range(CH):
            out.append(x[n - cn + i * CH + k] * g_out + x[i * CH + k] * g_in)
    assert len(out) == n
    return out

def tile(a, frames):
    need = frames * CH; out = array.array('f')
    while len(out) < need: out.extend(a)
    return out[:need]

frames, c = round(N_SEC * SR), round(C_SEC * SR)
amb = tile(load(f'{LIB}/ambience/water/water_pool-hall-ambience_01.wav'), frames)
save(rotate_wrap(amb, frames, c), 'public/audio/water/water_pool-hall-bed-52s_01.wav')
mus = load(f'{LIB}/music/bed/bed_pool-curious-sparse_01.wav')[:frames * CH]
assert len(mus) == frames * CH, 'music master must be at least 52 s'
save(rotate_wrap(mus, frames, c), 'public/audio/bed/bed_pool-curious-sparse-52s_01.wav')
print('built 2 beds, 52.000 s each')
