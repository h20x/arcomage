import { rand, shuffle } from '@lib';
import { Card } from './card';
import { CARDS } from './cards';

export class Deck {
  private cards: Card[];

  constructor(cards: Readonly<Card[]> = CARDS) {
    this.cards = shuffle(cards.slice());
  }

  getRandomCards(n: number): Card[] {
    const idx = new Set<number>();

    while (idx.size < n) {
      idx.add(rand(this.cards.length));
    }

    return Array.from(idx, (i) => this.cards[i]);
  }

  getRandomCard(cards: readonly Card[]): Card {
    const cardSet = new Set<Card>(cards);
    let card;

    do {
      card = this.cards[rand(this.cards.length)];
    } while (cardSet.has(card));

    return card;
  }
}
