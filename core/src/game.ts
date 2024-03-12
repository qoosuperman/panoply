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
    event.nobles.forEach((noble) => {
      this.nobles.push(noble);
    });

    const deck1 = new Deck();
    const deck2 = new Deck();
    const deck3 = new Deck();
    // TODO: deck shuffle logic
    event.cards.forEach((card) => {
      switch (card.level) {
        case 1:
          deck1.add(card);
          break;
        case 2:
          deck2.add(card);
          break;
        case 3:
          deck3.add(card);
          break;
      }
    });
    this.decks = [deck1, deck2, deck3];
    this.faceUpCards = [deck1.first(), deck2.first(), deck3.first()];
  }
}
