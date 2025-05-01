import {
  GameChanges,
  GameData,
  IGameModel,
  PlayerParams,
  VictoryConditions,
} from '@game';
import { Deck } from './deck';
import { Player } from './player';
import { VictoryChecker } from './victory-checker';

export class GameModel implements IGameModel {
  static create(
    params: Partial<PlayerParams>,
    victoryConditions: VictoryConditions,
    handSize: number = 6
  ): GameModel {
    const deck = new Deck();
    const victoryChecker = new VictoryChecker(victoryConditions);
    const _player1 = new Player(
      {
        ...params,
        isActive: true,
        isWinner: false,
        isDiscardMode: false,
      },
      deck.getRandomCards(handSize)
    );
    const _player2 = new Player(
      {
        ...params,
        isActive: false,
        isWinner: false,
        isDiscardMode: false,
      },
      deck.getRandomCards(handSize)
    );

    return new GameModel(_player1, _player2, deck, victoryChecker);
  }

  private players: [Player, Player];

  private deck: Deck;

  private victoryChecker: VictoryChecker;

  private lastUsedCardIndex: number | null = null;

  constructor(
    player1: Player,
    player2: Player,
    deck: Deck,
    victoryChecker: VictoryChecker
  ) {
    this.players = [player1, player2];
    this.deck = deck;
    this.victoryChecker = victoryChecker;
    this.produceResources();
  }

  private get player(): Player {
    return this.players.find((p) => p.isActive)!;
  }

  private get enemy(): Player {
    return this.players.find((p) => !p.isActive)!;
  }

  useCard(cardIndex: number, isDiscarded: boolean = false): GameChanges {
    if (this.hasWinner()) {
      throw new Error('The game is ended');
    }

    const { player, enemy } = this;

    if (!player.hasCard(cardIndex)) {
      throw new Error(`Invalid card index: ${cardIndex}`);
    }

    const card = player.getCard(cardIndex);
    const isDiscardedCard = player.isDiscardMode || isDiscarded;

    if (isDiscardedCard && card.isUndiscardable) {
      throw new Error(`"${card.name}" can't be discarded`);
    }

    const player1Copy = this.players[0].clone();
    const player2Copy = this.players[1].clone();

    if (isDiscardedCard) {
      if (!player.isDiscardMode) {
        player.isActive = false;
        enemy.isActive = true;
      }

      player.isDiscardMode = false;
    } else {
      if (!card.apply(player, enemy)) {
        throw new Error(`"${card.name}" can't be used`);
      }

      this.checkWinner();
    }

    const playerIndex = this.players.indexOf(player);
    const enemyIndex = this.players.indexOf(enemy);
    const changes = {} as GameChanges;

    changes.usedCard = {
      cardIndex,
      playerIndex,
      data: card.getData(),
      isDiscarded: isDiscardedCard,
    };

    changes.params = [
      Player.diff(player1Copy, this.players[0]),
      Player.diff(player2Copy, this.players[1]),
    ];

    const { lastUsedCardIndex } = this;

    if (player.isActive) {
      const newCard = this.deck.getRandomCard(player.getCards());
      player.setCard(cardIndex, newCard);

      changes.newCard = {
        cardIndex,
        playerIndex,
        data: newCard.getData(),
      };
    } else {
      this.lastUsedCardIndex = cardIndex;
    }

    if (enemy.isActive && !this.hasWinner()) {
      const player1Copy = this.players[0].clone();
      const player2Copy = this.players[1].clone();
      this.produceResources();
      this.checkWinner();

      changes.nextRound = {
        params: [
          Player.diff(player1Copy, this.players[0]),
          Player.diff(player2Copy, this.players[1]),
        ],
      };

      if (lastUsedCardIndex != null) {
        const newCard = this.deck.getRandomCard(enemy.getCards());
        enemy.setCard(lastUsedCardIndex, newCard);

        changes.nextRound.newCard = {
          cardIndex: lastUsedCardIndex,
          playerIndex: enemyIndex,
          data: newCard.getData(),
        };
      }
    }

    return changes;
  }

  getData(): GameData {
    return {
      players: [this.players[0].getData(), this.players[1].getData()],
      victoryConditions: this.victoryChecker.getVictoryConditions(),
    };
  }

  private hasWinner(): boolean {
    return this.players[0].isWinner || this.players[1].isWinner;
  }

  private checkWinner(): void {
    const [p1, p2] = this.players;
    p1.isWinner = this.victoryChecker.check(p1, p2);
    p2.isWinner = this.victoryChecker.check(p2, p1);
  }

  private produceResources(): void {
    const { player } = this;
    player.bricks += player.quarries;
    player.gems += player.magic;
    player.recruits += player.dungeons;
  }
}
