import { MonetaryValue } from "./monetaryvalue";

// represents for the currency / money in the game to purchase cards
export class Token {
  protected _value: MonetaryValue;

  constructor(value: MonetaryValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }
}
