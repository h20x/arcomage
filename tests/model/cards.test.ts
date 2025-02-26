import { PlayerParams } from '@game';
import { getCard, Player } from '@model';

const defaultParams: PlayerParams = {
  isActive: false,
  isWinner: false,
  isDiscardMode: false,
  quarries: 32,
  magic: 32,
  dungeons: 32,
  bricks: 32,
  gems: 32,
  recruits: 32,
  tower: 32,
  wall: 32,
};

let player: Player;
let enemy: Player;

function setup(
  playerParams: Partial<PlayerParams> = {},
  enemyParams: Partial<PlayerParams> = {}
): void {
  createPlayer(playerParams);
  createEnemy(enemyParams);
}

function createPlayer(params: Partial<PlayerParams>): void {
  player = new Player({
    ...defaultParams,
    ...params,
    isActive: true,
  });
}

function createEnemy(params: Partial<PlayerParams>): void {
  enemy = new Player({
    ...defaultParams,
    ...params,
    isActive: false,
  });
}

function expectChanges(
  cardName: string,
  expectedPlayerChanges: Partial<PlayerParams>,
  expectedEnemyChanges: Partial<PlayerParams> = {}
): void {
  const playerParamsBefore = player.getParams();
  const enemyParamsBefore = enemy.getParams();
  getCard(cardName).apply(player, enemy);
  const playerParamsAfter = player.getParams();
  const enemyParamsAfter = enemy.getParams();
  const playerChanges = diff(playerParamsAfter, playerParamsBefore);
  const enemyChanges = diff(enemyParamsAfter, enemyParamsBefore);

  expect(playerChanges).toEqual(expectedPlayerChanges);
  expect(enemyChanges).toEqual(expectedEnemyChanges);
}

function diff(a: PlayerParams, b: PlayerParams): Partial<PlayerParams> {
  const diff = {} as any;
  const keys = Object.keys(a) as (keyof PlayerParams)[];

  for (let k of keys) {
    if (a[k] === b[k]) {
      continue;
    }

    if ('number' === typeof a[k]) {
      diff[k] = (a[k] as number) - (b[k] as number);
    } else {
      diff[k] = a[k];
    }
  }

  return diff;
}

