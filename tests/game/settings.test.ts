import { validatePreset } from '@game';

describe('validatePreset', () => {
  it('should set min values', () => {
    expect(
      validatePreset({
        tower: -1,
        wall: -1,
        quarries: -1,
        magic: -1,
        dungeons: -1,
        bricks: -1,
        gems: -1,
        recruits: -1,
        towerVictory: -1,
        resourceVictory: -1,
      })
    ).toEqual({
      tower: 5,
      wall: 0,
      quarries: 1,
      magic: 1,
      dungeons: 1,
      bricks: 0,
      gems: 0,
      recruits: 0,
      towerVictory: 30,
      resourceVictory: 100,
    });
  });

  it('should set max values', () => {
    const max = Number.MAX_SAFE_INTEGER;

    expect(
      validatePreset({
        tower: max,
        wall: max,
        quarries: max,
        magic: max,
        dungeons: max,
        bricks: max,
        gems: max,
        recruits: max,
        towerVictory: max,
        resourceVictory: max,
      })
    ).toEqual({
      tower: 50,
      wall: 50,
      quarries: 5,
      magic: 5,
      dungeons: 5,
      bricks: 50,
      gems: 50,
      recruits: 50,
      towerVictory: 999,
      resourceVictory: 999,
    });
  });

  it('tower should be lower than towerVictory', () => {
    const preset = validatePreset({
      tower: 50,
      towerVictory: 40,
      wall: 0,
      quarries: 0,
      magic: 0,
      dungeons: 0,
      bricks: 0,
      gems: 0,
      recruits: 0,
      resourceVictory: 0,
    });

    expect(preset.tower).toBe(preset.towerVictory - 1);
  });
});
