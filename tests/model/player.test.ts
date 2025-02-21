import { getCard, Player } from '@model';

describe('Player', () => {
  it('should check input params', () => {
    const player = new Player({
      quarries: 0,
      magic: -1,
      dungeons: -2,
      bricks: -1,
      gems: -2,
      recruits: -3,
      tower: -1,
      wall: -2,
    });

    expect(player.quarries).toBe(1);
    expect(player.magic).toBe(1);
    expect(player.dungeons).toBe(1);
    expect(player.bricks).toBe(0);
    expect(player.gems).toBe(0);
    expect(player.recruits).toBe(0);
    expect(player.tower).toBe(0);
    expect(player.wall).toBe(0);

    player.quarries = 0;
    player.magic = -1;
    player.dungeons = -2;
    player.bricks = -1;
    player.gems = -2;
    player.recruits = -3;
    player.tower = -1;
    player.wall = -2;

    expect(player.quarries).toBe(1);
    expect(player.magic).toBe(1);
    expect(player.dungeons).toBe(1);
    expect(player.bricks).toBe(0);
    expect(player.gems).toBe(0);
    expect(player.recruits).toBe(0);
    expect(player.tower).toBe(0);
    expect(player.wall).toBe(0);
  });

  it('should be able to set new cards', () => {
    const player = new Player({}, [
      getCard('Brick Shortage'),
      getCard('Brick Shortage'),
    ]);

    player.setCard(0, getCard('Earthquake'));
    expect(player.getCard(0)).toBe(getCard('Earthquake'));

    player.setCard(1, getCard('Dragon'));
    expect(player.getCard(1)).toBe(getCard('Dragon'));
  });

  it('should check if a card with the given index exists', () => {
    const player = new Player({}, [getCard('Dragon'), getCard('Dragon')]);

    expect(player.hasCard(-1)).toBe(false);
    expect(player.hasCard(2)).toBe(false);
  });

  it('diff', () => {
    const player1 = new Player({
      isActive: false,
      bricks: 8,
      gems: 8,
      recruits: 8,
      quarries: 4,
      magic: 4,
      dungeons: 4,
      tower: 16,
      wall: 16,
    });
    const player2 = new Player({
      isActive: true,
      bricks: 16,
      gems: 8,
      recruits: 8,
      quarries: 4,
      magic: 8,
      dungeons: 4,
      tower: 32,
      wall: 16,
    });

    expect(Player.diff(player1, player2)).toEqual({
      isActive: true,
      bricks: 16,
      magic: 8,
      tower: 32,
    });
  });
});