describe('Brick cards', () => {
  beforeEach(() => {
    setup();
  });

  it('Brick Shortage', () => {
    expectChanges(
      'Brick Shortage',
      { isActive: false, bricks: -8 },
      { isActive: true, bricks: -8 }
    );
  });

  it('Earthquake', () => {
    expectChanges(
      'Earthquake',
      { isActive: false, quarries: -1 },
      { isActive: true, quarries: -1 }
    );
  });

  it('Lucky Cache', () => {
    expectChanges('Lucky Cache', { bricks: +2, gems: +2 });
  });

  it('Strip Mine', () => {
    expectChanges(
      'Strip Mine',
      { isActive: false, quarries: -1, wall: +10, gems: +5 },
      { isActive: true }
    );
  });

  it('Rock Garden', () => {
    expectChanges(
      'Rock Garden',
      { isActive: false, wall: +1, tower: +1, recruits: +2, bricks: -1 },
      { isActive: true }
    );
  });

  it('Friendly Terrain', () => {
    expectChanges('Friendly Terrain', { wall: +1, bricks: -1 });
  });

  it('Work Overtime', () => {
    expectChanges(
      'Work Overtime',
      { isActive: false, wall: +5, gems: -6, bricks: -2 },
      { isActive: true }
    );
  });

  it('Basic Wall', () => {
    expectChanges(
      'Basic Wall',
      { isActive: false, wall: +3, bricks: -2 },
      { isActive: true }
    );
  });

  it('Innovations', () => {
    expectChanges(
      'Innovations',
      { isActive: false, quarries: +1, gems: +4, bricks: -2 },
      { isActive: true, quarries: +1 }
    );
  });

  describe('Foundations', () => {
    it('if wall > 0', () => {
      expectChanges(
        'Foundations',
        { isActive: false, wall: +3, bricks: -3 },
        { isActive: true }
      );
    });

    it('if wall = 0', () => {
      setup({ wall: 0 });
      expectChanges(
        'Foundations',
        { isActive: false, wall: +6, bricks: -3 },
        { isActive: true }
      );
    });
  });

  it('Miners', () => {
    expectChanges(
      'Miners',
      { isActive: false, quarries: +1, bricks: -3 },
      { isActive: true }
    );
  });

  it('Sturdy Wall', () => {
    expectChanges(
      'Sturdy Wall',
      { isActive: false, wall: +4, bricks: -3 },
      { isActive: true }
    );
  });

  describe('Mother Lode', () => {
    it('If quarry < enemy quarry', () => {
      setup({ quarries: defaultParams.quarries - 1 });
      expectChanges(
        'Mother Lode',
        { isActive: false, quarries: +2, bricks: -4 },
        { isActive: true }
      );
    });

    it('If quarry = enemy quarry', () => {
      expectChanges(
        'Mother Lode',
        { isActive: false, quarries: +1, bricks: -4 },
        { isActive: true }
      );
    });

    it('If quarry > enemy quarry', () => {
      setup({ quarries: defaultParams.quarries + 1 });
      expectChanges(
        'Mother Lode',
        { isActive: false, quarries: +1, bricks: -4 },
        { isActive: true }
      );
    });
  });

  it('Collapse!', () => {
    expectChanges(
      'Collapse!',
      { isActive: false, bricks: -4 },
      { isActive: true, quarries: -1 }
    );
  });

  it('Big Wall', () => {
    expectChanges(
      'Big Wall',
      { isActive: false, wall: +6, bricks: -5 },
      { isActive: true }
    );
  });

  describe('Copping the Tech', () => {
    it('If quarry < enemy quarry', () => {
      setup({}, { quarries: defaultParams.quarries + 4 });
      const diff = enemy.quarries - player.quarries;
      expectChanges(
        'Copping the Tech',
        { isActive: false, quarries: +diff, bricks: -5 },
        { isActive: true }
      );
    });

    it('If quarry = enemy quarry', () => {
      expectChanges(
        'Copping the Tech',
        { isActive: false, bricks: -5 },
        { isActive: true }
      );
    });

    it('If quarry > enemy quarry', () => {
      setup({ quarries: defaultParams.quarries + 1 });
      expectChanges(
        'Copping the Tech',
        { isActive: false, bricks: -5 },
        { isActive: true }
      );
    });
  });

  describe('Flood Water', () => {
    it('if wall < enemy wall', () => {
      setup({ wall: defaultParams.wall - 1 });
      expectChanges(
        'Flood Water',
        { isActive: false, dungeons: -1, tower: -2, bricks: -6 },
        { isActive: true }
      );
    });

    it('if wall = enemy wall', () => {
      expectChanges(
        'Flood Water',
        { isActive: false, dungeons: -1, tower: -2, bricks: -6 },
        { isActive: true, dungeons: -1, tower: -2 }
      );
    });

    it('if wall > enemy wall', () => {
      setup({ wall: defaultParams.wall + 1 });
      expectChanges(
        'Flood Water',
        { isActive: false, bricks: -6 },
        { isActive: true, dungeons: -1, tower: -2 }
      );
    });
  });

  it('New Equipment', () => {
    expectChanges(
      'New Equipment',
      { isActive: false, bricks: -6, quarries: +2 },
      { isActive: true }
    );
  });

  it('Forced Labor', () => {
    expectChanges(
      'Forced Labor',
      { isActive: false, bricks: -7, wall: +9, recruits: -5 },
      { isActive: true }
    );
  });

  it('Dwarven Miners', () => {
    expectChanges(
      'Dwarven Miners',
      { isActive: false, bricks: -7, wall: +4, quarries: +1 },
      { isActive: true }
    );
  });

  it('Tremors', () => {
    expectChanges('Tremors', { bricks: -7, wall: -5 }, { wall: -5 });
  });

  it('Secret Room', () => {
    expectChanges('Secret Room', { bricks: -8, magic: +1 });
  });

  it('Reinforced Wall', () => {
    expectChanges(
      'Reinforced Wall',
      { isActive: false, bricks: -8, wall: +8 },
      { isActive: true }
    );
  });

  it('Porticulus', () => {
    expectChanges(
      'Porticulus',
      { isActive: false, bricks: -9, wall: +5, dungeons: +1 },
      { isActive: true }
    );
  });

  it('Crystal Rocks', () => {
    expectChanges(
      'Crystal Rocks',
      { isActive: false, bricks: -9, wall: +7, gems: +7 },
      { isActive: true }
    );
  });

  describe('Barracks', () => {
    it('if dungeon < enemy dungeon', () => {
      setup({ dungeons: defaultParams.dungeons - 1 });
      expectChanges(
        'Barracks',
        {
          isActive: false,
          bricks: -10,
          recruits: +6,
          wall: +6,
          dungeons: +1,
        },
        { isActive: true }
      );
    });

    it('if dungeon = enemy dungeon', () => {
      expectChanges(
        'Barracks',
        { isActive: false, bricks: -10, recruits: +6, wall: +6 },
        { isActive: true }
      );
    });

    it('if dungeon > enemy dungeon', () => {
      setup({ dungeons: defaultParams.dungeons + 1 });
      expectChanges(
        'Barracks',
        { isActive: false, bricks: -10, recruits: +6, wall: +6 },
        { isActive: true }
      );
    });
  });

  it('Harmonic Ore', () => {
    expectChanges(
      'Harmonic Ore',
      { isActive: false, bricks: -11, wall: +6, tower: +3 },
      { isActive: true }
    );
  });

  it('Mondo Wall', () => {
    expectChanges(
      'Mondo Wall',
      { isActive: false, bricks: -12, wall: +12 },
      { isActive: true }
    );
  });

  it('Battlements', () => {
    setup({}, { wall: 3 });
    expectChanges(
      'Battlements',
      { isActive: false, bricks: -14, wall: +7 },
      { isActive: true, wall: -3, tower: -3 }
    );
  });

  it('Focused Designs', () => {
    expectChanges(
      'Focused Designs',
      { isActive: false, bricks: -15, wall: +8, tower: +5 },
      { isActive: true }
    );
  });

  it('Great Wall', () => {
    expectChanges(
      'Great Wall',
      { isActive: false, bricks: -16, wall: +15 },
      { isActive: true }
    );
  });

  it('Shift', () => {
    setup({ wall: 0 }, { wall: 8 });
    expectChanges(
      'Shift',
      { isActive: false, bricks: -17, wall: +8 },
      { isActive: true, wall: -8 }
    );

    setup({ wall: 8 }, { wall: 0 });
    expectChanges(
      'Shift',
      { isActive: false, bricks: -17, wall: -8 },
      { isActive: true, wall: +8 }
    );
  });

  it('Rock Launcher', () => {
    setup({}, { wall: 5 });
    expectChanges(
      'Rock Launcher',
      { isActive: false, bricks: -18, wall: +6 },
      { isActive: true, wall: -5, tower: -5 }
    );
  });

  it("Dragon's Heart", () => {
    expectChanges(
      "Dragon's Heart",
      { isActive: false, bricks: -24, wall: +20, tower: +8 },
      { isActive: true }
    );
  });
});

