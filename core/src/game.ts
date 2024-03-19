import { Card } from "./card";
import { ComponentSet } from "./componentset";
import { Deck } from "./deck";
import { GameCreatedEvent } from "./events/gamecreatedevent";
import { GameEvent } from "./events/gameevent";
import { MonetaryValue } from "./monetaryvalue";
import { Noble } from "./noble";
import { Player } from "./player";

export default class Game {
  events: GameEvent[] = [];

  players: Player[] = [];

  decks: Deck[] = [];

  faceUpCards: Card[] = [];

  currentPlayerIndex: number = 0;

  tokens: MonetaryValue = new MonetaryValue();

  nobles: Noble[] = [];

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
      }
      this.events.push(event);
    });
  }

  handleCreatedGameEvent(event: GameCreatedEvent) {
    this.players = new Array(event.playersCount).fill(new Player());
    this.tokens = event.tokens;
    this.nobles = [...event.nobles];

    const decksByLevel = new Map<number, Deck>();
    event.cards.forEach((card) => {
      if (!decksByLevel.has(card.level)) {
        decksByLevel.set(card.level, new Deck())
      }

      const deck = decksByLevel.get(card.level);
      if (deck) {
        deck.add(card);
      }
    });

    this.decks = Array.from(decksByLevel.entries())
             .sort(([levelA, ], [levelB, ]) => levelA - levelB)
             .map(([, deck]) => deck);

    this.faceUpCards = this.decks.map((deck) => deck.draw(4)).filter((card) => card !== undefined) as Card[];
  }
}
