// Three.js hands (prototype, KIT-POV-HANDS engine 'three', 18 Nov 2026): the macro hand's own 3D skeleton (macroSkeleton: the same joints and
// radii the 2D macro projects) built as real meshes, so the hand has mass: tapered phalanx tubes with round joints, a domed palm, forearm,
// sleeve and upper arm, shaded with the edu18 toon material (half-lambert steps + rim) and an inverted-hull ink outline. The camera is the
// kit `YCam` turned into a Three camera (same yaw, pitch, f, hy, cx), so the hands land on exactly the pixels the SVG/p5 layers use and the
// thumb side stays the skeleton's. The props are 3D too (hand-props3d.ts), so a hand and what it holds sort per pixel. Pure function of props.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry.js';
import {toonMaterial} from '../edu18/hippo3d';
import {type Frame3, type PropId} from './hand-props';
import {outlineMat, propMesh, srgb} from './hand-props3d';
import {macroSkeleton, type HandMacro} from './hands';
import {type V3} from './space';
import {type YCam} from './ycam';

const v3 = (a: V3) => new THREE.Vector3(a[0], a[1], a[2]);

/** The kit camera as a Three perspective camera rendering a `w` x `h` picture (YCam: yaw about y, then pitch; principal point at 540+cx, hy). */
export const threeCamOf = (c: YCam, w = 1080, h = 1920): THREE.PerspectiveCamera => {
  const cam = new THREE.PerspectiveCamera((2 * Math.atan(h / 2 / c.f) * 180) / Math.PI, w / h, c.near ?? 0.05, 60);
  cam.position.set(c.x, c.y, c.z);
  cam.rotation.order = 'YXZ';
  cam.rotation.set(c.pitch ?? 0, -c.yaw, 0);
  cam.setViewOffset(w, h, -(c.cx ?? 0) - (540 - w / 2), h / 2 - c.hy, w, h);
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  return cam;
};

/**
 * Skin in the toon material, tuned to sit next to the painted rig arm (user, 18 Nov 2026): the lit tone is the skin colour itself (no
 * brightening), the shadow tone is the painted `shade` (toneFromSkin), no rim, so hand and painted arm read as one colour.
 */
const skinMaterial = (skin: string, shade?: string) => {
  const m = toonMaterial({color: srgb(skin), rimK: 0}), a = srgb(skin), b = srgb(shade ?? skin);
  m.uniforms.uLit.value.set(1, 1, 1);
  m.uniforms.uShadow.value.set(b[0] / Math.max(a[0], 1e-3), b[1] / Math.max(a[1], 1e-3), b[2] / Math.max(a[2], 1e-3));
  return m;
};

/** A tapered tube a -> b (radii ra, rb) with round ends. */
const tube = (a: V3, b: V3, ra: number, rb: number): THREE.BufferGeometry[] => {
  const A = v3(a), B = v3(b), len = A.distanceTo(B);
  const parts: THREE.BufferGeometry[] = [];
  if (len > 1e-6) {
    const g = new THREE.CylinderGeometry(rb, ra, len, 24, 1, true);
    g.translate(0, len / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()));
    g.translate(A.x, A.y, A.z);
    parts.push(g);
  }
  for (const [P, r] of [[A, ra], [B, rb]] as const) { const s = new THREE.SphereGeometry(r, 20, 14); s.translate(P.x, P.y, P.z); parts.push(s); }
  return parts;
};

/** `handOnly`: the hand and a short wrist stub, for a painted arm that already runs to the wrist (close-shot figures). */
export type Hand3DArm = {hand: HandMacro; elbow: V3; shoulder?: V3; sleeve?: string; cuff?: number; handOnly?: boolean};
/** A depth-only box (no colour): stands in for a painted body so 3D hands behind it are hidden. */
/** `ellipsoid`: half sizes are its radii. A `capsule` runs a -> b with radius r. */
export type Occluder3D = {frame: Frame3; half: V3; shape?: 'box' | 'ellipsoid'} | {capsule: [V3, V3]; r: number};
export type Prop3D = {id: PropId; frame: Frame3};

