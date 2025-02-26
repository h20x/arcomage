import { Subscribable } from '@lib';
import { GameChanges, GameData } from './model';

export type PlayerEvent = {
  cardIndex: number;
  isDiscarded: boolean;
};

export interface IPlayer extends Subscribable<PlayerEvent> {
  init(data: GameData): void;
  update(data: GameChanges): void;
}
