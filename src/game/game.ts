import { Subscribable } from '@lib';
import { GameChanges, GameData, IGameModel } from './model';
import { splitGameChanges, splitGameData } from './split-data';

export type PlayerEvent = {
  cardIndex: number;
  isDiscarded: boolean;
};

export interface IPlayer extends Subscribable<PlayerEvent> {
  init(data: GameData): void;
  update(data: GameChanges): void;
}

export interface IGameBot extends IPlayer {}

export interface IGameView extends IPlayer {}

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
    this.view.subscribe((e) => this.handleEvent(e));
    this.bot.subscribe((e) => this.handleEvent(e));
    this.view.init(data[0]);
    this.bot.init(data[1]);
  }

  private handleEvent(e: PlayerEvent): void {
    const changes = splitGameChanges(
      this.model.useCard(e.cardIndex, e.isDiscarded)
    );
    this.view.update(changes[0]);
    this.bot.update(changes[1]);
  }
}
