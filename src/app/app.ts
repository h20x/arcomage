import { GameBotFactory } from '@ai';
import { Game, getPreset, ISettingsStorage, Settings } from '@game';
import { GameModel } from '@model';
import { GameView } from '@view';
import './app.css';

const width = 1920;
const height = 1080;
const doc = document.documentElement;

function handleResize(): void {
  const r1 = window.innerWidth / width;
  const r2 = window.innerHeight / height;
  const k = Math.min(r1, r2);
  doc.style.fontSize = `${10 * k}px`;
  doc.style.setProperty('--game-width', `${width * k}px`);
  doc.style.setProperty('--game-height', `${height * k}px`);
}

handleResize();
window.addEventListener('resize', handleResize);

class SettingsStorage implements ISettingsStorage {
  private settings?: Settings;

  get(): Settings {
    if (!this.settings) {
      try {
        this.settings = JSON.parse(localStorage.getItem('settings') || '');
      } catch (err) {
        this.settings = {
          isMuted: false,
          preset: getPreset('Default')!,
        };
      }
    }

    return this.copy(this.settings!);
  }

  set(settings: Settings): void {
    this.settings = this.copy(settings);
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  private copy(settings: Settings): Settings {
    return { ...settings, preset: { ...settings.preset } };
  }
}

new Game(GameModel, GameView, GameBotFactory, new SettingsStorage()).start();
