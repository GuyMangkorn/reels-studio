"""Measure actual CH-KID L artwork on magenta, with the ground shadow disabled by the owner."""
import json
import os
import sys
import math
from pathlib import Path
import subprocess

# HANAKO_OUT selects the evidence folder written by render-g1.mjs (before/after pairs); default unchanged.
if '--g3' in sys.argv:
    root=Path(os.environ.get('HANAKO_OUT','out/qa/hanako/g3'))
    frames=json.loads((root/'frames.json').read_text())
    shots=['B07-SH01','B07-SH02','B07-SH03','B08-SH01','B09-SH01']
    if '--labels' in sys.argv:
        for shot in [*shots,'G3-summary']:
            subprocess.run(['python3','-I','scripts/zombie-condo-paint/label-sheet.py',str(root/f'{shot}-manifest.tsv'),str(root/('G3-summary.png' if shot=='G3-summary' else f'{shot}-labelled.png')),'--cols','3','--width','270','--title','HANAKO-SHORT / SCENE-R3 / G3'],check=True)
        sys.exit(0)
    if '--sheets' in sys.argv:
        for shot in shots:
            rows=sorted((r for r in frames if r['shot']==shot),key=lambda r:r['f'])
            subprocess.run(['sh','scripts/qa-sheet.sh',str(root/f'{shot}-sheet.png'),'--cols','4',*[r['output'] for r in rows]],check=True)
            for i in range(0,len(rows),12):
                subprocess.run(['sh','scripts/qa-sheet.sh',str(root/f'{shot}-sheet-{i//12+1:02}.png'),'--cols','4',*[r['output'] for r in rows[i:i+12]]],check=True)
            (root/f'{shot}-manifest.tsv').write_text(''.join(f"{r['output']}\t{shot} / HANAKO-SHORT / SCENE-R3\tF{r['F']} ({r['F']/30:.2f}s) [f{r['f']}] / standalone plate\n" for r in rows))
        chosen=[('B07-SH01',189),('B07-SH02',161),('B07-SH03',105),('B08-SH01',120),('B09-SH01',45),('B09-SH01',293)]
        rows=[next(r for r in frames if r['shot']==shot and r['f']==f) for shot,f in chosen]
        (root/'G3-summary-manifest.tsv').write_text(''.join(f"{r['output']}\t{r['shot']} / SCENE-R3\tHANAKO-SHORT F{r['F']} [f{r['f']}]\n" for r in rows))
        subprocess.run(['sh','scripts/qa-sheet.sh',str(root/'G3-summary-raw.png'),'--cols','3',*[r['output'] for r in rows]],check=True)
        sys.exit(0)
    def rgb(name):
        return subprocess.run(['ffmpeg','-v','error','-i',str(root/name),'-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True).stdout
    def diff(a,b):
        x,y=rgb(a),rgb(b);ds=[abs(i-j) for i,j in zip(x,y)]
        return {'changed_channels':sum(d>0 for d in ds),'max_channel_delta':max(ds),'byte_identical_png':(root/a).read_bytes()==(root/b).read_bytes()}
    lead=[]
    for f in [0,95,189]:
        raw=rgb(f'lead-f{f}.png')
        points=[i//3 for i in range(0,len(raw),3) if not(raw[i]>=245 and raw[i+1]<=10 and raw[i+2]>=245)]
        x0,x1=min(i%1080 for i in points),max(i%1080 for i in points)
        y0,y1=min(i//1080 for i in points),max(i//1080 for i in points)
        lead.append({'shot':'B07-SH01','f':f,'F':1588+f,'bbox':[x0,y0,x1,y1],'visible_height_px':y1-y0+1,'pass_480':y1-y0+1>=480,'method':'isolated CH-KID A artwork, no shadow/glow/padding; magenta 245/10/245'})
    lead += [{'shot':shot,'visible_height_px':None,'reason':reason} for shot,reason in [
      ('B07-SH02','N/A: map'),('B07-SH03','N/A: flat doodle on a poster, no body lead'),
      ('B08-SH01','VD16 approved door/ensemble lead: 401px door, silhouettes 261-318px before push, not 480px bodies'),
      ('B09-SH01','N/A: POV hand')]]
    (root/'lead-height.json').write_text(json.dumps(lead,indent=2)+'\n')
    checks={'loop_F2595_to_F0_hook_off':diff('B09-SH01-f293.png','loop-landing-f0.png'),
      'repeat_F2595':diff('B09-SH01-f293.png','repeat-f293.png'),
      'post_glow_layers_off':{str(2302+f):diff(f'B09-SH01-f{f:03}.png',f'layers-off-f{f}.png') for f in [81,204,293]},
      'peak_vs_layers_off':diff('B09-SH01-f045.png','layers-off-f45.png')}
    checks['alpha_endpoints']={}
    for name in ['B09-SH01-f293.png','loop-landing-f0.png']:
      raw=subprocess.run(['ffmpeg','-v','error','-i',str(root/name),'-f','rawvideo','-pix_fmt','rgba','-'],capture_output=True,check=True).stdout
      checks['alpha_endpoints'][name]={'min':min(raw[3::4]),'max':max(raw[3::4])}
    checks['silhouette_bounds']=[]
    for name in sorted(root.glob('silhouette-g*.png')):
      raw=rgb(name.name)
      pts=[i//3 for i in range(0,len(raw),3) if not(raw[i]>=245 and raw[i+1]<=10 and raw[i+2]>=245)]
      y0,y1=min(i//1080 for i in pts),max(i//1080 for i in pts)
      checks['silhouette_bounds'].append({'file':name.name,'height_px':y1-y0+1,'top':y0,'bottom':y1,'method':'opaque isolated owner silhouette, no shadow/glow/padding'})
    checks['representative_pixels']=[]
    for shot,f in [('B07-SH01',189),('B07-SH02',161),('B07-SH03',105),('B08-SH01',120),('B09-SH01',293)]:
      name=f'{shot}-f{f:03}.png';raw=rgb(name)
      checks['representative_pixels'].append({'file':name,'rgb_zero_pixels':sum(raw[i:i+3]==bytes(3) for i in range(0,len(raw),3))})
    (root/'pixel-checks.json').write_text(json.dumps(checks,indent=2)+'\n')
    print(json.dumps({'lead':lead,'pixels':checks},indent=2))
    sys.exit(0)

if '--g2' in sys.argv:
    root = Path('out/qa/hanako/g2')
    if '--sheets' in sys.argv:
        frames=json.loads((root/'frames.json').read_text())
        for shot in ['B04-SH01','B05-SH01','B05-SH02','B06-SH01','B06-SH02']:
            rows=sorted((r for r in frames if r['shot']==shot), key=lambda r:r['f'])
            subprocess.run(['sh','scripts/qa-sheet.sh',str(root/f'{shot}-sheet.png'),'--cols','4',*[r['output'] for r in rows]],check=True)
            (root/f'{shot}-manifest.tsv').write_text(''.join(f"{r['output']}\t{shot} / HANAKO-SHORT / SCENE-R3\tF{r['F']} ({r['F']/30:.2f}s) [f{r['f']}] / standalone plate\n" for r in rows))
        chosen=[('B04-SH01',254),('B05-SH01',115),('B05-SH02',111),('B06-SH01',176),('B06-SH02',238)]
        rows=[next(r for r in frames if r['shot']==shot and r['f']==f) for shot,f in chosen]
        (root/'G2-summary-manifest.tsv').write_text(''.join(f"{r['output']}\t{r['shot']} / SCENE-R3\tHANAKO-SHORT F{r['F']} [f{r['f']}]\n" for r in rows))
        subprocess.run(['sh','scripts/qa-sheet.sh',str(root/'G2-summary-raw.png'),'--cols','5',*[r['output'] for r in rows]],check=True)
        sys.exit(0)
    lead = [{'shot': shot, 'visible_height_px': None, 'pass_480': None,
             'reason': reason} for shot, reason in [
                 ('B04-SH01','N/A: storybook panels without a person'),
                 ('B05-SH01','N/A: POV hands, no body lead'),
                 ('B05-SH02','N/A: POV hand, no body lead'),
                 ('B06-SH01','N/A: map without a person'),
                 ('B06-SH02','N/A: book without a person')]]
    (root/'lead-height.json').write_text(json.dumps(lead,indent=2)+'\n')
    data=json.loads(Path('src/painted/hanako/japan.json').read_text())
    pts=[(r[i],r[i+1]) for r in data['rings'] for i in range(0,len(r),2)]
    fx,fy=data['iwatePin']
    projected=[(fx+(x-fx)*1.3,fy+(y-fy)*1.3) for x,y in pts]
    metrics={'folder_stop': {'F':1127,'scale':1.18,'page_top':590+(296-590)*1.18,
        'page_bottom':590+(766-590)*1.18,'folder_bottom':590+(790-590)*1.18,'tab_top':590+(226-590)*1.18},
        'map_end': {'F':1348,'bbox':[min(x for x,y in projected), min(y for x,y in projected),max(x for x,y in projected),max(y for x,y in projected)],
                    'top_100px_land_x':[min(x for x,y in projected if y<100),max(x for x,y in projected if y<100)],'pin_tip':data['iwatePin'],'chrome_note':'Default channel label at x60 y60, font30; no top chrome in the plate. Actual timeline chrome remains unverified.'}}
    (root/'projection.json').write_text(json.dumps(metrics,indent=2)+'\n')
    def rgb(name):
        return subprocess.run(['ffmpeg','-v','error','-i',str(root/name),'-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True).stdout
    def diff(a,b):
        x,y=rgb(a),rgb(b); ds=[abs(i-j) for i,j in zip(x,y)]
        return {'changed_channels':sum(d>0 for d in ds),'max_channel_delta':max(ds),'byte_identical_png':(root/a).read_bytes()==(root/b).read_bytes()}
    metrics['representative_pixels']=[]
    for name in ['B04-SH01-f254.png','B05-SH01-f115.png','B05-SH02-f111.png','B06-SH01-f176.png','B06-SH02-f238.png']:
        raw=rgb(name)
        metrics['representative_pixels'].append({'file':name,'rgb_zero_pixels':sum(raw[i:i+3]==bytes(3) for i in range(0,len(raw),3))})
    metrics['dead_stop_diff']=diff('B05-SH02-f111.png','B05-SH02-f155.png')
    metrics['repeatability']=diff('B05-SH02-f111.png','repeat-f111.png')
    (root/'pixel-checks.json').write_text(json.dumps(metrics,indent=2)+'\n')
    print(json.dumps(metrics,indent=2))
    sys.exit(0)

root = Path(os.environ.get('HANAKO_OUT', 'out/qa/hanako/g1'))
rows = []
for f in (0, 100, 201):
    path = root / f'lead-f{f}.png'
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    w, h = 1080, 1920
    points = [i // 3 for i in range(0, len(raw), 3)
              if not (raw[i] >= 245 and raw[i + 1] <= 10 and raw[i + 2] >= 245)]
    x0, x1 = min(i % w for i in points), max(i % w for i in points)
    y0, y1 = min(i // w for i in points), max(i // w for i in points)
    rows.append({'f': f, 'F': 443 + f, 'bbox': [x0, y0, x1, y1], 'visible_height_px': y1 - y0 + 1,
                 'pass_480': y1 - y0 + 1 >= 480, 'method': 'isolated owner artwork, no shadow/glow/padding; magenta threshold 245/10/245'})
(root / 'lead-height.json').write_text(json.dumps(rows, indent=2) + '\n')
print(json.dumps(rows, indent=2))
