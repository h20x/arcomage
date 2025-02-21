import { Publisher, Subscribable, Subscriber, UnsubscribeFn } from '@lib';
import { Card } from '../card/card';
import './hand.css';

export type HandEvent = { card: Card; index: number; isDiscarded: boolean };

export class Hand extends HTMLElement implements Subscribable<HandEvent> {
  private cards: (Card | null)[] = [];

  private parent!: HTMLElement;

  private eventEmitter: Publisher<HandEvent> = new Publisher();

  private isInited: boolean = false;

  connectedCallback(): void {
    if (!this.isInited) {
      this.isInited = true;
      this.classList.add('hand');
      this.parent = this.parentElement!;
    }
  }

  init(cards: Card[]): void {
    cards.forEach((card, i) => this.addCard(card, i));
  }

  subscribe(sub: Subscriber<HandEvent>): UnsubscribeFn {
    return this.eventEmitter.subscribe(sub);
  }

  addCard(card: Card, index: number): void {
    this.cards[index] = card;
    this.appendCard(card, index);
    const unsub = card.subscribe(({ isDiscarded }) => {
      this.eventEmitter.notify({ index, card, isDiscarded });
    });
    card.onRemove(() => {
      unsub();
      this.cards[index] = null;
    });
  }

  getCard(index: number): Card | null {
    return this.cards[index];
  }

  forEachCard(cb: (card: Card | null) => void): void {
    this.cards.forEach((card) => cb(card));
  }

  show(): void {
    this.parent.append(this);
  }

  hide(): void {
    this.remove();
  }

  private appendCard(card: Card, index: number): void {
    index === 0 ? this.prepend(card) : this.cards[index - 1]!.after(card);
  }
}

customElements.define('am-hand', Hand);
