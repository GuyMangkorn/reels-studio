import type {Arm, FigAnchors, FigPose} from './cast';
import type {Pt} from './painter';

// Two-bone arm fit on the drawn shoulder (filed from EDU-EP26 R5, Boss W5.2, 2026-11-18; user note on arm length, 18 Nov 2026).
// A shot authors an arm as a hand target `to` and an elbow `via` in picture px, often from world anchors that do not land on the shoulder the
// rig actually draws (a 3/4 or high-camera figure). `fitArms` keeps the hand and the authored bend side, starts the arm at the drawn
// shoulder and caps each bone at the rig bone `L` px. Get the drawn shoulders from a dry `paintFigureAt` run (no-op brush) and pass
// `BONE * (def.armScale ?? 1) * camUnit(chest)` as `L`. No Remotion import.

/** An arm already within 0.45–1.1 bones per segment is kept as authored; otherwise the authored elbow slides toward the shoulder-hand
 *  midpoint until both bones fit (keeps the solve's bend direction and its foreshortening). A target past two bones keeps the hand and
 *  straightens the arm (callers log it as REACH). */
export function fitArms(own: Partial<Pick<FigPose, 'rArm' | 'lArm'>>, an: FigAnchors, L: number): Partial<Pick<FigPose, 'rArm' | 'lArm'>> {
  const out = {...own};
  for (const k of ['rArm', 'lArm'] as const) {
    const A = own[k] as Arm | undefined, S = k === 'rArm' ? an.rShoulder : an.lShoulder;
    if (!A?.via) continue;
    const W = A.to, s1 = Math.hypot(A.via[0] - S[0], A.via[1] - S[1]), s2 = Math.hypot(W[0] - A.via[0], W[1] - A.via[1]);
    if (s1 <= 1.1 * L && s2 <= 1.1 * L && s1 >= 0.45 * L) continue;
    const M: Pt = [(S[0] + W[0]) / 2, (S[1] + W[1]) / 2];
    let via: Pt = M;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const E: Pt = [A.via[0] + (M[0] - A.via[0]) * t, A.via[1] + (M[1] - A.via[1]) * t];
      if (Math.hypot(E[0] - S[0], E[1] - S[1]) <= 1.05 * L && Math.hypot(W[0] - E[0], W[1] - E[1]) <= 1.05 * L) { via = E; break; }
    }
    out[k] = {...A, via};
  }
  return out;
}
