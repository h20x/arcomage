import {
  forEachPreset,
  getPreset,
  getPresetName,
  Preset,
  validatePreset,
} from '@game';
import './settings.css';
import html from './settings.html';

export class SettingsComponent extends HTMLElement {
  private preset!: Preset;

  private presets!: HTMLSelectElement;

  private tower!: HTMLInputElement;

  private wall!: HTMLInputElement;

  private quarries!: HTMLInputElement;

  private magic!: HTMLInputElement;

  private dungeons!: HTMLInputElement;

  private bricks!: HTMLInputElement;

  private gems!: HTMLInputElement;

  private recruits!: HTMLInputElement;

  private towerVictory!: HTMLInputElement;

  private resourceVictory!: HTMLInputElement;

  private customOption: HTMLOptionElement | null = null;

  connectedCallback(): void {
    this.createHTML();
    this.addEventListeners();

    if (!this.preset) {
      this.preset = getPreset('Default')!;
    }

    this.applyPreset();
  }

  getValues(): Readonly<Preset> {
    return this.preset;
  }

  setValues(preset: Preset): void {
    this.preset = preset;
  }

  private createHTML(): void {
    this.classList.add('game__settings');
    this.innerHTML = html;
    this.presets = this.querySelector('#presets')!;
    this.tower = this.querySelector('#tower')!;
    this.wall = this.querySelector('#wall')!;
    this.quarries = this.querySelector('#quarries')!;
    this.magic = this.querySelector('#magic')!;
    this.dungeons = this.querySelector('#dungeons')!;
    this.bricks = this.querySelector('#bricks')!;
    this.gems = this.querySelector('#gems')!;
    this.recruits = this.querySelector('#recruits')!;
    this.towerVictory = this.querySelector('#tower-victory')!;
    this.resourceVictory = this.querySelector('#resource-victory')!;

    forEachPreset((_, name) => {
      const option = document.createElement('option');
      option.text = name;
      this.presets.appendChild(option);
    });
  }

  private applyPreset(): void {
    this.tower.value = String(this.preset.tower);
    this.wall.value = String(this.preset.wall);
    this.quarries.value = String(this.preset.quarries);
    this.magic.value = String(this.preset.magic);
    this.dungeons.value = String(this.preset.dungeons);
    this.bricks.value = String(this.preset.bricks);
    this.gems.value = String(this.preset.gems);
    this.recruits.value = String(this.preset.recruits);
    this.towerVictory.value = String(this.preset.towerVictory);
    this.resourceVictory.value = String(this.preset.resourceVictory);

    const presetName = getPresetName(this.preset);
    'Custom' === presetName
      ? this.addCustomOption()
      : this.removeCustomOption();
    this.presets.value = presetName;
  }

  private addEventListeners(): void {
    this.presets.addEventListener('change', () => {
      this.preset = getPreset(this.presets.value)!;
      this.applyPreset();
      this.removeCustomOption();
    });

    const addListener = (
      elem: HTMLInputElement,
      key: Exclude<keyof Preset, 'tavern'>
    ) => {
      elem.addEventListener('change', () => {
        this.preset[key] = +elem.value;
        validatePreset(this.preset);
        this.applyPreset();
      });
    };

    addListener(this.tower, 'tower');
    addListener(this.wall, 'wall');
    addListener(this.quarries, 'quarries');
    addListener(this.magic, 'magic');
    addListener(this.dungeons, 'dungeons');
    addListener(this.bricks, 'bricks');
    addListener(this.gems, 'gems');
    addListener(this.recruits, 'recruits');
    addListener(this.towerVictory, 'towerVictory');
    addListener(this.resourceVictory, 'resourceVictory');
  }

  private addCustomOption(): void {
    if (!this.customOption) {
      this.customOption = document.createElement('option');
      this.customOption.text = 'Custom';
      this.presets.options.add(this.customOption, 0);
    }
  }

  private removeCustomOption(): void {
    if (this.customOption) {
      this.customOption.remove();
      this.customOption = null;
    }
  }
}

customElements.define('am-settings', SettingsComponent);
