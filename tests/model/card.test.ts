import { BrickCard, GemCard, Player, RecruitCard } from '@model';

describe('Card', () => {
  it('should be used only if the player has enough resources', () => {
    const player = new Player({ bricks: 2, gems: 4, recruits: 8 });
    const enemy = new Player();

    expect(new BrickCard({ cost: 4 }).apply(player, enemy)).toBe(false);
    expect(new BrickCard({ cost: 2 }).apply(player, enemy)).toBe(true);

    expect(new GemCard({ cost: 8 }).apply(player, enemy)).toBe(false);
    expect(new GemCard({ cost: 4 }).apply(player, enemy)).toBe(true);

    expect(new RecruitCard({ cost: 16 }).apply(player, enemy)).toBe(false);
    expect(new RecruitCard({ cost: 8 }).apply(player, enemy)).toBe(true);
  });

  it('negative cost should be converted to 0', () => {
    expect(new BrickCard({ cost: -1 }).cost).toBe(0);
  });
});
