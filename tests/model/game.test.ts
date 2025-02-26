import { PlayerData, PlayerParams, VictoryConditions } from '@game';
import { Card, GameModel, getCard } from '@model';

describe('Game', () => {
  function setup(cfg?: {
    player1?: { params?: Partial<PlayerParams>; cards?: Card[] };
    player2?: { params?: Partial<PlayerParams>; cards?: Card[] };
    victoryConditions?: VictoryConditions;
  }): {
    game: GameModel;
    player1: () => PlayerData;
    player2: () => PlayerData;
  } {
    const {
      player1 = {},
      player2 = {},
      victoryConditions = { resource: 64, tower: 32 },
    } = cfg ?? {};
    const game = GameModel.create(player1, player2, victoryConditions);

    return {
      game,
      player1: () => game.getData().players[0],
      player2: () => game.getData().players[1],
    };
  }

  it('should throw error if the game has already ended', () => {
    const { game, player1 } = setup({
      player1: {
        params: { tower: 99, bricks: 1 },
        cards: [getCard('Rock Garden')],
      },
      player2: {
        params: { tower: 1 },
        cards: [getCard('Brick Shortage')],
      },
      victoryConditions: { tower: 100, resource: 100 },
    });

    expect(player1().params.isWinner).toBe(false);

    game.useCard(0);

    expect(player1().params.isWinner).toBe(true);
    expect(() => game.useCard(0)).toThrow('The game is ended');
  });

  it("should throw error if the card can't be discarded", () => {
    const { game } = setup({
      player1: { cards: [getCard('Lodestone')] },
    });

    expect(() => game.useCard(0, true)).toThrow("This card can't be discarded");
  });

  it("should throw error if the card can't be used", () => {
    const { game } = setup({
      player1: {
        params: { bricks: 0, gems: 0, recruits: 0 },
        cards: [getCard("Dragon's Eye")],
      },
    });

    expect(() => game.useCard(0)).toThrow(`You can't use "Dragon's Eye"`);
  });

  it("should throw error if the card doesn't exist", () => {
    const { game } = setup({
      player1: { cards: [getCard('Orc'), getCard('Orc')] },
    });

    [-1, 2].forEach((i) => {
      expect(() => game.useCard(i)).toThrow(
        `Card with index ${i} doesn't exist`
      );
    });
  });

  it('should determine the winner', () => {
    const cfg = [
      {
        victoryConditions: { tower: 100, resource: 100 },
        player1: {
          params: { tower: 99, gems: 30 },
          cards: [getCard("Dragon's Eye")],
        },
        player2: { params: { tower: 1 } },
      },
      {
        victoryConditions: { tower: 100, resource: 100 },
        player1: {
          params: { tower: 1, gems: 99 },
          cards: [getCard('Rainbow')],
        },
        player2: { params: { tower: 1 } },
      },
      {
        victoryConditions: { tower: 100, resource: 100 },
        player1: {
          params: { tower: 1, recruits: 10 },
          cards: [getCard('Orc')],
        },
        player2: { params: { tower: 1, wall: 0 } },
      },
    ];

    for (const c of cfg) {
      const { game, player1, player2 } = setup(c);

      expect(player1().params.isWinner).toBe(false);
      expect(player2().params.isWinner).toBe(false);

      game.useCard(0);

      expect(player1().params.isWinner).toBe(true);
      expect(player2().params.isWinner).toBe(false);
    }
  });

  it('should be a draw', () => {
    const cfg = [
      {
        player1: { params: { tower: 7, gems: 5 }, cards: [getCard('Discord')] },
        player2: { params: { tower: 7 } },
      },
      {
        player1: {
          params: { tower: 99 },
          cards: [getCard('Rainbow')],
        },
        player2: { params: { tower: 99 } },
        victoryConditions: { tower: 100, resource: 200 },
      },
    ];

    for (const c of cfg) {
      const { game, player1, player2 } = setup(c);

      expect(player1().params.isWinner).toBe(false);
      expect(player2().params.isWinner).toBe(false);

      game.useCard(0);

      expect(player1().params.isWinner).toBe(true);
      expect(player2().params.isWinner).toBe(true);
    }
  });

  it('mini game', () => {
    const params = {
      bricks: 32,
      gems: 32,
      recruits: 32,
      quarries: 2,
      magic: 2,
      dungeons: 2,
      tower: 8,
      wall: 8,
    };
    const { game, player1, player2 } = setup({
      player1: {
        params,
        cards: [
          getCard('Prism'),
          getCard('Faerie'),
          getCard('Brick Shortage'),
          getCard('Strip Mine'),
          getCard('Earthquake'),
          getCard("Dragon's Eye"),
        ],
      },
      player2: {
        params,
        cards: [getCard('Quartz'), getCard('Rainbow'), getCard('Orc')],
      },
      victoryConditions: { tower: 16, resource: 64 },
    });

    expect(game.useCard(0)).toEqual({
      usedCard: {
        cardIndex: 0,
        playerIndex: 0,
        isDiscarded: false,
        data: getCard('Prism').getData(),
      },
      newCard: {
        cardIndex: 0,
        playerIndex: 0,
        data: player1().cards[0],
      },
      params: [{ isDiscardMode: true, gems: 32 }, {}],
    });

    expect(game.useCard(2)).toEqual({
      usedCard: {
        cardIndex: 2,
        playerIndex: 0,
        isDiscarded: true,
        data: getCard('Brick Shortage').getData(),
      },
      newCard: {
        cardIndex: 2,
        playerIndex: 0,
        data: player1().cards[2],
      },
      params: [{ isDiscardMode: false }, {}],
    });

    expect(game.useCard(1)).toEqual({
      usedCard: {
        cardIndex: 1,
        playerIndex: 0,
        isDiscarded: false,
        data: getCard('Faerie').getData(),
      },
      newCard: {
        cardIndex: 1,
        playerIndex: 0,
        data: player1().cards[1],
      },
      params: [{ recruits: 33 }, { wall: 6 }],
    });

    expect(game.useCard(3)).toEqual({
      usedCard: {
        cardIndex: 3,
        playerIndex: 0,
        isDiscarded: false,
        data: getCard('Strip Mine').getData(),
      },
      params: [
        { isActive: false, quarries: 1, wall: 18, gems: 37 },
        { isActive: true },
      ],
      nextRound: {
        params: [{}, { bricks: 34, gems: 34, recruits: 34 }],
      },
    });

    expect(game.useCard(0)).toEqual({
      usedCard: {
        cardIndex: 0,
        playerIndex: 1,
        isDiscarded: false,
        data: getCard('Quartz').getData(),
      },
      newCard: {
        cardIndex: 0,
        playerIndex: 1,
        data: player2().cards[0],
      },
      params: [{}, { gems: 33, tower: 9 }],
    });

    expect(game.useCard(1)).toEqual({
      usedCard: {
        cardIndex: 1,
        playerIndex: 1,
        isDiscarded: false,
        data: getCard('Rainbow').getData(),
      },
      params: [
        { isActive: true, tower: 9 },
        { isActive: false, tower: 10, gems: 36 },
      ],
      nextRound: {
        params: [{ bricks: 35, gems: 39, recruits: 35 }, {}],
        newCard: {
          cardIndex: 3,
          playerIndex: 0,
          data: player1().cards[3],
        },
      },
    });

    expect(game.useCard(4, true)).toEqual({
      usedCard: {
        cardIndex: 4,
        playerIndex: 0,
        isDiscarded: true,
        data: getCard('Earthquake').getData(),
      },
      params: [{ isActive: false }, { isActive: true }],
      nextRound: {
        params: [{}, { bricks: 36, gems: 38, recruits: 36 }],
        newCard: {
          cardIndex: 1,
          playerIndex: 1,
          data: player2().cards[1],
        },
      },
    });

    expect(game.useCard(2, true)).toEqual({
      usedCard: {
        cardIndex: 2,
        playerIndex: 1,
        isDiscarded: true,
        data: getCard('Orc').getData(),
      },
      params: [{ isActive: true }, { isActive: false }],
      nextRound: {
        params: [{ bricks: 36, gems: 41, recruits: 37 }, {}],
        newCard: {
          cardIndex: 4,
          playerIndex: 0,
          data: player1().cards[4],
        },
      },
    });

    expect(game.useCard(5)).toEqual({
      usedCard: {
        cardIndex: 5,
        playerIndex: 0,
        isDiscarded: false,
        data: getCard("Dragon's Eye").getData(),
      },
      params: [
        { isActive: false, isWinner: true, gems: 20, tower: 29 },
        { isActive: true },
      ],
    });

    expect(player1().params).toEqual({
      isActive: false,
      isWinner: true,
      isDiscardMode: false,
      bricks: 36,
      gems: 20,
      recruits: 37,
      quarries: 1,
      magic: 2,
      dungeons: 2,
      tower: 29,
      wall: 18,
    });

    expect(player2().params).toEqual({
      isActive: true,
      isWinner: false,
      isDiscardMode: false,
      bricks: 36,
      gems: 38,
      recruits: 36,
      quarries: 2,
      magic: 2,
      dungeons: 2,
      tower: 10,
      wall: 6,
    });
  });
});
