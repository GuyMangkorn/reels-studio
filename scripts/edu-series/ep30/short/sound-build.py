"""EDU-EP30-SHORT sound build (W5.2s): turns the picked audio-studio candidates in library/sound/_raw into the
episode's cue files (48 kHz 24-bit stereo WAV) in $REELS_STORE/library/sound/_raw/ep30r2-proc/, then files them with
scripts/sound-library.py. Stdlib + ffmpeg only. Run:  python3 -I scripts/edu-series/ep30/short/sound-build.py [--file]
Picks were made by measured shape (see sound-notes.md next to this file). Bursts are assembled sample-exact:
one Lewis crack unit repeated every 0.100 s (3 frames at 30 fps), so the round count and spacing are exact.
"""
import array, json, math, os, re, subprocess, sys

STORE = os.path.expanduser(os.environ.get('REELS_STORE') or '~/ReelsStore')
RAW = os.path.join(STORE, 'library', 'sound', '_raw')
OUT = os.path.join(RAW, 'ep30r2-proc')
SR = 48000
os.makedirs(OUT, exist_ok=True)


def raw(name): return os.path.join(RAW, name + '.wav')


def seg(name, t0=0.0, t1=None, af=None, fin=0, fout=0):
    """Decode a candidate segment to two float channels (list of array('f'))."""
    chain = []
    if af: chain.append(af)
    dur = (t1 - t0) if t1 else None
    if fin: chain.append(f'afade=t=in:d={fin / 1000:.4f}')
    if fout and dur: chain.append(f'afade=t=out:st={max(0, dur - fout / 1000):.4f}:d={fout / 1000:.4f}')
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{t0}']
    if t1: cmd += ['-t', f'{dur:.4f}']
    cmd += ['-i', raw(name)]
    if chain: cmd += ['-af', ','.join(chain)]
    cmd += ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']
    b = subprocess.run(cmd, capture_output=True, check=True).stdout
    a = array.array('f'); a.frombytes(b)
    return [a[0::2], a[1::2]]


def mono_env(name, win=0.01):
    c = seg(name)[0]; n = int(SR * win)
    return [10 * math.log10(sum(x * x for x in c[i:i + n]) / n + 1e-12) for i in range(0, len(c) - n, n)]


def blank(sec): return [array.array('f', [0.0]) * int(sec * SR), array.array('f', [0.0]) * int(sec * SR)]


def put(dst, src, at, gain_db=0.0):
    g = 10 ** (gain_db / 20); o = int(at * SR)
    for ch in (0, 1):
        d, s = dst[ch], src[ch]
        for i in range(min(len(s), len(d) - o)):
            if o + i >= 0: d[o + i] += s[i] * g
    return dst


def fade_tail(c, ms):
    n = int(SR * ms / 1000)
    for ch in (0, 1):
        L = len(c[ch])
        for i in range(min(n, L)): c[ch][L - 1 - i] *= i / n
    return c


def peak(c): return max(max(abs(x) for x in c[0]), max(abs(x) for x in c[1]))


def scale(c, db):
    g = 10 ** (db / 20)
    for ch in (0, 1):
        for i in range(len(c[ch])): c[ch][i] *= g
    return c


def loop_xfade(c, ms):
    """Seamless loop: crossfade the tail into the head; output shorter by the crossfade."""
    n = int(SR * ms / 1000); out = []
    for ch in (0, 1):
        a = c[ch]; L = len(a) - n; o = array.array('f', a[:L])
        for i in range(n):
            w = i / n; o[i] = a[i] * w + a[L + i] * (1 - w)
        out.append(o)
    return out


