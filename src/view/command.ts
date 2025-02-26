import { CardData, NewCard, ParamPair } from '@game';
import { GameView } from './index';

export class CommandQueue {
  private view: GameView;

  private commands: Command[] = [];

  private isExecuting: boolean = false;

  constructor(view: GameView) {
    this.view = view;
  }

  async add(command: Command): Promise<void> {
    this.commands.push(command);

    if (this.isExecuting) {
      return;
    }

    this.isExecuting = true;

    while (this.commands.length) {
      await this.commands.shift()!.execute(this.view);
    }

    this.isExecuting = false;
  }
}

export interface Command {
  execute(view: GameView): Promise<void>;
}

export function addCard({ data, cardIndex }: NewCard): Command {
  return {
    execute(view) {
      return view.addCard(data, cardIndex);
    },
  };
}

export function useCard(
  index: number,
  isDiscarded: boolean,
  data?: CardData
): Command {
  return {
    execute(view) {
      return view.useCard(index, isDiscarded, data);
    },
  };
}

export function dropUsedCard(): Command {
  return {
    execute(view) {
      return view.dropUsedCard();
    },
  };
}

export function wait(time: number): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
      });
    },
  };
}

export function applyParams(params: ParamPair): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.applyParams(params);
        resolve();
      });
    },
  };
}

export function startNewRound(): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.startNewRound();
        resolve();
      });
    },
  };
}

export function enableDiscardMode(): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.enableDiscardMode();
        resolve();
      });
    },
  };
}

export function disableDiscardMode(): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.disableDiscardMode();
        resolve();
      });
    },
  };
}

export function lock(): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.lock();
        resolve();
      });
    },
  };
}

export function unlock(): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.unlock();
        resolve();
      });
    },
  };
}

export function endGame(params: ParamPair): Command {
  return {
    execute(view) {
      return new Promise((resolve) => {
        view.endGame(params);
        resolve();
      });
    },
  };
}