/** Meshes of one arm: hand (fingers, thumb, palm), forearm, sleeve from the cuff, upper arm to the shoulder. */
const armGroup = (a: Hand3DArm, ink: number): THREE.Group => {
  const g = new THREE.Group(), sk = macroSkeleton(a.hand), S = sk.S, skin = skinMaterial(a.hand.tone?.skin ?? '#d9a57c', a.hand.tone?.shade);
  const add = (geos: THREE.BufferGeometry[], mat: THREE.Material) => geos.forEach((geo) => { g.add(new THREE.Mesh(geo, mat)); g.add(new THREE.Mesh(geo, outlineMat(ink))); });
  for (const f of Object.values(sk.fingers)) for (let k = 0; k < 3; k++) add(tube(f.joints[k], f.joints[k + 1], f.radii[k] * 1.04, f.radii[k + 1] * 1.04), skin);
  // Palm: a slab between the palm outline pushed to the back and to the palm side, domed over the knuckles.
  const n = sk.normal, pts: THREE.Vector3[] = [];
  for (const p of sk.palm) for (const s of [0.85, -1.05]) pts.push(v3(p).addScaledVector(v3(n), s * S));
  for (const id of ['index', 'middle', 'ring', 'little'] as const) { const j = sk.fingers[id].joints[0], r = sk.fingers[id].radii[0]; pts.push(v3(j).addScaledVector(v3(n), r), v3(j).addScaledVector(v3(n), -r)); }
  pts.push(v3(sk.palmCentre).addScaledVector(v3(n), 1.25 * S), v3(sk.palmCentre).addScaledVector(v3(n), -1.4 * S));
  add([new ConvexGeometry(pts)], skin);
  // Forearm (wrist -> elbow), sleeve over its elbow end, upper arm in the sleeve.
  if (a.handOnly) return g; // the palm slab covers the painted wrist; a 3D wrist ball would show over the painted arm
  add(tube(a.hand.wrist, a.elbow, 2.35 * S, 3.3 * S), skin);
  if (a.sleeve) {
    const cl = toonMaterial({color: srgb(a.sleeve)}), cu = a.cuff ?? 0.82, c: V3 = [a.hand.wrist[0] + (a.elbow[0] - a.hand.wrist[0]) * cu, a.hand.wrist[1] + (a.elbow[1] - a.hand.wrist[1]) * cu, a.hand.wrist[2] + (a.elbow[2] - a.hand.wrist[2]) * cu];
    add(tube(c, a.elbow, 3.6 * S, 4.0 * S), cl);
    if (a.shoulder) add(tube(a.elbow, a.shoulder, 4.0 * S, 5.4 * S), cl);
  }
  return g;
};

/** Hands and catalog props (hand-props3d.ts) through the kit camera, transparent background, to lay over the SVG/p5 room. `ink`: outline width in metres. */
export const Hands3D = ({cam, arms, props = [], occluders = [], debugOccluders = false, width = 1080, height = 1920, ink = 0.0016}: {cam: YCam; arms: Hand3DArm[]; props?: Prop3D[]; occluders?: Occluder3D[]; debugOccluders?: boolean; width?: number; height?: number; ink?: number}) => {
  const camera = useMemo(() => threeCamOf(cam, width, height), [cam, width, height]);
  const scene = useMemo(() => {
    const s = new THREE.Group();
    arms.forEach((a) => s.add(armGroup(a, ink)));
    props.forEach((q) => s.add(propMesh(q.id, q.frame, ink)));
    // Depth-only stand-ins for the painted figure (or, with `debugOccluders`, translucent red to check their fit against it).
    const occ = debugOccluders ? new THREE.MeshBasicMaterial({color: '#ff0000', transparent: true, opacity: 0.35}) : new THREE.MeshBasicMaterial({colorWrite: false});
    occluders.forEach((o) => {
      const geos = 'capsule' in o ? tube(o.capsule[0], o.capsule[1], o.r, o.r) : [o.shape === 'ellipsoid' ? new THREE.SphereGeometry(1, 24, 16).scale(...o.half) : new THREE.BoxGeometry(o.half[0] * 2, o.half[1] * 2, o.half[2] * 2)];
      geos.forEach((geo) => {
        const m = new THREE.Mesh(geo, occ);
        m.renderOrder = -1;
        if (!('capsule' in o)) m.applyMatrix4(new THREE.Matrix4().makeBasis(v3(o.frame.x), v3(o.frame.y), v3(o.frame.z)).setPosition(v3(o.frame.o)));
        s.add(m);
      });
    });
    return s;
  }, [arms, props, occluders, debugOccluders, ink]);
  return (
    <ThreeCanvas width={width} height={height} style={{position: 'absolute', left: 0, top: 0}} camera={camera} linear flat dpr={1} gl={{alpha: true, antialias: true, preserveDrawingBuffer: true}}>
      <primitive object={scene} />
    </ThreeCanvas>
  );
};
