import { Card } from "./card";
import { MonetaryValue } from "./monetaryvalue";
import { Noble } from "./noble";

export class ComponentSet {
  cards: Card[];
  nobles: Noble[];
  tokens: MonetaryValue;

  constructor(cards: Card[], nobles: Noble[], tokens: MonetaryValue) {
    this.cards = cards;
    this.nobles = nobles;
    this.tokens = tokens;
  }
}
