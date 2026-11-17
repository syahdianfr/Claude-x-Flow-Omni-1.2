import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { StoryBeat } from '../data/storyBeats';

interface SubtitleOverlayProps {
  activeBeat: StoryBeat;
  enabled?: boolean;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  activeBeat,
  enabled = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!enabled) return null;

  const beatStartFrame = Math.round(activeBeat.startSec * fps);
  const beatEndFrame = Math.max(
    beatStartFrame + 1,
    Math.round(activeBeat.endSec * fps)
  );
  const localFrame = Math.max(0, frame - beatStartFrame);
  const beatDuration = beatEndFrame - beatStartFrame;

  const words = activeBeat.subtitle.text.split(' ');
  const highlightSet = new Set(
    activeBeat.subtitle.highlightWords.map((w) => w.toLowerCase())
  );

  const activeWordIndex = Math.floor(
    interpolate(localFrame, [0, beatDuration], [0, words.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const containerPop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 240, mass: 0.5 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '8%',
        right: '8%',
        bottom: '16%', // Safe-zone Y-axis (~80%), clear of mobile UI overlays
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px 14px',
        pointerEvents: 'none',
        transform: `scale(${0.92 + containerPop * 0.08})`,
      }}
    >
      {words.map((word, idx) => {
        const isHighlighted = highlightSet.has(word.toLowerCase());
        const isCurrentWord = idx === activeWordIndex;
        const scale = isCurrentWord ? 1.12 : 1.0;

        return (
          <span
            key={`${activeBeat.id}-w-${idx}`}
            style={{
              fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: '56px',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: isHighlighted ? '#FFD700' : '#FFFFFF',
              transform: `scale(${scale})`,
              display: 'inline-block',
              WebkitTextStroke: '3px #111111',
              textShadow: '0px 6px 0px #111111, 0px 10px 24px rgba(0,0,0,0.65)',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
