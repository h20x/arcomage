import { Card } from './card';
import { Player } from './player';

const damage = (player: Player, val: number): void => {
  const wallDmg = Math.max(0, val);
  const towerDmg = Math.max(0, wallDmg - player.wall);
  player.wall -= wallDmg;
  player.tower -= towerDmg;
};

export const CARDS = [
  new Card({
    name: 'Brick Shortage',
    desc: '-8 Bricks\nfor each player',
    cost: [0, 'bricks'],
    applyFn: (player, enemy) => {
      player.bricks += -8;
      enemy.bricks += -8;
    },
  }),

  new Card({
    name: 'Earthquake',
    desc: '-1 Quarry\nfor each player',
    cost: [0, 'bricks'],
    applyFn: (player, enemy) => {
      player.quarries += -1;
      enemy.quarries += -1;
    },
  }),

  new Card({
    name: 'Lucky Cache',
    desc: '+2 Bricks\n+2 Gems\nPlay again',
    cost: [0, 'bricks'],
    applyFn: (player, enemy) => {
      player.bricks += 2;
      player.gems += 2;

      return true;
    },
  }),

  new Card({
    name: 'Strip Mine',
    desc: '-1 Quarry\n+10 Wall\n+5 Gems',
    cost: [0, 'bricks'],
    applyFn: (player) => {
      player.quarries += -1;
      player.wall += 10;
      player.gems += 5;
    },
  }),

  new Card({
    name: 'Rock Garden',
    desc: '+1 Wall\n+1 Tower\n+2 Recruits',
    cost: [1, 'bricks'],
    applyFn: (player) => {
      player.wall += 1;
      player.tower += 1;
      player.recruits += 2;
    },
  }),

  new Card({
    name: 'Friendly Terrain',
    desc: '+1 Wall\nPlay again',
    cost: [1, 'bricks'],
    applyFn: (player, enemy) => {
      player.wall += 1;

      return true;
    },
  }),

  new Card({
    name: 'Work Overtime',
    desc: '+5 Wall\n-6 Gems',
    cost: [2, 'bricks'],
    applyFn: (player) => {
      player.wall += 5;
      player.gems += -6;
    },
  }),

  new Card({
    name: 'Basic Wall',
    desc: '+3 Wall',
    cost: [2, 'bricks'],
    applyFn: (player) => {
      player.wall += 3;
    },
  }),

  new Card({
    name: 'Innovations',
    desc: '+1 Quarry\nfor each player\n+4 Gems',
    cost: [2, 'bricks'],
    applyFn: (player, enemy) => {
      player.quarries += 1;
      player.gems += 4;
      enemy.quarries += 1;
    },
  }),

  new Card({
    name: 'Foundations',
    desc: 'If wall = 0\n+6 Wall\nelse\n+3 Wall',
    cost: [3, 'bricks'],
    applyFn: (player) => {
      player.wall += player.wall === 0 ? 6 : 3;
    },
  }),

  new Card({
    name: 'Miners',
    desc: '+1 Quarry',
    cost: [3, 'bricks'],
    applyFn: (player) => {
      player.quarries += 1;
    },
  }),

  new Card({
    name: 'Sturdy Wall',
    desc: '+4 Wall',
    cost: [3, 'bricks'],
    applyFn: (player) => {
      player.wall += 4;
    },
  }),

  new Card({
    name: 'Mother Lode',
    desc: 'If quarry < enemy quarry\n+2 Quarry\nelse\n+1 Quarry',
    cost: [4, 'bricks'],
    applyFn: (player, enemy) => {
      player.quarries += player.quarries < enemy.quarries ? 2 : 1;
    },
  }),

  new Card({
    name: 'Collapse!',
    desc: '-1 Enemy quarry',
    cost: [4, 'bricks'],
    applyFn: (player, enemy) => {
      enemy.quarries += -1;
    },
  }),

  new Card({
    name: 'Big Wall',
    desc: '+6 Wall',
    cost: [5, 'bricks'],
    applyFn: (player) => {
      player.wall += 6;
    },
  }),

  new Card({
    name: 'Copping the Tech',
    desc: 'If quarry < enemy quarry\nquarry = enemy quarry',
    cost: [5, 'bricks'],
    applyFn: (player, enemy) => {
      if (player.quarries < enemy.quarries) {
        player.quarries = enemy.quarries;
      }
    },
  }),

  new Card({
    name: 'Flood Water',
    desc: 'Player(s)\nwith lowest wall\n-1 Dungeon\n-2 Tower',
    cost: [6, 'bricks'],
    applyFn: (player, enemy) => {
      if (player.wall <= enemy.wall) {
        player.dungeons += -1;
        player.tower += -2;
      }

      if (enemy.wall <= player.wall) {
        enemy.dungeons += -1;
        enemy.tower += -2;
      }
    },
  }),

  new Card({
    name: 'New Equipment',
    desc: '+2 Quarry',
    cost: [6, 'bricks'],
    applyFn: (player) => {
      player.quarries += 2;
    },
  }),

  new Card({
    name: 'Forced Labor',
    desc: '+9 Wall\n-5 Recruits',
    cost: [7, 'bricks'],
    applyFn: (player) => {
      player.wall += 9;
      player.recruits += -5;
    },
  }),

  new Card({
    name: 'Dwarven Miners',
    desc: '+4 Wall\n+1 Quarry',
    cost: [7, 'bricks'],
    applyFn: (player) => {
      player.wall += 4;
      player.quarries += 1;
    },
  }),

  new Card({
    name: 'Tremors',
    desc: '-5 Wall\nfor each player\nPlay again',
    cost: [7, 'bricks'],
    applyFn: (player, enemy) => {
      player.wall += -5;
      enemy.wall += -5;

      return true;
    },
  }),

  new Card({
    name: 'Secret Room',
    desc: '+1 Magic\nPlay again',
    cost: [8, 'bricks'],
    applyFn: (player, enemy) => {
      player.magic += 1;

      return true;
    },
  }),

  new Card({
    name: 'Reinforced Wall',
    desc: '+8 Wall',
    cost: [8, 'bricks'],
    applyFn: (player) => {
      player.wall += 8;
    },
  }),

  new Card({
    name: 'Porticulus',
    desc: '+5 Wall\n+1 Dungeon',
    cost: [9, 'bricks'],
    applyFn: (player) => {
      player.wall += 5;
      player.dungeons += 1;
    },
  }),

  new Card({
    name: 'Crystal Rocks',
    desc: '+7 Wall\n+7 Gems',
    cost: [9, 'bricks'],
    applyFn: (player) => {
      player.wall += 7;
      player.gems += 7;
    },
  }),

  new Card({
    name: 'Barracks',
    desc: '+6 Recruits\n+6 Wall\nIf dungeon < enemy dungeon\n+1 Dungeon',
    cost: [10, 'bricks'],
    applyFn: (player, enemy) => {
      player.recruits += 6;
      player.wall += 6;

      if (player.dungeons < enemy.dungeons) {
        player.dungeons += 1;
      }
    },
  }),

  new Card({
    name: 'Harmonic Ore',
    desc: '+6 Wall\n+3 Tower',
    cost: [11, 'bricks'],
    applyFn: (player) => {
      player.wall += 6;
      player.tower += 3;
    },
  }),

  new Card({
    name: 'Mondo Wall',
    desc: '+12 Wall',
    cost: [12, 'bricks'],
    applyFn: (player) => {
      player.wall += 12;
    },
  }),

  new Card({
    name: 'Battlements',
    desc: '+7 Wall\n6 Damage',
    cost: [14, 'bricks'],
    applyFn: (player, enemy) => {
      player.wall += 7;
      damage(enemy, 6);
    },
  }),

  new Card({
    name: 'Focused Designs',
    desc: '+8 Wall\n+5 Tower',
    cost: [15, 'bricks'],
    applyFn: (player) => {
      player.wall += 8;
      player.tower += 5;
    },
  }),

  new Card({
    name: 'Great Wall',
    desc: '+15 Wall',
    cost: [16, 'bricks'],
    applyFn: (player) => {
      player.wall += 15;
    },
  }),

  new Card({
    name: 'Shift',
    desc: 'Switch you wall\nwith enemy wall',
    cost: [17, 'bricks'],
    applyFn: (player, enemy) => {
      [player.wall, enemy.wall] = [enemy.wall, player.wall];
    },
  }),

  new Card({
    name: 'Rock Launcher',
    desc: '+6 Wall\n10 Damage',
    cost: [18, 'bricks'],
    applyFn: (player, enemy) => {
      player.wall += 6;
      damage(enemy, 10);
    },
  }),

  new Card({
    name: "Dragon's Heart",
    desc: '+20 Wall\n+8 Tower',
    cost: [24, 'bricks'],
    applyFn: (player) => {
      player.wall += 20;
      player.tower += 8;
    },
  }),

  new Card({
    name: 'Bag of Baubles',
    desc: 'If tower < enemy tower\n+2 Tower\nelse\n+1 Tower',
    cost: [0, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += player.tower < enemy.tower ? 2 : 1;
    },
  }),

  new Card({
    name: 'Rainbow',
    desc: '+1 Tower\nfor each player\n+3 Gems',
    cost: [0, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 1;
      player.gems += 3;
      enemy.tower += 1;
    },
  }),

  new Card({
    name: 'Quartz',
    desc: '+1 Tower\nPlay again',
    cost: [1, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 1;

      return true;
    },
  }),

  new Card({
    name: 'Smoky Quartz',
    desc: '-1 Enemy tower\nPlay again',
    cost: [2, 'gems'],
    applyFn: (player, enemy) => {
      enemy.tower += -1;

      return true;
    },
  }),

  new Card({
    name: 'Amethyst',
    desc: '+3 Tower',
    cost: [2, 'gems'],
    applyFn: (player) => {
      player.tower += 3;
    },
  }),

  new Card({
    name: 'Prism',
    desc: 'Draw 1 card\nDiscard 1 card\nPlay again',
    cost: [2, 'gems'],
    applyFn: (player, enemy) => {
      player.isDiscardMode = true;

      return true;
    },
  }),

  new Card({
    name: 'Gemstone Flaw',
    desc: '-3 Enemy tower',
    cost: [2, 'gems'],
    applyFn: (player, enemy) => {
      enemy.tower += -3;
    },
  }),

  new Card({
    name: 'Spell Weavers',
    desc: '+1 Magic',
    cost: [3, 'gems'],
    applyFn: (player) => {
      player.magic += 1;
    },
  }),

  new Card({
    name: 'Ruby',
    desc: '+5 Tower',
    cost: [3, 'gems'],
    applyFn: (player) => {
      player.tower += 5;
    },
  }),

  new Card({
    name: 'Power Burn',
    desc: '-5 Tower\n+2 Magic',
    cost: [3, 'gems'],
    applyFn: (player) => {
      player.tower += -5;
      player.magic += 2;
    },
  }),

  new Card({
    name: 'Gem Spear',
    desc: '-5 Enemy tower',
    cost: [4, 'gems'],
    applyFn: (player, enemy) => {
      enemy.tower += -5;
    },
  }),

  new Card({
    name: 'Solar Flare',
    desc: '+2 Tower\n-2 Enemy tower',
    cost: [4, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 2;
      enemy.tower += -2;
    },
  }),

  new Card({
    name: "Quarry's Help",
    desc: '+7 Tower\n-10 Bricks',
    cost: [4, 'gems'],
    applyFn: (player) => {
      player.tower += 7;
      player.bricks += -10;
    },
  }),

  new Card({
    name: 'Apprentice',
    desc: '+4 Tower\n-3 Recruits\n-2 Enemy tower',
    cost: [5, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 4;
      player.recruits += -3;
      enemy.tower += -2;
    },
  }),

  new Card({
    name: 'Lodestone',
    desc: "+3 Tower. This card can't be discarded without playing it",
    cost: [5, 'gems'],
    isUndiscardable: true,
    applyFn: (player) => {
      player.tower += 3;
    },
  }),

  new Card({
    name: 'Discord',
    desc: '-7 Tower and\n-1 magic\nfor each player',
    cost: [5, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += -7;
      player.magic += -1;
      enemy.tower += -7;
      enemy.magic += -1;
    },
  }),

  new Card({
    name: 'Crystal Matrix',
    desc: '+1 Magic\n+3 Tower\n+1 Enemy tower',
    cost: [6, 'gems'],
    applyFn: (player, enemy) => {
      player.magic += 1;
      player.tower += 3;
      enemy.tower += 1;
    },
  }),

  new Card({
    name: 'Emerald',
    desc: '+8 Tower',
    cost: [6, 'gems'],
    applyFn: (player) => {
      player.tower += 8;
    },
  }),

  new Card({
    name: 'Crumblestone',
    desc: '+5 Tower\n-6 Enemy bricks',
    cost: [7, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 5;
      enemy.bricks += -6;
    },
  }),

  new Card({
    name: 'Harmonic Vibe',
    desc: '+1 Magic\n+3 Tower\n+3 Wall',
    cost: [7, 'gems'],
    applyFn: (player) => {
      player.magic += 1;
      player.tower += 3;
      player.wall += 3;
    },
  }),

  new Card({
    name: 'Parity',
    desc: "All player's magic\nequals the highest\nplayer's magic",
    cost: [7, 'gems'],
    applyFn: (player, enemy) => {
      player.magic = enemy.magic = Math.max(player.magic, enemy.magic);
    },
  }),

  new Card({
    name: 'Crystallize',
    desc: '+11 Tower\n-6 Wall',
    cost: [8, 'gems'],
    applyFn: (player) => {
      player.tower += 11;
      player.wall += -6;
    },
  }),

  new Card({
    name: 'Shatterer',
    desc: '-1 Magic\n-9 Enemy tower',
    cost: [8, 'gems'],
    applyFn: (player, enemy) => {
      player.magic += -1;
      enemy.tower += -9;
    },
  }),

  new Card({
    name: 'Pearl of Wisdom',
    desc: '+5 Tower\n+1 Magic',
    cost: [9, 'gems'],
    applyFn: (player) => {
      player.tower += 5;
      player.magic += 1;
    },
  }),

  new Card({
    name: 'Sapphire',
    desc: '+11 Tower',
    cost: [10, 'gems'],
    applyFn: (player) => {
      player.tower += 11;
    },
  }),

  new Card({
    name: 'Lightning Shard',
    desc: 'If tower > enemy wall\n-8 Enemy tower\nelse\n8 Damage',
    cost: [11, 'gems'],
    applyFn: (player, enemy) => {
      if (player.tower > enemy.wall) {
        enemy.tower += -8;
      } else {
        damage(enemy, 8);
      }
    },
  }),

  new Card({
    name: 'Crystal Shield',
    desc: '+8 Tower\n+3 Wall',
    cost: [12, 'gems'],
    applyFn: (player) => {
      player.tower += 8;
      player.wall += 3;
    },
  }),

  new Card({
    name: 'Fire Ruby',
    desc: '+6 Tower\n-4 Enemy tower',
    cost: [13, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 6;
      enemy.tower += -4;
    },
  }),

  new Card({
    name: 'Empathy Gem',
    desc: '+8 Tower\n+1 Dungeon',
    cost: [14, 'gems'],
    applyFn: (player) => {
      player.tower += 8;
      player.dungeons += 1;
    },
  }),

  new Card({
    name: 'Sanctuary',
    desc: '+10 Tower\n+5 Wall\n+5 Recruits',
    cost: [15, 'gems'],
    applyFn: (player) => {
      player.tower += 10;
      player.wall += 5;
      player.recruits += 5;
    },
  }),

  new Card({
    name: 'Diamond',
    desc: '+15 Tower',
    cost: [16, 'gems'],
    applyFn: (player) => {
      player.tower += 15;
    },
  }),

  new Card({
    name: 'Lava Jewel',
    desc: '+12 Tower\n6 Damage',
    cost: [17, 'gems'],
    applyFn: (player, enemy) => {
      player.tower += 12;
      damage(enemy, 6);
    },
  }),

  new Card({
    name: 'Phase Jewel',
    desc: '+13 Tower\n+6 Recruits\n+6 Bricks',
    cost: [18, 'gems'],
    applyFn: (player) => {
      player.tower += 13;
      player.recruits += 6;
      player.bricks += 6;
    },
  }),

  new Card({
    name: "Dragon's Eye",
    desc: '+20 Tower',
    cost: [21, 'gems'],
    applyFn: (player) => {
      player.tower += 20;
    },
  }),

  new Card({
    name: 'Mad Cow Disease',
    desc: '-6 Recruits\nfor each player',
    cost: [0, 'recruits'],
    applyFn: (player, enemy) => {
      player.recruits += -6;
      enemy.recruits += -6;
    },
  }),

  new Card({
    name: 'Full Moon',
    desc: '+1 Dungeon\nfor each player\n+3 Recruits',
    cost: [0, 'recruits'],
    applyFn: (player, enemy) => {
      player.dungeons += 1;
      player.recruits += 3;
      enemy.dungeons += 1;
    },
  }),

  new Card({
    name: 'Faerie',
    desc: '2 Damage\nPlay again',
    cost: [1, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, 2);

      return true;
    },
  }),

  new Card({
    name: 'Moody Goblins',
    desc: '4 Damage\n-3 Gems',
    cost: [1, 'recruits'],
    applyFn: (player, enemy) => {
      player.gems += -3;
      damage(enemy, 4);
    },
  }),

  new Card({
    name: 'Spearman',
    desc: 'If wall > enemy wall\n3 Damage\nelse\n2 Damage',
    cost: [2, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, player.wall > enemy.wall ? 3 : 2);
    },
  }),

  new Card({
    name: 'Gnome',
    desc: '3 Damage\n+1 Gem',
    cost: [2, 'recruits'],
    applyFn: (player, enemy) => {
      player.gems += 1;
      damage(enemy, 3);
    },
  }),

  new Card({
    name: 'Elven Scout',
    desc: 'Draw 1 card\nDiscard 1 card\nPlay again',
    cost: [2, 'recruits'],
    applyFn: (player, enemy) => {
      player.isDiscardMode = true;

      return true;
    },
  }),

  new Card({
    name: 'Orc',
    desc: '5 Damage',
    cost: [3, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, 5);
    },
  }),

  new Card({
    name: 'Minotaur',
    desc: '+1 Dungeon',
    cost: [3, 'recruits'],
    applyFn: (player) => {
      player.dungeons += 1;
    },
  }),

  new Card({
    name: 'Goblin Mob',
    desc: '6 Damage\nYou take 3 damage',
    cost: [3, 'recruits'],
    applyFn: (player, enemy) => {
      damage(player, 3);
      damage(enemy, 6);
    },
  }),

  new Card({
    name: 'Berserker',
    desc: '8 Damage\n-3 Tower',
    cost: [4, 'recruits'],
    applyFn: (player, enemy) => {
      player.tower += -3;
      damage(enemy, 8);
    },
  }),

  new Card({
    name: 'Goblin Archers',
    desc: '-3 Enemy tower\nYou take 1 damage',
    cost: [4, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.tower += -3;
      damage(player, 1);
    },
  }),

  new Card({
    name: 'Dwarves',
    desc: '4 Damage\n+3 Wall',
    cost: [5, 'recruits'],
    applyFn: (player, enemy) => {
      player.wall += 3;
      damage(enemy, 4);
    },
  }),

  new Card({
    name: 'Imp',
    desc: '6 Damage\n-5 Bricks, gems\nand recruits\nfor each player',
    cost: [5, 'recruits'],
    applyFn: (player, enemy) => {
      player.bricks += -5;
      player.gems += -5;
      player.recruits += -5;
      enemy.bricks += -5;
      enemy.gems += -5;
      enemy.recruits += -5;
      damage(enemy, 6);
    },
  }),

  new Card({
    name: 'Slasher',
    desc: '6 Damage',
    cost: [5, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, 6);
    },
  }),

  new Card({
    name: 'Shadow Faerie',
    desc: '-2 Enemy tower\nPlay again',
    cost: [6, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.tower += -2;

      return true;
    },
  }),

  new Card({
    name: 'Ogre',
    desc: '7 Damage',
    cost: [6, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, 7);
    },
  }),

  new Card({
    name: 'Little Snakes',
    desc: '-4 Enemy tower',
    cost: [6, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.tower += -4;
    },
  }),

  new Card({
    name: 'Rabid Sheep',
    desc: '6 Damage\n-3 Enemy recruits',
    cost: [6, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.recruits += -3;
      damage(enemy, 6);
    },
  }),

  new Card({
    name: 'Troll Trainer',
    desc: '+2 Dungeon',
    cost: [7, 'recruits'],
    applyFn: (player, enemy) => {
      player.dungeons += 2;
    },
  }),

  new Card({
    name: 'Tower Gremlin',
    desc: '2 Damage\n+4 Wall\n+2 Tower',
    cost: [8, 'recruits'],
    applyFn: (player, enemy) => {
      player.wall += 4;
      player.tower += 2;
      damage(enemy, 2);
    },
  }),

  new Card({
    name: 'Spizzer',
    desc: 'If enemy wall = 0\n10 Damage\nelse\n6 Damage',
    cost: [8, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, enemy.wall === 0 ? 10 : 6);
    },
  }),

  new Card({
    name: 'Unicorn',
    desc: 'If magic > enemy magic\n12 Damage\nelse\n8 Damage',
    cost: [9, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, player.magic > enemy.magic ? 12 : 8);
    },
  }),

  new Card({
    name: 'Werewolf',
    desc: '9 Damage',
    cost: [9, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, 9);
    },
  }),

  new Card({
    name: 'Elven Archers',
    desc: 'If wall > enemy wall\n-6 Enemy tower\nelse\n6 Damage',
    cost: [10, 'recruits'],
    applyFn: (player, enemy) => {
      if (player.wall > enemy.wall) {
        enemy.tower += -6;
      } else {
        damage(enemy, 6);
      }
    },
  }),

  new Card({
    name: 'Corrosion Cloud',
    desc: 'If enemy wall > 0\n10 Damage\nelse\n7 Damage',
    cost: [11, 'recruits'],
    applyFn: (player, enemy) => {
      damage(enemy, enemy.wall > 0 ? 10 : 7);
    },
  }),

  new Card({
    name: 'Rock Stompers',
    desc: '8 Damage\n-1 Enemy quarry',
    cost: [11, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.quarries += -1;
      damage(enemy, 8);
    },
  }),

  new Card({
    name: 'Thief',
    desc: '-10 Enemy gems and\n5 bricks\n+1/2 From\nenemy losses',
    cost: [12, 'recruits'],
    applyFn: (player, enemy) => {
      const gems = Math.min(enemy.gems, 10);
      const bricks = Math.min(enemy.bricks, 5);
      player.gems += Math.floor(gems / 2);
      player.bricks += Math.floor(bricks / 2);
      enemy.gems += -gems;
      enemy.bricks += -bricks;
    },
  }),

  new Card({
    name: 'Warlord',
    desc: '13 Damage\n-3 Gems',
    cost: [13, 'recruits'],
    applyFn: (player, enemy) => {
      player.gems += -3;
      damage(enemy, 13);
    },
  }),

  new Card({
    name: 'Succubus',
    desc: '-5 Enemy tower\n-8 Enemy recruits',
    cost: [14, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.tower += -5;
      enemy.recruits += -8;
    },
  }),

  new Card({
    name: 'Stone Giant',
    desc: '10 Damage\n+4 Wall',
    cost: [15, 'recruits'],
    applyFn: (player, enemy) => {
      player.wall += 4;
      damage(enemy, 10);
    },
  }),

  new Card({
    name: 'Vampire',
    desc: '10 Damage\n-5 Enemy recruits\n-1 Enemy dungeon',
    cost: [17, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.recruits += -5;
      enemy.dungeons += -1;
      damage(enemy, 10);
    },
  }),

  new Card({
    name: 'Pegasus Lancer',
    desc: '-12 Enemy tower',
    cost: [18, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.tower += -12;
    },
  }),

  new Card({
    name: 'Dragon',
    desc: '20 Damage\n-10 Enemy gems\n-1 Enemy dungeon',
    cost: [25, 'recruits'],
    applyFn: (player, enemy) => {
      enemy.gems += -10;
      enemy.dungeons += -1;
      damage(enemy, 20);
    },
  }),
] as Readonly<Card[]>;

const CARD_MAP = new Map() as Map<string, Card>;

CARDS.forEach((card) => CARD_MAP.set(card.name, card));

export function getCard(name: string): Card {
  return CARD_MAP.get(name)!;
}
