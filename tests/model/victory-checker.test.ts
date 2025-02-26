import { PlayerParams } from '@game';
import { Player, VictoryChecker } from '@model';

describe('VictoryChecker', () => {
  it('should return true if the player parameters match the victory condition, false otherwise', () => {
    const vc = new VictoryChecker({ tower: 16, resource: 32 });

    (
      [
        [{ bricks: 1, gems: 1, recruits: 1, tower: 1 }, false],
        [{ bricks: 1, gems: 1, recruits: 1, tower: 16 }, true],
        [{ bricks: 1, gems: 1, recruits: 1, tower: 32 }, true],
        [{ bricks: 32, gems: 1, recruits: 1, tower: 1 }, true],
        [{ bricks: 1, gems: 64, recruits: 1, tower: 1 }, true],
        [{ bricks: 1, gems: 1, recruits: 128, tower: 1 }, true],
      ] as [PlayerParams, boolean][]
    ).forEach(([params, expected]) => {
      const player = new Player(params);
      const enemy = new Player({
        tower: 1,
        bricks: 0,
        gems: 0,
        recruits: 0,
      });

      expect(vc.check(player, enemy)).toBe(expected);
    });
  });

  it('should return true if the enemy tower is destroyed', () => {
    const vc = new VictoryChecker({ tower: 16, resource: 32 });
    const player = new Player({ tower: 1 });
    const enemy = new Player({ tower: 0 });

    expect(vc.check(player, enemy)).toBe(true);
  });
});