def write(c, sid, norm='peak', src=None, notes='', loop=False):
    path = os.path.join(OUT, sid + '.wav')
    if norm == 'peak':
        p = peak(c); scale(c, -1.0 - 20 * math.log10(max(p, 1e-9)))
    data = array.array('f'); data.extend([0.0] * (len(c[0]) * 2))
    data[0::2] = c[0]; data[1::2] = c[1]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', path],
                   input=data.tobytes(), check=True)
    if norm == 'loudness':
        r = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
        lufs = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); pk = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
        gain = min(-14.0 - lufs, -1.0 - pk)
        scale(c, gain)
        data[0::2] = c[0]; data[1::2] = c[1]
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', path],
                       input=data.tobytes(), check=True)
        notes += f' Loudness-normalised to -14 LUFS (gain {gain:+.1f} dB, peak ceiling -1 dBFS).'
    side = {}
    if src and os.path.exists(raw(src) + '.json'):
        side = json.load(open(raw(src) + '.json'))
    side = dict(side); side['source_candidate'] = src; side['processing'] = notes.strip(); side['seconds'] = round(len(c[0]) / SR, 3)
    json.dump(side, open(path + '.json', 'w'), indent=2, ensure_ascii=False)
    print(f'{sid}: {len(c[0]) / SR:.3f} s')
    return path


def one(sid, name, t0, t1, fin=2, fout=30, af=None, norm='peak', notes=''):
    return write(seg(name, t0, t1, af=af, fin=fin, fout=fout), sid, norm, name, f'{name} [{t0}, {t1}] s, fade-in {fin} ms, fade-out {fout} ms. {notes}')


