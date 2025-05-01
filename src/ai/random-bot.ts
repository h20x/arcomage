import { GameData, GameEventType } from '@game';
import { rand } from '@lib';
import { Card } from '@model';
import { GameBot } from './bot';

export class RandomBot extends GameBot {
  static create(data: GameData): RandomBot {
    return new RandomBot(data);
  }

  protected pickCard() {
    const usableCards = this.getUsableCards();

    if (this.player.isDiscardMode === false && usableCards.length) {
      const i = rand(usableCards.length);

      return {
        type: GameEventType.Card as const,
        isDiscarded: false,
        cardIndex: usableCards[i][1],
      };
    }

    const cards = this.player.getCards();
    let index = rand(cards.length);

    while (cards[index].isUndiscardable) {
      index = ++index % cards.length;
    }

    return {
      type: GameEventType.Card as const,
      isDiscarded: true,
      cardIndex: index,
    };
  }

  private getUsableCards(): [Card, number][] {
    return this.player
      .getCards()
      .map<[Card, number]>((card, index) => [card, index])
      .filter(([card]) => this.player[card.cost[1]] >= card.cost[0]);
  }
}
