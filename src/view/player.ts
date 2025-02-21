import { Publisher } from '@lib';
import { CardData, PlayerParams } from '@model';
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

  hideCards(): void {
    this.hand.hide();
  }

  showCards(): void {
    this.hand.show();
  }

  update(params: Partial<PlayerParams>): void {
    Object.assign(this.params, params);
    const { bricks, gems, recruits, tower, wall, params: _params } = this;
    bricks.setAmount(_params.bricks);
    bricks.setProd(_params.quarries);
    gems.setAmount(_params.gems);
    gems.setProd(_params.magic);
    recruits.setAmount(_params.recruits);
    recruits.setProd(_params.dungeons);
    tower.setHeight(_params.tower);
    wall.setHeight(_params.wall);
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
}
