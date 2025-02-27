import { GameChanges, GameData, NewCard } from './model';

export function splitGameData(data: GameData): [GameData, GameData] {
  const { victoryConditions } = data;
  const [p1, p2] = data.players;
  const p1Clone = { params: { ...p1.params }, cards: p1.cards.map(() => null) };
  const p2Clone = { params: { ...p2.params }, cards: p2.cards.map(() => null) };

  return [
    { players: [p1, p2Clone], victoryConditions },
    { players: [p2, p1Clone], victoryConditions },
  ];
}

export function splitGameChanges(
  data: GameChanges
): [GameChanges, GameChanges] {
  const { usedCard, newCard, params, nextRound } = data;
  const p1 = {} as GameChanges;
  const p2 = {} as GameChanges;

  p1.params = params;
  p2.params = [{ ...params[1] }, { ...params[0] }];

  p1.usedCard = usedCard;
  p2.usedCard = {
    ...usedCard,
    playerIndex: usedCard.playerIndex === 0 ? 1 : 0,
  };

  if (newCard) {
    p1.newCard = splitNewCard(newCard, 0);
    p2.newCard = splitNewCard(newCard, 1);
  }

  if (nextRound) {
    const { params, newCard } = nextRound;

    p1.nextRound = { params };
    p2.nextRound = { params: [{ ...params[1] }, { ...params[0] }] };

    if (newCard) {
      p1.nextRound.newCard = splitNewCard(newCard, 0);
      p2.nextRound.newCard = splitNewCard(newCard, 1);
    }
  }

  return [p1, p2];
}

function splitNewCard(newCard: NewCard, playerIndex: number): NewCard {
  return newCard.playerIndex === playerIndex
    ? { ...newCard, playerIndex: 0 }
    : { ...newCard, playerIndex: 1, data: null };
}
