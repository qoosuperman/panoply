import test, { beforeEach } from "node:test";
import assert from "assert";
import { MonetaryValue } from "./monetaryvalue";
import { Card } from "./card";
import { Deck } from "./deck";

interface TestContext {
  deck: Deck;
  card3: Card;
}

const context: TestContext = {
  deck: new Deck([]),
  card3: new Card(0, 0, new MonetaryValue(), new MonetaryValue())
};

test("Deck", async (t) => {
  let card1: Card, card2: Card, card3: Card;
  let deck: Deck;

  beforeEach(() => {
    card1 = new Card(1, 0, new MonetaryValue("red", 1), new MonetaryValue().add("blue", 1).add("white", 1).add("red", 4));
    card2 = new Card(1, 1, new MonetaryValue("yellow", 1), new MonetaryValue().add("blue", 1).add("white", 1).add("yelloe", 4));
    card3 = new Card(1, 0, new MonetaryValue("blud", 1), new MonetaryValue().add("blue", 3).add("white", 1).add("red", 2));
    deck = new Deck([card1, card2, card3]);
    context.deck = deck;
    context.card3 = card3;
  });

  await t.test("level", async () => {
    assert.deepStrictEqual(context.deck.level, 1);
  });

  await t.test("size", async () => {
    assert.deepStrictEqual(context.deck.size, 3);
  });

  await t.test("draw", async () => {
    const drawnCard = context.deck.draw();
    assert.deepStrictEqual(drawnCard.level, context.card3.level);
    assert.deepStrictEqual(drawnCard.points, context.card3.points);
    assert.deepStrictEqual(drawnCard.cost, context.card3.cost);
    assert.deepStrictEqual(drawnCard.purchasingPower, context.card3.purchasingPower);
    assert.deepStrictEqual(context.deck.size, 2);
  });
});
