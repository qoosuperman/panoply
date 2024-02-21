import { MonetaryValue } from "./monetaryvalue";

export class Noble {
  points: number;
  cost: MonetaryValue;

  constructor(points: number, cost: MonetaryValue) {
    this.points = points;
    this.cost = cost;
  }
}
