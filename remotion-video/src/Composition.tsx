import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from "remotion";

export const MyComposition = () => {
  return (
    <Composition
      id="ThreeScene"
      component={ThreeScene}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

export const ThreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rotation = frame * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020" }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <mesh rotation={[rotation * 0.6, rotation, 0]}>
          <torusKnotGeometry args={[1.2, 0.4, 160, 32]} />
          <meshStandardMaterial color="#4a9eff" metalness={0.3} roughness={0.35} />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
