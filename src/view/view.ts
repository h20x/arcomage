import { AudioPlayer, Sound } from '@audio';
import {
  CardData,
  GameChanges,
  GameData,
  GameEvent,
  GameEventType,
  IGameView,
  NewCard,
  ParamPair,
  Settings,
} from '@game';
import { Publisher, Subscriber, UnsubscribeFn } from '@lib';
import { Command, CommandQueue } from './command';
import './components/card/card';
import { Card } from './components/card/card';
import './components/controls/controls';
import { Controls } from './components/controls/controls';
import './components/deck/deck';
import { Deck } from './components/deck/deck';
import './components/field/field';
import { Field } from './components/field/field';
import './components/hand/hand';
import { Hand } from './components/hand/hand';
import { Modal } from './components/modal/modal';
import './components/pile/pile';
import { Pile } from './components/pile/pile';
import './components/resource/resource';
import { Resource } from './components/resource/resource';
import { SettingsComponent } from './components/settings/settings';
import './components/tower/tower';
import { Tower } from './components/tower/tower';
import './components/wall/wall';
import { Wall } from './components/wall/wall';
import { Player } from './player';
import './view.css';
import html from './view.html';

function addCard(view: GameView, { data, cardIndex }: NewCard): Command {
  return {
    execute() {
      return view.addCard(data, cardIndex);
    },
  };
}

function useCard(
  view: GameView,
  index: number,
  isDiscarded: boolean,
  data?: CardData
): Command {
  return {
    execute() {
      return view.useCard(index, isDiscarded, data);
    },
  };
}

function dropUsedCard(view: GameView): Command {
  return {
    execute() {
      return view.dropUsedCard();
    },
  };
}

function wait(time: number): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
      });
    },
  };
}

function applyParams(
  view: GameView,
  params: ParamPair,
  silent?: boolean
): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        view.applyParams(params, silent);
        resolve();
      });
    },
  };
}

function startNewRound(view: GameView): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        view.startNewRound();
        resolve();
      });
    },
  };
}

function enableDiscardMode(view: GameView): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        view.enableDiscardMode();
        resolve();
      });
    },
  };
}

function lock(view: GameView): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        view.lock();
        resolve();
      });
    },
  };
}

function unlock(view: GameView): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        view.unlock();
        resolve();
      });
    },
  };
}

function endGame(view: GameView, params: ParamPair): Command {
  return {
    execute() {
      return new Promise((resolve) => {
        view.endGame(params);
        resolve();
      });
    },
  };
}

export class GameView extends HTMLElement implements IGameView {
  static create(data: GameData, settings: Settings): GameView {
    return new GameView(data, settings);
  }

  private player!: Player;

  private enemy!: Player;

  private deck!: Deck;

  private pile!: Pile;

  private field!: Field;

  private queue: CommandQueue = new CommandQueue();

  private eventEmitter: Publisher<GameEvent> = new Publisher();

  private isLocked: boolean = false;

  private isNewRound: boolean = false;

  private isDiscardMode: boolean = false;

  private get activePlayer(): Player {
    return this.player.isActive() ? this.player : this.enemy;
  }

  private get inactivePlayer(): Player {
    return this.player.isActive() ? this.enemy : this.player;
  }

  constructor(private gameData: GameData, private settings: Settings) {
    super();
  }

  init(): void {
    AudioPlayer.mute(this.settings.isMuted);
    this.createHTML();
    this.appendToDOM();
    this.initControls();
    this.createPlayers();
    this.disableContextMenu();
    this.animateLastCard();
  }

  destroy(): void {
    this.queue.clear();
    this.eventEmitter.unsubscribeAll();
    this.remove();
  }

  subscribe(sub: Subscriber<GameEvent>): UnsubscribeFn {
    return this.eventEmitter.subscribe(sub);
  }

