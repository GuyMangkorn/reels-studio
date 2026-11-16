#!/usr/bin/env python3
"""EDU-EP20-SHORT sound mix (Editor, W5.3 Draft, 2026-11-16; SS-R4 Draft round 1 re-cut; SS-R5 narration R2 re-cut; scene sheet EDU-EP20-SS-R5, cue sheet scripts/edu-series/ep20/short/sound-cues.json, Ton).
Places exactly the 7 cues of the cue sheet at their integer G frames (1619 f, 48 kHz mono) with the sheet's gains, fades and MUS20 automation, and writes
the per-layer stems (voice, bed, ambience, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep20/short/sound-cues.json`,
plus the baked sound stem public/audio/edu/EDU-EP20-SHORT-draft-stem-v3.wav (bed + ambience + accent; the narration is its own track, narration R2
(E + new L13, 48.073688 s) whole at G0). Gains are the cue sheet's `level` values in dB on the file as stored (no loudness normalisation here). MUS20 automation follows the cue's
note, with every ramp >= 12 f as the note asks (the note's 4 f ramps G348-352 and G1264-1268 are widened to start 12 f earlier and end on the same frame,
so the gaps are fully silent where the sheet places them). Nothing here was listened: the mix is by number.
Run: python3 -I scripts/edu-series/ep20/sound-mix.py   (needs the files locked in src/videos/edu-ep20/assets.lock.json: python3 -I scripts/store.py fetch)"""
import array, json, math, os, random, subprocess, wave
TOTAL, FPS, SR = 1619, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
CUES = {c['cue']: c for c in json.load(open('scripts/edu-series/ep20/short/sound-cues.json'))['cues']}
# every file this mix plays (sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = {
    'public/audio/room/room_car-cabin-cruise-quiet_01.wav',
    'public/audio/bed/bed_wood-mallet-sparse-curious_01.wav',
    'public/audio/foley/foley_wood-tap-soft_01.wav',
    'public/audio/foley/foley_woodblock-tick-soft_01.wav',
    'public/audio/stinger/stinger_wood-answer-two-notes_01.wav',
    'public/audio/stinger/stinger_wood-two-note-tag-end_01.wav',
    'public/audio/stinger/stinger_marimba-outro-falling-open_01.wav',
}
assert PLACED == {c['file'] for c in CUES.values()}, 'cue sheet and PLACED differ'
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]
VOICE_PATH = 'public/narration/EDU-EP20-SHORT-narration-E.wav'
db = lambda x: 10 ** (x / 20)

def load(path):
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a

def ramp(points):
    """dB envelope over G frames: linear in dB between (frame, dB) points; None = off (-inf)."""
    pts = [(F(f), d) for f, d in points]
    def g(j):
        if j <= pts[0][0]: d = pts[0][1]
        elif j >= pts[-1][0]: d = pts[-1][1]
        else:
            for (a, x), (b, y) in zip(pts, pts[1:]):
                if a <= j <= b: d = x + (y - x) * (j - a) / max(1, b - a); break
        return 0.0 if d <= -60 else db(d)
    return g

def place(track, cue, gain_db, env=None, fade_in=0.0, fade_out_frames=0):
    """Play the cue's file from its first sample at the cue frame until endFrame, gain_db on the file, optional envelope and fades."""
    c = CUES[cue]; snd = load(c['file']); s0 = F(c['frame']); s1 = min(F(c['endFrame']), N)
    fi = max(1, int(fade_in * SR)); fo = max(1, F(fade_out_frames)) if fade_out_frames else 1
    g = db(gain_db)
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * g * (env(j) if env else 1.0) * min(1.0, (k + 1) / fi, (s1 - j) / fo)

bed, amb, acc = (array.array('f', bytes(4 * N)) for _ in range(3))
OFF = -90
# MUS20 (bed) -23 dB, automation (cue note): 0 dB to G340, off by G352 (planned gap before the tap), off to G373, up to -3 dB by G385;
# B04-SH01 ellipsis thin to -6 dB (G905-917 down, G943-955 back to -3); anticipation gap: off by G1264, silent to G1289, back to -6 dB by
# G1301 (SFX20-ANSWER at G1290 ends the gap), held -6 dB to G1409, released to silence by G1443 (cue endFrame; SS-R5, SS-R4 1380->1414).
place(bed, 'MUS20', -23.0, ramp([(0, 0), (340, 0), (352, OFF), (373, OFF), (385, -3), (905, -3), (917, -6), (943, -6), (955, -3),
                                  (1252, -3), (1264, OFF), (1289, OFF), (1301, -6), (1409, -6), (1443, OFF)]))
# AMB20 -23 dB, 9 f fade-in (cue fadeInFrames), level held through the outro and END tag, 40 f linear fade-out G1579-1619 with the
# picture's A_fade (SS-R5 END20, SS-R4 1550-1590; cue note 'linear': linear in amplitude, not in dB)
lin_out = lambda j: max(0.0, min(1.0, (F(1619) - j) / (F(1619) - F(1579))))
place(amb, 'AMB20', -23.0, lin_out, fade_in=CUES['AMB20']['fadeInFrames'] / FPS)
# MUS20-OUTRO (bed layer) -6 dB from G1445 to its file end (G1561; SS-R5, SS-R4 G1416), no automation (the file carries its own 150 ms tail fade)
place(bed, 'MUS20-OUTRO', -6.0, fade_in=0.002)
# accents: gains from the cue sheet
place(acc, 'SFX20-TAP', -6.0, fade_in=0.002)   # SS-R4 fixlist: -8 -> -6 (Ton)
place(acc, 'SFX20-TICK', -6.0, fade_in=0.002)
place(acc, 'SFX20-ANSWER', -9.5, fade_in=0.002)   # Editor: cue sheet -6 dB clipped the sum over L12 (mix TP +0.9 at G1303); -9.5 keeps peak dV inside -6..3
place(acc, 'SFX20-END', -6.0, fade_in=0.002)     # SS-R5: G1560 (cue sheet frame), the outro's cadence (1445 + 115); ends G1618

# voice: narration R2 (locked E + new L13) whole at G0, padded with silence to the composition length
w = wave.open(VOICE_PATH); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2), VOICE_PATH
v = array.array('h'); v.frombytes(w.readframes(w.getnframes())); assert len(v) <= N
voice = array.array('f', (x / 32768 for x in v)); voice.extend(array.array('f', bytes(4 * (N - len(voice)))))

os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(17)   # stems only: +-1 LSB dither so mix-levels.py's ebur128 never sees all-zero 400 ms windows (EP15 finding)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
wr(voice, 'out/stems/voice.wav', True)
wr(bed, 'out/stems/bed.wav', True); wr(amb, 'out/stems/ambience.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, amb, acc))), 'public/audio/edu/EDU-EP20-SHORT-draft-stem-v3.wav')
