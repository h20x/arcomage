import { rand, shuffle } from '@lib';
import { Card } from './card';

export class Deck {
  private cards: Card[];

  constructor(cards: Readonly<Card[]> = []) {
    this.cards = shuffle(cards.slice());
  }

  getRandomCards(n: number): Card[] {
    const idx = new Set<number>();

    while (idx.size < n) {
      idx.add(rand(this.cards.length));
    }

    return Array.from(idx, (i) => this.cards[i]);
  }
}
