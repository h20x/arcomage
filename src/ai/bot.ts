import { CardEvent, GameChanges, GameData, IGameBot } from '@game';
import { Publisher } from '@lib';
import { getCard, Player, VictoryChecker } from '@model';

export abstract class GameBot extends Publisher<CardEvent> implements IGameBot {
  protected player: Player;

  protected enemy: Player;

  protected victoryChecker: VictoryChecker;

  constructor(data: GameData) {
    super();
    const [player, enemy] = data.players;
    const cards = player.cards.map((card) => getCard(card!.name));
    this.player = new Player(player.params, cards);
    this.enemy = new Player(enemy.params);
    this.victoryChecker = new VictoryChecker(data.victoryConditions);
  }

  protected abstract pickCard(): CardEvent;

  init(): void {
    this.tryPickCard();
  }

  destroy(): void {
    this.unsubscribeAll();
  }

  update(changes: GameChanges): void {
    const { params, newCard, nextRound } = changes;

    this.player.setParams(params[0]);
    this.enemy.setParams(params[1]);

    if (newCard?.playerIndex === 0) {
      this.player.setCard(newCard.cardIndex, getCard(newCard.data!.name));
    }

    if (nextRound) {
      this.player.setParams(nextRound.params[0]);
      this.enemy.setParams(nextRound.params[1]);
    }

    if (nextRound?.newCard?.playerIndex === 0) {
      this.player.setCard(
        nextRound.newCard.cardIndex,
        getCard(nextRound.newCard.data!.name)
      );
    }

    this.tryPickCard();
  }

  private tryPickCard(): void {
    if (
      this.player.isActive &&
      this.player.isWinner === false &&
      this.enemy.isWinner === false
    ) {
      queueMicrotask(() => this.notify(this.pickCard()));
    }
  }
}
