import { CardData, CardType } from '@model';
import { Publisher, Subscribable, Subscriber, UnsubscribeFn } from '@lib';
import './card.css';
import html from './card.html';

type CardEvent = { isDiscarded: boolean };

const ASSETS = `/assets/cards`;

const typeToRes = {
  [CardType.Brick]: 'bricks',
  [CardType.Gem]: 'gems',
  [CardType.Recruit]: 'recruits',
} as const;

export class Card extends HTMLElement implements Subscribable<CardEvent> {
  private type: CardType = CardType.Brick;

  private name: string = '';

  private desc: string = '';

  private cost: number = 0;

  private isInited: boolean = false;

  private _isUnusable: boolean = false;

  private _isUndiscardable: boolean = false;

  private eventEmitter: Publisher<CardEvent> = new Publisher();

  private onRemoveFns: (() => void)[] = [];

  constructor(data?: CardData | null) {
    super();

    if (!data) {
      return;
    }

    this.type = data.type;
    this.name = data.name;
    this.desc = data.desc;
    this.cost = data.cost;
    this._isUndiscardable = data.isUndiscardable;
  }

  connectedCallback(): void {
    if (this.isInited) {
      return;
    }

    this.isInited = true;

    if (this.isUnknown()) {
      this.classList.add('card', 'card--unknown');

      return;
    }

    this.createHTML();
    this.addEventListeners();
  }

  subscribe(sub: Subscriber<CardEvent>): UnsubscribeFn {
    return this.eventEmitter.subscribe(sub);
  }

  markAsPlayed(): void {
    this.classList.add('card--played');
  }

  markAsDiscarded(): void {
    this.classList.add('card--discarded');
  }

  reset(): void {
    this.classList.remove('card--played', 'card--discarded');
  }

  checkCost(resources: {
    bricks: number;
    gems: number;
    recruits: number;
  }): void {
    if (this.isUnknown()) {
      return;
    }

    const resAmount = resources[typeToRes[this.type]];
    this._isUnusable = resAmount < this.cost;
    this.classList.toggle('card--disabled', this._isUnusable);
  }

  isUnusable(): boolean {
    return this._isUnusable;
  }

  isUndiscardable(): boolean {
    return this._isUndiscardable;
  }

  getCoords(): { x: number; y: number } {
    return this.getBoundingClientRect();
  }

  onRemove(fn: () => void): void {
    this.onRemoveFns.push(fn);
  }

  remove(): void {
    this.onRemoveFns.forEach((fn) => fn());
    this.onRemoveFns = [];
    super.remove();
  }

  moveTo(
    dest: { addCard(card: Card): void },
    cfg: {
      duration?: number;
      easing?: string;
      fadeOut?: boolean;
    } = {}
  ): Promise<void> {
    const { duration = 500, easing = 'ease-out', fadeOut = false } = cfg;
    const startPoint = this.getCoords();
    this.remove();
    dest.addCard(this);
    const endPoint = this.getCoords();
    const diff = {
      x: endPoint.x - startPoint.x,
      y: endPoint.y - startPoint.y,
    };
    this.classList.add('card--animated');

    return this.animate(
      [
        { transform: `translateX(${-diff.x}px) translateY(${-diff.y}px)` },
        fadeOut ? { transform: '', opacity: 0 } : { transform: '' },
      ],
      { duration, easing, fill: 'both' }
    ).finished.then(() => this.classList.remove('card--animated'));
  }

  private isUnknown(): boolean {
    return !this.name;
  }

  private createHTML(): void {
    this.classList.add('card', `card--${this.type.toLowerCase()}`);
    this.innerHTML = html;
    const nameElem = this.querySelector('.card__name')!;
    const imgElem = this.querySelector('.card__img')!;
    const descElem = this.querySelector('.card__desc')!;
    const costElem = this.querySelector('.card__cost')!;
    nameElem.textContent = this.name;
    descElem.textContent = this.desc;
    costElem.textContent = String(this.cost);
    const imgName = this.name
      .replace(/[!']/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    (
      imgElem as HTMLElement
    ).style.backgroundImage = `url(${ASSETS}/${imgName}.webp)`;
  }

  private addEventListeners() {
    this.addEventListener('pointerdown', (e) => {
      e.button === 0 && this.eventEmitter.notify({ isDiscarded: false });
      e.button === 2 && this.eventEmitter.notify({ isDiscarded: true });
    });
  }
}

customElements.define('am-card', Card);
