import { clamp } from '@lib';

export type Preset = {
  tower: number;
  wall: number;
  quarries: number;
  magic: number;
  dungeons: number;
  bricks: number;
  gems: number;
  recruits: number;
  towerVictory: number;
  resourceVictory: number;
};

const PRESETS: Map<string, Preset> = new Map([
  [
    'Default',
    {
      tower: 20,
      wall: 10,
      quarries: 2,
      magic: 2,
      dungeons: 2,
      bricks: 5,
      gems: 5,
      recruits: 5,
      towerVictory: 50,
      resourceVictory: 100,
    },
  ],
  [
    'On The House - Harmondale',
    {
      tower: 15,
      wall: 5,
      quarries: 2,
      magic: 2,
      dungeons: 2,
      bricks: 10,
      gems: 10,
      recruits: 10,
      towerVictory: 30,
      resourceVictory: 100,
    },
  ],
  [
    "Griffin's Rest - Erathia",
    {
      tower: 20,
      wall: 5,
      quarries: 2,
      magic: 2,
      dungeons: 2,
      bricks: 5,
      gems: 5,
      recruits: 5,
      towerVictory: 50,
      resourceVictory: 150,
    },
  ],
  [
    'Emerald Inn - Tularean Forest',
    {
      tower: 20,
      wall: 5,
      quarries: 2,
      magic: 2,
      dungeons: 2,
      bricks: 5,
      gems: 5,
      recruits: 5,
      towerVictory: 50,
      resourceVictory: 150,
    },
  ],
  [
    'Snobbish Goblin - Deyja',
    {
      tower: 25,
      wall: 10,
      quarries: 3,
      magic: 3,
      dungeons: 3,
      bricks: 5,
      gems: 5,
      recruits: 5,
      towerVictory: 75,
      resourceVictory: 200,
    },
  ],
  [
    'Familiar Place - Bracada Desert',
    {
      tower: 20,
      wall: 10,
      quarries: 3,
      magic: 3,
      dungeons: 3,
      bricks: 5,
      gems: 5,
      recruits: 5,
      towerVictory: 75,
      resourceVictory: 200,
    },
  ],
  [
    'The Blessed Brew - Celeste',
    {
      tower: 30,
      wall: 15,
      quarries: 4,
      magic: 4,
      dungeons: 4,
      bricks: 10,
      gems: 10,
      recruits: 10,
      towerVictory: 100,
      resourceVictory: 300,
    },
  ],
  [
    'The Vampyre Lounge - The Pit',
    {
      tower: 30,
      wall: 15,
      quarries: 4,
      magic: 4,
      dungeons: 4,
      bricks: 10,
      gems: 10,
      recruits: 10,
      towerVictory: 100,
      resourceVictory: 300,
    },
  ],
  [
    'The Laughing Monk - Evermorn Island',
    {
      tower: 20,
      wall: 10,
      quarries: 5,
      magic: 5,
      dungeons: 5,
      bricks: 25,
      gems: 25,
      recruits: 25,
      towerVictory: 150,
      resourceVictory: 400,
    },
  ],
  [
    "Fortune's Folly - Nighon",
    {
      tower: 20,
      wall: 10,
      quarries: 1,
      magic: 1,
      dungeons: 1,
      bricks: 15,
      gems: 15,
      recruits: 15,
      towerVictory: 200,
      resourceVictory: 500,
    },
  ],
  [
    "Miner's Only - Barrow Downs",
    {
      tower: 20,
      wall: 50,
      quarries: 1,
      magic: 1,
      dungeons: 5,
      bricks: 5,
      gems: 5,
      recruits: 25,
      towerVictory: 100,
      resourceVictory: 300,
    },
  ],
  [
    'The Loyal Mercenary - Tatalia',
    {
      tower: 10,
      wall: 20,
      quarries: 3,
      magic: 1,
      dungeons: 2,
      bricks: 15,
      gems: 5,
      recruits: 10,
      towerVictory: 125,
      resourceVictory: 350,
    },
  ],
  [
    'The Potted Pixie - Avlee',
    {
      tower: 10,
      wall: 20,
      quarries: 3,
      magic: 1,
      dungeons: 2,
      bricks: 15,
      gems: 5,
      recruits: 10,
      towerVictory: 125,
      resourceVictory: 350,
    },
  ],
  [
    "Grogg's Grog - Stone City",
    {
      tower: 50,
      wall: 50,
      quarries: 5,
      magic: 3,
      dungeons: 5,
      bricks: 20,
      gems: 10,
      recruits: 20,
      towerVictory: 100,
      resourceVictory: 300,
    },
  ],
]);

export function getPreset(name: string): Preset | null {
  return PRESETS.has(name) ? { ...PRESETS.get(name)! } : null;
}

export function getPresetName(preset: Readonly<Preset>): string {
  const keys = Object.keys(preset) as (keyof Preset)[];

  for (const [name, p] of PRESETS) {
    if (keys.every((key) => preset[key] === p[key])) {
      return name;
    }
  }

  return 'Custom';
}

export function forEachPreset(
  cb: (preset: Readonly<Preset>, name: string) => void
): void {
  PRESETS.forEach(cb);
}

export function validatePreset(preset: Preset): Preset {
  preset.towerVictory = clamp(preset.towerVictory, 30, 999);
  preset.tower = clamp(preset.tower, 5, Math.min(50, preset.towerVictory - 1));
  preset.wall = clamp(preset.wall, 0, 50);
  preset.quarries = clamp(preset.quarries, 1, 5);
  preset.magic = clamp(preset.magic, 1, 5);
  preset.dungeons = clamp(preset.dungeons, 1, 5);
  preset.bricks = clamp(preset.bricks, 0, 50);
  preset.gems = clamp(preset.gems, 0, 50);
  preset.recruits = clamp(preset.recruits, 0, 50);
  preset.resourceVictory = clamp(preset.resourceVictory, 100, 999);

  return preset;
}
