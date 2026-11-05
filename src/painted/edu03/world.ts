// EDU-EP03-SHORT world-metre paint helpers. Re-exports EDU-EP02's `world.ts` (same painted 3D camera, same projection owner: kit `ycam.ts`)
// so the two episodes share one set of box / plane / sphere helpers; promote them to the kit on a second reuse (ENV-P01).
export {clip, wp, wFill, wWash, wInk, qx, qy, qz, boxFaces, paintBox, sphereAt, flatCircle, paintSorted, hull} from '../edu02/world';
export type {Box, BoxFace, Item} from '../edu02/world';
