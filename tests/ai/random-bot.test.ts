import { RandomBot } from '@ai';
import { CardEvent, PlayerParams, UsedCard, VictoryConditions } from '@game';
import { getCard } from '@model';

describe('RandomBot', () => {
  it('should pick a card if the bot is active', async () => {
    const bot = new RandomBot({
      players: [
        {
          params: {
            isActive: false,
            bricks: 64,
            gems: 64,
            recruits: 64,
          } as PlayerParams,
          cards: [
            'Innovations',
            'Foundations',
            'Miners',
            'Collapse!',
            'Tremors',
            'Porticulus',
          ].map((name) => getCard(name).getData()),
        },
        { params: {} as PlayerParams, cards: [] },
      ],
      victoryConditions: {} as VictoryConditions,
    });
    const subscriber = jest.fn((e: CardEvent) => {});
    bot.subscribe(subscriber);
    bot.init();

    await Promise.resolve();
    expect(subscriber).not.toHaveBeenCalled();

    bot.update({
      usedCard: {} as UsedCard,
      params: [{ isActive: false } as PlayerParams, {} as PlayerParams],
    });

    await Promise.resolve();
    expect(subscriber).not.toHaveBeenCalled();

    bot.update({
      usedCard: {} as UsedCard,
      params: [{ isActive: true } as PlayerParams, {} as PlayerParams],
    });

    await Promise.resolve();
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        cardIndex: expect.any(Number),
        isDiscarded: false,
      })
    );

    bot.update({
      usedCard: {} as UsedCard,
      params: [
        { isActive: true, bricks: 0, gems: 0, recruits: 0 } as PlayerParams,
        {} as PlayerParams,
      ],
    });

    await Promise.resolve();
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        cardIndex: expect.any(Number),
        isDiscarded: true,
      })
    );
  });
});
