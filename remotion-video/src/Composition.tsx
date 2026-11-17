import React, { useEffect, useMemo } from 'react';
import { Outlines } from '@react-three/drei';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { ThreeCanvas } from '@remotion/three';
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import * as THREE from 'three';
import { CameraController } from './components/CameraController';
import { SubtitleOverlay } from './components/SubtitleOverlay';
import { MouthShape, ToonCharacter } from './components/ToonCharacter';
import { LightingMood, STORY_BEATS, StoryBeat } from './data/storyBeats';

interface MoodLightingConfig {
  bg: string;
  fog: string;
  keyColor: string;
  keyIntensity: number;
  ambientIntensity: number;
  groundColor: string;
}

const MOOD_PALETTES: Record<LightingMood, MoodLightingConfig> = {
  colonial_day: {
    bg: '#38BDF8',
    fog: '#7DD3FC',
    keyColor: '#FFFBEB',
    keyIntensity: 2.1,
    ambientIntensity: 0.75,
    groundColor: '#D97706',
  },
  smug_gold: {
    bg: '#F59E0B',
    fog: '#FCD34D',
    keyColor: '#FEF3C7',
    keyIntensity: 2.3,
    ambientIntensity: 0.8,
    groundColor: '#92400E',
  },
  empathy_sunset: {
    bg: '#EA580C',
    fog: '#FB923C',
    keyColor: '#FED7AA',
    keyIntensity: 1.85,
    ambientIntensity: 0.65,
    groundColor: '#7C2D12',
  },
  midnight_invasion: {
    bg: '#0F172A',
    fog: '#1E293B',
    keyColor: '#60A5FA',
    keyIntensity: 1.5,
    ambientIntensity: 0.45,
    groundColor: '#1E293B',
  },
  crimson_crisis: {
    bg: '#7F1D1D',
    fog: '#991B1B',
    keyColor: '#FCA5A5',
    keyIntensity: 2.4,
    ambientIntensity: 0.55,
    groundColor: '#450A0A',
  },
  analogy_studio: {
    bg: '#E2E8F0',
    fog: '#F1F5F9',
    keyColor: '#FFFFFF',
    keyIntensity: 2.0,
    ambientIntensity: 0.85,
    groundColor: '#CBD5E1',
  },
  freedom_dawn: {
    bg: '#F97316',
    fog: '#FDBA74',
    keyColor: '#FEF08A',
    keyIntensity: 2.4,
    ambientIntensity: 0.8,
    groundColor: '#9A3412',
  },
};

