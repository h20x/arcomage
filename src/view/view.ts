import {
  CardData,
  GameEventType,
  GameChanges,
  GameData,
  GameEvent,
  IGameView,
  ParamPair,
} from '@game';
import { Publisher, Subscriber, UnsubscribeFn } from '@lib';
import {
  addCard,
  applyParams,
  CommandQueue,
  dropUsedCard,
  enableDiscardMode,
  endGame,
  lock,
  startNewRound,
  unlock,
  useCard,
  wait,
} from './command';
import './components/card/card';
import { Card } from './components/card/card';
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
import './components/tower/tower';
import { Tower } from './components/tower/tower';
import './components/wall/wall';
import { Wall } from './components/wall/wall';
import { Player } from './player';
import './view.css';
import html from './view.html';

export class GameView extends HTMLElement implements IGameView {
  private player!: Player;

  private enemy!: Player;

  private deck!: Deck;

  private pile!: Pile;

  private field!: Field;

  private queue: CommandQueue = new CommandQueue(this);

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

  init(data: GameData): void {
    this.createHTML();
    this.addEventListeners();
    this.appendToDOM();
    this.createPlayers(data);
    this.disableContextMenu();
  }

  destroy(): void {
    this.eventEmitter.unsubscribeAll();
    this.remove();
  }

  subscribe(sub: Subscriber<GameEvent>): UnsubscribeFn {
    return this.eventEmitter.subscribe(sub);
  }

  update(data: GameChanges): void {
    this.queue.add(lock());

    const { usedCard } = data;
    const isEnemyCard = usedCard.playerIndex === 1;

    if (isEnemyCard) {
      this.queue.add(
        useCard(usedCard.cardIndex, usedCard.isDiscarded, usedCard.data)
      );
    }

    const { params, newCard } = data;

    this.queue.add(applyParams(params));

    const [player, enemy] = params;

    if (player.isWinner || enemy.isWinner) {
      this.queue.add(endGame(params));

      return;
    }

    if (player.isDiscardMode || enemy.isDiscardMode) {
      this.queue.add(enableDiscardMode());
      this.queue.add(addCard(newCard!));
      this.queue.add(dropUsedCard());
    } else {
      if (!usedCard.isDiscarded) {
        this.queue.add(wait(200));
        this.queue.add(dropUsedCard());
      }

      if (newCard) {
        this.queue.add(addCard(newCard));
      }
    }

    const { nextRound } = data;

    if (nextRound) {
      const { params, newCard } = nextRound;

      this.queue.add(startNewRound());
      this.queue.add(applyParams(params));

      if (newCard) {
        this.queue.add(addCard(newCard));
      }

      const [player, enemy] = params;

      if (player.isWinner || enemy.isWinner) {
        this.queue.add(endGame(params));

        return;
      }
    }

    this.queue.add(unlock());
  }

  applyParams([player, enemy]: ParamPair): void {
    this.player.update(player);
    this.enemy.update(enemy);
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

    if (isDiscarded) {
      card.markAsDiscarded();

      return card.moveTo(this.pile);
    }

    return card.moveTo(this.field);
  }

  addCard(data: CardData | null, index: number): Promise<void> {
    const card = new Card(data);
    this.deck.addCard(card);

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
    if (player.isWinner && enemy.isWinner) {
      alert('Draw!');
    } else if (player.isWinner) {
      alert('You Won!');
    } else {
      alert('You Lost!');
    }
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

  private addEventListeners(): void {
    const btnRestart = this.querySelector('.game__restart-btn') as HTMLElement;
    const btnFullScreen = this.querySelector(
      '.game__fullscreen-btn'
    ) as HTMLElement;

    const addListener = (element: HTMLElement, handler: () => void) => {
      element.addEventListener('pointerup', ({ button }) => {
        button === 0 && handler();
      });
      element.addEventListener('keyup', ({ key }) => {
        'Enter' === key && handler();
      });
    };

    addListener(btnRestart, () => {
      if (!Modal.isOpen()) {
        Modal.open({ content: '<b>Restart the game?</b>' }).subscribe((ok) => {
          ok && this.eventEmitter.notify({ type: GameEventType.Restart });
        });
      }
    });

    addListener(btnFullScreen, () => {
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
      btnFullScreen.classList.toggle('fullscreen', !document.fullscreenElement);
    });
  }

  private createPlayers(data: GameData) {
    const {
      players: [player, enemy],
      victoryConditions,
    } = data;

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
      case !isDiscarded && card.isUnusable():
        return;
    }

    this.lock();
    this.queue.add(useCard(index, isDiscarded));
    this.eventEmitter.notify({
      type: GameEventType.Card,
      cardIndex: index,
      isDiscarded,
    });
  }
}

customElements.define('am-game', GameView);