  update(data: GameChanges): void {
    this.queue.add(lock(this));

    const { usedCard } = data;
    const isEnemyCard = usedCard.playerIndex === 1;

    if (isEnemyCard) {
      this.queue.add(
        useCard(this, usedCard.cardIndex, usedCard.isDiscarded, usedCard.data)
      );
    }

    const { params, newCard } = data;
    const [player, enemy] = params;
    const [cost, res] = usedCard.data.cost;

    if (isEnemyCard) {
      this.queue.add(
        applyParams(
          this,
          [player, { ...enemy, [res]: enemy[res]! + cost }],
          false
        )
      );
      this.queue.add(applyParams(this, [{}, { [res]: enemy[res] }]));
    } else {
      this.queue.add(
        applyParams(
          this,
          [{ ...player, [res]: player[res]! + cost }, enemy],
          false
        )
      );
      this.queue.add(applyParams(this, [{ [res]: player[res] }, {}]));
    }

    if (player.isWinner || enemy.isWinner) {
      this.queue.add(endGame(this, params));

      return;
    }

    if (player.isDiscardMode || enemy.isDiscardMode) {
      this.queue.add(enableDiscardMode(this));
      this.queue.add(addCard(this, newCard!));
      this.queue.add(dropUsedCard(this));
    } else {
      if (!usedCard.isDiscarded) {
        this.queue.add(wait(200));
        this.queue.add(dropUsedCard(this));
      }

      if (newCard) {
        this.queue.add(addCard(this, newCard));
      }
    }

    const { nextRound } = data;

    if (nextRound) {
      const { params, newCard } = nextRound;

      this.queue.add(startNewRound(this));
      this.queue.add(applyParams(this, params));

      if (newCard) {
        this.queue.add(addCard(this, newCard));
      }

      const [player, enemy] = params;

      if (player.isWinner || enemy.isWinner) {
        this.queue.add(endGame(this, params));

        return;
      }
    }

    this.queue.add(unlock(this));
  }

  applyParams(
    [playerParams, enemyParams]: ParamPair,
    silent: boolean = true
  ): void {
    this.player.update(playerParams, silent);
    this.enemy.update(enemyParams, silent);
  }

  useCard(
    index: number,
    isDiscarded: boolean = false,
    replace?: CardData
  ): Promise<void> {
    let card = this.activePlayer.getCard(index);

    if (!card) {
      return Promise.resolve();
    }

    this.disableDiscardMode();

    if (replace) {
      card.remove();
      card = new Card(replace);
      this.activePlayer.addCard(card, index);
    }

    if (this.isNewRound) {
      this.isNewRound = false;
      this.clearPile();
    }

    AudioPlayer.play(Sound.Card);

    if (isDiscarded) {
      card.markAsDiscarded();

      if (this.isFullPile()) {
        this.clearPile();
      }

      return card.moveTo(this.pile);
    }

    return card.moveTo(this.field);
  }

  addCard(data: Card | CardData | null, index: number): Promise<void> {
    const card = data instanceof Card ? data : new Card(data);
    this.deck.addCard(card);
    AudioPlayer.play(Sound.Card);

    return card.moveTo({
      addCard: () => this.activePlayer.addCard(card, index),
    });
  }

  dropUsedCard(): Promise<void> {
    const card = this.field.getCard();

    if (!card) {
      return Promise.resolve();
    }

    card.markAsPlayed();

    if (this.isFullPile()) {
      this.clearPile();
    }

    return card.moveTo(this.pile);
  }

  startNewRound(): void {
    this.isNewRound = true;
    this.activePlayer.showCards();
    this.inactivePlayer.hideCards();
  }

  lock(): void {
    this.isLocked = true;
  }

  unlock(): void {
    this.isLocked = false;
  }

  enableDiscardMode(): void {
    this.isDiscardMode = true;
    this.classList.add('game--discard-mode');
  }

  disableDiscardMode(): void {
    this.isDiscardMode = false;
    this.classList.remove('game--discard-mode');
  }

  endGame([player, enemy]: ParamPair): void {
    let content, cssClass;

    if (player.isWinner && enemy.isWinner) {
      content = 'Draw';
      cssClass = 'draw-modal';
    } else if (player.isWinner) {
      content = 'You Won!';
      cssClass = 'victory-modal';
    } else {
      content = 'You Lost';
      cssClass = 'defeat-modal';
    }

    Modal.open({ content, cssClass, hideActions: true }).subscribe(() =>
      this.eventEmitter.notify({ type: GameEventType.Restart })
    );
  }

  private appendToDOM(): void {
    document.getElementById('game')!.append(this);
  }