def loudest(name, t_from, t_to, win=0.05):
    c = seg(name)[0]; n = int(SR * win); best = (-1, 0)
    for i in range(int(t_from * SR), int(t_to * SR) - n, n // 4):
        e = sum(x * x for x in c[i:i + n])
        if e > best[0]: best = (e, i / SR)
    return best[1]


def isolated_onset(name, t_from, t_to, quiet_before=0.12):
    e = mono_env(name, 0.01); best = None
    for i in range(int(t_from * 100) + 12, int(t_to * 100) - 3):
        rise = e[i] - e[i - 1]
        if rise > 10 and max(e[i - 12:i - 1]) < e[i] - 18:
            if best is None or e[i] > best[0]: best = (e[i], i / 100)
    return best[1] if best else None


def build():
    # ---- beds and ambience (loops, -14 LUFS)
    write(loop_xfade(seg('ep30-b01-whirr-bed_v2', 0.35, 11.6), 500), 'mechanical_projector-whirr-bed_01', 'loudness', 'ep30-b01-whirr-bed_v2',
          'Trimmed 0.35-11.6 s (drops the start and end clicks), 500 ms crossfaded loop.')
    write(loop_xfade(seg('ep30-amb-paddock_v2', 0.0, 15.6), 1000), 'outdoor_wheat-wind-plain_01', 'loudness', 'ep30-amb-paddock_v2',
          'Trimmed 0-15.6 s, 1000 ms crossfaded loop.')
    write(loop_xfade(seg('ep30-amb-dam_v2', 0.0, 13.4), 1000), 'water_dam-lap-windmill_01', 'loudness', 'ep30-amb-dam_v2',
          'Trimmed 0-13.4 s, 1000 ms crossfaded loop.')
    write(seg('ep30-amb-city_v1', 0.0, 13.0, fin=200, fout=300), 'city_plaza-morning-magpie_01', 'loudness', 'ep30-amb-city_v1', 'Trimmed 0-13.0 s; the magpie warble sits at about 1.6-2.4 s. Not a loop.')
    c = loop_xfade(seg('ep30-truck-labour_v1', 0.2, 7.6), 500)
    write(c, 'mechanical_truck-engine-labouring-loop_01', 'loudness', 'ep30-truck-labour_v1', 'Trimmed 0.2-7.6 s, 500 ms crossfaded loop.')

    # ---- music (-14 LUFS), cut to the cue ranges
    one('music_newsreel-march-intro_01', 'ep30-mus01-intro_v1', 1.97, 5.50, fin=8, fout=15, norm='loudness',
        notes='Sting onset at 1.57 s (frame 47) by trimming the start 1.97 s; cut dead at 3.53 s (frame 106).')
    one('music_newsreel-march-jaunty_01', 'ep30-mus02-jaunty_v2', 0.20, 9.30, fin=10, fout=40, norm='loudness', notes='9.1 s = frames 200-473.')
    one('music_newsreel-march-reentry_01', 'ep30-mus02-jaunty_v2', 12.0, 14.27, fin=120, fout=20, norm='loudness', notes='2.27 s = frames 592-660, enters dipped (level set by the mix).')
    roll = seg('ep30r2-snare-roll_v3', 0.9, 1.1333, fin=40, fout=0)
    hit = seg('ep30r2-tutti-hit_v2', 0.0, 0.2, fin=0, fout=5)
    c = blank(13 / 30); put(c, roll, 0.0); put(c, hit, 7 / 30, -2)
    write(c, 'music_march-roll-hit_01', 'peak', 'ep30r2-tutti-hit_v2', 'Snare-roll crescendo 0.233 s (v3 of ep30r2-snare-roll) then brass-and-snare tutti hit 0.2 s cut dead at 0.433 s = frames 660-673.')
    one('music_ambush-pizzicato-vamp_01', 'ep30-mus04-ambush_v2', 0.40, 6.0, fin=30, fout=30, norm='loudness', notes='5.6 s = frames 868-1035 (167 f = 5.57 s).')
    one('music_galop-chase_01', 'ep30-mus05-galop_v3', 0.0, 6.7, fin=0, fout=40, norm='loudness', notes='6.7 s = frames 1150-1350.')
    one('music_brass-chorale-admiring_01', 'ep30-mus06-chorale_v1', 0.1, 3.47, fin=60, fout=25, norm='loudness', notes='3.37 s = frames 1441-1542.')
    one('music_brass-held-chord_01', 'ep30r2-mus06b-chord_v1', 0.1, 1.07, fin=50, fout=200, norm='loudness', notes='0.97 s = frames 1549-1578.')
    one('music_tired-march-detuned_01', 'ep30r2-mus07-tired-march_v1', 0.1, 3.37, fin=20, fout=40, norm='loudness', notes='3.27 s = frames 1639-1737.')
    one('music_anthem-brass-pad_01', 'ep30r2-mus08-anthem_v2', 0.05, 4.82, fin=700, fout=300, norm='loudness', notes='4.77 s = frames 1741-1884, original anthem-style pad.')
    one('stinger_brass-parade-end-button_01', 'ep30r2-end-button_v1', 0.0, 1.33, fin=2, fout=25, notes='1.33 s = frames 1937-1977; flam then major chord ringing to the end.')

    # ---- gun: sample-exact bursts from one crack unit
    unit = seg('ep30r2-lewis-crack_v1', 0.03, 0.50, fin=1, fout=60)
    echo = seg('ep30r2-lewis-crack_v1', 0.03, 0.50, af='lowpass=f=2500', fin=1, fout=60)
    c = blank(22 * 0.1 + 0.45)
    for k in range(23):
        put(c, unit, k * 0.1); put(c, echo, k * 0.1 + 0.17, -13)
    fade_tail(c, 30)
    write(c, 'impact_lewis-burst-plain-23_01', 'peak', 'ep30r2-lewis-crack_v1',
          '23 cracks at exactly 0.100 s (3 frames), first attack at about 5 ms, last crack at 2.200 s (frame 690 + 66 = 756), natural 0.45 s tail; slap echo 0.17 s at -13 dB.')
    unit = seg('ep30r2-lewis-crack-wet_v1', 0.06, 0.52, fin=1, fout=50)
    c = blank(10 * 0.1 + 0.07)
    for k in range(10): put(c, unit, k * 0.1)
    last = seg('ep30r2-lewis-crack-wet_v1', 0.06, 0.13, fin=1, fout=8)
    put(c, last, 1.0)
    fade_tail(c, 12)
    # trim the previous unit's tail under the last crack: nothing else follows, so the file ends dead 70 ms after it
    write(c, 'impact_lewis-burst-wet-11_01', 'peak', 'ep30r2-lewis-crack-wet_v1',
          '11 cracks at exactly 0.100 s, the last one cut to 70 ms with an 8 ms fade so the burst ends dead (no tail); last crack at 1.000 s (frame 1003 + 30 = 1033).')

    # ---- projector, gate, small mechanical
    one('mechanical_projector-wind-down_01', 'ep30-projector-stop_v1', 0.0, 0.8, fin=2, fout=40)
    one('mechanical_projector-speed-up-down_01', 'ep30-projector-speed_v1', 0.05, 1.35, fin=5, fout=150)
    one('mechanical_lewis-bolt-open_01', 'ep30-bolt-open_v1', 0.0, 0.25, fin=1, fout=60)
    one('mechanical_gun-jam-click_01', 'ep30-metal-click_v3', 0.0, 0.2, fin=1, fout=50)
    one('mechanical_gun-jam-click-offaxis_01', 'ep30-metal-click_v3', 0.0, 0.12, fin=1, fout=40, af='lowpass=f=5000', notes='Same design as gun-jam-click, low-passed for 1.5 m off-axis; level set by the mix.')
    one('mechanical_gun-smoke-puff_01', 'ep30-smoke-puff_v1', 0.0, 0.35, fin=5, fout=80)
    one('foley_brass-casing-tinkle_01', 'ep30-casing-tinkle_v1', 0.0, 0.45, fin=1, fout=100)
    a = seg('ep30r2-cocking-rack_v2', 0.045, 0.14, fin=1, fout=8); b = seg('ep30r2-cocking-rack_v2', 0.31, 0.40, fin=1, fout=30)
    c = blank(0.2); put(c, a, 0.0); put(c, b, 0.075)
    write(c, 'mechanical_lewis-cocking-rack_01', 'peak', 'ep30r2-cocking-rack_v2', 'Pull and run-home clacks of v2 re-timed 75 ms apart; whole rack about 0.17 s (5 frames).')
    tick = seg('ep30r2-watch-tick_v3', 0.0, 0.04, fin=0, fout=15)
    c = blank(0.2); put(c, tick, 0.0); put(c, tick, 0.1)
    write(c, 'mechanical_watch-tick-pair_01', 'peak', 'ep30r2-watch-tick_v3', 'One tick unit twice, 0.100 s (3 frames) apart.')
    one('creature_emu-foot-tap_01', 'ep30r2-foot-tap_v1', 0.0, 0.25, fin=1, fout=60)

    # ---- creatures and foley
    one('creature_emu-curious-grunt_01', 'ep30-emu-grunt_v2', 0.05, 0.55, fin=15, fout=80)
    one('creature_emu-boom_01', 'ep30-emu-boom_v1', 0.0, 0.8, fin=2, fout=80)
    t = loudest('ep30-emu-steps_v2', 0.0, 2.0)
    one('creature_emu-step-padded_01', 'ep30-emu-steps_v2', max(0, t - 0.05), t + 0.30, fin=5, fout=100, notes='Single step cut at the loudest 50 ms of the candidate.')
    one('creature_emu-beak-click_01', 'ep30r2-beak-click_v3', 0.0, 0.12, fin=1, fout=30)
    one('creature_emu-flock-startled-plain_01', 'ep30-emus-startled-plain_v2', 0.0, 1.2, fin=10, fout=200)
    one('creature_emu-flock-startled-dam_01', 'ep30-emus-startled-dam_v1', 0.0, 1.2, fin=5, fout=200)
    one('creature_emu-flock-scatter_01', 'ep30-scatter_v1', 0.0, 1.6, fin=5, fout=300)
    one('comedy_slide-whistle-cheeky-up_01', 'ep30-slide-whistle_v3', 0.03, 0.30, fin=3, fout=20)
    one('comedy_slide-whistle-cheeky-down_01', 'ep30r2-whistle-down_v3', 0.07, 0.40, fin=3, fout=20)
    one('creature_emu-wing-flick_01', 'ep30r2-wing-swish_v1', 0.04, 0.30, fin=3, fout=60)
    one('creature_emu-feet-patter-off_01', 'ep30r2-feet-patter_v1', 0.0, 1.0, fin=3, fout=300)
    one('foley_brass-casings-dirt_01', 'ep30-casings-dirt_v2', 0.1, 1.9, fin=3, fout=200)
    one('foley_brass-casings-water_01', 'ep30-casings-water_v3', 0.0, 1.1, fin=1, fout=150)
    one('water_rounds-strike-mud_01', 'ep30-strikes-mud_v2', 0.05, 1.0, fin=3, fout=150)
    one('tension_ear-ring-tail_01', 'ep30-ring-tail_v1', 0.0, 1.2, fin=5, fout=400)
    one('tension_ear-ring-dam_01', 'ep30-ring-dam_v1', 0.0, 0.3, fin=5, fout=150, notes='0.3 s = 9 frames decay, gone by 1044.')
    one('foley_wheat-peck-loop_01', 'ep30-peck-loop_v1', 0.03, 5.6, fin=5, fout=60)
    t = isolated_onset('ep30-peck-loop_v1', 0.1, 5.4) or 1.0
    one('foley_wheat-peck-single_01', 'ep30-peck-loop_v1', max(0, t - 0.02), t + 0.25, fin=2, fout=80, notes=f'Single peck cut at the isolated onset {t:.2f} s of the peck loop.')
    one('foley_emu-column-shuffle_01', 'ep30-marching-shuffle_v2', 0.1, 2.5, fin=20, fout=150)
    t = loudest('ep30-marching-shuffle_v2', 2.5, 3.8, win=0.08)
    one('foley_emu-unison-step_01', 'ep30-marching-shuffle_v2', max(0, t - 0.1), t + 0.25, fin=10, fout=100, notes=f'Combined step cut around {t:.2f} s of the shuffle candidate.')
    r = seg('ep30-run-loop_v1', 0.1, 3.5); r2 = seg('ep30-run-loop_v1', 0.1, 3.5, af='lowpass=f=3000')
    c = blank(3.4 + 0.12); put(c, r, 0.0); put(c, r2, 0.11, -4)
    c = [c[0][:int(3.4 * SR)], c[1][:int(3.4 * SR)]]
    write(loop_xfade(c, 150), 'foley_emu-flock-run-loop_01', 'peak', 'ep30-run-loop_v1', 'One runner layered with a 110 ms offset, low-passed copy (a small flock), 150 ms crossfaded loop.')
    one('foley_emu-slowmo-steps_01', 'ep30-slowmo-steps_v1', 0.03, 3.0, fin=20, fout=200)
    one('foley_feather-cloth-swish_01', 'ep30r2-bow-swish_v1', 0.04, 0.55, fin=80, fout=150)

    # ---- vehicle
    one('vehicle_truck-1930s-putter-away_01', 'ep30-truck-putter_v1', 0.0, 2.4, fin=20, fout=1000)
    one('vehicle_truck-1930s-arrive-brakes_01', 'ep30-truck-arrive_v1', 0.27, 2.77, fin=10, fout=400, notes='Start trimmed 0.27 s so the brake squeal lands near local 40.')
    one('vehicle_truck-1930s-pull-up-short_01', 'ep30-truck-arrive_v2', 0.0, 0.6, fin=100, fout=150)
    one('vehicle_leaf-spring-creak-bang_01', 'ep30-spring-creak_v1', 0.0, 0.45, fin=2, fout=80)
    one('vehicle_tank-track-clank_01', 'ep30-tank-clank_v1', 0.02, 1.02, fin=2, fout=120)

    # ---- brass, bells, comic
    one('comedy_brass-fanfare-sputter_01', 'ep30-fanfare-sputter_v3', 0.12, 1.0, fin=5, fout=100)
    one('comedy_parade-drum-tap_01', 'ep30-drum-tap_v1', 0.0, 0.3, fin=0, fout=80)
    one('comedy_tuba-slide-down_01', 'ep30-tuba-slide_v1', 0.04, 1.27, fin=10, fout=80)
    one('comedy_bugle-retreat-flat_01', 'ep30-bugle-retreat_v1', 0.03, 1.03, fin=8, fout=100)
    one('ui_brass-counter-bell_01', 'ep30-bell-ding_v1', 0.0, 0.6, fin=1, fout=120)
    one('ui_shop-door-bell_01', 'ep30r2-shop-bell_v2', 0.0, 0.45, fin=1, fout=80)
    one('ui_polite-ting_01', 'ep30r2-ting_v3', 0.0, 0.45, fin=1, fout=150)
    one('crowd_polite-applause-far_01', 'ep30r2-applause_v3', 0.0, 0.45, fin=5, fout=100)
    one('impact_trailer-hit-cymbal_01', 'ep30-trailer-hit_v1', 0.02, 1.52, fin=2, fout=300)
    one('impact_lewis-single-shot-deflated_01', 'ep30-single-shot_v1', 0.0, 0.3, fin=0, fout=100)


if __name__ == '__main__':
    build()
