import {
  CardData,
  CardType,
  GameChanges,
  GameData,
  IGameBot,
  PlayerEvent,
  PlayerParams,
} from '@app';
import { Publisher } from '@lib';

export abstract class GameBot
  extends Publisher<PlayerEvent>
  implements IGameBot
{
  private data!: GameData;

  abstract pickCard(): PlayerEvent;

  init(data: GameData): void {
    this.data = data;
    this.tryPickCard();
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
    switch (card.type) {
      case CardType.Brick:
        return this.params().bricks >= card.cost;

      case CardType.Gem:
        return this.params().gems >= card.cost;

      case CardType.Recruit:
        return this.params().recruits >= card.cost;
    }
  }
}
