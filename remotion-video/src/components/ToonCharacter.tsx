import React, { useEffect, useMemo, useRef } from 'react';
import { Billboard, Outlines } from '@react-three/drei';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import {
  CharacterPose,
  EmotionSpriteType,
  FacialExpression,
  PropItemType,
  StoryBeat,
} from '../data/storyBeats';

export type MouthShape = 'closed' | 'open_mid' | 'open_wide';

interface ToonCharacterProps {
  activeBeat: StoryBeat;
  mouthShape: MouthShape;
}

/** 2-step DataTexture with NearestFilter for crisp cel-shaded shadow breaks */
function useToonGradientTexture(): THREE.DataTexture {
  const texture = useMemo(() => {
    const data = new Uint8Array([115, 115, 115, 255, 255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 2, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return texture;
}

/** Instant 0-frame 2D facial expression + audio-reactive mouth CanvasTexture */
function useFaceExpressionTexture(
  expression: FacialExpression,
  mouthShape: MouthShape
): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 256);

    ctx.strokeStyle = '#111111';
    ctx.fillStyle = '#111111';
    ctx.lineCap = 'round';
    ctx.lineWidth = 8;

    if (expression === 'smug') {
      ctx.beginPath();
      ctx.moveTo(68, 92);
      ctx.lineTo(106, 98);
      ctx.moveTo(150, 96);
      ctx.lineTo(188, 86);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(87, 114, 11, 0, Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(169, 114, 11, 0, Math.PI, false);
      ctx.fill();
    } else if (expression === 'shock') {
      ctx.beginPath();
      ctx.arc(87, 82, 20, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(169, 82, 20, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(87, 115, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(169, 115, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(87, 115, 6, 0, Math.PI * 2);
      ctx.arc(169, 115, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (expression === 'sweat') {
      ctx.beginPath();
      ctx.moveTo(68, 98);
      ctx.lineTo(106, 88);
      ctx.moveTo(150, 88);
      ctx.lineTo(188, 98);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(87, 115, 10, 0, Math.PI * 2);
      ctx.arc(169, 115, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(212, 92);
      ctx.quadraticCurveTo(226, 116, 212, 124);
      ctx.quadraticCurveTo(198, 116, 212, 92);
      ctx.fill();
    } else if (expression === 'angry') {
      ctx.beginPath();
      ctx.moveTo(68, 88);
      ctx.lineTo(108, 104);
      ctx.moveTo(188, 88);
      ctx.lineTo(148, 104);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(87, 116, 10, 0, Math.PI * 2);
      ctx.arc(169, 116, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(87, 112, 10, 0, Math.PI * 2);
      ctx.arc(169, 112, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Audio-Reactive Mouth Shape
    ctx.fillStyle = '#991B1B';
    ctx.strokeStyle = '#111111';
    if (mouthShape === 'closed') {
      ctx.beginPath();
      if (expression === 'smug') {
        ctx.arc(128, 155, 22, 0.15 * Math.PI, 0.85 * Math.PI);
      } else {
        ctx.moveTo(106, 165);
        ctx.lineTo(150, 165);
      }
      ctx.stroke();
    } else if (mouthShape === 'open_mid') {
      ctx.beginPath();
      ctx.ellipse(128, 168, 18, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(128, 170, 22, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [expression, mouthShape]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return texture;
}

/** 2D Emotion Billboard Sprite Texture */
function useEmotionBillboardTexture(
  spriteType: EmotionSpriteType
): THREE.CanvasTexture | null {
  const texture = useMemo(() => {
    if (spriteType === 'none') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 128, 128);

    if (spriteType === 'sweat_drop') {
      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(64, 16);
      ctx.quadraticCurveTo(98, 68, 64, 108);
      ctx.quadraticCurveTo(30, 68, 64, 16);
      ctx.fill();
      ctx.stroke();
    } else if (spriteType === 'exclamation') {
      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 6;
      ctx.fillRect(52, 16, 24, 64);
      ctx.strokeRect(52, 16, 24, 64);
      ctx.beginPath();
      ctx.arc(64, 102, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (spriteType === 'anger_vein') {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(35, 45);
      ctx.quadraticCurveTo(55, 55, 45, 35);
      ctx.moveTo(93, 45);
      ctx.quadraticCurveTo(73, 55, 83, 35);
      ctx.moveTo(35, 83);
      ctx.quadraticCurveTo(55, 73, 45, 93);
      ctx.moveTo(93, 83);
      ctx.quadraticCurveTo(73, 73, 83, 93);
      ctx.stroke();
    } else if (spriteType === 'lightbulb') {
      ctx.fillStyle = '#FDE047';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(64, 52, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(50, 82, 28, 18);
      ctx.strokeRect(50, 82, 28, 18);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [spriteType]);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  return texture;
}

/** Procedural Bendy Limb built from CatmullRomCurve3 + TubeGeometry */
const BendyLimb: React.FC<{
  start: [number, number, number];
  mid: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color: string;
  gradientMap: THREE.DataTexture;
}> = ({ start, mid, end, radius = 0.055, color, gradientMap }) => {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
    return new THREE.TubeGeometry(curve, 16, radius, 10, false);
  }, [start, mid, end, radius]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshToonMaterial color={color} gradientMap={gradientMap} />
      <Outlines thickness={0.035} color="#111111" />
    </mesh>
  );
};

/** Socket-Mounted or World-Space 3D Cel-Shaded Prop Mesh */
const PropMesh: React.FC<{
  item: PropItemType;
  gradientMap: THREE.DataTexture;
}> = ({ item, gradientMap }) => {
  if (item === 'none') return null;

  switch (item) {
    case 'polishing_rag':
      return (
        <mesh position={[0.04, -0.02, 0.06]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.16]} />
          <meshToonMaterial color="#F8FAFC" gradientMap={gradientMap} />
          <Outlines thickness={0.035} color="#111111" />
        </mesh>
      );
    case 'gold_sack':
      return (
        <group position={[0, -0.14, 0.06]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshToonMaterial color="#EAB308" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
        </group>
      );
    case 'coffee_cup':
      return (
        <group position={[0.02, 0.04, 0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.055, 0.12, 16]} />
            <meshToonMaterial color="#FFFFFF" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
        </group>
      );
    case 'surrender_pen':
      return (
        <mesh position={[0.02, -0.05, 0.1]} rotation={[0.8, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.006, 0.28, 10]} />
          <meshToonMaterial color="#FACC15" gradientMap={gradientMap} />
          <Outlines thickness={0.035} color="#111111" />
        </mesh>
      );
    case 'giant_padlock':
      return (
        <group position={[0.05, -0.1, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.36, 0.14]} />
            <meshToonMaterial color="#64748B" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <torusGeometry args={[0.11, 0.03, 10, 20, Math.PI]} />
            <meshToonMaterial color="#CBD5E1" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
        </group>
      );
    case 'freedom_torch':
      return (
        <group position={[0, 0.18, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.025, 0.42, 12]} />
            <meshToonMaterial color="#92400E" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.11, 0.26, 12]} />
            <meshToonMaterial color="#F97316" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
        </group>
      );
    case 'telegram_paper':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.01, 0.34]} />
          <meshToonMaterial color="#FEF9C3" gradientMap={gradientMap} />
          <Outlines thickness={0.035} color="#111111" />
        </mesh>
      );
    case 'rusty_bicycle':
      return (
        <group>
          <mesh position={[-0.36, 0, 0]} castShadow>
            <torusGeometry args={[0.26, 0.032, 10, 24]} />
            <meshToonMaterial color="#334155" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <mesh position={[0.36, 0, 0]} castShadow>
            <torusGeometry args={[0.26, 0.032, 10, 24]} />
            <meshToonMaterial color="#334155" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.72, 0.045, 0.045]} />
            <meshToonMaterial color="#7C2D12" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <mesh position={[0.32, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.34, 10]} />
            <meshToonMaterial color="#94A3B8" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
        </group>
      );
  }
};

export const ToonCharacter: React.FC<ToonCharacterProps> = ({
  activeBeat,
  mouthShape,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gradientMap = useToonGradientTexture();
  const rightHandSocketRef = useRef<THREE.Group>(null);
  const leftHandSocketRef = useRef<THREE.Group>(null);

  const beatStartFrame = Math.round(activeBeat.startSec * fps);
  const beatEndFrame = Math.max(
    beatStartFrame + 1,
    Math.round(activeBeat.endSec * fps)
  );
  const beatLocalFrame = Math.max(0, frame - beatStartFrame);

  // Instant 0-frame facial texture swap + audio-reactive mouth
  const faceTexture = useFaceExpressionTexture(
    activeBeat.character.expression,
    mouthShape
  );

  // Bouncing 2D Emotion Billboard Sprite using required spring config
  const emotionTexture = useEmotionBillboardTexture(
    activeBeat.character.emotionSprite
  );
  const spriteScale = spring({
    frame: beatLocalFrame,
    fps,
    config: { damping: 11, stiffness: 220, mass: 0.6 },
  });

  // Procedural Pose Targets (Shoulder -> Elbow -> HandTarget)
  const poseTargets = useMemo(() => {
    const wave = Math.sin(frame * 0.35) * 0.08;
    const pose: CharacterPose = activeBeat.character.pose;

    switch (pose) {
      case 'polish_cannon':
        return {
          rMid: [0.45, 1.05, 0.25] as [number, number, number],
          rHand: [0.62 + wave, 1.15 + wave * 0.5, 0.42] as [number, number, number],
          lMid: [-0.36, 0.92, 0.1] as [number, number, number],
          lHand: [-0.28, 0.72, 0.18] as [number, number, number],
          torsoColor: '#1E3A8A',
        };
      case 'sip_coffee':
        return {
          rMid: [0.42, 1.02, 0.24] as [number, number, number],
          rHand: [0.16, 1.32 + Math.sin(frame * 0.2) * 0.03, 0.34] as [
            number,
            number,
            number,
          ],
          lMid: [-0.35, 0.95, 0.05] as [number, number, number],
          lHand: [-0.26, 0.72, 0.12] as [number, number, number],
          torsoColor: '#1E3A8A',
        };
      case 'dismiss_wave':
        return {
          rMid: [0.48, 1.15, 0.2] as [number, number, number],
          rHand: [0.58 + wave * 1.4, 1.38, 0.32] as [number, number, number],
          lMid: [-0.35, 0.92, 0.05] as [number, number, number],
          lHand: [-0.26, 0.72, 0.1] as [number, number, number],
          torsoColor: '#1E3A8A',
        };
      case 'hands_up':
        return {
          rMid: [0.48, 1.35, 0.12] as [number, number, number],
          rHand: [0.44, 1.68 + wave * 0.6, 0.18] as [number, number, number],
          lMid: [-0.48, 1.35, 0.12] as [number, number, number],
          lHand: [-0.44, 1.68 - wave * 0.6, 0.18] as [number, number, number],
          torsoColor: '#1E3A8A',
        };
      case 'sign_paper':
        return {
          rMid: [0.38, 0.96, 0.25] as [number, number, number],
          rHand: [0.15 + wave * 0.7, 0.88, 0.42] as [number, number, number],
          lMid: [-0.35, 0.92, 0.2] as [number, number, number],
          lHand: [-0.15, 0.86, 0.38] as [number, number, number],
          torsoColor: '#1E3A8A',
        };
      case 'look_horizon':
        return {
          rMid: [0.36, 0.92, 0.06] as [number, number, number],
          rHand: [0.28, 0.68, 0.12] as [number, number, number],
          lMid: [-0.36, 0.92, 0.06] as [number, number, number],
          lHand: [-0.28, 0.68, 0.12] as [number, number, number],
          torsoColor: '#B45309',
        };
      case 'raise_torch':
        return {
          rMid: [0.44, 1.36, 0.14] as [number, number, number],
          rHand: [0.34, 1.72, 0.2] as [number, number, number],
          lMid: [-0.36, 0.95, 0.08] as [number, number, number],
          lHand: [-0.28, 0.72, 0.14] as [number, number, number],
          torsoColor: '#DC2626',
        };
      case 'arms_crossed':
      default:
        return {
          rMid: [0.38, 1.0, 0.22] as [number, number, number],
          rHand: [-0.14, 1.02, 0.28] as [number, number, number],
          lMid: [-0.38, 0.98, 0.22] as [number, number, number],
          lHand: [0.14, 0.98, 0.28] as [number, number, number],
          torsoColor: '#1E3A8A',
        };
    }
  }, [activeBeat.character.pose, frame]);

  // World-space prop interpolation when holder === 'world'
  const worldPropTransform = useMemo(() => {
    const startPos = activeBeat.propState.worldPos;
    const endPos = activeBeat.propState.worldPosEnd ?? startPos;
    const t = interpolate(frame, [beatStartFrame, beatEndFrame], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return {
      pos: [
        interpolate(t, [0, 1], [startPos[0], endPos[0]]),
        interpolate(t, [0, 1], [startPos[1], endPos[1]]),
        interpolate(t, [0, 1], [startPos[2], endPos[2]]),
      ] as [number, number, number],
      rot: activeBeat.propState.worldRot ?? ([0, 0, 0] as [number, number, number]),
    };
  }, [activeBeat.propState, frame, beatStartFrame, beatEndFrame]);

  // Head yaw toward lookAt target
  const headYaw = useMemo(() => {
    const [lx, , lz] = activeBeat.character.lookAt;
    return Math.max(
      -0.55,
      Math.min(0.55, Math.atan2(lx, Math.max(0.5, lz)) * 0.45)
    );
  }, [activeBeat.character.lookAt]);

  return (
    <group>
      <group position={[0, 0, 0]}>
        {/* Spherical White 3D Head */}
        <group position={[0, 1.48, 0]} rotation={[0, headYaw, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.31, 24, 24]} />
            <meshToonMaterial color="#FFFFFF" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>

          {/* Curved Front Face Decal Plane (polygonOffset prevents Z-fighting) */}
          <mesh position={[0, 0, 0.005]}>
            <cylinderGeometry
              args={[0.314, 0.314, 0.44, 20, 1, true, -0.68, 1.36]}
            />
            <meshBasicMaterial
              map={faceTexture}
              transparent
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </mesh>

          {/* Bouncing 2D Emotion Billboard Sprite */}
          {emotionTexture && (
            <Billboard position={[0.36, 0.28, 0.05]}>
              <mesh scale={[spriteScale * 0.34, spriteScale * 0.34, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial map={emotionTexture} transparent />
              </mesh>
            </Billboard>
          )}
        </group>

        {/* Solid Colored Capsule Torso */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <capsuleGeometry args={[0.23, 0.42, 12, 20]} />
          <meshToonMaterial
            color={poseTargets.torsoColor}
            gradientMap={gradientMap}
          />
          <Outlines thickness={0.035} color="#111111" />
        </mesh>

        {/* Procedural Bendy Arms (CatmullRomCurve3 + TubeGeometry) */}
        <BendyLimb
          start={[0.22, 1.08, 0]}
          mid={poseTargets.rMid}
          end={poseTargets.rHand}
          color="#FFFFFF"
          gradientMap={gradientMap}
        />
        <BendyLimb
          start={[-0.22, 1.08, 0]}
          mid={poseTargets.lMid}
          end={poseTargets.lHand}
          color="#FFFFFF"
          gradientMap={gradientMap}
        />

        {/* Procedural Bendy Legs */}
        <BendyLimb
          start={[0.11, 0.56, 0]}
          mid={[0.13, 0.3, 0.03]}
          end={[0.14, 0.04, 0.04]}
          radius={0.062}
          color="#1E293B"
          gradientMap={gradientMap}
        />
        <BendyLimb
          start={[-0.11, 0.56, 0]}
          mid={[-0.13, 0.3, 0.03]}
          end={[-0.14, 0.04, 0.04]}
          radius={0.062}
          color="#1E293B"
          gradientMap={gradientMap}
        />

        {/* Right Hand Socket (Locked Grip Offset) */}
        <group ref={rightHandSocketRef} position={poseTargets.rHand}>
          {activeBeat.propState.holder === 'right_hand' && (
            <PropMesh
              item={activeBeat.propState.item}
              gradientMap={gradientMap}
            />
          )}
        </group>

        {/* Left Hand Socket (Locked Grip Offset) */}
        <group ref={leftHandSocketRef} position={poseTargets.lHand}>
          {activeBeat.propState.holder === 'left_hand' && (
            <PropMesh
              item={activeBeat.propState.item}
              gradientMap={gradientMap}
            />
          )}
        </group>
      </group>

      {/* World-Space Animated Prop when holder === 'world' */}
      {activeBeat.propState.holder === 'world' &&
        activeBeat.propState.item !== 'none' && (
          <group
            position={worldPropTransform.pos}
            rotation={worldPropTransform.rot}
          >
            <PropMesh
              item={activeBeat.propState.item}
              gradientMap={gradientMap}
            />
          </group>
        )}
    </group>
  );
};
