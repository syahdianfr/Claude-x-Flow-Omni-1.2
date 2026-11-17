export type CameraTransition = 'cut' | 'whip';

export type CharacterPose =
  | 'polish_cannon'
  | 'arms_crossed'
  | 'sip_coffee'
  | 'dismiss_wave'
  | 'look_horizon'
  | 'hands_up'
  | 'sign_paper'
  | 'raise_torch';

export type FacialExpression = 'neutral' | 'sweat' | 'smug' | 'shock' | 'angry';

export type EmotionSpriteType =
  | 'none'
  | 'sweat_drop'
  | 'anger_vein'
  | 'exclamation'
  | 'lightbulb';

export type PropHolder = 'world' | 'right_hand' | 'left_hand';

export type PropItemType =
  | 'none'
  | 'polishing_rag'
  | 'rusty_bicycle'
  | 'gold_sack'
  | 'coffee_cup'
  | 'telegram_paper'
  | 'surrender_pen'
  | 'giant_padlock'
  | 'freedom_torch';

export type LightingMood =
  | 'colonial_day'
  | 'smug_gold'
  | 'empathy_sunset'
  | 'midnight_invasion'
  | 'crimson_crisis'
  | 'analogy_studio'
  | 'freedom_dawn';

export interface StoryBeat {
  id: string;
  startSec: number;
  endSec: number;
  camera: {
    pos: [number, number, number];
    target: [number, number, number];
    zoomEnd: number;
    transition: CameraTransition;
  };
  character: {
    pose: CharacterPose;
    expression: FacialExpression;
    lookAt: [number, number, number];
    emotionSprite: EmotionSpriteType;
  };
  propState: {
    item: PropItemType;
    holder: PropHolder;
    worldPos: [number, number, number];
    worldPosEnd?: [number, number, number];
    worldRot?: [number, number, number];
  };
  lightingMood: LightingMood;
  subtitle: {
    text: string;
    highlightWords: string[];
  };
}

export const VIDEO_FPS = 30;
export const VIDEO_DURATION_SEC = 57;
export const VIDEO_TOTAL_FRAMES = VIDEO_FPS * VIDEO_DURATION_SEC; // 1710 frames

