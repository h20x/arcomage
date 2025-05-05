import { CardCost, CardData } from '@game';
import { Publisher, Subscribable, Subscriber, UnsubscribeFn } from '@lib';
import './card.css';
import html from './card.html';

type CardEvent = { isDiscarded: boolean };

const ASSETS = `/assets/cards`;

export class Card extends HTMLElement implements Subscribable<CardEvent> {
  private name: string = '';

  private desc: string = '';

  private _cost: CardCost = [0, 'bricks'];

  private isInited: boolean = false;

  private _isDisabled: boolean = false;

  private _isUndiscardable: boolean = false;

  private eventEmitter: Publisher<CardEvent> = new Publisher();

  private onRemoveFns: (() => void)[] = [];

  constructor(data?: CardData | null) {
    super();

    if (!data) {
      return;
    }

    this.name = data.name;
    this.desc = data.desc;
    this._cost = data.cost;
    this._isUndiscardable = data.isUndiscardable;
  }

  cost(): Readonly<CardCost> {
    return this._cost;
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

  setDisabled(val: boolean): void {
    this._isDisabled = val;
    this.classList.toggle('card--disabled', val);
  }

  isDisabled(): boolean {
    return this._isDisabled;
  }

  isUndiscardable(): boolean {
    return this._isUndiscardable;
  }

  isUnknown(): boolean {
    return !this.name;
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
        fadeOut ? { transform: 'none', opacity: 0 } : { transform: 'none' },
      ],
      { duration, easing, fill: 'both' }
    ).finished.then(() => this.classList.remove('card--animated'));
  }

  private createHTML(): void {
    this.classList.add('card', `card--${this._cost[1]}`);
    this.innerHTML = html;
    const nameElem = this.querySelector('.card__name')!;
    const imgElem = this.querySelector('.card__img')!;
    const descElem = this.querySelector('.card__desc')!;
    const costElem = this.querySelector('.card__cost')!;
    nameElem.textContent = this.name;
    descElem.textContent = this.desc;
    costElem.textContent = String(this._cost[0]);
    const imgName = this.name
      .replace(/[!']/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    (
      imgElem as HTMLElement
    ).style.backgroundImage = `url(${ASSETS}/${imgName}.webp)`;
  }

  private addEventListeners() {
    this.addEventListener('pointerup', (e) => {
      e.button === 0 && this.eventEmitter.notify({ isDiscarded: false });
      e.button === 2 && this.eventEmitter.notify({ isDiscarded: true });
    });
  }
}

customElements.define('am-card', Card);
