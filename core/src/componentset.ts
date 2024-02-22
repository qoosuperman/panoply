import { Card } from "./card";
import { Noble } from "./noble";
import { Token } from "./token";

export class ComponentSet {
  cards: Card[];
  nobles: Noble[];
  tokens: Token[];

  constructor(cards: Card[], nobles: Noble[], tokens: Token[]) {
    this.cards = cards;
    this.nobles = nobles;
    this.tokens = tokens;
  }
}
