#!/usr/bin/env python3
"""EDU-EP19-SHORT sound mix (Editor, W5.4 Draft, 2026-11-15; SHEETS-R3, cue sheet EDU-EP19-SOUND-R1 without HUFF): places the 78 cues of scripts/edu-series/ep19/sound-cues.json at their integer G frames
(1704 f, 48 kHz mono) and writes the per-layer stems (voice, bed, ambience, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep19/sound-cues.json`, plus the baked
sound stem public/audio/edu/EDU-EP19-SHORT-draft-stem-v1.wav (bed + ambience + texture + accent; the narration is its own track). Levels are `dV` = LU under the placed narration (reference pinned to -16 LUFS, the line files'
normalisation): gain = (VOICE - dV) - file reference (integrated LUFS for beds/loops, momentary max for short cues). Bed and ambience are ducked 6 dB while any voice speaks (hold 0.3 s; the allowance is in the base gain).
Energy steps of M1 (sheet M1a/M1b/M1c notes) are gain offsets: 1.5 = -3 dB, 2 = 0, 2.5 = +1.5, 3 = +3. Repeats of one file vary +-1.5 dB (cue sheet note 5, fixed offsets, no pitch change). Mono stems (the sheet's S07-b
"pan right" is not available in the mono mix; its -12 dB recede is). Nothing here was listened: the mix is by number.
Needs public/narration/EDU-EP19-SHORT-narration-v1.wav (narration-place.py) and the locked files in public/. Run: python3 -I scripts/edu-series/ep19/sound-mix.py"""
import array, json, math, os, random, re, subprocess, wave
TOTAL, FPS, SR = 1704, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
CUES = {c['cue']: c for c in json.load(open('scripts/edu-series/ep19/sound-cues.json'))['cues']}
# every file this mix plays (sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = {
    'public/audio/bed/bed_comic-pizz-marimba-pulse_01.wav',
    'public/audio/city/city_soi-stall-dusk_01.wav',
    'public/audio/nature/nature_training-field-afternoon_01.wav',
    'public/audio/stinger/stinger_guitar-pizz-resolve-c_01.wav',
    'public/sfx/comedy/comedy_harp-idea-pluck_01.wav',
    'public/sfx/comedy/comedy_pizz-run-up-c_01.wav',
    'public/sfx/comedy/comedy_pluck-question-bend_01.wav',
    'public/sfx/comedy/comedy_wood-bonk-deflate_01.wav',
    'public/sfx/creature/creature_dog-pant-lick_01.wav',
    'public/sfx/creature/creature_dog-sniff-long-deliberate_01.wav',
    'public/sfx/creature/creature_dog-sniff-quick_01.wav',
    'public/sfx/creature/creature_dog-sniff-slow-trio_01.wav',
    'public/sfx/creature/creature_dog-whimper-huh_02.wav',
    'public/sfx/foley/foley_child-sit-flop-grass_01.wav',
    'public/sfx/foley/foley_dog-harness-jingle-trot_01.wav',
    'public/sfx/foley/foley_dog-harness-shake_01.wav',
    'public/sfx/foley/foley_dog-paws-patter-walk_01.wav',
    'public/sfx/foley/foley_dog-paws-trot-grass_01.wav',
    'public/sfx/foley/foley_grass-muzzle-rustle-loop_01.wav',
    'public/sfx/foley/foley_mat-drag-foam_01.wav',
    'public/sfx/foley/foley_mat-lift-flop_01.wav',
    'public/sfx/foley/foley_mat-lift-flop_02.wav',
    'public/sfx/foley/foley_mat-slap-grass_01.wav',
    'public/sfx/foley/foley_sneaker-hops-mats_01.wav',
    'public/sfx/foley/foley_sneakers-dash-grass_01.wav',
    'public/sfx/foley/foley_sneakers-patter-grass-sneaky_01.wav',
    'public/sfx/foley/foley_stopwatch-click-far_01.wav',
    'public/sfx/foley/foley_stopwatch-tick-accelerate_01.wav',
    'public/sfx/foley/foley_wok-toss-sizzle-swell_01.wav',
    'public/sfx/reveal/reveal_glow-tone-a-celesta_01.wav',
    'public/sfx/reveal/reveal_glow-tone-c-celesta_01.wav',
    'public/sfx/reveal/reveal_glow-tone-d-celesta_01.wav',
    'public/sfx/reveal/reveal_glow-tone-e-celesta_01.wav',
    'public/sfx/reveal/reveal_glow-tone-g-celesta_01.wav',
    'public/sfx/stinger/stinger_glow-motif-unscrambled_01.wav',
    'public/sfx/ui/ui_toy-bell-smug_01.wav',
    'public/sfx/vocal/vocal_child-yawn-sleepy_01.wav',
    'public/sfx/whoosh/whoosh_time-air-soft_01.wav',
}
assert PLACED == {c['file'] for c in CUES.values()}, 'cue sheet and PLACED differ'
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]
_cache = {}
def rel(c): return c['file'][len('public/'):]
def load(r, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-i', 'public/' + r, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else ''), '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def meas(r):
    if r not in _cache:
        t = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'public/' + r, '-af', 'pan=mono|c0=0.5*c0+0.5*c1,apad=whole_dur=1,ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        _cache[r] = (float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', t, re.M)[-1]), max(float(x) for x in re.findall(r'M:\s*(-?[\d.]+)', t)))
    return _cache[r]