export const STORY_BEATS: StoryBeat[] = [
  {
    id: 'beat-01-hook-polish',
    startSec: 0.0,
    endSec: 1.3,
    camera: {
      pos: [0.4, 1.55, 2.8],
      target: [0.0, 1.35, 0.0],
      zoomEnd: 1.15,
      transition: 'cut',
    },
    character: {
      pose: 'polish_cannon',
      expression: 'smug',
      lookAt: [1.2, 1.2, 0.5],
      emotionSprite: 'none',
    },
    propState: {
      item: 'polishing_rag',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'colonial_day',
    subtitle: {
      text: 'March 1942. A Dutch general polishes',
      highlightWords: ['March', '1942.', 'polishes'],
    },
  },
  {
    id: 'beat-02-hook-wheel-ecu',
    startSec: 1.3,
    endSec: 2.6,
    camera: {
      pos: [-1.1, 0.55, 1.6],
      target: [-0.8, 0.45, -1.2],
      zoomEnd: 1.22,
      transition: 'cut',
    },
    character: {
      pose: 'polish_cannon',
      expression: 'smug',
      lookAt: [1.2, 1.2, 0.5],
      emotionSprite: 'none',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [-1.8, 0.45, -2.5],
      worldPosEnd: [-0.7, 0.45, -1.0],
      worldRot: [0, 0.35, 0],
    },
    lightingMood: 'colonial_day',
    subtitle: {
      text: 'a massive coastal cannon aimed out at sea—',
      highlightWords: ['massive', 'cannon', 'sea—'],
    },
  },
  {
    id: 'beat-03-hook-sneak',
    startSec: 2.6,
    endSec: 3.9,
    camera: {
      pos: [-0.9, 1.65, 3.2],
      target: [-0.2, 1.2, -0.5],
      zoomEnd: 1.12,
      transition: 'whip',
    },
    character: {
      pose: 'polish_cannon',
      expression: 'smug',
      lookAt: [1.4, 1.3, 0.4],
      emotionSprite: 'none',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [-0.7, 0.45, -1.0],
      worldPosEnd: [0.3, 0.45, -0.8],
      worldRot: [0, 0.1, 0],
    },
    lightingMood: 'colonial_day',
    subtitle: {
      text: 'completely unaware an invading army is sneaking up',
      highlightWords: ['unaware', 'invading', 'sneaking'],
    },
  },
  {
    id: 'beat-04-hook-bicycle-reveal',
    startSec: 3.9,
    endSec: 5.2,
    camera: {
      pos: [0.2, 0.65, 2.2],
      target: [0.2, 0.6, -0.6],
      zoomEnd: 1.18,
      transition: 'cut',
    },
    character: {
      pose: 'polish_cannon',
      expression: 'smug',
      lookAt: [1.4, 1.3, 0.4],
      emotionSprite: 'none',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [0.3, 0.45, -0.8],
      worldPosEnd: [0.2, 0.45, -0.3],
      worldRot: [0, 0, 0.08],
    },
    lightingMood: 'colonial_day',
    subtitle: {
      text: 'behind him on rusty bicycles.',
      highlightWords: ['rusty', 'bicycles.'],
    },
  },
  {
    id: 'beat-05-empire-diorama',
    startSec: 5.2,
    endSec: 7.8,
    camera: {
      pos: [0.0, 3.4, 4.8],
      target: [0.0, 0.4, 0.0],
      zoomEnd: 1.1,
      transition: 'cut',
    },
    character: {
      pose: 'arms_crossed',
      expression: 'smug',
      lookAt: [0.0, 1.2, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'smug_gold',
    subtitle: {
      text: 'For three hundred fifty years, the Dutch Empire ruled the archipelago.',
      highlightWords: ['three', 'hundred', 'fifty', 'years,', 'Dutch', 'Empire'],
    },
  },
  {
    id: 'beat-06-spice-gold',
    startSec: 7.8,
    endSec: 10.5,
    camera: {
      pos: [0.7, 1.5, 2.9],
      target: [0.1, 1.25, 0.0],
      zoomEnd: 1.13,
      transition: 'cut',
    },
    character: {
      pose: 'arms_crossed',
      expression: 'smug',
      lookAt: [0.5, 1.4, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'gold_sack',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'smug_gold',
    subtitle: {
      text: 'Fueled by spice monopolies, stone fortresses, and heavy artillery,',
      highlightWords: ['spice', 'monopolies,', 'fortresses,', 'artillery,'],
    },
  },
  {
    id: 'beat-07-untouchable-fort',
    startSec: 10.5,
    endSec: 13.0,
    camera: {
      pos: [0.0, 0.8, 3.6],
      target: [0.0, 1.85, 0.0],
      zoomEnd: 1.12,
      transition: 'cut',
    },
    character: {
      pose: 'arms_crossed',
      expression: 'smug',
      lookAt: [0.0, 1.0, 3.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'smug_gold',
    subtitle: {
      text: 'their grip looked unbreakable.',
      highlightWords: ['unbreakable.'],
    },
  },
  {
    id: 'beat-08-batavia-coffee',
    startSec: 13.0,
    endSec: 15.8,
    camera: {
      pos: [-0.6, 1.55, 2.7],
      target: [0.1, 1.35, -0.2],
      zoomEnd: 1.1,
      transition: 'whip',
    },
    character: {
      pose: 'sip_coffee',
      expression: 'smug',
      lookAt: [-0.4, 1.4, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'coffee_cup',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'colonial_day',
    subtitle: {
      text: 'Inside Batavia, colonial commanders laughed off invasion warnings,',
      highlightWords: ['Batavia,', 'laughed', 'off', 'warnings,'],
    },
  },
  {
    id: 'beat-09-dismiss-telegram',
    startSec: 15.8,
    endSec: 18.4,
    camera: {
      pos: [0.45, 1.45, 2.2],
      target: [0.0, 1.3, 0.0],
      zoomEnd: 1.15,
      transition: 'cut',
    },
    character: {
      pose: 'dismiss_wave',
      expression: 'smug',
      lookAt: [0.3, 1.3, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'telegram_paper',
      holder: 'world',
      worldPos: [0.55, 1.35, 0.3],
      worldPosEnd: [0.75, 0.15, 0.6],
      worldRot: [0.4, 0.2, -0.5],
    },
    lightingMood: 'colonial_day',
    subtitle: {
      text: 'sipping coffee behind concrete bunkers.',
      highlightWords: ['concrete', 'bunkers.'],
    },
  },
  {
    id: 'beat-10-empathy-forced-labor',
    startSec: 18.4,
    endSec: 21.4,
    camera: {
      pos: [-1.4, 1.4, 4.0],
      target: [0.0, 1.1, 0.0],
      zoomEnd: 1.08,
      transition: 'cut',
    },
    character: {
      pose: 'look_horizon',
      expression: 'neutral',
      lookAt: [1.5, 1.3, -1.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'empathy_sunset',
    subtitle: {
      text: 'Meanwhile, millions of locals endured generations of forced labor',
      highlightWords: ['millions', 'endured', 'forced', 'labor'],
    },
  },
  {
    id: 'beat-11-empathy-shadow',
    startSec: 21.4,
    endSec: 24.2,
    camera: {
      pos: [0.8, 1.35, 2.6],
      target: [0.0, 1.35, 0.0],
      zoomEnd: 1.12,
      transition: 'cut',
    },
    character: {
      pose: 'look_horizon',
      expression: 'neutral',
      lookAt: [-1.5, 1.4, 1.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'empathy_sunset',
    subtitle: {
      text: 'beneath this giant’s shadow.',
      highlightWords: ['giant’s', 'shadow.'],
    },
  },
  {
    id: 'beat-12-march-1-landing',
    startSec: 24.2,
    endSec: 26.2,
    camera: {
      pos: [0.0, 3.1, 4.2],
      target: [0.0, 0.3, 0.0],
      zoomEnd: 1.16,
      transition: 'cut',
    },
    character: {
      pose: 'arms_crossed',
      expression: 'sweat',
      lookAt: [0.0, 0.5, 1.0],
      emotionSprite: 'sweat_drop',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'midnight_invasion',
    subtitle: {
      text: 'Then, on March first, Japanese forces hit Java—',
      highlightWords: ['March', 'first,', 'hit', 'Java—'],
    },
  },
  {
    id: 'beat-13-no-tanks',
    startSec: 26.2,
    endSec: 28.2,
    camera: {
      pos: [0.0, 1.2, 2.5],
      target: [0.0, 1.1, 0.0],
      zoomEnd: 1.18,
      transition: 'whip',
    },
    character: {
      pose: 'dismiss_wave',
      expression: 'sweat',
      lookAt: [0.0, 1.2, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'midnight_invasion',
    subtitle: {
      text: 'not with heavy tanks—',
      highlightWords: ['NOT', 'heavy', 'tanks—'],
    },
  },
  {
    id: 'beat-14-20k-bicycles',
    startSec: 28.2,
    endSec: 30.6,
    camera: {
      pos: [-0.3, 0.9, 3.0],
      target: [0.0, 0.7, -0.5],
      zoomEnd: 1.2,
      transition: 'cut',
    },
    character: {
      pose: 'hands_up',
      expression: 'shock',
      lookAt: [0.0, 0.9, 2.5],
      emotionSprite: 'exclamation',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [0.0, 0.45, -2.8],
      worldPosEnd: [0.0, 0.45, 0.8],
      worldRot: [0, 0, 0],
    },
    lightingMood: 'crimson_crisis',
    subtitle: {
      text: 'but twenty thousand lightweight bicycles speeding down jungle backroads!',
      highlightWords: ['twenty', 'thousand', 'bicycles', 'jungle'],
    },
  },
  {
    id: 'beat-15-tires-blew-out',
    startSec: 30.6,
    endSec: 32.8,
    camera: {
      pos: [0.75, 0.45, 1.5],
      target: [0.0, 0.42, 0.2],
      zoomEnd: 1.22,
      transition: 'cut',
    },
    character: {
      pose: 'hands_up',
      expression: 'shock',
      lookAt: [0.0, 0.5, 2.0],
      emotionSprite: 'sweat_drop',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [0.0, 0.42, -0.4],
      worldPosEnd: [0.0, 0.42, 0.9],
      worldRot: [0, 0.15, -0.06],
    },
    lightingMood: 'crimson_crisis',
    subtitle: {
      text: 'When their rubber tires blew out,',
      highlightWords: ['rubber', 'tires', 'blew', 'out,'],
    },
  },
  {
    id: 'beat-16-bare-steel-rims',
    startSec: 32.8,
    endSec: 35.0,
    camera: {
      pos: [-0.85, 0.5, 1.7],
      target: [0.0, 0.45, 0.3],
      zoomEnd: 1.18,
      transition: 'whip',
    },
    character: {
      pose: 'hands_up',
      expression: 'shock',
      lookAt: [0.0, 0.5, 2.0],
      emotionSprite: 'exclamation',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [0.0, 0.42, -0.3],
      worldPosEnd: [0.0, 0.42, 1.2],
      worldRot: [0, -0.12, 0.07],
    },
    lightingMood: 'crimson_crisis',
    subtitle: {
      text: 'they kept charging forward on bare steel rims!',
      highlightWords: ['bare', 'steel', 'rims!'],
    },
  },
  {
    id: 'beat-17-kalijati-split',
    startSec: 35.0,
    endSec: 37.5,
    camera: {
      pos: [0.0, 2.8, 3.6],
      target: [0.0, 0.5, 0.0],
      zoomEnd: 1.15,
      transition: 'cut',
    },
    character: {
      pose: 'hands_up',
      expression: 'shock',
      lookAt: [0.0, 1.8, 2.0],
      emotionSprite: 'sweat_drop',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'crimson_crisis',
    subtitle: {
      text: 'Within days, they seized Kalijati airfield and sliced Dutch defenses in half.',
      highlightWords: ['Kalijati', 'airfield', 'sliced', 'half.'],
    },
  },
  {
    id: 'beat-18-march-8-panic',
    startSec: 37.5,
    endSec: 40.2,
    camera: {
      pos: [0.25, 1.55, 2.1],
      target: [0.0, 1.4, 0.0],
      zoomEnd: 1.18,
      transition: 'cut',
    },
    character: {
      pose: 'hands_up',
      expression: 'shock',
      lookAt: [0.0, 1.4, 2.0],
      emotionSprite: 'exclamation',
    },
    propState: {
      item: 'coffee_cup',
      holder: 'world',
      worldPos: [0.35, 1.2, 0.25],
      worldPosEnd: [0.45, 0.05, 0.45],
      worldRot: [1.2, 0.4, 0.8],
    },
    lightingMood: 'crimson_crisis',
    subtitle: {
      text: 'On March eighth, a three-century empire surrendered—',
      highlightWords: ['March', 'eighth,', 'surrendered—'],
    },
  },
  {
    id: 'beat-19-eight-days-punchline',
    startSec: 40.2,
    endSec: 43.0,
    camera: {
      pos: [0.0, 1.45, 1.85],
      target: [0.0, 1.35, 0.0],
      zoomEnd: 1.15,
      transition: 'cut',
    },
    character: {
      pose: 'sign_paper',
      expression: 'sweat',
      lookAt: [0.0, 0.9, 0.6],
      emotionSprite: 'sweat_drop',
    },
    propState: {
      item: 'surrender_pen',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'crimson_crisis',
    subtitle: {
      text: 'in eight days.',
      highlightWords: ['eight', 'days.'],
    },
  },
  {
    id: 'beat-20-analogy-padlock',
    startSec: 43.0,
    endSec: 46.4,
    camera: {
      pos: [0.0, 1.4, 3.2],
      target: [0.0, 1.25, 0.0],
      zoomEnd: 1.12,
      transition: 'cut',
    },
    character: {
      pose: 'arms_crossed',
      expression: 'neutral',
      lookAt: [0.0, 1.3, 2.0],
      emotionSprite: 'lightbulb',
    },
    propState: {
      item: 'giant_padlock',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'analogy_studio',
    subtitle: {
      text: 'You see, the Dutch locked a giant steel padlock onto their front door,',
      highlightWords: ['You', 'see,', 'steel', 'padlock', 'front', 'door,'],
    },
  },
  {
    id: 'beat-21-analogy-back-window',
    startSec: 46.4,
    endSec: 50.0,
    camera: {
      pos: [-1.8, 1.5, -2.8],
      target: [0.0, 1.2, 0.0],
      zoomEnd: 1.14,
      transition: 'whip',
    },
    character: {
      pose: 'hands_up',
      expression: 'shock',
      lookAt: [-1.0, 1.3, -2.0],
      emotionSprite: 'exclamation',
    },
    propState: {
      item: 'rusty_bicycle',
      holder: 'world',
      worldPos: [-0.8, 0.85, -1.6],
      worldPosEnd: [0.4, 0.85, 0.4],
      worldRot: [0, 0.4, 0],
    },
    lightingMood: 'analogy_studio',
    subtitle: {
      text: 'never realizing the back window was wide open to slip inside.',
      highlightWords: ['back', 'window', 'wide', 'open'],
    },
  },
  {
    id: 'beat-22-giant-collapsed',
    startSec: 50.0,
    endSec: 52.6,
    camera: {
      pos: [0.6, 1.6, 3.5],
      target: [0.0, 1.1, 0.0],
      zoomEnd: 1.1,
      transition: 'cut',
    },
    character: {
      pose: 'look_horizon',
      expression: 'neutral',
      lookAt: [0.0, 1.5, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'none',
      holder: 'world',
      worldPos: [0, -5, 0],
    },
    lightingMood: 'freedom_dawn',
    subtitle: {
      text: 'And as that colonial giant collapsed overnight,',
      highlightWords: ['giant', 'collapsed', 'overnight,'],
    },
  },
  {
    id: 'beat-23-spark-freedom',
    startSec: 52.6,
    endSec: 55.0,
    camera: {
      pos: [-0.4, 1.45, 2.5],
      target: [0.0, 1.45, 0.0],
      zoomEnd: 1.16,
      transition: 'cut',
    },
    character: {
      pose: 'raise_torch',
      expression: 'neutral',
      lookAt: [0.0, 1.6, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'freedom_torch',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'freedom_dawn',
    subtitle: {
      text: 'a nation’s spark for freedom',
      highlightWords: ['spark', 'for', 'freedom'],
    },
  },
  {
    id: 'beat-24-ignited-hardcut',
    startSec: 55.0,
    endSec: 57.0,
    camera: {
      pos: [0.0, 1.75, 1.8],
      target: [0.25, 1.85, 0.2],
      zoomEnd: 1.32,
      transition: 'cut',
    },
    character: {
      pose: 'raise_torch',
      expression: 'neutral',
      lookAt: [0.0, 1.8, 2.0],
      emotionSprite: 'none',
    },
    propState: {
      item: 'freedom_torch',
      holder: 'right_hand',
      worldPos: [0, 0, 0],
    },
    lightingMood: 'freedom_dawn',
    subtitle: {
      text: 'ignited—',
      highlightWords: ['ignited—'],
    },
  },
];