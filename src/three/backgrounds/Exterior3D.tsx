import {useMemo} from 'react';
import {Shape} from 'three';
import {exteriorScale} from '../../assets/backgrounds/OldHouseExterior';
import {Disc} from '../primitives/Disc';
import {Plane, ScreenPlane} from '../primitives/Plane';
import {ShapePlane} from '../primitives/ShapePlane';
import {pixelPointToWorld, pixelSizeToWorld, stageMetrics} from '../space';
import {ScreenCover} from './parts';
import type {ThreeBackgroundProps} from './registry';

export const Exterior3D = ({width, height, time, background}: ThreeBackgroundProps) => {
  const scale = exteriorScale(width, height);
  const dark = time !== 'day';
  const litWindows = background?.windowLights ?? dark;
  const centerX = width / 2;
  const bottom = height * 0.76;
  const bodyWidth = 740 * scale;
  const bodyHeight = 650 * scale;
  const bodyY = bottom - bodyHeight / 2;
  const towerX = centerX + 310 * scale;
  const pathZ = 2.4;
  const groundY = pixelPointToWorld(width / 2, height * 0.84, width, height, pathZ)[1];
  const houseOutline = '#4a3b3b';
  const wallColor = dark ? '#c8b8c9' : '#f0d7c6';
  const [sunDiameter] = pixelSizeToWorld(160, 160, width, height, -9.2);
  const sun = pixelPointToWorld(width * 0.84, height * 0.18, width, height, -9.2);
  const [pathWidth] = pixelSizeToWorld(320 * scale, 320 * scale, width, height, pathZ);
  const roofUnits = stageMetrics(width, height, -4.5).unitsPerPixel;
  const roofOutline = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-420 * scale, 0);
    shape.lineTo(-240 * scale, 180 * scale);
    shape.lineTo(-55 * scale, 0);
    shape.lineTo(150 * scale, 180 * scale);
    shape.lineTo(420 * scale, 0);
    shape.closePath();
    return shape;
  }, [scale]);
  const roofInner = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-402 * scale, 0);
    shape.lineTo(-235 * scale, 162 * scale);
    shape.lineTo(-55 * scale, 0);
    shape.lineTo(150 * scale, 162 * scale);
    shape.lineTo(402 * scale, 0);
    shape.closePath();
    return shape;
  }, [scale]);
  const towerRoofOutline = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-150 * scale, 0);
    shape.lineTo(0, 168 * scale);
    shape.lineTo(150 * scale, 0);
    shape.closePath();
    return shape;
  }, [scale]);
  const towerRoofInner = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-132 * scale, 0);
    shape.lineTo(0, 148 * scale);
    shape.lineTo(132 * scale, 0);
    shape.closePath();
    return shape;
  }, [scale]);

  return (
    <>
      <ScreenCover
        width={width}
        height={height}
        z={-14}
        color={time === 'day' ? '#fff1c9' : time === 'dusk' ? '#b5a1c5' : '#777b9e'}
      />
      <ScreenPlane
        x={centerX}
        y={height * 0.84}
        pixelWidth={width * 1.6}
        pixelHeight={height * 0.4}
        compositionWidth={width}
        compositionHeight={height}
        z={-9}
        color={dark ? '#9fa2b8' : '#b8f2c9'}
      />
      <Disc radius={sunDiameter / 2} color={dark ? '#e9e5d5' : '#ffd166'} position={sun} />

      <Plane
        width={pathWidth}
        height={14}
        position={[0, groundY, pathZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={dark ? '#c1b2b7' : '#dec8ad'}
        lit
      />

      <ScreenPlane
        x={centerX}
        y={bodyY}
        pixelWidth={bodyWidth + 26}
        pixelHeight={bodyHeight + 22}
        compositionWidth={width}
        compositionHeight={height}
        z={-4.8}
        color={houseOutline}
      />
      <ScreenPlane
        x={centerX}
        y={bodyY}
        pixelWidth={bodyWidth}
        pixelHeight={bodyHeight}
        compositionWidth={width}
        compositionHeight={height}
        z={-4.75}
        color={wallColor}
        lit
      />
      <group
        position={pixelPointToWorld(centerX, bottom - 650 * scale, width, height, -4.5)}
        scale={roofUnits}
      >
        <ShapePlane shape={roofOutline} color={houseOutline} />
        <ShapePlane shape={roofInner} color="#85788d" position={[0, 0, 0.04 / roofUnits]} />
      </group>

      <ScreenPlane
        x={towerX}
        y={bottom - 530 * scale}
        pixelWidth={235 * scale}
        pixelHeight={970 * scale}
        compositionWidth={width}
        compositionHeight={height}
        z={-4.5}
        color={houseOutline}
      />
      <ScreenPlane
        x={towerX}
        y={bottom - 530 * scale}
        pixelWidth={210 * scale}
        pixelHeight={945 * scale}
        compositionWidth={width}
        compositionHeight={height}
        z={-4.45}
        color={dark ? '#c7b8cb' : '#e6c9cf'}
        lit
      />
      <group
        position={pixelPointToWorld(towerX, bottom - 1000 * scale, width, height, -4.3)}
        scale={roofUnits}
      >
        <ShapePlane shape={towerRoofOutline} color={houseOutline} />
        <ShapePlane shape={towerRoofInner} color="#85788d" position={[0, 0, 0.04 / roofUnits]} />
      </group>

      {[0, 1, 2].map((floor) =>
        [-260, -80, 100, 280].map((offset) => {
          const x = centerX + offset * scale;
          const y = bottom + (-570 + floor * 200) * scale;
          return (
            <group key={`${floor}-${offset}`}>
              <ScreenPlane
                x={x}
                y={y}
                pixelWidth={91 * scale}
                pixelHeight={133 * scale}
                compositionWidth={width}
                compositionHeight={height}
                z={-4.35}
                color="#fff0d8"
              />
              <ScreenPlane
                x={x}
                y={y}
                pixelWidth={73 * scale}
                pixelHeight={112 * scale}
                compositionWidth={width}
                compositionHeight={height}
                z={-4.32}
                color={litWindows ? '#ffd166' : dark ? '#747d9e' : '#b9dfe0'}
                lit={litWindows}
              />
              <ScreenPlane
                x={x}
                y={y}
                pixelWidth={9 * scale}
                pixelHeight={112 * scale}
                compositionWidth={width}
                compositionHeight={height}
                z={-4.3}
                color="#fff0d8"
              />
            </group>
          );
        }),
      )}
      {[-815, -585, -355].map((offsetY) => (
        <ScreenPlane
          key={offsetY}
          x={towerX}
          y={bottom + offsetY * scale}
          pixelWidth={110 * scale}
          pixelHeight={137 * scale}
          compositionWidth={width}
          compositionHeight={height}
          z={-4.2}
          color={litWindows ? '#ffd166' : '#77819f'}
          lit={litWindows}
        />
      ))}
      <ScreenPlane
        x={centerX - 65 * scale}
        y={bottom - 14 * scale}
        pixelWidth={615 * scale}
        pixelHeight={100 * scale}
        compositionWidth={width}
        compositionHeight={height}
        z={-3.9}
        color="#9a869d"
      />
      {[centerX - 355 * scale, centerX - 110 * scale, centerX + 140 * scale].map((x) => (
        <ScreenPlane
          key={x}
          x={x}
          y={bottom + 10 * scale}
          pixelWidth={18 * scale}
          pixelHeight={100 * scale}
          compositionWidth={width}
          compositionHeight={height}
          z={-3.85}
          color="#fff0d8"
        />
      ))}
    </>
  );
};