db = lambda x: 10 ** (x / 20)
def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
VOICE_PATH = 'public/narration/EDU-EP19-SHORT-narration-v1.wav'
voice = wav(VOICE_PATH); assert len(voice) == N, ('voice file is %d samples, the mix needs %d (run narration-place.py)' % (len(voice), N))
VOICE = -16.0   # level reference = the line files' normalisation (every line at -16 LUFS); V06 is placed 6 dB lower on purpose (whisper)
def G(dV, r, kind='I'): return VOICE - dV - meas(r)[0 if kind == 'I' else 1]
bed, amb, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(4))
B = SR // 100; nb = N // B
speak = [math.sqrt(sum(x * x for x in voice[i * B:(i + 2) * B]) / max(1, len(voice[i * B:(i + 2) * B]))) / 32768 > db(-46) for i in range(nb)]
held = []; last = -999
for i in range(nb):
    if speak[i]: last = i
    held.append(i - last <= 30)
duck = []; cur = 1.0
for i in range(nb):
    tgt = db(-6) if held[i] else 1.0; k = 1 - math.exp(-1 / (6 if tgt < cur else 30)); cur += (tgt - cur) * k; duck.append(cur)
DUCK = 6.0
def ramp(points):
    pts = [(F(f), d) for f, d in points]
    def g(j):
        if j <= pts[0][0]: return db(pts[0][1])
        if j >= pts[-1][0]: return db(pts[-1][1])
        for (a, x), (b, y) in zip(pts, pts[1:]):
            if a <= j <= b: return db(x + (y - x) * (j - a) / max(1, b - a))
    return g
