"""EDU-EP31-SCENE-R1 projection check (copy of the EP30 runner; caption band for the 71.4 px two-line card): runs scripts/shot-projection.py on every shot state in projection-shots.json.
Camera states use the kit YCam convention (src/painted/kit/ycam.ts): yaw deg (0 looks -z, + toward +x), pitch deg (+ up), f px at
1080x1920, hy = principal row, cx = horizontal offset. Converted to shot-projection's vfov + shift; caption band 1100-1344.
Run from the checkout root: python3 -I scripts/edu-series/ep31/short/projection-run.py [> out/logs/ep31-projection.txt]"""
import json, math, os, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
shots = json.load(open(os.path.join(HERE, 'projection-shots.json')))
for sid, st in shots.items():
    for state, c in st['cams'].items():
        yaw, pit = math.radians(c['yaw']), math.radians(c.get('pitch', 0))
        d = [math.sin(yaw) * math.cos(pit), math.sin(pit), -math.cos(yaw) * math.cos(pit)]
        j = {'up': 'y', 'camera': {'position': c['eye'], 'direction': d, 'vfov': 2 * math.degrees(math.atan(960 / c['f'])),
             'shift': [-c.get('cx', 0) / 1920, (c['hy'] - 960) / 1920]},
             'points': st['points'], 'spans': st.get('spans', {}), 'caption_band': [1100, 1344]}
        with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as t:
            json.dump(j, t)
        o = json.loads(subprocess.check_output(['python3', '-I', os.path.join(REPO, 'scripts', 'shot-projection.py'), t.name, '--min-height', '480']))
        os.unlink(t.name)
        sp = ' '.join(f"{k}={v.get('px', 'ERR')}" for k, v in o['spans'].items())
        pts = ' '.join(f"{k}({v['x']},{v['y']}{' CAP' if v.get('in_caption_band') else ''}{'' if v.get('in_frame') else ' OUT'})" if 'x' in v else f'{k}(BEHIND)'
                       for k, v in o['points'].items())
        print(f'{sid}@{state}: {sp} | {pts}')
