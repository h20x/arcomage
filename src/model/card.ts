import { CardCost, CardData, PlayerParams } from '@game';

type ApplyFn = (player: PlayerParams, enemy: PlayerParams) => boolean | void;

type CardConfig = {
  name?: string;
  cost?: CardCost;
  desc?: string;
  isUndiscardable?: boolean;
  applyFn?: ApplyFn;
};

export class Card {
  private _applyFn: ApplyFn;

  private _name: string;

  private _cost: CardCost;

  private _desc: string;

  private _isUndiscardable: boolean;

  constructor(cfg: CardConfig = {}) {
    this._name = cfg.name ?? '';
    this._cost = cfg.cost
      ? [Math.max(0, cfg.cost[0]), cfg.cost[1]]
      : [0, 'bricks'];
    this._desc = cfg.desc ?? '';
    this._isUndiscardable = cfg.isUndiscardable ?? false;
    this._applyFn = cfg.applyFn ?? (() => {});
  }

  get cost(): Readonly<CardCost> {
    return this._cost;
  }

  get name(): string {
    return this._name;
  }

  get isUndiscardable(): boolean {
    return this._isUndiscardable;
  }

  apply(player: PlayerParams, enemy: PlayerParams): boolean {
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

  getData(): Readonly<CardData> {
    return {
      name: this._name,
      cost: this._cost,
      desc: this._desc,
      isUndiscardable: this._isUndiscardable,
    };
  }

  private subtractCost(player: PlayerParams): boolean {
    if (player[this._cost[1]] >= this._cost[0]) {
      player[this._cost[1]] -= this._cost[0];

      return true;
    }

    return false;
  }
}
