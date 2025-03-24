import './controls.css';
import html from './controls.html';

export class Controls extends HTMLElement {
  private muteBtn!: HTMLButtonElement;

  connectedCallback(): void {
    this.classList.add('controls');
    this.innerHTML = html;
    this.muteBtn = this.querySelector('.controls__mute-btn')!;
  }

  onRestart(handler: () => void): void {
    this.addListener(this.querySelector('.controls__restart-btn')!, handler);
  }

  onMute(handler: () => void): void {
    this.addListener(this.querySelector('.controls__mute-btn')!, handler);
  }

  onSettings(handler: () => void): void {
    this.addListener(this.querySelector('.controls__settings-btn')!, handler);
  }

  onFullScreen(handler: () => void): void {
    this.addListener(this.querySelector('.controls__fullscreen-btn')!, handler);
  }

  checkMuteBtn(val: boolean): void {
    this.muteBtn.classList.toggle('active', val);
  }

  private addListener(element: HTMLElement, handler: () => void) {
    element.addEventListener('pointerup', ({ button }) => {
      button === 0 && handler();
    });
    element.addEventListener('keyup', ({ key }) => {
      'Enter' === key && handler();
    });
  }
}

customElements.define('am-controls', Controls);
