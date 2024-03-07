import { Card } from "./card";
import { MonetaryValue } from "./monetaryvalue";
import { Noble } from "./noble";

export class ComponentSet {
  cards: Card[];
  nobles: Noble[];
  _tokens: MonetaryValue;

  constructor(cards: Card[], nobles: Noble[], tokens: MonetaryValue) {
    this.cards = cards;
    this.nobles = nobles;
    this._tokens = tokens;
  }

  get tokens() {
    return new MonetaryValue(this._tokens.value);
  }
}
