import subprocess, re, numpy as np, sys
SR=48000
src='out/eg-voice/full-v3.wav'
raw=subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout
x=np.frombuffer(raw,dtype=np.float32).copy()
err=subprocess.run(['ffmpeg','-i',src,'-af','silencedetect=n=-36dB:d=0.08','-f','null','-'],capture_output=True,text=True).stderr
st=[float(m) for m in re.findall(r'silence_start: ([\d.]+)',err)]
en=[float(m) for m in re.findall(r'silence_end: ([\d.]+)',err)]
gaps=list(zip(st,en))
dur=len(x)/SR
t=np.arange(len(x))/SR; u=np.clip((t-78.9)/0.7,0,1); x*=10**((3*(u*u*(3-2*u)))/20)  # smooth 0->+3 dB ramp over "คนที่หายไป คือคุณ"
# keep only cut gaps: >=0.12 s, plus manual one
cut=[(s,e) for s,e in gaps if e-s>=0.12 and s>0.3 and e<dur-0.05]
cut=sorted(set(c for c in cut if c[0]<79.2))
def target(s,e):
    g=e-s
    if 56.3<=s<=57.5: return 0.45            # L15 -> L17 after cutting L16
    if 77.8<=s<=77.95: return 0.9             # after L20a
    if abs(s-79.267)<0.01: return 0.28        # before the blame
    if 79.7<=s<=79.75: return 0.06            # inside "คือ-คุณ": make it continuous
    return 0.12+0.55*(g-0.12)
PAD=0.05
out=[];log=[]
pos=0.0
runs=[]
prev_end=0.0
for s,e in cut:
    runs.append((prev_end,s,s,e)); prev_end=e
runs.append((prev_end,dur,None,None))
for i,(a,b,gs,ge) in enumerate(runs):
    if 57.0<=a<=61.5 and b<=60.9 and a>56.5: continue   # drop L16 run
    a0=max(0,a-PAD if i>0 else a); b0=min(dur,b+PAD)
    seg=x[int(a0*SR):int(b0*SR)].copy()
    f=int(0.01*SR); seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f)
    pass
    out.append(seg)
    if gs is not None:
        if 56.3<=gs<=57.5: g=0.45
        elif 60.4<=gs<=60.6: continue
        else: g=target(gs,ge)
        g=max(0.0,g-2*PAD)
        out.append(np.zeros(int(g*SR),dtype=np.float32)); log.append((round(gs,2),round(target(gs,ge),2)))
y=np.concatenate(out+[np.zeros(int(1.2*SR),dtype=np.float32)])*10**(-3/20)
open('/private/tmp/claude-501/-Users-mangkornkatawong-Developer-reels-creator--claude-worktrees-check-project-pipeline-4ec3f9/77ef20e1-b6a2-4ffe-8593-9bdc0fef2d10/scratchpad/y.f32','wb').write(y.astype(np.float32).tobytes())
print(len(log),'gaps; first/last:',log[:3],log[-6:])
