import { GameData, GameEventType, PlayerParams } from '@game';
import { Card, Player } from '@model';
import { GameBot } from './bot';

enum State {
  Win,
  Draw,
  Loss,
  ExtraMove,
  Discarding,
  None,
}

type AppliedCard = {
  index: number;
  isUndiscardable: boolean;
  isUsable: boolean;
  state: State;
  value: number;
};

type Coefs = {
  res: number;
  wall: number;
  tower: number;
  prod: number;
  dmg: number;
};

const COEFS: Readonly<Coefs> = {
  res: 1.01,
  wall: 2.01,
  tower: 3.01,
  prod: 18,
  dmg: 1,
};

export class GreedyBot extends GameBot {
  static create(data: GameData): GreedyBot {
    return new GreedyBot(data);
  }

  private coefs!: Coefs;

  protected pickCard() {
    const cards = this.applyCards();

    if (this.player.isDiscardMode === false) {
      const cardIndex = this.findCardToPlay(cards);

      if (cardIndex >= 0) {
        return {
          type: GameEventType.Card as const,
          isDiscarded: false,
          cardIndex,
        };
      }
    }

    return {
      type: GameEventType.Card as const,
      isDiscarded: true,
      cardIndex: this.findCardToDiscard(cards),
    };
  }

  private applyCards(): AppliedCard[] {
    this.calcCoefs();

    return this.player
      .getCards()
      .map((card, index) => {
        const [player, enemy] = this.applyCard(card);
        const playerVal = this.calcValue(this.getDiff(player, this.player));
        const enemyVal = this.calcValue(this.getDiff(enemy, this.enemy), true);

        return {
          index,
          isUndiscardable: card.isUndiscardable,
          isUsable: this.isUsableCard(card),
          state: this.getState(player, enemy),
          value: playerVal - enemyVal,
        };
      })
      .sort((a, b) => {
        return a.state === b.state ? b.value - a.value : a.state - b.state;
      });
  }

  private applyCard(card: Card): [PlayerParams, PlayerParams] {
    const player = this.player.clone();
    const enemy = this.enemy.clone();

    player[card.cost[1]] = Math.max(player[card.cost[1]], card.cost[0]);

    card.apply(player, enemy);

    player.isWinner = this.victoryChecker.check(player, enemy);
    enemy.isWinner = this.victoryChecker.check(enemy, player);

    return [player, enemy];
  }

  private calcCoefs(): Coefs {
    const { tower: vTower } = this.victoryChecker.getVictoryConditions();
    this.coefs = { ...COEFS };

    if (this.player.tower <= 12) {
      this.coefs.tower = 1e3;
    } else if (this.enemy.tower <= 12 || vTower - this.enemy.tower <= 10) {
      this.coefs.dmg = 2;
    }

    return this.coefs;
  }

  private calcValue(params: PlayerParams, isEnemy: boolean = false): number {
    const { coefs } = this;
    let val = 0;

    val += params.bricks * coefs.res;
    val += params.gems * coefs.res;
    val += params.recruits * coefs.res;
    val += params.quarries * coefs.prod;
    val += params.magic * coefs.prod;
    val += params.dungeons * coefs.prod;
    val += params.tower * coefs.tower * (isEnemy ? coefs.dmg : 1);
    val += params.wall * coefs.wall * (isEnemy ? coefs.dmg : 1);

    return val;
  }

  private getDiff(a: PlayerParams, b: PlayerParams): PlayerParams {
    return {
      isWinner: a.isWinner,
      isActive: a.isActive,
      isDiscardMode: a.isDiscardMode,
      bricks: a.bricks - b.bricks,
      gems: a.gems - b.gems,
      recruits: a.recruits - b.recruits,
      quarries: a.quarries - b.quarries,
      magic: a.magic - b.magic,
      dungeons: a.dungeons - b.dungeons,
      tower: a.tower - b.tower,
      wall: a.wall - b.wall,
    };
  }

  private isUsableCard(card: Card, player: Player = this.player): boolean {
    if (player[card.cost[1]] < card.cost[0]) {
      return false;
    }

    switch (card.name) {
      case 'Brick Shortage':
        return player.bricks > this.enemy.bricks;

      case 'Innovations':
        return player.quarries >= this.enemy.quarries;

      case 'Tremors':
        return player.wall >= this.enemy.wall && this.enemy.wall >= 5;

      case 'Earthquake':
        return player.quarries > this.enemy.quarries;

      case 'Strip Mine':
        return player.quarries === 1 || player.wall === 0;

      case 'Discord':
        return (
          player.tower >= this.enemy.tower && player.magic >= this.enemy.magic
        );

      case 'Mad Cow Disease':
        return player.recruits > this.enemy.recruits;

      case 'Full Moon':
        return player.dungeons > this.enemy.dungeons;

      case 'Power Burn':
        return player.tower > 17;
    }

    return true;
  }

  private getState(player: PlayerParams, enemy: PlayerParams): State {
    switch (true) {
      case player.isWinner && !enemy.isWinner:
        return State.Win;

      case player.isWinner && enemy.isWinner:
        return State.Draw;

      case !player.isWinner && enemy.isWinner:
        return State.Loss;

      case player.isActive:
        return State.ExtraMove;

      case player.isDiscardMode:
        return State.Discarding;

      default:
        return State.None;
    }
  }

  private findCardToPlay(cards: AppliedCard[]): number {
    for (const c of cards) {
      if (
        c.isUsable === false ||
        c.state === State.Loss ||
        (c.state === State.None && c.value < 0)
      ) {
        continue;
      }

      return c.index;
    }

    return -1;
  }

  private findCardToDiscard(cards: AppliedCard[]): number {
    for (let i = cards.length - 1; i >= 0; --i) {
      if (cards[i].isUndiscardable === false) {
        return cards[i].index;
      }
    }

    return -1;
  }
}
