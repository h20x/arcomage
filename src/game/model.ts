export type CardCost = [number, 'bricks' | 'gems' | 'recruits'];

export type CardData = {
  name: string;
  cost: CardCost;
  desc: string;
  isUndiscardable: boolean;
};

export type PlayerData = {
  params: PlayerParams;
  cards: (CardData | null)[];
};

export type PlayerParams = {
  isActive: boolean;
  isWinner: boolean;
  isDiscardMode: boolean;
  quarries: number;
  magic: number;
  dungeons: number;
  bricks: number;
  gems: number;
  recruits: number;
  tower: number;
  wall: number;
};

export type UsedCard = {
  cardIndex: number;
  playerIndex: number;
  data: CardData;
  isDiscarded: boolean;
};

export type NewCard = {
  cardIndex: number;
  playerIndex: number;
  data: CardData | null;
};

export type ParamPair = [Partial<PlayerParams>, Partial<PlayerParams>];

export type GameChanges = {
  usedCard: UsedCard;
  params: ParamPair;
  newCard?: NewCard;
  nextRound?: {
    params: ParamPair;
    newCard?: NewCard;
  };
};

export type VictoryConditions = {
  tower: number;
  resource: number;
};

export type GameData = {
  players: [PlayerData, PlayerData];
  victoryConditions: VictoryConditions;
};

export interface IGameModel {
  getData(): GameData;
  useCard(cardIndex: number, isDiscarded: boolean): GameChanges;
}
