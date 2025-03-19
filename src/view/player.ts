import { CardData, PlayerParams } from '@game';
import { Publisher } from '@lib';
import { Card } from './components/card/card';
import { Hand, HandEvent } from './components/hand/hand';
import { Resource } from './components/resource/resource';
import { Tower } from './components/tower/tower';
import { Wall } from './components/wall/wall';

export class Player extends Publisher<HandEvent> {
  private params: PlayerParams;

  private bricks: Resource;

  private gems: Resource;

  private recruits: Resource;

  private wall: Wall;

  private tower: Tower;

  private hand: Hand;

  constructor(cfg: {
    params: PlayerParams;
    cards: (CardData | null)[];
    maxTowerHeight: number;
    bricks: Resource;
    gems: Resource;
    recruits: Resource;
    wall: Wall;
    tower: Tower;
    hand: Hand;
  }) {
    super();
    const { params, cards, maxTowerHeight } = cfg;
    const { bricks, gems, recruits, wall, tower, hand } = cfg;
    this.params = params;
    this.bricks = bricks;
    this.gems = gems;
    this.recruits = recruits;
    this.wall = wall;
    this.tower = tower;
    this.hand = hand;
    this.init(params, cards, maxTowerHeight);
  }

  isActive(): boolean {
    return this.params.isActive;
  }

  addCard(card: Card, index: number): void {
    card.checkCost(this.params);
    this.hand.addCard(card, index);
  }

  getCard(index: number): Card | null {
    return this.hand.getCard(index);
  }

  handSize(): number {
    return this.hand.size();
  }

  hideCards(): void {
    this.hand.hide();
  }

  showCards(): void {
    this.hand.show();
  }

  update(params: Partial<PlayerParams>, silent: boolean): void {
    this.assignParams(params);
    const { bricks, gems, recruits, tower, wall, params: _params } = this;
    bricks.setAmount(_params.bricks, silent);
    bricks.setProd(_params.quarries, silent);
    gems.setAmount(_params.gems, silent);
    gems.setProd(_params.magic, silent);
    recruits.setAmount(_params.recruits, silent);
    recruits.setProd(_params.dungeons, silent);
    tower.setHeight(_params.tower, silent);
    wall.setHeight(_params.wall, silent);
    this.checkCards();
  }

  private init(
    params: PlayerParams,
    cards: (CardData | null)[],
    maxTowerHeight: number
  ): void {
    const _cards = cards.map((data) => new Card(data));
    this.bricks.init(params.quarries, params.bricks);
    this.gems.init(params.magic, params.gems);
    this.recruits.init(params.dungeons, params.recruits);
    this.tower.init(params.tower, maxTowerHeight);
    this.wall.init(params.wall);
    this.hand.init(_cards);
    params.isActive && this.checkCards();
    !params.isActive && this.hand.hide();
    this.hand.subscribe((e) => this.notify(e));
  }

  private checkCards(): void {
    this.hand.forEachCard((card) => card?.checkCost(this.params));
  }

  private assignParams(params: Partial<PlayerParams>): void {
    for (let [key, value] of Object.entries(params)) {
      if (!Number.isNaN(value) && value != null) {
        (this.params as any)[key] = value;
      }
    }
  }
}
