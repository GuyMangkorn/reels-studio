"""EDU-EP14 W3 look-frame pixel measures (stdlib only; ffmpeg decodes). Usage: python3 -I scripts/edu-series/ep14/measure-looks.py FRAME.png [FRAME2.png ...]
Prints one JSON line per frame: mean HSV saturation (S), mean chroma (max-min, 0..1) and mean value (V) over the whole frame (guides off for a clean read). The chroma ratio of the graded frame to its real-colour twin is the grade's saturation scale (HSV S is unstable in dark pixels)."""
import json, shutil, subprocess, sys
FF = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
W, H = 1080, 1920
for path in sys.argv[1:]:
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    s = v = ch = n = 0
    for i in range(0, len(raw), 3 * 7):  # every 7th pixel
        r, g, b = raw[i], raw[i + 1], raw[i + 2]
        mx, mn = max(r, g, b), min(r, g, b)
        s += (mx - mn) / mx if mx else 0
        v += mx / 255
        ch += (mx - mn) / 255
        n += 1
    print(json.dumps({'frame': path.split('/')[-1], 'meanS': round(s / n, 4), 'meanChroma': round(ch / n, 4), 'meanV': round(v / n, 3)}))