describe('Gem cards', () => {
  beforeEach(() => {
    setup();
  });

  describe('Bag of Baubles', () => {
    it('if tower < enemy tower', () => {
      setup({ tower: 1 }, { tower: 2 });

      expectChanges(
        'Bag of Baubles',
        { isActive: false, tower: +2 },
        { isActive: true }
      );
    });

    it('if tower = enemy tower', () => {
      setup({ tower: 2 }, { tower: 2 });

      expectChanges(
        'Bag of Baubles',
        { isActive: false, tower: +1 },
        { isActive: true }
      );
    });

    it('if tower > enemy tower', () => {
      setup({ tower: 2 }, { tower: 1 });

      expectChanges(
        'Bag of Baubles',
        { isActive: false, tower: +1 },
        { isActive: true }
      );
    });
  });

  it('Rainbow', () => {
    expectChanges(
      'Rainbow',
      { isActive: false, tower: +1, gems: +3 },
      { isActive: true, tower: +1 }
    );
  });

  it('Quartz', () => {
    expectChanges('Quartz', { gems: -1, tower: +1 });
  });

  it('Smoky Quartz', () => {
    expectChanges('Smoky Quartz', { gems: -2 }, { tower: -1 });
  });

  it('Amethyst', () => {
    expectChanges(
      'Amethyst',
      { isActive: false, gems: -2, tower: +3 },
      { isActive: true }
    );
  });

  it('Prism', () => {
    expectChanges('Prism', { gems: -2, isDiscardMode: true });
  });

  it('Gemstone Flaw', () => {
    expectChanges(
      'Gemstone Flaw',
      { isActive: false, gems: -2 },
      { isActive: true, tower: -3 }
    );
  });

  it('Spell Weavers', () => {
    expectChanges(
      'Spell Weavers',
      { isActive: false, gems: -3, magic: +1 },
      { isActive: true }
    );
  });

  it('Ruby', () => {
    expectChanges(
      'Ruby',
      { isActive: false, gems: -3, tower: +5 },
      { isActive: true }
    );
  });

  it('Power Burn', () => {
    expectChanges(
      'Power Burn',
      { isActive: false, gems: -3, tower: -5, magic: +2 },
      { isActive: true }
    );
  });

  it('Gem Spear', () => {
    expectChanges(
      'Gem Spear',
      { isActive: false, gems: -4 },
      { isActive: true, tower: -5 }
    );
  });

  it('Solar Flare', () => {
    expectChanges(
      'Solar Flare',
      { isActive: false, gems: -4, tower: +2 },
      { isActive: true, tower: -2 }
    );
  });

  it("Quarry's Help", () => {
    expectChanges(
      "Quarry's Help",
      { isActive: false, gems: -4, bricks: -10, tower: +7 },
      { isActive: true }
    );
  });

  it('Apprentice', () => {
    expectChanges(
      'Apprentice',
      { isActive: false, gems: -5, recruits: -3, tower: +4 },
      { isActive: true, tower: -2 }
    );
  });

  it('Lodestone', () => {
    expectChanges(
      'Lodestone',
      { isActive: false, gems: -5, tower: +3 },
      { isActive: true }
    );
  });

  it('Discord', () => {
    expectChanges(
      'Discord',
      { isActive: false, gems: -5, tower: -7, magic: -1 },
      { isActive: true, tower: -7, magic: -1 }
    );
  });

  it('Crystal Matrix', () => {
    expectChanges(
      'Crystal Matrix',
      { isActive: false, gems: -6, magic: +1, tower: +3 },
      { isActive: true, tower: +1 }
    );
  });

  it('Emerald', () => {
    expectChanges(
      'Emerald',
      { isActive: false, gems: -6, tower: +8 },
      { isActive: true }
    );
  });

  it('Crumblestone', () => {
    expectChanges(
      'Crumblestone',
      { isActive: false, gems: -7, tower: +5 },
      { isActive: true, bricks: -6 }
    );
  });

  it('Harmonic Vibe', () => {
    expectChanges(
      'Harmonic Vibe',
      { isActive: false, gems: -7, magic: +1, tower: +3, wall: +3 },
      { isActive: true }
    );
  });

  describe('Parity', () => {
    it('if magic > enemy magic', () => {
      setup({ magic: 8 }, { magic: 4 });
      expectChanges(
        'Parity',
        { isActive: false, gems: -7 },
        { isActive: true, magic: +4 }
      );
    });

    it('if magic = enemy magic', () => {
      setup({ magic: 8 }, { magic: 8 });
      expectChanges(
        'Parity',
        { isActive: false, gems: -7 },
        { isActive: true }
      );
    });

    it('if magic < enemy magic', () => {
      setup({ magic: 4 }, { magic: 8 });
      expectChanges(
        'Parity',
        { isActive: false, gems: -7, magic: +4 },
        { isActive: true }
      );
    });
  });

  it('Crystallize', () => {
    expectChanges(
      'Crystallize',
      { isActive: false, gems: -8, wall: -6, tower: +11 },
      { isActive: true }
    );
  });

  it('Shatterer', () => {
    expectChanges(
      'Shatterer',
      { isActive: false, gems: -8, magic: -1 },
      { isActive: true, tower: -9 }
    );
  });

  it('Pearl of Wisdom', () => {
    expectChanges(
      'Pearl of Wisdom',
      { isActive: false, gems: -9, tower: +5, magic: +1 },
      { isActive: true }
    );
  });

  it('Sapphire', () => {
    expectChanges(
      'Sapphire',
      { isActive: false, gems: -10, tower: +11 },
      { isActive: true }
    );
  });

  describe('Lightning Shard', () => {
    it('if tower < enemy wall', () => {
      setup({ tower: 8 }, { wall: 16 });
      expectChanges(
        'Lightning Shard',
        { isActive: false, gems: -11 },
        { isActive: true, wall: -8 }
      );

      setup({ tower: 2 }, { tower: 4, wall: 4 });
      expectChanges(
        'Lightning Shard',
        { isActive: false, gems: -11 },
        { isActive: true, tower: -4, wall: -4 }
      );
    });

    it('if tower = enemy wall', () => {
      setup({ tower: 16 }, { wall: 16 });
      expectChanges(
        'Lightning Shard',
        { isActive: false, gems: -11 },
        { isActive: true, wall: -8 }
      );

      setup({ tower: 4 }, { tower: 4, wall: 4 });
      expectChanges(
        'Lightning Shard',
        { isActive: false, gems: -11 },
        { isActive: true, tower: -4, wall: -4 }
      );
    });

    it('if tower > enemy wall', () => {
      setup({ tower: 16 }, { tower: 16, wall: 4 });
      expectChanges(
        'Lightning Shard',
        { isActive: false, gems: -11 },
        { isActive: true, tower: -8 }
      );
    });
  });

  it('Crystal Shield', () => {
    expectChanges(
      'Crystal Shield',
      { isActive: false, gems: -12, wall: +3, tower: +8 },
      { isActive: true }
    );
  });

  it('Fire Ruby', () => {
    expectChanges(
      'Fire Ruby',
      { isActive: false, gems: -13, tower: +6 },
      { isActive: true, tower: -4 }
    );
  });

  it('Empathy Gem', () => {
    expectChanges(
      'Empathy Gem',
      { isActive: false, gems: -14, tower: +8, dungeons: +1 },
      { isActive: true }
    );
  });

  it('Sanctuary', () => {
    expectChanges(
      'Sanctuary',
      { isActive: false, gems: -15, tower: +10, wall: +5, recruits: +5 },
      { isActive: true }
    );
  });

  it('Diamond', () => {
    expectChanges(
      'Diamond',
      { isActive: false, gems: -16, tower: +15 },
      { isActive: true }
    );
  });

  it('Lava Jewel', () => {
    setup({}, { wall: 8 });
    expectChanges(
      'Lava Jewel',
      { isActive: false, gems: -17, tower: +12 },
      { isActive: true, wall: -6 }
    );

    setup({}, { tower: 4, wall: 4 });
    expectChanges(
      'Lava Jewel',
      { isActive: false, gems: -17, tower: +12 },
      { isActive: true, wall: -4, tower: -2 }
    );
  });

  it('Phase Jewel', () => {
    expectChanges(
      'Phase Jewel',
      { isActive: false, gems: -18, tower: +13, recruits: +6, bricks: +6 },
      { isActive: true }
    );
  });

  it("Dragon's Eye", () => {
    expectChanges(
      "Dragon's Eye",
      { isActive: false, gems: -21, tower: +20 },
      { isActive: true }
    );
  });
});

