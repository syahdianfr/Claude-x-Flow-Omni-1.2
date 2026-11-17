import React from 'react';
import { Composition } from 'remotion';
import { HistoricalExplainerComposition } from './Composition';
import { VIDEO_FPS, VIDEO_TOTAL_FRAMES } from './data/storyBeats';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ColonialCollapseExplainer"
      component={HistoricalExplainerComposition}
      durationInFrames={VIDEO_TOTAL_FRAMES} // 1710 frames = 57s @ 30 FPS
      fps={VIDEO_FPS}
      width={1080}
      height={1920}
      defaultProps={{
        showSubtitles: true, // Ubah ke false jika subtitle dipasang manual di CapCut/Premiere
      }}
    />
  );
};
