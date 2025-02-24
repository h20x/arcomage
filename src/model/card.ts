import { CardData, CardType } from '@app';
import { Player } from './player';

type ApplyFn = (player: Player, enemy: Player) => boolean | void;

type CardConfig = {
  type?: CardType;
  name?: string;
  cost?: number;
  desc?: string;
  isUndiscardable?: boolean;
  applyFn?: ApplyFn;
};

export abstract class Card {
  private _type: CardType;

  private _applyFn: ApplyFn;

  private _name: string;

  private _cost: number;

  private _desc: string;

  private _isUndiscardable: boolean;

  constructor(cfg: CardConfig) {
    this._type = cfg.type || CardType.Brick;
    this._name = cfg.name ?? '';
    this._cost = Math.max(0, cfg.cost ?? 0);
    this._desc = cfg.desc ?? '';
    this._isUndiscardable = cfg.isUndiscardable ?? false;
    this._applyFn = cfg.applyFn ?? (() => {});
  }

  get cost(): number {
    return this._cost;
  }

  get name(): string {
    return this._name;
  }

  get isUndiscardable(): boolean {
    return this._isUndiscardable;
  }

  apply(player: Player, enemy: Player): boolean {
    if (!this.subtractCost(player)) {
      return false;
    }

    const playAgain = this._applyFn(player, enemy);

    if (!playAgain) {
      player.isActive = false;
      enemy.isActive = true;
    }

    return true;
  }

  getData(): CardData {
    return {
      type: this._type,
      name: this._name,
      cost: this._cost,
      desc: this._desc,
      isUndiscardable: this._isUndiscardable,
    };
  }

  protected abstract subtractCost(player: Player): boolean;
}

export class BrickCard extends Card {
  constructor(cfg: CardConfig = {}) {
    super({ ...cfg, type: CardType.Brick });
  }

  protected subtractCost(player: Player): boolean {
    if (player.bricks >= this.cost) {
      player.bricks -= this.cost;

      return true;
    }

    return false;
  }
}

export class GemCard extends Card {
  constructor(cfg: CardConfig = {}) {
    super({ ...cfg, type: CardType.Gem });
  }

  protected subtractCost(player: Player): boolean {
    if (player.gems >= this.cost) {
      player.gems -= this.cost;

      return true;
    }

    return false;
  }
}

export class RecruitCard extends Card {
  constructor(cfg: CardConfig = {}) {
    super({ ...cfg, type: CardType.Recruit });
  }

  protected subtractCost(player: Player): boolean {
    if (player.recruits >= this.cost) {
      player.recruits -= this.cost;

      return true;
    }

    return false;
  }
}
