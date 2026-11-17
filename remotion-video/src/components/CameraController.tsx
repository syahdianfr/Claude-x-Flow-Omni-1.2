import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { StoryBeat } from '../data/storyBeats';

interface CameraControllerProps {
  activeBeat: StoryBeat;
  prevBeat: StoryBeat | null;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  activeBeat,
  prevBeat,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { camera } = useThree();

  const startFrame = Math.round(activeBeat.startSec * fps);
  const endFrame = Math.max(startFrame + 1, Math.round(activeBeat.endSec * fps));
  const localFrame = Math.max(0, frame - startFrame);
  const durationFrames = endFrame - startFrame;

  const { posVec, targetVec, currentZoom } = useMemo(() => {
    const progress = interpolate(localFrame, [0, durationFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });

    const targetPos = new THREE.Vector3(...activeBeat.camera.pos);
    const targetLook = new THREE.Vector3(...activeBeat.camera.target);

    if (activeBeat.camera.transition === 'whip' && prevBeat) {
      const whipFrames = 6;
      const whipT = interpolate(localFrame, [0, whipFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      const prevPos = new THREE.Vector3(...prevBeat.camera.pos);
      const prevLook = new THREE.Vector3(...prevBeat.camera.target);

      targetPos.lerpVectors(prevPos, targetPos, whipT);
      targetLook.lerpVectors(prevLook, targetLook, whipT);
    }

    const zoom = interpolate(progress, [0, 1], [1.0, activeBeat.camera.zoomEnd], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    // Subtle micro-push along view axis for continuous Z-axis depth
    const dir = targetLook.clone().sub(targetPos).normalize();
    const pushDistance = (zoom - 1.0) * 1.45;
    targetPos.addScaledVector(dir, pushDistance);

    return {
      posVec: targetPos,
      targetVec: targetLook,
      currentZoom: zoom,
    };
  }, [activeBeat, prevBeat, localFrame, durationFrames]);

  camera.position.copy(posVec);
  camera.lookAt(targetVec);

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.fov = 42 / Math.sqrt(currentZoom);
    camera.updateProjectionMatrix();
  }

  return null;
};
