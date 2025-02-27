import { CardType, GameData, splitGameChanges, splitGameData } from '@game';

describe('split data', () => {
  it('splitGameData', () => {
    const player1Params = {
      isActive: true,
      isDiscardMode: false,
      isWinner: false,
      bricks: 1,
      dungeons: 1,
      gems: 1,
      magic: 1,
      quarries: 1,
      recruits: 1,
      tower: 1,
      wall: 1,
    };
    const player1Cards = [
      {
        name: 'a',
        cost: 0,
        desc: '',
        type: CardType.Gem,
        isUndiscardable: false,
      },
      {
        name: 'b',
        cost: 0,
        desc: '',
        type: CardType.Gem,
        isUndiscardable: false,
      },
    ];
    const player2Params = {
      isActive: false,
      isDiscardMode: false,
      isWinner: false,
      bricks: 2,
      dungeons: 2,
      gems: 2,
      magic: 2,
      quarries: 2,
      recruits: 2,
      tower: 2,
      wall: 2,
    };
    const player2Cards = [
      {
        name: 'c',
        cost: 0,
        desc: '',
        type: CardType.Brick,
        isUndiscardable: false,
      },
      {
        name: 'd',
        cost: 0,
        desc: '',
        type: CardType.Brick,
        isUndiscardable: false,
      },
    ];
    const victoryConditions = { resource: 100, tower: 50 };
    const gameData: GameData = {
      players: [
        { params: player1Params, cards: player1Cards },
        { params: player2Params, cards: player2Cards },
      ],
      victoryConditions,
    };

    expect(splitGameData(gameData)).toEqual([
      {
        players: [
          { params: player1Params, cards: player1Cards },
          { params: player2Params, cards: [null, null] },
        ],
        victoryConditions,
      },
      {
        players: [
          { params: player2Params, cards: player2Cards },
          { params: player1Params, cards: [null, null] },
        ],
        victoryConditions,
      },
    ]);
  });

  it('splitGameChanges', () => {
    const usedCard = {
      cardIndex: 0,
      playerIndex: 0,
      data: {
        name: 'a',
        cost: 0,
        desc: '',
        type: CardType.Gem,
        isUndiscardable: false,
      },
      isDiscarded: false,
    };
    const newCard = {
      cardIndex: 0,
      playerIndex: 0,
      data: {
        name: 'b',
        cost: 0,
        desc: '',
        type: CardType.Brick,
        isUndiscardable: false,
      },
    };
    const player1Params = { gems: 1, tower: 8 };
    const player2Params = { bricks: 2, wall: 4 };
    const nrNewCard = {
      cardIndex: 0,
      playerIndex: 0,
      data: {
        name: 'c',
        cost: 0,
        desc: '',
        type: CardType.Recruit,
        isUndiscardable: false,
      },
    };
    const nrPlayer1Params = {};
    const nrPlayer2Params = { bricks: 4, gems: 8, recruits: 16 };

    expect(
      splitGameChanges({
        usedCard: { ...usedCard, playerIndex: 0 },
        params: [player1Params, player2Params],
      })
    ).toEqual([
      {
        usedCard: { ...usedCard, playerIndex: 0 },
        params: [player1Params, player2Params],
      },
      {
        usedCard: { ...usedCard, playerIndex: 1 },
        params: [player2Params, player1Params],
      },
    ]);

    expect(
      splitGameChanges({
        usedCard: { ...usedCard, playerIndex: 1 },
        params: [player1Params, player2Params],
      })
    ).toEqual([
      {
        usedCard: { ...usedCard, playerIndex: 1 },
        params: [player1Params, player2Params],
      },
      {
        usedCard: { ...usedCard, playerIndex: 0 },
        params: [player2Params, player1Params],
      },
    ]);

    expect(
      splitGameChanges({
        usedCard: { ...usedCard, playerIndex: 0 },
        newCard: { ...newCard, playerIndex: 0 },
        params: [player1Params, player2Params],
      })
    ).toEqual([
      {
        usedCard: { ...usedCard, playerIndex: 0 },
        newCard: { ...newCard, playerIndex: 0 },
        params: [player1Params, player2Params],
      },
      {
        usedCard: { ...usedCard, playerIndex: 1 },
        newCard: { ...newCard, playerIndex: 1, data: null },
        params: [player2Params, player1Params],
      },
    ]);

    expect(
      splitGameChanges({
        usedCard: { ...usedCard, playerIndex: 0 },
        params: [player1Params, player2Params],
        nextRound: {
          params: [nrPlayer1Params, nrPlayer2Params],
          newCard: { ...nrNewCard, playerIndex: 1 },
        },
      })
    ).toEqual([
      {
        usedCard: { ...usedCard, playerIndex: 0 },
        params: [player1Params, player2Params],
        nextRound: {
          params: [nrPlayer1Params, nrPlayer2Params],
          newCard: { ...nrNewCard, playerIndex: 1, data: null },
        },
      },
      {
        usedCard: { ...usedCard, playerIndex: 1 },
        params: [player2Params, player1Params],
        nextRound: {
          params: [nrPlayer2Params, nrPlayer1Params],
          newCard: { ...nrNewCard, playerIndex: 0 },
        },
      },
    ]);
  });
});
