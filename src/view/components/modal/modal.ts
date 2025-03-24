import { Publisher, Subscribable } from '@lib';
import './modal.css';
import html from './modal.html';

type ModalConfig = {
  content: string | HTMLElement;
  btnSuccessText?: string;
  hideActions?: boolean;
  cssClass?: string;
};

type AnimOptions = {
  duration?: number;
  easing?: string;
};

export class Modal extends HTMLElement {
  private static activeInstance: Modal | null = null;

  static open(
    cfg: ModalConfig,
    animOptions?: AnimOptions
  ): Subscribable<boolean> {
    Modal.close();
    const modal = new Modal();
    modal.open(cfg, animOptions);
    Modal.activeInstance = modal;

    return modal.result;
  }

  static close(result: boolean = false): void {
    const instance = Modal.activeInstance;
    Modal.activeInstance = null;
    instance?.close(result);
  }

  static isOpen(): boolean {
    return !!Modal.activeInstance;
  }

  private body!: HTMLElement;

  private result: Publisher<boolean> = new Publisher();

  private escListener!: (e: KeyboardEvent) => void;

  private open(cfg: ModalConfig, animOptions?: AnimOptions): void {
    this.createHTML(cfg);
    this.addEventListeners();
    document.body.append(this);
    this.doAnimate(animOptions);

    setTimeout(() => {
      (this.querySelector('.modal__success') as HTMLElement)?.focus();
    }, 0);
  }

  private close(result: boolean): void {
    this.remove();
    this.result.notify(result);
    this.result.unsubscribeAll();
    document.removeEventListener('keyup', this.escListener);
  }

  private doAnimate({ duration = 150, easing = 'ease-out' } = {}): void {
    this.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing });
    this.body.animate([{ transform: 'translateY(-10px)' }, { transform: '' }], {
      duration,
      easing,
    });
  }

  private createHTML(cfg: ModalConfig): void {
    const {
      content,
      cssClass,
      btnSuccessText = 'OK',
      hideActions = false,
    } = cfg;

    this.classList.add('modal');
    this.innerHTML = html;
    this.body = this.querySelector('.modal__body')!;

    const contentElem = this.querySelector('.modal__content')!;

    if (typeof content === 'string') {
      contentElem.innerHTML = content;
    } else {
      contentElem.append(content);
    }

    if (hideActions) {
      this.querySelector('.modal__actions')!.remove();
    } else {
      this.querySelector('.modal__success')!.textContent = btnSuccessText;
    }

    if (cssClass) {
      this.classList.add(cssClass);
    }
  }

  private addEventListeners(): void {
    const handleClick = (element: HTMLElement | null, handler: () => void) => {
      element?.addEventListener(
        'pointerup',
        ({ button }: MouseEvent) => !button && handler()
      );
    };

    const handleKey = (
      element: HTMLElement | null,
      keyName: string,
      handler: () => void
    ) => {
      const listener = ({ key }: KeyboardEvent) => keyName === key && handler();
      element?.addEventListener('keyup', listener);

      return listener;
    };

    const overlay = this.querySelector('.modal__overlay') as HTMLElement;
    const btnSuccess = this.querySelector('.modal__success') as HTMLElement;
    const btnCancel = this.querySelector('.modal__cancel') as HTMLElement;

    handleClick(overlay, Modal.close);
    handleClick(btnSuccess, () => Modal.close(true));
    handleClick(btnCancel, Modal.close);
    handleKey(btnSuccess, 'Enter', () => Modal.close(true));
    handleKey(btnCancel, 'Enter', Modal.close);
    this.escListener = handleKey(document as any, 'Escape', Modal.close);
  }
}

customElements.define('am-modal', Modal);
