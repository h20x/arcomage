import { Card } from '../card/card';
import './deck.css';

export class Deck extends HTMLElement {
  connectedCallback(): void {
    this.classList.add('deck');
  }

  addCard(card: Card): void {
    this.append(card);
  }
}

customElements.define('am-deck', Deck);
