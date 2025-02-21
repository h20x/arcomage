import './resource.css';
import html from './resource.html';

export class Resource extends HTMLElement {
  private prod!: number;

  private amount!: number;

  private prodElem!: HTMLElement;

  private amountElem!: HTMLElement;

  connectedCallback(): void {
    this.createHTML();
  }

  init(prod: number, amount: number): void {
    this.setProd(prod);
    this.setAmount(amount);
  }

  setAmount(val: number): void {
    this.amount = val;
    this.amountElem.textContent = String(val);
  }

  setProd(val: number): void {
    this.prod = val;
    this.prodElem.textContent = String(val);
  }

  private createHTML(): void {
    this.classList.add('resource');
    this.innerHTML = html;
    this.prodElem = this.querySelector('.resource__prod')!;
    this.amountElem = this.querySelector('.resource__amount')!;
    const type = this.getAttribute('type');
    const nameElem = this.querySelector('.resource__name')!;
    nameElem.textContent = `${type}s`;
  }
}

customElements.define('am-resource', Resource);
