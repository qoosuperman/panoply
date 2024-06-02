import { Card } from "../card";
import { MonetaryValue } from "../monetaryvalue";
import { Noble } from "../noble";
import { GameEvent } from "./gameevent";

export class GameCreated extends GameEvent {
  playersCount: number;
  tokens: MonetaryValue;
  nobles: Noble[];
  cards: Card[];

  constructor(playersCount: number, tokens: MonetaryValue, nobles: Noble[], cards: Card[]) {
    super();
    this.playersCount = playersCount;
    this.tokens = tokens;
    this.nobles = nobles;
    this.cards = cards;
  }
}
