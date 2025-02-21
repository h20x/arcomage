import { Player } from './player';

export type VictoryConditions = {
  tower: number;
  resource: number;
};

export class VictoryChecker {
  private victoryConditions: VictoryConditions;

  constructor(condition: VictoryConditions) {
    this.victoryConditions = { ...condition };
  }

  check(player: Player, enemy: Player): boolean {
    const { bricks, gems, recruits, tower } = player;
    const { resource, tower: _tower } = this.victoryConditions;

    return (
      enemy.tower === 0 ||
      bricks >= resource ||
      gems >= resource ||
      recruits >= resource ||
      tower >= _tower
    );
  }

  getVictoryConditions(): VictoryConditions {
    return { ...this.victoryConditions };
  }
}