describe('Recruit cards', () => {
  beforeEach(() => {
    setup();
  });

  it('Mad Cow Disease', () => {
    expectChanges(
      'Mad Cow Disease',
      { isActive: false, recruits: -6 },
      { isActive: true, recruits: -6 }
    );
  });

  it('Full Moon', () => {
    expectChanges(
      'Full Moon',
      { isActive: false, dungeons: +1, recruits: +3 },
      { isActive: true, dungeons: +1 }
    );
  });

  it('Faerie', () => {
    setup({}, { wall: 1 });
    expectChanges('Faerie', { recruits: -1 }, { wall: -1, tower: -1 });
  });

  it('Moody Goblins', () => {
    setup({}, { wall: 2 });
    expectChanges(
      'Moody Goblins',
      { isActive: false, recruits: -1, gems: -3 },
      { isActive: true, wall: -2, tower: -2 }
    );
  });

  describe('Spearman', () => {
    it('if wall > enemy wall', () => {
      setup({}, { wall: 1 });
      expectChanges(
        'Spearman',
        { isActive: false, recruits: -2 },
        { isActive: true, wall: -1, tower: -2 }
      );
    });

    it('if wall = enemy wall', () => {
      setup({ wall: 1 }, { wall: 1 });
      expectChanges(
        'Spearman',
        { isActive: false, recruits: -2 },
        { isActive: true, wall: -1, tower: -1 }
      );
    });

    it('if wall < enemy wall', () => {
      setup({ wall: 0 }, { wall: 1 });
      expectChanges(
        'Spearman',
        { isActive: false, recruits: -2 },
        { isActive: true, wall: -1, tower: -1 }
      );
    });
  });

  it('Gnome', () => {
    setup({}, { wall: 1 });
    expectChanges(
      'Gnome',
      { isActive: false, recruits: -2, gems: +1 },
      { isActive: true, wall: -1, tower: -2 }
    );
  });

  it('Elven Scout', () => {
    expectChanges('Elven Scout', { isDiscardMode: true, recruits: -2 }, {});
  });

  it('Orc', () => {
    setup({}, { wall: 2 });
    expectChanges(
      'Orc',
      { isActive: false, recruits: -3 },
      { isActive: true, wall: -2, tower: -3 }
    );
  });

  it('Minotaur', () => {
    expectChanges(
      'Minotaur',
      { isActive: false, recruits: -3, dungeons: +1 },
      { isActive: true }
    );
  });

  it('Goblin Mob', () => {
    setup({ wall: 1 }, { wall: 3 });
    expectChanges(
      'Goblin Mob',
      { isActive: false, recruits: -3, wall: -1, tower: -2 },
      { isActive: true, wall: -3, tower: -3 }
    );
  });

  it('Berserker', () => {
    setup({}, { wall: 4 });
    expectChanges(
      'Berserker',
      { isActive: false, recruits: -4, tower: -3 },
      { isActive: true, wall: -4, tower: -4 }
    );
  });

  it('Goblin Archers', () => {
    setup({ wall: 0 });
    expectChanges(
      'Goblin Archers',
      { isActive: false, recruits: -4, tower: -1 },
      { isActive: true, tower: -3 }
    );
  });

  it('Dwarves', () => {
    setup({}, { wall: 2 });
    expectChanges(
      'Dwarves',
      { isActive: false, recruits: -5, wall: +3 },
      { isActive: true, wall: -2, tower: -2 }
    );
  });

  it('Imp', () => {
    setup({}, { wall: 3 });
    expectChanges(
      'Imp',
      { isActive: false, recruits: -10, bricks: -5, gems: -5 },
      {
        isActive: true,
        recruits: -5,
        bricks: -5,
        gems: -5,
        wall: -3,
        tower: -3,
      }
    );
  });

  it('Slasher', () => {
    setup({}, { wall: 3 });
    expectChanges(
      'Slasher',
      { isActive: false, recruits: -5 },
      { isActive: true, wall: -3, tower: -3 }
    );
  });

  it('Shadow Faerie', () => {
    expectChanges('Shadow Faerie', { recruits: -6 }, { tower: -2 });
  });

  it('Ogre', () => {
    setup({}, { wall: 3 });
    expectChanges(
      'Ogre',
      { isActive: false, recruits: -6 },
      { isActive: true, wall: -3, tower: -4 }
    );
  });

  it('Little Snakes', () => {
    expectChanges(
      'Little Snakes',
      { isActive: false, recruits: -6 },
      { isActive: true, tower: -4 }
    );
  });

  it('Rabid Sheep', () => {
    setup({}, { wall: 3 });
    expectChanges(
      'Rabid Sheep',
      { isActive: false, recruits: -6 },
      { isActive: true, recruits: -3, wall: -3, tower: -3 }
    );
  });

  it('Troll Trainer', () => {
    expectChanges(
      'Troll Trainer',
      { isActive: false, recruits: -7, dungeons: +2 },
      { isActive: true }
    );
  });

  it('Tower Gremlin', () => {
    setup({}, { wall: 1 });
    expectChanges(
      'Tower Gremlin',
      { isActive: false, recruits: -8, wall: +4, tower: +2 },
      { isActive: true, wall: -1, tower: -1 }
    );
  });

  describe('Spizzer', () => {
    it('if enemy wall = 0', () => {
      setup({}, { wall: 0 });
      expectChanges(
        'Spizzer',
        { isActive: false, recruits: -8 },
        { isActive: true, tower: -10 }
      );
    });

    it('if enemy wall > 0', () => {
      setup({}, { wall: 3 });
      expectChanges(
        'Spizzer',
        { isActive: false, recruits: -8 },
        { isActive: true, wall: -3, tower: -3 }
      );
    });
  });

  describe('Unicorn', () => {
    it('if magic > enemy magic', () => {
      setup({ magic: 2 }, { magic: 1, wall: 6 });
      expectChanges(
        'Unicorn',
        { isActive: false, recruits: -9 },
        { isActive: true, wall: -6, tower: -6 }
      );
    });

    it('if magic = enemy magic', () => {
      setup({}, { wall: 4 });
      expectChanges(
        'Unicorn',
        { isActive: false, recruits: -9 },
        { isActive: true, wall: -4, tower: -4 }
      );
    });

    it('if magic < enemy magic', () => {
      setup({ magic: 1 }, { magic: 2, wall: 4 });
      expectChanges(
        'Unicorn',
        { isActive: false, recruits: -9 },
        { isActive: true, wall: -4, tower: -4 }
      );
    });
  });

  it('Werewolf', () => {
    setup({}, { wall: 4 });
    expectChanges(
      'Werewolf',
      { isActive: false, recruits: -9 },
      { isActive: true, wall: -4, tower: -5 }
    );
  });

  describe('Elven Archers', () => {
    it('if wall > enemy wall', () => {
      setup({ wall: 2 }, { wall: 1 });
      expectChanges(
        'Elven Archers',
        { isActive: false, recruits: -10 },
        { isActive: true, tower: -6 }
      );
    });

    it('if wall = enemy wall', () => {
      setup({ wall: 3 }, { wall: 3 });
      expectChanges(
        'Elven Archers',
        { isActive: false, recruits: -10 },
        { isActive: true, wall: -3, tower: -3 }
      );
    });

    it('if wall < enemy wall', () => {
      setup({ wall: 2 }, { wall: 3 });
      expectChanges(
        'Elven Archers',
        { isActive: false, recruits: -10 },
        { isActive: true, wall: -3, tower: -3 }
      );
    });
  });

  describe('Corrosion Cloud', () => {
    it('if enemy wall = 0', () => {
      setup({}, { wall: 0 });
      expectChanges(
        'Corrosion Cloud',
        { isActive: false, recruits: -11 },
        { isActive: true, tower: -7 }
      );
    });

    it('if enemy wall > 0', () => {
      setup({}, { wall: 5 });
      expectChanges(
        'Corrosion Cloud',
        { isActive: false, recruits: -11 },
        { isActive: true, wall: -5, tower: -5 }
      );
    });
  });

  it('Rock Stompers', () => {
    setup({}, { wall: 4 });
    expectChanges(
      'Rock Stompers',
      { isActive: false, recruits: -11 },
      { isActive: true, quarries: -1, wall: -4, tower: -4 }
    );
  });

  it('Thief', () => {
    setup({}, { gems: 20, bricks: 10 });
    expectChanges(
      'Thief',
      { isActive: false, recruits: -12, gems: +5, bricks: +2 },
      { isActive: true, gems: -10, bricks: -5 }
    );

    setup({}, { gems: 8, bricks: 3 });
    expectChanges(
      'Thief',
      { isActive: false, recruits: -12, gems: +4, bricks: +1 },
      { isActive: true, gems: -8, bricks: -3 }
    );
  });

  it('Warlord', () => {
    setup({}, { wall: 6 });
    expectChanges(
      'Warlord',
      { isActive: false, recruits: -13, gems: -3 },
      { isActive: true, wall: -6, tower: -7 }
    );
  });

  it('Succubus', () => {
    expectChanges(
      'Succubus',
      { isActive: false, recruits: -14 },
      { isActive: true, recruits: -8, tower: -5 }
    );
  });

  it('Stone Giant', () => {
    setup({}, { wall: 5 });
    expectChanges(
      'Stone Giant',
      { isActive: false, recruits: -15, wall: +4 },
      { isActive: true, wall: -5, tower: -5 }
    );
  });

  it('Vampire', () => {
    setup({}, { wall: 5 });
    expectChanges(
      'Vampire',
      { isActive: false, recruits: -17 },
      { isActive: true, recruits: -5, dungeons: -1, wall: -5, tower: -5 }
    );
  });

  it('Pegasus Lancer', () => {
    expectChanges(
      'Pegasus Lancer',
      { isActive: false, recruits: -18 },
      { isActive: true, tower: -12 }
    );
  });

  it('Dragon', () => {
    setup({}, { wall: 10 });
    expectChanges(
      'Dragon',
      { isActive: false, recruits: -25 },
      { isActive: true, gems: -10, dungeons: -1, wall: -10, tower: -10 }
    );
  });
});
