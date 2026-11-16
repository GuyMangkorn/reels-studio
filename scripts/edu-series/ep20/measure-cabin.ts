// Usage: node --import tsx scripts/edu-series/ep20/measure-cabin.ts > out/edu20-cabin-thumbnails-r1/geometry.json
// Records actual figure fill vertices, excluding shadows, through the same kit rig and camera.
import {BALLOON, LOOKS, PASSENGER} from '../../../src/painted/edu20/cabin-look-data';
import {paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon, passengerSupport} from '../../../src/painted/kit/car-cabin';
import {makePainter, type Pt} from '../../../src/painted/kit/painter';
import {camPoint} from '../../../src/painted/kit/ycam';
import type {Brush} from '../../../src/painted/BrushCanvas';

const result: Record<string, unknown> = {};
for (const [key, {camera}] of Object.entries(LOOKS)) {
  const points: Pt[] = [];
  const brush = new Proxy({}, {get: (_, name) => name === 'polygon' ? (pts: Pt[]) => points.push(...pts) : () => undefined}) as Brush;
  const p = makePainter(brush, {frame: 0, t: 0});
  const a = paintCabinPassenger(p, camera, PASSENGER, 1)!;
  const bounds = {left: Math.min(...points.map((v) => v[0])), right: Math.max(...points.map((v) => v[0])), top: Math.min(...points.map((v) => v[1])), bottom: Math.max(...points.map((v) => v[1]))};
  const belt = paintPassengerBelt(p, camera, PASSENGER);
  const balloon = paintTetheredBalloon(p, camera, BALLOON);
  const e = balloon.envelope.map((v) => camPoint(camera, v)!);
  result[key] = {camera, canonicalStandingHeightM: PASSENGER.person.height, pose: 'man-crop + hoodie, P31, neutral / right', passengerFillBounds: bounds, passengerHeightPx: bounds.bottom - bounds.top, faceHead: a.head, figureGround: a.feet,
    supportWorld: passengerSupport(PASSENGER), beltWorld: belt, beltPicture: Object.fromEntries(Object.entries(belt).map(([k, v]) => [k, camPoint(camera, v)])),
    balloonHeightPx: Math.max(...e.map((v) => v[1])) - Math.min(...e.map((v) => v[1])), balloonCentre: camPoint(camera, BALLOON.centre), neck: camPoint(camera, balloon.neck), anchor: camPoint(camera, balloon.anchor),
    captionBand: [860, 1248], subjectAboveCaptionBand: bounds.bottom < 860, balloonAboveCaptionBand: Math.max(...e.map((v) => v[1])) < 860};
}
console.log(JSON.stringify(result, (_, value) => typeof value === 'number' ? Math.round(value * 1000) / 1000 : value, 2));
