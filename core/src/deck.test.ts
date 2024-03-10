import test from "node:test";
import assert from "assert";
import { MonetaryValue } from "./monetaryvalue";
import { Card } from "./card";
import { Deck } from "./deck";

test("Deck", async (t) => {
  await t.test("instantiate with no arguments", () => {
    const deck = new Deck();
    assert.deepStrictEqual(deck.size, 0);
  });

  await t.test("instantiate with cards", async (t) => {
    const card1 = new Card(
      1,
      0,
      new MonetaryValue("red", 1),
      new MonetaryValue().add("blue", 1).add("white", 1).add("red", 4),
    );
    const card2 = new Card(
      1,
      1,
      new MonetaryValue("yellow", 1),
      new MonetaryValue().add("blue", 1).add("white", 1).add("yelloe", 4),
    );
    const card3 = new Card(
      1,
      0,
      new MonetaryValue("blud", 1),
      new MonetaryValue().add("blue", 3).add("white", 1).add("red", 2),
    );
    const deck = new Deck([card1, card2, card3]);
    const context = { deck, card3 }; // Local context

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

  await t.test("add", async (t) => {
    const card1 = new Card(
      1,
      0,
      new MonetaryValue("red", 1),
      new MonetaryValue().add("blue", 1).add("white", 1).add("red", 4),
    );
    const deck = new Deck([card1]);

    await t.test("add", async () => {
      const card2 = new Card(
        1,
        1,
        new MonetaryValue("yellow", 1),
        new MonetaryValue().add("blue", 1).add("white", 1).add("yelloe", 4),
      );
      deck.add(card2);
      assert.deepStrictEqual(deck.size, 2);
      assert.deepStrictEqual(deck.draw().cost, card2.cost);
    });
  });
});
