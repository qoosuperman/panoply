import { Card } from "./card";

// Deck is a collection of cards, the last card in the array is the top of the deck
// The level should be the same for all cards in the deck
export class Deck {
  protected _cards: Card[];

  constructor();

  constructor(cards: Card[]);

  constructor(cards?: Card[]) {
    if (cards) {
      this._cards = cards;
    } else {
      this._cards = [];
    }
  }

  get level() {
    return this._cards[0].level;
  }

  get size() {
    return this._cards.length;
  }

  get first(): Card {
    return this._cards[this._cards.length - 1];
  }

  draw(n?: number): Card | Card[] | undefined {
    n = n || 1;
    if (this._cards.length < n) {
      return undefined;
    }
    if (n === 1) {
      return this._cards.pop();
    }
    return this._cards.splice(-n, n);
  }

  add(card: Card) {
    this._cards.push(card);
  }
}
