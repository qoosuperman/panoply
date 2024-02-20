import { MonetaryValue } from "./monetaryvalue";

export class Card {
  level: number;
  points: number;
  cost: MonetaryValue;
  purchasingPower: MonetaryValue;

  constructor(level: number, points: number, cost: MonetaryValue, purchasingPower: MonetaryValue) {
    this.level = level;
    this.points = points;
    this.cost = cost;
    this.purchasingPower = purchasingPower;
  }
}
