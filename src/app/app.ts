import { RandomBot } from '@ai';
import { GameEventType, Game } from '@game';
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

const params = {
  bricks: 8,
  gems: 8,
  recruits: 8,
  quarries: 2,
  magic: 2,
  dungeons: 2,
  tower: 20,
  wall: 10,
};

let game = createGame();

function createGame(): Game {
  const gameView = new GameView();

  gameView.subscribe((e) => {
    if (GameEventType.Restart === e.type) {
      restartGame();
    }
  });

  game = new Game(
    GameModel.create({ params }, { params }, { resource: 200, tower: 100 }),
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
