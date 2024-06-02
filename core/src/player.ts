import { Card } from "./card";
import { MonetaryValue } from "./monetaryvalue";
import { Noble } from "./noble";

export class Player {
  tokens: MonetaryValue = new MonetaryValue();
  cards: Card[] = [];
  nobles: Noble[] = [];
}
