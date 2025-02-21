import { Card, CardData } from './card';

export type PlayerData = {
  params: PlayerParams;
  cards: (CardData | null)[];
};

export type PlayerParams = {
  isActive: boolean;
  isWinner: boolean;
  isDiscardMode: boolean;
  quarries: number;
  magic: number;
  dungeons: number;
  bricks: number;
  gems: number;
  recruits: number;
  tower: number;
  wall: number;
};

const DEFAULT_PARAMS: PlayerParams = {
  isActive: false,
  isWinner: false,
  isDiscardMode: false,
  quarries: 1,
  magic: 1,
  dungeons: 1,
  bricks: 0,
  gems: 0,
  recruits: 0,
  tower: 0,
  wall: 0,
};

export class Player {
  static diff(player1: Player, player2: Player): Partial<PlayerParams> {
    const p1 = player1.getParams();
    const p2 = player2.getParams();
    const diff = {} as Partial<PlayerParams>;
    const keys = Object.keys(p1) as (keyof PlayerParams)[];

    for (const key of keys) {
      if (p1[key] !== p2[key]) {
        diff[key] = p2[key] as any;
      }
    }

    return diff;
  }

  private cards: Card[];

  private params: PlayerParams = {} as PlayerParams;

  constructor(params: Partial<PlayerParams> = {}, cards: Card[] = []) {
    const mergedParams = Object.assign({}, DEFAULT_PARAMS, params);
    const { isActive, isWinner, isDiscardMode, tower, wall } = mergedParams;
    const { quarries, magic, dungeons, bricks, gems, recruits } = mergedParams;
    const { params: _params } = this;
    _params.isActive = isActive;
    _params.isWinner = isWinner;
    _params.isDiscardMode = isDiscardMode;
    _params.quarries = Math.max(quarries, 1);
    _params.magic = Math.max(magic, 1);
    _params.dungeons = Math.max(dungeons, 1);
    _params.bricks = Math.max(bricks, 0);
    _params.gems = Math.max(gems, 0);
    _params.recruits = Math.max(recruits, 0);
    _params.tower = Math.max(tower, 0);
    _params.wall = Math.max(wall, 0);
    this.cards = cards.slice();
  }

  get isActive(): boolean {
    return this.params.isActive;
  }

  set isActive(v: boolean) {
    this.params.isActive = v;
  }

  get isDiscardMode(): boolean {
    return this.params.isDiscardMode;
  }

  set isDiscardMode(v: boolean) {
    this.params.isDiscardMode = v;
  }

  get isWinner(): boolean {
    return this.params.isWinner;
  }

  set isWinner(v: boolean) {
    this.params.isWinner = v;
  }

  get quarries(): number {
    return this.params.quarries;
  }

  set quarries(n: number) {
    this.params.quarries = Math.max(n, 1);
  }

  get magic(): number {
    return this.params.magic;
  }

  set magic(n: number) {
    this.params.magic = Math.max(n, 1);
  }

  get dungeons(): number {
    return this.params.dungeons;
  }

  set dungeons(n: number) {
    this.params.dungeons = Math.max(n, 1);
  }

  get bricks(): number {
    return this.params.bricks;
  }

  set bricks(n: number) {
    this.params.bricks = Math.max(n, 0);
  }

  get gems(): number {
    return this.params.gems;
  }

  set gems(n: number) {
    this.params.gems = Math.max(n, 0);
  }

  get recruits(): number {
    return this.params.recruits;
  }

  set recruits(n: number) {
    this.params.recruits = Math.max(n, 0);
  }

  get tower(): number {
    return this.params.tower;
  }

  set tower(n: number) {
    this.params.tower = Math.max(n, 0);
  }

  get wall(): number {
    return this.params.wall;
  }

  set wall(n: number) {
    this.params.wall = Math.max(n, 0);
  }

  clone(): Player {
    return new Player(this.params, this.cards);
  }

  hasCard(index: number): boolean {
    return 0 <= index && index < this.cards.length;
  }

  setCard(index: number, card: Card): void {
    this.cards[index] = card;
  }

  getCard(index: number): Card {
    return this.cards[index];
  }

  getParams(): PlayerParams {
    return { ...this.params };
  }

  getData(): PlayerData {
    return {
      params: this.getParams(),
      cards: this.cards.map((card) => card.getData()),
    };
  }
}
