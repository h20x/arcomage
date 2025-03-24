import {
  CardData,
  CardEvent,
  GameChanges,
  GameData,
  IGameBot,
  PlayerParams,
} from '@game';
import { Publisher } from '@lib';

export abstract class GameBot extends Publisher<CardEvent> implements IGameBot {
  private data: GameData;

  constructor(data: GameData) {
    super();
    this.data = data;
  }

  abstract pickCard(): CardEvent;

  init(): void {
    this.tryPickCard();
  }

  destroy(): void {
    this.unsubscribeAll();
  }

  update(changes: GameChanges): void {
    const { data } = this;
    const { params, newCard, nextRound } = changes;

    Object.assign(data.players[0].params, params[0]);
    Object.assign(data.players[1].params, params[1]);

    if (newCard?.playerIndex === 0) {
      data.players[0].cards[newCard.cardIndex] = newCard.data;
    }

    if (nextRound) {
      Object.assign(data.players[0].params, nextRound.params[0]);
      Object.assign(data.players[1].params, nextRound.params[1]);
    }

    if (nextRound?.newCard?.playerIndex === 0) {
      data.players[0].cards[nextRound.newCard.cardIndex] =
        nextRound.newCard.data;
    }

    this.tryPickCard();
  }

  protected params(): Readonly<PlayerParams> {
    return this.data.players[0].params;
  }

  protected enemyParams(): Readonly<PlayerParams> {
    return this.data.players[1].params;
  }

  protected cards(): Readonly<Readonly<CardData>[]> {
    return this.data.players[0].cards as CardData[];
  }

  protected getUsableCards(): [Readonly<CardData>, number][] {
    return this.cards()
      .map<[CardData, number]>((card, index) => [card!, index])
      .filter(([card]) => this.canUse(card));
  }

  private tryPickCard(): void {
    if (this.params().isActive) {
      queueMicrotask(() => this.notify(this.pickCard()));
    }
  }

  private canUse(card: CardData): boolean {
    return this.params()[card.cost[1]] >= card.cost[0];
  }
}
