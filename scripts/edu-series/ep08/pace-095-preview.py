"""EP08 pace 0.95 preview (coordinator, 2026-11-08): speech atempo 0.95 per line, gaps unchanged, L13 afade 0.9 s qsin. User picked this version. Run from repo root after narration-place.py."""
import re,subprocess,os,json
R=os.path.expanduser('~/ReelsStore');L=f'{R}/projects/EDU/narration/ep08/lines'
M=json.load(open('scripts/edu-series/ep08/measure.json'))
items=[]
for l in open('out/EDU-EP08-SHORT/audio/placements.txt'):
    m=re.match(r'(\w+) onset G(\d+) .*voiced end G(\d+) file-start ([\d.]+)s dur ([\d.]+)s',l)
    if m:k,on,end,fs,dur=m.group(1),int(m[2]),int(m[3]),float(m[4]),float(m[5]);items.append((k,on,end,fs,dur))
items.sort(key=lambda x:x[3])
f={k:f"{L}/{v['file']}" for k,v in M['lines'].items()}
f['V01']=f"{R}/{M['vocal']['V01']['file']}";f['V02']=f"{R}/{M['vocal']['V02']['file']}"
T=0.95;shift=0.0;cmd=['ffmpeg','-y','-v','error'];g=[];lab=[]
for i,(k,on,end,fs,dur) in enumerate(items):
    at=fs+shift
    cmd+=['-i',f[k]]
    fade=(f',afade=t=out:st={dur/T-0.9:.3f}:d=0.9:curve=qsin' if k=='L13' else '')
    g.append(f'[{i}:a]atempo={T}{fade},aresample=48000,adelay={int(at*1000)}:all=1[c{i}]');lab.append(f'[c{i}]')
    shift+=dur*(1/T-1)
g.append(''.join(lab)+f'amix=inputs={len(lab)}:normalize=0:duration=longest[o]')
subprocess.run(cmd+['-filter_complex',';'.join(g),'-map','[o]','-ac','1','out/edu08/pace/full-095-fade.wav'],check=True)
print(round(shift,2))
