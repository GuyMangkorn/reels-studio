"""EDU-EP03 W5.2: ball and lead measures on shot stills, pure Python + ffmpeg (no numpy).
Usage: python3 -I scripts/edu03/measure-ball.py red|blue|olive [--box=x0,y0,x1,y1] still.png [...]
Prints the bbox of ball-coloured pixels (largest cluster around the median): centre, width, height, bottom y, pixel count.
Red: R>170, G<95, B<95. Blue: B>170, R<90, 70<G<150. Use red/blue on NORMAL-colour stills; `olive` finds the red ball's dog-view colour (yellow-olive) in a dog-view still."""
import shutil, subprocess, sys
W, H = 1080, 1920
FF = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
col = sys.argv[1]
args = sys.argv[2:]
box = (0, 0, W, H)
if args and args[0].startswith('--box='):
    box = tuple(int(v) for v in args[0][6:].split(',')); args = args[1:]
for f in args:
    raw = subprocess.run([FF, '-v', 'error', '-i', f, '-vf', f'scale={W}:{H}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    pts = []
    for y in range(box[1], box[3]):
        row = raw[y * W * 3:(y + 1) * W * 3]
        for x in range(box[0], box[2]):
            r, g, b = row[x * 3], row[x * 3 + 1], row[x * 3 + 2]
            if (col == 'red' and r > 170 and g < 95 and b < 95) or (col == 'blue' and b > 170 and r < 90 and 70 < g < 150) or (col == 'olive' and 95 < r < 165 and 90 < g < 150 and b < 75 and abs(r - g) < 28):
                pts.append((x, y))
    name = f.split('/')[-1]
    if len(pts) < 30:
        print(name, 'none', len(pts)); continue
    xs = sorted(p[0] for p in pts); ys = sorted(p[1] for p in pts)
    mx, my = xs[len(xs) // 2], ys[len(ys) // 2]
    k = [p for p in pts if abs(p[0] - mx) < 120 and abs(p[1] - my) < 120]
    x0, x1, y0, y1 = min(p[0] for p in k), max(p[0] for p in k), min(p[1] for p in k), max(p[1] for p in k)
    print(name, f'centre ({(x0 + x1) // 2},{(y0 + y1) // 2}) w {x1 - x0 + 1} h {y1 - y0 + 1} bottom {y1} n {len(k)}')
