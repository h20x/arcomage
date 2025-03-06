import { Subscribable } from '@lib';
import { GameChanges, GameData, IGameModel } from './model';
import { splitGameChanges, splitGameData } from './split-data';

export enum GameEventType {
  Card,
  Restart,
}

export type CardEvent = {
  type: GameEventType.Card;
  cardIndex: number;
  isDiscarded: boolean;
};

export type RestartEvent = {
  type: GameEventType.Restart;
};

export type GameEvent = CardEvent | RestartEvent;

export interface IPlayer {
  init(data: GameData): void;
  update(data: GameChanges): void;
  destroy(): void;
}

export interface IGameBot extends IPlayer, Subscribable<CardEvent> {}

export interface IGameView extends IPlayer, Subscribable<GameEvent> {}

export class Game {
  private model: IGameModel;

  private view: IGameView;

  private bot: IGameBot;

  constructor(model: IGameModel, view: IGameView, bot: IGameBot) {
    this.model = model;
    this.view = view;
    this.bot = bot;
  }

  init(): void {
    const data = splitGameData(this.model.getData());
    this.view.subscribe(
      (e) => GameEventType.Card === e.type && this.handleCard(e)
    );
    this.bot.subscribe((e) => this.handleCard(e));
    this.view.init(data[0]);
    this.bot.init(data[1]);
  }

  destroy(): void {
    this.view.destroy();
    this.bot.destroy();
  }

  private handleCard(e: CardEvent): void {
    const changes = splitGameChanges(
      this.model.useCard(e.cardIndex, e.isDiscarded)
    );
    this.view.update(changes[0]);
    this.bot.update(changes[1]);
  }
}
