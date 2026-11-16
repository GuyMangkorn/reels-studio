import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import type {YCam} from '../kit/ycam';
import {HIPPO3D_LOOK, useHippo3D} from './hippo3d';
import {HIPPO3D_WATER, type Hippo3DPose, type V3} from './hippo3d-sdf';

// EDU-EP18 hippo in a set (Film W3 look frames, 16 Nov 2026): the approved three.js hippo (hippo3d.tsx v8, unchanged) placed in world metres
// of a painted set and seen through the SAME pinhole as the painted plate (kit ycam.ts: x = 540 + cx + f r / d, y = hy - f u / d, yaw and
// pitch as camSpace). So the WebGL layer stays locked to the painted water, canoe and girl under any camera move (painted 3D camera).
// Placement: `at` is the point on the water surface under the hippo's body origin; `heading` in sheet degrees (0 = toward -z, 90 = +x,
// 180 = +z, the brief's convention); the hippo's own water plane (HIPPO3D_WATER) is moved onto the set's water y (`at[1]`), and its skin is
// cut there. Episode code; proposed to Boss for the B01/B02 shots.
// W5 (Boss, 16 Nov 2026, sheet item B1; W3 finding 4): `light` fixes the toon key light in WORLD space (a direction toward the light), so it
// stays put in the set while the camera turns (hippo3d's own light is fixed in view space: upper left of the screen in every shot). The river
// key `RIVER_HIPPO_KEY` is the approved LF01 light carried into world space through cLF01, so LF01 renders unchanged and every other river
// camera sees the same light from its own side. Without `light` the hippo keeps the view-space light (look stills, comp cards).

const DEG = Math.PI / 180;

/** three.js camera with the kit yaw-camera pinhole (principal point at (540 + cx, hy) of a 1080 x 1920 picture). */
export const yCamToThree = (c: YCam, w = 1080, h = 1920, near = 0.1, far = 2000) => {
  const cam = new THREE.PerspectiveCamera(30, w / h, near, far);
  // World -> camera (kit camSpace): r = dx cos + dz sin, u = dy, d = dx sin - dz cos, then pitch. three camera space: x = r, y = u', z = -d'.
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw), ps = Math.sin(c.pitch ?? 0), pc = Math.cos(c.pitch ?? 0);
  const R = [[co, 0, s], [-s * ps, pc, co * ps], [-(s * pc), -ps, co * pc]];
  // rows: r; u' = u pc - d ps = -s ps dx + pc dy + co ps dz; -d' = -(d pc + u ps) = -s pc dx - ps dy + co pc dz
  const V = new THREE.Matrix4().set(
    R[0][0], R[0][1], R[0][2], -(R[0][0] * c.x + R[0][1] * c.y + R[0][2] * c.z),
    R[1][0], R[1][1], R[1][2], -(R[1][0] * c.x + R[1][1] * c.y + R[1][2] * c.z),
    R[2][0], R[2][1], R[2][2], -(R[2][0] * c.x + R[2][1] * c.y + R[2][2] * c.z),
    0, 0, 0, 1);
  cam.matrixAutoUpdate = false;
  cam.matrixWorld.copy(V).invert();
  cam.matrixWorldInverse.copy(V);
  const px = 540 + (c.cx ?? 0), py = c.hy;
  cam.projectionMatrix.set(
    (2 * c.f) / w, 0, 1 - (2 * px) / w, 0,
    0, (2 * c.f) / h, (2 * py) / h - 1, 0,
    0, 0, -(far + near) / (far - near), (-2 * far * near) / (far - near),
    0, 0, -1, 0);
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
  (cam as unknown as {manual: boolean}).manual = true;
  return cam;
};

/** World direction (toward the light) whose view-space form under camera `c` is the hippo3d default light `HIPPO3D_LOOK.light`. */
export const worldLightFromView = (c: YCam, view: V3 = HIPPO3D_LOOK.light): V3 => {
  const v = new THREE.Vector3(...view).normalize().transformDirection(yCamToThree(c).matrixWorld);
  return [v.x, v.y, v.z];
};
/** View-space light under camera `c` for a world direction `w` (what the toon shader's uLight takes). */
export const viewLight = (c: YCam, w: V3): V3 => {
  const v = new THREE.Vector3(...w).normalize().transformDirection(yCamToThree(c).matrixWorldInverse);
  return [v.x, v.y, v.z];
};

export type HippoInSetProps = {cam: YCam; pose: Hippo3DPose; at: V3; heading: number; res?: number; width?: number; height?: number;
  /** World direction toward the key light (the set's light). Absent: hippo3d's view-space light. */
  light?: V3};
/** The hippo as a transparent WebGL screen layer over the painted back pass (paint the water and anything behind it there). */
export const HippoInSet = ({cam, pose, at, heading, res = 150, width = 1080, height = 1920, light}: HippoInSetProps) => {
  const H = useHippo3D({pose, res, water: at[1]});
  const camera = useMemo(() => yCamToThree(cam, width, height), [cam, width, height]);
  // set every toon material's light (the per-pose materials are new on each build, so this runs with them; a pure function of the props)
  useMemo(() => {
    if (!light) return;
    const vl = viewLight(cam, light);
    H.group.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.ShaderMaterial | undefined;
      if (m && (m as THREE.ShaderMaterial).isShaderMaterial && m.uniforms?.uLight) m.uniforms.uLight.value.set(...vl);
    });
  }, [H, cam, light]);
  const scene = useMemo(() => {
    // The hippo's body runs along its local +x; turn +x onto the sheet heading (dir (sin h, 0, -cos h)): rotation about y by 90 - h.
    const g = new THREE.Group();
    g.position.set(at[0], at[1] - HIPPO3D_WATER, at[2]);
    g.rotation.set(0, (90 - heading) * DEG, 0);
    // the skin is cut at the material's water uniform in WORLD y, so the group keeps the hippo's own water at the set's water height
    g.add(H.group);
    return g;
  }, [H, at, heading]);
  return (
    <ThreeCanvas width={width} height={height} style={{position: 'absolute', left: 0, top: 0}} camera={camera} linear flat dpr={1} gl={{alpha: true, antialias: true, preserveDrawingBuffer: true, stencil: true}}>
      <primitive object={scene} />
    </ThreeCanvas>
  );
};
