import { Card } from '../card/card';
import './field.css';

export class Field extends HTMLElement {
  private card: Card | null = null;

  connectedCallback(): void {
    this.classList.add('field');
  }

  addCard(card: Card): void {
    this.card?.remove();
    this.card = card;
    this.append(card);
    card.onRemove(() => (this.card = null));
  }

  getCard(): Card | null {
    return this.card;
  }
}

customElements.define('am-field', Field);
