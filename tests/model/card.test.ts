import { Card, Player } from '@model';

describe('Card', () => {
  it('should be used only if the player has enough resources', () => {
    const player = new Player({ bricks: 2, gems: 4, recruits: 8 });
    const enemy = new Player();

    expect(new Card({ cost: [4, 'bricks'] }).apply(player, enemy)).toBe(false);
    expect(new Card({ cost: [2, 'bricks'] }).apply(player, enemy)).toBe(true);

    expect(new Card({ cost: [8, 'gems'] }).apply(player, enemy)).toBe(false);
    expect(new Card({ cost: [4, 'gems'] }).apply(player, enemy)).toBe(true);

    expect(new Card({ cost: [16, 'recruits'] }).apply(player, enemy)).toBe(
      false
    );
    expect(new Card({ cost: [8, 'recruits'] }).apply(player, enemy)).toBe(true);
  });

  it('negative cost should be converted to 0', () => {
    expect(new Card({ cost: [-1, 'bricks'] }).cost).toEqual([0, 'bricks']);
  });
});
