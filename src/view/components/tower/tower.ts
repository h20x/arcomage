import { AudioPlayer, Sound } from '@audio';
import './tower.css';
import html from './tower.html';

export class Tower extends HTMLElement {
  private height!: number;

  private maxHeight!: number;

  private bodyElem!: HTMLElement;

  private baseElem!: HTMLElement;

  connectedCallback(): void {
    this.classList.add('tower');
    this.innerHTML = html;
    this.bodyElem = this.querySelector('.tower__body')!;
    this.baseElem = this.querySelector('.tower__base')!;
  }

  init(val: number, maxHeight: number): void {
    this.maxHeight = maxHeight;
    this.setHeight(val);
  }

  setHeight(val: number, silent: boolean = true): void {
    const fr = Math.min(1, val / this.maxHeight);
    !silent && this.playSound(val - this.height);
    this.height = val;
    this.bodyElem.style.setProperty('--fr', String(fr));
    this.baseElem.textContent = String(val);
  }

  private playSound(diff: number): void {
    if (diff > 0) {
      AudioPlayer.play(Sound.TowerInc);
    } else if (diff < 0) {
      AudioPlayer.play(Sound.Damage);
    }
  }
}

customElements.define('am-tower', Tower);
