import { RandomBot } from '@ai';
import { GameEventType, Game, Preset, getPreset, validatePreset } from '@game';
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

let settings = loadSettings();
let game = createGame();

function createGame(): Game {
  const gameView = new GameView();

  gameView.setSettings(settings);

  gameView.subscribe((e) => {
    if (GameEventType.Restart === e.type) {
      restartGame();
    } else if (GameEventType.Settings === e.type) {
      settings = e.settings;
      saveSettings(e.settings);
      restartGame();
    }
  });

  const params = {
    tower: settings.tower,
    wall: settings.wall,
    quarries: settings.quarries,
    magic: settings.magic,
    dungeons: settings.dungeons,
    bricks: settings.bricks,
    gems: settings.gems,
    recruits: settings.recruits,
  };

  game = new Game(
    GameModel.create(
      { params },
      { params },
      { resource: settings.resourceVictory, tower: settings.towerVictory }
    ),
    gameView,
    new RandomBot()
  );
  game.init();

  return game;
}

function restartGame(): void {
  game?.destroy();
  game = createGame();
}

function loadSettings(): Preset {
  const preset = localStorage.getItem('settings');

  if (!preset) {
    return getPreset('Default')!;
  }

  try {
    return validatePreset(JSON.parse(preset));
  } catch (err) {
    return getPreset('Default')!;
  }
}

function saveSettings(settings: Readonly<Preset>): void {
  localStorage.setItem('settings', JSON.stringify(settings));
}
