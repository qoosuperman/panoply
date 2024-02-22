import { Card } from "./card";

// Deck is a collection of cards, the last card in the array is the top of the deck
// The level should be the same for all cards in the deck
export class Deck {
  protected _cards: Card[];

  constructor(cards: Card[]) {
    this._cards = cards;
  }

  get level() {
    return this._cards[0].level;
  }

  get size() {
    return this._cards.length;
  }

  draw() {
    return this._cards.pop() as Card;
  }
}
