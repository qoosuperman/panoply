import { Card } from "../card";
import { MonetaryValue } from "../monetaryvalue";

export class CardBuilder {
  private card: Card;

  constructor() {
    this.card = new Card(1, 1, new MonetaryValue(), new MonetaryValue());
  }

  withPoints(points: number): CardBuilder {
    this.card.points = points;
    return this;
  }

  withLevel(level: number): CardBuilder {
    this.card.level = level;
    return this;
  }

  withCost(cost: MonetaryValue): CardBuilder {
    this.card.cost = cost;
    return this;
  }

  withPurchasingPower(value: MonetaryValue): CardBuilder {
    this.card.purchasingPower = value;
    return this;
  }

  build(): Card {
    return this.card;
  }
}
