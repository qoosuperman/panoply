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
    let card1: Card
    let card2: Card
    let card3: Card
    let deck: Deck
    function deckSetup() {
      card1 = new Card(
        1,
        0,
        new MonetaryValue("red", 1),
        new MonetaryValue().add("blue", 1).add("white", 1).add("red", 4),
      );
      card2 = new Card(
        1,
        1,
        new MonetaryValue("yellow", 1),
        new MonetaryValue().add("blue", 1).add("white", 1).add("yelloe", 4),
      );
      card3 = new Card(
        1,
        0,
        new MonetaryValue("blud", 1),
        new MonetaryValue().add("blue", 3).add("white", 1).add("red", 2),
      );
      deck = new Deck([card1, card2, card3]);
    }

    await t.test("draw", async (t) => {
      await t.test("without arguments", () => {
        deckSetup()
        const drawnCard = deck.draw() as Card;
        assert.deepStrictEqual(drawnCard.level, card3.level);
        assert.deepStrictEqual(drawnCard.points, card3.points);
        assert.deepStrictEqual(drawnCard.cost, card3.cost);
        assert.deepStrictEqual(drawnCard.purchasingPower, card3.purchasingPower);
        assert.equal(deck.size, 2);
      });

      await t.test("with arguments", () => {
        deckSetup()
        const drawnCards = deck.draw(2) as Card[];
        assert.equal(drawnCards.length, 2);
        assert.deepStrictEqual(drawnCards[0].level, card2.level);
        assert.deepStrictEqual(drawnCards[0].points, card2.points);
        assert.deepStrictEqual(drawnCards[0].cost, card2.cost);
        assert.deepStrictEqual(drawnCards[0].purchasingPower, card2.purchasingPower);
        assert.deepStrictEqual(drawnCards[1].level, card3.level);
        assert.deepStrictEqual(drawnCards[1].points, card3.points);
        assert.deepStrictEqual(drawnCards[1].cost, card3.cost);
        assert.deepStrictEqual(drawnCards[1].purchasingPower, card3.purchasingPower);
        assert.equal(deck.size, 1);
      });
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
      const drawnCard = deck.draw() as Card;
      assert.deepStrictEqual(drawnCard.cost, card2.cost);
    });
  });
});