  private createHTML(): void {
    this.classList.add('game');
    this.innerHTML = html;
    this.deck = this.querySelector('.game__deck')!;
    this.pile = this.querySelector('.game__pile')!;
    this.field = this.querySelector('.game__field')!;
  }

  private initControls(): void {
    const controls = this.querySelector('.game__controls')! as Controls;

    controls.onRestart(() => {
      if (!Modal.isOpen()) {
        Modal.open({
          content: 'Restart the game?',
          cssClass: 'restart-modal',
        }).subscribe((ok) => {
          ok && this.eventEmitter.notify({ type: GameEventType.Restart });
        });
      }
    });

    controls.onFullScreen(() => {
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
    });

    controls.onSettings(() => {
      if (!Modal.isOpen()) {
        const settingsCmp = new SettingsComponent();
        settingsCmp.setValues({ ...this.settings.preset });

        Modal.open({ content: settingsCmp, btnSuccessText: 'Apply' }).subscribe(
          (ok) => {
            if (ok) {
              this.settings.preset = settingsCmp.getValues();
              this.eventEmitter.notify({
                type: GameEventType.Settings,
                settings: this.settings,
              });
              this.eventEmitter.notify({ type: GameEventType.Restart });
            }
          }
        );
      }
    });

    let { isMuted } = this.settings;
    controls.checkMuteBtn(isMuted);

    controls.onMute(() => {
      isMuted = !isMuted;
      AudioPlayer.mute(isMuted);
      controls.checkMuteBtn(isMuted);
      this.settings.isMuted = isMuted;
      this.eventEmitter.notify({
        type: GameEventType.Settings,
        settings: this.settings,
      });
    });
  }

  private createPlayers() {
    const {
      players: [player, enemy],
      victoryConditions,
    } = this.gameData;

    this.player = new Player({
      params: player.params,
      cards: player.cards,
      maxTowerHeight: victoryConditions.tower,
      bricks: this.querySelector('.player-bricks') as Resource,
      gems: this.querySelector('.player-gems') as Resource,
      recruits: this.querySelector('.player-recruits') as Resource,
      tower: this.querySelector('.player-tower') as Tower,
      wall: this.querySelector('.player-wall') as Wall,
      hand: this.querySelector('.player-hand') as Hand,
    });
    this.player.subscribe((e) => this.handleCard(e));

    this.enemy = new Player({
      params: enemy.params,
      cards: enemy.cards,
      maxTowerHeight: victoryConditions.tower,
      bricks: this.querySelector('.enemy-bricks') as Resource,
      gems: this.querySelector('.enemy-gems') as Resource,
      recruits: this.querySelector('.enemy-recruits') as Resource,
      tower: this.querySelector('.enemy-tower') as Tower,
      wall: this.querySelector('.enemy-wall') as Wall,
      hand: this.querySelector('.enemy-hand') as Hand,
    });
  }

  private disableContextMenu() {
    this.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private clearPile(): void {
    this.pile.forEachCard((card) => {
      card.moveTo(this.deck, { fadeOut: true }).then(() => card.remove());
    });
  }

  private isFullPile(): boolean {
    return this.pile.size() > 6;
  }

  private handleCard(e: {
    card: Card;
    index: number;
    isDiscarded: boolean;
  }): void {
    const { index, card, isDiscarded: _isDiscarded } = e;
    const isDiscarded = this.isDiscardMode || _isDiscarded;

    switch (true) {
      case this.isLocked:
      case isDiscarded && card.isUndiscardable():
      case !isDiscarded && card.isDisabled():
        return;
    }

    this.lock();
    this.queue.add(useCard(this, index, isDiscarded));
    this.eventEmitter.notify({
      type: GameEventType.Card,
      cardIndex: index,
      isDiscarded,
    });
  }

  private animateLastCard() {
    const index = this.activePlayer.handSize() - 1;
    const lastCard = this.activePlayer.getCard(index)!;
    const view = this;
    lastCard.remove();
    this.lock();
    this.queue.add({
      execute() {
        return view.addCard(lastCard, index);
      },
    });
    this.queue.add(unlock(this));
  }
}

customElements.define('am-game', GameView);