def put(track, snd, f0, f1, gain_fn, fin=0.004, fout=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain_fn(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
ONE = lambda j: 1.0
def seg(track, cue, dV, pts=None, af='', kind='I', duck_allow=False, extra=0.0):
    """Play the cue's file from its in-point over [frame, endFrame) with the sheet's fades at dV under the voice; `pts` = extra dB envelope on G frames."""
    c = CUES[cue]; r = rel(c); a, b = c['frame'], c['endFrame']; snd = load(r, af)[F(c.get('fileOffsetFrames', 0)):]
    base = G(dV, r, kind) + extra + (DUCK if duck_allow else 0.0); e = ramp(pts) if pts else ONE
    put(track, snd, a, b, lambda j: db(base) * e(j), c.get('fadeInFrames', 0) / FPS or 0.001, c.get('fadeOutFrames', 0) / FPS or 0.001)
REPEAT = [0.0, 1.2, -1.0, 0.7, -1.5, 1.5, -0.6, 0.9]   # dB offsets by occurrence of the same file (cue sheet note 5, +-1.5 dB)
_seen = {}
CAPPED = []
def one(track, cue, dV, kind='M', until=None, af='', fout=0.02, fin=0.002, cap=-3.0, vary=True, extra=0.0, pts=None):
    c = CUES[cue]; r = rel(c); snd = load(r, af)
    n_seen = _seen.get(c['file'], 0); _seen[c['file']] = n_seen + 1
    off = REPEAT[n_seen % len(REPEAT)] if vary else 0.0
    gdb = G(dV, r, kind) + off + extra; pk = max(abs(x) for x in snd) * db(gdb)
    if pk > db(cap): CAPPED.append((cue, cap - 20 * math.log10(pk))); gdb += cap - 20 * math.log10(pk)
    g = db(gdb); s = F(c['frame']); n = len(snd); end = F(until if until else c.get('endFrame') or (c['frame'] + n * FPS / SR + 1)); e = ramp(pts) if pts else ONE
    fi = max(1, int(fin * SR)); fo = max(1, int((c['fadeOutFrames'] / FPS if c.get('fadeOutFrames') else fout) * SR))
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * e(j) * min(1.0, (k + 1) / fi, (n - k) / fo, (end - j) / fo)
E = {1.5: -3.0, 2: 0.0, 2.5: 1.5, 3: 3.0}
AMB, TX, OVER, GAPPK = 22.0, 20.0, 13.5, 0.0

# ================= BED layer (ducked under the voice): M1 in three segments, M2
M1 = 19.0
seg(bed, 'M1a', M1, kind='I', duck_allow=True)                                   # G7-226, energy 2, in-point 8 f, 6 f fade-out for the L02 pause
seg(bed, 'M1b', M1, [(252, E[2]), (316, E[2]), (318, E[2] + 0.5), (330, E[2] + 0.5), (332, E[1.5]), (397, E[1.5]), (399, E[3]), (443, E[2]),   # sheet energy ride: G318 +1.5, G332-399 -3 (energy 1.5),
                     (448, E[2] - 2.0), (505, E[2] - 2.0), (508, E[2]), (564, E[2]), (566, E[2] - 6.0), (589, E[2] - 6.0), (591, E[2]), (676, E[2])], kind='I', duck_allow=True)   # G399 +3 easing to 0 by G443, under V01 -2, S09 thinning -6
seg(bed, 'M1c', M1, [(944, E[2]), (987, E[2]), (989, E[2] - 6.0), (1023, E[2] - 6.0), (1025, E[2] - 12.0), (1037, E[2] - 12.0), (1040, E[2]), (1100, E[2.5]), (1163, E[3]), (1293, E[3])], kind='I', duck_allow=True)   # V04 -6 from G989; held-note dip -12 G1025-1037; 2.5 at G1100; 3 at G1163-1293; hard cut G1293
seg(bed, 'M2', M1, kind='I', duck_allow=True, extra=1.5)                                    # G1536-1701 (chord lands G1603.5), 9 f fade-out

# ================= AMBIENCE layer
seg(amb, 'A1', AMB, [(0, 0), (1450, 0), (1458, -2.5), (1490, -2.5), (1498, 0)], kind='I', duck_allow=True)                                   # G0-1704, 24 f fade-out = A_fade G1680-1704
seg(amb, 'A2', AMB, kind='I', duck_allow=True)                                   # G323-399 inside the soi inset, 9 f in/out

# ================= TEXTURE layer (dV 20 under the voice; gap textures by ear per the sheet)
for cue in ('S01', 'S02', 'S04', 'S10', 'S10b', 'S07-a'): one(tex, cue, TX)
one(tex, 'S07-b', TX + 3.0, pts=[(950, 0), (987, -12)])                                # receding: -12 dB over the 37 f (mono mix, no pan)
for k in range(1, 6): one(tex, 'S03-%d' % k, TX)
for k in range(1, 3): one(tex, 'S16-%d' % k, TX)
for k in (3, 4): one(tex, 'S16-%d' % k, TX + 2.0)   # the last two sit under L05a
c = CUES['S17']; r = rel(c); put(tex, load(r), c['frame'], c['endFrame'], lambda j: db(G(TX + 2.0, r, 'I')), c['fadeInFrames'] / FPS, c['fadeOutFrames'] / FPS)   # 125 f loop file, one pass
one(tex, 'S12', 8.0); one(tex, 'S22', 12.0)                                      # W-WAIT ticks under the whoosh; the hops in the W-MATS gap, soft
for k in (1, 2, 3): one(tex, 'S03-mats%d' % k, 14.0)

# ================= ACCENT layer
for cue in ('S15', 'S18', 'S19', 'S24'): one(acc, cue, OVER)
for cue in ('S05-turn', 'S06', 'S08', 'S08b'): one(acc, cue, OVER + 2.0)
one(acc, 'S09', OVER + 4.5)   # first pass: the background floor (dV >= 15) needed them 2 dB lower
one(acc, 'S11', OVER + 3.0, af='lowpass=f=6000')                                 # far: lowpass 6 kHz, 3 dB lower
one(acc, 'S20', OVER, pts=[(1140, 0), (1142, 0), (1143, -6), (1163, -6), (1170, -6)])   # V05 giggle at G1143: S20 -6 dB from there
for k in range(1, 6): one(acc, 'G%d-print%d' % (k, k), OVER + 2.0)
for k in range(1, 6): one(acc, 'G%d-arp' % k, OVER + 5.5)   # five tones in 24 f plus S05-turn: 5.5 dB lower for the background floor (dV >= 15 over L03)
for cue in ('G4-trail', 'G5-trail'): one(acc, cue, OVER)
for cue in ('G1-sniff1', 'G2-sniff2', 'G3-sniff3'): one(acc, cue, OVER)
for cue in ('G3-climb1', 'G4-climb2', 'G5-climb3'): one(acc, cue, OVER + 3.0)
one(acc, 'S05-sniff', 12.0)                                                      # W-SNIFF silence: soft, peak <= 12 LU under
for cue in ('G5-jumble1', 'G1-jumble2', 'G4-jumble3'): one(acc, cue, 9.0)        # W-MATS gap: soft, 6-12 under the voice level
for cue in ('S05-turn1', 'S05-turn2', 'S05-turn3'): one(acc, cue, OVER + 4.5)    # soft, -6 dB from S05 (S05 itself at OVER 13.5 -> 18)
for cue in ('G4-tick1', 'G1-tick2', 'G5-tick3', 'G2-tick4'): one(acc, cue, 21.0) # very soft ticks, 20+ under L08b
for cue in ('S13',): one(acc, cue, 6.0)                                          # W-WAIT whoosh, soft
one(acc, 'S14', 10.0)                                                            # W-WAIT yawn: far and soft (user accepted 2026-11-15)
for k in range(1, 5): one(acc, 'S21-%d' % k, GAPPK, cap=-1.0)   # gap transients: cap -1 dBFS (the 400 ms meter reads them low)                    # mat slaps, gap peak -6..3 LU
for cue in ('S23a', 'S23b'): one(acc, cue, GAPPK, cap=-1.0)
one(acc, 'M1-flourish', 3.0, cap=-3.0, pts=[(502, 0), (510, 0), (512, -12), (525, -20)])   # its tail runs into the first 0.5 s of L04 (G511): eased -12..-20 dB there                                         # voice-gap level, not louder
one(acc, 'E1', GAPPK, until=CUES['E1']['endFrame'], cap=-3.0)                    # G1640-1703, designed ending, chord at G1673; no HUFF (user, 2026-11-15)

# ================= stems
for cue, d in CAPPED: print('  capped: %s gain lowered by %.1f dB to peak -3 dBFS' % (cue, -d))
def apply_duck(tr):
    for i in range(nb):
        g = duck[i]
        for j in range(i * B, (i + 1) * B): tr[j] *= g
apply_duck(bed); apply_duck(amb)
for tr in (bed, amb, tex, acc):
    for j in range(F(TOTAL), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(17)   # stems only: +-1 LSB dither so mix-levels.py's ebur128 never sees all-zero 400 ms windows (EP15 finding)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
wr(array.array('f', (x / 32767 for x in voice)), 'out/stems/voice.wav', True)
wr(bed, 'out/stems/bed.wav', True); wr(amb, 'out/stems/ambience.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c + d for a, b, c, d in zip(bed, amb, tex, acc))), 'public/audio/edu/EDU-EP19-SHORT-draft-stem-v1.wav')
