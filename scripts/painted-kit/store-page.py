#!/usr/bin/env python3
"""Kit page at the asset-store root: $REELS_STORE/index.html shows the painted kit (cast cards, people sheets with face looks,
poses, motions, expressions, wardrobe) so a person or agent can browse it without a checkout.

Usage: python3 -I scripts/painted-kit/store-page.py [--skip-render]
  1. renders the sheets (people.mjs, KIT-CAST-CARDS, poses.mjs, KIT-FACE-CAST) into out/kit-page/ and KIT-MOTIONS through scripts/render.mjs
     (--skip-render reuses what is already there);
  2. dumps the kit tables (scripts/painted-kit/kit-data.ts);
  3. files the media into library/kit-page/<date>-<hash>/ (store.py import: immutable, a changed kit gets a new folder);
  4. writes $REELS_STORE/index.html pointing at that folder.
"""
import argparse, datetime, glob, hashlib, json, os, shutil, subprocess, sys

STORE = os.path.expanduser(os.environ.get('REELS_STORE') or '~/ReelsStore')
OUT = 'out/kit-page'
MEDIA = f'{OUT}/media'


def run(cmd, **kw):
    print('$', cmd if isinstance(cmd, str) else ' '.join(cmd), flush=True)
    subprocess.run(cmd, check=True, **kw)


def render():
    run(['node', 'scripts/painted-kit/people.mjs', f'--out={OUT}'])
    run(['node', 'scripts/stills.mjs', 'src/painted/kit/cast-cards-sheet.tsx'], input=f'KIT-CAST-CARDS 0 {OUT}/KIT-CAST-CARDS.png\n', text=True)
    run(['node', 'scripts/painted-kit/poses.mjs', f'--out={OUT}'])
    run(['node', 'scripts/stills.mjs', 'src/painted/kit/face-looks-sheet.tsx'], input=f'KIT-FACE-CAST 0 {OUT}/KIT-FACE-CAST.png\n', text=True)
    run(['node', 'scripts/render.mjs', 'KIT-MOTIONS', '--gl=angle', '--timeout=180000'])


def collect():
    """Copy the page media into MEDIA: full PNGs, 640 px JPEG thumbnails, data.json and one clip per motion."""
    shutil.rmtree(MEDIA, ignore_errors=True)
    os.makedirs(f'{MEDIA}/thumb')
    for png in sorted(glob.glob(f'{OUT}/KIT-*.png')):
        name = os.path.basename(png)
        shutil.copy(png, f'{MEDIA}/{name}')
        run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '640', png, '--out', f'{MEDIA}/thumb/{name[:-4]}.jpg'], stdout=subprocess.DEVNULL)
    mp4 = sorted(glob.glob('out/KIT-MOTIONS/*.mp4'), key=os.path.getmtime)
    if not mp4: sys.exit('no out/KIT-MOTIONS/*.mp4: render KIT-MOTIONS first')
    with open(f'{MEDIA}/data.json', 'w') as f:
        subprocess.run(['npx', 'tsx', 'scripts/painted-kit/kit-data.ts'], check=True, stdout=f)
    # One 540 px clip per motion scene: plays on any server (no Range seeking needed) and loads only what is clicked.
    os.makedirs(f'{MEDIA}/motions')
    for m in json.load(open(f'{MEDIA}/data.json'))['motions']:
        run(['ffmpeg', '-v', 'error', '-y', '-i', mp4[-1], '-ss', f"{m['start']:.3f}", '-t', f"{m['sec']:.3f}", '-an', '-vf', 'scale=540:-2',
             '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', f"{MEDIA}/motions/{m['id']}.mp4"])


def file_media():
    h = hashlib.sha256()
    for p in sorted(glob.glob(f'{MEDIA}/**/*', recursive=True)):
        if os.path.isfile(p): h.update(p.encode()); h.update(open(p, 'rb').read())
    prefix = f'library/kit-page/{datetime.date.today().isoformat()}-{h.hexdigest()[:8]}'
    run(['python3', '-I', 'scripts/store.py', 'import', MEDIA, prefix])
    return prefix


def write_page(prefix):
    data = json.load(open(f'{MEDIA}/data.json'))
    images = sorted(os.path.basename(p)[:-4] for p in glob.glob(f'{MEDIA}/KIT-*.png'))
    page = open(os.path.join(os.path.dirname(__file__), 'store-page.html')).read()
    page = page.replace('__BASE__', prefix).replace('__DATA__', json.dumps(data)).replace('__IMAGES__', json.dumps(images))
    page = page.replace('__BUILT__', f'{datetime.datetime.now():%Y-%m-%d %H:%M} · {prefix}')
    with open(os.path.join(STORE, 'index.html'), 'w') as f: f.write(page)
    print(os.path.join(STORE, 'index.html'))


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--skip-render', action='store_true')
    a = ap.parse_args()
    if not a.skip_render: render()
    collect()
    write_page(file_media())
