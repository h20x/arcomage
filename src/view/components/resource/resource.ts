import { AudioPlayer, Sound } from '@audio';
import { explosion } from 'src/view/explosion';
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
    !silent && this.emphasizeRes(val - this.amount);
    this.amount = val;
    this.amountElem.textContent = String(val);
  }

  setProd(val: number, silent: boolean = true): void {
    !silent && this.emphasizeProd(val - this.prod);
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

  private emphasizeRes(diff: number): void {
    if (diff > 0) {
      AudioPlayer.play(Sound.ResInc);
      explosion(this.amountElem.getBoundingClientRect(), diff);
    } else if (diff < 0) {
      AudioPlayer.play(Sound.ResDec);
      explosion(this.amountElem.getBoundingClientRect(), diff);
    }
  }

  private emphasizeProd(diff: number): void {
    if (diff > 0) {
      AudioPlayer.play(Sound.ProdInc);
      explosion(this.prodElem.getBoundingClientRect(), diff);
    } else if (diff < 0) {
      AudioPlayer.play(Sound.ProdDec);
      explosion(this.prodElem.getBoundingClientRect(), diff);
    }
  }
}

customElements.define('am-resource', Resource);
