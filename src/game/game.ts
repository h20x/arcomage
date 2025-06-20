import { Subscribable } from '@lib';
import {
  GameChanges,
  GameData,
  IGameModel,
  PlayerParams,
  VictoryConditions,
} from './model';
import { Settings, validatePreset } from './settings';
import { splitGameChanges, splitGameData } from './split-data';

export enum GameEventType {
  Card,
  Restart,
  Settings,
}

export type CardEvent = {
  type: GameEventType.Card;
  cardIndex: number;
  isDiscarded: boolean;
};

export type RestartEvent = {
  type: GameEventType.Restart;
};

export type SettingsEvent = {
  type: GameEventType.Settings;
  settings: Settings;
};

export type GameEvent = CardEvent | RestartEvent | SettingsEvent;

export interface IPlayer {
  init(): void;
  update(data: GameChanges): void;
  destroy(): void;
}

export interface IGameBot extends IPlayer, Subscribable<CardEvent> {}

export interface IGameView extends IPlayer, Subscribable<GameEvent> {}

export interface IModelFactory {
  create(
    params: Partial<PlayerParams>,
    victoryConditions: VictoryConditions
  ): IGameModel;
}

export interface IViewFactory {
  create(data: GameData, settings: Settings): IGameView;
}

export interface IBotFactory {
  create(data: GameData): IGameBot;
}

export interface ISettingsStorage {
  get(): Settings;
  set(settings: Settings): void;
}

export class Game {
  private model: IGameModel | null = null;

  private view: IGameView | null = null;

  private bot: IGameBot | null = null;

  constructor(
    private modelFactory: IModelFactory,
    private viewFactory: IViewFactory,
    private botFactory: IBotFactory,
    private settingsStorage: ISettingsStorage
  ) {}

  start(): void {
    this.destroy();

    const settings = this.settingsStorage.get();
    const { preset } = settings;
    validatePreset(preset);
    this.model = this.modelFactory.create(
      {
        tower: preset.tower,
        wall: preset.wall,
        quarries: preset.quarries,
        magic: preset.magic,
        dungeons: preset.dungeons,
        bricks: preset.bricks,
        gems: preset.gems,
        recruits: preset.recruits,
      },
      {
        resource: preset.resourceVictory,
        tower: preset.towerVictory,
      }
    );
    const [viewData, botData] = splitGameData(this.model.getData());
    this.view = this.viewFactory.create(viewData, settings);
    this.bot = this.botFactory.create(botData);

    this.view.subscribe((e) => {
      if (GameEventType.Restart === e.type) {
        this.start();
      } else if (GameEventType.Settings === e.type) {
        this.settingsStorage.set(e.settings);
      } else if (GameEventType.Card === e.type) {
        this.handleCard(e);
      }
    });
    this.bot.subscribe((e) => this.handleCard(e));

    this.view.init();
    this.bot.init();
  }

  destroy(): void {
    this.view?.destroy();
    this.bot?.destroy();
    this.model = this.view = this.bot = null;
  }

  private handleCard(e: CardEvent): void {
    const [viewChanges, botChanges] = splitGameChanges(
      this.model!.useCard(e.cardIndex, e.isDiscarded)
    );
    this.view!.update(viewChanges);
    this.bot!.update(botChanges);
  }
}
