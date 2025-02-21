import { BrickCard, Deck, GemCard, RecruitCard } from '@model';

describe('Deck', () => {
  it('should return n cards', () => {
    const deck = new Deck([new BrickCard(), new GemCard(), new RecruitCard()]);

    expect(deck.getRandomCards(1)).toHaveLength(1);
    expect(deck.getRandomCards(3)).toHaveLength(3);
  });
});
