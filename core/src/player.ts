import { Card } from "./card";
import { MonetaryValue } from "./monetaryvalue";
import { Noble } from "./noble";

export class Player {
  tokens: MonetaryValue = new MonetaryValue();
  cards: Card[] = [];
  nobles: Noble[] = [];
  reservedCards: Card[] = [];

  addReservedCard(card: Card) {
    this.reservedCards.push(card);
  }

  get ableToReserveCard(): boolean {
    return this.reservedCards.length < 3;
  }
  /**
   * The combined purchasing power of all owned cards.
   *
   * TODO: Consider caching this and updating on card change if performance becomes an issue.
   */
  get cardPurchasingPower(): MonetaryValue {
    return this.cards.reduce((value, card) => value.add(card.purchasingPower), new MonetaryValue());
  }
}