/** Cel-shaded 3D Historical Set Stage (Cannon, Archipelago Map, Analogy Door/Window) */
const HistoricalStage: React.FC<{
  activeBeat: StoryBeat;
  groundColor: string;
}> = ({ activeBeat, groundColor }) => {
  const gradientMap = useMemo(() => {
    const data = new Uint8Array([115, 115, 115, 255, 255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 2, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    return () => gradientMap.dispose();
  }, [gradientMap]);

  const showCannon =
    activeBeat.id.startsWith('beat-01') ||
    activeBeat.id.startsWith('beat-02') ||
    activeBeat.id.startsWith('beat-03');

  const showArchipelago =
    activeBeat.id === 'beat-05-empire-diorama' ||
    activeBeat.id === 'beat-12-march-1-landing' ||
    activeBeat.id === 'beat-17-kalijati-split';

  const showAnalogyDoor =
    activeBeat.id === 'beat-20-analogy-padlock' ||
    activeBeat.id === 'beat-21-analogy-back-window';

  return (
    <group>
      {/* Stylized Ground Pedestal */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 6.5, 0.5, 32]} />
        <meshToonMaterial color={groundColor} gradientMap={gradientMap} />
        <Outlines thickness={0.035} color="#111111" />
      </mesh>

      {/* Coastal Brass Cannon (Hook Beats 1–3) */}
      {showCannon && (
        <group position={[1.15, 0.55, 0.35]} rotation={[0, 0.55, 0.18]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.35, 16]} />
            <meshToonMaterial color="#B45309" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.55, 0.38, 0.55]} />
            <meshToonMaterial color="#78350F" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
        </group>
      )}

      {/* Stylized 3D Archipelago Islands (Diorama & Tactical Map Beats) */}
      {showArchipelago && (
        <group position={[0, 0.08, 0.8]}>
          {[
            [-1.3, 0, -0.3, 0.75, 0.45],
            [-0.2, 0, 0.35, 1.15, 0.32],
            [0.45, 0, -0.35, 0.8, 0.65],
            [1.45, 0, 0.1, 0.9, 0.5],
          ].map(([x, y, z, w, d], i) => (
            <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
              <boxGeometry args={[w, 0.16, d]} />
              <meshToonMaterial color="#15803D" gradientMap={gradientMap} />
              <Outlines thickness={0.035} color="#111111" />
            </mesh>
          ))}
        </group>
      )}

      {/* Everyday Object Analogy Set: Locked Front Door + Open Back Window (Beats 20–21) */}
      {showAnalogyDoor && (
        <group position={[0, 1.15, -0.55]}>
          <mesh position={[0.55, 0, 0]} castShadow>
            <boxGeometry args={[1.1, 2.3, 0.16]} />
            <meshToonMaterial color="#78350F" gradientMap={gradientMap} />
            <Outlines thickness={0.035} color="#111111" />
          </mesh>
          <group position={[-0.75, 0.1, 0]}>
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[1.05, 0.12, 0.16]} />
              <meshToonMaterial color="#F8FAFC" gradientMap={gradientMap} />
              <Outlines thickness={0.035} color="#111111" />
            </mesh>
            <mesh position={[0, -0.7, 0]}>
              <boxGeometry args={[1.05, 0.12, 0.16]} />
              <meshToonMaterial color="#F8FAFC" gradientMap={gradientMap} />
              <Outlines thickness={0.035} color="#111111" />
            </mesh>
            <mesh position={[-0.48, 0, 0]}>
              <boxGeometry args={[0.12, 1.5, 0.16]} />
              <meshToonMaterial color="#F8FAFC" gradientMap={gradientMap} />
              <Outlines thickness={0.035} color="#111111" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

export interface ExplainerProps {
  showSubtitles?: boolean;
}

export const HistoricalExplainerComposition: React.FC<ExplainerProps> = ({
  showSubtitles = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentSec = frame / fps;

  // Resolve active and previous StoryBeat deterministically from current frame
  const { activeBeat, prevBeat } = useMemo(() => {
    const idx = STORY_BEATS.findIndex(
      (b) => currentSec >= b.startSec && currentSec < b.endSec
    );
    const safeIdx = idx === -1 ? STORY_BEATS.length - 1 : idx;
    return {
      activeBeat: STORY_BEATS[safeIdx],
      prevBeat: safeIdx > 0 ? STORY_BEATS[safeIdx - 1] : null,
    };
  }, [currentSec]);

  // Audio-Reactive Lip-Sync via @remotion/media-utils
  const voSrc = staticFile('audio/vo_master.mp3');
  const audioData = useAudioData(voSrc);

  const mouthShape: MouthShape = useMemo(() => {
    if (!audioData) return 'closed';
    const spectrum = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 16,
    });
    const vocalEnergy =
      spectrum.slice(1, 7).reduce((acc, v) => acc + v, 0) / 6;

    if (vocalEnergy > 0.28) return 'open_wide';
    if (vocalEnergy > 0.11) return 'open_mid';
    return 'closed';
  }, [audioData, fps, frame]);

  const palette = MOOD_PALETTES[activeBeat.lightingMood];

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      {/* Master Voiceover Track */}
      <Audio src={voSrc} />

      {/* 3D Cel-Shaded Stage */}
      <ThreeCanvas width={width} height={height} shadows>
        <color attach="background" args={[palette.bg]} />
        <fog attach="fog" args={[palette.fog, 5, 16]} />

        <ambientLight intensity={palette.ambientIntensity} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={palette.keyIntensity}
          color={palette.keyColor}
          castShadow
        />

        <CameraController activeBeat={activeBeat} prevBeat={prevBeat} />
        <HistoricalStage
          activeBeat={activeBeat}
          groundColor={palette.groundColor}
        />
        <ToonCharacter activeBeat={activeBeat} mouthShape={mouthShape} />
      </ThreeCanvas>

      {/* Safe-Zone Dynamic Subtitles (toggleable via showSubtitles prop) */}
      <SubtitleOverlay activeBeat={activeBeat} enabled={showSubtitles} />
    </AbsoluteFill>
  );
};
