import { rand } from '@lib';
import { GameBot } from './bot';

export class RandomBot extends GameBot {
  pickCard() {
    const usableCards = this.getUsableCards();

    if (usableCards.length) {
      const i = rand(usableCards.length);

      return {
        isDiscarded: false,
        cardIndex: usableCards[i][1],
      };
    }

    const cards = this.cards();
    let index = rand(cards.length);

    while (cards[index].isUndiscardable) {
      index = ++index % cards.length;
    }

    return {
      isDiscarded: true,
      cardIndex: index,
    };
  }
}
