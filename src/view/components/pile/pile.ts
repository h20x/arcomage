import { Card } from '../card/card';
import './pile.css';
import html from './pile.html';

export class Pile extends HTMLElement {
  private cards: Card[] = [];

  connectedCallback(): void {
    this.classList.add('pile');
    this.innerHTML = html;
  }

  addCard(card: Card): void {
    this.cards.unshift(card);
    this.append(card);
    card.onRemove(() => {
      this.cards = this.cards.filter((c) => c !== card);
    });
  }

  forEachCard(cb: (card: Card) => void): void {
    this.cards.forEach((card) => cb(card));
  }
}

customElements.define('am-pile', Pile);
