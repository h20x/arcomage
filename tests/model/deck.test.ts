import { Card, Deck } from '@model';

describe('Deck', () => {
  it('should return n cards', () => {
    const deck = new Deck([new Card(), new Card(), new Card()]);

    expect(deck.getRandomCards(1)).toHaveLength(1);
    expect(deck.getRandomCards(3)).toHaveLength(3);
  });
});
