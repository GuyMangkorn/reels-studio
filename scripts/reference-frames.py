#!/usr/bin/env python3
"""Reference stills per composition, so a later re-render can be checked against the delivered picture.

Renders one PNG every 5 s plus the last frame (`render.mjs --stills --gl=angle`) at the current commit and files them
in the asset store ($REELS_STORE, scripts/store.py) as projects/<PROJECT>/reference/<ID>/<commit>/ with hashes.tsv (frame, sha256, PSNR in dB
against the delivered MP4 when --mp4 is given). When an earlier reference set exists, prints how many frames are
byte-identical to it.

  python3 -I scripts/reference-frames.py WFOG-EP01-SHORT [--mp4 WFOG-EP01-SHORT=path/to.mp4] [--every 150]
"""
import argparse, glob, hashlib, importlib.util, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('store', os.path.join(HERE, 'store.py'))
store = importlib.util.module_from_spec(spec)
spec.loader.exec_module(store)


def durations():
    out = subprocess.run(['npx', 'remotion', 'compositions', 'src/index.ts'], capture_output=True, text=True).stdout
    return {m[1]: int(m[2]) for m in re.finditer(r'^(\S+)\s+\d+\s+\d+x\d+\s+(\d+)', out, re.M)}


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def psnr(png, mp4, frame):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', png, '-i', mp4, '-filter_complex',
                        f'[1:v]select=eq(n\\,{frame}),setpts=PTS-STARTPTS[b];[0:v]format=yuv420p[a];[a][b]psnr',
                        '-frames:v', '1', '-f', 'null', '-'], capture_output=True, text=True)
    m = re.search(r'average:(\S+)', r.stderr)
    return m[1] if m else 'n/a'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ids', nargs='+')
    ap.add_argument('--mp4', action='append', default=[], help='ID=path of the delivered MP4 to compare with')
    ap.add_argument('--every', type=int, default=150)
    a = ap.parse_args()
    mp4s = dict(x.split('=', 1) for x in a.mp4)
    total = durations()
    commit = store.version_of('.')
    os.makedirs('out/logs', exist_ok=True)
    for cid in a.ids:
        n = total[cid]
        frames = sorted(set(range(0, n, a.every)) | {n - 1})
        log = f'out/logs/reference-{cid}.log'
        with open(log, 'w') as f:
            r = subprocess.run(['node', 'scripts/render.mjs', cid, '--stills', f'--frames={",".join(map(str, frames))}',
                                '--gl=angle', '--timeout=180000'], stdout=f, stderr=subprocess.STDOUT)
        if r.returncode != 0:
            print(f'{cid}: render failed, see {log}')
            continue
        rel_base = f'projects/{store.project_of(cid)}/reference/{cid}'
        earlier = sorted(glob.glob(os.path.join(store.STORE, rel_base, '*', 'hashes.tsv')), key=os.path.getmtime)
        dest = os.path.join('out', 'reference', cid, commit)  # staged here, then filed into the store
        os.makedirs(dest, exist_ok=True)
        rows = []
        for fr in frames:
            png = os.path.join(dest, f'f{fr:05d}.png')
            shutil.copy2(f'out/{cid}/stills/{fr}.png', png)
            rows.append((fr, sha(png), psnr(png, mp4s[cid], fr) if cid in mp4s else ''))
        with open(os.path.join(dest, 'hashes.tsv'), 'w') as f:
            f.write(f'# {cid} commit {commit} gl=angle; psnr vs {mp4s.get(cid, "-")}\nframe\tsha256\tpsnr_db\n')
            f.writelines(f'{fr}\t{h}\t{p}\n' for fr, h, p in rows)
        clashes = [name for name in sorted(os.listdir(dest))
                   if store.store_file(os.path.join(dest, name), f'{rel_base}/{commit}/{name}', sidecar=False) == 'conflict']
        msg = f'{cid}: {len(rows)} frames -> {os.path.join(store.STORE, rel_base, commit)}'
        if clashes: msg += f'; {len(clashes)} files differ from the set already stored for this commit (kept the stored ones)'
        if cid in mp4s:
            vals = [float(p) for _, _, p in rows if p not in ('', 'n/a', 'inf')]
            msg += f'; PSNR vs MP4 min {min(vals):.1f} dB' if vals else '; PSNR n/a'
        prev = [e for e in earlier if os.path.basename(os.path.dirname(e)) != commit]
        if prev:
            old = {l.split('\t')[0]: l.split('\t')[1] for l in open(prev[-1]) if l[0].isdigit()}
            same = sum(old.get(str(fr)) == h for fr, h, _ in rows)
            msg += f'; {same}/{len(rows)} identical to {os.path.basename(os.path.dirname(prev[-1]))}'
        print(msg)


if __name__ == '__main__':
    sys.exit(main())
