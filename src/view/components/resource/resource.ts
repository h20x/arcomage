import { AudioPlayer, Sound } from '@audio';
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

  setAmount(val: number, silent: boolean = true): void {
    !silent && this.playResSound(val - this.amount);
    this.amount = val;
    this.amountElem.textContent = String(val);
  }

  setProd(val: number, silent: boolean = true): void {
    !silent && this.playProdSound(val - this.prod);
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

  private playResSound(diff: number): void {
    if (diff > 0) {
      AudioPlayer.play(Sound.ResInc);
    } else if (diff < 0) {
      AudioPlayer.play(Sound.ResDec);
    }
  }

  private playProdSound(diff: number): void {
    if (diff > 0) {
      AudioPlayer.play(Sound.ProdInc);
    } else if (diff < 0) {
      AudioPlayer.play(Sound.ProdDec);
    }
  }
}

customElements.define('am-resource', Resource);
