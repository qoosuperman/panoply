import { Card } from "./card";
import { ComponentSet } from "./componentset";
import { Deck } from "./deck";
import {
  InvalidDrawTokenAmount,
  InvalidGameCommand,
  InvalidMultiDrawToken,
  InvalidOverdrawToken,
  InvalidPlayOrder,
  InvalidTurnCommand,
} from "./error";
import { GameCreatedEvent } from "./events/gamecreatedevent";
import { GameEvent } from "./events/gameevent";
import { TakeTokenEvent } from "./events/taketoken";
import { MonetaryValue } from "./monetaryvalue";
import { Noble } from "./noble";
import { Player } from "./player";
import { TurnState } from "./turnstate";

export default class Game {
  events: GameEvent[] = [];

  players: Player[] = [];

  decks: Deck[] = [];

  faceUpCards: Card[] = [];

  currentPlayerIndex: number = 0;

  tokens: MonetaryValue = new MonetaryValue();

  nobles: Noble[] = [];

  turnState: TurnState = TurnState.Action;

  constructor(events: GameEvent[]);

  constructor(playersCount: number, componentSet: ComponentSet);

  constructor(playersCountOrEvents: number | GameEvent[], componentSet?: ComponentSet) {
    if (Array.isArray(playersCountOrEvents)) {
      this.applyEvents(playersCountOrEvents);
      return;
    }

    if (componentSet) {
      // TODO: validation on cards / nobles / tokens
      const cards = componentSet.cards;
      const tokens = componentSet.tokens;
      const nobles = componentSet.nobles;
      const event = new GameCreatedEvent(playersCountOrEvents, tokens, nobles, cards);

      this.events.push(event);
      this.handleCreatedGameEvent(event);
    }
  }

  applyEvents(events: GameEvent[]) {
    events.forEach((event) => {
      if (event instanceof GameCreatedEvent) {
        this.handleCreatedGameEvent(event);
      } else if (event instanceof TakeTokenEvent) {
        this.handleTakeTokenEvent(event);
      } else {
        throw new Error(`Unknown game event ${event}`);
      }
      this.events.push(event);
    });
  }

  handleCreatedGameEvent(event: GameCreatedEvent) {
    this.players = [...new Array(event.playersCount)].map(() => new Player());
    this.tokens = event.tokens;
    this.nobles = [...event.nobles];

    const decksByLevel = new Map<number, Deck>();
    event.cards.forEach((card) => {
      if (!decksByLevel.has(card.level)) {
        decksByLevel.set(card.level, new Deck());
      }

      const deck = decksByLevel.get(card.level);
      if (deck) {
        deck.add(card);
      }
    });

    this.decks = Array.from(decksByLevel.entries())
      .sort(([levelA], [levelB]) => levelA - levelB)
      .map(([, deck]) => deck);

    this.faceUpCards = this.decks.map((deck) => deck.draw(4)).filter((card) => card !== undefined) as Card[];
  }

  takeTokens(player: number, tokens: MonetaryValue): InvalidGameCommand | undefined {
    // Cannot take an action out of turn
    if (this.currentPlayerIndex !== player) {
      return new InvalidPlayOrder();
    }

    // Cannot take an action when it is not an action phase
    if (this.turnState !== TurnState.Action) {
      return new InvalidTurnCommand();
    }

    // Cannot take more than exists in the bank
    if (!this.tokens.contains(tokens)) {
      return new InvalidOverdrawToken();
    }

    // Cannot draw more than three tokens
    // TODO: Generalize this limit with a RuleSet
    if (tokens.size > 3) {
      return new InvalidDrawTokenAmount();
    }

    // Rules specific for duplicate color draws
    const duplicateColors = tokens.byColor().filter((mv) => mv.size > 1);
    if (duplicateColors.length > 1) {
      // Cannot draw multiple tokens of the same color while also drawing other tokens
      // TODO: Generalize this limit with a RuleSet
      if (tokens.size > 2) {
        return new InvalidDrawTokenAmount();
      }

      // Cannot draw multiple tokens from a pile smaller than four
      // TODO: Generalize this limit with a RuleSet
      for (let monetaryValue of duplicateColors) {
        // TODO: Think about how to make this less awkard.
        const color = monetaryValue.value.keys().next().value;

        if (!this.tokens.contains(new MonetaryValue(color, 4))) {
          return new InvalidMultiDrawToken();
        }
      }
    }

    // TODO: Logic for Gold / "Universal" tokens

    const event = new TakeTokenEvent(player, tokens);

    this.events.push(event);
    this.handleTakeTokenEvent(event);
  }

  handleTakeTokenEvent(event: TakeTokenEvent) {
    const player = this.players[event.player];

    player.tokens = player.tokens.add(event.tokens);
    this.tokens = this.tokens.subtract(event.tokens);

    // TODO: Generalize this limit with a RuleSet
    if (player.tokens.size > 10) {
      this.turnState = TurnState.ReturnTokens;
    } else {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
  }
}
