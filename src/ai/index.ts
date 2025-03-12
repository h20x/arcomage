import { GameData, IGameBot } from '@game';
import { RandomBot } from './random-bot';

export * from './bot';
export * from './random-bot';

export class GameBotFactory {
  static create(data: GameData): IGameBot {
    return new RandomBot(data);
  }
}
