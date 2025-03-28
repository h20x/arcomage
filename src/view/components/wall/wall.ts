import { AudioPlayer, Sound } from '@audio';
import { explosion } from 'src/view/explosion';
import './wall.css';
import html from './wall.html';

export class Wall extends HTMLElement {
  private height!: number;

  private maxHeight!: number;

  private bodyElem!: HTMLElement;

  private baseElem!: HTMLElement;

  connectedCallback(): void {
    this.classList.add('wall');
    this.innerHTML = html;
    this.bodyElem = this.querySelector('.wall__body')!;
    this.baseElem = this.querySelector('.wall__base')!;
  }

  init(val: number, maxHeight: number = 100): void {
    this.maxHeight = maxHeight;
    this.setHeight(val);
  }

  setHeight(val: number, silent: boolean = true): void {
    const fr = Math.min(1, val / this.maxHeight);
    !silent && this.emphasize(val - this.height);
    this.height = val;
    this.bodyElem.style.setProperty('--fr', String(fr));
    this.baseElem.textContent = String(val);
  }

  private emphasize(diff: number): void {
    const { x, y } = this.baseElem.getBoundingClientRect();

    if (diff > 0) {
      AudioPlayer.play(Sound.WallInc);
      explosion(x, y, diff);
    } else if (diff < 0) {
      explosion(x, y, diff);
      AudioPlayer.play(Sound.Damage);
    }
  }
}

customElements.define('am-wall', Wall);
